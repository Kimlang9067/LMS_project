import React, { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Home from "./Home";
import { getBookById } from "../data/bookMeta";
import { isBookPaid, markBookPaid } from "../utils/payments";

export default function BookDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("userAccount"));
  
  // Safely grab the book ensuring ID format uniformity
  const book = getBookById(id);

  // Ensure we check using a parsed number to match tracking utilities safely
  const [paid, setPaid] = useState(() =>
    book ? isBookPaid(Number(book.id)) : false
  );
  const [borrowMessage, setBorrowMessage] = useState("");
  const [borrowed, setBorrowed] = useState(false);

  if (!book) {
    return (
      <Home isLoggedIn={true} user={user}>
        <div style={{ padding: "40px", backgroundColor: "#f5f6f8", minHeight: "100%" }}>
          <h1 style={{ fontSize: "28px", fontWeight: "800" }}>Book not found</h1>
          <div
            style={{
              display: "inline-block",
              padding: "12px",
              borderRadius: "12px",
              backgroundColor: "#fff",
              border: "1px solid #e5e5e5",
              boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
              marginBottom: "20px",
            }}
          >
            <button
              onClick={() => navigate("/catalog")}
              style={{
                ...btnStyle("#000"),
                transition: "0.2s ease",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = "#333";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = "#000";
              }}
            >
              ← Back to Catalog
            </button>
          </div>
        </div>
      </Home>
    );
  }

  const canBorrow = book.requiresPayment ? paid : true;

  const handleConfirmPayment = () => {
    markBookPaid(Number(book.id));
    setPaid(true);
  };

  const handleBorrow = () => {
    if (!canBorrow) return;

    const saved = localStorage.getItem("circulation");
    const records = saved ? JSON.parse(saved) : [];
    const borrower = user?.fullName || user?.username || "Guest";

    const today = new Date();
    const returnDate = new Date(today);
    returnDate.setDate(returnDate.getDate() + 14);

    records.push({
      id: Date.now(),
      user: borrower,
      book: book.title,
      link: book.link,
      issueDate: today.toISOString().slice(0, 10),
      returnDate: returnDate.toISOString().slice(0, 10),
      status: "Borrowed",
    });

    localStorage.setItem("circulation", JSON.stringify(records));
    setBorrowMessage("Book borrowed successfully! Check Circulation for your record.");
    setBorrowed(true);
  };

  return (
    <Home isLoggedIn={true} user={user}>
      <div
        style={{
          padding: "40px",
          backgroundColor: "#f5f6f8",
          minHeight: "100%",
        }}
      >
        <button
          onClick={() => navigate("/catalog")}
          style={{
            background: "none",
            border: "none",
            color: "#666",
            cursor: "pointer",
            marginBottom: "20px",
            fontSize: "14px",
            fontWeight: "600",
          }}
        >
          ← Back to Catalog
        </button>

        <div
          style={{
            backgroundColor: "#fff",
            borderRadius: "16px",
            border: "1px solid #e5e5e5",
            padding: "32px",
            maxWidth: "720px",
          }}
        >
          <h1 style={{ fontSize: "28px", fontWeight: "800", marginBottom: "12px" }}>
            {book.title}
          </h1>

          <div style={{ display: "flex", gap: "10px", flexWrap: "wrap", marginBottom: "20px" }}>
            <span style={badgeStyle("#eef2ff", "#3b82f6")}>{book.type}</span>
            <span style={badgeStyle("#dcfce7", "#15803d")}>Available</span>
            {book.requiresPayment && (
              <span style={badgeStyle("#fef3c7", "#b45309")}>
                Paid borrow · ${book.price.toFixed(2)}
              </span>
            )}
          </div>

          <h2 style={{ fontSize: "16px", fontWeight: "700", marginBottom: "8px" }}>
            Description
          </h2>
          <p style={{ color: "#444", lineHeight: 1.7, marginBottom: "28px" }}>
            {book.description}
          </p>

          {/* FIXED: Uses your robust requiresPayment evaluation instead of explicit null testing */}
          {book.requiresPayment && !paid && (
            <div
              style={{
                backgroundColor: "#f8fafc",
                border: "1px solid #e2e8f0",
                borderRadius: "12px",
                padding: "24px",
                marginBottom: "24px",
                textAlign: "center",
              }}
            >
              <h3 style={{ fontSize: "16px", fontWeight: "700", marginBottom: "8px" }}>
                Pay before you borrow
              </h3>
              <p style={{ color: "#666", marginBottom: "16px", fontSize: "14px" }}>
                Scan the QR code below to pay ${book.price.toFixed(2)}, then confirm
                payment to unlock the Borrow button.
              </p>
              <div
                style={{
                  display: "flex",
                  justifyContent: "center",
                  marginTop: "10px",
                }}
              >
                <div
                  style={{
                    padding: "18px",
                    borderRadius: "16px",
                    backgroundColor: "#fff",
                    boxShadow: "0 10px 25px rgba(0,0,0,0.12)",
                    textAlign: "center",
                  }}
                >
                  <img
                    src={book.qrCode}
                    alt="Payment QR code"
                    style={{
                      width: "100%",
                      maxWidth: "380px",
                      height: "auto",
                      objectFit: "contain",
                      borderRadius: "12px",
                      border: "1px solid #e5e5e5",
                    }}
                  />
                  <p style={{ marginTop: "10px", fontSize: "13px", color: "#666" }}>
                    Scan to Pay
                  </p>
                </div>
              </div>
              <p style={{ color: "#888", fontSize: "12px", marginTop: "12px" }}>
                Amount: ${book.price.toFixed(2)}
              </p>
              <button
                onClick={handleConfirmPayment}
                style={{ ...btnStyle("#15803d"), marginTop: "16px" }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = "#166534"; // Darker green
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = "#15803d"; // Resets clean green
                }}
              >
                I have paid
              </button>
            </div>
          )}

          {book.requiresPayment && paid && (
            <p
              style={{
                backgroundColor: "#dcfce7",
                color: "#15803d",
                padding: "12px 16px",
                borderRadius: "8px",
                fontSize: "14px",
                fontWeight: "600",
                marginBottom: "20px",
              }}
            >
              Payment confirmed — you can now borrow this book.
            </p>
          )}

          {borrowMessage && (
            <p
              style={{
                backgroundColor: "#dbeafe",
                color: "#1d4ed8",
                padding: "12px 16px",
                borderRadius: "8px",
                fontSize: "14px",
                fontWeight: "600",
                marginBottom: "20px",
              }}
            >
              {borrowMessage}
            </p>
          )}

          {!borrowed && (
            <button
              onClick={handleBorrow}
              disabled={!canBorrow}
              style={btnStyle(canBorrow ? "#3b82f6" : "#ccc")}
              onMouseEnter={(e) => {
                if (canBorrow) e.currentTarget.style.backgroundColor = "#2563eb";
              }}
              onMouseLeave={(e) => {
                if (canBorrow) e.currentTarget.style.backgroundColor = "#3b82f6";
              }}
            >
              Borrow Book
            </button>
          )}

          {borrowed && (
            <button
              onClick={() => window.open(book.link, "_blank")}
              style={{
                marginTop: "10px",
                padding: "10px 18px",
                borderRadius: "20px",
                border: "none",
                backgroundColor: "#1d4ed8",
                color: "#fff",
                fontWeight: "700",
                cursor: "pointer",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = "#1e40af";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = "#1d4ed8";
              }}
            >
              Go to Book Resource
            </button>
          )}
        </div>
      </div>
    </Home>
  );
}

function badgeStyle(bg, color) {
  return {
    display: "inline-block",
    backgroundColor: bg,
    color,
    padding: "4px 12px",
    borderRadius: "12px",
    fontSize: "12px",
    fontWeight: "700",
  };
}

function btnStyle(bg) {
  return {
    padding: "12px 24px",
    borderRadius: "25px",
    border: "none",
    backgroundColor: bg,
    color: "#fff",
    fontWeight: "700",
    cursor: bg === "#ccc" ? "not-allowed" : "pointer",
    fontSize: "14px",
    transition: "background-color 0.2s ease",
  };
}