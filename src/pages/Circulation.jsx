import React, { useState, useEffect } from "react";
import Home from "./Home";
import { resources } from "../data/Resources";
import { getEnrichedResources } from "../data/bookMeta"; // 🌟 Import enrichment lookup

export default function Circulation() {
  const [showDropdown, setShowDropdown] = useState(false);
  const user = JSON.parse(localStorage.getItem("userAccount"));
  
  // Load local circulation files
  const [records, setRecords] = useState(() => {
    const saved = localStorage.getItem("circulation");
    return saved ? JSON.parse(saved) : [];
  });

  const [form, setForm] = useState({
    user: "",
    book: "",
    issueDate: "",
    returnDate: "",
  });

  // 🌟 Track dynamic payment states within the manual entry form
  const [selectedBookMeta, setSelectedBookMeta] = useState(null);
  const [hasPaidFormBook, setHasPaidFormBook] = useState(false);

  // Check if the book needs payment whenever the text input changes or matches
  useEffect(() => {
    const enrichedList = getEnrichedResources();
    const matchedBook = enrichedList.find(
      (b) => b.title.toLowerCase() === form.book.toLowerCase()
    );

    if (matchedBook && matchedBook.requiresPayment) {
      setSelectedBookMeta(matchedBook);
    } else {
      setSelectedBookMeta(null);
      setHasPaidFormBook(false); // Reset if changed to a free title
    }
  }, [form.book]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const addRecord = () => {
    if (!form.user || !form.book) return;

    // Enforce Payment block check
    if (selectedBookMeta && !hasPaidFormBook) {
      alert(`This is a premium book! Please process and confirm the $${selectedBookMeta.price.toFixed(2)} payment first.`);
      return;
    }

    const newRecord = {
      id: Date.now(),
      user: form.user,
      book: form.book,
      issueDate: form.issueDate || new Date().toLocaleDateString(), // Defaults to today if left blank
      returnDate: "Pending Return", // 🌟 Shows up cleanly in the profile under "Currently Borrowed"
      status: "Borrowed",
    };

    setRecords([...records, newRecord]);

    // Reset Form & Payment Conditions
    setForm({
      user: "",
      book: "",
      issueDate: "",
      returnDate: "",
    });
    setHasPaidFormBook(false);
    setSelectedBookMeta(null);
  };

  const markReturned = (id) => {
    setRecords(
      records.map((r) =>
        r.id === id ? { ...r, status: "Returned", returnDate: new Date().toLocaleDateString() } : r
      )
    );
  };

  const deleteRecord = (id) => {
    const updated = records.filter((r) => r.id !== id);
    setRecords(updated);
  };

  useEffect(() => {
    localStorage.setItem("circulation", JSON.stringify(records));
  }, [records]);

  // Is submission blocked by payment verification rules?
  const isBorrowDisabled = selectedBookMeta && !hasPaidFormBook;

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

        {/* INPUT CONTROL FORM */}
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
            <input
              name="user"
              placeholder="User name"
              value={form.user}
              onChange={handleChange}
              style={{
                padding: "12px",
                borderRadius: "12px",
                border: "1px solid #ddd",
              }}
            />

            <div style={{ position: "relative" }}>
              <input
                name="book"
                placeholder="Book title"
                value={form.book}
                onChange={(e) => {
                  setForm({ ...form, book: e.target.value });
                  setShowDropdown(true);
                }}
                onFocus={() => setShowDropdown(true)}
                style={{
                  padding: "12px",
                  borderRadius: "12px",
                  border: "1px solid #ddd",
                  width: "91.5%",
                }}
              />

              {showDropdown && form.book && (
                <div
                  style={{
                    position: "absolute",
                    top: "45px",
                    left: 0,
                    right: 0,
                    maxHeight: "200px",
                    overflowY: "auto",
                    backgroundColor: "#fff",
                    border: "1px solid #ddd",
                    borderRadius: "10px",
                    zIndex: 999,
                  }}
                >
                  {resources
                    .filter((b) =>
                      b.title.toLowerCase().includes(form.book.toLowerCase())
                    )
                    .slice(0, 8)
                    .map((b) => (
                      <div
                        key={b.id}
                        onClick={() => {
                          setForm({ ...form, book: b.title });
                          setShowDropdown(false);
                        }}
                        style={{
                          padding: "10px",
                          cursor: "pointer",
                        }}
                      >
                        📘 {b.title}
                      </div>
                    ))}
                </div>
              )}
            </div>

            <input
              type="date"
              name="issueDate"
              value={form.issueDate}
              onChange={handleChange}
              style={{
                padding: "12px",
                borderRadius: "12px",
                border: "1px solid #ddd",
              }}
            />

            <input
              type="date"
              name="returnDate"
              value={form.returnDate}
              onChange={handleChange}
              style={{
                padding: "12px",
                borderRadius: "12px",
                border: "1px solid #ddd",
              }}
            />
          </div>

          {/* 🌟 DYNAMIC QR CODE DISPLAY ZONE FOR PREMIUM ENTRIES */}
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
                Premium Resource Flagged: Paid borrow · ${selectedBookMeta.price.toFixed(2)}
              </h4>
              <p style={{ fontSize: "13px", color: "#666", marginBottom: "12px" }}>
                Scan the vendor code below before checking this book out to history.
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
                      marginBottom: "50px",
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

          {/* 🌟 PAYMENT NOTIFICATION FEEDBACK */}
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
            onMouseEnter={(e) => {
              if (!isBorrowDisabled) e.currentTarget.style.backgroundColor = "#8c8c8c";
            }}
            onMouseLeave={(e) => {
              if (!isBorrowDisabled) e.currentTarget.style.backgroundColor = "#000000";
            }}
          >
            Borrow Book
          </button>
        </div>

        {/* LOG RECORD DISPLAY CARDS */}
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
                disabled: "flex",
              }}
            >
              <h3>📘 Book title: {r.book}</h3>
              <p>👤 User Name: {r.user}</p>
              <p>📅 Issue: {r.issueDate}</p>
              <p>📅 Return: {r.returnDate}</p>

              <div style={{ marginTop: "12px" }}>
                <span
                  style={{
                    padding: "6px 12px",
                    borderRadius: "20px",
                    fontSize: "12px",
                    fontWeight: "700",
                    backgroundColor: r.status === "Borrowed" ? "#fee2e2" : "#dcfce7",
                    color: r.status === "Borrowed" ? "#dc2626" : "#15803d",
                  }}
                >
                  {r.status}
                </span>
              </div>

              {r.status === "Borrowed" && (
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
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = "#8c8c8c";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = "#000000";
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