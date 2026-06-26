import React, { useState, useRef } from 'react';
import { useTheme, getSavedChoice } from '../../utils/theme';
import { useLang } from '../../utils/i18n';
import { getSession, setSession, ROLES } from '../../utils/auth';

// ── Helpers ───────────────────────────────────────────────────────────────────

function safeRead(key, fallback) {
  try { return JSON.parse(localStorage.getItem(key) || 'null') ?? fallback; }
  catch { return fallback; }
}

function getCurrentAccount(session) {
  if (!session) return null;
  if (session.role === ROLES.MEMBER) return safeRead('userAccount', null);
  const accounts = safeRead('libraryStaffAccounts', []);
  return accounts.find(a => a.id === session.id) || null;
}

function savePassword(session, newPassword) {
  if (!session) return;
  if (session.role === ROLES.MEMBER) {
    const cur = safeRead('userAccount', {});
    localStorage.setItem('userAccount', JSON.stringify({ ...cur, password: newPassword }));
  } else {
    const accounts = safeRead('libraryStaffAccounts', []);
    localStorage.setItem(
      'libraryStaffAccounts',
      JSON.stringify(accounts.map(a => a.id === session.id ? { ...a, password: newPassword } : a))
    );
  }
}

function getAvatarKey(session) {
  if (!session) return null;
  if (session.role === ROLES.MEMBER) {
    const user = safeRead('userAccount', {});
    return `memberAvatar_${user.username || 'member'}`;
  }
  return `staffAvatar_${session.id}`;
}

function saveProfileData(session, data) {
  if (!session) return;
  const updated = { fullName: data.name, email: data.email, phone: data.phone };
  if (session.role === ROLES.MEMBER) {
    const cur = safeRead('userAccount', {});
    localStorage.setItem('userAccount', JSON.stringify({ ...cur, ...updated }));
  } else {
    const accounts = safeRead('libraryStaffAccounts', []);
    localStorage.setItem(
      'libraryStaffAccounts',
      JSON.stringify(accounts.map(a => a.id === session.id ? { ...a, ...updated } : a))
    );
  }
  setSession({ ...session, ...updated });
}

function initials(name = '') {
  return name.split(' ').filter(Boolean).slice(0, 2).map(w => w[0].toUpperCase()).join('') || '?';
}

const AVATAR_COLORS = ['#6366f1', '#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6'];
function avatarColor(name = '') {
  let h = 0;
  for (let i = 0; i < name.length; i++) h = name.charCodeAt(i) + ((h << 5) - h);
  return AVATAR_COLORS[Math.abs(h) % AVATAR_COLORS.length];
}

// ── Sub-components ────────────────────────────────────────────────────────────

function SectionCard({ title, subtitle, children, isDark }) {
  return (
    <div style={{
      backgroundColor: isDark ? '#1e293b' : '#fff',
      border: `1px solid ${isDark ? '#334155' : '#e2e8f0'}`,
      borderRadius: '14px', padding: '28px', marginBottom: '16px',
    }}>
      <div style={{ marginBottom: '20px' }}>
        <h3 style={{ margin: 0, fontSize: '16px', fontWeight: '700', color: isDark ? '#f1f5f9' : '#0f172a' }}>
          {title}
        </h3>
        {subtitle && (
          <p style={{ margin: '4px 0 0', fontSize: '13px', color: '#64748b' }}>
            {subtitle}
          </p>
        )}
      </div>
      {children}
    </div>
  );
}


function PwField({ label, value, onChange, isDark, placeholder }) {
  const [show, setShow] = useState(false);
  return (
    <div style={{ marginBottom: '14px' }}>
      <label style={{ display: 'block', fontSize: '11px', fontWeight: '700', color: isDark ? '#94a3b8' : '#475569', marginBottom: '6px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
        {label}
      </label>
      <div style={{ position: 'relative' }}>
        <input
          type={show ? 'text' : 'password'}
          value={value}
          onChange={e => onChange(e.target.value)}
          placeholder={placeholder}
          style={{
            width: '100%', padding: '10px 40px 10px 14px', boxSizing: 'border-box',
            border: `1px solid ${isDark ? '#334155' : '#cbd5e1'}`,
            borderRadius: '8px', fontSize: '14px', outline: 'none',
            backgroundColor: isDark ? '#0f172a' : '#fff',
            color: isDark ? '#f1f5f9' : '#0f172a',
          }}
          onFocus={e => { e.target.style.borderColor = '#3b82f6'; }}
          onBlur={e => { e.target.style.borderColor = isDark ? '#334155' : '#cbd5e1'; }}
        />
        <button
          type="button"
          onClick={() => setShow(s => !s)}
          tabIndex={-1}
          style={{ position: 'absolute', right: '10px', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: isDark ? '#64748b' : '#94a3b8', padding: 0, lineHeight: 1 }}
        >
          {show
            ? <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"/><line x1="1" y1="1" x2="23" y2="23"/></svg>
            : <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
          }
        </button>
      </div>
    </div>
  );
}

function TextField({ label, value, onChange, isDark, type = 'text', placeholder, disabled }) {
  return (
    <div style={{ marginBottom: '14px' }}>
      <label style={{ display: 'block', fontSize: '11px', fontWeight: '700', color: isDark ? '#94a3b8' : '#475569', marginBottom: '6px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
        {label}
      </label>
      <input
        type={type}
        value={value}
        onChange={e => onChange && onChange(e.target.value)}
        placeholder={placeholder}
        disabled={disabled}
        style={{
          width: '100%', padding: '10px 14px', boxSizing: 'border-box',
          border: `1px solid ${isDark ? '#334155' : '#cbd5e1'}`,
          borderRadius: '8px', fontSize: '14px', outline: 'none',
          backgroundColor: disabled ? (isDark ? '#0f172a' : '#f8fafc') : (isDark ? '#0f172a' : '#fff'),
          color: disabled ? (isDark ? '#475569' : '#94a3b8') : (isDark ? '#f1f5f9' : '#0f172a'),
          cursor: disabled ? 'not-allowed' : 'text',
          transition: 'border-color 0.15s',
        }}
        onFocus={e => { if (!disabled) e.target.style.borderColor = '#3b82f6'; }}
        onBlur={e => { e.target.style.borderColor = isDark ? '#334155' : '#cbd5e1'; }}
      />
    </div>
  );
}

function Toast({ message }) {
  if (!message) return null;
  return (
    <div style={{
      position: 'fixed', bottom: '24px', right: '24px', zIndex: 9999,
      backgroundColor: '#10b981', color: '#fff', padding: '12px 20px',
      borderRadius: '10px', fontSize: '14px', fontWeight: '600',
      boxShadow: '0 4px 20px rgba(0,0,0,0.2)',
    }}>
      ✓ {message}
    </div>
  );
}

// ── Main component ─────────────────────────────────────────────────────────────
export default function SettingsPage() {
  const { theme, setTheme } = useTheme();
  const { lang, t } = useLang();
  const isDark  = theme === 'dark';
  const session = getSession();

  const [toast, setToast] = useState('');
  const flash = msg => { setToast(msg); setTimeout(() => setToast(''), 3500); };

  const textPrimary = isDark ? '#f1f5f9' : '#0f172a';
  const textSub     = isDark ? '#64748b'  : '#64748b';

  // ── Profile ─────────────────────────────────────────────────────────────────
  const avatarKey = getAvatarKey(session);
  const [avatar, setAvatar] = useState(() => avatarKey ? localStorage.getItem(avatarKey) : null);
  const [profileEditing, setProfileEditing] = useState(false);
  const [profileForm, setProfileForm] = useState(() => ({
    name:  session?.fullName || '',
    email: session?.email    || '',
    phone: session?.phone    || '',
  }));
  const [profileErr, setProfileErr] = useState('');
  const fileRef = useRef(null);

  const handleAvatarChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 2 * 1024 * 1024) { setProfileErr('Image must be 2 MB or smaller.'); return; }
    const reader = new FileReader();
    reader.onload = ev => {
      const b64 = ev.target.result;
      if (avatarKey) localStorage.setItem(avatarKey, b64);
      setAvatar(b64);
      window.dispatchEvent(new CustomEvent('avatarUpdated'));
    };
    reader.readAsDataURL(file);
  };

  const handleProfileSave = () => {
    setProfileErr('');
    if (!profileForm.name.trim()) { setProfileErr('Full name is required.'); return; }
    if (!profileForm.email.trim()) { setProfileErr('Email is required.'); return; }
    saveProfileData(session, profileForm);
    setProfileEditing(false);
    window.dispatchEvent(new CustomEvent('profileUpdated'));
    flash(lang === 'km' ? 'ប្រវត្តិរូបត្រូវបានរក្សាទុក' : 'Profile saved.');
  };

  const handleProfileCancel = () => {
    setProfileForm({
      name:  session?.fullName || '',
      email: session?.email    || '',
      phone: session?.phone    || '',
    });
    setProfileErr('');
    setProfileEditing(false);
  };

  // ── Theme ───────────────────────────────────────────────────────────────────
  const [savedTheme, setSavedTheme] = useState(getSavedChoice());
  const handleSetTheme = v => { setTheme(v); setSavedTheme(v); flash(t('settings_saved')); };

  // ── Security — Change Password ──────────────────────────────────────────────
  const [pwForm, setPwForm] = useState({ current: '', newPw: '', confirm: '' });
  const [pwErr,  setPwErr]  = useState('');
  const [pwOk,   setPwOk]   = useState('');

  const handleChangePassword = () => {
    setPwErr(''); setPwOk('');
    if (!pwForm.current)         { setPwErr('Current password is required.'); return; }
    if (pwForm.newPw.length < 6) { setPwErr('New password must be at least 6 characters.'); return; }
    if (pwForm.newPw !== pwForm.confirm) { setPwErr('Passwords do not match.'); return; }

    const account = getCurrentAccount(session);
    if (!account || account.password !== pwForm.current) {
      setPwErr('Current password is incorrect.'); return;
    }

    savePassword(session, pwForm.newPw);
    setPwForm({ current: '', newPw: '', confirm: '' });
    setPwOk('Password changed successfully.');
    flash('Password changed.');
    setTimeout(() => setPwOk(''), 4000);
  };

  const userId = session?.userId || session?.id || '—';

  return (
    <div style={{ maxWidth: '680px', fontFamily: 'system-ui, sans-serif' }}>
      <Toast message={toast} />
      <input ref={fileRef} type="file" accept="image/*" style={{ display: 'none' }} onChange={handleAvatarChange} />

      {/* Page header */}
      <div style={{ marginBottom: '28px' }}>
        <h2 style={{ margin: '0 0 4px', fontSize: '22px', fontWeight: '800', color: textPrimary }}>
          {t('settings')}
        </h2>
        <p style={{ margin: 0, fontSize: '14px', color: textSub }}>
          {lang === 'km'
            ? 'គ្រប់គ្រងប្រវត្តិរូប ការប្រកាន់ ភាសា និងសុវត្ថិភាពរបស់អ្នក'
            : 'Manage your profile, appearance, language, and security preferences.'}
        </p>
      </div>

      {/* ── 1. Profile ───────────────────────────────────────────────────────── */}
      <div style={{ backgroundColor: isDark ? '#1e293b' : '#fff', border: `1px solid ${isDark ? '#334155' : '#e2e8f0'}`, borderRadius: '14px', marginBottom: '16px', overflow: 'hidden' }}>

        {/* ── Banner ── */}
        <div style={{ height: '96px', background: 'linear-gradient(135deg, #0f172a 0%, #1e3a5f 40%, #312e81 100%)', position: 'relative', overflow: 'hidden' }}>
          {/* decorative circles */}
          <div style={{ position: 'absolute', top: '-20px', right: '-20px', width: '120px', height: '120px', borderRadius: '50%', backgroundColor: 'rgba(99,102,241,0.25)' }} />
          <div style={{ position: 'absolute', bottom: '-30px', left: '40%', width: '90px', height: '90px', borderRadius: '50%', backgroundColor: 'rgba(59,130,246,0.18)' }} />
        </div>

        {/* ── Content (overlaps banner) ── */}
        <div style={{ padding: '0 28px 28px' }}>

          {/* Avatar row — pulled up to overlap the banner */}
          <div style={{ display: 'flex', alignItems: 'flex-end', gap: '20px', marginTop: '-44px', paddingBottom: '20px', marginBottom: '20px', borderBottom: `1px solid ${isDark ? '#334155' : '#f1f5f9'}` }}>
            <div
              onClick={() => fileRef.current?.click()}
              title="Click to upload photo"
              style={{ position: 'relative', cursor: 'pointer', flexShrink: 0 }}
            >
              <div style={{ width: '88px', height: '88px', borderRadius: '50%', overflow: 'hidden', border: `3px solid ${isDark ? '#1e293b' : '#fff'}`, boxShadow: '0 4px 14px rgba(0,0,0,0.3)' }}>
                {avatar
                  ? <img src={avatar} alt="avatar" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  : (
                    <div style={{ width: '100%', height: '100%', backgroundColor: avatarColor(profileForm.name), display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontWeight: '800', fontSize: '28px', userSelect: 'none' }}>
                      {initials(profileForm.name)}
                    </div>
                  )
                }
              </div>
              <div style={{ position: 'absolute', bottom: '2px', right: '2px', width: '24px', height: '24px', borderRadius: '50%', backgroundColor: '#6366f1', border: '2px solid white', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.5">
                  <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"/>
                  <circle cx="12" cy="13" r="4"/>
                </svg>
              </div>
            </div>

            <div style={{ paddingBottom: '6px' }}>
              <p style={{ margin: '0 0 2px', fontSize: '16px', fontWeight: '800', color: textPrimary }}>{profileForm.name || '—'}</p>
              <p style={{ margin: '0 0 10px', fontSize: '12px', color: textSub }}>{userId}</p>
              <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                <button
                  onClick={() => fileRef.current?.click()}
                  style={{ padding: '5px 12px', backgroundColor: 'transparent', border: `1px solid ${isDark ? '#334155' : '#e2e8f0'}`, borderRadius: '6px', fontSize: '12px', fontWeight: '600', color: isDark ? '#94a3b8' : '#475569', cursor: 'pointer', fontFamily: 'inherit' }}
                >
                  {lang === 'km' ? 'ផ្លាស់ប្ដូររូបភាព' : 'Change Photo'}
                </button>
                {avatar && (
                  <button
                    onClick={() => {
                      if (avatarKey) localStorage.removeItem(avatarKey);
                      setAvatar(null);
                      window.dispatchEvent(new CustomEvent('avatarUpdated'));
                      flash(lang === 'km' ? 'រូបភាពត្រូវបានលុប' : 'Photo removed.');
                    }}
                    style={{ padding: '5px 12px', backgroundColor: 'transparent', border: '1px solid #fca5a5', borderRadius: '6px', fontSize: '12px', fontWeight: '600', color: '#ef4444', cursor: 'pointer', fontFamily: 'inherit' }}
                  >
                    {lang === 'km' ? 'លុបរូបភាព' : 'Remove Photo'}
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* Profile fields */}
          {!profileEditing ? (
            <>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '16px' }}>
                {[
                  { label: lang === 'km' ? 'ឈ្មោះពេញ' : 'Full Name',  val: profileForm.name  || '—' },
                  { label: lang === 'km' ? 'អ៊ីមែល'    : 'Email',       val: profileForm.email || '—' },
                  { label: lang === 'km' ? 'លេខទូរស័ព្ទ' : 'Phone',    val: profileForm.phone || '—' },
                  { label: lang === 'km' ? 'ID គណនី'  : 'Account ID',  val: userId },
                ].map(row => (
                  <div key={row.label} style={{ padding: '12px 14px', backgroundColor: isDark ? '#0f172a' : '#f8fafc', borderRadius: '8px', border: `1px solid ${isDark ? '#1e293b' : '#e2e8f0'}` }}>
                    <p style={{ margin: '0 0 4px', fontSize: '10px', fontWeight: '700', color: textSub, textTransform: 'uppercase', letterSpacing: '0.5px' }}>{row.label}</p>
                    <p style={{ margin: 0, fontSize: '14px', fontWeight: '600', color: textPrimary, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{row.val}</p>
                  </div>
                ))}
              </div>
              <button
                onClick={() => setProfileEditing(true)}
                style={{ padding: '10px 20px', backgroundColor: isDark ? '#334155' : '#0f172a', color: '#fff', border: 'none', borderRadius: '8px', fontSize: '14px', fontWeight: '700', cursor: 'pointer', fontFamily: 'inherit' }}
              >
                {lang === 'km' ? 'កែប្រែព័ត៌មានផ្ទាល់ខ្លួន' : 'Edit Profile'}
              </button>
            </>
          ) : (
            <>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0 16px' }}>
                <TextField label={lang === 'km' ? 'ឈ្មោះពេញ' : 'Full Name'} value={profileForm.name}  onChange={v => setProfileForm(f => ({ ...f, name: v }))}  isDark={isDark} placeholder={lang === 'km' ? 'ឈ្មោះពេញ' : 'Your full name'} />
                <TextField label={lang === 'km' ? 'អ៊ីមែល' : 'Email'}       value={profileForm.email} onChange={v => setProfileForm(f => ({ ...f, email: v }))} isDark={isDark} type="email" placeholder="example@email.com" />
                <TextField label={lang === 'km' ? 'លេខទូរស័ព្ទ' : 'Phone'} value={profileForm.phone} onChange={v => setProfileForm(f => ({ ...f, phone: v }))} isDark={isDark} type="tel" placeholder={lang === 'km' ? 'លេខទូរស័ព្ទ' : 'Phone number'} />
                <TextField label={lang === 'km' ? 'ID គណនី (ចាក់សោ)' : 'Account ID (locked)'} value={userId} isDark={isDark} disabled />
              </div>
              {profileErr && <p style={{ color: '#ef4444', fontSize: '13px', margin: '0 0 14px' }}>{profileErr}</p>}
              <div style={{ display: 'flex', gap: '10px' }}>
                <button onClick={handleProfileSave} style={{ padding: '10px 20px', backgroundColor: isDark ? '#334155' : '#0f172a', color: '#fff', border: 'none', borderRadius: '8px', fontSize: '14px', fontWeight: '700', cursor: 'pointer', fontFamily: 'inherit' }}>
                  {lang === 'km' ? 'រក្សាទុក' : 'Save Changes'}
                </button>
                <button onClick={handleProfileCancel} style={{ padding: '10px 20px', backgroundColor: 'transparent', color: isDark ? '#94a3b8' : '#475569', border: `1px solid ${isDark ? '#334155' : '#e2e8f0'}`, borderRadius: '8px', fontSize: '14px', fontWeight: '600', cursor: 'pointer', fontFamily: 'inherit' }}>
                  {lang === 'km' ? 'បោះបង់' : 'Cancel'}
                </button>
              </div>
            </>
          )}
        </div>
      </div>

      {/* ── 2. Appearance (Theme) ────────────────────────────────────────────── */}
      <SectionCard
        title={t('appearance')}
        subtitle={lang === 'km' ? 'ជ្រើសរើសការបង្ហាញដែលអ្នកចូលចិត្ត' : 'Choose your preferred display theme.'}
        isDark={isDark}
      >
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px', marginBottom: '14px' }}>
          {[
            {
              id: 'light', label: lang === 'km' ? 'ភ្លឺ' : 'Light', accent: '#f59e0b',
              preview: (
                <div style={{ flex: 1, backgroundColor: '#f4f6f9', borderRadius: '6px', padding: '8px', display: 'flex', flexDirection: 'column', gap: '4px' }}>
                  <div style={{ width: '100%', height: '8px', backgroundColor: '#ffffff', borderRadius: '3px' }} />
                  <div style={{ width: '70%', height: '8px', backgroundColor: '#e2e8f0', borderRadius: '3px' }} />
                  <div style={{ width: '90%', height: '8px', backgroundColor: '#ffffff', borderRadius: '3px' }} />
                  <div style={{ width: '50%', height: '8px', backgroundColor: '#e2e8f0', borderRadius: '3px' }} />
                </div>
              )
            },
            {
              id: 'dark', label: lang === 'km' ? 'ងងឹត' : 'Dark', accent: '#6366f1',
              preview: (
                <div style={{ flex: 1, backgroundColor: '#0f172a', borderRadius: '6px', padding: '8px', display: 'flex', flexDirection: 'column', gap: '4px' }}>
                  <div style={{ width: '100%', height: '8px', backgroundColor: '#1e293b', borderRadius: '3px' }} />
                  <div style={{ width: '70%', height: '8px', backgroundColor: '#334155', borderRadius: '3px' }} />
                  <div style={{ width: '90%', height: '8px', backgroundColor: '#1e293b', borderRadius: '3px' }} />
                  <div style={{ width: '50%', height: '8px', backgroundColor: '#334155', borderRadius: '3px' }} />
                </div>
              )
            },
            {
              id: 'system', label: lang === 'km' ? 'ប្រព័ន្ធ' : 'System', accent: '#3b82f6',
              preview: (
                <div style={{ flex: 1, position: 'relative', borderRadius: '6px', overflow: 'hidden' }}>
                  <div style={{ position: 'absolute', inset: 0, display: 'flex' }}>
                    <div style={{ width: '50%', backgroundColor: '#f4f6f9' }} />
                    <div style={{ width: '50%', backgroundColor: '#0f172a' }} />
                  </div>
                  <div style={{ position: 'relative', padding: '8px', display: 'flex', flexDirection: 'column', gap: '4px' }}>
                    <div style={{ width: '100%', height: '8px', backgroundColor: 'rgba(255,255,255,0.3)', borderRadius: '3px' }} />
                    <div style={{ width: '70%', height: '8px', backgroundColor: 'rgba(255,255,255,0.2)', borderRadius: '3px' }} />
                  </div>
                </div>
              )
            }
          ].map(opt => {
            const active = savedTheme === opt.id;
            return (
              <button
                key={opt.id}
                onClick={() => handleSetTheme(opt.id)}
                style={{ background: 'none', border: `2px solid ${active ? opt.accent : (isDark ? '#334155' : '#e2e8f0')}`, borderRadius: '12px', padding: '10px', cursor: 'pointer', display: 'flex', flexDirection: 'column', gap: '10px', position: 'relative', transition: 'border-color 0.2s', textAlign: 'left', outline: 'none', backgroundColor: active ? (isDark ? opt.accent + '15' : opt.accent + '10') : (isDark ? '#0f172a' : '#f8fafc') }}
              >
                {active && (
                  <div style={{ position: 'absolute', top: '8px', right: '8px', backgroundColor: opt.accent, color: '#fff', fontSize: '10px', fontWeight: '700', padding: '2px 8px', borderRadius: '20px' }}>
                    ✓
                  </div>
                )}
                <div style={{ width: '100%', aspectRatio: '16/10', borderRadius: '6px', overflow: 'hidden', border: `1px solid ${isDark ? '#334155' : '#e2e8f0'}`, display: 'flex' }}>
                  {opt.preview}
                </div>
                <span style={{ fontSize: '13px', fontWeight: active ? '700' : '500', color: active ? opt.accent : textSub }}>
                  {opt.label}
                </span>
              </button>
            );
          })}
        </div>
        <p style={{ margin: '14px 0 0', fontSize: '12px', color: textSub }}>
          {lang === 'km'
            ? 'ការផ្លាស់ប្ដូររូបរាងអនុវត្តភ្លាមៗ ហើយត្រូវបានរក្សាទុក។'
            : 'Theme applies immediately and is saved across sessions.'}
        </p>
      </SectionCard>

      {/* ── 3. Security — Change Password ────────────────────────────────────── */}
      <SectionCard
        title={lang === 'km' ? 'សុវត្ថិភាព' : 'Security'}
        subtitle={lang === 'km' ? 'ផ្លាស់ប្ដូរពាក្យសម្ងាត់គណនីរបស់អ្នក' : 'Update your account password.'}
        isDark={isDark}
      >
        <div style={{ maxWidth: '420px' }}>
          <PwField label={t('current_password')} value={pwForm.current} onChange={v => setPwForm(f => ({ ...f, current: v }))} isDark={isDark} placeholder={lang === 'km' ? 'បញ្ចូលពាក្យសម្ងាត់បច្ចុប្បន្ន' : 'Enter current password'} />
          <PwField label={t('new_password')}     value={pwForm.newPw}   onChange={v => setPwForm(f => ({ ...f, newPw: v }))}   isDark={isDark} placeholder={lang === 'km' ? 'យ៉ាងហោចណាស់ ៦ តួអក្សរ' : 'At least 6 characters'} />
          <PwField label={t('confirm_password')} value={pwForm.confirm} onChange={v => setPwForm(f => ({ ...f, confirm: v }))} isDark={isDark} placeholder={lang === 'km' ? 'បញ្ចូលម្ដងទៀត' : 'Re-enter new password'} />
        </div>

        {pwErr && <p style={{ color: '#ef4444', fontSize: '13px', margin: '0 0 14px' }}>{pwErr}</p>}
        {pwOk  && <p style={{ color: '#10b981', fontSize: '13px', margin: '0 0 14px' }}>✓ {pwOk}</p>}

        <button
          onClick={handleChangePassword}
          style={{ padding: '10px 24px', backgroundColor: isDark ? '#334155' : '#0f172a', color: '#fff', border: 'none', borderRadius: '8px', fontSize: '14px', fontWeight: '700', cursor: 'pointer', fontFamily: 'inherit' }}
        >
          {t('change_password')}
        </button>
      </SectionCard>

      {/* ── 5. About ─────────────────────────────────────────────────────────── */}
      <SectionCard
        title={lang === 'km' ? 'អំពីប្រព័ន្ធ' : 'About'}
        isDark={isDark}
      >
        {[
          ['System',  'Data_Science Library Management System'],
          ['Version', '2.0.0'],
          ['Stack',   'React 19 · Vite · localStorage'],
        ].map(([k, v]) => (
          <div key={k} style={{ display: 'flex', gap: '12px', fontSize: '13px', marginBottom: '10px' }}>
            <span style={{ width: '80px', flexShrink: 0, fontWeight: '700', color: textSub }}>{k}</span>
            <span style={{ color: textPrimary }}>{v}</span>
          </div>
        ))}
      </SectionCard>
    </div>
  );
}
