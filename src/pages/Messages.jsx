import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router';
import {
  getMessagesWithFormattedTime,
  markMessageRead,
  markAllMessagesRead,
} from '../utils/notifications';

function LibraryBookLogo({ size = 110 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 220 220" xmlns="http://www.w3.org/2000/svg" fill="none">
      <g transform="translate(18,130) rotate(8 90 22)">
        <rect x="18" y="8" rx="18" ry="18" width="150" height="40" fill="#173F7A" />
        <rect x="10" y="0" rx="18" ry="18" width="150" height="40" fill="#F6A313" />
        <path d="M20 12H145" stroke="#ffffff" strokeWidth="4" strokeLinecap="round" opacity="0.9" />
        <path d="M20 20H140" stroke="#ffffff" strokeWidth="3" strokeLinecap="round" opacity="0.85" />
        <path d="M20 28H132" stroke="#ffffff" strokeWidth="3" strokeLinecap="round" opacity="0.8" />
      </g>
      <g transform="translate(35,92) rotate(-8 75 20)">
        <rect x="18" y="8" rx="16" ry="16" width="128" height="36" fill="#173F7A" />
        <rect x="10" y="0" rx="16" ry="16" width="128" height="36" fill="#1C9AD6" />
        <path d="M20 10H122" stroke="#ffffff" strokeWidth="4" strokeLinecap="round" opacity="0.95" />
        <path d="M20 18H118" stroke="#ffffff" strokeWidth="3" strokeLinecap="round" opacity="0.85" />
        <path d="M20 26H112" stroke="#ffffff" strokeWidth="3" strokeLinecap="round" opacity="0.8" />
      </g>
      <g transform="translate(48,64) rotate(8 64 14)">
        <rect x="14" y="6" rx="12" ry="12" width="112" height="24" fill="#F6A313" />
        <rect x="8" y="0" rx="12" ry="12" width="112" height="24" fill="#FFD45E" opacity="0.25" />
      </g>
      <g transform="translate(52,24) rotate(-12 70 28)">
        <path d="M12 20L85 0L150 18L76 38L12 20Z" fill="#173F7A" />
        <path d="M22 24L78 36L143 18" stroke="#ffffff" strokeWidth="4" strokeLinecap="round" opacity="0.9" />
        <path d="M18 18L76 32L137 16" stroke="#0F2D5C" strokeWidth="6" strokeLinecap="round" opacity="0.55" />
      </g>
    </svg>
  );
}

const tagColors = {
    Reminder: { bg: 'rgba(249,115,22,0.1)', color: '#c2410c' },
    Account:  { bg: 'rgba(74,222,128,0.1)',  color: '#15803d' },
    Library:  { bg: 'rgba(99,102,241,0.1)',  color: '#4338ca' },
    Alert:    { bg: 'rgba(186,26,26,0.1)',   color: '#ba1a1a' },
  };

export default function Messages() {
  const navigate = useNavigate();
  const [messages, setMessages] = useState(() => getMessagesWithFormattedTime());
  const [filter, setFilter] = useState('All');

  const unreadCount = messages.filter((m) => !m.read).length;

  useEffect(() => {
    localStorage.setItem('unreadCount', unreadCount);
  }, [unreadCount]);

  const filtered = filter === 'Unread' ? messages.filter((m) => !m.read) : messages;

  const markRead = (id) => {
    const updated = markMessageRead(id);
    setMessages(getMessagesWithFormattedTime());
    localStorage.setItem('unreadCount', updated.filter((m) => !m.read).length);
  };

  const markAllRead = () => {
    markAllMessagesRead();
    setMessages(getMessagesWithFormattedTime());
    localStorage.setItem('unreadCount', 0);
  };

  const navItems = [
    { label: 'Profile', icon: '👤', action: () => navigate('/profile') },
    { label: 'Edit Profile', icon: '⚙', action: () => navigate('/profile', { state: { editing: true } }) },
    { label: 'Messages', icon: '✉', active: true, action: () => {} },
  ];

  return (
    <div style={s.app}>

      {/* SIDEBAR */}
      <aside style={s.sidebar}>
        <div>
          <div style={s.brandRow}>
            <div style={s.logoWrap}><LibraryBookLogo size={95} /></div>
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
                onMouseEnter={!item.active ? (e) => e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.08)' : undefined}
                onMouseLeave={!item.active ? (e) => e.currentTarget.style.backgroundColor = 'transparent' : undefined}
              >
                <span style={s.navIcon}>{item.icon}</span>{item.label}
                {item.label === 'Messages' && unreadCount > 0 && (
                  <span style={s.navBadge}>{unreadCount}</span>
                )}
              </div>
            ))}
          </nav>
        </div>
        <div style={s.sidebarFooter}>
          <button
            style={s.logoutBtn}
            onClick={() => navigate('/signin')}
            onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'rgba(186,26,26,0.2)'}
            onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'rgba(186,26,26,0.1)'}
          >
            ⇥ Log Out
          </button>
        </div>
      </aside>

      {/* MAIN */}
      <main style={s.main}>
        <div style={s.content}>

          {/* PAGE HEADER */}
          <div style={s.pageHeader}>
            <div>
              <h1 style={s.pageTitle}>Messages</h1>
              <p style={s.pageSubtitle}>Notifications and communication from the library.</p>
            </div>
            {unreadCount > 0 && (
              <button
                style={s.markAllBtn}
                onClick={markAllRead}
                onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#f0f0f0'}
                onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
              >
                Mark all as read
              </button>
            )}
          </div>

          {/* FILTER TABS */}
          <div style={s.tabsBar}>
            {['All', 'Unread'].map((tab) => (
              <button
                key={tab}
                style={{ ...s.tabBtn, ...(filter === tab ? s.tabBtnActive : {}) }}
                onClick={() => setFilter(tab)}
              >
                {tab}
                {tab === 'Unread' && unreadCount > 0 && (
                  <span style={s.tabBadge}>{unreadCount}</span>
                )}
              </button>
            ))}
          </div>

          {/* MESSAGE LIST */}
          <div style={s.messageCard}>
            {filtered.length === 0 ? (
              <div style={s.emptyState}>
                <p style={{ fontSize: '32px', marginBottom: '12px' }}>📭</p>
                <p style={{ fontSize: '15px', fontWeight: '700', color: '#000', margin: '0 0 6px 0' }}>No unread messages</p>
                <p style={{ fontSize: '13px', color: '#888', margin: 0 }}>You're all caught up.</p>
              </div>
            ) : (
              filtered.map((msg, i) => (
                <div
                  key={msg.id}
                  style={{
                    ...s.messageRow,
                    backgroundColor: !msg.read ? '#f8f9ff' : '#fff',
                    borderBottom: i < filtered.length - 1 ? '1px solid #e5e5e5' : 'none',
                  }}
                >
                  {/* Icon */}
                  <div style={s.msgIcon}>{msg.icon}</div>

                  {/* Body */}
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={s.msgTopRow}>
                      <p style={{ ...s.msgTitle, fontWeight: !msg.read ? '800' : '600' }}>{msg.title}</p>
                      <div style={s.msgMeta}>
                        <span style={s.msgTime}>{msg.time}</span>
                        <span style={{ ...s.tagPill, backgroundColor: tagColors[msg.tag]?.bg, color: tagColors[msg.tag]?.color }}>
                          {msg.tag}
                        </span>
                      </div>
                    </div>
                    <p style={s.msgBody}>{msg.body}</p>
                    {!msg.read && (
                      <button
                        style={s.markReadBtn}
                        onClick={() => markRead(msg.id)}
                        onMouseEnter={(e) => e.currentTarget.style.color = '#000'}
                        onMouseLeave={(e) => e.currentTarget.style.color = '#aaa'}
                      >
                        Mark as read
                      </button>
                    )}
                  </div>

                  {/* Unread dot */}
                  {!msg.read && <div style={s.unreadDot} />}
                </div>
              ))
            )}
          </div>

        </div>

        {/* FOOTER */}
        <footer style={s.footer}>
          <div>
            <div style={{ fontWeight: '800', fontSize: '16px' }}>Data_Science Library</div>
            <p style={{ fontSize: '12px', color: '#8192a7', marginTop: '4px' }}>
              © 2026 Library Management System. System Status: <span style={{ color: '#4ade80', fontWeight: '700' }}>Operational</span>
            </p>
          </div>
          <div style={{ display: 'flex', gap: '24px', fontSize: '13px', flexWrap: 'wrap' }}>
            <span style={s.footerLink}>Privacy Policy</span>
            <span style={s.footerLink}>Terms of Service</span>
            <span style={s.footerLink}>Support Center</span>
          </div>
        </footer>

      </main>
    </div>
  );
}

const flex = (dir = 'row', align = 'center', gap = 0) => ({ display: 'flex', flexDirection: dir, alignItems: align, gap });
const card = { backgroundColor: '#fff', borderRadius: '24px', border: '1px solid #e5e5e5', boxShadow: '0 1px 4px rgba(0,0,0,0.05)' };

const s = {
  app: { ...flex('row', 'stretch'), minHeight: '100vh', fontFamily: 'system-ui, sans-serif', backgroundColor: '#f8f9ff' },

  // SIDEBAR
  sidebar: { ...flex('column', 'stretch'), justifyContent: 'space-between', width: '220px', backgroundColor: '#000', color: '#fff', padding: '24px 16px', position: 'sticky', top: 0, height: '100vh' },
  brandRow: { display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '60px' },
  logoWrap: { display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 },
  brandTextWrap: { display: 'flex', flexDirection: 'column', justifyContent: 'center' },
  brandTitle: { fontSize: '18px', fontWeight: '700', margin: '0', color: '#ffffff', lineHeight: '1.2' },
  brandSubtitle: { fontSize: '15px', color: '#ff3b30', margin: '4px 0 8px 0', lineHeight: '1.2' },
  brandTagline: { fontSize: '13px', color: '#d7e3f1', margin: 0 },
  nav: { ...flex('column', 'stretch', 4) },
  navItem: { ...flex('row', 'center', 10), padding: '10px 12px', borderRadius: '8px', fontSize: '14px', color: '#ccc', cursor: 'pointer', transition: 'background-color .2s' },
  navItemActive: { backgroundColor: '#1a1a1a', color: '#fff', fontWeight: '600' },
  navIcon: { fontSize: '16px', width: '20px', textAlign: 'center' },
  navBadge: { marginLeft: 'auto', backgroundColor: '#ba1a1a', color: '#fff', fontSize: '10px', fontWeight: '700', padding: '2px 7px', borderRadius: '20px' },
  sidebarFooter: { ...flex('column', 'stretch', 4) },
  logoutBtn: { display: 'flex', alignItems: 'center', gap: '10px', padding: '10px 12px', borderRadius: '8px', fontSize: '14px', fontWeight: '700', color: '#ff6b6b', backgroundColor: 'rgba(186,26,26,0.1)', border: 'none', cursor: 'pointer', transition: 'background-color .2s' },

  // MAIN
  main: { flex: 1, ...flex('column', 'stretch') },
  topbar: { ...flex('row', 'center'), justifyContent: 'space-between', padding: '16px 32px', backgroundColor: 'rgba(255,255,255,0.7)', backdropFilter: 'blur(16px)', borderBottom: '1px solid #e5e5e5', position: 'sticky', top: 0, zIndex: 40 },
  searchInput: { flex: 1, maxWidth: '400px', padding: '10px 16px', borderRadius: '20px', border: '1px solid #ddd', outline: 'none', fontSize: '13px', backgroundColor: '#eff4ff' },
  topbarRight: { ...flex('row', 'center', 16) },
  notifBtn: { fontSize: '20px', cursor: 'pointer' },
  avatarCircle: { width: '36px', height: '36px', borderRadius: '50%', backgroundColor: '#000', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: '700', fontSize: '14px' },

  content: { padding: '40px', maxWidth: '1440px', margin: '0 auto', width: '100%', boxSizing: 'border-box' },

  // PAGE HEADER
  pageHeader: { ...flex('row', 'flex-start'), justifyContent: 'space-between', marginBottom: '28px', flexWrap: 'wrap', gap: '12px' },
  pageTitle: { fontSize: '28px', fontWeight: '800', color: '#000', margin: '0 0 4px 0' },
  pageSubtitle: { fontSize: '14px', color: '#666', margin: 0 },
  markAllBtn: { padding: '10px 18px', fontSize: '13px', fontWeight: '700', color: '#000', backgroundColor: 'transparent', border: '1px solid #ddd', borderRadius: '12px', cursor: 'pointer', transition: 'background-color .2s' },

  // TABS
  tabsBar: { ...flex('row', 'center', 0), borderBottom: '1px solid #e5e5e5', marginBottom: '24px' },
  tabBtn: { ...flex('row', 'center', 8), padding: '12px 20px', fontSize: '14px', fontWeight: '600', color: '#666', backgroundColor: 'transparent', border: 'none', borderBottom: '2px solid transparent', cursor: 'pointer', transition: 'all .2s' },
  tabBtnActive: { color: '#000', borderBottom: '2px solid #000' },
  tabBadge: { backgroundColor: 'rgba(186,26,26,0.1)', color: '#ba1a1a', fontSize: '10px', fontWeight: '700', padding: '2px 7px', borderRadius: '20px' },

  // MESSAGES
  messageCard: { ...card, overflow: 'hidden' },
  messageRow: { ...flex('row', 'flex-start', 20), padding: '24px', transition: 'background-color .15s' },
  msgIcon: { width: '44px', height: '44px', borderRadius: '14px', backgroundColor: '#f0f0f0', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '20px', flexShrink: 0 },
  msgTopRow: { ...flex('row', 'center'), justifyContent: 'space-between', flexWrap: 'wrap', gap: '8px', marginBottom: '6px' },
  msgTitle: { fontSize: '14px', color: '#000', margin: 0 },
  msgMeta: { ...flex('row', 'center', 10), flexShrink: 0 },
  msgTime: { fontSize: '12px', color: '#aaa', fontWeight: '600' },
  tagPill: { fontSize: '11px', fontWeight: '700', padding: '3px 10px', borderRadius: '20px', textTransform: 'uppercase', letterSpacing: '0.5px' },
  msgBody: { fontSize: '13px', color: '#666', lineHeight: '1.6', margin: 0 },
  markReadBtn: { marginTop: '8px', fontSize: '12px', fontWeight: '700', color: '#aaa', backgroundColor: 'transparent', border: 'none', cursor: 'pointer', padding: 0, transition: 'color .2s' },
  unreadDot: { width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#000', flexShrink: 0, marginTop: '6px' },
  emptyState: { padding: '60px', textAlign: 'center' },

  // FOOTER
  footer: { ...flex('row', 'center'), justifyContent: 'space-between', flexWrap: 'wrap', gap: '20px', backgroundColor: '#000', color: '#fff', padding: '30px 40px', marginTop: 'auto' },
  footerLink: { color: '#8192a7', cursor: 'pointer', fontSize: '13px' },
};