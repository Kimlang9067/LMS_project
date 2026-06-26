const KEY = 'staffMessages';

function getAll() {
  try { return JSON.parse(localStorage.getItem(KEY) || '[]'); }
  catch { return []; }
}

function save(msgs) {
  localStorage.setItem(KEY, JSON.stringify(msgs));
  window.dispatchEvent(new CustomEvent('staffMessagesUpdated'));
}

export function sendToSuperAdmin({ fromRole, fromName, subject, body }) {
  const msgs = getAll();
  const newMsg = {
    id: Date.now(),
    fromRole,
    fromName,
    subject: subject.trim(),
    body: body.trim(),
    createdAt: new Date().toISOString(),
    read: false,
  };
  msgs.unshift(newMsg);
  save(msgs);
  return newMsg;
}

export function getSuperAdminMessages() {
  return getAll();
}

export function getSuperAdminUnreadCount() {
  return getAll().filter(m => !m.read).length;
}

export function markStaffMessageRead(id) {
  const msgs = getAll().map(m => m.id === id ? { ...m, read: true } : m);
  save(msgs);
  return msgs;
}

export function markAllStaffMessagesRead() {
  const msgs = getAll().map(m => ({ ...m, read: true }));
  save(msgs);
  return msgs;
}

export function deleteStaffMessage(id) {
  const msgs = getAll().filter(m => m.id !== id);
  save(msgs);
  return msgs;
}

function formatTime(iso) {
  const diff = Date.now() - new Date(iso).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return 'Just now';
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  const days = Math.floor(hrs / 24);
  if (days < 7) return `${days}d ago`;
  return new Date(iso).toLocaleDateString(undefined, { day: 'numeric', month: 'short', year: '2-digit' });
}

export function getSuperAdminMessagesFormatted() {
  return getAll().map(m => ({ ...m, timeFormatted: formatTime(m.createdAt) }));
}
