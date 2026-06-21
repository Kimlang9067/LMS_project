import React, { useState } from 'react';
import { useNavigate } from 'react-router';

export default function ResetPassword() {
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const navigate = useNavigate();

  const handleResetSubmit = (e) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      alert("Passwords do not match!");
      return;
    }
    alert('Your password has been reset successfully!');
    navigate('/signin'); 
  };

  const handleBackAction = () => {
    navigate('/forgot-password');
  };

  return (
    <div style={styles.screenContainer}>
      
      {/* LEFT SIDE: BLACK BRAND COVER PANEL */}
      <div style={styles.leftBrandPanel}>
        <div style={styles.brandContainer}>
          {/* White Accent Logo */}
          <div style={styles.logoIconLeftBrand}>
            <svg width="85" height="85" viewBox="0 0 100 100" fill="white">
              <circle cx="50" cy="50" r="18" />
              <circle cx="22" cy="35" r="11" />
              <circle cx="78" cy="35" r="9" />
              <circle cx="28" cy="72" r="13" />
              <circle cx="72" cy="70" r="10" />
              <circle cx="52" cy="18" r="8" />
              <circle cx="50" cy="82" r="7" />
            </svg>
          </div>

          {/* Brand Titles */}
          <h1 style={styles.brandTitle}>
            <span style={styles.textSlate}>Data</span>
            <span style={styles.textRed}>_Science</span>
          </h1>
          <h2 style={styles.brandSubtitle}>Library</h2>

          {/* Subtext Quote Statement */}
          <p style={styles.visionQuoteText}>
            "Your premier digital library for borrowing and reading books"
          </p>
        </div>
      </div>

      {/* RIGHT SIDE: PASSWORD RESET INPUT PANEL */}
      <div style={styles.rightFormPanel}>
        {/* Top Right Aligned Back Navigation Button */}
        <button type="button" onClick={handleBackAction} style={styles.backButtonTopRight}>
          BACK
        </button>

        <div style={styles.formWrapper}>
          {/* Centered Large Black SVG Logo */}
          <div style={styles.logoIconRightCentered}>
            <svg width="85" height="85" viewBox="0 0 100 100" fill="black">
              <circle cx="50" cy="50" r="16" />
              <circle cx="24" cy="35" r="10" />
              <circle cx="76" cy="35" r="8" />
              <circle cx="30" cy="70" r="12" />
              <circle cx="70" cy="68" r="9" />
              <circle cx="52" cy="20" r="7" />
              <circle cx="50" cy="80" r="6" />
            </svg>
          </div>

          <h2 style={styles.welcomeHeading}>Reset Password</h2>
          <p style={styles.subLabel}>Please enter your new password</p>

          <form onSubmit={handleResetSubmit} style={styles.formBlock}>
            {/* New Password Box Field */}
            <input
              type="password"
              placeholder="New Password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              style={styles.textInputBox}
              required
            />

            {/* Confirm Password Box Field */}
            <input
              type="password"
              placeholder="Confirm Password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              style={styles.textInputBox}
              required
            />

            {/* Action Form Submit Button */}
            <button type="submit" style={styles.resetActionSubmitBtn}>
              RESET PASSWORD
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

// --- EXACT BLUEPRINT THEME STYLES ---
const styles = {
  screenContainer: {
    display: 'flex',
    minHeight: '100vh',
    backgroundColor: '#ffffff',
    fontFamily: '"Courier New", Courier, monospace',
    position: 'relative',
  },
  leftBrandPanel: {
    flex: 1,
    backgroundColor: '#000000',
    margin: '12px 0 12px 12px',
    borderRadius: '45px', // Uniform perfectly rounded card edge profile
    display: 'none', 
    md: 'flex', 
    alignItems: 'center',
    justifyContent: 'center',
    padding: '40px',
  },
  brandContainer: {
    textAlign: 'center',
    color: '#ffffff',
    width: '100%',
    maxWidth: '400px',
  },
  logoIconLeftBrand: {
    marginBottom: '20px',
    display: 'flex',
    justifyContent: 'center',
  },
  brandTitle: {
    fontSize: '34px',
    fontWeight: '700',
    margin: '0 0 4px 0',
    letterSpacing: '1px',
  },
  textSlate: {
    color: '#5c7080',
  },
  textRed: {
    color: '#ff3b30',
  },
  brandSubtitle: {
    fontSize: '26px',
    fontWeight: '500',
    color: '#ffffff',
    margin: '0 0 70px 0',
    letterSpacing: '2px',
  },
  visionQuoteText: {
    fontSize: '18px',
    fontWeight: '500',
    color: '#ffffff',
    lineHeight: '1.6',
    margin: '0 auto',
    maxWidth: '360px',
    letterSpacing: '0.2px',
  },
  rightFormPanel: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#ffffff',
    padding: '40px',
    position: 'relative',
  },
  backButtonTopRight: {
    position: 'absolute',
    top: '30px',
    right: '30px',
    backgroundColor: 'transparent',
    color: '#000000',
    border: '1px solid #000000',
    borderRadius: '10px',
    padding: '8px 24px',
    fontSize: '11px',
    fontWeight: '700',
    cursor: 'pointer',
    fontFamily: 'inherit',
    letterSpacing: '0.5px',
  },
  formWrapper: {
    width: '100%',
    maxWidth: '380px',
    textAlign: 'center',
  },
  logoIconRightCentered: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: '25px',
  },
  welcomeHeading: {
    fontSize: '32px',
    fontWeight: '700',
    color: '#000000',
    margin: '0 0 16px 0',
    letterSpacing: '0.5px',
  },
  subLabel: {
    fontSize: '13px',
    color: '#333333',
    margin: '0 0 35px 0',
    fontWeight: '600',
    letterSpacing: '0.2px',
  },
  formBlock: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    width: '100%',
  },
  textInputBox: {
    padding: '16px 20px',
    fontSize: '14px',
    border: '1px solid #000000',
    borderRadius: '14px',
    outline: 'none',
    backgroundColor: 'transparent',
    marginBottom: '18px',
    fontFamily: 'inherit',
    boxSizing: 'border-box',
    width: '100%',
    maxWidth: '350px',
    textAlign: 'left',
  },
  resetActionSubmitBtn: {
    backgroundColor: '#000000',
    color: '#ffffff',
    border: 'none',
    padding: '16px',
    fontSize: '14px',
    fontWeight: '700',
    borderRadius: '25px',
    cursor: 'pointer',
    letterSpacing: '1px',
    fontFamily: 'inherit',
    width: '100%',
    maxWidth: '350px',
    transition: 'opacity 0.2s',
    marginTop: '10px',
  },
};

// Injection rules to make the layout responsive on mobile viewports
if (typeof document !== 'undefined') {
  const styleSheet = document.createElement('style');
  styleSheet.textContent = `
    @media (min-width: 768px) {
      div[style*="margin: 12px 0px 12px 12px"] {
        display: flex !important;
      }
    }
    input::placeholder {
      color: #999999;
    }
    button:hover {
      opacity: 0.85;
    }
  `;
  document.head.appendChild(styleSheet);
}
