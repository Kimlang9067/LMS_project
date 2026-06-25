import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import Home from "./Home";
import { getCurrentUser } from "../../utils/auth";
import { getEnrichedResources } from "../../data/bookMeta";
import {
  getCirculationRecords,
  saveCirculationRecords,
  getCurrentBorrowerName,
  processExpiredLoans,
} from "../../utils/circulation";
import { notifyBookBorrowed } from "../../utils/notifications";

export default function Circulation() {
  const location = useLocation();
  const user = getCurrentUser();
  const borrowerName = getCurrentBorrowerName();

  const [records, setRecords] = useState(() =>
    processExpiredLoans(getCirculationRecords())
  );

  const prefillBook = location.state?.bookTitle || "";

  const [form, setForm] = useState({
    book: prefillBook,
    issueDate: "",
    returnDate: "",
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
      alert(
        `This is a premium book! Please process and confirm the $${selectedBookMeta.price.toFixed(2)} payment first.`
      );
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
      status: "Borrowed",
    };

    const updated = [...records, newRecord];
    setRecords(updated);
    saveCirculationRecords(updated);
    notifyBookBorrowed(form.book, returnDate);

    setForm({ book: prefillBook, issueDate: "", returnDate: "" });
    setHasPaidFormBook(false);
    setSelectedBookMeta(null);
  };

  const markReturned = (id) => {
    const updated = records.map((r) =>
      r.id === id
        ? { ...r, status: "Returned", returnDate: new Date().toISOString().slice(0, 10) }
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
    <Home isLoggedIn={true} user={user}>
      <div
        style={{
          padding: "40px",
          backgroundColor: "#f5f6f8",
          minHeight: "100%",
        }}
      >
        <h1 style={{ fontSize: "32px", fontWeight: "800" }}>Circulation</h1>
        <p style={{ color: "#666", marginBottom: "25px" }}>
          Manage borrowed books, issue records, and returns.
        </p>

        <div
          style={{
            backgroundColor: "#fff",
            borderRadius: "16px",
            border: "1px solid #e5e5e5",
            padding: "20px",
            marginBottom: "25px",
          }}
        >
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))",
              gap: "15px",
            }}
          >
            <div>
              <label
                style={{
                  display: "block",
                  fontSize: "11px",
                  fontWeight: "700",
                  color: "#666",
                  marginBottom: "6px",
                  textTransform: "uppercase",
                }}
              >
                Borrower
              </label>
              <input
                value={borrowerName}
                readOnly
                style={{
                  padding: "12px",
                  borderRadius: "12px",
                  border: "1px solid #ddd",
                  width: "100%",
                  boxSizing: "border-box",
                  backgroundColor: "#f5f5f5",
                  color: "#333",
                  fontWeight: "600",
                }}
              />
            </div>

            <div>
              <label
                style={{
                  display: "block",
                  fontSize: "11px",
                  fontWeight: "700",
                  color: "#666",
                  marginBottom: "6px",
                  textTransform: "uppercase",
                }}
              >
                Book Title
              </label>
              <input
                name="book"
                placeholder="Book title"
                value={form.book}
                onChange={handleChange}
                readOnly={bookLocked}
                style={{
                  padding: "12px",
                  borderRadius: "12px",
                  border: "1px solid #ddd",
                  width: "100%",
                  boxSizing: "border-box",
                  backgroundColor: bookLocked ? "#f5f5f5" : "#fff",
                  fontWeight: bookLocked ? "600" : "normal",
                }}
              />
            </div>

            <div>
              <label
                style={{
                  display: "block",
                  fontSize: "11px",
                  fontWeight: "700",
                  color: "#666",
                  marginBottom: "6px",
                  textTransform: "uppercase",
                }}
              >
                Issue Date
              </label>
              <input
                type="date"
                name="issueDate"
                value={form.issueDate}
                onChange={handleChange}
                style={{
                  padding: "12px",
                  borderRadius: "12px",
                  border: "1px solid #ddd",
                  width: "100%",
                  boxSizing: "border-box",
                }}
              />
            </div>

            <div>
              <label
                style={{
                  display: "block",
                  fontSize: "11px",
                  fontWeight: "700",
                  color: "#666",
                  marginBottom: "6px",
                  textTransform: "uppercase",
                }}
              >
                Return Date
              </label>
              <input
                type="date"
                name="returnDate"
                value={form.returnDate}
                onChange={handleChange}
                style={{
                  padding: "12px",
                  borderRadius: "12px",
                  border: "1px solid #ddd",
                  width: "100%",
                  boxSizing: "border-box",
                }}
              />
            </div>
          </div>

          {selectedBookMeta && !hasPaidFormBook && (
            <div
              style={{
                marginTop: "20px",
                padding: "20px",
                backgroundColor: "#fffbeb",
                border: "1px solid #fef3c7",
                borderRadius: "12px",
                textAlign: "center",
              }}
            >
              <h4 style={{ color: "#b45309", marginBottom: "6px", fontWeight: "700" }}>
                Premium Resource: Paid borrow · ${selectedBookMeta.price.toFixed(2)}
              </h4>
              <p style={{ fontSize: "13px", color: "#666", marginBottom: "12px" }}>
                Scan the vendor code below before checking this book out.
              </p>
              <img
                src={selectedBookMeta.qrCode}
                alt="Payment QR Code"
                style={{
                  width: "100%",
                  maxWidth: "380px",
                  height: "auto",
                  objectFit: "contain",
                  borderRadius: "12px",
                  border: "1px solid #e5e5e5",
                  marginBottom: "20px",
                }}
              />
              <br />
              <button
                type="button"
                onClick={() => setHasPaidFormBook(true)}
                style={{
                  padding: "8px 20px",
                  backgroundColor: "#15803d",
                  color: "#fff",
                  border: "none",
                  borderRadius: "15px",
                  fontWeight: "600",
                  cursor: "pointer",
                }}
              >
                Confirm Payment
              </button>
            </div>
          )}

          {selectedBookMeta && hasPaidFormBook && (
            <div
              style={{
                marginTop: "20px",
                padding: "12px",
                backgroundColor: "#dcfce7",
                border: "1px solid #bbf7d0",
                color: "#15803d",
                borderRadius: "12px",
                fontWeight: "600",
                textAlign: "center",
                fontSize: "14px",
              }}
            >
              ✓ Premium Fee Verified (${selectedBookMeta.price.toFixed(2)}) — Entry authorized.
            </div>
          )}

          <button
            onClick={addRecord}
            disabled={isBorrowDisabled}
            style={{
              marginTop: "15px",
              width: "100%",
              padding: "12px",
              borderRadius: "25px",
              border: "none",
              backgroundColor: isBorrowDisabled ? "#ccc" : "#000",
              color: "#fff",
              fontWeight: "700",
              cursor: isBorrowDisabled ? "not-allowed" : "pointer",
            }}
          >
            Borrow Book
          </button>
        </div>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
            gap: "20px",
          }}
        >
          {records.map((r) => (
            <div
              key={r.id}
              style={{
                backgroundColor: "#fff",
                borderRadius: "16px",
                border: "1px solid #e5e5e5",
                padding: "20px",
              }}
            >
              <h3>📘 {r.book}</h3>
              <p>👤 {r.user}</p>
              <p>📅 Issue: {r.issueDate}</p>
              <p>📅 Return: {r.returnDate}</p>

              <div style={{ marginTop: "12px" }}>
                <span
                  style={{
                    padding: "6px 12px",
                    borderRadius: "20px",
                    fontSize: "12px",
                    fontWeight: "700",
                    backgroundColor:
                      r.status === "Borrowed"
                        ? "#fee2e2"
                        : r.status === "Overdue"
                          ? "#fef3c7"
                          : "#dcfce7",
                    color:
                      r.status === "Borrowed"
                        ? "#dc2626"
                        : r.status === "Overdue"
                          ? "#b45309"
                          : "#15803d",
                  }}
                >
                  {r.status}
                </span>
              </div>

              {(r.status === "Borrowed" || r.status === "Overdue") && (
                <button
                  onClick={() => markReturned(r.id)}
                  style={{
                    marginTop: "15px",
                    width: "100%",
                    padding: "12px",
                    borderRadius: "25px",
                    border: "none",
                    backgroundColor: "#000",
                    color: "#fff",
                    fontWeight: "700",
                    cursor: "pointer",
                  }}
                >
                  Mark Returned
                </button>
              )}
            </div>
          ))}
        </div>
      </div>
    </Home>
  );
}
