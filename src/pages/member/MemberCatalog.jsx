import React, { useState, useEffect, useCallback } from 'react';
import { useTheme } from '../../utils/theme';
import { getEnrichedResources } from '../../data/bookMeta';
import {
  getCirculationRecords,
  saveCirculationRecords,
  addCirculationRecord,
  getCurrentBorrowerName,
  processExpiredLoans,
} from '../../utils/circulation';
import { notifyBookBorrowed } from '../../utils/notifications';
import { isBookPaid, markBookPaid } from '../../utils/payments';
import { PAYMENT_QR_CODE } from '../../config/payment';

const TABS          = ['Browse Books', 'Currently Borrowed'];
const BORROW_LIMIT  = 5;   // max active loans per member

export default function MemberCatalog() {
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  const S = getStyles(isDark);

  const [activeTab,      setActiveTab]      = useState(0);
  const [search,         setSearch]         = useState('');
  const [catFilter,      setCatFilter]      = useState('All');
  const [selectedBook,   setSelectedBook]   = useState(null);
  const [showBorrowForm, setShowBorrowForm] = useState(false);
  const [circulationRecs,setCirculationRecs]= useState([]);
  const [openMenu,         setOpenMenu]         = useState(null);
  const [viewLoan,         setViewLoan]         = useState(null);
  const [confirmReturn,    setConfirmReturn]     = useState(null);
  const [showPaymentModal, setShowPaymentModal]  = useState(false);
  const [successMsg,       setSuccessMsg]        = useState('');

  useEffect(() => {
    setCirculationRecs(processExpiredLoans(getCirculationRecords()));
  }, []);

  const borrowerName = getCurrentBorrowerName();

  const today    = new Date();
  const todayStr = today.toISOString().slice(0, 10);
  const due      = new Date(today);
  due.setDate(due.getDate() + 14);
  const dueDateStr = due.toISOString().slice(0, 10);

  const allBooks   = getEnrichedResources();
  const categories = ['All', ...Array.from(new Set(allBooks.map(b => b.category))).sort()];

  const filteredBooks = allBooks.filter(b => {
    const q = search.toLowerCase();
    const matchSearch = b.title.toLowerCase().includes(q) || b.author.toLowerCase().includes(q) || b.category.toLowerCase().includes(q);
    const matchCat    = catFilter === 'All' || b.category === catFilter;
    return matchSearch && matchCat;
  });

  const userRecs   = circulationRecs.filter(r => r.user === borrowerName);
  const activeRecs = userRecs.filter(r => r.status === 'Borrowed' || r.status === 'Overdue');
  const historyRecs= userRecs.filter(r => r.status === 'Returned');

  const getAvailCopies = useCallback((book) => {
    const borrowed = circulationRecs.filter(
      r => (r.bookId === book.id || r.book === book.title) && (r.status === 'Borrowed' || r.status === 'Overdue')
    ).length;
    return Math.max(0, book.copies - borrowed);
  }, [circulationRecs]);

  const flash = (msg) => {
    setSuccessMsg(msg);
    setTimeout(() => setSuccessMsg(''), 5000);
  };

  const handleBorrow = () => {
    if (!selectedBook) return;

    // Block if member has any overdue books
    const overdueRecs = activeRecs.filter(r => r.status === 'Overdue');
    if (overdueRecs.length > 0) {
      setShowBorrowForm(false);
      setSelectedBook(null);
      flash(`⚠️ You have ${overdueRecs.length} overdue book${overdueRecs.length > 1 ? 's' : ''}. Please return all overdue books before borrowing new ones.`);
      return;
    }

    // Block if borrowing limit reached
    if (activeRecs.length >= BORROW_LIMIT) {
      setShowBorrowForm(false);
      setSelectedBook(null);
      flash(`Borrowing limit reached. You have ${activeRecs.length} of ${BORROW_LIMIT} allowed active loans. Return at least one book before borrowing another.`);
      return;
    }

    const record = {
      id:         Date.now(),
      bookId:     selectedBook.id,
      user:       borrowerName,
      book:       selectedBook.title,
      author:     selectedBook.author,
      link:       selectedBook.link,
      issueDate:  todayStr,
      returnDate: dueDateStr,
      status:     'Borrowed',
    };
    const updated = addCirculationRecord(record);
    setCirculationRecs(updated);
    notifyBookBorrowed(selectedBook.title, dueDateStr);
    setShowBorrowForm(false);
    setSelectedBook(null);
    flash(`"${record.book}" borrowed successfully! Due: ${dueDateStr}`);
    setActiveTab(1);
  };

  const handleMarkReturn = () => {
    if (!confirmReturn) return;
    const updated = circulationRecs.map(r =>
      r.id === confirmReturn.id
        ? { ...r, status: 'Returned', returnDate: new Date().toISOString().slice(0, 10) }
        : r
    );
    saveCirculationRecords(updated);
    setCirculationRecs(updated);
    setConfirmReturn(null);
    flash(`"${confirmReturn.book}" returned successfully.`);
  };

  const closeAll = () => setOpenMenu(null);

  return (
    <div style={{ fontFamily: 'system-ui, sans-serif' }} onClick={closeAll}>

      {/* Header */}
      <div style={{ marginBottom: '24px' }}>
        <h2 style={{ margin: '0 0 4px', fontSize: '22px', fontWeight: '800', color: isDark ? '#f1f5f9' : '#0f172a' }}>Library Catalog</h2>
        <p style={{ margin: 0, fontSize: '14px', color: isDark ? '#94a3b8' : '#64748b' }}>Browse, borrow, and manage all your library books in one place.</p>
      </div>

      {/* Success banner */}
      {successMsg && (
        <div style={S.successBanner}>{successMsg}</div>
      )}

      {/* Tab bar */}
      <div style={S.tabBar}>
        {TABS.map((t, i) => (
          <button
            key={t}
            onClick={() => setActiveTab(i)}
            style={{ ...S.tabBtn, ...(activeTab === i ? S.tabBtnActive : {}) }}
          >
            {t}
            {i === 1 && activeRecs.length > 0 && (
              <span style={S.tabBadge}>{activeRecs.length}</span>
            )}
          </button>
        ))}
      </div>

      {/* ── TAB 0: Browse Books ── */}
      {activeTab === 0 && (
        <div>
          {/* Search + filter row */}
          <div style={{ display: 'flex', gap: '12px', marginBottom: '20px', flexWrap: 'wrap' }}>
            <input
              type="text"
              placeholder="Search by title, author, or category…"
              value={search}
              onChange={e => setSearch(e.target.value)}
              style={S.searchInput}
            />
            <select
              value={catFilter}
              onChange={e => setCatFilter(e.target.value)}
              style={S.catSelect}
            >
              {categories.map(c => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
          </div>

          <p style={{ margin: '0 0 16px', fontSize: '13px', color: '#94a3b8' }}>
            {filteredBooks.length} book{filteredBooks.length !== 1 ? 's' : ''} found
          </p>

          {/* Book grid */}
          <div style={S.grid}>
            {filteredBooks.map(book => {
              const avail = getAvailCopies(book);
              return (
                <div key={book.id} style={S.card}>
                  {/* Cover */}
                  <div style={S.coverWrap}>
                    {book.cover
                      ? <img src={book.cover} alt={book.title} style={S.coverImg} />
                      : <span style={{ fontSize: '40px' }}>📘</span>
                    }
                  </div>

                  <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
                    <h3 style={S.bookTitle}>{book.title}</h3>
                    <p style={S.bookAuthor}>{book.author}</p>

                    <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap', margin: '8px 0 auto' }}>
                      <span style={S.catBadge}>{book.category}</span>
                      <span style={avail > 0 ? S.availBadge : S.unavailBadge}>
                        {avail > 0 ? `${avail} Available` : 'Checked Out'}
                      </span>
                      {book.requiresPayment && (
                        <span style={S.priceBadge}>${book.price?.toFixed(2)}</span>
                      )}
                    </div>

                    <button
                      onClick={() => setSelectedBook(book)}
                      style={{ ...S.detailBtn, marginTop: '14px' }}
                    >
                      View Details
                    </button>
                  </div>
                </div>
              );
            })}

            {filteredBooks.length === 0 && (
              <div style={{ gridColumn: '1/-1', padding: '48px', textAlign: 'center', color: '#94a3b8' }}>
                <p style={{ fontSize: '16px', margin: '0 0 8px', fontWeight: '600' }}>No books found</p>
                <p style={{ fontSize: '14px', margin: 0 }}>Try adjusting your search or category filter.</p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ── TAB 1: Currently Borrowed ── */}
      {activeTab === 1 && (
        <div>
          {/* Active loans */}
          <div style={{ marginBottom: '32px' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '14px', flexWrap: 'wrap', gap: '8px' }}>
              <h3 style={{ margin: 0, fontSize: '16px', fontWeight: '700', color: '#0f172a' }}>Currently Borrowed</h3>
              {/* Borrowing limit indicator */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <div style={{ display: 'flex', gap: '4px' }}>
                  {Array.from({ length: BORROW_LIMIT }).map((_, i) => (
                    <div key={i} style={{ width: '10px', height: '10px', borderRadius: '50%', backgroundColor: i < activeRecs.length ? (activeRecs[i]?.status === 'Overdue' ? '#ef4444' : '#3b82f6') : '#e2e8f0' }} />
                  ))}
                </div>
                <span style={{ fontSize: '12px', fontWeight: '600', color: activeRecs.length >= BORROW_LIMIT ? '#b91c1c' : '#64748b' }}>
                  {activeRecs.length}/{BORROW_LIMIT} loans
                </span>
              </div>
            </div>
            {activeRecs.length === 0 ? (
              <div style={S.emptyState}>
                <p style={{ fontSize: '15px', fontWeight: '600', margin: '0 0 4px' }}>No active loans</p>
                <p style={{ fontSize: '13px', margin: 0, color: '#94a3b8' }}>Browse the catalog to borrow a book.</p>
              </div>
            ) : (
              <div style={S.tableWrap}>
                <table style={S.table}>
                  <thead>
                    <tr style={{ backgroundColor: '#f8fafc', borderBottom: '1px solid #e2e8f0' }}>
                      {['Book Title', 'Issue Date', 'Due Date', 'Status', 'Actions'].map(col => (
                        <th key={col} style={S.th}>{col}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {activeRecs.map((r, i) => {
                      const isOverdue = r.status === 'Overdue';
                      return (
                        <tr key={r.id} style={{ backgroundColor: i % 2 === 0 ? '#fff' : '#f8faff' }}>
                          <td style={S.td}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                              <span style={{ fontSize: '20px' }}>📘</span>
                              <div>
                                <p style={{ margin: 0, fontWeight: '700', color: '#0f172a', fontSize: '14px' }}>{r.book}</p>
                                {r.author && <p style={{ margin: 0, fontSize: '12px', color: '#64748b' }}>{r.author}</p>}
                              </div>
                            </div>
                          </td>
                          <td style={{ ...S.td, color: '#64748b' }}>{r.issueDate || '—'}</td>
                          <td style={{ ...S.td, fontWeight: '700', color: isOverdue ? '#b91c1c' : '#0f172a' }}>{r.returnDate || '—'}</td>
                          <td style={S.td}>
                            <span style={{ ...S.badge, ...(isOverdue ? S.overdueBadge : S.activeBadge) }}>
                              {isOverdue ? 'Overdue' : 'Active Loan'}
                            </span>
                          </td>
                          <td style={S.td}>
                            <div style={{ position: 'relative', display: 'inline-block' }}>
                              <button
                                onClick={e => { e.stopPropagation(); setOpenMenu(openMenu === r.id ? null : r.id); }}
                                style={S.dotBtn}
                                title="Actions"
                              >
                                ⋮
                              </button>
                              {openMenu === r.id && (
                                <div style={S.dropMenu} onClick={e => e.stopPropagation()}>
                                  <button style={S.dropItem} onClick={() => { setViewLoan(r); setOpenMenu(null); }}>
                                    View Details
                                  </button>
                                  <button
                                    style={{ ...S.dropItem, color: '#166534' }}
                                    onClick={() => { setConfirmReturn(r); setOpenMenu(null); }}
                                  >
                                    Mark Return
                                  </button>
                                </div>
                              )}
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
                <div style={S.tableFooter}>{activeRecs.length} active loan{activeRecs.length !== 1 ? 's' : ''}</div>
              </div>
            )}
          </div>

          {/* Borrow history */}
          {historyRecs.length > 0 && (
            <div>
              <h3 style={S.sectionTitle}>Borrow History</h3>
              <div style={S.tableWrap}>
                <table style={S.table}>
                  <thead>
                    <tr style={{ backgroundColor: '#f8fafc', borderBottom: '1px solid #e2e8f0' }}>
                      {['Book Title', 'Borrowed', 'Returned', 'Status'].map(col => (
                        <th key={col} style={S.th}>{col}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {historyRecs.map((r, i) => (
                      <tr key={r.id} style={{ backgroundColor: i % 2 === 0 ? '#fff' : '#f8faff' }}>
                        <td style={S.td}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                            <span style={{ fontSize: '20px' }}>📗</span>
                            <div>
                              <p style={{ margin: 0, fontWeight: '700', color: '#0f172a', fontSize: '14px' }}>{r.book}</p>
                              {r.author && <p style={{ margin: 0, fontSize: '12px', color: '#64748b' }}>{r.author}</p>}
                            </div>
                          </div>
                        </td>
                        <td style={{ ...S.td, color: '#64748b' }}>{r.issueDate || '—'}</td>
                        <td style={{ ...S.td, color: '#64748b' }}>{r.returnDate || '—'}</td>
                        <td style={S.td}>
                          <span style={{ ...S.badge, ...S.returnedBadge }}>Returned</span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                <div style={S.tableFooter}>{historyRecs.length} returned book{historyRecs.length !== 1 ? 's' : ''}</div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* ── Book Detail Modal ── */}
      {selectedBook && !showBorrowForm && !showPaymentModal && (
        <div style={S.overlay} onClick={() => setSelectedBook(null)}>
          <div style={{ ...S.modal, maxWidth: '640px' }} onClick={e => e.stopPropagation()}>
            <button onClick={() => setSelectedBook(null)} style={S.closeBtn}>✕</button>

            <div style={{ display: 'flex', gap: '24px', flexWrap: 'wrap' }}>
              {/* Cover */}
              <div style={{ ...S.modalCover, flexShrink: 0 }}>
                {selectedBook.cover
                  ? <img src={selectedBook.cover} alt={selectedBook.title} style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '8px' }} />
                  : <span style={{ fontSize: '52px' }}>📘</span>
                }
              </div>

              {/* Info */}
              <div style={{ flex: 1, minWidth: '200px' }}>
                <h3 style={{ margin: '0 0 4px', fontSize: '20px', fontWeight: '800', color: '#0f172a', lineHeight: 1.3 }}>
                  {selectedBook.title}
                </h3>
                <p style={{ margin: '0 0 12px', fontSize: '14px', color: '#475569', fontWeight: '600' }}>
                  {selectedBook.author}
                </p>

                <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginBottom: '16px' }}>
                  <span style={S.catBadge}>{selectedBook.category}</span>
                  {(() => {
                    const avail = getAvailCopies(selectedBook);
                    return (
                      <span style={avail > 0 ? S.availBadge : S.unavailBadge}>
                        {avail > 0 ? `${avail} of ${selectedBook.copies} available` : 'All copies checked out'}
                      </span>
                    );
                  })()}
                  {selectedBook.requiresPayment && (
                    <span style={S.priceBadge}>Paid · ${selectedBook.price?.toFixed(2)}</span>
                  )}
                </div>

                {[
                  { label: 'ISBN',      val: selectedBook.isbn },
                  { label: 'Publisher', val: selectedBook.publisher },
                  { label: 'Type',      val: selectedBook.type },
                ].map(row => (
                  <div key={row.label} style={{ display: 'flex', gap: '8px', marginBottom: '6px', alignItems: 'baseline' }}>
                    <span style={{ fontSize: '11px', fontWeight: '700', color: '#94a3b8', textTransform: 'uppercase', width: '72px', flexShrink: 0 }}>
                      {row.label}
                    </span>
                    <span style={{ fontSize: '13px', color: '#334155' }}>{row.val}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Description */}
            <div style={{ marginTop: '20px', paddingTop: '20px', borderTop: '1px solid #f1f5f9' }}>
              <p style={{ margin: '0 0 6px', fontSize: '12px', fontWeight: '700', color: '#94a3b8', textTransform: 'uppercase' }}>Description</p>
              <p style={{ margin: 0, fontSize: '14px', color: '#475569', lineHeight: 1.7 }}>{selectedBook.description}</p>
            </div>

            {/* Action */}
            <div style={{ marginTop: '24px', display: 'flex', gap: '12px', justifyContent: 'flex-end', flexWrap: 'wrap' }}>
              <button onClick={() => setSelectedBook(null)} style={S.ghostBtn}>Close</button>

              {(() => {
                const avail     = getAvailCopies(selectedBook);
                const hasOverdue= activeRecs.some(r => r.status === 'Overdue');
                const atLimit   = activeRecs.length >= BORROW_LIMIT;

                if (hasOverdue) {
                  return (
                    <button disabled style={{ ...S.primaryBtn, opacity: 0.6, cursor: 'not-allowed', backgroundColor: '#b91c1c' }}>
                      ⚠️ Return Overdue Books First
                    </button>
                  );
                }
                if (atLimit) {
                  return (
                    <button disabled style={{ ...S.primaryBtn, opacity: 0.6, cursor: 'not-allowed', backgroundColor: '#64748b' }}>
                      Limit Reached ({activeRecs.length}/{BORROW_LIMIT})
                    </button>
                  );
                }
                if (avail === 0) {
                  return (
                    <button disabled style={{ ...S.primaryBtn, opacity: 0.45, cursor: 'not-allowed', backgroundColor: '#94a3b8' }}>
                      Not Available
                    </button>
                  );
                }
                if (selectedBook.requiresPayment && !isBookPaid(selectedBook.id)) {
                  return (
                    <button
                      onClick={() => setShowPaymentModal(true)}
                      style={{ ...S.primaryBtn, backgroundColor: '#d97706', display: 'flex', alignItems: 'center', gap: '8px' }}
                    >
                      💳 Pay & Borrow · ${selectedBook.price?.toFixed(2)}
                    </button>
                  );
                }
                return (
                  <button onClick={() => setShowBorrowForm(true)} style={S.primaryBtn}>
                    {selectedBook.requiresPayment ? '✅ Paid — Borrow Book' : 'Borrow Book'}
                  </button>
                );
              })()}
            </div>
          </div>
        </div>
      )}

      {/* ── Payment QR Modal ── */}
      {selectedBook && showPaymentModal && (
        <div style={S.overlay} onClick={() => setShowPaymentModal(false)}>
          <div style={{ ...S.modal, maxWidth: '480px' }} onClick={e => e.stopPropagation()}>
            <button onClick={() => setShowPaymentModal(false)} style={S.closeBtn}>✕</button>

            {/* Header */}
            <div style={{ textAlign: 'center', marginBottom: '20px' }}>
              <div style={{ fontSize: '32px', marginBottom: '8px' }}>📖</div>
              <h3 style={{ margin: '0 0 4px', fontSize: '20px', fontWeight: '800', color: '#0f172a' }}>
                Payment Required
              </h3>
              <p style={{ margin: 0, fontSize: '14px', color: '#64748b' }}>
                Scan the QR code below to complete your payment
              </p>
            </div>

            {/* Book info strip */}
            <div style={S.payBookInfo}>
              <span style={{ fontSize: '20px' }}>📘</span>
              <div style={{ flex: 1, minWidth: 0 }}>
                <p style={{ margin: '0 0 2px', fontWeight: '700', color: '#0f172a', fontSize: '14px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                  {selectedBook.title}
                </p>
                <p style={{ margin: 0, fontSize: '12px', color: '#64748b' }}>{selectedBook.author}</p>
              </div>
              <div style={S.payPriceTag}>
                ${selectedBook.price?.toFixed(2)}
              </div>
            </div>

            {/* QR code */}
            <div style={S.qrWrap}>
              <img
                src={PAYMENT_QR_CODE}
                alt="Payment QR Code"
                style={S.qrImg}
                onError={e => { e.target.style.display = 'none'; e.target.nextSibling.style.display = 'flex'; }}
              />
              {/* Fallback if image missing */}
              <div style={{ ...S.qrFallback, display: 'none' }}>
                <span style={{ fontSize: '48px' }}>📱</span>
                <p style={{ margin: '8px 0 0', fontSize: '13px', color: '#64748b', textAlign: 'center' }}>
                  QR code image not found.<br />Place your QR image at <code>public/images/ABA.png</code>
                </p>
              </div>
            </div>

            {/* Instructions */}
            <div style={S.payInstructions}>
              <p style={{ margin: '0 0 10px', fontWeight: '700', fontSize: '13px', color: '#0f172a' }}>
                How to pay:
              </p>
              {[
                '1. Open your banking app (ABA, ACLEDA, or Wing)',
                `2. Scan the QR code above`,
                `3. Enter the amount: $${selectedBook.price?.toFixed(2)}`,
                '4. Complete the transfer and take a screenshot',
                '5. Click "I\'ve Paid" below to unlock the book',
              ].map(step => (
                <p key={step} style={{ margin: '0 0 6px', fontSize: '13px', color: '#475569', lineHeight: 1.5 }}>
                  {step}
                </p>
              ))}
            </div>

            {/* Note */}
            <div style={S.payNote}>
              ⚠️ This is a demo system. Click "I've Paid" to simulate payment confirmation. In production, payment verification would be automatic.
            </div>

            {/* Buttons */}
            <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end', marginTop: '20px' }}>
              <button onClick={() => setShowPaymentModal(false)} style={S.ghostBtn}>
                Cancel
              </button>
              <button
                onClick={() => {
                  markBookPaid(selectedBook.id);
                  setShowPaymentModal(false);
                  setShowBorrowForm(true);
                }}
                style={{ ...S.primaryBtn, backgroundColor: '#16a34a', display: 'flex', alignItems: 'center', gap: '8px' }}
              >
                ✅ I've Paid — Continue to Borrow
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── Borrow Confirmation Modal ── */}
      {selectedBook && showBorrowForm && (
        <div style={S.overlay} onClick={() => { setShowBorrowForm(false); setSelectedBook(null); }}>
          <div style={{ ...S.modal, maxWidth: '460px' }} onClick={e => e.stopPropagation()}>
            <button onClick={() => { setShowBorrowForm(false); setSelectedBook(null); }} style={S.closeBtn}>✕</button>

            <h3 style={{ margin: '0 0 4px', fontSize: '20px', fontWeight: '800', color: '#0f172a' }}>Confirm Borrow</h3>
            <p style={{ margin: '0 0 20px', fontSize: '13px', color: '#64748b' }}>Review the details below before confirming.</p>

            {[
              { label: 'Book Title',  val: selectedBook.title },
              { label: 'Author',      val: selectedBook.author },
              { label: 'Book ID',     val: `#${selectedBook.id}` },
              { label: 'Borrower',    val: borrowerName },
              { label: 'Issue Date',  val: todayStr },
              { label: 'Due Date',    val: dueDateStr },
            ].map(row => (
              <div key={row.label} style={{ display: 'flex', alignItems: 'center', padding: '11px 0', borderBottom: '1px solid #f1f5f9' }}>
                <span style={{ width: '100px', flexShrink: 0, fontSize: '11px', fontWeight: '700', color: '#94a3b8', textTransform: 'uppercase' }}>
                  {row.label}
                </span>
                <span style={{ fontSize: '14px', fontWeight: '600', color: '#0f172a' }}>{row.val}</span>
              </div>
            ))}

            <div style={{ marginTop: '24px', display: 'flex', gap: '12px', justifyContent: 'flex-end' }}>
              <button onClick={() => setShowBorrowForm(false)} style={S.ghostBtn}>Back</button>
              <button onClick={handleBorrow} style={S.primaryBtn}>Confirm Borrow</button>
            </div>
          </div>
        </div>
      )}

      {/* ── Loan Detail Modal ── */}
      {viewLoan && (
        <div style={S.overlay} onClick={() => setViewLoan(null)}>
          <div style={{ ...S.modal, maxWidth: '440px' }} onClick={e => e.stopPropagation()}>
            <button onClick={() => setViewLoan(null)} style={S.closeBtn}>✕</button>
            <h3 style={{ margin: '0 0 4px', fontSize: '20px', fontWeight: '800', color: '#0f172a' }}>Loan Details</h3>
            <p style={{ margin: '0 0 20px', fontSize: '13px', color: '#64748b' }}>Borrowing record information</p>

            {[
              { label: 'Book Title', val: viewLoan.book },
              { label: 'Author',     val: viewLoan.author || '—' },
              { label: 'Borrower',   val: viewLoan.user },
              { label: 'Issue Date', val: viewLoan.issueDate || '—' },
              { label: 'Due Date',   val: viewLoan.returnDate || '—' },
              { label: 'Status',     val: viewLoan.status },
            ].map(row => (
              <div key={row.label} style={{ display: 'flex', alignItems: 'center', padding: '11px 0', borderBottom: '1px solid #f1f5f9' }}>
                <span style={{ width: '100px', flexShrink: 0, fontSize: '11px', fontWeight: '700', color: '#94a3b8', textTransform: 'uppercase' }}>
                  {row.label}
                </span>
                <span style={{ fontSize: '14px', fontWeight: '600', color: '#0f172a' }}>{row.val}</span>
              </div>
            ))}

            <div style={{ marginTop: '20px', textAlign: 'right' }}>
              <button onClick={() => setViewLoan(null)} style={S.ghostBtn}>Close</button>
            </div>
          </div>
        </div>
      )}

      {/* ── Mark Return Confirmation ── */}
      {confirmReturn && (
        <div style={S.overlay} onClick={() => setConfirmReturn(null)}>
          <div style={{ ...S.modal, maxWidth: '400px' }} onClick={e => e.stopPropagation()}>
            <h3 style={{ margin: '0 0 12px', fontSize: '20px', fontWeight: '800', color: '#0f172a' }}>Confirm Return</h3>
            <p style={{ margin: '0 0 8px', fontSize: '14px', color: '#475569' }}>Are you sure you want to return:</p>
            <p style={{ margin: '0 0 24px', fontSize: '15px', fontWeight: '700', color: '#0f172a' }}>
              "{confirmReturn.book}"
            </p>
            <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end' }}>
              <button onClick={() => setConfirmReturn(null)} style={S.ghostBtn}>Cancel</button>
              <button onClick={handleMarkReturn} style={{ ...S.primaryBtn, backgroundColor: '#166534' }}>
                Confirm Return
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function getStyles(isDark) {
  const bg     = isDark ? '#1e293b' : '#fff';
  const border = isDark ? '#334155' : '#e2e8f0';
  const text   = isDark ? '#f1f5f9' : '#0f172a';
  const sub    = isDark ? '#94a3b8' : '#64748b';
  const inputBg= isDark ? '#1F2937' : '#fff';
  const rowOdd = isDark ? '#1e293b' : '#fff';
  const rowEven= isDark ? '#162032' : '#f8faff';
  return {
    tabBar: { display: 'flex', borderBottom: `2px solid ${border}`, marginBottom: '24px', gap: '4px' },
    tabBtn: {
      padding: '10px 20px', fontSize: '14px', fontWeight: '600', color: sub,
      backgroundColor: 'transparent', border: 'none', borderBottom: '2px solid transparent',
      cursor: 'pointer', whiteSpace: 'nowrap', transition: 'all 0.15s',
      display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '-2px',
    },
    tabBtnActive: { color: text, borderBottom: `2px solid ${text}` },
    tabBadge: { backgroundColor: isDark ? '#334155' : '#0f172a', color: '#fff', fontSize: '11px', fontWeight: '700', padding: '2px 7px', borderRadius: '20px', minWidth: '20px', textAlign: 'center' },
    successBanner: { backgroundColor: '#dcfce7', color: '#166534', border: '1px solid #bbf7d0', borderRadius: '10px', padding: '12px 16px', fontSize: '14px', fontWeight: '600', marginBottom: '20px' },
    searchInput: { flex: 1, minWidth: '240px', maxWidth: '420px', padding: '10px 16px', borderRadius: '10px', border: `1px solid ${border}`, fontSize: '14px', outline: 'none', backgroundColor: inputBg, boxSizing: 'border-box', color: text },
    catSelect: { padding: '10px 14px', borderRadius: '10px', border: `1px solid ${border}`, fontSize: '14px', outline: 'none', backgroundColor: inputBg, cursor: 'pointer', color: text },
    grid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: '16px' },
    card: { backgroundColor: bg, border: `1px solid ${border}`, borderRadius: '12px', padding: '16px', display: 'flex', flexDirection: 'column', gap: '12px', boxShadow: '0 1px 4px rgba(0,0,0,0.05)' },
    coverWrap: { width: '100%', height: '120px', backgroundColor: isDark ? '#0f172a' : '#f1f5f9', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden' },
    coverImg: { width: '100%', height: '100%', objectFit: 'cover' },
    bookTitle:  { margin: '0 0 4px', fontSize: '14px', fontWeight: '700', color: text, lineHeight: '1.4' },
    bookAuthor: { margin: 0, fontSize: '12px', color: sub, fontWeight: '500' },
    catBadge:   { backgroundColor: isDark ? 'rgba(59,130,246,0.2)' : '#eff6ff', color: '#3b82f6', padding: '3px 9px', borderRadius: '20px', fontSize: '11px', fontWeight: '700' },
    availBadge: { backgroundColor: '#dcfce7', color: '#166534', padding: '3px 9px', borderRadius: '20px', fontSize: '11px', fontWeight: '700' },
    unavailBadge:{ backgroundColor: '#fee2e2', color: '#b91c1c', padding: '3px 9px', borderRadius: '20px', fontSize: '11px', fontWeight: '700' },
    priceBadge: { backgroundColor: '#fef3c7', color: '#b45309', padding: '3px 9px', borderRadius: '20px', fontSize: '11px', fontWeight: '700' },
    detailBtn: { width: '100%', padding: '9px', backgroundColor: isDark ? '#6366f1' : '#0f172a', color: '#fff', border: 'none', borderRadius: '8px', fontSize: '13px', fontWeight: '700', cursor: 'pointer' },
    sectionTitle: { margin: '0 0 14px', fontSize: '16px', fontWeight: '700', color: text },
    emptyState: { backgroundColor: isDark ? '#1e293b' : '#f8fafc', borderRadius: '12px', border: `1px solid ${border}`, padding: '40px', textAlign: 'center', color: sub },
    tableWrap: { backgroundColor: bg, borderRadius: '12px', border: `1px solid ${border}`, overflow: 'hidden' },
    table:     { width: '100%', borderCollapse: 'collapse', textAlign: 'left' },
    th:        { padding: '12px 18px', fontSize: '11px', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.8px', color: sub, backgroundColor: isDark ? '#0f172a' : '#f8fafc' },
    td:        { padding: '16px 18px', fontSize: '14px', verticalAlign: 'middle', color: text },
    tableFooter:{ padding: '12px 18px', borderTop: `1px solid ${border}`, backgroundColor: isDark ? '#0f172a' : '#f8fafc', fontSize: '12px', color: sub },
    badge:     { display: 'inline-block', padding: '3px 10px', borderRadius: '20px', fontSize: '11px', fontWeight: '700', letterSpacing: '0.4px' },
    activeBadge:  { backgroundColor: 'rgba(59,130,246,0.15)', color: '#3b82f6' },
    overdueBadge: { backgroundColor: 'rgba(185,28,28,0.1)',   color: '#b91c1c' },
    returnedBadge:{ backgroundColor: '#dcfce7', color: '#166534' },
    dotBtn: { background: 'none', border: 'none', cursor: 'pointer', fontSize: '22px', fontWeight: '700', color: sub, padding: '2px 8px', borderRadius: '6px', lineHeight: 1 },
    dropMenu: { position: 'absolute', right: 0, top: '110%', backgroundColor: bg, border: `1px solid ${border}`, borderRadius: '10px', boxShadow: '0 4px 16px rgba(0,0,0,0.2)', zIndex: 100, minWidth: '140px', overflow: 'hidden' },
    dropItem: { display: 'block', width: '100%', padding: '11px 16px', fontSize: '13px', fontWeight: '600', color: text, background: 'none', border: 'none', cursor: 'pointer', textAlign: 'left' },
    overlay: { position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.55)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, padding: '20px' },
    modal: { backgroundColor: bg, borderRadius: '16px', padding: '28px', width: '100%', boxShadow: '0 20px 60px rgba(0,0,0,0.3)', position: 'relative', maxHeight: '90vh', overflowY: 'auto' },
    modalCover: { width: '120px', height: '160px', backgroundColor: isDark ? '#0f172a' : '#f1f5f9', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center' },
    closeBtn: { position: 'absolute', top: '16px', right: '16px', background: 'none', border: 'none', cursor: 'pointer', fontSize: '18px', color: sub, padding: '4px', lineHeight: 1 },
    primaryBtn: { padding: '10px 22px', backgroundColor: isDark ? '#6366f1' : '#0f172a', color: '#fff', border: 'none', borderRadius: '8px', fontSize: '14px', fontWeight: '700', cursor: 'pointer' },
    ghostBtn: { padding: '10px 22px', border: `1px solid ${border}`, borderRadius: '8px', backgroundColor: isDark ? '#1e293b' : '#fff', fontSize: '14px', fontWeight: '600', cursor: 'pointer', color: sub },

    // ── Payment modal styles ────────────────────────────────────────────────
    payBookInfo: { display: 'flex', alignItems: 'center', gap: '12px', backgroundColor: isDark ? '#0f172a' : '#f8fafc', border: `1px solid ${border}`, borderRadius: '10px', padding: '12px 16px', marginBottom: '20px' },
    payPriceTag: { backgroundColor: '#fef3c7', color: '#b45309', fontWeight: '800', fontSize: '16px', padding: '4px 12px', borderRadius: '8px', flexShrink: 0 },
    qrWrap: { display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', backgroundColor: isDark ? '#0f172a' : '#fff', border: `2px solid ${border}`, borderRadius: '12px', padding: '20px', marginBottom: '20px', minHeight: '300px' },
    qrImg: { width: '280px', height: '280px', objectFit: 'contain', borderRadius: '8px', imageRendering: 'crisp-edges' },
    qrFallback: { flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '20px' },
    payInstructions: { backgroundColor: isDark ? '#162032' : '#f0f9ff', border: `1px solid ${isDark ? '#334155' : '#bae6fd'}`, borderRadius: '10px', padding: '14px 16px', marginBottom: '14px' },
    payNote: { backgroundColor: isDark ? '#1a1800' : '#fffbeb', border: `1px solid ${isDark ? '#ca8a04' : '#fcd34d'}`, borderRadius: '8px', padding: '10px 14px', fontSize: '12px', color: isDark ? '#fbbf24' : '#92400e', lineHeight: '1.5' },
    trOdd: { backgroundColor: rowOdd },
    trEven: { backgroundColor: rowEven },
  };
}
