import React, { useState } from 'react';
import Home from './Home';

const faqs = [
  { q: "How do I borrow a book?", a: "Go to the Catalog page, find your book, click 'View Details' and follow the borrowing instructions at the front desk or use your library card." },
  { q: "How long can I keep a borrowed book?", a: "Standard loan period is 14 days. You can renew up to 2 times through your Profile page if no one else has reserved the book." },
  { q: "How do I renew a book?", a: "Go to your Profile page, find the book under 'Currently Borrowed', and click the 'Renew' button before the due date." },
  { q: "What happens if I return a book late?", a: "A fine of $0.25 per day is applied for overdue books. Fines can be paid at the library front desk or online through your account." },
  { q: "How do I search for a specific book?", a: "Use the search bar on the Catalog page. You can search by title, author, or subject keyword." },
  { q: "Can I access digital resources from home?", a: "Yes. Digital resources are available 24/7 through your member account. Log in and visit the Catalog to access e-books and datasets." },
  { q: "How do I update my profile information?", a: "Click on your avatar in the top bar to go to your Profile, then click 'Edit Profile' to update your name, email, and other details." },
  { q: "How do I report a missing or damaged book?", a: "Contact the library staff directly or send a message through the Messages page. Our team will assist you within 1-2 business days." },
];

export default function Help() {
  const user = JSON.parse(localStorage.getItem("userAccount"));
  const [openIndex, setOpenIndex] = useState(null);
  const [query, setQuery] = useState('');
  const [showContactMenu, setShowContactMenu] = useState(false);

  const filtered = faqs.filter(f =>
    f.q.toLowerCase().includes(query.toLowerCase()) ||
    f.a.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <Home isLoggedIn={true} user={user}>
      <div style={{ padding: "40px", backgroundColor: "#f8f9ff", minHeight: "100%" }}>

        {/* PAGE HEADER */}
        <h1 style={{ fontSize: "28px", fontWeight: "800", color: "#000", margin: "0 0 4px 0" }}>Help Center</h1>
        <p style={{ fontSize: "14px", color: "#666", margin: "0 0 28px 0" }}>Browse FAQs or search for a topic below.</p>

        {/* SEARCH */}
        <input
          type="text"
          placeholder="Search help topics..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          style={{
            width: "100%", maxWidth: "500px", padding: "12px 18px",
            borderRadius: "20px", border: "1px solid #ddd",
            marginBottom: "32px", outline: "none", fontSize: "13px",
            backgroundColor: "#fff",
          }}
        />

        {/* FAQ */}
        <h2 style={{ fontSize: "20px", fontWeight: "800", color: "#000", margin: "0 0 16px 0" }}>Frequently Asked Questions</h2>
        <div style={{ backgroundColor: "#fff", borderRadius: "16px", border: "1px solid #e5e5e5", overflow: "hidden", marginBottom: "32px" }}>
          {filtered.length === 0 ? (
            <p style={{ color: "#888", padding: "24px" }}>No results found for "{query}".</p>
          ) : (
            filtered.map((faq, i) => (
              <div key={i} style={{ borderBottom: i < filtered.length - 1 ? "1px solid #f0f0f0" : "none" }}>
                <div
                  onClick={() => setOpenIndex(openIndex === i ? null : i)}
                  style={{
                    display: "flex", justifyContent: "space-between", alignItems: "center",
                    padding: "18px 24px", cursor: "pointer",
                    fontSize: "14px", fontWeight: "600", color: "#000",
                  }}
                >
                  <span>{faq.q}</span>
                  <span style={{ fontSize: "20px", color: "#888", flexShrink: 0 }}>{openIndex === i ? '−' : '+'}</span>
                </div>
                {openIndex === i && (
                  <div style={{ padding: "0 24px 18px 24px", fontSize: "13px", color: "#555", lineHeight: "1.7", backgroundColor: "#fafafa" }}>
                    {faq.a}
                  </div>
                )}
              </div>
            ))
          )}
        </div>

        {/* CONTACT CARD */}
        <div style={{
          backgroundColor: "#fff", borderRadius: "16px", border: "1px solid #e5e5e5",
          padding: "40px", textAlign: "center",
        }}>
          <div style={{ fontSize: "32px", marginBottom: "12px" }}>📬</div>
          <h3 style={{ fontSize: "18px", fontWeight: "800", margin: "0 0 8px 0" }}>Still need help?</h3>
          <p style={{ fontSize: "14px", color: "#666", margin: "0 0 20px 0" }}>Our library staff is available Mon–Fri, 8AM–10PM.</p>
            <button
            onClick={() => setShowContactMenu(true)}
            style={{
                padding: "12px 28px",
                backgroundColor: "#000",
                color: "#fff",
                border: "none",
                borderRadius: "14px",
                fontSize: "14px",
                fontWeight: "700",
                cursor: "pointer",
            }}
            onMouseEnter={(e) => e.currentTarget.style.backgroundColor = "#333"}
            onMouseLeave={(e) => e.currentTarget.style.backgroundColor = "#000"}
            >
            Send a Message
            </button>
        </div>

      </div>

        {showContactMenu && (
        <div
            style={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            backgroundColor: "rgba(0,0,0,0.5)",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            zIndex: 9999,
            }}
            onClick={() => setShowContactMenu(false)}
        >
            <div
            onClick={(e) => e.stopPropagation()}
            style={{
                backgroundColor: "#fff",
                padding: "30px",
                borderRadius: "16px",
                width: "350px",
                textAlign: "center",
                boxShadow: "0 10px 30px rgba(0,0,0,0.15)",
            }}
            >
            <h3
                style={{
                marginBottom: "20px",
                fontSize: "20px",
                fontWeight: "700",
                }}
            >
                Contact Library Staff
            </h3>

            <div
                style={{
                display: "flex",
                flexDirection: "column",
                gap: "12px",
                }}
            >
                {/* Phone */}
                <a
                href="tel:+85592223229"
                style={{
                    textDecoration: "none",
                    padding: "12px",
                    border: "1px solid #ddd",
                    borderRadius: "10px",
                    color: "#000",
                    fontWeight: "600",
                    backgroundColor: "#fff",
                    transition: "0.2s",
                }}
                onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = "#333";
                    e.currentTarget.style.color = "#fff";
                }}
                onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = "#fff";
                    e.currentTarget.style.color = "#000";
                }}
                >
                📞 Call Us
                </a>

                {/* Telegram */}
                <a
                href="https://t.me/+G9oGz1gBRzliZWY9"
                target="_blank"
                rel="noopener noreferrer"
                style={{
                    textDecoration: "none",
                    padding: "12px",
                    border: "1px solid #ddd",
                    borderRadius: "10px",
                    color: "#000",
                    fontWeight: "600",
                    backgroundColor: "#fff",
                    transition: "0.2s",
                }}
                onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = "#333";
                    e.currentTarget.style.color = "#fff";
                }}
                onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = "#fff";
                    e.currentTarget.style.color = "#000";
                }}
                >
                💬 Telegram
                </a>

                {/* Email */}
                <a
                href="mailto:swayumphou@gmail.com"
                style={{
                    textDecoration: "none",
                    padding: "12px",
                    border: "1px solid #ddd",
                    borderRadius: "10px",
                    color: "#000",
                    fontWeight: "600",
                    backgroundColor: "#fff",
                    transition: "0.2s",
                }}
                onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = "#333";
                    e.currentTarget.style.color = "#fff";
                }}
                onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = "#fff";
                    e.currentTarget.style.color = "#000";
                }}
                >
                📧 Send Email
                </a>
            </div>

            <button
                onClick={() => setShowContactMenu(false)}
                style={{
                marginTop: "20px",
                padding: "10px 20px",
                border: "none",
                backgroundColor: "#f3f4f6",
                borderRadius: "10px",
                cursor: "pointer",
                fontWeight: "600",
                }}
                                
                onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = "#807c7c";
                    e.currentTarget.style.color = "#fff";
                }}
                onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = "#fff";
                    e.currentTarget.style.color = "#000";
                }}
                
            >
                Close
            </button>
            </div>
        </div>
        )}
    </Home>
  );
}