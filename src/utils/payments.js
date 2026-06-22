const PAID_BOOKS_KEY = "paidBooks";

export function getPaidBooks() {
  try {
    return JSON.parse(localStorage.getItem(PAID_BOOKS_KEY) || "[]");
  } catch {
    return [];
  }
}

export function isBookPaid(bookId) {
  return getPaidBooks().includes(bookId);
}

export function markBookPaid(bookId) {
  const paid = getPaidBooks();
  if (!paid.includes(bookId)) {
    localStorage.setItem(PAID_BOOKS_KEY, JSON.stringify([...paid, bookId]));
  }
}
