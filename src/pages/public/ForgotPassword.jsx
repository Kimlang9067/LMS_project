import React, { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { findUser, createOTPSession } from '../../utils/otpSession';

function LibraryBookLogo({ size = 110 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 220 220" xmlns="http://www.w3.org/2000/svg" fill="none">
      <g transform="translate(18,130) rotate(8 90 22)">
        <rect x="18" y="8" rx="18" ry="18" width="150" height="40" fill="#173F7A" />
        <rect x="10" y="0" rx="18" ry="18" width="150" height="40" fill="#F6A313" />
        <path d="M20 12H145" stroke="#ffffff" strokeWidth="4" strokeLinecap="round" opacity="0.9" />
        <path d="M20 20H140" stroke="#ffffff" strokeWidth="3" strokeLinecap="round" opacity="0.85" />
        <path d="M20 28H132" stroke="#ffffff" strokeWidth="3" strokeLinecap="round" opacity="0.8" />
      </g>
      <g transform="translate(35,92) rotate(-8 75 20)">
        <rect x="18" y="8" rx="16" ry="16" width="128" height="36" fill="#173F7A" />
        <rect x="10" y="0" rx="16" ry="16" width="128" height="36" fill="#1C9AD6" />
        <path d="M20 10H122" stroke="#ffffff" strokeWidth="4" strokeLinecap="round" opacity="0.95" />
        <path d="M20 18H118" stroke="#ffffff" strokeWidth="3" strokeLinecap="round" opacity="0.85" />
        <path d="M20 26H112" stroke="#ffffff" strokeWidth="3" strokeLinecap="round" opacity="0.8" />
      </g>
      <g transform="translate(48,64) rotate(8 64 14)">
        <rect x="14" y="6" rx="12" ry="12" width="112" height="24" fill="#F6A313" />
        <rect x="8" y="0" rx="12" ry="12" width="112" height="24" fill="#FFD45E" opacity="0.25" />
      </g>
      <g transform="translate(52,24) rotate(-12 70 28)">
        <path d="M12 20L85 0L150 18L76 38L12 20Z" fill="#173F7A" />
        <path d="M22 24L78 36L143 18" stroke="#ffffff" strokeWidth="4" strokeLinecap="round" opacity="0.9" />
        <path d="M18 18L76 32L137 16" stroke="#0F2D5C" strokeWidth="6" strokeLinecap="round" opacity="0.55" />
      </g>
    </svg>
  );
}

export default function ForgotPassword() {
  const navigate  = useNavigate();
  const formRef   = useRef(null);
  const [contact, setContact]   = useState('');
  const [error,   setError]     = useState('');
  const [loading, setLoading]   = useState(false);
  // After OTP is generated, show it to the user (demo mode — no real email/SMS)
  const [otpCode, setOtpCode]   = useState('');
  const [userName, setUserName] = useState('');

  // Clear form on mount to prevent autofill leaking in
  useEffect(() => {
    setContact('');
    setError('');
    setOtpCode('');
    const t1 = setTimeout(() => { if (formRef.current) formRef.current.reset(); }, 50);
    const t2 = setTimeout(() => { if (formRef.current) formRef.current.reset(); }, 300);
    return () => { clearTimeout(t1); clearTimeout(t2); };
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    const trimmed = contact.trim();
    setError('');

    if (!trimmed) {
      setError('Please enter your email address or phone number.');
      return;
    }

    setLoading(true);

    // Look up user in localStorage (member + staff)
    const user = findUser(trimmed);

    // Always pause briefly so it doesn't feel instant (prevents enumeration timing)
    setTimeout(() => {
      if (!user) {
        // Generic message — don't confirm whether account exists
        setError('No account found with that email or phone. Please check and try again.');
        setLoading(false);
        return;
      }

      const code = createOTPSession(trimmed, user.userId, user.userType);
      setOtpCode(code);
      setUserName(user.fullName);
      setLoading(false);
    }, 600);
  };

  const handleContinue = () => navigate('/verify-otp');

  const tabHover = (hoverColor, normalColor) => ({
    onMouseEnter: (e) => { e.currentTarget.style.backgroundColor = hoverColor; },
    onMouseLeave: (e) => { e.currentTarget.style.backgroundColor = normalColor; },
  });

  return (
    <div style={s.page}>
      <main style={s.card}>

        {/* LEFT BRANDING PANEL */}
        <section style={s.leftPanel}>
          <div style={s.leftOverlay}>
            <div style={s.brandRow}>
              <div style={s.logoWrap}><LibraryBookLogo size={95} /></div>
              <div style={s.brandTextWrap}>
                <h1 style={s.brandTitle}>Data_Science</h1>
                <h2 style={s.brandSubtitle}>Library</h2>
                <p style={s.brandTagline}>Institutional Resource Portal</p>
              </div>
            </div>
            <div style={s.quoteBox}>
              <blockquote style={s.quote}>
                "Knowledge is the only asset that increases when shared across borders."
              </blockquote>
              <div style={s.signatureRow}>
                <div style={s.signatureLine} />
                <span style={s.signatureText}>LIBRARY MOTTO</span>
              </div>
            </div>
          </div>
        </section>

        {/* RIGHT FORM PANEL */}
        <section style={s.rightPanel}>
          <div style={s.formWrapper}>

            {/* Tabs */}
            <div style={s.authTabs}>
              <button type="button" style={{ ...s.authTab, ...s.activeTab }} onClick={() => navigate('/signin')} {...tabHover('#e5e7eb', '#ffffff')}>
                SIGN IN
              </button>
              <button type="button" style={s.authTab} onClick={() => navigate('/register')} {...tabHover('#cfd8e3', 'transparent')}>
                SIGN UP
              </button>
            </div>

            <header style={s.header}>
              <h2 style={s.welcomeHeading}>Forgot Password?</h2>
              <p style={s.subText}>
                Enter your email or phone number and we'll send you a verification code.
              </p>
            </header>

            {/* ── OTP sent — show demo code ── */}
            {otpCode ? (
              <div>
                <div style={s.successBox}>
                  <div style={s.successIcon}>✓</div>
                  <div>
                    <p style={s.successTitle}>Code generated for {userName}</p>
                    <p style={s.successSub}>Enter this code on the next screen:</p>
                  </div>
                </div>

                {/* Demo OTP display (replaces real email delivery) */}
                <div style={s.otpBox}>
                  <p style={s.otpLabel}>YOUR VERIFICATION CODE</p>
                  <p style={s.otpDigits}>{otpCode}</p>
                  <p style={s.otpNote}>Valid for 10 minutes · Single use</p>
                </div>

                <div style={s.demoNotice}>
                  Demo mode — in production this code would be sent to your email or phone.
                </div>

                <button type="button" style={s.submitBtn} onClick={handleContinue}>
                  CONTINUE TO VERIFY
                </button>
              </div>
            ) : (
              /* ── Input form ── */
              <form ref={formRef} onSubmit={handleSubmit} style={s.formBlock} autoComplete="off">
                {/* Hidden honeypot fields to deter browser autofill */}
                <input type="text"     name="fake-user" autoComplete="username"         style={s.hidden} tabIndex={-1} />
                <input type="password" name="fake-pass" autoComplete="current-password" style={s.hidden} tabIndex={-1} />

                <div>
                  <label style={s.label} htmlFor="contact">PHONE NUMBER OR EMAIL</label>
                  <input
                    id="contact"
                    type="text"
                    placeholder="e.g. user@email.com or 012 345 678"
                    value={contact}
                    onChange={e => { setContact(e.target.value); setError(''); }}
                    style={{ ...s.input, borderColor: error ? '#ef4444' : '#c4c6cd' }}
                    autoComplete="off"
                    readOnly
                    onFocus={e => e.target.removeAttribute('readonly')}
                    required
                  />
                  {error && <p style={s.errorText}>{error}</p>}
                </div>

                <button type="submit" style={s.submitBtn} disabled={loading}>
                  {loading ? 'CHECKING…' : 'SEND VERIFICATION CODE'}
                </button>
              </form>
            )}

            <footer style={s.footer}>
              <p style={s.copyright}>© Data_Science Library Systems</p>
              <div style={s.footerLinks}>
                <span onClick={() => navigate('/signin')} style={s.footerLink}>Back to Sign In</span>
                <span style={s.footerLink}>System Status</span>
                <span style={s.footerLink}>Help Desk</span>
              </div>
            </footer>
          </div>
        </section>
      </main>
    </div>
  );
}

const s = {
  page: {
    minHeight: '100vh', backgroundColor: '#f8f9ff',
    backgroundImage: 'radial-gradient(#d5e3fc 1px, transparent 1px)',
    backgroundSize: '32px 32px', display: 'flex', alignItems: 'center',
    justifyContent: 'center', padding: '24px',
    fontFamily: '"Inter", system-ui, sans-serif',
  },
  card: {
    width: '100%', maxWidth: '1000px', minHeight: '640px',
    backgroundColor: '#ffffff', borderRadius: '16px',
    boxShadow: '0 20px 50px rgba(0,0,0,0.15)', overflow: 'hidden',
    display: 'flex', flexWrap: 'wrap',
  },
  leftPanel: {
    flex: '1 1 380px', backgroundColor: '#041627',
    position: 'relative', padding: '40px', display: 'flex',
  },
  leftOverlay: {
    position: 'relative', zIndex: 1, display: 'flex', flexDirection: 'column',
    justifyContent: 'space-between', width: '100%', color: '#ffffff',
  },
  brandRow:     { display: 'flex', alignItems: 'center', gap: '16px' },
  logoWrap:     { display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 },
  brandTextWrap:{ display: 'flex', flexDirection: 'column', justifyContent: 'center' },
  brandTitle:   { fontSize: '24px', fontWeight: '700', margin: '0', color: '#ffffff', lineHeight: '1.2' },
  brandSubtitle:{ fontSize: '18px', color: '#ff3b30', margin: '4px 0 8px 0', lineHeight: '1.2' },
  brandTagline: { fontSize: '13px', color: '#d7e3f1', margin: 0 },
  quoteBox:     { backgroundColor: 'rgba(255,255,255,0.06)', padding: '18px', borderRadius: '12px', backdropFilter: 'blur(2px)' },
  quote:        { fontStyle: 'italic', fontSize: '16px', lineHeight: '1.7', color: '#ffffff', opacity: 0.95, margin: '0 0 16px 0' },
  signatureRow: { display: 'flex', alignItems: 'center', gap: '12px' },
  signatureLine:{ width: '40px', height: '1px', backgroundColor: '#b7c8de' },
  signatureText:{ fontSize: '11px', letterSpacing: '2px', textTransform: 'uppercase', color: '#b7c8de' },
  rightPanel:   { flex: '1 1 380px', padding: '40px', display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: '#ffffff' },
  formWrapper:  { width: '100%', maxWidth: '380px' },
  authTabs:     { display: 'flex', width: '100%', marginBottom: '32px', backgroundColor: '#dfe5f2', borderRadius: '8px', padding: '4px' },
  authTab:      { flex: 1, border: 'none', backgroundColor: 'transparent', color: '#4b5563', fontSize: '14px', padding: '12px 0', cursor: 'pointer', borderRadius: '6px', fontWeight: '600', letterSpacing: '0.5px', transition: 'background-color 0.2s ease' },
  activeTab:    { backgroundColor: '#ffffff', color: '#0f172a', boxShadow: '0 1px 2px rgba(0,0,0,0.06)' },
  header:       { marginBottom: '24px' },
  welcomeHeading:{ fontSize: '28px', fontWeight: '700', margin: '0 0 6px', color: '#0d1c2e' },
  subText:      { fontSize: '14px', color: '#44474c', margin: 0, lineHeight: '1.6' },
  formBlock:    { display: 'flex', flexDirection: 'column', gap: '18px' },
  label:        { display: 'block', fontSize: '11px', letterSpacing: '1px', fontWeight: '600', color: '#5c5f61', marginBottom: '6px' },
  input:        { width: '100%', padding: '12px 14px', fontSize: '14px', border: '1px solid #c4c6cd', borderRadius: '8px', outline: 'none', boxSizing: 'border-box', fontFamily: '"Inter", system-ui, sans-serif', backgroundColor: '#ffffff' },
  errorText:    { fontSize: '13px', color: '#ef4444', margin: '6px 0 0' },
  submitBtn:    { width: '100%', backgroundColor: '#041627', color: '#ffffff', border: 'none', padding: '14px', fontSize: '12px', fontWeight: '700', letterSpacing: '2px', textTransform: 'uppercase', borderRadius: '8px', cursor: 'pointer', marginTop: '6px' },
  hidden:       { position: 'absolute', opacity: 0, pointerEvents: 'none', width: '1px', height: '1px' },
  // OTP success state
  successBox:   { display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '20px' },
  successIcon:  { width: '40px', height: '40px', borderRadius: '50%', backgroundColor: '#dcfce7', color: '#166534', fontSize: '18px', fontWeight: '700', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 },
  successTitle: { margin: '0 0 2px', fontSize: '15px', fontWeight: '700', color: '#0f172a' },
  successSub:   { margin: 0, fontSize: '13px', color: '#64748b' },
  otpBox:       { backgroundColor: '#f0f7ff', border: '2px dashed #1C9AD6', borderRadius: '12px', padding: '20px', textAlign: 'center', marginBottom: '14px' },
  otpLabel:     { margin: '0 0 8px', fontSize: '11px', fontWeight: '700', color: '#1C9AD6', letterSpacing: '2px' },
  otpDigits:    { margin: '0 0 6px', fontSize: '40px', fontWeight: '800', color: '#0f172a', letterSpacing: '12px' },
  otpNote:      { margin: 0, fontSize: '12px', color: '#64748b' },
  demoNotice:   { backgroundColor: '#fffbeb', border: '1px solid #fcd34d', borderRadius: '8px', padding: '10px 14px', fontSize: '12px', color: '#92400e', marginBottom: '16px', textAlign: 'center' },
  footer:       { marginTop: '32px', paddingTop: '24px', borderTop: '1px solid #c4c6cd', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '12px' },
  copyright:    { fontSize: '11px', color: '#5c5f61', margin: 0 },
  footerLinks:  { display: 'flex', gap: '20px', flexWrap: 'wrap', justifyContent: 'center' },
  footerLink:   { fontSize: '11px', fontWeight: '600', color: '#44474c', cursor: 'pointer' },
};
