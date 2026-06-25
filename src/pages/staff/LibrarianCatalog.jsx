import React, { useState, useMemo } from 'react';
import { getEnrichedResources } from '../../data/bookMeta';
import { addCirculationRecord, getCirculationRecords, processExpiredLoans } from '../../utils/circulation';
import { PrimaryBtn, GhostBtn } from '../../components/shared/UI';

function today() {
  return new Date().toISOString().slice(0, 10);
}
function dueDefault() {
  const d = new Date();
  d.setDate(d.getDate() + 14);
  return d.toISOString().slice(0, 10);
}

export default function LibrarianCatalog() {
  const [search,      setSearch]      = useState('');
  const [selected,    setSelected]    = useState(null);   // book being checked out
  const [form,        setForm]        = useState({});
  const [success,     setSuccess]     = useState(null);   // success banner text
  const [loans,       setLoans]       = useState(() => processExpiredLoans(getCirculationRecords()));

  const books = useMemo(() =>
    getEnrichedResources().filter(b =>
      b.title.toLowerCase().includes(search.toLowerCase())
    ), [search]);

  const openCheckout = (book) => {
    setSelected(book);
    setForm({ borrower: '', issueDate: today(), dueDate: dueDefault() });
  };

  const closeModal = () => { setSelected(null); setForm({}); };

  const handleSubmit = (e) => {
    e.preventDefault();
    const record = {
      id:         Date.now(),
      book:       selectedTitle,
      user:       form.borrower,
      issueDate:  form.issueDate,
      returnDate: form.dueDate,
      status:     'Borrowed',
    };
    addCirculationRecord(record);
    setLoans(processExpiredLoans(getCirculationRecords()));
    setSuccess(`"${selectedTitle}" checked out to ${form.borrower}.`);
    closeModal();
    setTimeout(() => setSuccess(null), 4000);
  };

  const selectedTitle = selected?.title ?? '';
  const recentLoans = [...loans].reverse().slice(0, 20);

  return (
    <div style={{ fontFamily: 'system-ui, sans-serif' }}>

      {/* Success banner */}
      {success && (
        <div style={s.banner}>{success}</div>
      )}

      {/* Header */}
      <div style={{ marginBottom: '24px' }}>
        <h2 style={{ margin: '0 0 4px', fontSize: '22px', fontWeight: '800', color: '#0f172a' }}>Catalog &amp; Checkout</h2>
        <p style={{ margin: 0, fontSize: '14px', color: '#64748b' }}>Browse books and issue them to borrowers.</p>
      </div>

      {/* Search */}
      <div style={{ marginBottom: '24px' }}>
        <input
          type="text"
          placeholder="Search by title…"
          value={search}
          onChange={e => setSearch(e.target.value)}
          style={s.searchInput}
        />
      </div>

      {/* Book grid */}
      <div style={s.grid}>
        {books.map(book => (
          <div key={book.id} style={s.bookCard}>
            <div style={s.bookCover}>
              {book.cover
                ? <img src={book.cover} alt={book.title} style={s.coverImg} />
                : <span style={{ fontSize: '36px' }}>📘</span>}
            </div>

            <div style={{ flex: 1 }}>
              <h3 style={s.bookTitle}>{book.title}</h3>
              {book.author && <p style={s.bookAuthor}>{book.author}</p>}

              <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginTop: '8px', marginBottom: '14px' }}>
                <span style={s.typeBadge}>{book.type || 'Book'}</span>
                <span style={s.availBadge}>Available</span>
                {book.requiresPayment && (
                  <span style={s.priceBadge}>${book.price?.toFixed(2)}</span>
                )}
              </div>

              <PrimaryBtn onClick={() => openCheckout(book)} style={{ width: '100%' }}>
                Checkout
              </PrimaryBtn>
            </div>
          </div>
        ))}

        {books.length === 0 && (
          <div style={{ gridColumn: '1/-1', padding: '48px', textAlign: 'center', color: '#94a3b8' }}>
            No books match your search.
          </div>
        )}
      </div>

      {/* Recent loans table */}
      {recentLoans.length > 0 && (
        <div style={{ marginTop: '40px' }}>
          <h3 style={{ margin: '0 0 14px', fontSize: '16px', fontWeight: '700', color: '#0f172a' }}>
            Recent Loans ({recentLoans.length})
          </h3>
          <div style={s.tableWrap}>
            <table style={s.table}>
              <thead>
                <tr style={{ backgroundColor: '#f8fafc' }}>
                  {['#', 'Book', 'Borrower', 'Issue Date', 'Due Date', 'Status'].map(col => (
                    <th key={col} style={s.th}>{col}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {recentLoans.map((r, i) => {
                  const isOverdue = r.status === 'Overdue';
                  return (
                    <tr key={r.id} style={{ borderTop: '1px solid #f1f5f9', backgroundColor: i % 2 === 0 ? '#fff' : '#fafafa' }}>
                      <td style={{ ...s.td, color: '#94a3b8', fontSize: '12px' }}>{i + 1}</td>
                      <td style={{ ...s.td, fontWeight: '600', color: '#0f172a' }}>{r.book}</td>
                      <td style={s.td}>{r.user}</td>
                      <td style={{ ...s.td, color: '#64748b' }}>{r.issueDate || '—'}</td>
                      <td style={{ ...s.td, color: isOverdue ? '#b91c1c' : '#64748b', fontWeight: isOverdue ? '700' : '400' }}>
                        {r.returnDate || '—'}
                      </td>
                      <td style={s.td}>
                        <span style={{ ...s.statusBadge, ...(isOverdue ? s.badgeRed : r.status === 'Borrowed' ? s.badgeBlue : s.badgeGreen) }}>
                          {r.status}
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Checkout modal */}
      {selected && (
        <div style={s.overlay} onClick={closeModal}>
          <div style={s.modal} onClick={e => e.stopPropagation()}>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '20px' }}>
              <div>
                <h3 style={{ margin: '0 0 4px', fontSize: '18px', fontWeight: '800', color: '#0f172a' }}>Issue Book</h3>
                <p style={{ margin: 0, fontSize: '13px', color: '#64748b' }}>Fill in borrower details to complete checkout.</p>
              </div>
              <button onClick={closeModal} style={s.closeBtn}>✕</button>
            </div>

            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>

              {/* Book name — auto-filled */}
              <div>
                <label style={s.label}>Book Title</label>
                <input
                  value={selectedTitle}
                  readOnly
                  style={{ ...s.input, backgroundColor: '#f8fafc', color: '#64748b', cursor: 'not-allowed' }}
                />
              </div>

              {/* Borrower name */}
              <div>
                <label style={s.label}>Borrower Name <span style={{ color: '#ef4444' }}>*</span></label>
                <input
                  value={form.borrower || ''}
                  onChange={e => setForm({ ...form, borrower: e.target.value })}
                  placeholder="Enter borrower's full name"
                  required
                  style={s.input}
                  autoFocus
                />
              </div>

              {/* Dates row */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
                <div>
                  <label style={s.label}>Issue Date <span style={{ color: '#ef4444' }}>*</span></label>
                  <input
                    type="date"
                    value={form.issueDate || ''}
                    onChange={e => setForm({ ...form, issueDate: e.target.value })}
                    required
                    style={s.input}
                  />
                </div>
                <div>
                  <label style={s.label}>Due Date <span style={{ color: '#ef4444' }}>*</span></label>
                  <input
                    type="date"
                    value={form.dueDate || ''}
                    onChange={e => setForm({ ...form, dueDate: e.target.value })}
                    required
                    min={form.issueDate || today()}
                    style={s.input}
                  />
                </div>
              </div>

              <div style={{ display: 'flex', gap: '10px', paddingTop: '4px' }}>
                <PrimaryBtn type="submit" style={{ flex: 1 }}>Confirm Checkout</PrimaryBtn>
                <GhostBtn type="button" onClick={closeModal}>Cancel</GhostBtn>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

const s = {
  banner: {
    backgroundColor: '#dcfce7', color: '#166534', border: '1px solid #bbf7d0',
    borderRadius: '8px', padding: '12px 16px', fontSize: '14px', fontWeight: '600',
    marginBottom: '20px',
  },
  searchInput: {
    width: '100%', maxWidth: '440px', padding: '10px 16px',
    border: '1px solid #e2e8f0', borderRadius: '10px',
    fontSize: '14px', outline: 'none', boxSizing: 'border-box',
  },
  grid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
    gap: '16px',
  },
  bookCard: {
    backgroundColor: '#fff', border: '1px solid #e2e8f0', borderRadius: '12px',
    padding: '18px', display: 'flex', flexDirection: 'column', gap: '12px',
    boxShadow: '0 1px 4px rgba(0,0,0,0.05)',
  },
  bookCover: {
    width: '100%', height: '100px', backgroundColor: '#f1f5f9', borderRadius: '8px',
    display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden',
  },
  coverImg: { width: '100%', height: '100%', objectFit: 'cover' },
  bookTitle:  { margin: '0 0 4px', fontSize: '15px', fontWeight: '700', color: '#0f172a', lineHeight: '1.4' },
  bookAuthor: { margin: 0, fontSize: '13px', color: '#64748b' },
  typeBadge:  { backgroundColor: '#eff6ff', color: '#2563eb', padding: '3px 10px', borderRadius: '20px', fontSize: '11px', fontWeight: '700' },
  availBadge: { backgroundColor: '#dcfce7', color: '#166534', padding: '3px 10px', borderRadius: '20px', fontSize: '11px', fontWeight: '700' },
  priceBadge: { backgroundColor: '#fef3c7', color: '#b45309', padding: '3px 10px', borderRadius: '20px', fontSize: '11px', fontWeight: '700' },
  tableWrap: { backgroundColor: '#fff', borderRadius: '10px', border: '1px solid #e2e8f0', overflow: 'auto' },
  table: { width: '100%', borderCollapse: 'collapse', fontSize: '14px' },
  th: { padding: '12px 16px', textAlign: 'left', fontSize: '11px', fontWeight: '700', color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.05em', whiteSpace: 'nowrap' },
  td: { padding: '12px 16px', color: '#334155', verticalAlign: 'middle' },
  statusBadge: { display: 'inline-block', padding: '3px 10px', borderRadius: '20px', fontSize: '11px', fontWeight: '700' },
  badgeBlue:   { backgroundColor: 'rgba(59,130,246,0.1)', color: '#2563eb' },
  badgeGreen:  { backgroundColor: '#dcfce7', color: '#166534' },
  badgeRed:    { backgroundColor: '#fee2e2', color: '#b91c1c' },
  overlay: {
    position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.45)',
    display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000,
  },
  modal: {
    backgroundColor: '#fff', borderRadius: '16px', padding: '28px',
    width: '100%', maxWidth: '480px', boxShadow: '0 20px 60px rgba(0,0,0,0.18)',
    margin: '16px',
  },
  closeBtn: {
    background: 'none', border: 'none', fontSize: '18px', cursor: 'pointer',
    color: '#94a3b8', padding: '4px 8px', borderRadius: '6px',
  },
  label: { display: 'block', fontSize: '12px', fontWeight: '700', color: '#475569', marginBottom: '6px', textTransform: 'uppercase', letterSpacing: '0.4px' },
  input: {
    width: '100%', padding: '10px 14px', border: '1px solid #e2e8f0', borderRadius: '8px',
    fontSize: '14px', outline: 'none', boxSizing: 'border-box',
  },
};
