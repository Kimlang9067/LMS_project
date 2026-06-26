import React, { useState, useEffect, useRef } from 'react';
import { Outlet, useLocation, Link } from 'react-router';
import { DS, NAV_BASE } from './ds';
import LibraryBookLogo from './LibraryBookLogo';
import { useLang } from '../../utils/i18n';
import { useTheme } from '../../utils/theme';
import { getSession, setSession, getRoleLabel, ROLES } from '../../utils/auth';

// ── Force Password Reset overlay ─────────────────────────────────────────────
// Shown when session.requirePasswordReset === true. Blocks all navigation.
function ForcePasswordReset({ session, isDark, onDone }) {
  const [pw,  setPw]  = useState('');
  const [pw2, setPw2] = useState('');
  const [err, setErr] = useState('');
  const [ok,  setOk]  = useState(false);
  const [show, setShow] = useState(false);

  const strength = pw.length === 0 ? null
    : pw.length < 6  ? { label: 'Too short', color: '#ef4444', pct: 20 }
    : pw.length < 8  ? { label: 'Weak',      color: '#f59e0b', pct: 45 }
    : /[A-Z]/.test(pw) && /[0-9]/.test(pw) && /[^A-Za-z0-9]/.test(pw)
    ? { label: 'Strong', color: '#10b981', pct: 100 }
    : { label: 'Fair',   color: '#3b82f6', pct: 70 };

  const handleSave = () => {
    setErr('');
    if (pw.length < 6)  { setErr('Password must be at least 6 characters.'); return; }
    if (pw !== pw2)     { setErr('Passwords do not match.'); return; }

    // Save to the right storage location
    const updated = { ...session, requirePasswordReset: false };
    setSession(updated);

    if (session.role === ROLES.MEMBER) {
      try {
        const u = JSON.parse(localStorage.getItem('userAccount') || '{}');
        localStorage.setItem('userAccount', JSON.stringify({ ...u, password: pw }));
      } catch {}
    } else {
      try {
        const accs = JSON.parse(localStorage.getItem('libraryStaffAccounts') || '[]');
        localStorage.setItem('libraryStaffAccounts', JSON.stringify(
          accs.map(a => a.id === session.id ? { ...a, password: pw, requirePasswordReset: false } : a)
        ));
      } catch {}
    }

    window.dispatchEvent(new CustomEvent('profileUpdated'));
    setOk(true);
    setTimeout(onDone, 1800);
  };

  const panelBg = isDark ? '#0f172a' : '#fff';
  const bord    = isDark ? '#334155' : '#e2e8f0';
  const text    = isDark ? '#f1f5f9' : '#0f172a';
  const sub     = isDark ? '#94a3b8' : '#64748b';
  const inpBg   = isDark ? '#1F2937' : '#fff';

  return (
    <div style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(6px)', zIndex: 9000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px', fontFamily: DS.font }}>
      <div style={{ backgroundColor: panelBg, borderRadius: '18px', padding: '36px', width: '100%', maxWidth: '440px', boxShadow: '0 24px 64px rgba(0,0,0,0.4)', border: `1px solid ${bord}` }}>

        {/* Icon + title */}
        <div style={{ textAlign: 'center', marginBottom: '28px' }}>
          <div style={{ width: '60px', height: '60px', borderRadius: '16px', backgroundColor: '#fef3c7', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '28px', margin: '0 auto 16px' }}>🔑</div>
          <h2 style={{ margin: '0 0 8px', fontSize: '20px', fontWeight: '800', color: text }}>Set Your Password</h2>
          <p style={{ margin: 0, fontSize: '14px', color: sub, lineHeight: '1.5' }}>
            Your account was created by an administrator.<br />
            You must set a personal password before continuing.
          </p>
        </div>

        {ok ? (
          <div style={{ textAlign: 'center', padding: '20px', backgroundColor: '#dcfce7', borderRadius: '12px', color: '#166534' }}>
            <p style={{ margin: 0, fontSize: '15px', fontWeight: '700' }}>✓ Password updated! Continuing…</p>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {/* New password */}
            <div>
              <label style={{ display: 'block', fontSize: '11px', fontWeight: '700', color: sub, marginBottom: '6px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>New Password</label>
              <div style={{ position: 'relative' }}>
                <input
                  type={show ? 'text' : 'password'}
                  value={pw}
                  onChange={e => { setPw(e.target.value); setErr(''); }}
                  placeholder="At least 8 characters"
                  style={{ width: '100%', padding: '11px 42px 11px 14px', boxSizing: 'border-box', border: `1px solid ${bord}`, borderRadius: '10px', fontSize: '14px', outline: 'none', backgroundColor: inpBg, color: text, fontFamily: DS.font }}
                />
                <button type="button" onClick={() => setShow(s => !s)} style={{ position: 'absolute', right: '12px', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: sub, padding: 0 }}>
                  {show ? '🙈' : '👁'}
                </button>
              </div>
              {/* Strength bar */}
              {strength && (
                <div style={{ marginTop: '8px' }}>
                  <div style={{ height: '4px', backgroundColor: isDark ? '#334155' : '#e2e8f0', borderRadius: '4px', overflow: 'hidden' }}>
                    <div style={{ height: '100%', width: `${strength.pct}%`, backgroundColor: strength.color, borderRadius: '4px', transition: 'width 0.3s, background-color 0.3s' }} />
                  </div>
                  <p style={{ margin: '4px 0 0', fontSize: '11px', fontWeight: '700', color: strength.color }}>{strength.label}</p>
                </div>
              )}
            </div>

            {/* Confirm */}
            <div>
              <label style={{ display: 'block', fontSize: '11px', fontWeight: '700', color: sub, marginBottom: '6px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Confirm Password</label>
              <input
                type="password"
                value={pw2}
                onChange={e => { setPw2(e.target.value); setErr(''); }}
                placeholder="Re-enter new password"
                style={{ width: '100%', padding: '11px 14px', boxSizing: 'border-box', border: `1px solid ${pw2 && pw2 !== pw ? '#ef4444' : bord}`, borderRadius: '10px', fontSize: '14px', outline: 'none', backgroundColor: inpBg, color: text, fontFamily: DS.font }}
              />
              {pw2 && pw2 === pw && <p style={{ margin: '4px 0 0', fontSize: '11px', fontWeight: '700', color: '#10b981' }}>✓ Passwords match</p>}
            </div>

            {err && <p style={{ margin: 0, fontSize: '13px', color: '#ef4444', fontWeight: '600' }}>⚠ {err}</p>}

            <button
              onClick={handleSave}
              style={{ padding: '13px', backgroundColor: '#6366f1', color: '#fff', border: 'none', borderRadius: '10px', fontSize: '15px', fontWeight: '700', cursor: 'pointer', fontFamily: DS.font, marginTop: '4px' }}
            >
              Set Password &amp; Continue →
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

// ── Nav icon lookup (keyed by URL segment) ────────────────────────────────────
const NAV_ICONS = {
  dashboard:    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/></svg>,
  users:        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75"/></svg>,
  accounts:     <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75"/></svg>,
  books:        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20M4 19.5A2.5 2.5 0 0 0 6.5 22H20M4 19.5V3.5A2.5 2.5 0 0 1 6.5 1H20v21H6.5A2.5 2.5 0 0 1 4 19.5z"/></svg>,
  notifications:<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 0 1-3.46 0"/></svg>,
  budget:       <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2"><line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>,
  reports:      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2"><line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/></svg>,
  catalog:      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>,
  members:      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75"/></svg>,
  fines:        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>,
  messages:     <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>,
  inbox:        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 0 1-3.46 0"/></svg>,
  about:        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>,
  help:         <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2"><circle cx="12" cy="12" r="10"/><path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>,
  settings:     <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"/></svg>,
  librarians:   <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20M4 19.5A2.5 2.5 0 0 0 6.5 22H20M4 19.5V3.5A2.5 2.5 0 0 1 6.5 1H20v21H6.5A2.5 2.5 0 0 1 4 19.5z"/></svg>,
  staff:        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/></svg>,
};

const ICON_LOGOUT = <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4M16 17l5-5-5-5M21 12H9"/></svg>;

function getIcon(path) {
  const seg = path.split('/').filter(Boolean).pop() || 'dashboard';
  return NAV_ICONS[seg] ?? NAV_ICONS.settings;
}

// ── Avatar helpers ─────────────────────────────────────────────────────────────
const AVATAR_COLORS = ['#6366f1','#3b82f6','#10b981','#f59e0b','#ef4444','#8b5cf6','#06b6d4','#ec4899','#14b8a6'];

function avatarColor(name = '') {
  let h = 0;
  for (let i = 0; i < name.length; i++) h = name.charCodeAt(i) + ((h << 5) - h);
  return AVATAR_COLORS[Math.abs(h) % AVATAR_COLORS.length];
}

function initials(name = '') {
  return name.split(' ').filter(Boolean).slice(0, 2).map(w => w[0].toUpperCase()).join('') || '?';
}

function InitialsAvatar({ name, size = 38, fontSize = 14 }) {
  return (
    <div style={{
      width: size, height: size, borderRadius: '50%',
      backgroundColor: avatarColor(name),
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      color: '#fff', fontWeight: '700', fontSize,
      flexShrink: 0, userSelect: 'none',
    }}>
      {initials(name)}
    </div>
  );
}

// ── i18n label map ─────────────────────────────────────────────────────────────
const LABEL_KEYS = {
  'Home': 'home', 'Dashboard': 'dashboard', 'Accounts': 'accounts',
  'Catalog': 'catalog', 'Reports': 'reports', 'Notifications': 'notifications',
  'Settings': 'settings', 'Budget': 'budget', 'Fines': 'fines',
  'Members': 'members', 'Books': 'books', 'Messages': 'messages',
  'Inbox': 'inbox',
};

// ── Profile Drawer ────────────────────────────────────────────────────────────
function ProfileDrawer({ isOpen, onClose, isDark, avatarSrc: initialAvatar, settingsPath, displayName }) {
  const session = getSession();

  // Figure out the avatar storage key
  const [avatarKey] = useState(() => {
    if (!session) return null;
    if (session.role === ROLES.MEMBER) {
      const u = JSON.parse(localStorage.getItem('userAccount') || '{}');
      return `memberAvatar_${u.username || 'member'}`;
    }
    return `staffAvatar_${session.id}`;
  });

  const [avatar, setAvatar] = useState(() => avatarKey ? localStorage.getItem(avatarKey) : initialAvatar);
  const [editing, setEditing] = useState(false);
  const [saved, setSaved] = useState(false);
  const [form, setForm] = useState({ name: '', email: '', phone: '' });
  const fileRef = useRef(null);

  // Sync avatar when parent updates it
  useEffect(() => { if (initialAvatar && !avatarKey) setAvatar(initialAvatar); }, [initialAvatar]);

  // Refresh everything when drawer opens
  useEffect(() => {
    if (!isOpen) { setEditing(false); setSaved(false); return; }
    const sess = getSession();
    if (sess) {
      setForm({ name: sess.fullName || '', email: sess.email || '', phone: sess.phone || '' });
    } else {
      const u = JSON.parse(localStorage.getItem('userAccount') || '{}');
      setForm({ name: u.fullName || u.username || '', email: u.email || '', phone: u.phone || '' });
    }
    if (avatarKey) setAvatar(localStorage.getItem(avatarKey) || initialAvatar || null);
  }, [isOpen]);

  const handleAvatarChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 2 * 1024 * 1024) { alert('Image must be 2 MB or smaller.'); return; }
    const reader = new FileReader();
    reader.onload = ev => {
      const b64 = ev.target.result;
      if (avatarKey) localStorage.setItem(avatarKey, b64);
      setAvatar(b64);
      window.dispatchEvent(new CustomEvent('avatarUpdated'));
    };
    reader.readAsDataURL(file);
  };

  const handleSave = () => {
    const sess = getSession();
    if (!sess) return;
    const updated = { fullName: form.name, email: form.email, phone: form.phone };
    if (sess.role === ROLES.MEMBER) {
      const u = JSON.parse(localStorage.getItem('userAccount') || '{}');
      localStorage.setItem('userAccount', JSON.stringify({ ...u, ...updated }));
    } else {
      const accs = JSON.parse(localStorage.getItem('libraryStaffAccounts') || '[]');
      localStorage.setItem('libraryStaffAccounts', JSON.stringify(accs.map(a => a.id === sess.id ? { ...a, ...updated } : a)));
    }
    setSession({ ...sess, ...updated });
    window.dispatchEvent(new CustomEvent('profileUpdated'));
    setEditing(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 3500);
  };

  const panelBg  = isDark ? '#0f172a'  : '#ffffff';
  const borderC  = isDark ? '#1e293b'  : '#e2e8f0';
  const textP    = isDark ? '#f1f5f9'  : '#0f172a';
  const textS    = isDark ? '#94a3b8'  : '#64748b';
  const inputBg  = isDark ? '#1F2937'  : '#f8fafc';
  const rowBg    = isDark ? '#1e293b'  : '#f8fafc';
  const userId   = session?.userId || session?.id || '—';
  const roleStr  = session ? getRoleLabel(session.role) : 'Member';

  if (!isOpen) return null;

  return (
    <>
      <div style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.45)', zIndex: 300, backdropFilter: 'blur(2px)' }} onClick={onClose} />
      <div style={{ position: 'fixed', top: 0, right: 0, height: '100vh', width: '380px', maxWidth: '100vw', backgroundColor: panelBg, zIndex: 301, overflowY: 'auto', boxShadow: '-8px 0 40px rgba(0,0,0,0.25)', display: 'flex', flexDirection: 'column', fontFamily: DS.font }}>

        {/* Header */}
        <div style={{ padding: '20px 24px', borderBottom: `1px solid ${borderC}`, display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexShrink: 0 }}>
          <h3 style={{ margin: 0, fontSize: '16px', fontWeight: '700', color: textP }}>My Profile</h3>
          <button onClick={onClose} style={{ background: 'none', border: 'none', cursor: 'pointer', color: textS, padding: '4px', lineHeight: 1 }}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
          </button>
        </div>

        {/* Avatar + identity */}
        <div style={{ padding: '24px', borderBottom: `1px solid ${borderC}`, display: 'flex', alignItems: 'center', gap: '16px', flexShrink: 0 }}>
          <input ref={fileRef} type="file" accept="image/*" style={{ display: 'none' }} onChange={handleAvatarChange} />
          <div onClick={() => fileRef.current?.click()} title="Click to change photo" style={{ position: 'relative', cursor: 'pointer', flexShrink: 0 }}>
            <div style={{ width: '72px', height: '72px', borderRadius: '50%', overflow: 'hidden', border: `2px solid ${borderC}` }}>
              {avatar
                ? <img src={avatar} alt="avatar" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                : <InitialsAvatar name={form.name || displayName} size={72} fontSize={26} />
              }
            </div>
            <div style={{ position: 'absolute', bottom: 0, right: 0, width: '22px', height: '22px', borderRadius: '50%', backgroundColor: '#6366f1', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.5"><path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"/><circle cx="12" cy="13" r="4"/></svg>
            </div>
          </div>
          <div style={{ minWidth: 0 }}>
            <p style={{ margin: '0 0 3px', fontSize: '16px', fontWeight: '700', color: textP, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{form.name || displayName}</p>
            <p style={{ margin: '0 0 10px', fontSize: '12px', color: textS }}>{roleStr}</p>
            <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
              <button onClick={() => fileRef.current?.click()} style={{ fontSize: '12px', color: '#6366f1', background: 'none', border: 'none', cursor: 'pointer', padding: 0, fontWeight: '600' }}>
                Change Photo
              </button>
              {avatar && (
                <button
                  onClick={() => {
                    if (avatarKey) localStorage.removeItem(avatarKey);
                    setAvatar(null);
                    window.dispatchEvent(new CustomEvent('avatarUpdated'));
                  }}
                  style={{ fontSize: '12px', color: '#ef4444', background: 'none', border: 'none', cursor: 'pointer', padding: 0, fontWeight: '600' }}
                >
                  Remove Photo
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Body */}
        <div style={{ padding: '24px', flex: 1 }}>
          {saved && <div style={{ backgroundColor: '#dcfce7', color: '#166534', padding: '10px 14px', borderRadius: '8px', fontSize: '13px', fontWeight: '600', marginBottom: '16px' }}>✓ Profile saved successfully.</div>}

          {!editing ? (
            <>
              {[
                { label: 'Full Name',  val: form.name  || '—' },
                { label: 'Email',      val: form.email || '—' },
                { label: 'Phone',      val: form.phone || '—' },
                { label: 'Account ID', val: userId },
              ].map(row => (
                <div key={row.label} style={{ display: 'flex', padding: '12px 14px', borderRadius: '8px', backgroundColor: rowBg, marginBottom: '8px', gap: '12px' }}>
                  <span style={{ width: '90px', flexShrink: 0, fontSize: '11px', fontWeight: '700', color: textS, textTransform: 'uppercase', letterSpacing: '0.5px', paddingTop: '2px' }}>{row.label}</span>
                  <span style={{ fontSize: '14px', fontWeight: '600', color: textP, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{row.val}</span>
                </div>
              ))}
              <button onClick={() => setEditing(true)} style={{ marginTop: '12px', width: '100%', padding: '12px', backgroundColor: isDark ? '#334155' : '#0f172a', color: '#fff', border: 'none', borderRadius: '8px', fontSize: '14px', fontWeight: '700', cursor: 'pointer', fontFamily: DS.font }}>
                Edit Profile
              </button>
            </>
          ) : (
            <>
              {[{ k: 'name', l: 'Full Name', t: 'text' }, { k: 'email', l: 'Email', t: 'email' }, { k: 'phone', l: 'Phone', t: 'tel' }].map(f => (
                <div key={f.k} style={{ marginBottom: '14px' }}>
                  <label style={{ display: 'block', fontSize: '11px', fontWeight: '700', color: textS, marginBottom: '6px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>{f.l}</label>
                  <input type={f.t} value={form[f.k]} onChange={e => setForm(p => ({ ...p, [f.k]: e.target.value }))} style={{ width: '100%', padding: '10px 14px', boxSizing: 'border-box', border: `1px solid ${borderC}`, borderRadius: '8px', fontSize: '14px', outline: 'none', backgroundColor: inputBg, color: textP, fontFamily: DS.font }} />
                </div>
              ))}
              <div style={{ display: 'flex', gap: '10px', marginTop: '8px' }}>
                <button onClick={handleSave} style={{ flex: 1, padding: '11px', backgroundColor: '#6366f1', color: '#fff', border: 'none', borderRadius: '8px', fontSize: '14px', fontWeight: '700', cursor: 'pointer', fontFamily: DS.font }}>Save Changes</button>
                <button onClick={() => setEditing(false)} style={{ flex: 1, padding: '11px', backgroundColor: 'transparent', color: textS, border: `1px solid ${borderC}`, borderRadius: '8px', fontSize: '14px', fontWeight: '600', cursor: 'pointer', fontFamily: DS.font }}>Cancel</button>
              </div>
            </>
          )}
        </div>

        {/* Footer */}
        {settingsPath && (
          <div style={{ padding: '16px 24px', borderTop: `1px solid ${borderC}`, flexShrink: 0 }}>
            <Link to={settingsPath} onClick={onClose} style={{ display: 'flex', alignItems: 'center', gap: '10px', color: textS, textDecoration: 'none', fontSize: '14px', fontWeight: '600', padding: '10px 14px', borderRadius: '8px', backgroundColor: rowBg }}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"/></svg>
              Account Settings
            </Link>
          </div>
        )}
      </div>
    </>
  );
}

// ── AppLayout main component ──────────────────────────────────────────────────
export default function AppLayout({ navItems = [], profilePath = '', portalLabel, displayName, roleLabel, avatarSrc, onLogout, loginNotif, topbarExtra }) {
  const location = useLocation();
  const { t } = useLang();
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  const [hovered, setHovered] = useState(null);
  const [logoutHov, setLogoutHov] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [sessionState, setSessionState] = useState(() => getSession());

  // Re-read session after profile/password updates
  useEffect(() => {
    const refresh = () => setSessionState(getSession());
    window.addEventListener('profileUpdated', refresh);
    return () => window.removeEventListener('profileUpdated', refresh);
  }, []);

  const needsReset = sessionState?.requirePasswordReset === true;

  const settingsPath = navItems.find(i => i.label === 'Settings' || i.path?.endsWith('/settings'))?.path || '';

  // Active nav item — profile page excluded from nav so it won't match
  const activeItem = [...navItems, { path: '/' }]
    .sort((a, b) => b.path.length - a.path.length)
    .find(item => location.pathname === item.path || location.pathname.startsWith(item.path + '/'));
  const topbarLabel = activeItem?.pageTitle || activeItem?.label || portalLabel;

  const isSelected = path => activeItem?.path === path;
  const linkStyle = path => ({
    ...NAV_BASE,
    ...(isSelected(path)
      ? { backgroundColor: DS.navActiveBg, color: DS.navActiveColor }
      : hovered === path
      ? { backgroundColor: DS.navHoverBg, color: DS.navHoverColor }
      : {}),
  });
  const iconColor = path => isSelected(path) || hovered === path ? DS.iconActiveColor : DS.iconColor;

  // Topbar / main colors
  const topbarBg = isDark ? '#0c1929' : DS.topbarBg;
  const topbarBorder = isDark ? '#1e293b' : DS.topbarBorder;
  const textTitle = isDark ? '#f1f5f9' : DS.textDark;
  const mainBg = isDark ? '#0F172A' : DS.contentBg;
  const sidebarBg = isDark ? '#020617' : DS.sidebarBg;

  return (
    <div style={{ display: 'flex', minHeight: '100vh', fontFamily: DS.font, backgroundColor: mainBg }}>

      {/* Force password reset — blocks everything until user sets a new password */}
      {needsReset && (
        <ForcePasswordReset
          session={sessionState}
          isDark={isDark}
          onDone={() => setSessionState(getSession())}
        />
      )}

      {/* Profile Drawer overlay */}
      <ProfileDrawer isOpen={drawerOpen} onClose={() => setDrawerOpen(false)} isDark={isDark} avatarSrc={avatarSrc} settingsPath={settingsPath} displayName={displayName} />

      {/* ── SIDEBAR ────────────────────────────────────────────────────────── */}
      <aside style={{ ...L.sidebar, backgroundColor: sidebarBg }} className="lms-sidebar">
        <Link to="/" style={{ textDecoration: 'none', color: 'inherit' }} title="Back to Home">
          <div style={L.logoWrap} onMouseEnter={e => e.currentTarget.style.opacity = '0.75'} onMouseLeave={e => e.currentTarget.style.opacity = '1'}>
            <LibraryBookLogo size={52} />
            <div style={L.logoText}>
              <span style={L.logoTitle}>Library Management</span>
              <span style={L.logoSystem}>System</span>
              <span style={L.logoSub}>Institutional Resource</span>
            </div>
          </div>
        </Link>

        <nav style={L.nav}>
          <Link to="/" style={linkStyle('/')} onMouseEnter={() => setHovered('/')} onMouseLeave={() => setHovered(null)}>
            <span style={{ display: 'flex', alignItems: 'center', color: iconColor('/'), flexShrink: 0 }}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>
            </span>
            {t('home')}
          </Link>

          {navItems.filter(item => !item.path?.endsWith('/profile')).map(item => {
            const icon = item.icon ?? getIcon(item.path);
            const label = t(LABEL_KEYS[item.label] || item.label.toLowerCase().replace(/\s+/g, '_')) || item.label;
            return (
              <Link key={item.path} to={item.path} style={linkStyle(item.path)} onMouseEnter={() => setHovered(item.path)} onMouseLeave={() => setHovered(null)}>
                <span style={{ display: 'flex', alignItems: 'center', color: iconColor(item.path), flexShrink: 0 }}>{icon}</span>
                {label}
              </Link>
            );
          })}
        </nav>

        <button onClick={onLogout} onMouseEnter={() => setLogoutHov(true)} onMouseLeave={() => setLogoutHov(false)}
          style={{ ...NAV_BASE, color: DS.logoutColor, ...(logoutHov ? { backgroundColor: DS.logoutHoverBg } : {}) }}>
          <span style={{ display: 'flex', alignItems: 'center', color: DS.logoutColor }}>{ICON_LOGOUT}</span>
          {t('logout')}
        </button>
      </aside>

      {/* ── MAIN ───────────────────────────────────────────────────────────── */}
      <div className="lms-main" style={{ ...L.main, backgroundColor: mainBg }}>

        {/* ── TOPBAR ──────────────────────────────────────────────────────── */}
        <header className="lms-topbar" style={{ ...L.topbar, backgroundColor: topbarBg, borderBottom: `1px solid ${topbarBorder}` }}>
          <span style={{ ...L.pageTitle, color: textTitle }}>{topbarLabel}</span>

          {/* Notification bell slot (superadmin only, injected by StaffLayout) */}
          {topbarExtra && <div style={{ marginLeft: 'auto', marginRight: '8px', flexShrink: 0 }}>{topbarExtra}</div>}

          {/* Profile trigger — opens drawer, does NOT navigate */}
          <button
            onClick={() => setDrawerOpen(true)}
            style={{
              ...L.profileTrigger,
              backgroundColor: isDark ? '#1e293b' : '#f8fafc',
              border: `1px solid ${isDark ? '#334155' : '#e2e8f0'}`,
              boxShadow: isDark ? 'none' : '0 1px 4px rgba(0,0,0,0.07)',
            }}
            onMouseEnter={e => { e.currentTarget.style.backgroundColor = isDark ? '#334155' : '#f1f5f9'; e.currentTarget.style.boxShadow = '0 2px 8px rgba(0,0,0,0.12)'; }}
            onMouseLeave={e => { e.currentTarget.style.backgroundColor = isDark ? '#1e293b' : '#f8fafc'; e.currentTarget.style.boxShadow = isDark ? 'none' : '0 1px 4px rgba(0,0,0,0.07)'; }}
          >
            <div style={L.triggerAvatar}>
              {avatarSrc
                ? <img src={avatarSrc} alt="avatar" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                : <InitialsAvatar name={displayName} size={36} fontSize={13} />}
            </div>
            <div style={{ textAlign: 'left', minWidth: 0 }}>
              <p style={{ margin: 0, fontSize: '13px', fontWeight: '700', color: textTitle, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', maxWidth: '140px' }}>{displayName}</p>
              <p style={{ margin: 0, fontSize: '11px', color: isDark ? '#64748b' : DS.textLight }}>{roleLabel}</p>
            </div>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={isDark ? '#64748b' : DS.textLight} strokeWidth="2.5" style={{ flexShrink: 0 }}>
              <polyline points="6 9 12 15 18 9"/>
            </svg>
          </button>
        </header>

        {/* Login welcome banner */}
        {loginNotif?.visible && (
          <div style={L.notifBanner}>
            <span>{loginNotif.message}</span>
            <button onClick={loginNotif.onDismiss} style={L.notifClose}>✕</button>
          </div>
        )}

        <div className="lms-content" style={{ ...L.content, backgroundColor: mainBg }}>
          <Outlet />
        </div>
      </div>
    </div>
  );
}

// ── Styles ────────────────────────────────────────────────────────────────────
const L = {
  sidebar: {
    width: DS.sidebarWidth, backgroundColor: DS.sidebarBg, color: '#fff',
    padding: '0 12px 20px', display: 'flex', flexDirection: 'column',
    position: 'sticky', top: 0, height: '100vh', overflowY: 'auto', flexShrink: 0,
  },
  logoWrap: {
    display: 'flex', alignItems: 'center', gap: '12px',
    padding: '18px 8px 16px', borderBottom: '1px solid #1a1a1a',
    marginBottom: '10px', flexShrink: 0, cursor: 'pointer', transition: 'opacity 0.15s',
  },
  logoText:   { display: 'flex', flexDirection: 'column', flex: 1 },
  logoTitle:  { color: '#fff', fontWeight: '800', fontSize: '13px', lineHeight: 1.3 },
  logoSystem: { color: DS.logoSystemColor, fontWeight: '800', fontSize: '13px', textAlign: 'center' },
  logoSub:    { color: '#4b5563', fontSize: '10px', marginTop: '3px', fontWeight: '500' },
  nav:        { display: 'flex', flexDirection: 'column', gap: '2px', flex: 1 },

  main:    { flex: 1, display: 'flex', flexDirection: 'column', minWidth: 0 },
  topbar: {
    height: DS.topbarHeight, backgroundColor: DS.topbarBg,
    borderBottom: `1px solid ${DS.topbarBorder}`,
    display: 'flex', justifyContent: 'space-between', alignItems: 'center',
    padding: '0 24px', position: 'sticky', top: 0, zIndex: 40, flexShrink: 0,
    gap: '16px',
  },
  pageTitle: { fontSize: '18px', fontWeight: '700', color: DS.textDark, flexShrink: 0 },

  // Header profile trigger button
  profileTrigger: {
    display: 'flex', alignItems: 'center', gap: '10px',
    background: 'none', border: '1px solid transparent', borderRadius: '10px',
    padding: '5px 10px 5px 5px', cursor: 'pointer', transition: 'all 0.15s',
    fontFamily: DS.font,
  },
  triggerAvatar: {
    width: '36px', height: '36px', borderRadius: '50%',
    overflow: 'hidden', flexShrink: 0,
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    backgroundColor: '#f1f5f9',
  },

  notifBanner: {
    display: 'flex', justifyContent: 'space-between', alignItems: 'center',
    backgroundColor: '#dcfce7', color: '#166534',
    padding: '12px 30px', fontSize: '14px',
    borderBottom: '1px solid #bbf7d0', flexShrink: 0,
  },
  notifClose: { background: 'none', border: 'none', color: '#166534', fontSize: '18px', cursor: 'pointer' },
  content:    { padding: '30px', flex: 1, overflowY: 'auto' },
};
