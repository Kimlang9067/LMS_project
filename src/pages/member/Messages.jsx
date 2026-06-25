import React, { useState, useEffect } from 'react';
import {
  getMessagesWithFormattedTime,
  markMessageRead,
  markAllMessagesRead,
} from '../../utils/notifications';
import { Card } from '../../components/shared/UI';

const TAG_COLORS = {
  Reminder: { bg: 'rgba(249,115,22,0.1)', color: '#c2410c' },
  Account:  { bg: 'rgba(74,222,128,0.1)',  color: '#15803d' },
  Library:  { bg: 'rgba(99,102,241,0.1)',  color: '#4338ca' },
  Alert:    { bg: 'rgba(186,26,26,0.1)',   color: '#ba1a1a' },
};

export default function Messages() {
  const [messages, setMessages] = useState(() => getMessagesWithFormattedTime());
  const [filter,   setFilter]   = useState('All');

  const unreadCount = messages.filter(m => !m.read).length;

  useEffect(() => {
    localStorage.setItem('unreadCount', unreadCount);
  }, [unreadCount]);

  const filtered = filter === 'Unread' ? messages.filter(m => !m.read) : messages;

  const markRead = (id) => {
    markMessageRead(id);
    setMessages(getMessagesWithFormattedTime());
  };

  const markAllRead = () => {
    markAllMessagesRead();
    setMessages(getMessagesWithFormattedTime());
  };

  return (
    <div style={{ maxWidth: '860px' }}>

      {/* Page header */}
      <div style={s.pageHeader}>
        <div>
          <h1 style={s.pageTitle}>Messages</h1>
          <p style={s.pageSubtitle}>Notifications and communication from the library.</p>
        </div>
        {unreadCount > 0 && (
          <button style={s.markAllBtn} onClick={markAllRead}>
            Mark all as read
          </button>
        )}
      </div>

      {/* Filter tabs */}
      <div style={s.tabsBar}>
        {['All', 'Unread'].map(tab => (
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

      {/* Message list */}
      <Card style={{ padding: 0, overflow: 'hidden' }}>
        {filtered.length === 0 ? (
          <div style={s.emptyState}>
            <p style={{ fontSize: '32px', marginBottom: '12px' }}>📭</p>
            <p style={{ fontSize: '15px', fontWeight: '700', color: '#0f172a', margin: '0 0 6px' }}>No messages</p>
            <p style={{ fontSize: '13px', color: '#94a3b8', margin: 0 }}>You're all caught up.</p>
          </div>
        ) : (
          filtered.map((msg, i) => (
            <div
              key={msg.id}
              style={{
                ...s.msgRow,
                backgroundColor: !msg.read ? '#f8faff' : '#fff',
                borderBottom: i < filtered.length - 1 ? '1px solid #e2e8f0' : 'none',
              }}
            >
              <div style={s.msgIcon}>{msg.icon}</div>

              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={s.msgTopRow}>
                  <p style={{ ...s.msgTitle, fontWeight: !msg.read ? '800' : '600' }}>{msg.title}</p>
                  <div style={s.msgMeta}>
                    <span style={s.msgTime}>{msg.time}</span>
                    <span style={{ ...s.tagPill, backgroundColor: TAG_COLORS[msg.tag]?.bg, color: TAG_COLORS[msg.tag]?.color }}>
                      {msg.tag}
                    </span>
                  </div>
                </div>
                <p style={s.msgBody}>{msg.body}</p>
                {!msg.read && (
                  <button style={s.markReadBtn} onClick={() => markRead(msg.id)}>
                    Mark as read
                  </button>
                )}
              </div>

              {!msg.read && <div style={s.unreadDot} />}
            </div>
          ))
        )}
      </Card>
    </div>
  );
}

const s = {
  pageHeader:  { display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '24px', flexWrap: 'wrap', gap: '12px' },
  pageTitle:   { fontSize: '24px', fontWeight: '800', color: '#0f172a', margin: '0 0 4px' },
  pageSubtitle:{ fontSize: '14px', color: '#64748b', margin: 0 },
  markAllBtn:  { padding: '10px 18px', fontSize: '13px', fontWeight: '600', color: '#0f172a', backgroundColor: '#f1f5f9', border: 'none', borderRadius: '8px', cursor: 'pointer', transition: 'background 0.15s' },
  tabsBar:     { display: 'flex', alignItems: 'center', borderBottom: '1px solid #e2e8f0', marginBottom: '20px' },
  tabBtn:      { display: 'flex', alignItems: 'center', gap: '8px', padding: '12px 20px', fontSize: '14px', fontWeight: '600', color: '#64748b', backgroundColor: 'transparent', border: 'none', borderBottom: '2px solid transparent', cursor: 'pointer', transition: 'all 0.15s' },
  tabBtnActive:{ color: '#0f172a', borderBottom: '2px solid #0f172a' },
  tabBadge:    { backgroundColor: 'rgba(186,26,26,0.1)', color: '#ba1a1a', fontSize: '10px', fontWeight: '700', padding: '2px 7px', borderRadius: '20px' },
  msgRow:      { display: 'flex', alignItems: 'flex-start', gap: '16px', padding: '20px 24px', transition: 'background 0.1s' },
  msgIcon:     { width: '44px', height: '44px', borderRadius: '12px', backgroundColor: '#f1f5f9', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '20px', flexShrink: 0 },
  msgTopRow:   { display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: '8px', marginBottom: '6px' },
  msgTitle:    { fontSize: '14px', color: '#0f172a', margin: 0 },
  msgMeta:     { display: 'flex', alignItems: 'center', gap: '10px', flexShrink: 0 },
  msgTime:     { fontSize: '12px', color: '#94a3b8', fontWeight: '600' },
  tagPill:     { fontSize: '11px', fontWeight: '700', padding: '3px 10px', borderRadius: '20px', textTransform: 'uppercase', letterSpacing: '0.5px' },
  msgBody:     { fontSize: '13px', color: '#64748b', lineHeight: '1.6', margin: 0 },
  markReadBtn: { marginTop: '8px', fontSize: '12px', fontWeight: '700', color: '#94a3b8', backgroundColor: 'transparent', border: 'none', cursor: 'pointer', padding: 0, transition: 'color 0.15s' },
  unreadDot:   { width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#0f172a', flexShrink: 0, marginTop: '6px' },
  emptyState:  { padding: '60px', textAlign: 'center' },
};
