import React, { useState, useMemo, useEffect } from 'react';
import { getSession, ROLES, ROLE_LABELS } from '../../utils/auth';
import {
  generatePassword,
  generateUserId,
  generateEmail,
  generateAccountId,
} from '../../utils/credentialGenerator';
import { useTheme } from '../../utils/theme';

// ── Constants ─────────────────────────────────────────────────────────────────

const STAFF_KEY  = 'libraryStaffAccounts';
const MEMBER_KEY = 'userAccount';
const PAGE_SIZE  = 10;

const ROLE_TABS = [
  { key: 'all',               label: 'All Accounts',   color: '#6366f1' },
  { key: ROLES.SUPER_ADMIN,   label: 'Super Admin',    color: '#5b21b6' },
  { key: ROLES.ADMINISTRATOR, label: 'Administrators', color: '#3b82f6' },
  { key: ROLES.LIBRARIAN,     label: 'Librarians',     color: '#10b981' },
  { key: ROLES.MEMBER,        label: 'Users',          color: '#f59e0b' },
];

const ROLE_OPTIONS = [
  { value: ROLES.ADMINISTRATOR, label: 'Administrator' },
  { value: ROLES.LIBRARIAN,     label: 'Librarian'     },
  { value: ROLES.MEMBER,        label: 'User'          },
];

const ROLE_BADGE = {
  [ROLES.SUPER_ADMIN]:   { bg: '#ede9fe', color: '#5b21b6' },
  [ROLES.ADMINISTRATOR]: { bg: '#dbeafe', color: '#1d4ed8' },
  [ROLES.LIBRARIAN]:     { bg: '#d1fae5', color: '#065f46' },
  [ROLES.MEMBER]:        { bg: '#fef3c7', color: '#92400e' },
};

// ── Avatar helpers ────────────────────────────────────────────────────────────

const AV_COLORS = ['#6366f1','#3b82f6','#10b981','#f59e0b','#ef4444','#8b5cf6','#06b6d4','#ec4899'];
function avColor(name = '') {
  let h = 0;
  for (let i = 0; i < name.length; i++) h = name.charCodeAt(i) + ((h << 5) - h);
  return AV_COLORS[Math.abs(h) % AV_COLORS.length];
}
function avInitials(name = '') {
  return name.split(' ').filter(Boolean).slice(0, 2).map(w => w[0].toUpperCase()).join('') || '?';
}
function AccountAvatar({ account, size = 32 }) {
  const lsKey = account.id ? `staffAvatar_${account.id}` : null;
  const [src, setSrc] = useState(() => lsKey ? localStorage.getItem(lsKey) : null);

  useEffect(() => {
    if (!lsKey) return;
    const refresh = () => setSrc(localStorage.getItem(lsKey));
    window.addEventListener('avatarUpdated', refresh);
    return () => window.removeEventListener('avatarUpdated', refresh);
  }, [lsKey]);

  return src
    ? <img src={src} alt="" style={{ width: size, height: size, borderRadius: '50%', objectFit: 'cover', flexShrink: 0 }} />
    : (
      <div style={{ width: size, height: size, borderRadius: '50%', backgroundColor: avColor(account.fullName || ''), display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontWeight: '700', fontSize: size * 0.38, flexShrink: 0, userSelect: 'none' }}>
        {avInitials(account.fullName || '')}
      </div>
    );
}

// ── Storage helpers ────────────────────────────────────────────────────────────

function getAllAccounts() {
  let staff = [];
  try {
    const raw    = localStorage.getItem(STAFF_KEY);
    const parsed = raw ? JSON.parse(raw) : [];
    staff = Array.isArray(parsed) ? parsed.filter(a => a && typeof a === 'object') : [];
  } catch { staff = []; }

  let self = null;
  try { self = JSON.parse(localStorage.getItem(MEMBER_KEY) || 'null'); } catch { self = null; }

  if (self?.email) {
    const inStaff = staff.some(
      a => a.email === self.email || (self.phone && self.phone !== '' && a.phone === self.phone)
    );
    if (!inStaff) {
      staff.push({
        id:                `self-${self.email}`,
        fullName:          self.fullName || self.username || self.email,
        email:             self.email,
        phone:             self.phone || '',
        password:          self.password || '',
        role:              ROLES.MEMBER,
        userId:            `MEMBER-${(self.username || self.email).toUpperCase()}`,
        status:            self.status || 'Active',
        createdBy:         'Self-Registered',
        createdAt:         self.createdAt || '',
        _isSelfRegistered: true,
      });
    }
  }
  return staff;
}

function saveStaffAccounts(list) {
  const real = (list || []).filter(a => a && typeof a === 'object' && !a._isSelfRegistered);
  localStorage.setItem(STAFF_KEY, JSON.stringify(real));
}

function updateSelfMember(updates) {
  try {
    const cur = JSON.parse(localStorage.getItem(MEMBER_KEY) || 'null');
    if (cur) localStorage.setItem(MEMBER_KEY, JSON.stringify({ ...cur, ...updates }));
  } catch {}
}

// ── Small UI pieces ────────────────────────────────────────────────────────────

function RoleBadge({ role }) {
  const c = ROLE_BADGE[role] || { bg: '#f1f5f9', color: '#475569' };
  return (
    <span style={{ ...S.badge, backgroundColor: c.bg, color: c.color }}>
      {ROLE_LABELS[role] || role || '—'}
    </span>
  );
}

function StatusDot({ status }) {
  const active = (status || 'Active') === 'Active';
  return (
    <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
      <span style={{ width: '7px', height: '7px', borderRadius: '50%', backgroundColor: active ? '#10b981' : '#ef4444', flexShrink: 0 }} />
      <span style={{ fontSize: '13px', color: active ? '#065f46' : '#991b1b', fontWeight: '600' }}>
        {active ? 'Active' : 'Suspended'}
      </span>
    </span>
  );
}

function StatCard({ label, value, accent, isDark }) {
  return (
    <div style={{ ...S.statCard, borderTop: `3px solid ${accent}`, backgroundColor: isDark ? '#1e293b' : '#fff', border: `1px solid ${isDark ? '#334155' : '#e2e8f0'}`, borderTop: `3px solid ${accent}` }}>
      <p style={{ ...S.statValue, color: isDark ? '#f1f5f9' : '#0f172a' }}>{value}</p>
      <p style={{ ...S.statLabel, color: isDark ? '#94a3b8' : '#64748b' }}>{label}</p>
    </div>
  );
}

// ── Create / Edit modal ────────────────────────────────────────────────────────

const BLANK = { fullName: '', email: '', phone: '', password: '', role: ROLES.LIBRARIAN };

function AccountFormModal({ editUser, allAccounts, onSave, onClose, isDark }) {
  const isEdit           = Boolean(editUser);
  const isSelfRegistered = editUser?._isSelfRegistered === true;
  const [form, setForm]  = useState(
    editUser
      ? { fullName: editUser.fullName || '', email: editUser.email || '', phone: editUser.phone || '', password: '', role: editUser.role || ROLES.MEMBER }
      : { ...BLANK }
  );
  const [err, setErr] = useState('');

  const set = field => e => { setForm(p => ({ ...p, [field]: e.target.value })); setErr(''); };

  const validate = () => {
    if (!form.fullName.trim())               return 'Full name is required.';
    if (!form.email.trim())                  return 'Email is required.';
    if (!/^\S+@\S+\.\S+$/.test(form.email)) return 'Enter a valid email address.';
    if (!isEdit && !form.password)           return 'Password is required.';
    if (form.password && form.password.length < 6) return 'Password must be at least 6 characters.';
    const others = (allAccounts || []).filter(a => a?.id !== editUser?.id);
    if (others.some(a => a?.email?.toLowerCase() === form.email.toLowerCase().trim()))
      return 'An account with this email already exists.';
    if (form.phone.trim() && others.some(a => a?.phone === form.phone.trim()))
      return 'An account with this phone number already exists.';
    return null;
  };

  const handleSubmit = e => {
    e.preventDefault();
    const e2 = validate();
    if (e2) { setErr(e2); return; }
    onSave(form);
  };

  const modalBg = isDark ? '#1e293b' : '#fff';
  const modalBorder = isDark ? '#334155' : '#e2e8f0';
  const labelColor = isDark ? '#94a3b8' : '#475569';
  const titleColor = isDark ? '#f1f5f9' : '#0f172a';
  const inpStyle = { ...S.inp, backgroundColor: isDark ? '#1F2937' : '#fff', color: isDark ? '#f1f5f9' : '#334155', borderColor: isDark ? '#334155' : '#cbd5e1' };

  return (
    <div style={S.overlay}>
      <div style={{ ...S.modal, backgroundColor: modalBg, border: `1px solid ${modalBorder}` }}>
        <div style={S.modalHead}>
          <h3 style={{ ...S.modalTitle, color: titleColor }}>{isEdit ? 'Edit Account' : 'Create New Account'}</h3>
          <button style={{ ...S.closeBtn, color: isDark ? '#94a3b8' : '#64748b' }} onClick={onClose}>✕</button>
        </div>
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
          <div style={isSelfRegistered ? {} : S.grid2}>
            <div>
              <label style={{ ...S.lbl, color: labelColor }}>FULL NAME *</label>
              <input style={inpStyle} value={form.fullName} onChange={set('fullName')} placeholder="e.g. Jane Smith" required />
            </div>
            {!isSelfRegistered && (
              <div>
                <label style={{ ...S.lbl, color: labelColor }}>ROLE *</label>
                <select style={inpStyle} value={form.role} onChange={set('role')}>
                  {ROLE_OPTIONS.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
                </select>
              </div>
            )}
          </div>
          <div>
            <label style={{ ...S.lbl, color: labelColor }}>EMAIL *</label>
            <input style={inpStyle} type="email" value={form.email} onChange={set('email')} placeholder="user@library.com" required />
          </div>
          <div>
            <label style={{ ...S.lbl, color: labelColor }}>PHONE (optional)</label>
            <input style={inpStyle} value={form.phone} onChange={set('phone')} placeholder="e.g. 012 345 678" />
          </div>
          <div>
            <label style={{ ...S.lbl, color: labelColor }}>{isEdit ? 'NEW PASSWORD (blank = keep current)' : 'PASSWORD *'}</label>
            <input style={inpStyle} type="password" value={form.password} onChange={set('password')} placeholder={isEdit ? 'Leave blank to keep current' : 'Min 6 characters'} />
          </div>
          {err && <p style={{ color: '#ef4444', fontSize: '13px', margin: 0 }}>{err}</p>}
          <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end', marginTop: '4px' }}>
            <button type="button" style={{ ...S.ghostBtn, backgroundColor: isDark ? '#334155' : '#f1f5f9', color: isDark ? '#f1f5f9' : '#334155' }} onClick={onClose}>Cancel</button>
            <button type="submit" style={S.darkBtn}>{isEdit ? 'Save Changes' : 'Create Account'}</button>
          </div>
        </form>
      </div>
    </div>
  );
}

// ── Reset Password modal ───────────────────────────────────────────────────────

function ResetPasswordModal({ user, onSave, onClose }) {
  const [pw, setPw]   = useState('');
  const [pw2, setPw2] = useState('');
  const [err, setErr] = useState('');

  const handleSubmit = e => {
    e.preventDefault();
    if (pw.length < 6) { setErr('Password must be at least 6 characters.'); return; }
    if (pw !== pw2)    { setErr('Passwords do not match.'); return; }
    onSave(pw);
  };

  return (
    <div style={S.overlay}>
      <div style={{ ...S.modal, maxWidth: '440px' }}>
        <div style={S.modalHead}>
          <h3 style={S.modalTitle}>Reset Password</h3>
          <button style={S.closeBtn} onClick={onClose}>✕</button>
        </div>
        <p style={{ fontSize: '14px', color: '#475569', margin: '0 0 20px' }}>
          Setting a new password for <strong>{user.fullName}</strong>
        </p>
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
          <div>
            <label style={S.lbl}>NEW PASSWORD *</label>
            <input style={S.inp} type="password" value={pw} onChange={e => { setPw(e.target.value); setErr(''); }} placeholder="Min 6 characters" required />
          </div>
          <div>
            <label style={S.lbl}>CONFIRM PASSWORD *</label>
            <input style={S.inp} type="password" value={pw2} onChange={e => { setPw2(e.target.value); setErr(''); }} placeholder="Re-enter password" required />
          </div>
          {err && <p style={{ color: '#ef4444', fontSize: '13px', margin: 0 }}>{err}</p>}
          <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end' }}>
            <button type="button" style={S.ghostBtn} onClick={onClose}>Cancel</button>
            <button type="submit" style={S.darkBtn}>Reset Password</button>
          </div>
        </form>
      </div>
    </div>
  );
}

// ── Change Role modal ──────────────────────────────────────────────────────────

function ChangeRoleModal({ user, onSave, onClose }) {
  const [role, setRole] = useState(user.role || ROLES.MEMBER);
  const unchanged = role === user.role;
  return (
    <div style={S.overlay}>
      <div style={{ ...S.modal, maxWidth: '400px' }}>
        <div style={S.modalHead}>
          <h3 style={S.modalTitle}>Change Role</h3>
          <button style={S.closeBtn} onClick={onClose}>✕</button>
        </div>
        <p style={{ fontSize: '14px', color: '#475569', margin: '0 0 20px' }}>
          Changing role for <strong>{user.fullName}</strong>
        </p>
        <div>
          <label style={S.lbl}>SELECT NEW ROLE</label>
          <select style={S.inp} value={role} onChange={e => setRole(e.target.value)}>
            {ROLE_OPTIONS.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
          </select>
        </div>
        <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end', marginTop: '20px' }}>
          <button style={S.ghostBtn} onClick={onClose}>Cancel</button>
          <button
            style={{ ...S.darkBtn, opacity: unchanged ? 0.5 : 1 }}
            onClick={() => !unchanged && onSave(role)}
            disabled={unchanged}
          >
            {unchanged ? 'No Change' : `Change to ${ROLE_LABELS[role] || role}`}
          </button>
        </div>
      </div>
    </div>
  );
}

// ── Delete confirmation ────────────────────────────────────────────────────────

function DeleteModal({ user, onConfirm, onClose }) {
  return (
    <div style={S.overlay}>
      <div style={{ ...S.modal, maxWidth: '420px', textAlign: 'center' }}>
        <div style={{ fontSize: '48px', marginBottom: '12px' }}>⚠️</div>
        <h3 style={{ margin: '0 0 8px', fontSize: '18px', fontWeight: '800', color: '#0f172a' }}>Delete Account?</h3>
        <p style={{ fontSize: '14px', color: '#475569', margin: '0 0 4px' }}>You are about to permanently delete:</p>
        <p style={{ fontSize: '15px', fontWeight: '700', color: '#0f172a', margin: '0 0 4px' }}>{user.fullName}</p>
        <p style={{ fontSize: '13px', color: '#64748b', margin: '0 0 20px' }}>{user.email}</p>
        <p style={{ fontSize: '13px', color: '#ef4444', margin: '0 0 24px' }}>This action cannot be undone.</p>
        <div style={{ display: 'flex', gap: '10px', justifyContent: 'center' }}>
          <button style={S.ghostBtn} onClick={onClose}>Cancel</button>
          <button style={{ ...S.darkBtn, backgroundColor: '#ef4444' }} onClick={onConfirm}>Delete Account</button>
        </div>
      </div>
    </div>
  );
}

// ── Super Admin — Quick Create (no manual email/password) ─────────────────────

const SA_ROLE_OPTIONS = [
  { value: ROLES.ADMINISTRATOR, label: 'Administrator' },
  { value: ROLES.LIBRARIAN,     label: 'Librarian'     },
  { value: ROLES.MEMBER,        label: 'Student / Member' },
];

const DEPT_SUGGESTIONS = [
  'Computer Science', 'Data Science', 'Information Technology',
  'Software Engineering', 'Mathematics', 'Physics', 'Faculty / Staff',
];

function SuperAdminCreateModal({ allAccounts, onCreated, onClose, isDark }) {
  const [form, setForm]     = useState({ fullName: '', role: ROLES.MEMBER, email: '', password: '', phone: '' });
  const [showPw, setShowPw] = useState(false);
  const [err,  setErr]      = useState('');
  const [busy, setBusy]     = useState(false);

  const set = f => e => { setForm(p => ({ ...p, [f]: e.target.value })); setErr(''); };

  const handleCreate = () => {
    if (!form.fullName.trim()) { setErr('Full name is required.'); return; }
    if (form.email.trim() && !/^\S+@\S+\.\S+$/.test(form.email.trim())) { setErr('Enter a valid email address.'); return; }
    if (form.email.trim() && allAccounts.some(a => a.email?.toLowerCase() === form.email.trim().toLowerCase())) { setErr('This email is already in use by another account.'); return; }
    if (form.password && form.password.length < 6) { setErr('Password must be at least 6 characters.'); return; }
    setBusy(true);
    setTimeout(() => {
      const id       = generateAccountId();
      const userId   = generateUserId(form.role, allAccounts);
      // Use admin-provided email or auto-generate from name+userId
      const email    = form.email.trim() || generateEmail(form.fullName, userId);
      // Use admin-set password if provided, otherwise auto-generate
      const password = form.password.trim() || generatePassword();
      const account  = {
        id,
        fullName:            form.fullName.trim(),
        email,
        phone:               form.phone.trim(),
        password,
        role:                form.role,
        userId,
        status:              'Active',
        requirePasswordReset: true,
        createdBy:           'Super Administrator',
        createdAt:           new Date().toISOString(),
      };
      onCreated(account, { userId, email, password });
    }, 400);
  };

  const bg     = isDark ? '#1e293b' : '#fff';
  const bord   = isDark ? '#334155' : '#e2e8f0';
  const tc     = isDark ? '#f1f5f9' : '#0f172a';
  const sc     = isDark ? '#94a3b8' : '#64748b';
  const inp    = { ...S.inp, backgroundColor: isDark ? '#1F2937' : '#fff', color: isDark ? '#f1f5f9' : '#334155', borderColor: isDark ? '#334155' : '#cbd5e1' };

  return (
    <div style={S.overlay}>
      <div style={{ ...S.modal, backgroundColor: bg, border: `1px solid ${bord}`, maxWidth: '520px' }}>

        {/* Header */}
        <div style={S.modalHead}>
          <div>
            <h3 style={{ ...S.modalTitle, color: tc }}>Create Account</h3>
            <p style={{ margin: '3px 0 0', fontSize: '13px', color: sc }}>User ID and email are generated automatically.</p>
          </div>
          <button style={{ ...S.closeBtn, color: sc }} onClick={onClose}>✕</button>
        </div>

        {/* Form */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>

          {/* Full name */}
          <div>
            <label style={{ ...S.lbl, color: sc }}>FULL NAME *</label>
            <input style={inp} value={form.fullName} onChange={set('fullName')} placeholder="e.g. Visal Chen" autoFocus />
          </div>

          {/* Email / Gmail */}
          <div>
            <label style={{ ...S.lbl, color: sc }}>
              EMAIL / GMAIL
              <span style={{ marginLeft: '6px', fontSize: '10px', fontWeight: '600', backgroundColor: isDark ? '#334155' : '#f1f5f9', color: sc, padding: '1px 7px', borderRadius: '10px', letterSpacing: '0.3px' }}>
                leave blank to auto-generate
              </span>
            </label>
            <div style={{ position: 'relative' }}>
              <span style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', fontSize: '15px', pointerEvents: 'none' }}>✉</span>
              <input
                style={{ ...inp, paddingLeft: '34px' }}
                type="email"
                value={form.email}
                onChange={set('email')}
                placeholder="user@gmail.com or leave blank"
                autoComplete="off"
              />
            </div>
          </div>

          {/* Role */}
          <div>
            <label style={{ ...S.lbl, color: sc }}>ROLE *</label>
            <select style={inp} value={form.role} onChange={set('role')}>
              {SA_ROLE_OPTIONS.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
            </select>
          </div>

          {/* Password (admin-set or auto-generated) */}
          <div>
            <label style={{ ...S.lbl, color: sc }}>
              PASSWORD
              <span style={{ marginLeft: '6px', fontSize: '10px', fontWeight: '600', backgroundColor: isDark ? '#334155' : '#f1f5f9', color: sc, padding: '1px 7px', borderRadius: '10px', letterSpacing: '0.3px' }}>
                leave blank to auto-generate
              </span>
            </label>
            <div style={{ position: 'relative' }}>
              <input
                type={showPw ? 'text' : 'password'}
                style={{ ...inp, paddingRight: '80px' }}
                value={form.password}
                onChange={set('password')}
                placeholder="Set a password, or leave blank"
                autoComplete="new-password"
              />
              <div style={{ position: 'absolute', right: '8px', top: '50%', transform: 'translateY(-50%)', display: 'flex', gap: '4px' }}>
                <button
                  type="button"
                  onClick={() => setShowPw(s => !s)}
                  tabIndex={-1}
                  style={{ background: 'none', border: 'none', cursor: 'pointer', color: sc, padding: '2px', fontSize: '14px', lineHeight: 1 }}
                >
                  {showPw ? '🙈' : '👁'}
                </button>
                <button
                  type="button"
                  title="Auto-generate a strong password"
                  onClick={() => { setForm(p => ({ ...p, password: generatePassword() })); setShowPw(true); setErr(''); }}
                  style={{ background: 'none', border: `1px solid ${bord}`, borderRadius: '5px', cursor: 'pointer', color: sc, padding: '2px 6px', fontSize: '11px', fontWeight: '700', lineHeight: 1 }}
                >
                  Auto
                </button>
              </div>
            </div>
            {form.password && (
              <p style={{ margin: '4px 0 0', fontSize: '11px', color: form.password.length < 6 ? '#ef4444' : '#10b981', fontWeight: '600' }}>
                {form.password.length < 6 ? `Too short (${form.password.length}/6)` : `✓ ${form.password.length} characters`}
              </p>
            )}
          </div>

          {/* Phone */}
          <div>
            <label style={{ ...S.lbl, color: sc }}>PHONE (optional)</label>
            <input style={inp} value={form.phone} onChange={set('phone')} placeholder="e.g. 012 345 678" />
          </div>

          {/* Info banner */}
          <div style={{ backgroundColor: isDark ? '#162032' : '#eff6ff', border: `1px solid ${isDark ? '#1e3a5f' : '#bfdbfe'}`, borderRadius: '10px', padding: '12px 14px', display: 'flex', gap: '10px', alignItems: 'flex-start' }}>
            <span style={{ fontSize: '16px', flexShrink: 0 }}>🔐</span>
            <p style={{ margin: 0, fontSize: '12px', color: isDark ? '#60a5fa' : '#3b82f6', lineHeight: '1.55' }}>
              A unique <strong>User ID</strong> and <strong>system email</strong> are generated automatically.
              The user will be required to change their password on first login.
            </p>
          </div>

          {err && <p style={{ color: '#ef4444', fontSize: '13px', margin: 0 }}>⚠ {err}</p>}

          {/* Actions */}
          <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end', marginTop: '4px' }}>
            <button style={{ ...S.ghostBtn, backgroundColor: isDark ? '#334155' : '#f1f5f9', color: isDark ? '#f1f5f9' : '#334155' }} onClick={onClose} disabled={busy}>
              Cancel
            </button>
            <button
              onClick={handleCreate}
              disabled={busy}
              style={{ ...S.darkBtn, backgroundColor: '#6366f1', display: 'flex', alignItems: 'center', gap: '8px', opacity: busy ? 0.7 : 1 }}
            >
              {busy
                ? <><span style={{ display: 'inline-block', width: '14px', height: '14px', border: '2px solid rgba(255,255,255,0.4)', borderTopColor: '#fff', borderRadius: '50%', animation: 'spin 0.7s linear infinite' }} /> Creating…</>
                : <>+ Create Account</>
              }
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// ── Credentials Reveal (shown once after SA quick-create) ──────────────────────

function CredentialsRevealModal({ account, creds, onClose, isDark }) {
  const [showPw, setShowPw] = useState(false);
  const [copied, setCopied] = useState({});

  const copyField = (key, value) => {
    navigator.clipboard?.writeText(value).catch(() => {});
    setCopied(p => ({ ...p, [key]: true }));
    setTimeout(() => setCopied(p => ({ ...p, [key]: false })), 2000);
  };

  const handleDownload = () => {
    const lines = [
      `Library Management System — New Account Credentials`,
      `Generated: ${new Date().toLocaleString()}`,
      `━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`,
      `Full Name  : ${account.fullName}`,
      `User ID    : ${creds.userId}`,
      `Email      : ${creds.email}`,
      `Password   : ${creds.password}`,
      `Role       : ${ROLE_LABELS[account.role] || account.role}`,
      account.department ? `Department : ${account.department}` : '',
      ``,
      `⚠ The user MUST change this password on first login.`,
      `   Store this file securely and delete after sharing.`,
    ].filter(l => l !== null).join('\n');

    const blob = new Blob([lines], { type: 'text/plain' });
    const url  = URL.createObjectURL(blob);
    const a    = Object.assign(document.createElement('a'), { href: url, download: `credentials-${creds.userId}.txt` });
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const bg   = isDark ? '#1e293b' : '#fff';
  const bord = isDark ? '#334155' : '#e2e8f0';
  const tc   = isDark ? '#f1f5f9' : '#0f172a';
  const sc   = isDark ? '#94a3b8' : '#64748b';
  const rowBg= isDark ? '#0f172a' : '#f8fafc';

  const Row = ({ label, value, id, mono = false }) => (
    <div style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '12px 16px', backgroundColor: rowBg, borderRadius: '8px', marginBottom: '8px' }}>
      <span style={{ width: '90px', flexShrink: 0, fontSize: '11px', fontWeight: '700', color: sc, textTransform: 'uppercase', letterSpacing: '0.5px' }}>{label}</span>
      <span style={{ flex: 1, fontSize: '14px', fontWeight: '700', color: tc, fontFamily: mono ? 'monospace' : 'inherit', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
        {id === 'password' ? (showPw ? value : '●'.repeat(value.length)) : value}
      </span>
      <div style={{ display: 'flex', gap: '6px', flexShrink: 0 }}>
        {id === 'password' && (
          <button onClick={() => setShowPw(s => !s)} style={{ background: 'none', border: `1px solid ${bord}`, borderRadius: '6px', padding: '4px 8px', cursor: 'pointer', fontSize: '12px', color: sc }}>
            {showPw ? '🙈' : '👁'}
          </button>
        )}
        <button
          onClick={() => copyField(id, value)}
          style={{ background: 'none', border: `1px solid ${copied[id] ? '#10b981' : bord}`, borderRadius: '6px', padding: '4px 10px', cursor: 'pointer', fontSize: '11px', fontWeight: '700', color: copied[id] ? '#10b981' : sc, transition: 'all 0.2s' }}
        >
          {copied[id] ? '✓ Copied' : 'Copy'}
        </button>
      </div>
    </div>
  );

  return (
    <div style={{ ...S.overlay, zIndex: 1100 }}>
      <div style={{ ...S.modal, backgroundColor: bg, border: `1px solid ${bord}`, maxWidth: '540px' }}>

        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'flex-start', gap: '14px', marginBottom: '20px' }}>
          <div style={{ width: '44px', height: '44px', borderRadius: '12px', backgroundColor: '#dcfce7', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '22px', flexShrink: 0 }}>✅</div>
          <div>
            <h3 style={{ margin: '0 0 3px', fontSize: '18px', fontWeight: '800', color: tc }}>Account Created</h3>
            <p style={{ margin: 0, fontSize: '13px', color: sc }}>
              <strong style={{ color: tc }}>{account.fullName}</strong> — {ROLE_LABELS[account.role] || account.role}
              {account.department ? ` · ${account.department}` : ''}
            </p>
          </div>
        </div>

        {/* Warning banner */}
        <div style={{ backgroundColor: isDark ? '#1a1200' : '#fefce8', border: `1px solid ${isDark ? '#854d0e' : '#fde68a'}`, borderRadius: '10px', padding: '12px 16px', marginBottom: '20px', display: 'flex', gap: '10px', alignItems: 'flex-start' }}>
          <span style={{ fontSize: '18px', flexShrink: 0 }}>⚠️</span>
          <p style={{ margin: 0, fontSize: '13px', fontWeight: '600', color: isDark ? '#fbbf24' : '#92400e', lineHeight: '1.5' }}>
            Save these credentials now. The password will <u>not</u> be shown again after you close this window.
          </p>
        </div>

        {/* Credential rows */}
        <Row label="Full Name" value={account.fullName}   id="name" />
        <Row label="User ID"   value={creds.userId}       id="userId" mono />
        <Row label="Email"     value={creds.email}        id="email" mono />
        <Row label="Password"  value={creds.password}     id="password" mono />

        {/* First-login notice */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginTop: '16px', padding: '10px 14px', backgroundColor: isDark ? '#162032' : '#eff6ff', borderRadius: '8px', border: `1px solid ${isDark ? '#1e3a5f' : '#bfdbfe'}` }}>
          <span style={{ fontSize: '16px' }}>🔁</span>
          <p style={{ margin: 0, fontSize: '12px', color: isDark ? '#93c5fd' : '#1d4ed8', fontWeight: '600' }}>
            This user will be prompted to set a new password when they first log in.
          </p>
        </div>

        {/* Actions */}
        <div style={{ display: 'flex', gap: '10px', marginTop: '20px', justifyContent: 'space-between', flexWrap: 'wrap' }}>
          <button
            onClick={handleDownload}
            style={{ ...S.ghostBtn, backgroundColor: isDark ? '#334155' : '#f1f5f9', color: isDark ? '#f1f5f9' : '#334155', display: 'flex', alignItems: 'center', gap: '8px' }}
          >
            📥 Download .txt
          </button>
          <button onClick={onClose} style={{ ...S.darkBtn, backgroundColor: '#6366f1', minWidth: '120px' }}>
            Done →
          </button>
        </div>
      </div>
    </div>
  );
}

// ── Main Component ─────────────────────────────────────────────────────────────

export default function UserManagement() {
  const session       = getSession();
  const currentUserId = session?.id;
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  const isSuperAdmin = session?.role === ROLES.SUPER_ADMIN;

  const [accounts,       setAccounts]       = useState(() => getAllAccounts());
  const [roleTab,        setRoleTab]        = useState('all');
  const [search,         setSearch]         = useState('');
  const [page,           setPage]           = useState(1);
  const [showCreate,     setShowCreate]     = useState(false);
  const [showSACreate,   setShowSACreate]   = useState(false);
  const [revealCreds,    setRevealCreds]    = useState(null); // { account, creds }
  const [editUser,       setEditUser]       = useState(null);
  const [resetUser,      setResetUser]      = useState(null);
  const [changeRoleUser, setChangeRoleUser] = useState(null);
  const [deleteUser,     setDeleteUser]     = useState(null);
  const [openMenu,       setOpenMenu]       = useState(null);
  const [toast,          setToast]          = useState('');

  const load  = ()  => setAccounts(getAllAccounts());
  const flash = msg => { setToast(msg); setTimeout(() => setToast(''), 4000); };

  // ── Filtering (recalculated whenever accounts, roleTab, or search changes) ───
  const filtered = useMemo(() => {
    const q = search.toLowerCase().trim();
    return accounts.filter(a => {
      if (!a) return false;
      const matchTab    = roleTab === 'all' || a.role === roleTab;
      const matchSearch = !q ||
        a.fullName?.toLowerCase().includes(q) ||
        a.email?.toLowerCase().includes(q) ||
        (a.phone || '').includes(q);
      return matchTab && matchSearch;
    });
  }, [accounts, roleTab, search]);

  // Reset page whenever filter or search changes
  const changeTab    = key => { setRoleTab(key); setPage(1); };
  const changeSearch = e   => { setSearch(e.target.value); setPage(1); };

  // ── Pagination ────────────────────────────────────────────────────────────────
  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const safePage   = Math.min(page, totalPages);
  const pageItems  = filtered.slice((safePage - 1) * PAGE_SIZE, safePage * PAGE_SIZE);

  // ── Tab counts (always reflect full account list, not filtered) ───────────────
  const counts = useMemo(() => ({
    all:                   accounts.filter(a => a).length,
    [ROLES.SUPER_ADMIN]:   accounts.filter(a => a?.role === ROLES.SUPER_ADMIN).length,
    [ROLES.ADMINISTRATOR]: accounts.filter(a => a?.role === ROLES.ADMINISTRATOR).length,
    [ROLES.LIBRARIAN]:     accounts.filter(a => a?.role === ROLES.LIBRARIAN).length,
    [ROLES.MEMBER]:        accounts.filter(a => a?.role === ROLES.MEMBER).length,
  }), [accounts]);

  // ── Stats (one card per role — no "Staff" grouping) ─────────────────────────
  const statsTotal  = accounts.filter(a => a).length;
  const statsActive = accounts.filter(a => a && (a.status === 'Active' || !a.status)).length;
  const statsSusp   = accounts.filter(a => a?.status === 'Suspended').length;
  const statsAdmin  = accounts.filter(a => a?.role === ROLES.ADMINISTRATOR).length;
  const statsLib    = accounts.filter(a => a?.role === ROLES.LIBRARIAN).length;
  const statsUser   = accounts.filter(a => a?.role === ROLES.MEMBER).length;

  // ── Permission helpers ────────────────────────────────────────────────────────
  const isProtected = u => u?.role === ROLES.SUPER_ADMIN || u?.id === currentUserId;

  // ── Create (standard — admin/librarian creating manually) ────────────────────
  const handleCreate = form => {
    const all = getAllAccounts();
    const id  = `user-${Date.now()}`;
    saveStaffAccounts([...all, {
      id,
      fullName:  form.fullName.trim(),
      email:     form.email.trim().toLowerCase(),
      phone:     form.phone.trim(),
      password:  form.password,
      role:      form.role,
      userId:    id.toUpperCase(),
      status:    'Active',
      createdBy: session?.fullName || 'Administrator',
      createdAt: new Date().toISOString(),
    }]);
    load();
    setShowCreate(false);
    flash(`Account created for ${form.fullName.trim()}.`);
  };

  // ── Create (Super Admin quick-create — auto-generated credentials) ────────────
  const handleSACreate = (account, creds) => {
    const all = getAllAccounts();
    saveStaffAccounts([...all, account]);
    load();
    setShowSACreate(false);
    setRevealCreds({ account, creds });
    // No toast — credentials modal is the feedback
  };

  // ── Edit ──────────────────────────────────────────────────────────────────────
  const handleEdit = form => {
    if (!editUser) return;
    if (editUser._isSelfRegistered === true) {
      updateSelfMember({
        fullName: form.fullName.trim(),
        username: form.fullName.trim(),
        email:    form.email.trim().toLowerCase(),
        phone:    form.phone.trim(),
        ...(form.password ? { password: form.password } : {}),
      });
    } else {
      saveStaffAccounts(getAllAccounts().map(a => {
        if (!a || a.id !== editUser.id) return a;
        return { ...a, fullName: form.fullName.trim(), email: form.email.trim().toLowerCase(), phone: form.phone.trim(), role: form.role, ...(form.password ? { password: form.password } : {}) };
      }));
    }
    load();
    setEditUser(null);
    flash(`${form.fullName.trim()} updated successfully.`);
  };

  // ── Reset Password ────────────────────────────────────────────────────────────
  const handleResetPassword = pw => {
    if (!resetUser) return;
    if (resetUser._isSelfRegistered === true) {
      updateSelfMember({ password: pw });
    } else {
      saveStaffAccounts(getAllAccounts().map(a => (!a || a.id !== resetUser.id) ? a : { ...a, password: pw }));
    }
    load();
    const name = resetUser.fullName;
    setResetUser(null);
    flash(`Password reset for ${name}.`);
  };

  // ── Change Role ───────────────────────────────────────────────────────────────
  const handleChangeRole = newRole => {
    if (!changeRoleUser) return;
    saveStaffAccounts(getAllAccounts().map(a => (!a || a.id !== changeRoleUser.id) ? a : { ...a, role: newRole }));
    load();
    const name = changeRoleUser.fullName;
    setChangeRoleUser(null);
    flash(`${name} is now ${ROLE_LABELS[newRole] || newRole}.`);
  };

  // ── Toggle Status ─────────────────────────────────────────────────────────────
  const handleToggleStatus = user => {
    if (!user || isProtected(user)) return;
    const newStatus = (user.status || 'Active') === 'Active' ? 'Suspended' : 'Active';
    if (user._isSelfRegistered === true) {
      updateSelfMember({ status: newStatus });
    } else {
      saveStaffAccounts(getAllAccounts().map(a => (!a || a.id !== user.id) ? a : { ...a, status: newStatus }));
    }
    load();
    flash(`${user.fullName} has been ${newStatus.toLowerCase()}.`);
  };

  // ── Delete ────────────────────────────────────────────────────────────────────
  const handleDeleteConfirm = () => {
    if (!deleteUser) return;
    if (deleteUser._isSelfRegistered === true) {
      localStorage.removeItem(MEMBER_KEY);
    } else {
      saveStaffAccounts(getAllAccounts().filter(a => a?.id !== deleteUser.id));
    }
    const name = deleteUser.fullName;
    load();
    setDeleteUser(null);
    flash(`${name} has been permanently deleted.`);
  };

  // ── Render ────────────────────────────────────────────────────────────────────

  return (
    <div style={S.page} onClick={() => setOpenMenu(null)}>

      {/* Toast notification */}
      {toast && <div style={S.toast}>{toast}</div>}

      {/* Page header */}
      <div style={S.header}>
        <div>
          <h2 style={{ ...S.title, color: isDark ? '#f1f5f9' : '#0f172a' }}>Account Management</h2>
          <p style={{ ...S.sub, color: isDark ? '#94a3b8' : '#64748b' }}>Create, edit, and manage all library accounts across every role.</p>
        </div>
        <button
          style={{ ...S.darkBtn, backgroundColor: isSuperAdmin ? '#6366f1' : '#0f172a', display: 'flex', alignItems: 'center', gap: '8px' }}
          onClick={() => isSuperAdmin ? setShowSACreate(true) : setShowCreate(true)}
        >
          + Create Account
        </button>
      </div>

      {/* Stats row — one card per role, no "Staff" grouping */}
      <div style={S.statsRow}>
        <StatCard label="Total Accounts"  value={statsTotal}  accent="#6366f1" isDark={isDark} />
        <StatCard label="Administrators"  value={statsAdmin}  accent="#3b82f6" isDark={isDark} />
        <StatCard label="Librarians"      value={statsLib}    accent="#10b981" isDark={isDark} />
        <StatCard label="Users"           value={statsUser}   accent="#f59e0b" isDark={isDark} />
        <StatCard label="Active"          value={statsActive} accent="#059669" isDark={isDark} />
        <StatCard label="Suspended"       value={statsSusp}   accent="#ef4444" isDark={isDark} />
      </div>

      {/* Role tabs + search */}
      <div style={S.toolbar}>
        <div style={{ ...S.tabs, backgroundColor: isDark ? '#0f172a' : 'transparent' }}>
          {ROLE_TABS.map(t => {
            const active = roleTab === t.key;
            return (
              <button
                key={t.key}
                style={{
                  ...S.tab,
                  backgroundColor: active ? t.color      : 'transparent',
                  color:           active ? '#fff'        : (isDark ? '#64748b' : '#64748b'),
                  border:          `1px solid ${active ? t.color : (isDark ? '#334155' : '#e2e8f0')}`,
                }}
                onClick={() => changeTab(t.key)}
              >
                {t.label}
                <span style={{
                  ...S.tabCount,
                  backgroundColor: active ? 'rgba(255,255,255,0.25)' : (isDark ? '#1e293b' : '#f1f5f9'),
                  color:           active ? '#fff' : (isDark ? '#94a3b8' : '#64748b'),
                }}>
                  {counts[t.key] ?? 0}
                </span>
              </button>
            );
          })}
        </div>
        <input
          style={{ ...S.searchBox, backgroundColor: isDark ? '#1F2937' : '#fff', color: isDark ? '#f1f5f9' : '#0f172a', borderColor: isDark ? '#334155' : '#cbd5e1' }}
          placeholder="Search name, email, or phone…"
          value={search}
          onChange={changeSearch}
        />
      </div>

      {/* Accounts table */}
      <div style={{ ...S.tableWrap, backgroundColor: isDark ? '#1e293b' : '#fff', border: `1px solid ${isDark ? '#334155' : '#e2e8f0'}` }}>
        <table style={S.table}>
          <thead>
            <tr style={{ backgroundColor: isDark ? '#0f172a' : '#f8fafc' }}>
              {['#', '', 'Name', 'Email', 'Phone', 'Role', 'Status', 'Created', 'Actions'].map(h => (
                <th key={h} style={{ ...S.th, color: isDark ? '#CBD5E1' : '#64748b' }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {pageItems.length === 0 && (
              <tr>
                <td colSpan={9} style={{ padding: '52px', textAlign: 'center', color: '#94a3b8', fontSize: '14px' }}>
                  {search
                    ? `No accounts match "${search}".`
                    : roleTab === 'all'
                      ? 'No accounts found.'
                      : `No ${ROLE_LABELS[roleTab] || roleTab} accounts yet.`
                  }
                </td>
              </tr>
            )}
            {pageItems.map((user, idx) => {
              const protected_ = isProtected(user);
              const isSelf     = user.id === currentUserId;
              const rowNum     = (safePage - 1) * PAGE_SIZE + idx + 1;
              const isActive   = (user.status || 'Active') === 'Active';

              return (
                <tr key={user.id} style={{ borderTop: `1px solid ${isDark ? '#334155' : '#f1f5f9'}`, backgroundColor: idx % 2 === 0 ? (isDark ? '#1e293b' : '#fff') : (isDark ? '#162032' : '#fafafa') }}>

                  {/* # */}
                  <td style={{ ...S.td, color: '#94a3b8', fontSize: '12px', width: '40px' }}>{rowNum}</td>

                  {/* Avatar */}
                  <td style={{ ...S.td, width: '44px' }}>
                    <AccountAvatar account={user} size={32} />
                  </td>

                  {/* Name */}
                  <td style={S.td}>
                    <div style={{ fontWeight: '600', color: isDark ? '#f1f5f9' : '#0f172a', display: 'flex', alignItems: 'center', gap: '6px' }}>
                      {user.fullName}
                      {isSelf && (
                        <span style={{ fontSize: '10px', fontWeight: '700', color: '#6366f1', backgroundColor: '#ede9fe', padding: '1px 6px', borderRadius: '10px' }}>YOU</span>
                      )}
                    </div>
                    <div style={{ fontSize: '11px', color: '#94a3b8', marginTop: '1px' }}>{user.userId}</div>
                  </td>

                  {/* Email */}
                  <td style={{ ...S.td, color: isDark ? '#CBD5E1' : '#475569' }}>{user.email}</td>

                  {/* Phone */}
                  <td style={{ ...S.td, color: isDark ? '#94a3b8' : '#64748b', fontSize: '13px' }}>{user.phone || '—'}</td>

                  {/* Role */}
                  <td style={S.td}><RoleBadge role={user.role} /></td>

                  {/* Status */}
                  <td style={S.td}><StatusDot status={user.status} /></td>

                  {/* Created date */}
                  <td style={{ ...S.td, fontSize: '12px', color: '#64748b' }}>
                    {user.createdAt
                      ? new Date(user.createdAt).toLocaleDateString(undefined, { day: 'numeric', month: 'short', year: '2-digit' })
                      : (user.createdBy || 'System')}
                  </td>

                  {/* Actions — 2 main buttons + ⋯ overflow menu */}
                  <td style={{ ...S.td, whiteSpace: 'nowrap' }}>
                    <div style={{ display: 'flex', gap: '5px', alignItems: 'center' }}>

                      {/* Main 1: Edit (always visible) */}
                      <button
                        style={{ ...S.btn, ...S.btnBlue }}
                        onClick={() => setEditUser(user)}
                      >
                        Edit
                      </button>

                      {/* Main 2: Suspend / Activate (only for non-protected accounts) */}
                      {!protected_ ? (
                        <button
                          style={{ ...S.btn, ...(isActive ? S.btnYellow : S.btnGreen) }}
                          onClick={() => handleToggleStatus(user)}
                        >
                          {isActive ? 'Suspend' : 'Activate'}
                        </button>
                      ) : (
                        !isSelf && (
                          <span style={{ fontSize: '11px', color: '#94a3b8', fontStyle: 'italic' }}>
                            Protected
                          </span>
                        )
                      )}

                      {/* ⋯ overflow menu — Reset PW, Change Role, Delete */}
                      <div style={{ position: 'relative' }} onClick={e => e.stopPropagation()}>
                        <button
                          style={S.dotBtn}
                          onClick={() => setOpenMenu(openMenu === user.id ? null : user.id)}
                          title="More actions"
                        >
                          ⋯
                        </button>

                        {openMenu === user.id && (
                          <div style={S.dotPanel}>
                            {/* Reset Password — available for all accounts */}
                            <button
                              style={S.dotItem}
                              onClick={() => { setResetUser(user); setOpenMenu(null); }}
                            >
                              🔑 Reset Password
                            </button>

                            {/* Change Role — only for non-protected */}
                            {!protected_ && (
                              <button
                                style={S.dotItem}
                                onClick={() => { setChangeRoleUser(user); setOpenMenu(null); }}
                              >
                                🔄 Change Role
                              </button>
                            )}

                            {/* Delete — only for non-protected, with red highlight */}
                            {!protected_ && (
                              <>
                                <div style={S.dotDivider} />
                                <button
                                  style={{ ...S.dotItem, color: '#ef4444' }}
                                  onClick={() => { setDeleteUser(user); setOpenMenu(null); }}
                                >
                                  🗑 Delete Account
                                </button>
                              </>
                            )}
                          </div>
                        )}
                      </div>

                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {filtered.length > 0 && (
        <div style={S.paginationRow}>
          <span style={{ fontSize: '13px', color: '#64748b' }}>
            Showing {filtered.length === 0 ? 0 : (safePage - 1) * PAGE_SIZE + 1}–{Math.min(safePage * PAGE_SIZE, filtered.length)} of {filtered.length} account{filtered.length !== 1 ? 's' : ''}
          </span>
          {totalPages > 1 && (
            <div style={{ display: 'flex', gap: '4px', alignItems: 'center' }}>
              <button
                style={{ ...S.pgBtn, opacity: safePage === 1 ? 0.4 : 1 }}
                onClick={() => setPage(p => Math.max(1, p - 1))}
                disabled={safePage === 1}
              >← Prev</button>
              {Array.from({ length: totalPages }, (_, i) => i + 1).map(n => (
                <button
                  key={n}
                  style={{ ...S.pgBtn, ...(n === safePage ? S.pgActive : {}) }}
                  onClick={() => setPage(n)}
                >{n}</button>
              ))}
              <button
                style={{ ...S.pgBtn, opacity: safePage === totalPages ? 0.4 : 1 }}
                onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                disabled={safePage === totalPages}
              >Next →</button>
            </div>
          )}
        </div>
      )}

      {/* ── Modals ─────────────────────────────────────────────────────────────── */}

      {/* Super Admin quick-create (auto-generated credentials) */}
      {showSACreate && (
        <SuperAdminCreateModal
          key={`sa-create-${Date.now()}`}
          allAccounts={accounts}
          onCreated={handleSACreate}
          onClose={() => setShowSACreate(false)}
          isDark={isDark}
        />
      )}

      {/* Credentials reveal — shown once after SA quick-create */}
      {revealCreds && (
        <CredentialsRevealModal
          account={revealCreds.account}
          creds={revealCreds.creds}
          onClose={() => { setRevealCreds(null); flash(`Account created for ${revealCreds.account.fullName}.`); }}
          isDark={isDark}
        />
      )}

      {/* Standard create form (for admin/librarian) */}
      {showCreate && (
        <AccountFormModal
          key={`create-${showCreate}`}
          allAccounts={accounts}
          onSave={handleCreate}
          onClose={() => setShowCreate(false)}
        />
      )}
      {editUser && (
        <AccountFormModal
          key={`edit-${editUser.id}`}
          editUser={editUser}
          allAccounts={accounts}
          onSave={handleEdit}
          onClose={() => setEditUser(null)}
        />
      )}
      {resetUser && (
        <ResetPasswordModal
          user={resetUser}
          onSave={handleResetPassword}
          onClose={() => setResetUser(null)}
        />
      )}
      {changeRoleUser && (
        <ChangeRoleModal
          user={changeRoleUser}
          onSave={handleChangeRole}
          onClose={() => setChangeRoleUser(null)}
        />
      )}
      {deleteUser && (
        <DeleteModal
          user={deleteUser}
          onConfirm={handleDeleteConfirm}
          onClose={() => setDeleteUser(null)}
        />
      )}
    </div>
  );
}

// ── Styles ─────────────────────────────────────────────────────────────────────

const S = {
  page:         { fontFamily: 'system-ui, sans-serif', position: 'relative' },
  header:       { display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '24px', flexWrap: 'wrap', gap: '12px' },
  title:        { margin: '0 0 4px', fontSize: '22px', fontWeight: '800', color: '#0f172a' },
  sub:          { margin: 0, fontSize: '14px', color: '#64748b' },
  statsRow:     { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(140px, 1fr))', gap: '14px', marginBottom: '20px' },
  statCard:     { backgroundColor: '#fff', border: '1px solid #e2e8f0', borderRadius: '10px', padding: '16px' },
  statValue:    { margin: '0 0 4px', fontSize: '28px', fontWeight: '800', color: '#0f172a' },
  statLabel:    { margin: 0, fontSize: '12px', fontWeight: '600', color: '#64748b' },
  toolbar:      { display: 'flex', gap: '12px', marginBottom: '16px', flexWrap: 'wrap', alignItems: 'center' },
  tabs:         { display: 'flex', gap: '6px', flexWrap: 'wrap' },
  tab:          { padding: '7px 14px', borderRadius: '20px', fontSize: '13px', fontWeight: '600', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px', transition: 'all 0.15s' },
  tabCount:     { borderRadius: '10px', padding: '1px 7px', fontSize: '11px', fontWeight: '700' },
  searchBox:    { padding: '9px 14px', border: '1px solid #cbd5e1', borderRadius: '8px', fontSize: '14px', outline: 'none', minWidth: '220px' },
  tableWrap:    { backgroundColor: '#fff', borderRadius: '10px', border: '1px solid #e2e8f0', overflow: 'auto' },
  table:        { width: '100%', borderCollapse: 'collapse', fontSize: '14px', minWidth: '900px' },
  th:           { padding: '12px 14px', textAlign: 'left', fontSize: '11px', fontWeight: '700', color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.05em', whiteSpace: 'nowrap' },
  td:           { padding: '11px 14px', color: '#334155', verticalAlign: 'middle' },
  badge:        { fontSize: '11px', fontWeight: '700', padding: '3px 10px', borderRadius: '20px', display: 'inline-block', whiteSpace: 'nowrap' },
  btn:          { border: 'none', padding: '4px 10px', borderRadius: '6px', fontSize: '11px', fontWeight: '700', cursor: 'pointer', whiteSpace: 'nowrap' },
  btnBlue:      { backgroundColor: '#dbeafe', color: '#1d4ed8' },
  btnGray:      { backgroundColor: '#f1f5f9', color: '#475569' },
  btnPurple:    { backgroundColor: '#ede9fe', color: '#5b21b6' },
  btnYellow:    { backgroundColor: '#fef3c7', color: '#92400e' },
  btnGreen:     { backgroundColor: '#dcfce7', color: '#166534' },
  btnRed:       { backgroundColor: '#fee2e2', color: '#991b1b' },
  paginationRow:{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '14px', flexWrap: 'wrap', gap: '10px' },
  pgBtn:        { padding: '6px 12px', border: '1px solid #e2e8f0', borderRadius: '6px', backgroundColor: '#fff', fontSize: '13px', cursor: 'pointer', fontWeight: '500' },
  pgActive:     { backgroundColor: '#0f172a', color: '#fff', borderColor: '#0f172a' },
  // Modals
  overlay:      { position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, padding: '20px' },
  modal:        { backgroundColor: '#fff', borderRadius: '16px', padding: '28px', width: '100%', maxWidth: '560px', boxShadow: '0 20px 60px rgba(0,0,0,0.3)' },
  modalHead:    { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' },
  modalTitle:   { margin: 0, fontSize: '18px', fontWeight: '800', color: '#0f172a' },
  closeBtn:     { backgroundColor: 'transparent', border: 'none', fontSize: '18px', cursor: 'pointer', color: '#64748b', lineHeight: 1 },
  grid2:        { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' },
  lbl:          { display: 'block', fontSize: '11px', fontWeight: '700', color: '#475569', letterSpacing: '0.5px', marginBottom: '6px' },
  inp:          { width: '100%', padding: '9px 12px', border: '1px solid #cbd5e1', borderRadius: '8px', fontSize: '14px', outline: 'none', boxSizing: 'border-box', backgroundColor: '#fff' },
  ghostBtn:     { backgroundColor: '#f1f5f9', color: '#334155', border: 'none', padding: '10px 20px', borderRadius: '8px', fontSize: '13px', fontWeight: '600', cursor: 'pointer' },
  darkBtn:      { backgroundColor: '#0f172a', color: '#ffffff', border: 'none', padding: '10px 20px', borderRadius: '8px', fontSize: '13px', fontWeight: '700', cursor: 'pointer' },
  toast:        { position: 'fixed', bottom: '24px', right: '24px', backgroundColor: '#0f172a', color: '#fff', padding: '14px 20px', borderRadius: '10px', fontSize: '14px', fontWeight: '600', zIndex: 2000, boxShadow: '0 4px 20px rgba(0,0,0,0.3)', maxWidth: '360px' },
  // ⋯ overflow menu
  dotBtn:    { border: 'none', backgroundColor: '#f1f5f9', color: '#475569', fontSize: '16px', fontWeight: '700', width: '28px', height: '28px', borderRadius: '6px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', lineHeight: 1, letterSpacing: '1px' },
  dotPanel:  { position: 'absolute', right: 0, top: '110%', backgroundColor: '#fff', border: '1px solid #e2e8f0', borderRadius: '10px', boxShadow: '0 8px 24px rgba(0,0,0,0.12)', zIndex: 200, minWidth: '170px', overflow: 'hidden' },
  dotItem:   { display: 'block', width: '100%', padding: '10px 16px', fontSize: '13px', fontWeight: '600', color: '#0f172a', backgroundColor: 'transparent', border: 'none', textAlign: 'left', cursor: 'pointer', whiteSpace: 'nowrap' },
  dotDivider:{ height: '1px', backgroundColor: '#f1f5f9', margin: '4px 0' },
};
