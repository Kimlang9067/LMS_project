const STORAGE_KEY = "libraryMessages";

const DEFAULT_MESSAGES = [
  {
    id: 1,
    icon: "📚",
    title: "Welcome to the Library",
    body: "Your account is set up. Browse the catalog to borrow books and manage your loans from your profile.",
    time: "On registration",
    tag: "Account",
    read: true,
    createdAt: new Date().toISOString(),
  },
];

export function getMessages() {
  const saved = localStorage.getItem(STORAGE_KEY);
  if (!saved) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(DEFAULT_MESSAGES));
    return DEFAULT_MESSAGES;
  }
  return JSON.parse(saved);
}

function saveMessages(messages) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(messages));
  localStorage.setItem(
    "unreadCount",
    String(messages.filter((m) => !m.read).length)
  );
}

function formatTime(isoString) {
  const diff = Date.now() - new Date(isoString).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return "Just now";
  if (mins < 60) return `${mins} minute${mins === 1 ? "" : "s"} ago`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `${hours} hour${hours === 1 ? "" : "s"} ago`;
  const days = Math.floor(hours / 24);
  if (days < 7) return `${days} day${days === 1 ? "" : "s"} ago`;
  return new Date(isoString).toLocaleDateString();
}

export function addNotification({ icon = "🔔", title, body, tag = "Library" }) {
  const messages = getMessages();
  const createdAt = new Date().toISOString();
  const newMsg = {
    id: Date.now(),
    icon,
    title,
    body,
    time: "Just now",
    tag,
    read: false,
    createdAt,
  };
  messages.unshift(newMsg);
  saveMessages(messages);
  return newMsg;
}

export function getMessagesWithFormattedTime() {
  return getMessages().map((m) => ({
    ...m,
    time: m.createdAt ? formatTime(m.createdAt) : m.time,
  }));
}

export function markMessageRead(id) {
  const messages = getMessages().map((m) =>
    m.id === id ? { ...m, read: true } : m
  );
  saveMessages(messages);
  return messages;
}

export function markAllMessagesRead() {
  const messages = getMessages().map((m) => ({ ...m, read: true }));
  saveMessages(messages);
  return messages;
}

export function notifyBookBorrowed(bookTitle, returnDate) {
  addNotification({
    icon: "📚",
    title: "Book Borrowed Successfully",
    body: `You have borrowed "${bookTitle}". Please return it by ${returnDate}.`,
    tag: "Library",
  });
}

export function notifyLogin(userName) {
  addNotification({
    icon: "✅",
    title: "Login to Account",
    body: `Welcome back${userName ? `, ${userName}` : ""}! You have successfully signed in to your library account.`,
    tag: "Account",
  });
}

export function notifyPasswordUpdated() {
  addNotification({
    icon: "🔒",
    title: "Password Updated",
    body: "Your password has been updated successfully. If you did not make this change, contact the library immediately.",
    tag: "Account",
  });
}

export function notifyProfileUpdated() {
  addNotification({
    icon: "👤",
    title: "Profile Updated",
    body: "Your profile information has been saved successfully.",
    tag: "Account",
  });
}

export function checkReturnReminders(records, userName) {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const remindedKey = "returnRemindersSent";
  const sent = JSON.parse(localStorage.getItem(remindedKey) || "[]");

  records
    .filter(
      (r) =>
        r.status === "Borrowed" &&
        r.user === userName &&
        r.returnDate &&
        r.returnDate !== "Pending Return"
    )
    .forEach((r) => {
      const due = new Date(r.returnDate);
      due.setHours(0, 0, 0, 0);
      const daysLeft = Math.ceil((due - today) / (1000 * 60 * 60 * 24));
      const reminderId = `${r.id}-due-${daysLeft}`;

      if (daysLeft <= 3 && daysLeft >= 0 && !sent.includes(reminderId)) {
        addNotification({
          icon: "⏰",
          title: "Book Return Reminder",
          body: `Your borrowed book "${r.book}" is due in ${daysLeft} day${daysLeft === 1 ? "" : "s"}. Please return or renew it before the due date.`,
          tag: "Reminder",
        });
        sent.push(reminderId);
      }

      if (daysLeft < 0 && !sent.includes(`${r.id}-overdue`)) {
        addNotification({
          icon: "⚠️",
          title: "Overdue Notice",
          body: `"${r.book}" is now overdue. Please return it to the library as soon as possible.`,
          tag: "Alert",
        });
        sent.push(`${r.id}-overdue`);
      }
    });

  localStorage.setItem(remindedKey, JSON.stringify(sent));
}
