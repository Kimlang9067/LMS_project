import React, { useState, useEffect } from "react";
import Home from "./Home";
import { resources } from "../data/Resources";

export default function Circulation() {
  const [showDropdown, setShowDropdown] = useState(false);
  const user = JSON.parse(localStorage.getItem("userAccount"));
  // ✅ LOAD FROM LOCALSTORAGE
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

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const addRecord = () => {
    if (!form.user || !form.book) return;

    const newRecord = {
      id: Date.now(),
      ...form,
      status: "Borrowed",
    };

    setRecords([...records, newRecord]);

    setForm({
      user: "",
      book: "",
      issueDate: "",
      returnDate: "",
    });
  };

  const markReturned = (id) => {
    setRecords(
      records.map((r) =>
        r.id === id ? { ...r, status: "Returned" } : r
      )
    );
  };

  const deleteRecord = (id) => {
  const updated = records.filter((r) => r.id !== id);
  setRecords(updated);
};

  // ✅ SAVE TO LOCALSTORAGE
  useEffect(() => {
    localStorage.setItem("circulation", JSON.stringify(records));
  }, [records]);

  return (
    <Home isLoggedIn={true} user={user}>
      <div
        style={{
          padding: "40px",
          backgroundColor: "#f5f6f8",
          minHeight: "100%",
        }}
      >
        <h1 style={{ fontSize: "32px", fontWeight: "800" }}>
          Circulation
        </h1>

        <p style={{ color: "#666", marginBottom: "25px" }}>
          Manage borrowed books, issue records, and returns.
        </p>

        {/* FORM */}
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
              gridTemplateColumns:
                "repeat(auto-fill, minmax(220px, 1fr))",
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
                          setShowDropdown(false); // ✅ CLOSE AFTER SELECT
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

          <button
            onClick={addRecord}
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
            Borrow Book
          </button>
        </div>

        {/* CARDS */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns:
              "repeat(auto-fill, minmax(280px, 1fr))",
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
                    backgroundColor:
                      r.status === "Borrowed" ? "#fee2e2" : "#dcfce7",
                    color:
                      r.status === "Borrowed" ? "#dc2626" : "#15803d",
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

              <button
              onClick={() => deleteRecord(r.id)}
              style={{
                marginTop: "15px",
                width: "100%",
                padding: "12px",
                borderRadius: "25px",
                border: "none",
                backgroundColor: "#ff0000",
                color: "#fff",
                fontWeight: "700",
                cursor: "pointer",
              }}
                                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = "#ad1f1f";
                  }}
                  onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = "#fb0000";
                  }}
            >
              Delete History
            </button>
            
            </div>
          ))}
        </div>
      </div>
    </Home>
  );
}