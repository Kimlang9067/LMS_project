import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { getCurrentUser } from '../../utils/auth';
import { getEnrichedResources } from '../../data/bookMeta';
import {
  getCirculationRecords,
  saveCirculationRecords,
  getCurrentBorrowerName,
  processExpiredLoans,
} from '../../utils/circulation';
import { notifyBookBorrowed } from '../../utils/notifications';
import { PrimaryBtn } from '../../components/shared/UI';

export default function MemberCirculation() {
  const location = useLocation();
  const user = getCurrentUser();
  const borrowerName = getCurrentBorrowerName();

  const [records, setRecords] = useState(() =>
    processExpiredLoans(getCirculationRecords())
  );

  const prefillBook = location.state?.bookTitle || '';

  const [form, setForm] = useState({
    book: prefillBook,
    issueDate: '',
    returnDate: '',
  });

  const [selectedBookMeta, setSelectedBookMeta] = useState(null);
  const [hasPaidFormBook, setHasPaidFormBook] = useState(false);
  const bookLocked = Boolean(prefillBook);

  useEffect(() => {
    const enrichedList = getEnrichedResources();
    const matchedBook = enrichedList.find(
      (b) => b.title.toLowerCase() === form.book.toLowerCase()
    );
    if (matchedBook && matchedBook.requiresPayment) {
      setSelectedBookMeta(matchedBook);
    } else {
      setSelectedBookMeta(null);
      setHasPaidFormBook(false);
    }
  }, [form.book]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const addRecord = () => {
    if (!form.book) return;

    if (selectedBookMeta && !hasPaidFormBook) {
      alert(`This is a premium book! Please process and confirm the $${selectedBookMeta.price.toFixed(2)} payment first.`);
      return;
    }

    const today = new Date();
    const returnDate = form.returnDate
      ? form.returnDate
      : (() => {
          const d = new Date(today);
          d.setDate(d.getDate() + 14);
          return d.toISOString().slice(0, 10);
        })();

    const newRecord = {
      id: Date.now(),
      user: borrowerName,
      book: form.book,
      issueDate: form.issueDate || today.toISOString().slice(0, 10),
      returnDate,
      status: 'Borrowed',
    };

    const updated = [...records, newRecord];
    setRecords(updated);
    saveCirculationRecords(updated);
    notifyBookBorrowed(form.book, returnDate);

    setForm({ book: prefillBook, issueDate: '', returnDate: '' });
    setHasPaidFormBook(false);
    setSelectedBookMeta(null);
  };

  const markReturned = (id) => {
    const updated = records.map((r) =>
      r.id === id
        ? { ...r, status: 'Returned', returnDate: new Date().toISOString().slice(0, 10) }
        : r
    );
    setRecords(updated);
    saveCirculationRecords(updated);
  };

  useEffect(() => {
    saveCirculationRecords(records);
  }, [records]);

  const isBorrowDisabled = !form.book || (selectedBookMeta && !hasPaidFormBook);

  return (
    <div style={{ fontFamily: 'system-ui, sans-serif' }}>

      {/* Header */}
      <div style={{ marginBottom: '24px' }}>
        <h2 style={{ margin: '0 0 4px', fontSize: '22px', fontWeight: '800', color: '#0f172a' }}>My Circulation</h2>
        <p style={{ margin: 0, fontSize: '14px', color: '#64748b' }}>Manage borrowed books, issue records, and returns.</p>
      </div>

      {/* Borrow form card */}
      <div style={S.card}>
        <div style={S.formGrid}>
          <div>
            <label style={S.label}>Borrower</label>
            <input
              value={borrowerName}
              readOnly
              style={{ ...S.input, backgroundColor: '#f8fafc', color: '#64748b', cursor: 'default' }}
            />
          </div>

          <div>
            <label style={S.label}>Book Title</label>
            <input
              name="book"
              placeholder="Book title"
              value={form.book}
              onChange={handleChange}
              readOnly={bookLocked}
              style={{
                ...S.input,
                backgroundColor: bookLocked ? '#f8fafc' : '#fff',
                fontWeight: bookLocked ? '600' : 'normal',
              }}
            />
          </div>

          <div>
            <label style={S.label}>Issue Date</label>
            <input
              type="date"
              name="issueDate"
              value={form.issueDate}
              onChange={handleChange}
              style={S.input}
            />
          </div>

          <div>
            <label style={S.label}>Return Date</label>
            <input
              type="date"
              name="returnDate"
              value={form.returnDate}
              onChange={handleChange}
              style={S.input}
            />
          </div>
        </div>

        {selectedBookMeta && !hasPaidFormBook && (
          <div style={S.paymentBox}>
            <h4 style={{ color: '#b45309', margin: '0 0 6px', fontWeight: '700' }}>
              Premium Resource: Paid borrow · ${selectedBookMeta.price.toFixed(2)}
            </h4>
            <p style={{ fontSize: '13px', color: '#64748b', margin: '0 0 12px' }}>
              Scan the vendor code below before checking this book out.
            </p>
            <img
              src={selectedBookMeta.qrCode}
              alt="Payment QR Code"
              style={S.qrImg}
            />
            <br />
            <button
              type="button"
              onClick={() => setHasPaidFormBook(true)}
              style={S.confirmPayBtn}
            >
              Confirm Payment
            </button>
          </div>
        )}

        {selectedBookMeta && hasPaidFormBook && (
          <div style={S.paidConfirm}>
            ✓ Premium Fee Verified (${selectedBookMeta.price.toFixed(2)}) — Entry authorized.
          </div>
        )}

        <div style={{ marginTop: '16px' }}>
          <PrimaryBtn
            onClick={addRecord}
            style={{
              width: '100%',
              opacity: isBorrowDisabled ? 0.4 : 1,
              cursor: isBorrowDisabled ? 'not-allowed' : 'pointer',
            }}
          >
            Borrow Book
          </PrimaryBtn>
        </div>
      </div>

      {/* Loan cards */}
      {records.length > 0 && (
        <div style={{ marginTop: '24px' }}>
          <h3 style={{ margin: '0 0 14px', fontSize: '16px', fontWeight: '700', color: '#0f172a' }}>
            My Loans ({records.length})
          </h3>
          <div style={S.cardsGrid}>
            {records.map((r) => (
              <div key={r.id} style={S.loanCard}>
                <h3 style={{ margin: '0 0 8px', fontSize: '15px', fontWeight: '700', color: '#0f172a' }}>📘 {r.book}</h3>
                <p style={{ margin: '0 0 4px', fontSize: '13px', color: '#475569' }}>👤 {r.user}</p>
                <p style={{ margin: '0 0 4px', fontSize: '13px', color: '#475569' }}>📅 Issue: {r.issueDate}</p>
                <p style={{ margin: '0 0 12px', fontSize: '13px', color: '#475569' }}>📅 Return: {r.returnDate}</p>

                <span style={{
                  ...S.statusBadge,
                  ...(r.status === 'Borrowed' ? S.badgeRed : r.status === 'Overdue' ? S.badgeAmber : S.badgeGreen),
                }}>
                  {r.status}
                </span>

                {(r.status === 'Borrowed' || r.status === 'Overdue') && (
                  <div style={{ marginTop: '12px' }}>
                    <PrimaryBtn onClick={() => markReturned(r.id)} style={{ width: '100%' }}>
                      Mark Returned
                    </PrimaryBtn>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

const S = {
  card: {
    backgroundColor: '#fff', borderRadius: '12px',
    border: '1px solid #e2e8f0', padding: '20px',
    boxShadow: '0 1px 4px rgba(0,0,0,0.05)',
  },
  formGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))',
    gap: '16px',
  },
  label: {
    display: 'block', fontSize: '11px', fontWeight: '700',
    color: '#64748b', marginBottom: '6px', textTransform: 'uppercase', letterSpacing: '0.4px',
  },
  input: {
    padding: '10px 14px', borderRadius: '8px',
    border: '1px solid #e2e8f0', width: '100%',
    boxSizing: 'border-box', fontSize: '14px', outline: 'none',
  },
  paymentBox: {
    marginTop: '20px', padding: '20px',
    backgroundColor: '#fffbeb', border: '1px solid #fef3c7',
    borderRadius: '10px', textAlign: 'center',
  },
  qrImg: {
    width: '100%', maxWidth: '380px', height: 'auto',
    objectFit: 'contain', borderRadius: '10px',
    border: '1px solid #e2e8f0', marginBottom: '16px',
  },
  confirmPayBtn: {
    padding: '8px 20px', backgroundColor: '#15803d',
    color: '#fff', border: 'none', borderRadius: '8px',
    fontWeight: '600', cursor: 'pointer', fontSize: '14px',
  },
  paidConfirm: {
    marginTop: '16px', padding: '12px 16px',
    backgroundColor: '#dcfce7', border: '1px solid #bbf7d0',
    color: '#15803d', borderRadius: '8px',
    fontWeight: '600', textAlign: 'center', fontSize: '14px',
  },
  cardsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
    gap: '16px',
  },
  loanCard: {
    backgroundColor: '#fff', borderRadius: '12px',
    border: '1px solid #e2e8f0', padding: '18px',
    boxShadow: '0 1px 4px rgba(0,0,0,0.05)',
  },
  statusBadge: {
    display: 'inline-block', padding: '3px 10px',
    borderRadius: '20px', fontSize: '11px', fontWeight: '700',
  },
  badgeRed:   { backgroundColor: '#fee2e2', color: '#dc2626' },
  badgeAmber: { backgroundColor: '#fef3c7', color: '#b45309' },
  badgeGreen: { backgroundColor: '#dcfce7', color: '#15803d' },
};
