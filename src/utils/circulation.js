const STORAGE_KEY = "circulation";

export function getCirculationRecords() {
  const saved = localStorage.getItem(STORAGE_KEY);
  return saved ? JSON.parse(saved) : [];
}

export function saveCirculationRecords(records) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(records));
}

function parseDate(value) {
  if (!value || value === "Pending Return") return null;
  const d = new Date(value);
  return Number.isNaN(d.getTime()) ? null : d;
}

export function processExpiredLoans(records) {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  let changed = false;
  const updated = records.map((record) => {
    if (record.status !== "Borrowed") return record;

    const deadline = parseDate(record.returnDate);
    if (!deadline) return record;

    deadline.setHours(0, 0, 0, 0);
    if (today > deadline) {
      changed = true;
      return { ...record, status: "Overdue" };
    }
    return record;
  });

  if (changed) saveCirculationRecords(updated);
  return updated;
}

export function getActiveLoans(records) {
  return records.filter((item) => item.status === "Borrowed");
}

export function getBorrowingHistory(records) {
  return records;
}

export function addCirculationRecord(record) {
  const records = getCirculationRecords();
  records.push(record);
  saveCirculationRecords(records);
  return records;
}

export function getCurrentBorrowerName() {
  const user = JSON.parse(localStorage.getItem("userAccount") || "null");
  if (user?.fullName || user?.username) {
    return user.fullName || user.username;
  }
  const session = JSON.parse(localStorage.getItem("currentSession") || "null");
  return session?.fullName || session?.username || "Guest";
}
