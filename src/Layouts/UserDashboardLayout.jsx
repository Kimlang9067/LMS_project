import React from 'react';
import { Outlet, useNavigate, useLocation } from 'react-router';

export default function UserDashboardLayout() {
  const navigate = useNavigate();
  const location = useLocation();

  // Dynamically extract logged-in user credentials from session memory
  const savedUser = localStorage.getItem('userAccount');
  const user = savedUser ? JSON.parse(savedUser) : { fullName: "New Explorer", username: "user" };

  // Helper function to track state highlights for active routing paths
  const isActive = (path) => location.pathname === path;

  const handleSignOut = () => {
    localStorage.removeItem('userAccount');
    alert('Logged out successfully. You must re-enter your credentials.');
    navigate('/signin');
  };

  return (
    <div style={styles.layoutContainer}>
      
      {/* ─── LEFT PANEL: SLIM MINIMALIST SIDEBAR ─── */}
      <aside style={styles.sidebar}>
        <div style={styles.sidebarTopGroup}>
          {/* Main App Brand Logo Symbol */}
          <div style={styles.appBrandLogo}>
            <svg width="22" height="22" viewBox="0 0 100 100" fill="white">
              <circle cx="50" cy="50" r="16" />
              <circle cx="24" cy="35" r="10" />
              <circle cx="76" cy="35" r="8" />
            </svg>
          </div>
          
          {/* Unified Navigation Tab Button Controllers */}
          <nav style={styles.iconNavList}>
            <button 
              onClick={() => navigate('/user/dashboard')} 
              style={{...styles.sidebarIconBtn, ...(isActive('/user/dashboard') ? styles.sidebarActiveIconBtn : {})}} 
              title="Activity Overview Panel"
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <rect x="3" y="3" width="7" height="7" /><rect x="14" y="3" width="7" height="7" />
                <rect x="14" y="14" width="7" height="7" /><rect x="3" y="14" width="7" height="7" />
              </svg>
            </button>
            <button 
              onClick={() => navigate('/user/profile')} 
              style={{...styles.sidebarIconBtn, ...(isActive('/user/profile') ? styles.sidebarActiveIconBtn : {})}} 
              title="Account Configuration Node"
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" /><circle cx="12" cy="7" r="4" />
              </svg>
            </button>
            <button 
              onClick={() => navigate('/books')} 
              style={styles.sidebarIconBtn} 
              title="Return to Public Library Catalog"
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20M4 19.5A2.5 2.5 0 0 0 6.5 22H20M4 19.5V3.5A2.5 2.5 0 0 1 6.5 1H20v21H6.5A2.5 2.5 0 0 1 4 19.5z" />
              </svg>
            </button>
          </nav>
        </div>

        {/* Global Exit Session Sidebar Control Trigger */}
        <button onClick={handleSignOut} style={styles.logoutIconBtn} title="Secure Sign Out">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4M16 17l5-5-5-5M21 12H9"/>
          </svg>
        </button>
      </aside>

      {/* ─── RIGHT AREA: FLEX CANVASES SUBTREE WRAPPERS ─── */}
      <div style={styles.mainCanvasWrapper}>
        
        {/* Top Floating Header Profile Credentials Bar Row */}
        <header style={styles.topProfileBar}>
          <div style={styles.userCredentialArea}>
            <div style={styles.avatarCircle}>👤</div>
            <div style={styles.textMetaGroup}>
              <h4 style={styles.userNameHeader}>{user.fullName}</h4>
              <p style={styles.userRoleTag}>@{user.username}</p>
            </div>
          </div>

          <div style={styles.systemTimeArea}>
            <div style={styles.timeStringStack}>
              <span style={styles.timeLabel}>User Workspace</span>
              <span style={styles.dateLabel}>Active Session Token</span>
            </div>
            <button onClick={() => navigate('/user/profile')} style={styles.settingsBtn} title="Quick Settings Profiles Route">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <circle cx="12" cy="12" r="3" />
                <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z" />
              </svg>
            </button>
          </div>
        </header>

        {/* Dynamic Nested Child Pages Area */}
        <div style={styles.childContentFrame}>
          <Outlet /> 
        </div>

      </div>
    </div>
  );
}

// ─── MASTER USER DASHBOARD SHELL LAYOUT STYLES ───
const styles = {
  layoutContainer: { display: 'flex', minHeight: '100vh', backgroundColor: '#ffffff', fontFamily: 'system-ui, -apple-system, sans-serif', overflow: 'hidden', boxSizing: 'border-box' },
  sidebar: { width: '65px', backgroundColor: '#0c1017', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', alignItems: 'center', padding: '24px 0', zIndex: 100 },
  sidebarTopGroup: { display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '40px', width: '100%' },
  appBrandLogo: { width: '32px', height: '32px', backgroundColor: 'rgba(255,255,255,0.08)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' },
  iconNavList: { display: 'flex', flexDirection: 'column', gap: '24px', width: '100%', alignItems: 'center' },
  sidebarIconBtn: { background: 'none', border: 'none', color: '#475569', padding: '8px', cursor: 'pointer', borderRadius: '8px', display: 'flex', alignItems: 'center', transition: 'color 0.15s' },
  sidebarActiveIconBtn: { color: '#ffffff', backgroundColor: 'rgba(255,255,255,0.08)' },
  logoutIconBtn: { background: 'none', border: 'none', color: '#ef4444', padding: '8px', cursor: 'pointer', borderRadius: '8px', display: 'flex', alignItems: 'center' },
  mainCanvasWrapper: { flex: 1, display: 'flex', flexDirection: 'column', padding: '20px 30px', gap: '20px', overflowY: 'auto', boxSizing: 'border-box' },
  topProfileBar: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', backgroundColor: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '12px', padding: '14px 24px', boxShadow: '0 1px 2px rgba(0,0,0,0.01)' },
  userCredentialArea: { display: 'flex', alignItems: 'center', gap: '14px' },
  avatarCircle: { fontSize: '20px', backgroundColor: '#f1f5f9', width: '38px', height: '38px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' },
  textMetaGroup: { textAlign: 'left' },
  userNameHeader: { margin: 0, fontSize: '14px', fontWeight: '700', color: '#0f172a' },
  userRoleTag: { margin: '2px 0 0 0', fontSize: '12px', fontWeight: '500', color: '#64748b' },
  systemTimeArea: { display: 'flex', alignItems: 'center', gap: '15px' },
  timeStringStack: { display: 'flex', flexDirection: 'column', alignItems: 'flex-end', fontSize: '12px', fontWeight: '700' },
  timeLabel: { color: '#0f172a' },
  dateLabel: { color: '#94a3b8', fontSize: '11px', marginTop: '1px' },
  settingsBtn: { background: 'none', border: 'none', color: '#475569', cursor: 'pointer', display: 'flex', alignItems: 'center' },
  childContentFrame: { flex: 1, display: 'flex', flexDirection: 'column', width: '100%' }
};

if (typeof document !== 'undefined') {
  const styleSheet = document.createElement('style');
  styleSheet.textContent = `
    button:hover { opacity: 0.85; }
    button[style*="color: rgb(71, 85, 105)"]:hover { color: #ffffff !important; }
  `;
  document.head.appendChild(styleSheet);
}
