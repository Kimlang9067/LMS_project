import React, { useState } from "react";
import { useNavigate, useParams, useLocation } from "react-router-dom";
import { getBookById } from "../../data/bookMeta";
import { isBookPaid, markBookPaid } from "../../utils/payments";
import {
  addCirculationRecord,
  getCurrentBorrowerName,
} from "../../utils/circulation";
import { notifyBookBorrowed } from "../../utils/notifications";

export default function BookDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const backPath = location.state?.backPath || '/catalog';
  const book = getBookById(id);

  const [paid, setPaid] = useState(() =>
    book ? isBookPaid(Number(book.id)) : false
  );
  const [borrowMessage, setBorrowMessage] = useState("");
  const [borrowed, setBorrowed] = useState(false);

  if (!book) {
    return (
      <div>
        <h1 style={{ fontSize: "28px", fontWeight: "800" }}>Book not found</h1>
        <button
          onClick={() => navigate(backPath)}
          style={btnStyle("#000")}
        >
          ← Back to Catalog
        </button>
      </div>
    );
  }

  const canBorrow = book.requiresPayment ? paid : true;

  const handleConfirmPayment = () => {
    markBookPaid(Number(book.id));
    setPaid(true);
  };

  const handleBorrow = () => {
    if (!canBorrow) return;

    const borrower = getCurrentBorrowerName();
    const today = new Date();
    const returnDate = new Date(today);
    returnDate.setDate(returnDate.getDate() + 14);
    const returnDateStr = returnDate.toISOString().slice(0, 10);

    addCirculationRecord({
      id: Date.now(),
      user: borrower,
      book: book.title,
      link: book.link,
      issueDate: today.toISOString().slice(0, 10),
      returnDate: returnDateStr,
      status: "Borrowed",
    });

    notifyBookBorrowed(book.title, returnDateStr);

    setBorrowMessage(
      "Book borrowed successfully! View it under Profile → Currently Borrowed."
    );
    setBorrowed(true);
  };

  return (
    <div>
      <button
        onClick={() => navigate(backPath)}
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
            <div style={{ display: "flex", justifyContent: "center", marginTop: "10px" }}>
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
          >
            Go to Book Resource
          </button>
        )}
      </div>
    </div>
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
