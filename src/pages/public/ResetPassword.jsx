import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router';
import { getOTPSession, updatePassword, validatePassword } from '../../utils/otpSession';
import { notifyPasswordUpdated } from '../../utils/notifications';

function EyeIcon({ open }) {
  return open ? (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#9ca3af" strokeWidth="2" strokeLinecap="round">
      <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"/>
      <line x1="1" y1="1" x2="23" y2="23"/>
    </svg>
  ) : (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#9ca3af" strokeWidth="2" strokeLinecap="round">
      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
      <circle cx="12" cy="12" r="3"/>
    </svg>
  );
}

function LibraryBookLogo({ size = 85 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="50" cy="50" r="16" fill="#041627"/>
      <circle cx="24" cy="35" r="10" fill="#1C9AD6"/>
      <circle cx="76" cy="35" r="8"  fill="#F6A313"/>
      <circle cx="30" cy="70" r="12" fill="#173F7A"/>
      <circle cx="70" cy="68" r="9"  fill="#041627"/>
      <circle cx="52" cy="20" r="7"  fill="#1C9AD6"/>
      <circle cx="50" cy="80" r="6"  fill="#F6A313"/>
    </svg>
  );
}

export default function ResetPassword() {
  const navigate = useNavigate();
  const [newPassword,     setNewPassword]     = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showNew,         setShowNew]         = useState(false);
  const [showConfirm,     setShowConfirm]     = useState(false);
  const [error,           setError]           = useState('');
  const [success,         setSuccess]         = useState(false);

  // Guard — must arrive with a verified OTP session
  useEffect(() => {
    const session = getOTPSession();
    if (!session || !session.verified) {
      navigate('/forgot-password', { replace: true });
    }
  }, [navigate]);

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');

    const strengthError = validatePassword(newPassword);
    if (strengthError) { setError(strengthError); return; }

    if (newPassword !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    const ok = updatePassword(newPassword);
    if (!ok) {
      setError('Session expired. Please restart the password reset flow.');
      setTimeout(() => navigate('/forgot-password'), 2000);
      return;
    }

    notifyPasswordUpdated();
    setSuccess(true);
    setTimeout(() => navigate('/signin'), 1800);
  };

  if (success) {
    return (
      <div style={styles.screenContainer}>
        <div style={{ ...styles.rightFormPanel, justifyContent: 'center' }}>
          <div style={{ textAlign: 'center', maxWidth: '360px' }}>
            <div style={styles.successCircle}>✓</div>
            <h2 style={{ ...styles.welcomeHeading, marginTop: '20px' }}>Password Reset!</h2>
            <p style={styles.subLabel}>Your password has been updated. Redirecting to Sign In…</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div style={styles.screenContainer}>

      {/* LEFT BRAND PANEL */}
      <div style={styles.leftBrandPanel}>
        <div style={styles.brandContainer}>
          <div style={styles.logoIconLeftBrand}>
            <svg width="85" height="85" viewBox="0 0 100 100" fill="white">
              <circle cx="50" cy="50" r="18"/>
              <circle cx="22" cy="35" r="11"/>
              <circle cx="78" cy="35" r="9"/>
              <circle cx="28" cy="72" r="13"/>
              <circle cx="72" cy="70" r="10"/>
              <circle cx="52" cy="18" r="8"/>
              <circle cx="50" cy="82" r="7"/>
            </svg>
          </div>
          <h1 style={styles.brandTitle}>
            <span style={styles.textSlate}>Data</span>
            <span style={styles.textRed}>_Science</span>
          </h1>
          <h2 style={styles.brandSubtitle}>Library</h2>
          <p style={styles.visionQuoteText}>
            "Your premier digital library for borrowing and reading books"
          </p>
        </div>
      </div>

      {/* RIGHT FORM PANEL */}
      <div style={styles.rightFormPanel}>
        <button type="button" onClick={() => navigate('/forgot-password')} style={styles.backButtonTopRight}>
          BACK
        </button>

        <div style={styles.formWrapper}>
          <div style={styles.logoIconRightCentered}>
            <LibraryBookLogo size={85} />
          </div>

          <h2 style={styles.welcomeHeading}>Reset Password</h2>
          <p style={styles.subLabel}>Choose a strong new password for your account.</p>

          {/* Password rules hint */}
          <div style={styles.rulesBox}>
            <p style={styles.rulesTitle}>Password must have:</p>
            <ul style={styles.rulesList}>
              {['At least 8 characters', 'One uppercase letter (A–Z)', 'One number (0–9)', 'One special character (!@#$…)'].map(r => (
                <li key={r} style={styles.rulesItem}>• {r}</li>
              ))}
            </ul>
          </div>

          <form onSubmit={handleSubmit} style={styles.formBlock}>

            {/* New Password */}
            <div style={{ position: 'relative', width: '100%', maxWidth: '350px' }}>
              <input
                type={showNew ? 'text' : 'password'}
                placeholder="New Password"
                value={newPassword}
                onChange={e => { setNewPassword(e.target.value); setError(''); }}
                style={{ ...styles.textInputBox, paddingRight: '44px', borderColor: error ? '#ef4444' : '#000000' }}
                required
              />
              <button type="button" onClick={() => setShowNew(!showNew)} style={styles.eyeBtn} tabIndex={-1}>
                <EyeIcon open={showNew} />
              </button>
            </div>

            {/* Confirm Password */}
            <div style={{ position: 'relative', width: '100%', maxWidth: '350px' }}>
              <input
                type={showConfirm ? 'text' : 'password'}
                placeholder="Confirm Password"
                value={confirmPassword}
                onChange={e => { setConfirmPassword(e.target.value); setError(''); }}
                style={{ ...styles.textInputBox, paddingRight: '44px', borderColor: error ? '#ef4444' : '#000000' }}
                required
              />
              <button type="button" onClick={() => setShowConfirm(!showConfirm)} style={styles.eyeBtn} tabIndex={-1}>
                <EyeIcon open={showConfirm} />
              </button>
            </div>

            {error && <p style={styles.errorText}>{error}</p>}

            <button type="submit" style={styles.resetActionSubmitBtn}>
              RESET PASSWORD
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

const styles = {
  screenContainer: {
    display: 'flex', minHeight: '100vh', backgroundColor: '#ffffff',
    fontFamily: '"Courier New", Courier, monospace', position: 'relative',
  },
  leftBrandPanel: {
    flex: 1, backgroundColor: '#000000', margin: '12px 0 12px 12px',
    borderRadius: '45px', display: 'none', md: 'flex',
    alignItems: 'center', justifyContent: 'center', padding: '40px',
  },
  brandContainer: { textAlign: 'center', color: '#ffffff', width: '100%', maxWidth: '400px' },
  logoIconLeftBrand: { marginBottom: '20px', display: 'flex', justifyContent: 'center' },
  brandTitle:   { fontSize: '34px', fontWeight: '700', margin: '0 0 4px 0', letterSpacing: '1px' },
  textSlate:    { color: '#5c7080' },
  textRed:      { color: '#ff3b30' },
  brandSubtitle:{ fontSize: '26px', fontWeight: '500', color: '#ffffff', margin: '0 0 70px 0', letterSpacing: '2px' },
  visionQuoteText:{ fontSize: '18px', fontWeight: '500', color: '#ffffff', lineHeight: '1.6', margin: '0 auto', maxWidth: '360px', letterSpacing: '0.2px' },
  rightFormPanel: {
    flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center',
    justifyContent: 'center', backgroundColor: '#ffffff', padding: '40px', position: 'relative',
  },
  backButtonTopRight: {
    position: 'absolute', top: '30px', right: '30px', backgroundColor: 'transparent',
    color: '#000000', border: '1px solid #000000', borderRadius: '10px',
    padding: '8px 24px', fontSize: '11px', fontWeight: '700', cursor: 'pointer',
    fontFamily: 'inherit', letterSpacing: '0.5px',
  },
  formWrapper: { width: '100%', maxWidth: '380px', textAlign: 'center' },
  logoIconRightCentered: { display: 'flex', justifyContent: 'center', alignItems: 'center', marginBottom: '20px' },
  welcomeHeading:{ fontSize: '32px', fontWeight: '700', color: '#000000', margin: '0 0 8px 0', letterSpacing: '0.5px' },
  subLabel:     { fontSize: '13px', color: '#333333', margin: '0 0 20px 0', fontWeight: '600' },
  rulesBox:     { backgroundColor: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '10px', padding: '14px 16px', marginBottom: '20px', textAlign: 'left' },
  rulesTitle:   { fontSize: '12px', fontWeight: '700', color: '#475569', margin: '0 0 8px', fontFamily: '"Inter", system-ui, sans-serif' },
  rulesList:    { listStyle: 'none', margin: 0, padding: 0 },
  rulesItem:    { fontSize: '12px', color: '#64748b', lineHeight: '1.8', fontFamily: '"Inter", system-ui, sans-serif' },
  formBlock:    { display: 'flex', flexDirection: 'column', alignItems: 'center', width: '100%', gap: '0' },
  textInputBox: {
    padding: '16px 20px', fontSize: '14px', border: '1px solid #000000',
    borderRadius: '14px', outline: 'none', backgroundColor: 'transparent',
    marginBottom: '18px', fontFamily: 'inherit', boxSizing: 'border-box',
    width: '100%', maxWidth: '350px', textAlign: 'left',
  },
  resetActionSubmitBtn: {
    backgroundColor: '#000000', color: '#ffffff', border: 'none',
    padding: '16px', fontSize: '14px', fontWeight: '700', borderRadius: '25px',
    cursor: 'pointer', letterSpacing: '1px', fontFamily: 'inherit',
    width: '100%', maxWidth: '350px', transition: 'opacity 0.2s', marginTop: '10px',
  },
  eyeBtn: {
    position: 'absolute', right: '12px', top: 'calc(50% - 9px)',
    background: 'none', border: 'none', cursor: 'pointer',
    display: 'flex', alignItems: 'center', padding: '0', lineHeight: 1,
  },
  errorText: {
    fontSize: '13px', color: '#ef4444', margin: '0 0 12px', fontFamily: '"Inter", system-ui, sans-serif',
    textAlign: 'center', width: '100%', maxWidth: '350px',
  },
  successCircle: {
    width: '72px', height: '72px', borderRadius: '50%', backgroundColor: '#dcfce7',
    color: '#166534', fontSize: '32px', fontWeight: '700',
    display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto',
  },
};

// Responsive left panel display
if (typeof document !== 'undefined') {
  const styleSheet = document.createElement('style');
  styleSheet.textContent = `
    @media (min-width: 768px) {
      div[style*="margin: 12px 0px 12px 12px"] { display: flex !important; }
    }
    input::placeholder { color: #999999; }
    button:hover { opacity: 0.85; }
  `;
  document.head.appendChild(styleSheet);
}
