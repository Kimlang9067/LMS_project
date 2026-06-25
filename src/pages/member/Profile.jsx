import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router';
import {
  getCirculationRecords,
  processExpiredLoans,
  getActiveLoans,
  getBorrowingHistory,
} from '../../utils/circulation';
import { notifyProfileUpdated, checkReturnReminders } from '../../utils/notifications';

const TABS = ['Currently Borrowed', 'Borrowing History'];

const RECENT_ACTIVITY = [
  { title: 'Book Returned', desc: '"Semantics: Volume 1" was successfully returned.', time: '2 Days Ago' },
  { title: 'New Hold Placed', desc: 'Request for "Deep Learning" confirmed. Queue: #2.', time: '4 Days Ago' },
  { title: 'Membership Validated', desc: 'Annual credentials verified. Access valid until Oct 2025.', time: 'Oct 20, 2024' },
];

export default function Profile() {
  const location = useLocation();

  const [activeTab,      setActiveTab]      = useState(0);
  const [emailNotif,     setEmailNotif]     = useState(true);
  const [autoRenew,      setAutoRenew]      = useState(false);
  const [isEditing,      setIsEditing]      = useState(false);
  const [circulationRecs,setCirculationRecs]= useState([]);
  const [selectedImage,  setSelectedImage]  = useState(null);

  const [user, setUser] = useState({ fullName: '', email: '', username: '', phone: '', userId: '', status: 'Active Member' });
  const [form, setForm] = useState({ name: '', email: '', phone: '' });

  const fileInputRef = React.useRef(null);

  useEffect(() => {
    const stored = localStorage.getItem('userAccount');
    if (stored) {
      const parsed = JSON.parse(stored);
      setUser(parsed);
      setForm({ name: parsed.fullName || '', email: parsed.email || '', phone: parsed.phone || '' });

      // Prefer memberAvatar_ key (syncs with layout header), fall back to inline profilePicture
      const avatarKey = `memberAvatar_${parsed.username || 'member'}`;
      const avatar = localStorage.getItem(avatarKey) || parsed.profilePicture;
      if (avatar) setSelectedImage(avatar);

      const recs = processExpiredLoans(getCirculationRecords());
      checkReturnReminders(recs, parsed.fullName || parsed.username);
      setCirculationRecs(recs);
    } else {
      setCirculationRecs(processExpiredLoans(getCirculationRecords()));
    }
    if (location.state?.editing) setIsEditing(true);
  }, [location.state]);

  const userName    = user.fullName || user.username;
  const userRecs    = circulationRecs.filter(r => r.user === userName);
  const activeLoans = getActiveLoans(userRecs);
  const history     = getBorrowingHistory(userRecs);
  const visible     = activeTab === 0 ? activeLoans : history;

  const handleSave = (e) => {
    e.preventDefault();
    const updated = { ...user, fullName: form.name, email: form.email, phone: form.phone };
    if (selectedImage) {
      localStorage.setItem(`memberAvatar_${user.username || 'member'}`, selectedImage);
    }
    setUser(updated);
    localStorage.setItem('userAccount', JSON.stringify(updated));
    setIsEditing(false);
    notifyProfileUpdated();
    alert('Profile updated successfully!');
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    if (file.size > 2 * 1024 * 1024) { alert('Image must be 2 MB or smaller.'); return; }
    const reader = new FileReader();
    reader.onload = () => {
      setSelectedImage(reader.result);
      localStorage.setItem(`memberAvatar_${user.username || 'member'}`, reader.result);
    };
    reader.readAsDataURL(file);
  };

  return (
    <div style={{ maxWidth: '1100px' }}>
      {isEditing ? (

        /* ── EDIT FORM ────────────────────────────────────────────────────── */
        <div style={{ ...s.card, maxWidth: '760px', margin: '0 auto' }}>
          <div style={{ marginBottom: '24px', borderBottom: '1px solid #e2e8f0', paddingBottom: '16px' }}>
            <h2 style={{ fontSize: '22px', fontWeight: '800', margin: 0, color: '#0f172a' }}>Edit Profile</h2>
            <p style={{ fontSize: '14px', color: '#64748b', marginTop: '4px' }}>Update your membership details.</p>
          </div>

          <form onSubmit={handleSave} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            {/* Avatar */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '20px', paddingBottom: '20px', borderBottom: '1px solid #f1f5f9' }}>
              {selectedImage
                ? <img src={selectedImage} alt="Avatar" style={s.avatarLg} />
                : <div style={s.avatarLg}>{form.name.charAt(0) || 'M'}</div>}
              <input type="file" ref={fileInputRef} style={{ display: 'none' }} accept="image/*" onChange={handleImageChange} />
              <div>
                <button type="button" onClick={() => fileInputRef.current.click()} style={s.darkBtn}>Change Photo</button>
                <p style={{ fontSize: '11px', color: '#94a3b8', marginTop: '6px' }}>PNG or JPG up to 2 MB.</p>
              </div>
            </div>

            {/* Fields */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
              <div>
                <label style={s.fieldLabel}>Full Name</label>
                <input style={s.fieldInput} value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} required />
              </div>
              <div>
                <label style={s.fieldLabel}>Email Address</label>
                <input style={s.fieldInput} type="email" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} required />
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
              <div>
                <label style={s.fieldLabel}>Phone Number</label>
                <input style={s.fieldInput} value={form.phone} onChange={e => setForm({ ...form, phone: e.target.value })} />
              </div>
              <div>
                <label style={{ ...s.fieldLabel, color: '#94a3b8' }}>Library ID (locked)</label>
                <input style={{ ...s.fieldInput, color: '#94a3b8', backgroundColor: '#f8fafc', cursor: 'not-allowed' }} value={user.userId} disabled />
              </div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', borderTop: '1px solid #e2e8f0', paddingTop: '20px' }}>
              <button type="button" onClick={() => setIsEditing(false)} style={s.ghostBtn}>Cancel</button>
              <button type="submit" style={s.darkBtn}>Save Changes</button>
            </div>
          </form>
        </div>

      ) : (

        /* ── VIEW MODE ────────────────────────────────────────────────────── */
        <>
          {/* Profile hero */}
          <div style={{ marginBottom: '32px' }}>
            <div style={{ ...s.card, display: 'flex', alignItems: 'flex-start', gap: '24px', position: 'relative' }}>
              {selectedImage
                ? <img src={selectedImage} alt="Avatar" style={s.avatarLg} />
                : <div style={s.avatarLg}>{user.fullName?.charAt(0) || 'M'}</div>}

              <div style={{ flex: 1 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '4px', flexWrap: 'wrap' }}>
                  <h2 style={{ fontSize: '22px', fontWeight: '800', color: '#0f172a', margin: 0 }}>{user.fullName}</h2>
                  <span style={s.activeBadge}>{user.status}</span>
                  <button onClick={() => setIsEditing(true)} style={s.editBtn}>Edit Profile</button>
                </div>
                <p style={{ fontSize: '14px', color: '#64748b', marginBottom: '20px' }}>Library Member</p>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: '16px' }}>
                  {[
                    { icon: '✉', label: 'Email',      val: user.email },
                    { icon: '🪪', label: 'Library ID', val: user.userId },
                    { icon: '📱', label: 'Phone',      val: user.phone || '—' },
                  ].map(m => (
                    <div key={m.label} style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                      <div style={{ width: '36px', height: '36px', borderRadius: '10px', backgroundColor: '#f1f5f9', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '16px', flexShrink: 0 }}>{m.icon}</div>
                      <div>
                        <p style={{ margin: '0 0 2px', fontSize: '10px', fontWeight: '700', color: '#94a3b8', textTransform: 'uppercase' }}>{m.label}</p>
                        <p style={{ margin: 0, fontSize: '13px', fontWeight: '600', color: '#0f172a' }}>{m.val}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Tabs */}
          <div style={s.tabsBar}>
            {TABS.map((tab, i) => (
              <button
                key={tab}
                style={{ ...s.tabBtn, ...(activeTab === i ? s.tabBtnActive : {}) }}
                onClick={() => setActiveTab(i)}
              >
                {tab} ({i === 0 ? activeLoans.length : history.length})
              </button>
            ))}
          </div>

          {/* Table */}
          <div style={{ ...s.card, padding: 0, overflow: 'hidden', marginBottom: '32px' }}>
            {visible.length === 0 ? (
              <div style={{ padding: '48px', textAlign: 'center', color: '#94a3b8' }}>
                <p style={{ fontSize: '15px', margin: 0 }}>No items under "{TABS[activeTab]}".</p>
              </div>
            ) : (
              <div style={{ overflowX: 'auto' }}>
                <table style={s.table}>
                  <thead>
                    <tr style={{ backgroundColor: '#f8fafc', borderBottom: '1px solid #e2e8f0' }}>
                      {['Book Details', 'Borrower', 'Issue Date', 'Due / Return Date', 'Status'].map(col => (
                        <th key={col} style={s.th}>{col}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {visible.map((r, i) => {
                      const isExpired = r.returnDate && new Date() > new Date(r.returnDate);
                      return (
                        <tr key={r.id || i} style={{ backgroundColor: i % 2 === 0 ? '#fff' : '#f8faff' }}>
                          <td style={s.td}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                              <div style={{ width: '38px', height: '50px', backgroundColor: '#f1f5f9', borderRadius: '6px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '18px', flexShrink: 0 }}>📘</div>
                              <p style={{ margin: 0, fontSize: '14px', fontWeight: '700', color: '#0f172a' }}>{r.book}</p>
                            </div>
                          </td>
                          <td style={{ ...s.td, color: '#475569', fontWeight: '600' }}>{r.user}</td>
                          <td style={{ ...s.td, color: '#64748b' }}>{r.issueDate || 'N/A'}</td>
                          <td style={{ ...s.td, fontWeight: '700', color: r.status === 'Borrowed' ? (isExpired ? '#b91c1c' : '#0f172a') : '#16a34a' }}>
                            {r.returnDate || 'N/A'}
                          </td>
                          <td style={s.td}>
                            <span style={{
                              display: 'inline-block', padding: '3px 10px', borderRadius: '20px', fontSize: '11px', fontWeight: '700', letterSpacing: '0.5px',
                              ...(r.status === 'Borrowed'
                                ? (isExpired ? { backgroundColor: 'rgba(185,28,28,0.1)', color: '#b91c1c' } : { backgroundColor: 'rgba(59,130,246,0.1)', color: '#2563eb' })
                                : r.status === 'Overdue'
                                ? { backgroundColor: 'rgba(185,28,28,0.1)', color: '#b91c1c' }
                                : { backgroundColor: '#dcfce7', color: '#16a34a' }),
                            }}>
                              {r.status === 'Borrowed' ? (isExpired ? 'Overdue' : 'Active Loan') : r.status === 'Overdue' ? 'Past Deadline' : 'Returned'}
                            </span>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
            <div style={{ padding: '14px 24px', borderTop: '1px solid #e2e8f0', backgroundColor: '#f8fafc', fontSize: '12px', color: '#64748b' }}>
              Showing {visible.length} record{visible.length !== 1 ? 's' : ''}
            </div>
          </div>

          {/* Bottom grid: preferences + activity */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>

            <div style={s.card}>
              <h3 style={s.cardTitle}>Account Preferences</h3>
              <p style={s.cardSub}>Manage your library interaction settings.</p>
              {[
                { key: 'email', label: 'Email Notifications', desc: 'Due date alerts and announcements', val: emailNotif, set: setEmailNotif },
                { key: 'auto',  label: 'Auto-Renewal', desc: 'Automatically renew eligible items', val: autoRenew,  set: setAutoRenew },
              ].map(pref => (
                <div key={pref.key} style={s.prefRow}>
                  <div>
                    <p style={s.prefTitle}>{pref.label}</p>
                    <p style={s.prefDesc}>{pref.desc}</p>
                  </div>
                  <div style={{ ...s.toggle, backgroundColor: pref.val ? '#0f172a' : '#e2e8f0' }} onClick={() => pref.set(!pref.val)}>
                    <div style={{ ...s.toggleDot, transform: pref.val ? 'translateX(20px)' : 'translateX(2px)' }} />
                  </div>
                </div>
              ))}
              <button style={s.outlineBtn}>Configure Advanced Settings</button>
            </div>

            <div style={s.card}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '20px' }}>
                <div>
                  <h3 style={s.cardTitle}>Recent Activity</h3>
                  <p style={s.cardSub}>Latest updates from your membership.</p>
                </div>
                <div style={{ width: '36px', height: '36px', borderRadius: '10px', backgroundColor: '#f1f5f9', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '16px' }}>⚡</div>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
                {RECENT_ACTIVITY.map((item, i) => (
                  <div key={i} style={{ display: 'flex', gap: '14px', alignItems: 'flex-start' }}>
                    <div style={{ width: '18px', height: '18px', borderRadius: '50%', backgroundColor: i % 2 === 0 ? '#0f172a' : '#64748b', flexShrink: 0, marginTop: '2px' }} />
                    <div>
                      <p style={{ margin: '0 0 3px', fontSize: '14px', fontWeight: '700', color: '#0f172a' }}>{item.title}</p>
                      <p style={{ margin: '0 0 3px', fontSize: '13px', color: '#64748b', lineHeight: '1.5' }}>{item.desc}</p>
                      <p style={{ margin: 0, fontSize: '11px', color: '#94a3b8', fontWeight: '700', textTransform: 'uppercase' }}>{item.time}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

          </div>
        </>
      )}
    </div>
  );
}

const s = {
  card:       { backgroundColor: '#fff', border: '1px solid #e2e8f0', borderRadius: '16px', padding: '24px', boxShadow: '0 1px 4px rgba(0,0,0,0.05)' },
  cardTitle:  { fontSize: '16px', fontWeight: '700', color: '#0f172a', margin: '0 0 4px' },
  cardSub:    { fontSize: '13px', color: '#64748b', margin: '0 0 20px' },
  avatarLg:   { width: '100px', height: '100px', borderRadius: '16px', backgroundColor: '#0f172a', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '40px', fontWeight: '800', flexShrink: 0, objectFit: 'cover' },
  activeBadge:{ backgroundColor: '#f1f5f9', color: '#0f172a', fontSize: '11px', fontWeight: '700', padding: '4px 12px', borderRadius: '20px', letterSpacing: '1px', textTransform: 'uppercase' },
  editBtn:    { backgroundColor: '#f1f5f9', color: '#475569', border: 'none', padding: '8px 14px', borderRadius: '8px', fontSize: '13px', fontWeight: '600', cursor: 'pointer', transition: 'background 0.15s' },
  darkBtn:    { backgroundColor: '#0f172a', color: '#fff', border: 'none', padding: '10px 20px', borderRadius: '8px', fontSize: '13px', fontWeight: '600', cursor: 'pointer', transition: 'opacity 0.15s' },
  ghostBtn:   { backgroundColor: '#f1f5f9', color: '#475569', border: 'none', padding: '10px 20px', borderRadius: '8px', fontSize: '13px', fontWeight: '600', cursor: 'pointer' },
  outlineBtn: { width: '100%', padding: '12px', fontSize: '13px', fontWeight: '700', color: '#0f172a', backgroundColor: 'transparent', border: '2px solid #e2e8f0', borderRadius: '10px', cursor: 'pointer', marginTop: '4px', transition: 'border-color 0.15s' },
  fieldLabel: { display: 'block', fontSize: '11px', fontWeight: '700', textTransform: 'uppercase', color: '#64748b', marginBottom: '6px', letterSpacing: '0.5px' },
  fieldInput: { width: '100%', padding: '10px 14px', border: '1px solid #e2e8f0', borderRadius: '8px', fontSize: '14px', outline: 'none', boxSizing: 'border-box', transition: 'border-color 0.15s' },
  tabsBar:    { display: 'flex', borderBottom: '1px solid #e2e8f0', marginBottom: '20px', overflowX: 'auto' },
  tabBtn:     { padding: '12px 20px', fontSize: '14px', fontWeight: '600', color: '#64748b', backgroundColor: 'transparent', border: 'none', borderBottom: '2px solid transparent', cursor: 'pointer', whiteSpace: 'nowrap', transition: 'all 0.15s' },
  tabBtnActive:{ color: '#0f172a', borderBottom: '2px solid #0f172a' },
  table:      { width: '100%', borderCollapse: 'collapse', textAlign: 'left' },
  th:         { padding: '14px 20px', fontSize: '11px', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.8px', color: '#64748b' },
  td:         { padding: '18px 20px', fontSize: '14px', verticalAlign: 'middle' },
  prefRow:    { display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '14px', backgroundColor: '#f8fafc', borderRadius: '12px', border: '1px solid #e2e8f0', marginBottom: '10px' },
  prefTitle:  { fontSize: '14px', fontWeight: '700', color: '#0f172a', margin: '0 0 2px' },
  prefDesc:   { fontSize: '12px', color: '#94a3b8', margin: 0 },
  toggle:     { width: '44px', height: '24px', borderRadius: '12px', position: 'relative', cursor: 'pointer', transition: 'background 0.2s', flexShrink: 0 },
  toggleDot:  { position: 'absolute', top: '3px', width: '18px', height: '18px', borderRadius: '50%', backgroundColor: '#fff', boxShadow: '0 1px 3px rgba(0,0,0,0.2)', transition: 'transform 0.2s' },
};
