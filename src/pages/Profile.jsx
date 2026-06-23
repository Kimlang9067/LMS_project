import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router';
import { logout } from '../utils/auth';
import {
  getCirculationRecords,
  processExpiredLoans,
  getActiveLoans,
  getBorrowingHistory,
} from '../utils/circulation';
import {
  notifyProfileUpdated,
  checkReturnReminders,
} from '../utils/notifications';

function LibraryBookLogo({ size = 110 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 220 220" xmlns="http://www.w3.org/2000/svg" fill="none">
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
        <path d="M22 24L78 36L143 18" stroke="#ffffff" strokeWidth="4" strokeLinecap="round" opacity="0.9" />
        <path d="M18 18L76 32L137 16" stroke="#0F2D5C" strokeWidth="6" strokeLinecap="round" opacity="0.55" />
      </g>
    </svg>
  );
}

const activity = [
  { title: "Book Returned", desc: '"Semantics: Volume 1" was successfully returned to the Main Campus Library.', time: "2 Days Ago" },
  { title: "New Hold Placed", desc: 'Request for "Deep Learning" by Goodfellow is confirmed. Queue position: #2.', time: "4 Days Ago" },
  { title: "Membership Validated", desc: "Annual faculty credentials verified. Access valid until October 2025.", time: "Oct 20, 2024" },
];

const tabs = ["Currently Borrowed", "Borrowing History"];

export default function Profile() {
  const navigate = useNavigate();
  const location = useLocation();
  const [activeTab, setActiveTab] = useState(0);
  const [emailNotif, setEmailNotif] = useState(true);
  const [autoRenew, setAutoRenew] = useState(false);
  
  const [isEditing, setIsEditing] = useState(false);
  const fileInputRef = React.useRef(null);
  
  // 🌟 Dynamic shared state from localStorage
  const [circulationRecords, setCirculationRecords] = useState([]);

  const [user, setUser] = useState({
    fullName: "",
    email: "",
    username: "",
    phone: "",
    userId: "",
    status: "Active Member"
  });

  const [editName, setEditName] = useState("");
  const [editEmail, setEditEmail] = useState("");
  const [editPhone, setEditPhone] = useState("");
  const [selectedImage, setSelectedImage] = useState(null);

  useEffect(() => {
    const stored = localStorage.getItem('userAccount');
    if (stored) {
      const parsedUser = JSON.parse(stored);
      setUser(parsedUser);
      setEditName(parsedUser.fullName || "");
      setEditEmail(parsedUser.email || "");
      setEditPhone(parsedUser.phone || "");
      if (parsedUser.profilePicture) {
        setSelectedImage(parsedUser.profilePicture);
      }

      const processed = processExpiredLoans(getCirculationRecords());
      const userName = parsedUser.fullName || parsedUser.username;
      checkReturnReminders(processed, userName);
      setCirculationRecords(processed);
    } else {
      setCirculationRecords(processExpiredLoans(getCirculationRecords()));
    }

    if (location.state?.editing) {
      setIsEditing(true);
    }
  }, [location.state]);

  const userName = user.fullName || user.username;
  const userRecords = circulationRecords.filter((r) => r.user === userName);

  const activeLoans = getActiveLoans(userRecords);
  const pastHistory = getBorrowingHistory(userRecords);

  // Determine which list to show based on the active tab index
  const visibleRecords = activeTab === 0 ? activeLoans : pastHistory;

  const handleSaveProfile = (e) => {
    e.preventDefault();
    const updatedUser = {
      ...user,
      fullName: editName,
      email: editEmail,
      phone: editPhone,
      ...(selectedImage ? { profilePicture: selectedImage } : {}),
    };
    setUser(updatedUser);
    localStorage.setItem('userAccount', JSON.stringify(updatedUser));
    setIsEditing(false);
    notifyProfileUpdated();
    alert("Profile settings updated successfully!");
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    if (file.size > 2 * 1024 * 1024) {
      alert("Image must be 2MB or smaller.");
      return;
    }
    const reader = new FileReader();
    reader.onload = () => setSelectedImage(reader.result);
    reader.readAsDataURL(file);
  };

  const navItems = [
    { label: "Profile", icon: "👤", active: !isEditing, action: () => { setIsEditing(false); navigate('/profile'); } },
    { label: "Edit Profile", icon: "⚙", active: isEditing, action: () => setIsEditing(true) },
    { label: "Messages", icon: "✉", action: () => { setIsEditing(false); navigate('/messages'); } },
  ];

  const sidebarHover = (e) => e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.08)';
  const sidebarLeave = (e) => e.currentTarget.style.backgroundColor = 'transparent';

  return (
    <div style={s.app}>
      {/* SIDEBAR */}
      <aside style={s.sidebar}>
        <div>
          <div style={s.brandRow}>
            <div style={s.logoWrap}>
              <LibraryBookLogo size={95} />
            </div>
            <div style={s.brandTextWrap}>
              <h1 style={s.brandTitle}>Data_Science</h1>
              <h2 style={s.brandSubtitle}>Library</h2>
              <p style={s.brandTagline}>Institutional Resource Portal</p>
            </div>
          </div>
          <nav style={s.nav}>
            {navItems.map((item) => (
              <div
                key={item.label}
                style={{ ...s.navItem, ...(item.active ? s.navItemActive : {}) }}
                onClick={item.action}
                onMouseEnter={!item.active ? sidebarHover : undefined}
                onMouseLeave={!item.active ? sidebarLeave : undefined}
              >
                <span style={s.navIcon}>{item.icon}</span>{item.label}
              </div>
            ))}
          </nav>
        </div>
        <div style={s.sidebarFooter}>
          <button
            style={s.logoutBtn}
            onClick={() => { logout(); navigate('/signin'); }}
            onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'rgba(186,26,26,0.2)'}
            onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'rgba(186,26,26,0.1)'}
          >
            ⇥ Log Out
          </button>
        </div>
      </aside>

      {/* MAIN CONTAINER */}
      <main style={s.main}>
        {/* TOPBAR */}
        <header style={s.topbar}>
          {!isEditing && (
            <button 
              onClick={() => navigate('/userdashboard')} 
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                background: '#fff',
                border: '1px solid #e0e0e0',
                borderRadius: '8px',
                padding: '8px 16px',
                fontSize: '14px',
                fontWeight: '600',
                color: '#000',
                cursor: 'pointer',
                marginLeft: '16px',
                marginTop: '8px',
                boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1), 0 2px 4px -1px rgba(0,0,0,0.06)'
              }}
              onMouseEnter={(e) => e.currentTarget.style.setProperty('background-color', '#cccccc', 'important')}
              onMouseLeave={(e) => e.currentTarget.style.setProperty('background-color', '#ffffff', 'important')}
            >
              <span>←</span> Back
            </button>
          )}
        </header>

        <div style={s.content}>
          {isEditing ? (
            /* ================= EDITING FORM VIEW ================= */
            <div style={{ ...s.tableCard, padding: '32px', maxWidth: '800px', margin: '0 auto' }}>
              <div style={{ marginBottom: '24px', borderBottom: '1px solid #e5e5e5', paddingBottom: '16px' }}>
                <h2 style={{ fontSize: '22px', fontWeight: '800', margin: 0, color: '#000' }}>Edit Profile</h2>
                <p style={{ fontSize: '14px', color: '#666', marginTop: '4px' }}>Modify your membership identity parameters.</p>
              </div>
              
              <form onSubmit={handleSaveProfile} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '20px', paddingBottom: '20px', borderBottom: '1px solid #f0f0f0' }}>
                  {selectedImage ? (
                    <img src={selectedImage} alt="Avatar" style={{ ...s.avatarLarge, objectFit: 'cover' }} />
                  ) : (
                    <div style={s.avatarLarge}>{editName.charAt(0) || 'G'}</div>
                  )}
                  
                  <input 
                    type="file" 
                    ref={fileInputRef} 
                    style={{ display: 'none' }} 
                    accept="image/*" 
                    onChange={handleImageChange}
                  />

                  <div>
                    <button 
                      type="button" 
                      onClick={() => fileInputRef.current.click()} 
                      style={{ ...s.renewNowBtn, padding: '10px 16px' }}
                    >
                      Change Photo
                    </button>
                    <p style={{ fontSize: '11px', color: '#888', marginTop: '6px' }}>PNG or JPG up to 2MB.</p>
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '11px', fontWeight: '700', textTransform: 'uppercase', color: '#666', marginBottom: '6px' }}>Full Name</label>
                    <input type="text" value={editName} onChange={(e) => setEditName(e.target.value)} style={{ ...s.searchInput, maxWidth: '100%', width: '100%', boxSizing: 'border-box', backgroundColor: '#fff' }} required />
                  </div>
                  <div>
                    <label style={{ display: 'block', fontSize: '11px', fontWeight: '700', textTransform: 'uppercase', color: '#666', marginBottom: '6px' }}>Email Address</label>
                    <input type="email" value={editEmail} onChange={(e) => setEditEmail(e.target.value)} style={{ ...s.searchInput, maxWidth: '100%', width: '100%', boxSizing: 'border-box', backgroundColor: '#fff' }} required />
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '11px', fontWeight: '700', textTransform: 'uppercase', color: '#666', marginBottom: '6px' }}>Phone Number</label>
                    <input type="text" value={editPhone} onChange={(e) => setEditPhone(e.target.value)} style={{ ...s.searchInput, maxWidth: '100%', width: '100%', boxSizing: 'border-box', backgroundColor: '#fff' }} />
                  </div>
                  <div>
                    <label style={{ display: 'block', fontSize: '11px', fontWeight: '700', textTransform: 'uppercase', color: '#aaa', marginBottom: '6px' }}>Library ID (Locked)</label>
                    <input type="text" value={user.userId} disabled style={{ ...s.searchInput, maxWidth: '100%', width: '100%', boxSizing: 'border-box', color: '#aaa', backgroundColor: '#f5f5f5', cursor: 'not-allowed' }} />
                  </div>
                </div>

                <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', marginTop: '12px', borderTop: '1px solid #e5e5e5', paddingTop: '20px' }}>
                  <button type="button" onClick={() => setIsEditing(false)} style={s.renewBtn}>Cancel</button>
                  <button type="submit" style={s.renewNowBtn}>Save Changes</button>
                </div>
              </form>
            </div>
          ) : (
            /* ================= READ-ONLY DASHBOARD VIEW ================= */
            <>
              {/* PROFILE HERO */}
              <div style={s.heroGrid}>
                <div style={s.profileCard}>
                  <div style={s.avatarWrap}>
                    {selectedImage ? (
                      <img src={selectedImage} alt="Avatar" style={{ ...s.avatarLarge, objectFit: 'cover' }} />
                    ) : (
                      <div style={s.avatarLarge}>{user.fullName?.charAt(0) || 'G'}</div>
                    )}
                  </div>
                  <div style={s.profileInfo}>
                    <div style={s.profileNameRow}>
                      <h2 style={s.profileName}>{user.fullName}</h2>
                      <span style={s.profileBadge}>{user.status}</span>
                    </div>
                    <p style={s.profileDept}>Data Science Library Member</p>
                    <div style={s.profileMeta}>
                      <div style={s.metaItem}>
                        <div style={s.metaIcon}>✉</div>
                        <div>
                          <p style={s.metaLabel}>Email</p>
                          <p style={s.metaValue}>{user.email}</p>
                        </div>
                      </div>
                      <div style={s.metaItem}>
                        <div style={s.metaIcon}>🪪</div>
                        <div>
                          <p style={s.metaLabel}>Library ID</p>
                          <p style={s.metaValue}>{user.userId}</p>
                        </div>
                      </div>
                      <div style={s.metaItem}>
                        <div style={s.metaIcon}>📅</div>
                        <div>
                          <p style={s.metaLabel}>Joined</p>
                          <p style={s.metaValue}>June 2026</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* TABS BAR */}
              <div style={s.tabsBar}>
                {tabs.map((tab, i) => (
                  <button key={tab} style={{ ...s.tabBtn, ...(activeTab === i ? s.tabBtnActive : {}) }} onClick={() => setActiveTab(i)}>
                    {tab} ({i === 0 ? activeLoans.length : pastHistory.length})
                  </button>
                ))}
              </div>

              {/* DYNAMIC TABLE CARD */}
              <div style={s.tableCard}>
                {visibleRecords.length === 0 ? (
                  <div style={{ padding: '40px', textAlign: 'center', color: '#666' }}>
                    <p style={{ fontSize: '15px', fontWeight: '500' }}>
                      No items found under "{tabs[activeTab]}".
                    </p>
                  </div>
                ) : (
                  <div style={{ overflowX: 'auto' }}>
                    <table style={s.table}>
                      <thead>
                        <tr style={s.tableHead}>
                          <th style={s.th}>Book Details</th>
                          <th style={s.th}>Borrower</th>
                          <th style={s.th}>Issue Date</th>
                          <th style={s.th}>Due / Return Date</th>
                          <th style={s.th}>Status</th>
                        </tr>
                      </thead>
                      <tbody>
                        {visibleRecords.map((record, i) => {
                          const isExpired = record.returnDate && new Date() > new Date(record.returnDate);
                          return (
                            <tr key={record.id || i} style={{ backgroundColor: i % 2 === 0 ? '#fff' : '#f8f9ff' }}>
                              <td style={s.td}>
                                <div style={s.bookCell}>
                                  <div style={s.bookIcon}>📘</div>
                                  <div>
                                    <p style={s.bookTitle}>{record.book}</p>
                                  </div>
                                </div>
                              </td>
                              <td style={{ ...s.td, color: '#555', fontWeight: '600' }}>{record.user}</td>
                              <td style={{ ...s.td, color: '#666' }}>{record.issueDate || 'N/A'}</td>
                              <td style={{ ...s.td, fontWeight: '700', color: record.status === 'Borrowed' ? (isExpired ? '#ba1a1a' : '#000') : '#16a34a' }}>
                                {record.returnDate || 'N/A'}
                              </td>
                              <td style={s.td}>
                                <span style={{ ...s.statusPill, ...(record.status === 'Borrowed' ? (isExpired ? s.statusDue : { backgroundColor: 'rgba(59,130,246,0.1)', color: '#2563eb' }) : record.status === 'Overdue' ? s.statusDue : s.statusActive) }}>
                                  {record.status === 'Borrowed' ? (isExpired ? 'Overdue Deadline' : 'Active Loan') : record.status === 'Overdue' ? 'Past Deadline' : 'Returned'}
                                </span>
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                )}
                <div style={s.tableFooter}>
                  <p style={{ fontSize: '12px', color: '#666' }}>
                    Showing {visibleRecords.length} records
                  </p>
                </div>
              </div>

              {/* SETTINGS AND ACTIVITY */}
              <div style={s.bottomGrid}>
                <div style={s.bottomCard}>
                  <div style={s.bottomCardHeader}>
                    <div>
                      <h3 style={s.bottomCardTitle}>Account Preferences</h3>
                      <p style={s.bottomCardSubtitle}>Manage your library interaction settings.</p>
                    </div>
                  </div>
                  <div style={s.prefItem}>
                    <div>
                      <p style={s.prefTitle}>Email Notifications</p>
                      <p style={s.prefDesc}>Due date alerts and library announcements</p>
                    </div>
                    <div style={{ ...s.toggle, backgroundColor: emailNotif ? '#000' : '#e0e3e5' }} onClick={() => setEmailNotif(!emailNotif)}>
                      <div style={{ ...s.toggleDot, transform: emailNotif ? 'translateX(20px)' : 'translateX(2px)' }} />
                    </div>
                  </div>
                  <div style={s.prefItem}>
                    <div>
                      <p style={s.prefTitle}>Auto-Renewal</p>
                      <p style={s.prefDesc}>Automatically renew eligible items</p>
                    </div>
                    <div style={{ ...s.toggle, backgroundColor: autoRenew ? '#000' : '#e0e3e5' }} onClick={() => setAutoRenew(!autoRenew)}>
                      <div style={{ ...s.toggleDot, transform: autoRenew ? 'translateX(20px)' : 'translateX(2px)' }} />
                    </div>
                  </div>
                  <button style={s.configBtn} onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = '#000'; e.currentTarget.style.color = '#fff'; }} onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = 'transparent'; e.currentTarget.style.color = '#000'; }}>
                    Configure Advanced Settings
                  </button>
                </div>

                <div style={s.bottomCard}>
                  <div style={s.bottomCardHeader}>
                    <div>
                      <h3 style={s.bottomCardTitle}>Recent Library Activity</h3>
                      <p style={s.bottomCardSubtitle}>Latest updates from your membership.</p>
                    </div>
                    <div style={s.bottomCardIcon}>⚡</div>
                  </div>
                  <div style={s.activityList}>
                    {activity.map((item, i) => (
                      <div key={i} style={s.activityItem}>
                        <div style={{ ...s.activityDot, backgroundColor: i % 2 === 0 ? '#000' : '#666' }} />
                        <div>
                          <p style={s.activityTitle}>{item.title}</p>
                          <p style={s.activityDesc}>{item.desc}</p>
                          <p style={s.activityTime}>{item.time}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </>
          )}
        </div>

        {/* FOOTER */}
        <footer style={s.footer}>
          <div>
            <div style={{ fontWeight: '800', fontSize: '16px' }}>Data_Science Library</div>
            <p style={{ fontSize: '12px', color: '#8192a7', marginTop: '4px' }}>
              ©Library Management System. System Status: <span style={{ color: '#4ade80', fontWeight: '700' }}>Operational</span>
            </p>
          </div>
        </footer>
      </main>
    </div>
  );
}

// Preserving precise styles...
const flex = (dir = 'row', align = 'center', gap = 0) => ({ display: 'flex', flexDirection: dir, alignItems: align, gap });
const card = { backgroundColor: '#fff', borderRadius: '24px', border: '1px solid #e5e5e5', padding: '24px', boxShadow: '0 1px 4px rgba(0,0,0,0.05)' };

const s = {
  app: { ...flex('row', 'stretch'), minHeight: '100vh', fontFamily: 'system-ui, sans-serif', backgroundColor: '#f8f9ff' },
  backButton: { display: 'flex', alignItems: 'center', gap: '8px', background: 'transparent', border: 'none', fontSize: '14px', fontWeight: '700', color: '#000', cursor: 'pointer', padding: '8px 0' },
  sidebar: { ...flex('column', 'stretch'), justifyContent: 'space-between', width: '220px', backgroundColor: '#000', color: '#fff', padding: '24px 16px', position: 'sticky', top: 0, height: '100vh' },
  sidebarBrand: { ...flex('row', 'center', 10), marginBottom: '30px', padding: '0 8px' },
  sidebarBrandTitle: { fontSize: '15px', fontWeight: '700' },
  sidebarBrandSubtitle: { fontSize: '12px', color: '#ff3b30' },
  nav: { ...flex('column', 'stretch', 4) },
  navItem: { ...flex('row', 'center', 10), padding: '10px 12px', borderRadius: '8px', fontSize: '14px', color: '#ccc', cursor: 'pointer', transition: 'background-color .2s' },
  navItemActive: { backgroundColor: '#1a1a1a', color: '#fff', fontWeight: '600' },
  navIcon: { fontSize: '16px', width: '20px', textAlign: 'center' },
  sidebarFooter: { ...flex('column', 'stretch', 4) },
  logoutBtn: { display: 'flex', alignItems: 'center', gap: '10px', padding: '10px 12px', borderRadius: '8px', fontSize: '14px', fontWeight: '700', color: '#ff6b6b', backgroundColor: 'rgba(186,26,26,0.1)', border: 'none', cursor: 'pointer', marginTop: '8px', transition: 'background-color .2s' },
  main: { flex: 1, ...flex('column', 'stretch') },
  topbar: { ...flex('row', 'center'), justifyContent: 'space-between', padding: '16px 32px', backgroundColor: 'rgba(255,255,255,0.7)', backdropFilter: 'blur(16px)', borderBottom: '1px solid #e5e5e5', position: 'sticky', top: 0, zIndex: 40 },
  searchInput: { flex: 1, maxWidth: '400px', padding: '10px 16px', borderRadius: '20px', border: '1px solid #ddd', outline: 'none', fontSize: '13px', backgroundColor: '#eff4ff' },
  topbarRight: { ...flex('row', 'center', 16) },
  notifBtn: { fontSize: '20px', cursor: 'pointer' },
  avatarCircle: { width: '36px', height: '36px', borderRadius: '50%', backgroundColor: '#000', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: '700', fontSize: '14px' },
  content: { padding: '40px', maxWidth: '1440px', margin: '0 auto', width: '100%', boxSizing: 'border-box' },
  heroGrid: { display: 'grid', gridTemplateColumns: '1fr auto', gap: '24px', marginBottom: '40px', flexWrap: 'wrap' },
  profileCard: { ...card, ...flex('row', 'flex-start', 24), position: 'relative', overflow: 'hidden' },
  avatarWrap: { position: 'relative', flexShrink: 0 },
  avatarLarge: { width: '120px', height: '120px', borderRadius: '20px', backgroundColor: '#000', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '48px', fontWeight: '800' },
  profileInfo: { flex: 1 },
  profileNameRow: { ...flex('row', 'center', 12), marginBottom: '6px', flexWrap: 'wrap' },
  profileName: { fontSize: '22px', fontWeight: '800', color: '#000', margin: 0 },
  profileBadge: { backgroundColor: '#f0f0f0', color: '#000', fontSize: '11px', fontWeight: '700', padding: '4px 12px', borderRadius: '20px', letterSpacing: '1px', textTransform: 'uppercase' },
  profileDept: { fontSize: '14px', color: '#666', marginBottom: '20px' },
  profileMeta: { display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px' },
  metaItem: { ...flex('row', 'center', 12) },
  metaIcon: { width: '36px', height: '36px', borderRadius: '10px', backgroundColor: '#f0f0f0', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '16px', flexShrink: 0 },
  metaLabel: { fontSize: '10px', fontWeight: '700', color: '#888', textTransform: 'uppercase', margin: '0 0 2px 0' },
  metaValue: { fontSize: '13px', fontWeight: '600', color: '#000', margin: 0 },
  tabsBar: { ...flex('row', 'center', 0), borderBottom: '1px solid #e5e5e5', marginBottom: '20px', overflowX: 'auto' },
  tabBtn: { padding: '12px 20px', fontSize: '14px', fontWeight: '600', color: '#666', backgroundColor: 'transparent', border: 'none', borderBottom: '2px solid transparent', cursor: 'pointer', whiteSpace: 'nowrap', transition: 'all .2s' },
  tabBtnActive: { color: '#000', borderBottom: '2px solid #000' },
  tableCard: { ...card, padding: 0, overflow: 'hidden', marginBottom: '40px' },
  table: { width: '100%', borderCollapse: 'collapse', textAlign: 'left' },
  tableHead: { backgroundColor: '#eff4ff', borderBottom: '1px solid #e5e5e5' },
  th: { padding: '16px 24px', fontSize: '11px', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '1px', color: '#666' },
  td: { padding: '20px 24px', fontSize: '14px', verticalAlign: 'middle' },
  bookCell: { ...flex('row', 'center', 16) },
  bookIcon: { width: '40px', height: '52px', backgroundColor: '#f0f0f0', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '20px', flexShrink: 0 },
  bookTitle: { fontSize: '14px', fontWeight: '700', color: '#000', margin: '0 0 4px 0' },
  statusPill: { display: 'inline-block', padding: '4px 12px', borderRadius: '20px', fontSize: '11px', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '1px' },
  statusActive: { backgroundColor: 'rgba(74,222,128,0.1)', color: '#16a34a' },
  statusDue: { backgroundColor: 'rgba(186,26,26,0.1)', color: '#ba1a1a' },
  renewBtn: { padding: '8px 16px', fontSize: '13px', fontWeight: '700', color: '#000', backgroundColor: 'transparent', border: 'none', borderRadius: '8px', cursor: 'pointer', transition: 'background-color .2s' },
  renewNowBtn: { padding: '8px 20px', fontSize: '13px', fontWeight: '700', color: '#fff', backgroundColor: '#000', border: 'none', borderRadius: '12px', cursor: 'pointer', transition: 'background-color .2s' },
  tableFooter: { ...flex('row', 'center'), justifyContent: 'space-between', padding: '16px 24px', backgroundColor: '#f8f9ff', borderTop: '1px solid #e5e5e5' },
  bottomGrid: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px', marginTop: '40px' },
  bottomCard: { ...card },
  bottomCardHeader: { ...flex('row', 'flex-start'), justifyContent: 'space-between', marginBottom: '24px' },
  bottomCardTitle: { fontSize: '18px', fontWeight: '700', color: '#000', margin: '0 0 4px 0' },
  bottomCardSubtitle: { fontSize: '13px', color: '#666', margin: 0 },
  bottomCardIcon: { width: '40px', height: '40px', backgroundColor: '#f0f0f0', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '18px' },
  prefItem: { ...flex('row', 'center'), justifyContent: 'space-between', padding: '16px', backgroundColor: '#f8f9ff', borderRadius: '16px', border: '1px solid #e5e5e5', marginBottom: '12px' },
  prefTitle: { fontSize: '14px', fontWeight: '700', color: '#000', margin: '0 0 2px 0' },
  prefDesc: { fontSize: '12px', color: '#888', margin: 0 },
  toggle: { width: '44px', height: '24px', borderRadius: '12px', position: 'relative', cursor: 'pointer', transition: 'background-color .2s', flexShrink: 0 },
  toggleDot: { position: 'absolute', top: '3px', width: '18px', height: '18px', borderRadius: '50%', backgroundColor: '#fff', boxShadow: '0 1px 3px rgba(0,0,0,0.2)', transition: 'transform .2s' },
  configBtn: { width: '100%', padding: '14px', fontSize: '13px', fontWeight: '700', color: '#000', backgroundColor: 'transparent', border: '2px solid #000', borderRadius: '12px', cursor: 'pointer', marginTop: '4px', transition: 'all .2s' },
  activityList: { ...flex('column', 'stretch', 20) },
  activityItem: { ...flex('row', 'flex-start', 16) },
  activityDot: { width: '20px', height: '20px', borderRadius: '50%', flexShrink: 0, marginTop: '2px' },
  activityTitle: { fontSize: '14px', fontWeight: '700', color: '#000', margin: '0 0 4px 0' },
  activityDesc: { fontSize: '13px', color: '#666', lineHeight: '1.5', margin: '0 0 4px 0' },
  activityTime: { fontSize: '11px', color: '#aaa', fontWeight: '700', textTransform: 'uppercase', margin: 0 },
  footer: { ...flex('row', 'center'), justifyContent: 'space-between', flexWrap: 'wrap', gap: '20px', backgroundColor: '#000', color: '#fff', padding: '30px 40px', marginTop: 'auto' },
  footerLink: { color: '#8192a7', cursor: 'pointer', fontSize: '13px' },
  logoWrap: { display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 },
  brandRow: { display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '60px' },
  brandTextWrap: { display: 'flex', flexDirection: 'column', justifyContent: 'center' },
  brandTitle: { fontSize: '18px', fontWeight: '700', margin: '0', color: '#ffffff', lineHeight: '1.2' },
  brandSubtitle: { fontSize: '15px', color: '#ff3b30', margin: '4px 0 8px 0', lineHeight: '1.2' },
  brandTagline: { fontSize: '13px', color: '#d7e3f1', margin: 0 },
};