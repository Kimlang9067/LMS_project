import React, { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { notifyLogin } from '../../utils/notifications';
import { login, initStaffAccounts } from '../../utils/auth';

function LibraryBookLogo({ size = 110 }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 220 220"
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
    >
      {/* Bottom Book */}
      <g transform="translate(18,130) rotate(8 90 22)">
        <rect x="18" y="8" rx="18" ry="18" width="150" height="40" fill="#173F7A" />
        <rect x="10" y="0" rx="18" ry="18" width="150" height="40" fill="#F6A313" />
        <path d="M20 12H145" stroke="#ffffff" strokeWidth="4" strokeLinecap="round" opacity="0.9" />
        <path d="M20 20H140" stroke="#ffffff" strokeWidth="3" strokeLinecap="round" opacity="0.85" />
        <path d="M20 28H132" stroke="#ffffff" strokeWidth="3" strokeLinecap="round" opacity="0.8" />
      </g>

      {/* Middle Blue Book */}
      <g transform="translate(35,92) rotate(-8 75 20)">
        <rect x="18" y="8" rx="16" ry="16" width="128" height="36" fill="#173F7A" />
        <rect x="10" y="0" rx="16" ry="16" width="128" height="36" fill="#1C9AD6" />
        <path d="M20 10H122" stroke="#ffffff" strokeWidth="4" strokeLinecap="round" opacity="0.95" />
        <path d="M20 18H118" stroke="#ffffff" strokeWidth="3" strokeLinecap="round" opacity="0.85" />
        <path d="M20 26H112" stroke="#ffffff" strokeWidth="3" strokeLinecap="round" opacity="0.8" />
      </g>

      {/* Thin Orange Book */}
      <g transform="translate(48,64) rotate(8 64 14)">
        <rect x="14" y="6" rx="12" ry="12" width="112" height="24" fill="#F6A313" />
        <rect x="8" y="0" rx="12" ry="12" width="112" height="24" fill="#FFD45E" opacity="0.25" />
      </g>

      {/* Top Dark Book */}
      <g transform="translate(52,24) rotate(-12 70 28)">
        <path d="M12 20L85 0L150 18L76 38L12 20Z" fill="#173F7A" />
        <path
          d="M22 24L78 36L143 18"
          stroke="#ffffff"
          strokeWidth="4"
          strokeLinecap="round"
          opacity="0.9"
        />
        <path
          d="M18 18L76 32L137 16"
          stroke="#0F2D5C"
          strokeWidth="6"
          strokeLinecap="round"
          opacity="0.55"
        />
      </g>
    </svg>
  );
}

export default function SignIn({ userAccount, setUserAccount }) { 
  const [memberId, setMemberId] = useState('');
  const [password, setPassword] = useState('');
  const [remember, setRemember] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const navigate = useNavigate();
  const formRef = useRef(null);

  useEffect(() => {
    initStaffAccounts();
  }, []);

  useEffect(() => {
    const clearForm = () => {
      setMemberId('');
      setPassword('');
      setRemember(false);

      if (formRef.current) {
        const elements = formRef.current.elements;
        for (let i = 0; i < elements.length; i++) {
          const el = elements[i];
          if (
            el.tagName === 'INPUT' &&
            el.type !== 'checkbox' &&
            el.type !== 'hidden'
          ) {
            el.value = '';
          }
        }
      }
    };

    clearForm();
    const t1 = setTimeout(clearForm, 50);
    const t2 = setTimeout(clearForm, 300);

    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
    };
  }, []);

  const handleSignIn = (e) => {
      e.preventDefault();

      if (!memberId || !password) {
        alert('Please enter your email/phone and password.');
        return;
      }

      const result = login(memberId, password);
      if (!result.success) {
        alert(result.message);
        return;
      }

      notifyLogin(result.user.fullName || result.user.username);

      if (typeof setUserAccount === 'function') {
        setUserAccount(result.user);
      }

      alert(`Log in successful! Welcome, ${result.user.fullName || 'User'}.`);
      navigate(result.redirect);
    };

  const hover = (on, off) => ({
    onMouseEnter: (e) => {
      e.currentTarget.style.backgroundColor = on;
    },
    onMouseLeave: (e) => {
      e.currentTarget.style.backgroundColor = off;
    },
  });

  return (
    <div style={s.page}>
      <main style={s.card}>
        {/* LEFT BRANDING PANEL */}
        <section style={s.leftPanel}>
          <div style={s.leftOverlay}>
            <div style={s.brandRow}>
              <div style={s.logoWrap}>
                <LibraryBookLogo size={95} />
              </div>

              <div style={s.brandTextWrap}>
                <h1 style={s.brandTitle}>Library Management</h1>
                <h2 style={s.brandSubtitle}>System</h2>
                <p style={s.brandTagline}>Institutional of Resource</p>
              </div>
            </div>

            <div>
              <blockquote style={s.quote}>
                "Knowledge is the only asset that increases when shared across borders."
              </blockquote>

              <div style={s.signatureRow}>
                <div style={s.signatureLine}></div>
                <span style={s.signatureText}>System Administrator</span>
              </div>
            </div>
          </div>
        </section>

        {/* RIGHT FORM PANEL */}
        <section style={s.rightPanel}>
          <div style={s.formWrapper}>
            {/* TOP TABS */}
            <div style={s.authTabs}>
              <button
                type="button"
                style={{ ...s.authTab, ...s.activeTab }}
                onClick={() => navigate('/signin')}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = '#ffffff';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = '#ffffff';
                }}
              >
                SIGN IN
              </button>

              <button
                type="button"
                style={s.authTab}
                onClick={() => navigate('/register')}
              >
                SIGN UP
              </button>
            </div>

            <header style={s.header}>
              <h2 style={s.welcomeHeading}>Welcome Back!</h2>
              <p style={s.subText}>
                Please enter your credentials to access the library.
              </p>
            </header>

            <form
              ref={formRef}
              onSubmit={handleSignIn}
              style={s.formBlock}
              autoComplete="off"
            >
              {/* Fake hidden fields to catch browser autofill */}
              <input
                type="text"
                name="fake-username"
                autoComplete="username"
                style={s.hiddenField}
                tabIndex={-1}
              />
              <input
                type="password"
                name="fake-password"
                autoComplete="current-password"
                style={s.hiddenField}
                tabIndex={-1}
              />

              <div>
                <label style={s.label} htmlFor="login-id">
                  PHONE NUMBER OR EMAIL
                </label>
                <input
                  id="login-id"
                  name="login-member-id-random"
                  type="text"
                  placeholder="Phone number or email"
                  value={memberId}
                  onChange={(e) => setMemberId(e.target.value)}
                  style={s.input}
                  autoComplete="off"
                  readOnly
                  onFocus={(e) => e.target.removeAttribute('readonly')}
                  required
                />
              </div>

              <div>
                <div style={s.labelRow}>
                  <label style={s.label} htmlFor="login-password">
                    PASSWORD
                  </label>

                  <span
                    onClick={() => navigate('/forgot-password')}
                    style={s.forgotLink}
                  >
                    Forgot Password?
                  </span>
                </div>

                <div style={{ position: 'relative' }}>
                  <input
                    id="login-password"
                    name="login-password-random"
                    type={showPassword ? 'text' : 'password'}
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    style={{ ...s.input, paddingRight: '44px' }}
                    autoComplete="new-password"
                    readOnly
                    onFocus={(e) => e.target.removeAttribute('readonly')}
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    style={s.eyeBtn}
                    tabIndex={-1}
                    aria-label={showPassword ? 'Hide password' : 'Show password'}
                  >
                    {showPassword ? (
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#9ca3af" strokeWidth="2" strokeLinecap="round">
                        <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"/>
                        <line x1="1" y1="1" x2="23" y2="23"/>
                      </svg>
                    ) : (
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#9ca3af" strokeWidth="2" strokeLinecap="round">
                        <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
                        <circle cx="12" cy="12" r="3"/>
                      </svg>
                    )}
                  </button>
                </div>
              </div>

              <div style={s.checkboxRow}>
                <input
                  id="remember"
                  type="checkbox"
                  checked={remember}
                  onChange={(e) => setRemember(e.target.checked)}
                  style={s.checkbox}
                />
                <label htmlFor="remember" style={s.checkboxLabel}>
                  Remember this session
                </label>
              </div>
              <button
                type="submit"
                style={s.submitBtn}
                {...hover('#000000', '#000000')}
              >
                Sign In
              </button>
            </form>

            <footer style={s.footer}>
              <p style={s.copyright}>© Data_Science Library Systems</p>

              <div style={s.footerLinks}>
                <span onClick={() => navigate('/register')} style={s.footerLink}>
                  Sign Up
                </span>
                <span style={s.footerLink}>System Status</span>
                <span style={s.footerLink}>Help Desk</span>
                <span style={s.footerLink}>Legal</span>
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
    minHeight: '100vh',
    backgroundColor: '#f8f9ff',
    backgroundImage: 'radial-gradient(#d5e3fc 1px, transparent 1px)',
    backgroundSize: '32px 32px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '24px',
    fontFamily: '"Inter", system-ui, sans-serif',
  },

  card: {
    width: '100%',
    maxWidth: '1000px',
    minHeight: '640px',
    backgroundColor: '#ffffff',
    borderRadius: '16px',
    boxShadow: '0 20px 50px rgba(0,0,0,0.15)',
    overflow: 'hidden',
    display: 'flex',
    flexWrap: 'wrap',
  },

  // LEFT PANEL
  leftPanel: {
    flex: '1 1 380px',
    backgroundColor: '#041627',
    position: 'relative',
    padding: '40px',
    display: 'flex',
  },

  leftOverlay: {
    position: 'relative',
    zIndex: 1,
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between',
    width: '100%',
    color: '#ffffff',
  },

  brandRow: {
    display: 'flex',
    alignItems: 'center',
    gap: '16px',
  },

  logoWrap: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },

  brandTextWrap: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
  },

  brandTitle: {
    fontSize: '24px',
    fontWeight: '700',
    margin: '0',
    color: '#ffffff',
    lineHeight: '1.2',
  },

  brandSubtitle: {
    fontSize: '18px',
    color: '#ff3b30',
    margin: '4px 0 8px 0',
    lineHeight: '1.2',
  },

  brandTagline: {
    fontSize: '13px',
    color: '#d7e3f1',
    margin: 0,
  },

  quote: {
    fontStyle: 'italic',
    fontSize: '16px',
    lineHeight: '1.6',
    color: '#ffffff',
    opacity: 0.9,
    margin: '0 0 16px 0',
  },

  signatureRow: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
  },

  signatureLine: {
    width: '40px',
    height: '1px',
    backgroundColor: '#8192a7',
  },

  signatureText: {
    fontSize: '11px',
    letterSpacing: '2px',
    textTransform: 'uppercase',
    color: '#8192a7',
  },

  // RIGHT PANEL
  rightPanel: {
    flex: '1 1 380px',
    padding: '40px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#ffffff',
  },

  formWrapper: {
    width: '100%',
    maxWidth: '380px',
  },

  authTabs: {
    display: 'flex',
    width: '100%',
    marginBottom: '32px',
    backgroundColor: '#dfe5f2',
    borderRadius: '8px',
    padding: '4px',
  },

  authTab: {
    flex: 1,
    border: 'none',
    backgroundColor: 'transparent',
    color: '#4b5563',
    fontSize: '14px',
    padding: '12px 0',
    cursor: 'pointer',
    borderRadius: '6px',
    fontWeight: '600',
    letterSpacing: '0.5px',
  },

  activeTab: {
    backgroundColor: '#ffffff',
    color: '#0f172a',
    boxShadow: '0 1px 2px rgba(0,0,0,0.06)',
  },


  header: {
    marginBottom: '24px',
  },

  welcomeHeading: {
    fontSize: '28px',
    fontWeight: '700',
    margin: '0 0 6px 0',
    color: '#0d1c2e',
  },

  subText: {
    fontSize: '14px',
    color: '#44474c',
    margin: 0,
  },

  formBlock: {
    display: 'flex',
    flexDirection: 'column',
    gap: '18px',
    position: 'relative',
  },

  label: {
    display: 'block',
    fontSize: '11px',
    letterSpacing: '1px',
    fontWeight: '600',
    color: '#5c5f61',
    marginBottom: '6px',
  },

  labelRow: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '6px',
  },

  forgotLink: {
    fontSize: '11px',
    fontWeight: '600',
    color: '#041627',
    cursor: 'pointer',
    textDecoration: 'underline',
  },

  input: {
    width: '100%',
    padding: '12px 14px',
    fontSize: '14px',
    border: '1px solid #c4c6cd',
    borderRadius: '8px',
    outline: 'none',
    boxSizing: 'border-box',
    fontFamily: '"Inter", system-ui, sans-serif',
    backgroundColor: '#ffffff',
  },

  checkboxRow: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
  },

  checkbox: {
    width: '16px',
    height: '16px',
    accentColor: '#041627',
  },

  checkboxLabel: {
    fontSize: '14px',
    color: '#44474c',
  },

submitBtn: {
  width: '100%',
  backgroundColor: '#000000',
  color: '#fefefe',
  border: 'none',
  padding: '14px',
  fontSize: '12px',
  fontWeight: '700',
  letterSpacing: '2px',
  textTransform: 'uppercase',
  borderRadius: '8px',
  cursor: 'pointer',
  marginTop: '2px',   // smaller gap
  transition: 'background-color 0.2s ease',
},

  footer: {
    marginTop: '32px',
    paddingTop: '24px',
    borderTop: '1px solid #c4c6cd',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '12px',
  },

  copyright: {
    fontSize: '11px',
    color: '#5c5f61',
    margin: 0,
  },

  footerLinks: {
    display: 'flex',
    gap: '20px',
    flexWrap: 'wrap',
    justifyContent: 'center',
  },

  footerLink: {
    fontSize: '11px',
    fontWeight: '600',
    color: '#44474c',
    cursor: 'pointer',
  },

  eyeBtn: {
    position: 'absolute',
    right: '12px',
    top: '50%',
    transform: 'translateY(-50%)',
    background: 'none',
    border: 'none',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    padding: '0',
    lineHeight: 1,
  },

  hiddenField: {
    position: 'absolute',
    opacity: 0,
    pointerEvents: 'none',
    width: '1px',
    height: '1px',
  },

};

