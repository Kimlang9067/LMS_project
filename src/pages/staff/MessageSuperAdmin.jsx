import React, { useState, useEffect } from 'react';
import { useTheme } from '../../utils/theme';
import { getSession, getRoleLabel } from '../../utils/auth';
import { sendToSuperAdmin, getSuperAdminMessagesFormatted, deleteStaffMessage } from '../../utils/staffMessages';

const SUBJECTS = [
  'System Issue Report',
  'Budget Approval Request',
  'Staff Support Request',
  'Policy Update Suggestion',
  'Catalog Management Issue',
  'Member Complaint',
  'Fine & Penalty Review',
  'Other / General Message',
];

const ROLE_BADGE = {
  administrator: { label: 'Administrator', bg: '#dbeafe', color: '#1d4ed8' },
  librarian:     { label: 'Librarian',     bg: '#d1fae5', color: '#065f46' },
};

export default function MessageSuperAdmin() {
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  const session = getSession();

  const [subject, setSubject] = useState(SUBJECTS[0]);
  const [customSubject, setCustomSubject] = useState('');
  const [body,    setBody]    = useState('');
  const [sending, setSending] = useState(false);
  const [sent,    setSent]    = useState(false);
  const [error,   setError]   = useState('');
  const [history, setHistory] = useState(() => getSuperAdminMessagesFormatted().filter(m => m.fromName === session?.fullName));

  useEffect(() => {
    const refresh = () => setHistory(getSuperAdminMessagesFormatted().filter(m => m.fromName === session?.fullName));
    window.addEventListener('staffMessagesUpdated', refresh);
    return () => window.removeEventListener('staffMessagesUpdated', refresh);
  }, [session?.fullName]);

  const finalSubject = subject === 'Other / General Message' ? (customSubject.trim() || subject) : subject;

  const handleSend = () => {
    setError('');
    if (!body.trim()) { setError('Please write a message before sending.'); return; }
    if (subject === 'Other / General Message' && !customSubject.trim()) {
      setError('Please enter a subject.'); return;
    }
    setSending(true);
    setTimeout(() => {
      sendToSuperAdmin({
        fromRole: session?.role || 'staff',
        fromName: session?.fullName || 'Staff',
        subject:  finalSubject,
        body:     body.trim(),
      });
      setHistory(getSuperAdminMessagesFormatted().filter(m => m.fromName === session?.fullName));
      setBody('');
      setSubject(SUBJECTS[0]);
      setCustomSubject('');
      setSending(false);
      setSent(true);
      setTimeout(() => setSent(false), 3500);
    }, 600);
  };

  const removeFromHistory = (id) => {
    deleteStaffMessage(id);
    setHistory(getSuperAdminMessagesFormatted().filter(m => m.fromName === session?.fullName));
  };

  // colours
  const card   = isDark ? '#1e293b' : '#fff';
  const border = isDark ? '#334155' : '#e2e8f0';
  const textP  = isDark ? '#f1f5f9' : '#0f172a';
  const textS  = isDark ? '#94a3b8' : '#64748b';
  const inputB = isDark ? '#1F2937' : '#fff';
  const roleC  = ROLE_BADGE[session?.role] || { label: getRoleLabel(session?.role), bg: '#f1f5f9', color: '#475569' };

  return (
    <div style={{ maxWidth: '680px', fontFamily: 'system-ui, sans-serif' }}>

      {/* Page header */}
      <div style={{ marginBottom: '24px' }}>
        <h2 style={{ margin: '0 0 4px', fontSize: '22px', fontWeight: '800', color: textP }}>Message Super Admin</h2>
        <p style={{ margin: 0, fontSize: '14px', color: textS }}>Send a message directly to the Super Administrator.</p>
      </div>

      {/* Sender identity card */}
      <div style={{ backgroundColor: card, border: `1px solid ${border}`, borderRadius: '12px', padding: '16px 20px', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '14px' }}>
        <div style={{ width: '42px', height: '42px', borderRadius: '50%', backgroundColor: roleC.bg, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '18px', fontWeight: '800', color: roleC.color, flexShrink: 0 }}>
          {(session?.fullName || 'S').charAt(0).toUpperCase()}
        </div>
        <div>
          <p style={{ margin: '0 0 3px', fontSize: '14px', fontWeight: '700', color: textP }}>{session?.fullName}</p>
          <span style={{ backgroundColor: roleC.bg, color: roleC.color, fontSize: '11px', fontWeight: '700', padding: '2px 9px', borderRadius: '20px' }}>{roleC.label}</span>
        </div>
        <div style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: '8px', color: textS, fontSize: '13px' }}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2"><line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/></svg>
          To: Super Administrator
        </div>
      </div>

      {/* Compose form */}
      <div style={{ backgroundColor: card, border: `1px solid ${border}`, borderRadius: '12px', padding: '24px', marginBottom: '20px' }}>

        {/* Subject */}
        <div style={{ marginBottom: '16px' }}>
          <label style={{ display: 'block', fontSize: '11px', fontWeight: '700', color: textS, marginBottom: '6px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Subject</label>
          <select
            value={subject}
            onChange={e => setSubject(e.target.value)}
            style={{ width: '100%', padding: '10px 14px', border: `1px solid ${border}`, borderRadius: '8px', fontSize: '14px', outline: 'none', backgroundColor: inputB, color: textP, cursor: 'pointer', fontFamily: 'inherit' }}
          >
            {SUBJECTS.map(s => <option key={s} value={s}>{s}</option>)}
          </select>
        </div>

        {subject === 'Other / General Message' && (
          <div style={{ marginBottom: '16px' }}>
            <label style={{ display: 'block', fontSize: '11px', fontWeight: '700', color: textS, marginBottom: '6px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Custom Subject</label>
            <input
              type="text"
              value={customSubject}
              onChange={e => setCustomSubject(e.target.value)}
              placeholder="Enter your subject…"
              style={{ width: '100%', padding: '10px 14px', boxSizing: 'border-box', border: `1px solid ${border}`, borderRadius: '8px', fontSize: '14px', outline: 'none', backgroundColor: inputB, color: textP, fontFamily: 'inherit' }}
            />
          </div>
        )}

        {/* Message body */}
        <div style={{ marginBottom: '16px' }}>
          <label style={{ display: 'block', fontSize: '11px', fontWeight: '700', color: textS, marginBottom: '6px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Message</label>
          <textarea
            value={body}
            onChange={e => setBody(e.target.value)}
            placeholder="Write your message to the Super Administrator…"
            rows={6}
            style={{ width: '100%', padding: '10px 14px', boxSizing: 'border-box', border: `1px solid ${border}`, borderRadius: '8px', fontSize: '14px', outline: 'none', backgroundColor: inputB, color: textP, resize: 'vertical', fontFamily: 'inherit', lineHeight: '1.6' }}
          />
          <p style={{ margin: '4px 0 0', fontSize: '11px', color: textS }}>{body.trim().length} characters</p>
        </div>

        {error && <p style={{ margin: '0 0 12px', fontSize: '13px', color: '#ef4444', fontWeight: '600' }}>⚠ {error}</p>}
        {sent  && <p style={{ margin: '0 0 12px', fontSize: '13px', color: '#10b981', fontWeight: '600' }}>✓ Message sent to Super Administrator.</p>}

        <div style={{ display: 'flex', gap: '10px' }}>
          <button
            onClick={handleSend}
            disabled={sending}
            style={{ padding: '11px 28px', backgroundColor: '#6366f1', color: '#fff', border: 'none', borderRadius: '8px', fontSize: '14px', fontWeight: '700', cursor: sending ? 'not-allowed' : 'pointer', opacity: sending ? 0.7 : 1, display: 'flex', alignItems: 'center', gap: '8px', fontFamily: 'inherit' }}
          >
            {sending ? (
              <>Sending…</>
            ) : (
              <>
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/></svg>
                Send Message
              </>
            )}
          </button>
          <button
            onClick={() => { setBody(''); setSubject(SUBJECTS[0]); setCustomSubject(''); setError(''); }}
            style={{ padding: '11px 20px', backgroundColor: 'transparent', border: `1px solid ${border}`, borderRadius: '8px', fontSize: '14px', fontWeight: '600', color: textS, cursor: 'pointer', fontFamily: 'inherit' }}
          >
            Clear
          </button>
        </div>
      </div>

      {/* Sent history */}
      {history.length > 0 && (
        <div style={{ backgroundColor: card, border: `1px solid ${border}`, borderRadius: '12px', overflow: 'hidden' }}>
          <div style={{ padding: '16px 20px', borderBottom: `1px solid ${border}` }}>
            <h3 style={{ margin: 0, fontSize: '14px', fontWeight: '700', color: textP }}>Sent Messages ({history.length})</h3>
          </div>
          {history.map((msg, i) => (
            <div key={msg.id} style={{ padding: '14px 20px', borderBottom: i < history.length - 1 ? `1px solid ${border}` : 'none', display: 'flex', gap: '12px', alignItems: 'flex-start' }}>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '3px', gap: '8px' }}>
                  <p style={{ margin: 0, fontSize: '13px', fontWeight: '700', color: textP, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{msg.subject}</p>
                  <span style={{ fontSize: '11px', color: textS, flexShrink: 0 }}>{msg.timeFormatted}</span>
                </div>
                <p style={{ margin: 0, fontSize: '12px', color: textS, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{msg.body}</p>
              </div>
              <button
                onClick={() => removeFromHistory(msg.id)}
                title="Delete"
                style={{ background: 'none', border: 'none', cursor: 'pointer', color: isDark ? '#475569' : '#cbd5e1', padding: '4px', lineHeight: 1, flexShrink: 0 }}
                onMouseEnter={e => e.currentTarget.style.color = '#ef4444'}
                onMouseLeave={e => e.currentTarget.style.color = isDark ? '#475569' : '#cbd5e1'}
              >
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/><path d="M10 11v6M14 11v6"/></svg>
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
