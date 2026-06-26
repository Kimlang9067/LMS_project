import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { verifyCode, createOTPSession, getOTPSession, secondsUntilResend } from '../../utils/otpSession';

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

const OTP_LENGTH = 6;

export default function VerifyOTP() {
  const navigate   = useNavigate();
  const [digits,   setDigits]   = useState(Array(OTP_LENGTH).fill(''));
  const [error,    setError]    = useState('');
  const [success,  setSuccess]  = useState(false);
  const [cooldown, setCooldown] = useState(0);
  const [newCode,  setNewCode]  = useState('');  // shown after resend
  const inputRefs = useRef([]);

  // Guard — no session → send back to forgot-password
  useEffect(() => {
    const session = getOTPSession();
    if (!session) {
      navigate('/forgot-password', { replace: true });
      return;
    }
    setCooldown(secondsUntilResend());
  }, [navigate]);

  // Cooldown countdown tick
  useEffect(() => {
    if (cooldown <= 0) return;
    const id = setTimeout(() => setCooldown(c => c - 1), 1000);
    return () => clearTimeout(id);
  }, [cooldown]);

  const handleDigitChange = (index, value) => {
    const cleaned = value.replace(/\D/g, '').slice(-1);
    const next = [...digits];
    next[index] = cleaned;
    setDigits(next);
    setError('');
    if (cleaned && index < OTP_LENGTH - 1) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index, e) => {
    if (e.key === 'Backspace' && !digits[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
    if (e.key === 'ArrowLeft'  && index > 0)              inputRefs.current[index - 1]?.focus();
    if (e.key === 'ArrowRight' && index < OTP_LENGTH - 1) inputRefs.current[index + 1]?.focus();
  };

  const handlePaste = (e) => {
    e.preventDefault();
    const pasted = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, OTP_LENGTH);
    if (!pasted) return;
    const next = Array(OTP_LENGTH).fill('');
    for (let i = 0; i < pasted.length; i++) next[i] = pasted[i];
    setDigits(next);
    inputRefs.current[Math.min(pasted.length, OTP_LENGTH - 1)]?.focus();
  };

  const handleVerify = (e) => {
    e.preventDefault();
    const code = digits.join('');
    if (code.length < OTP_LENGTH) {
      setError('Please enter all 6 digits of your verification code.');
      return;
    }

    const result = verifyCode(code);
    if (!result.ok) {
      setError(result.error);
      // No attempts left — go back to start after a moment
      if (result.remaining === 0) {
        setTimeout(() => navigate('/forgot-password'), 2000);
      }
      return;
    }

    setSuccess(true);
    setTimeout(() => navigate('/reset-password'), 1200);
  };

  const handleResend = () => {
    if (cooldown > 0) return;
    const session = getOTPSession();
    if (!session) { navigate('/forgot-password'); return; }

    const code = createOTPSession(session.contact, session.userId, session.userType);
    setNewCode(code);
    setDigits(Array(OTP_LENGTH).fill(''));
    setError('');
    setSuccess(false);
    setCooldown(60);
    setTimeout(() => inputRefs.current[0]?.focus(), 50);
  };

  const formatTime = (s) =>
    `${String(Math.floor(s / 60)).padStart(2, '0')}:${String(s % 60).padStart(2, '0')}`;

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
            <div style={s.infoBox}>
              <p style={s.infoTitle}>Verification Step</p>
              <p style={s.infoText}>
                Enter the 6-digit code shown on the previous screen. It expires in 10 minutes and is valid for one use only.
              </p>
              <div style={s.stepRow}>
                {['Enter Contact', 'Verify Code', 'Reset Password'].map((step, i) => (
                  <div key={step} style={s.stepItem}>
                    <div style={{ ...s.stepDot, backgroundColor: i <= 1 ? '#1C9AD6' : 'rgba(255,255,255,0.2)' }}>
                      {i < 1 ? '✓' : i + 1}
                    </div>
                    <span style={{ ...s.stepLabel, color: i <= 1 ? '#ffffff' : 'rgba(255,255,255,0.5)' }}>
                      {step}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* RIGHT FORM PANEL */}
        <section style={s.rightPanel}>
          <div style={s.formWrapper}>

            {/* Tabs */}
            <div style={s.authTabs}>
              <button type="button" style={{ ...s.authTab, ...s.activeTab }} onClick={() => navigate('/signin')}>SIGN IN</button>
              <button type="button" style={s.authTab} onClick={() => navigate('/register')}>SIGN UP</button>
            </div>

            <header style={s.header}>
              <h2 style={s.welcomeHeading}>Verify Your Code</h2>
              <p style={s.subText}>Enter the 6-digit code from the previous screen.</p>
            </header>

            {/* Show new code after resend */}
            {newCode && (
              <div style={s.newCodeBox}>
                <p style={s.newCodeLabel}>NEW CODE</p>
                <p style={s.newCodeDigits}>{newCode}</p>
              </div>
            )}

            {success ? (
              <div style={s.successBox}>
                <div style={s.successIcon}>✓</div>
                <p style={s.successText}>Code verified! Redirecting to reset password…</p>
              </div>
            ) : (
              <form onSubmit={handleVerify} style={s.formBlock}>
                <div style={s.digitRow} onPaste={handlePaste}>
                  {digits.map((d, i) => (
                    <input
                      key={i}
                      ref={el => { inputRefs.current[i] = el; }}
                      type="text"
                      inputMode="numeric"
                      maxLength={1}
                      value={d}
                      onChange={e => handleDigitChange(i, e.target.value)}
                      onKeyDown={e => handleKeyDown(i, e)}
                      style={{
                        ...s.digitBox,
                        borderColor:     error ? '#ef4444' : d ? '#1C9AD6' : '#c4c6cd',
                        backgroundColor: d ? '#eff8ff' : '#ffffff',
                      }}
                      autoFocus={i === 0}
                    />
                  ))}
                </div>

                {error && <p style={s.errorText}>{error}</p>}

                <button type="submit" style={s.submitBtn}>VERIFY CODE</button>

                <div style={s.resendRow}>
                  {cooldown > 0 ? (
                    <p style={s.countdownText}>
                      Resend code in <strong>{formatTime(cooldown)}</strong>
                    </p>
                  ) : (
                    <button type="button" onClick={handleResend} style={s.resendBtn}>
                      Resend Code
                    </button>
                  )}
                </div>
              </form>
            )}

            <footer style={s.footer}>
              <button type="button" onClick={() => navigate('/forgot-password')} style={s.backLink}>
                ← Back to Forgot Password
              </button>
              <p style={s.copyright}>© Data_Science Library Systems</p>
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
    width: '100%', maxWidth: '1000px', minHeight: '620px', backgroundColor: '#ffffff',
    borderRadius: '16px', boxShadow: '0 20px 50px rgba(0,0,0,0.15)',
    overflow: 'hidden', display: 'flex', flexWrap: 'wrap',
  },
  leftPanel:     { flex: '1 1 380px', backgroundColor: '#041627', position: 'relative', padding: '40px', display: 'flex' },
  leftOverlay:   { position: 'relative', zIndex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'space-between', width: '100%', color: '#ffffff' },
  brandRow:      { display: 'flex', alignItems: 'center', gap: '16px' },
  logoWrap:      { display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 },
  brandTextWrap: { display: 'flex', flexDirection: 'column', justifyContent: 'center' },
  brandTitle:    { fontSize: '24px', fontWeight: '700', margin: '0', color: '#ffffff', lineHeight: '1.2' },
  brandSubtitle: { fontSize: '18px', color: '#ff3b30', margin: '4px 0 8px 0', lineHeight: '1.2' },
  brandTagline:  { fontSize: '13px', color: '#d7e3f1', margin: 0 },
  infoBox:       { backgroundColor: 'rgba(255,255,255,0.06)', padding: '20px', borderRadius: '12px', backdropFilter: 'blur(2px)' },
  infoTitle:     { fontSize: '13px', fontWeight: '700', color: '#1C9AD6', margin: '0 0 8px', textTransform: 'uppercase', letterSpacing: '1px' },
  infoText:      { fontSize: '14px', lineHeight: '1.7', color: '#d7e3f1', margin: '0 0 20px' },
  stepRow:       { display: 'flex', flexDirection: 'column', gap: '12px' },
  stepItem:      { display: 'flex', alignItems: 'center', gap: '12px' },
  stepDot:       { width: '28px', height: '28px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '12px', fontWeight: '700', color: '#ffffff', flexShrink: 0 },
  stepLabel:     { fontSize: '13px', fontWeight: '600' },
  rightPanel:    { flex: '1 1 380px', padding: '40px', display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: '#ffffff' },
  formWrapper:   { width: '100%', maxWidth: '380px' },
  authTabs:      { display: 'flex', width: '100%', marginBottom: '32px', backgroundColor: '#dfe5f2', borderRadius: '8px', padding: '4px' },
  authTab:       { flex: 1, border: 'none', backgroundColor: 'transparent', color: '#4b5563', fontSize: '14px', padding: '12px 0', cursor: 'pointer', borderRadius: '6px', fontWeight: '600', letterSpacing: '0.5px' },
  activeTab:     { backgroundColor: '#ffffff', color: '#0f172a', boxShadow: '0 1px 2px rgba(0,0,0,0.06)' },
  header:        { marginBottom: '28px' },
  welcomeHeading:{ fontSize: '28px', fontWeight: '700', margin: '0 0 6px', color: '#0d1c2e' },
  subText:       { fontSize: '14px', color: '#44474c', margin: 0, lineHeight: '1.6' },
  newCodeBox:    { backgroundColor: '#f0f7ff', border: '2px dashed #1C9AD6', borderRadius: '10px', padding: '14px', textAlign: 'center', marginBottom: '20px' },
  newCodeLabel:  { margin: '0 0 6px', fontSize: '11px', fontWeight: '700', color: '#1C9AD6', letterSpacing: '2px' },
  newCodeDigits: { margin: 0, fontSize: '32px', fontWeight: '800', color: '#0f172a', letterSpacing: '10px' },
  formBlock:     { display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '20px' },
  digitRow:      { display: 'flex', gap: '10px', justifyContent: 'center' },
  digitBox:      { width: '48px', height: '56px', textAlign: 'center', fontSize: '22px', fontWeight: '700', border: '2px solid #c4c6cd', borderRadius: '10px', outline: 'none', transition: 'border-color 0.15s, background-color 0.15s', color: '#0d1c2e', caretColor: '#1C9AD6' },
  errorText:     { fontSize: '13px', color: '#ef4444', margin: 0, textAlign: 'center' },
  submitBtn:     { width: '100%', backgroundColor: '#041627', color: '#ffffff', border: 'none', padding: '14px', fontSize: '12px', fontWeight: '700', letterSpacing: '2px', textTransform: 'uppercase', borderRadius: '8px', cursor: 'pointer' },
  resendRow:     { textAlign: 'center' },
  resendBtn:     { background: 'none', border: 'none', color: '#1C9AD6', fontSize: '13px', fontWeight: '700', cursor: 'pointer', textDecoration: 'underline', padding: 0 },
  countdownText: { fontSize: '13px', color: '#44474c', margin: 0 },
  successBox:    { display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '16px', padding: '32px 0' },
  successIcon:   { width: '56px', height: '56px', borderRadius: '50%', backgroundColor: '#dcfce7', color: '#166534', fontSize: '24px', fontWeight: '700', display: 'flex', alignItems: 'center', justifyContent: 'center' },
  successText:   { fontSize: '15px', fontWeight: '600', color: '#166534', margin: 0, textAlign: 'center' },
  footer:        { marginTop: '28px', paddingTop: '20px', borderTop: '1px solid #c4c6cd', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '12px' },
  backLink:      { background: 'none', border: 'none', color: '#044c8d', fontSize: '13px', fontWeight: '600', cursor: 'pointer', padding: 0 },
  copyright:     { fontSize: '11px', color: '#5c5f61', margin: 0 },
};
