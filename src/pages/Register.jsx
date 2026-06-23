import React, { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ROLES, setSession } from '../utils/auth';

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
        <path
          d="M12 20L85 0L150 18L76 38L12 20Z"
          fill="#173F7A"
        />
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


const initialForm = {
  username: '',
  email: '',
  phone: '',
  password: '',
  confirmPassword: '',
  agree: false,
};

export default function Register() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState(initialForm);
  const formRef = useRef(null);

  // Clear state on mount and again after short delays
  // to fight browser autofill/password manager behavior
  useEffect(() => {
    const clearForm = () => {
      setFormData(initialForm);

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

  const handleChange = (field) => (e) => {
    const value = field === 'agree' ? e.target.checked : e.target.value;
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleRegister = (e) => {
    e.preventDefault();

    const { username, email, phone, password, confirmPassword, agree } = formData;

    if (!username || !email || !phone || !password || !confirmPassword) {
      alert('Please fill in all fields.');
      return;
    }

    if (password !== confirmPassword) {
      alert('Passwords do not match.');
      return;
    }

    if (!agree) {
      alert('Please agree to the registration terms.');
      return;
    }

    // Save user information
    const userAccount = {
      fullName: username,
      username,
      email,
      phone,
      password,
      role: ROLES.MEMBER,
      userId: `LIB-${Date.now()}`,
      status: 'Active Member',
      joinedDate: new Date().toLocaleDateString(),
    };

    localStorage.setItem('userAccount', JSON.stringify(userAccount));

    setSession({
      ...userAccount,
      loginAt: new Date().toISOString(),
    });

    alert('Registration Successful!');

    setFormData(initialForm);

    // Go directly to profile page
    navigate('/userdashboard');
  };

  const hover = (on, off) => ({
    onMouseEnter: (e) => (e.currentTarget.style.backgroundColor = on),
    onMouseLeave: (e) => (e.currentTarget.style.backgroundColor = off),
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

            <div style={s.quoteBox}>
              <blockquote style={s.quote}>
                “A room without books is like a body without a soul.”
              </blockquote>

              <div style={s.signatureRow}>
                <div style={s.signatureLine}></div>
                <span style={s.signatureText}>LIBRARY MOTTO</span>
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
                style={s.authTab}
                onClick={() => navigate('/signin')}
              >
                SIGN IN
              </button>

              <button
                type="button"
                style={{ ...s.authTab, ...s.activeTab }}
                onClick={() => {
                  setFormData(initialForm);
                  navigate('/register');
                }}
              >
                SIGN UP
              </button>
            </div>

            <header style={{ marginBottom: '24px' }}>
              <h2 style={s.welcomeHeading}>Create Account</h2>
              <p style={s.subText}>
                Please enter your details to register for the library.
              </p>
            </header>

            <form
              ref={formRef}
              onSubmit={handleRegister}
              style={s.formBlock}
              autoComplete="off"
            >
              {/* Hidden fake fields to reduce browser autofill */}
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
                <label style={s.label} htmlFor="reg-user-name">
                  USER NAME
                </label>
                <input
                  id="reg-user-name"
                  name="reg-user-name"
                  type="text"
                  placeholder="User Name"
                  value={formData.username}
                  onChange={handleChange('username')}
                  style={s.input}
                  autoComplete="off"
                  required
                />
              </div>

              <div>
                <label style={s.label} htmlFor="reg-email-address">
                  EMAIL
                </label>
                <input
                  id="reg-email-address"
                  name="reg-email-address"
                  type="email"
                  placeholder="Email Adress"
                  value={formData.email}
                  onChange={handleChange('email')}
                  style={s.input}
                  autoComplete="off"
                  required
                />
              </div>

              <div>
                <label style={s.label} htmlFor="reg-phone-number">
                  PHONE NUMBER
                </label>
                <input
                  id="reg-phone-number"
                  name="reg-phone-number"
                  type="tel"
                  placeholder="Phone Number"
                  value={formData.phone}
                  onChange={handleChange('phone')}
                  style={s.input}
                  autoComplete="off"
                  required
                />
              </div>

              <div>
                <label style={s.label} htmlFor="reg-new-password">
                  PASSWORD
                </label>
                <input
                  id="reg-new-password"
                  name="reg-new-password"
                  type="password"
                  placeholder="Password"
                  value={formData.password}
                  onChange={handleChange('password')}
                  style={s.input}
                  autoComplete="new-password"
                  required
                />
              </div>

              <div>
                <label style={s.label} htmlFor="reg-confirm-new-password">
                  CONFIRM PASSWORD
                </label>
                <input
                  id="reg-confirm-new-password"
                  name="reg-confirm-new-password"
                  type="password"
                  placeholder="Confirm Your Password"
                  value={formData.confirmPassword}
                  onChange={handleChange('confirmPassword')}
                  style={s.input}
                  autoComplete="new-password"
                  required
                />
              </div>

              <div style={s.checkboxRow}>
                <input
                  id="agree"
                  type="checkbox"
                  checked={formData.agree}
                  onChange={handleChange('agree')}
                  style={s.checkbox}
                />
                <label htmlFor="agree" style={s.checkboxLabel}>
                  I agree to the registration terms
                </label>
              </div>

              <button
                type="submit"
                style={s.submitBtn}
                {...hover('#1a2b3c', '#041627')}
              >
                SIGN UP
              </button>
            </form>

            <footer style={s.footer}>
              <p style={s.copyright}>© Data_Science Library Systems</p>
              <div style={s.footerLinks}>
                <span onClick={() => navigate('/signin')} style={s.footerLink}>
                  Sign In
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
    position: 'relative',
    padding: '40px',
    display: 'flex',
    backgroundColor: '#041627',
    backgroundImage:
      'linear-gradient(rgba(4,22,39,0.72), rgba(4,22,39,0.88)), url("/book-library.jpg")',
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    backgroundRepeat: 'no-repeat',
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

  brandTitle: {
    fontSize: '24px',
    fontWeight: '700',
    margin: '16px 0 0 0',
  },

  brandSubtitle: {
    fontSize: '18px',
    color: '#ff3b30',
    margin: '4px 0 12px 0',
  },

  brandTagline: {
    fontSize: '13px',
    color: '#d7e3f1',
    margin: 0,
  },

  quoteBox: {
    backgroundColor: 'rgba(255,255,255,0.06)',
    padding: '18px',
    borderRadius: '12px',
    backdropFilter: 'blur(2px)',
  },

  quote: {
    fontStyle: 'italic',
    fontSize: '16px',
    lineHeight: '1.7',
    color: '#ffffff',
    opacity: 0.95,
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
    backgroundColor: '#b7c8de',
  },

  signatureText: {
    fontSize: '11px',
    letterSpacing: '2px',
    textTransform: 'uppercase',
    color: '#b7c8de',
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
  },

  label: {
    display: 'block',
    fontSize: '11px',
    letterSpacing: '1px',
    fontWeight: '600',
    color: '#5c5f61',
    marginBottom: '6px',
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
    backgroundColor: '#041627',
    color: '#ffffff',
    border: 'none',
    padding: '14px',
    fontSize: '12px',
    fontWeight: '700',
    letterSpacing: '2px',
    textTransform: 'uppercase',
    borderRadius: '8px',
    cursor: 'pointer',
    marginTop: '8px',
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

  hiddenField: {
    position: 'absolute',
    opacity: 0,
    pointerEvents: 'none',
    width: '1px',
    height: '1px',
  },

  logoWrap: {
  display: 'flex',
  justifyContent: 'flex-start',
  alignItems: 'center',
  marginBottom: '6px',
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
};
