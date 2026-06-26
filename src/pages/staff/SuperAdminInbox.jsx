import React, { useState, useEffect } from 'react';
import { useTheme } from '../../utils/theme';
import { getSession } from '../../utils/auth';
import {
  getSuperAdminMessagesFormatted,
  markStaffMessageRead,
  markAllStaffMessagesRead,
  deleteStaffMessage,
} from '../../utils/staffMessages';

const ROLE_BADGE = {
  administrator: { label: 'Administrator', bg: '#dbeafe', color: '#1d4ed8' },
  librarian:     { label: 'Librarian',     bg: '#d1fae5', color: '#065f46' },
};

function RolePill({ role }) {
  const c = ROLE_BADGE[role] || { label: role, bg: '#f1f5f9', color: '#475569' };
  return (
    <span style={{ backgroundColor: c.bg, color: c.color, fontSize: '11px', fontWeight: '700', padding: '2px 9px', borderRadius: '20px', whiteSpace: 'nowrap' }}>
      {c.label}
    </span>
  );
}

export default function SuperAdminInbox() {
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  const session = getSession();

  const [messages, setMessages] = useState(() => getSuperAdminMessagesFormatted());
  const [selected, setSelected] = useState(null);
  const [filter,   setFilter]   = useState('All');

  // Refresh when other tabs send a message
  useEffect(() => {
    const refresh = () => setMessages(getSuperAdminMessagesFormatted());
    window.addEventListener('staffMessagesUpdated', refresh);
    return () => window.removeEventListener('staffMessagesUpdated', refresh);
  }, []);

  const unread = messages.filter(m => !m.read).length;
  const visible = filter === 'Unread' ? messages.filter(m => !m.read) : messages;

  const open = (msg) => {
    if (!msg.read) {
      markStaffMessageRead(msg.id);
      setMessages(getSuperAdminMessagesFormatted());
    }
    setSelected(msg);
  };

  const remove = (id, e) => {
    e.stopPropagation();
    deleteStaffMessage(id);
    setMessages(getSuperAdminMessagesFormatted());
    if (selected?.id === id) setSelected(null);
  };

  const markAll = () => {
    markAllStaffMessagesRead();
    setMessages(getSuperAdminMessagesFormatted());
  };

  // colours
  const card   = isDark ? '#1e293b' : '#fff';
  const border = isDark ? '#334155' : '#e2e8f0';
  const bg     = isDark ? '#0f172a' : '#f8fafc';
  const textP  = isDark ? '#f1f5f9' : '#0f172a';
  const textS  = isDark ? '#94a3b8' : '#64748b';
  const hov    = isDark ? '#0f172a' : '#f1f5f9';

  return (
    <div style={{ maxWidth: '900px', fontFamily: 'system-ui, sans-serif' }}>

      {/* ── Page header ─────────────────────────────────────────────────────── */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '24px', flexWrap: 'wrap', gap: '12px' }}>
        <div>
          <h2 style={{ margin: '0 0 4px', fontSize: '22px', fontWeight: '800', color: textP }}>Inbox</h2>
          <p style={{ margin: 0, fontSize: '14px', color: textS }}>
            Messages from Administrators and Librarians.
            {unread > 0 && <span style={{ marginLeft: '8px', backgroundColor: '#ef4444', color: '#fff', fontSize: '11px', fontWeight: '700', padding: '2px 8px', borderRadius: '20px' }}>{unread} unread</span>}
          </p>
        </div>
        <div style={{ display: 'flex', gap: '10px' }}>
          {unread > 0 && (
            <button onClick={markAll} style={{ padding: '8px 16px', backgroundColor: 'transparent', border: `1px solid ${border}`, borderRadius: '8px', fontSize: '13px', fontWeight: '600', color: textS, cursor: 'pointer' }}>
              Mark all read
            </button>
          )}
          <div style={{ display: 'flex', border: `1px solid ${border}`, borderRadius: '8px', overflow: 'hidden' }}>
            {['All', 'Unread'].map(f => (
              <button key={f} onClick={() => setFilter(f)} style={{ padding: '8px 16px', border: 'none', backgroundColor: filter === f ? (isDark ? '#334155' : '#0f172a') : 'transparent', color: filter === f ? '#fff' : textS, fontSize: '13px', fontWeight: '600', cursor: 'pointer' }}>
                {f}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* ── Login welcome card ──────────────────────────────────────────────── */}
      <div style={{ backgroundColor: isDark ? '#162032' : '#eff6ff', border: `1px solid ${isDark ? '#1e3a5f' : '#bfdbfe'}`, borderRadius: '12px', padding: '16px 20px', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '14px' }}>
        <div style={{ width: '40px', height: '40px', borderRadius: '10px', backgroundColor: '#3b82f6', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '18px', flexShrink: 0 }}>✅</div>
        <div>
          <p style={{ margin: '0 0 2px', fontSize: '14px', fontWeight: '700', color: isDark ? '#93c5fd' : '#1d4ed8' }}>
            Welcome back, {session?.fullName || 'Super Admin'}!
          </p>
          <p style={{ margin: 0, fontSize: '13px', color: isDark ? '#60a5fa' : '#3b82f6' }}>
            You are logged in as Super Administrator.
            {unread > 0
              ? ` You have ${unread} unread message${unread !== 1 ? 's' : ''} from staff.`
              : ' No new messages from staff.'}
          </p>
        </div>
      </div>

      {/* ── Message list + detail panel ─────────────────────────────────────── */}
      <div style={{ display: 'flex', gap: '16px', alignItems: 'flex-start' }}>

        {/* List */}
        <div style={{ flex: selected ? '0 0 340px' : '1', backgroundColor: card, border: `1px solid ${border}`, borderRadius: '12px', overflow: 'hidden', minWidth: 0 }}>
          {visible.length === 0 ? (
            <div style={{ padding: '48px', textAlign: 'center', color: textS }}>
              <p style={{ fontSize: '32px', margin: '0 0 12px' }}>📭</p>
              <p style={{ margin: 0, fontSize: '14px' }}>{filter === 'Unread' ? 'No unread messages.' : 'No messages yet.'}</p>
              <p style={{ margin: '6px 0 0', fontSize: '12px', color: isDark ? '#475569' : '#94a3b8' }}>Administrators and Librarians can message you from their portal.</p>
            </div>
          ) : (
            visible.map((msg, i) => (
              <div
                key={msg.id}
                onClick={() => open(msg)}
                style={{ display: 'flex', gap: '12px', padding: '16px 20px', borderBottom: i < visible.length - 1 ? `1px solid ${border}` : 'none', cursor: 'pointer', backgroundColor: selected?.id === msg.id ? (isDark ? '#0f172a' : '#eff6ff') : (!msg.read ? (isDark ? '#1a2744' : '#f0f7ff') : 'transparent'), transition: 'background 0.15s' }}
                onMouseEnter={e => { if (selected?.id !== msg.id) e.currentTarget.style.backgroundColor = hov; }}
                onMouseLeave={e => { if (selected?.id !== msg.id) e.currentTarget.style.backgroundColor = !msg.read ? (isDark ? '#1a2744' : '#f0f7ff') : 'transparent'; }}
              >
                {/* Avatar */}
                <div style={{ width: '38px', height: '38px', borderRadius: '50%', backgroundColor: msg.fromRole === 'administrator' ? '#dbeafe' : '#d1fae5', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '16px', flexShrink: 0, fontWeight: '700', color: msg.fromRole === 'administrator' ? '#1d4ed8' : '#065f46' }}>
                  {(msg.fromName || '?').charAt(0).toUpperCase()}
                </div>

                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px', gap: '8px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', minWidth: 0 }}>
                      {!msg.read && <span style={{ width: '7px', height: '7px', borderRadius: '50%', backgroundColor: '#3b82f6', flexShrink: 0 }} />}
                      <span style={{ fontSize: '13px', fontWeight: msg.read ? '600' : '700', color: textP, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{msg.fromName}</span>
                      <RolePill role={msg.fromRole} />
                    </div>
                    <span style={{ fontSize: '11px', color: textS, flexShrink: 0 }}>{msg.timeFormatted}</span>
                  </div>
                  <p style={{ margin: '0 0 2px', fontSize: '13px', fontWeight: msg.read ? '500' : '700', color: textP, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{msg.subject}</p>
                  <p style={{ margin: 0, fontSize: '12px', color: textS, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{msg.body}</p>
                </div>

                {/* Delete */}
                <button
                  onClick={e => remove(msg.id, e)}
                  title="Delete"
                  style={{ background: 'none', border: 'none', cursor: 'pointer', color: isDark ? '#475569' : '#cbd5e1', padding: '4px', lineHeight: 1, flexShrink: 0, alignSelf: 'flex-start' }}
                  onMouseEnter={e => e.currentTarget.style.color = '#ef4444'}
                  onMouseLeave={e => e.currentTarget.style.color = isDark ? '#475569' : '#cbd5e1'}
                >
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/><path d="M10 11v6M14 11v6"/></svg>
                </button>
              </div>
            ))
          )}
        </div>

        {/* Detail panel */}
        {selected && (
          <div style={{ flex: 1, backgroundColor: card, border: `1px solid ${border}`, borderRadius: '12px', padding: '24px', minWidth: 0 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '20px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
                <div style={{ width: '42px', height: '42px', borderRadius: '50%', backgroundColor: selected.fromRole === 'administrator' ? '#dbeafe' : '#d1fae5', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '18px', fontWeight: '700', color: selected.fromRole === 'administrator' ? '#1d4ed8' : '#065f46', flexShrink: 0 }}>
                  {(selected.fromName || '?').charAt(0).toUpperCase()}
                </div>
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <span style={{ fontSize: '15px', fontWeight: '700', color: textP }}>{selected.fromName}</span>
                    <RolePill role={selected.fromRole} />
                  </div>
                  <span style={{ fontSize: '12px', color: textS }}>{selected.timeFormatted}</span>
                </div>
              </div>
              <button onClick={() => setSelected(null)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: textS, padding: '4px' }}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
              </button>
            </div>

            <h3 style={{ margin: '0 0 16px', fontSize: '17px', fontWeight: '800', color: textP, borderBottom: `1px solid ${border}`, paddingBottom: '14px' }}>{selected.subject}</h3>

            <p style={{ margin: 0, fontSize: '14px', color: textP, lineHeight: '1.7', whiteSpace: 'pre-wrap' }}>{selected.body}</p>

            <div style={{ marginTop: '24px', display: 'flex', gap: '10px' }}>
              <button onClick={() => { remove(selected.id, { stopPropagation: () => {} }); }} style={{ padding: '9px 18px', backgroundColor: 'transparent', border: `1px solid #fca5a5`, borderRadius: '8px', fontSize: '13px', fontWeight: '600', color: '#ef4444', cursor: 'pointer' }}>
                Delete Message
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
