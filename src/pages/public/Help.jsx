import React, { useState } from 'react';
import { PrimaryBtn, GhostBtn } from '../../components/shared/UI';

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
  const [openIndex, setOpenIndex] = useState(null);
  const [query, setQuery] = useState('');
  const [showContactMenu, setShowContactMenu] = useState(false);

  const filtered = faqs.filter(f =>
    f.q.toLowerCase().includes(query.toLowerCase()) ||
    f.a.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <div style={{ fontFamily: 'system-ui, sans-serif' }}>

      {/* Header */}
      <div style={{ marginBottom: '24px' }}>
        <h2 style={{ margin: '0 0 4px', fontSize: '22px', fontWeight: '800', color: '#0f172a' }}>Help Center</h2>
        <p style={{ margin: 0, fontSize: '14px', color: '#64748b' }}>Browse FAQs or search for a topic below.</p>
      </div>

      {/* Search */}
      <div style={{ marginBottom: '28px' }}>
        <input
          type="text"
          placeholder="Search help topics..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          style={{
            width: '100%', maxWidth: '500px', padding: '10px 16px',
            borderRadius: '10px', border: '1px solid #e2e8f0',
            fontSize: '14px', outline: 'none', boxSizing: 'border-box',
            backgroundColor: '#fff',
          }}
        />
      </div>

      {/* FAQ */}
      <h3 style={{ margin: '0 0 14px', fontSize: '16px', fontWeight: '700', color: '#0f172a' }}>Frequently Asked Questions</h3>
      <div style={S.card}>
        {filtered.length === 0 ? (
          <p style={{ color: '#94a3b8', padding: '24px', margin: 0 }}>No results found for "{query}".</p>
        ) : (
          filtered.map((faq, i) => (
            <div key={i} style={{ borderBottom: i < filtered.length - 1 ? '1px solid #f1f5f9' : 'none' }}>
              <div
                onClick={() => setOpenIndex(openIndex === i ? null : i)}
                style={{
                  display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                  padding: '16px 20px', cursor: 'pointer',
                  fontSize: '14px', fontWeight: '600', color: '#0f172a',
                }}
              >
                <span>{faq.q}</span>
                <span style={{ fontSize: '18px', color: '#94a3b8', flexShrink: 0, marginLeft: '12px' }}>
                  {openIndex === i ? '−' : '+'}
                </span>
              </div>
              {openIndex === i && (
                <div style={{ padding: '0 20px 16px 20px', fontSize: '13px', color: '#475569', lineHeight: '1.7', backgroundColor: '#fafafa' }}>
                  {faq.a}
                </div>
              )}
            </div>
          ))
        )}
      </div>

      {/* Contact card */}
      <div style={{ ...S.card, marginTop: '24px', textAlign: 'center', padding: '40px 24px' }}>
        <div style={{ fontSize: '32px', marginBottom: '12px' }}>📬</div>
        <h3 style={{ margin: '0 0 8px', fontSize: '18px', fontWeight: '800', color: '#0f172a' }}>Still need help?</h3>
        <p style={{ margin: '0 0 20px', fontSize: '14px', color: '#64748b' }}>Our library staff is available Mon–Fri, 8AM–10PM.</p>
        <PrimaryBtn onClick={() => setShowContactMenu(true)}>Send a Message</PrimaryBtn>
      </div>

      {/* Contact modal */}
      {showContactMenu && (
        <div style={S.overlay} onClick={() => setShowContactMenu(false)}>
          <div onClick={(e) => e.stopPropagation()} style={S.modal}>
            <h3 style={{ margin: '0 0 20px', fontSize: '18px', fontWeight: '800', color: '#0f172a', textAlign: 'center' }}>
              Contact Library Staff
            </h3>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              <a
                href="tel:+85592223229"
                style={S.contactLink}
                onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = '#0f172a'; e.currentTarget.style.color = '#fff'; e.currentTarget.style.borderColor = '#0f172a'; }}
                onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = '#fff'; e.currentTarget.style.color = '#0f172a'; e.currentTarget.style.borderColor = '#e2e8f0'; }}
              >
                📞 Call Us
              </a>

              <a
                href="https://t.me/+G9oGz1gBRzliZWY9"
                target="_blank"
                rel="noopener noreferrer"
                style={S.contactLink}
                onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = '#0f172a'; e.currentTarget.style.color = '#fff'; e.currentTarget.style.borderColor = '#0f172a'; }}
                onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = '#fff'; e.currentTarget.style.color = '#0f172a'; e.currentTarget.style.borderColor = '#e2e8f0'; }}
              >
                💬 Telegram
              </a>

              <a
                href="mailto:swayumphou@gmail.com"
                style={S.contactLink}
                onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = '#0f172a'; e.currentTarget.style.color = '#fff'; e.currentTarget.style.borderColor = '#0f172a'; }}
                onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = '#fff'; e.currentTarget.style.color = '#0f172a'; e.currentTarget.style.borderColor = '#e2e8f0'; }}
              >
                📧 Send Email
              </a>
            </div>

            <div style={{ marginTop: '20px', textAlign: 'center' }}>
              <GhostBtn onClick={() => setShowContactMenu(false)}>Close</GhostBtn>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

const S = {
  card: {
    backgroundColor: '#fff',
    borderRadius: '12px',
    border: '1px solid #e2e8f0',
    overflow: 'hidden',
    boxShadow: '0 1px 4px rgba(0,0,0,0.05)',
  },
  overlay: {
    position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.45)',
    display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 9999,
  },
  modal: {
    backgroundColor: '#fff', borderRadius: '16px', padding: '28px',
    width: '100%', maxWidth: '380px', boxShadow: '0 20px 60px rgba(0,0,0,0.18)',
    margin: '16px',
  },
  contactLink: {
    textDecoration: 'none', padding: '12px 16px',
    border: '1px solid #e2e8f0', borderRadius: '8px',
    color: '#0f172a', fontWeight: '600', fontSize: '14px',
    backgroundColor: '#fff', display: 'block', textAlign: 'center',
    transition: 'background-color 0.15s, color 0.15s, border-color 0.15s',
  },
};
