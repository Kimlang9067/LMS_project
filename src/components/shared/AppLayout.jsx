import React, { useState, useEffect } from 'react';
import { Outlet, useLocation, Link } from 'react-router';
import { DS, NAV_BASE } from './ds';
import LibraryBookLogo from './LibraryBookLogo';

// ── Nav icon lookup (keyed by URL segment) ───────────────────────────────────
const NAV_ICONS = {
  dashboard:    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/></svg>,
  users:        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75"/></svg>,
  admins:       <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>,
  books:        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20M4 19.5A2.5 2.5 0 0 0 6.5 22H20M4 19.5V3.5A2.5 2.5 0 0 1 6.5 1H20v21H6.5A2.5 2.5 0 0 1 4 19.5z"/></svg>,
  notifications:<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 0 1-3.46 0"/></svg>,
  policies:     <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/></svg>,
  budget:       <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2"><line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>,
  reports:      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2"><line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/></svg>,
  catalog:      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>,
  circulation:  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2"><polyline points="23 4 23 10 17 10"/><polyline points="1 20 1 14 7 14"/><path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15"/></svg>,
  members:      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75"/></svg>,
  fines:        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>,
  profile:      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>,
  messages:     <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>,
  about:        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>,
  help:         <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2"><circle cx="12" cy="12" r="10"/><path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>,
};

const ICON_LOGOUT = <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4M16 17l5-5-5-5M21 12H9"/></svg>;

function getIcon(path) {
  const seg = path.split('/').filter(Boolean).pop() || 'dashboard';
  return NAV_ICONS[seg] ?? NAV_ICONS.dashboard;
}

// ── AppLayout ─────────────────────────────────────────────────────────────────
// Unified layout used by every role: sidebar + sticky topbar + <Outlet />.
//
// Props
//   navItems    [{label, path, icon?}]    sidebar links; icon falls back to segment lookup
//   portalLabel string                    topbar left heading
//   displayName string                    user full name shown in topbar
//   roleLabel   string                    subtitle under name
//   avatarSrc   string | null             base64 avatar or null
//   onLogout    () => void
//   loginNotif  {visible, message, onDismiss}   one-time welcome banner
// ─────────────────────────────────────────────────────────────────────────────
export default function AppLayout({ navItems = [], portalLabel, displayName, roleLabel, avatarSrc, onLogout, loginNotif }) {
  const location = useLocation();
  const [hovered,   setHovered]   = useState(null);
  const [logoutHov, setLogoutHov] = useState(false);

  // Most specific (longest-path) nav item that matches the current URL — single source of truth
  const activeItem = [...navItems]
    .sort((a, b) => b.path.length - a.path.length)
    .find(item => location.pathname === item.path || location.pathname.startsWith(item.path + '/'));
  const topbarLabel = activeItem?.pageTitle || activeItem?.label || portalLabel;

  // Only the single active item is ever highlighted — no prefix bleed
  const isSelected = (path) => activeItem?.path === path;

  const linkStyle = (path) => ({
    ...NAV_BASE,
    ...(isSelected(path)
      ? { backgroundColor: DS.navActiveBg,  color: DS.navActiveColor }
      : hovered === path
      ? { backgroundColor: DS.navHoverBg,   color: DS.navHoverColor }
      : {}),
  });

  const iconColor = (path) =>
    isSelected(path) || hovered === path ? DS.iconActiveColor : DS.iconColor;

  return (
    <div style={{ display: 'flex', minHeight: '100vh', fontFamily: DS.font, backgroundColor: DS.contentBg }}>

      {/* ── SIDEBAR ────────────────────────────────────────────────────────── */}
      <aside style={L.sidebar}>

        <div style={L.logoWrap}>
          <LibraryBookLogo size={56} />
          <div style={L.logoText}>
            <span style={L.logoTitle}>Library Management</span>
            <span style={L.logoSystem}>System</span>
            <span style={L.logoSub}>Institutional Resource</span>
          </div>
        </div>

        <nav style={L.nav}>
          {navItems.map((item) => {
            const icon = item.icon ?? getIcon(item.path);
            return (
              <Link
                key={item.path}
                to={item.path}
                style={linkStyle(item.path)}
                onMouseEnter={() => setHovered(item.path)}
                onMouseLeave={() => setHovered(null)}
              >
                <span style={{ display: 'flex', alignItems: 'center', color: iconColor(item.path), flexShrink: 0, transition: 'color 0.15s' }}>
                  {icon}
                </span>
                {item.label}
              </Link>
            );
          })}
        </nav>

        <button
          onClick={onLogout}
          onMouseEnter={() => setLogoutHov(true)}
          onMouseLeave={() => setLogoutHov(false)}
          style={{ ...NAV_BASE, color: DS.logoutColor, ...(logoutHov ? { backgroundColor: DS.logoutHoverBg } : {}) }}
        >
          <span style={{ display: 'flex', alignItems: 'center', color: DS.logoutColor }}>{ICON_LOGOUT}</span>
          Log out
        </button>
      </aside>

      {/* ── MAIN ───────────────────────────────────────────────────────────── */}
      <div style={L.main}>

        <header style={L.topbar}>
          <span style={L.portalLabel}>{topbarLabel}</span>
          <div style={L.profileRight}>
            <div style={L.avatarCircle}>
              {avatarSrc
                ? <img src={avatarSrc} alt="avatar" style={{ width: '100%', height: '100%', borderRadius: '50%', objectFit: 'cover' }} />
                : '👤'}
            </div>
            <div>
              <p style={L.userName}>{displayName}</p>
              <p style={L.userRole}>{roleLabel}</p>
            </div>
          </div>
        </header>

        {loginNotif?.visible && (
          <div style={L.notifBanner}>
            <span>{loginNotif.message}</span>
            <button onClick={loginNotif.onDismiss} style={L.notifClose}>✕</button>
          </div>
        )}

        <div style={L.content}>
          <Outlet />
        </div>
      </div>
    </div>
  );
}

const L = {
  sidebar: {
    width: DS.sidebarWidth,
    backgroundColor: DS.sidebarBg,
    color: '#fff',
    padding: '0 12px 20px',
    display: 'flex',
    flexDirection: 'column',
    position: 'sticky',
    top: 0,
    height: '100vh',
    overflowY: 'auto',
    flexShrink: 0,
  },
  logoWrap: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    padding: '20px 8px 18px',
    borderBottom: '1px solid #1a1a1a',
    marginBottom: '8px',
    flexShrink: 0,
  },
  logoText:   { display: 'flex', flexDirection: 'column', flex: 1 },
  logoTitle:  { color: '#fff', fontWeight: '800', fontSize: '13px', lineHeight: 1.3 },
  logoSystem: { color: DS.logoSystemColor, fontWeight: '800', fontSize: '13px', textAlign: 'center' },
  logoSub:    { color: '#4b5563', fontSize: '10px', marginTop: '4px', fontWeight: '500' },

  nav:  { display: 'flex', flexDirection: 'column', gap: '4px', flex: 1 },
  main: { flex: 1, display: 'flex', flexDirection: 'column', minWidth: 0 },

  topbar: {
    height: DS.topbarHeight,
    backgroundColor: DS.topbarBg,
    borderBottom: `1px solid ${DS.topbarBorder}`,
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '0 30px',
    position: 'sticky',
    top: 0,
    zIndex: 40,
    flexShrink: 0,
  },
  portalLabel:  { fontSize: '18px', fontWeight: '700', color: DS.textDark },
  profileRight: { display: 'flex', alignItems: 'center', gap: '12px' },
  avatarCircle: {
    fontSize: '18px', backgroundColor: '#f1f5f9',
    width: '38px', height: '38px', borderRadius: '50%',
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    overflow: 'hidden', flexShrink: 0,
  },
  userName: { margin: 0, fontSize: '14px', fontWeight: '700', color: DS.textDark },
  userRole: { margin: '2px 0 0', fontSize: '12px', fontWeight: '500', color: DS.textLight },

  notifBanner: {
    display: 'flex', justifyContent: 'space-between', alignItems: 'center',
    backgroundColor: '#dcfce7', color: '#166534',
    padding: '12px 30px', fontSize: '14px',
    borderBottom: '1px solid #bbf7d0', flexShrink: 0,
  },
  notifClose: { background: 'none', border: 'none', color: '#166534', fontSize: '18px', cursor: 'pointer' },
  content:    { padding: '30px', flex: 1, overflowY: 'auto' },
};
