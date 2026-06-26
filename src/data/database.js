/**
 * database.js — Central data layer for the Library Management System
 *
 * All localStorage keys, seed data, schema definitions, and CRUD
 * operations live here. Import from this file instead of writing raw
 * localStorage calls anywhere else.
 *
 * Entities:
 *   staff        — Librarian, Administrator, Super Admin accounts
 *   members      — Registered library member accounts
 *   books        — Full book catalog (220 titles)
 *   circulation  — Borrow / return records
 *   fines        — Overdue fine records
 *   messages     — In-app notifications & messages
 *   paidBooks    — IDs of books the member has paid for
 *   settings     — System-wide configuration key-value pairs
 *   auditLog     — Immutable activity audit trail
 */

// ── 1. Storage Keys ───────────────────────────────────────────────────────────

export const KEYS = {
  STAFF:            'libraryStaffAccounts',
  SESSION:          'currentSession',
  MEMBER:           'userAccount',
  CIRCULATION:      'circulation',
  FINE_RECORDS:     'fineRecords',
  MESSAGES:         'libraryMessages',
  UNREAD_COUNT:     'unreadCount',
  PAID_BOOKS:       'paidBooks',
  SETTINGS:         'librarySettings',
  AUDIT_LOG:        'auditLog',
  RETURN_REMINDERS: 'returnRemindersSent',
};

// ── 2. Schema (JSDoc) ─────────────────────────────────────────────────────────

/**
 * @typedef {Object} StaffAccount
 * @property {string}  id        — Unique ID e.g. "staff-1"
 * @property {string}  email
 * @property {string}  phone
 * @property {string}  password
 * @property {string}  role      — ROLES constant value
 * @property {string}  fullName
 * @property {string}  userId    — Display ID e.g. "STAFF-1"
 * @property {string}  status    — "Active" | "Suspended"
 */

/**
 * @typedef {Object} MemberAccount
 * @property {string}  username
 * @property {string}  fullName
 * @property {string}  email
 * @property {string}  phone
 * @property {string}  password
 * @property {string}  role      — always "member"
 */

/**
 * @typedef {Object} Book
 * @property {number}  id
 * @property {string}  title
 * @property {string}  author
 * @property {string}  category
 * @property {string}  publisher
 * @property {string}  isbn
 * @property {string}  type      — "Book" | "Dataset"
 * @property {string}  status    — "Available" | "Checked Out"
 * @property {string}  link
 * @property {number}  copies    — Total copies (default 3)
 * @property {boolean} requiresPayment
 * @property {number}  price
 * @property {string}  description
 */

/**
 * @typedef {Object} CirculationRecord
 * @property {number}  id
 * @property {number}  bookId
 * @property {string}  book     — Book title
 * @property {string}  author
 * @property {string}  user     — Borrower full name
 * @property {string}  issueDate  — "YYYY-MM-DD"
 * @property {string}  returnDate — "YYYY-MM-DD"
 * @property {string}  status   — "Borrowed" | "Overdue" | "Returned"
 * @property {string}  link
 */

/**
 * @typedef {Object} FineRecord
 * @property {number}  id
 * @property {string}  member
 * @property {string}  book
 * @property {string}  amount   — e.g. "$2.50"
 * @property {string}  dueDate
 * @property {string}  status   — "Pending" | "Paid" | "Waived"
 * @property {string}  createdAt
 */

/**
 * @typedef {Object} Message
 * @property {number}  id
 * @property {string}  icon
 * @property {string}  title
 * @property {string}  body
 * @property {string}  tag
 * @property {boolean} read
 * @property {string}  createdAt
 */

/**
 * @typedef {Object} Setting
 * @property {string}  key
 * @property {string}  value
 * @property {string}  description
 * @property {string}  updatedAt
 */

/**
 * @typedef {Object} AuditEntry
 * @property {number}  id
 * @property {string}  action
 * @property {string}  actor
 * @property {string}  details
 * @property {string}  createdAt
 */

// ── 3. Seed Data ──────────────────────────────────────────────────────────────

export const ROLES = {
  SUPER_ADMIN:   'super_admin',
  ADMINISTRATOR: 'administrator',
  LIBRARIAN:     'librarian',
  MEMBER:        'member',
};

/** Built-in staff accounts — always present in the system. */
export const SEED_STAFF = [
  {
    id: 'staff-1', email: 'superadmin@library.com', phone: '1000000001', password: 'Admin@123',
    role: ROLES.SUPER_ADMIN,   fullName: 'Super Administrator',   userId: 'STAFF-1', status: 'Active',
    createdAt: '2024-01-15T08:00:00.000Z', createdBy: 'System',
  },
  {
    id: 'staff-2', email: 'admin@library.com', phone: '1000000002', password: 'admin123',
    role: ROLES.ADMINISTRATOR, fullName: 'Library Administrator', userId: 'STAFF-2', status: 'Active',
    createdAt: '2024-01-15T08:05:00.000Z', createdBy: 'System',
  },
  {
    id: 'staff-3', email: 'librarian@library.com', phone: '1000000003', password: 'lib123',
    role: ROLES.LIBRARIAN,     fullName: 'Head Librarian',        userId: 'STAFF-3', status: 'Active',
    createdAt: '2024-01-15T08:10:00.000Z', createdBy: 'System',
  },
  // ── Extra staff ────────────────────────────────────────────────────────────
  {
    id: 'staff-4', email: 'dara.keo@library.com', phone: '1000000004', password: 'dara123',
    role: ROLES.ADMINISTRATOR, fullName: 'Dara Keo',   userId: 'STAFF-4', status: 'Active',
    createdAt: '2024-02-10T09:00:00.000Z', createdBy: 'Super Administrator',
  },
  {
    id: 'staff-5', email: 'channary.pich@library.com', phone: '1000000005', password: 'chan123',
    role: ROLES.LIBRARIAN, fullName: 'Channary Pich', userId: 'STAFF-5', status: 'Active',
    createdAt: '2024-02-12T09:30:00.000Z', createdBy: 'Library Administrator',
  },
  {
    id: 'staff-6', email: 'sophea.meng@library.com', phone: '1000000006', password: 'sop123',
    role: ROLES.LIBRARIAN, fullName: 'Sophea Meng', userId: 'STAFF-6', status: 'Active',
    createdAt: '2024-03-01T10:00:00.000Z', createdBy: 'Library Administrator',
  },
  // ── Admin-created member accounts ─────────────────────────────────────────
  {
    id: 'user-101', email: 'visal.chen@student.edu.kh', phone: '0971234001', password: 'visal123',
    role: ROLES.MEMBER, fullName: 'Visal Chen', userId: 'MEM-101', status: 'Active',
    createdAt: '2024-09-03T08:00:00.000Z', createdBy: 'Head Librarian',
  },
  {
    id: 'user-102', email: 'pisey.heng@student.edu.kh', phone: '0971234002', password: 'pisey123',
    role: ROLES.MEMBER, fullName: 'Pisey Heng', userId: 'MEM-102', status: 'Active',
    createdAt: '2024-09-03T08:15:00.000Z', createdBy: 'Head Librarian',
  },
  {
    id: 'user-103', email: 'davan.sor@student.edu.kh', phone: '0971234003', password: 'davan123',
    role: ROLES.MEMBER, fullName: 'Davan Sor', userId: 'MEM-103', status: 'Active',
    createdAt: '2024-09-04T09:00:00.000Z', createdBy: 'Head Librarian',
  },
  {
    id: 'user-104', email: 'rattana.khun@student.edu.kh', phone: '0971234004', password: 'ratt123',
    role: ROLES.MEMBER, fullName: 'Rattana Khun', userId: 'MEM-104', status: 'Active',
    createdAt: '2024-09-05T10:00:00.000Z', createdBy: 'Channary Pich',
  },
  {
    id: 'user-105', email: 'bopha.sim@student.edu.kh', phone: '0971234005', password: 'boph123',
    role: ROLES.MEMBER, fullName: 'Bopha Sim', userId: 'MEM-105', status: 'Active',
    createdAt: '2024-09-06T08:30:00.000Z', createdBy: 'Channary Pich',
  },
  {
    id: 'user-106', email: 'leakhena.ros@student.edu.kh', phone: '0971234006', password: 'leak123',
    role: ROLES.MEMBER, fullName: 'Leakhena Ros', userId: 'MEM-106', status: 'Active',
    createdAt: '2024-09-10T11:00:00.000Z', createdBy: 'Sophea Meng',
  },
  {
    id: 'user-107', email: 'sambath.try@student.edu.kh', phone: '0971234007', password: 'samb123',
    role: ROLES.MEMBER, fullName: 'Sambath Try', userId: 'MEM-107', status: 'Suspended',
    createdAt: '2024-09-12T09:45:00.000Z', createdBy: 'Head Librarian',
  },
];

/** Default system settings. */
export const SEED_SETTINGS = [
  { key: 'max_borrow_days',     value: '14',    description: 'Maximum days a member can borrow a book.',          updatedAt: new Date().toISOString() },
  { key: 'max_books_per_member',value: '5',     description: 'Maximum books a member can borrow at one time.',    updatedAt: new Date().toISOString() },
  { key: 'fine_per_day',        value: '0.25',  description: 'Fine amount in USD charged per overdue day.',       updatedAt: new Date().toISOString() },
  { key: 'renewal_limit',       value: '2',     description: 'Maximum number of times a loan can be renewed.',    updatedAt: new Date().toISOString() },
  { key: 'total_book_copies',   value: '3',     description: 'Default number of copies per book title.',          updatedAt: new Date().toISOString() },
  { key: 'otp_expiry_minutes',  value: '10',    description: 'OTP code validity window in minutes.',              updatedAt: new Date().toISOString() },
  { key: 'session_timeout_min', value: '60',    description: 'Auto-logout after N minutes of inactivity.',        updatedAt: new Date().toISOString() },
  { key: 'library_name',        value: 'Data_Science Library',     description: 'Display name of the library.',  updatedAt: new Date().toISOString() },
  { key: 'library_email',       value: 'library@datascience.edu',  description: 'Official library contact email.',updatedAt: new Date().toISOString() },
  { key: 'library_phone',       value: '+855 23 000 000',          description: 'Official library phone number.',updatedAt: new Date().toISOString() },
];

/** Seed welcome notification shown to every new member. */
// SEED_MESSAGES is defined below as SEED_MEMBER_MESSAGES; alias set after that constant.
let SEED_MESSAGES = null; // resolved after SEED_MEMBER_MESSAGES is declared

// ── Mock seed data helpers ─────────────────────────────────────────────────────
function dAgo(n) {
  const d = new Date();
  d.setDate(d.getDate() - n);
  return d.toISOString().slice(0, 10);
}
function isoAgo(n) {
  const d = new Date();
  d.setDate(d.getDate() - n);
  return d.toISOString();
}

/** Mock circulation records — realistic borrow/return history. */
export const SEED_CIRCULATION = [
  // Active loans
  { id: 3001, bookId: 31,  book: 'Clean Code',                            author: 'Robert C. Martin',            user: 'Visal Chen',   issueDate: dAgo(8),  returnDate: dAgo(-6),  status: 'Borrowed', link: 'https://www.amazon.com/Clean-Code-Handbook-Software-Craftsmanship/dp/0132350882' },
  { id: 3002, bookId: 44,  book: 'Hands-On Machine Learning',             author: 'Aurélien Géron',              user: 'Pisey Heng',   issueDate: dAgo(5),  returnDate: dAgo(-9),  status: 'Borrowed', link: 'https://www.oreilly.com/library/view/hands-on-machine-learning/9781492032632/' },
  { id: 3003, bookId: 36,  book: 'Introduction to Algorithms',            author: 'Thomas H. Cormen et al.',     user: 'Davan Sor',    issueDate: dAgo(10), returnDate: dAgo(-4),  status: 'Borrowed', link: 'https://mitpress.mit.edu/9780262046305' },
  { id: 3004, bookId: 131, book: 'Sapiens',                               author: 'Yuval Noah Harari',           user: 'Rattana Khun', issueDate: dAgo(3),  returnDate: dAgo(-11), status: 'Borrowed', link: 'https://www.amazon.com/dp/0062316095' },
  { id: 3005, bookId: 65,  book: 'Kubernetes in Action',                  author: 'Marko Lukša',                 user: 'Bopha Sim',    issueDate: dAgo(7),  returnDate: dAgo(-7),  status: 'Borrowed', link: 'https://www.manning.com/books/kubernetes-in-action' },
  { id: 3006, bookId: 67,  book: 'Site Reliability Engineering',          author: 'Betsy Beyer et al.',          user: 'Leakhena Ros', issueDate: dAgo(2),  returnDate: dAgo(-12), status: 'Borrowed', link: 'https://sre.google/sre-book/table-of-contents/' },
  // Overdue loans
  { id: 3007, bookId: 33,  book: 'Design Patterns',                       author: 'Gang of Four',                user: 'Visal Chen',   issueDate: dAgo(22), returnDate: dAgo(8),   status: 'Overdue',  link: 'https://www.amazon.com/Design-Patterns-Elements-Reusable-Object-Oriented/dp/0201633612' },
  { id: 3008, bookId: 1,   book: 'Foundations of ML',                     author: 'Mehryar Mohri et al.',        user: 'Pisey Heng',   issueDate: dAgo(25), returnDate: dAgo(11),  status: 'Overdue',  link: 'https://www.amazon.com/Foundations-Machine-Learning-Adaptive-Computation/dp/0262018020' },
  { id: 3009, bookId: 43,  book: 'Deep Learning',                         author: 'Ian Goodfellow et al.',       user: 'Rattana Khun', issueDate: dAgo(20), returnDate: dAgo(6),   status: 'Overdue',  link: 'https://www.deeplearningbook.org/' },
  { id: 3010, bookId: 105, book: 'Dune',                                  author: 'Frank Herbert',               user: 'Sambath Try',  issueDate: dAgo(30), returnDate: dAgo(16),  status: 'Overdue',  link: 'https://www.amazon.com/dp/0441172717' },
  // Returned books
  { id: 3011, bookId: 37,  book: 'Cracking the Coding Interview',         author: 'Gayle Laakmann McDowell',     user: 'Davan Sor',    issueDate: dAgo(45), returnDate: dAgo(32),  status: 'Returned', link: 'https://www.amazon.com/Cracking-Coding-Interview-Programming-Questions/dp/0984782850' },
  { id: 3012, bookId: 12,  book: 'JavaScript for Beginners',              author: 'Marijn Haverbeke',            user: 'Bopha Sim',    issueDate: dAgo(40), returnDate: dAgo(27),  status: 'Returned', link: 'https://javascript.info/' },
  { id: 3013, bookId: 7,   book: 'Computer Networks',                     author: 'James F. Kurose & Keith Ross', user: 'Visal Chen',  issueDate: dAgo(38), returnDate: dAgo(24),  status: 'Returned', link: 'https://www.amazon.com/Computer-Networks-Top-Down-Approach-7th/dp/0133594149' },
  { id: 3014, bookId: 123, book: 'Atomic Habits',                         author: 'James Clear',                 user: 'Leakhena Ros', issueDate: dAgo(50), returnDate: dAgo(36),  status: 'Returned', link: 'https://www.amazon.com/dp/0735211299' },
  { id: 3015, bookId: 38,  book: 'The Art of Computer Programming',       author: 'Donald E. Knuth',             user: 'Pisey Heng',   issueDate: dAgo(60), returnDate: dAgo(46),  status: 'Returned', link: 'https://www.amazon.com/Computer-Programming-Volumes-1-4A-Boxed/dp/0321751043' },
  { id: 3016, bookId: 41,  book: 'Artificial Intelligence: A Modern Approach', author: 'Stuart Russell & Peter Norvig', user: 'Rattana Khun', issueDate: dAgo(55), returnDate: dAgo(41), status: 'Returned', link: 'https://aima.cs.berkeley.edu/' },
  { id: 3017, bookId: 61,  book: 'Domain-Driven Design',                  author: 'Eric Evans',                  user: 'Davan Sor',    issueDate: dAgo(48), returnDate: dAgo(34),  status: 'Returned', link: 'https://www.amazon.com/Domain-Driven-Design-Tackling-Complexity-Software/dp/0321125215' },
  { id: 3018, bookId: 75,  book: 'Eloquent JavaScript',                   author: 'Marijn Haverbeke',            user: 'Bopha Sim',    issueDate: dAgo(35), returnDate: dAgo(21),  status: 'Returned', link: 'https://eloquentjavascript.net/' },
  { id: 3019, bookId: 49,  book: 'Mathematics for Machine Learning',      author: 'Marc Peter Deisenroth et al.', user: 'Visal Chen',  issueDate: dAgo(30), returnDate: dAgo(16),  status: 'Returned', link: 'https://mml-book.github.io/' },
  { id: 3020, bookId: 62,  book: 'Microservices Patterns',                author: 'Chris Richardson',            user: 'Leakhena Ros', issueDate: dAgo(25), returnDate: dAgo(11),  status: 'Returned', link: 'https://microservices.io/book' },
];

/** Mock fine records. */
export const SEED_FINES = [
  { id: 4001, member: 'Visal Chen',   book: 'Design Patterns',       amount: '$2.00', dueDate: dAgo(8),  status: 'Pending', createdAt: isoAgo(8)  },
  { id: 4002, member: 'Pisey Heng',   book: 'Foundations of ML',     amount: '$2.75', dueDate: dAgo(11), status: 'Pending', createdAt: isoAgo(11) },
  { id: 4003, member: 'Rattana Khun', book: 'Deep Learning',          amount: '$1.50', dueDate: dAgo(6),  status: 'Pending', createdAt: isoAgo(6)  },
  { id: 4004, member: 'Sambath Try',  book: 'Dune',                   amount: '$4.00', dueDate: dAgo(16), status: 'Pending', createdAt: isoAgo(16) },
  { id: 4005, member: 'Davan Sor',    book: 'Cracking the Coding Interview', amount: '$1.25', dueDate: dAgo(32), status: 'Paid',    createdAt: isoAgo(40) },
  { id: 4006, member: 'Bopha Sim',    book: 'JavaScript for Beginners',     amount: '$0.75', dueDate: dAgo(27), status: 'Paid',    createdAt: isoAgo(35) },
  { id: 4007, member: 'Leakhena Ros', book: 'Atomic Habits',          amount: '$0.50', dueDate: dAgo(36), status: 'Waived',  createdAt: isoAgo(45) },
  { id: 4008, member: 'Pisey Heng',   book: 'The Art of Computer Programming', amount: '$3.50', dueDate: dAgo(46), status: 'Paid', createdAt: isoAgo(55) },
];

/** Mock staff messages to super admin. */
export const SEED_STAFF_MESSAGES = [
  {
    id: 5001, fromRole: 'administrator', fromName: 'Dara Keo',
    subject: 'Budget Approval Request — Q3 Book Acquisition',
    body: 'Dear Super Admin,\n\nI would like to request budget approval of $2,400 for the Q3 book acquisition plan. We have identified 48 new titles across AI, Data Science, and Software Engineering categories that are in high demand by students.\n\nPlease review the attached proposal and provide your approval at your earliest convenience.\n\nBest regards,\nDara Keo\nAdministrator',
    createdAt: isoAgo(2), read: false,
  },
  {
    id: 5002, fromRole: 'librarian', fromName: 'Channary Pich',
    subject: 'System Issue — Catalog Search Not Filtering Correctly',
    body: 'Hello,\n\nI wanted to bring to your attention a bug in the catalog search system. When members filter by "AI & Machine Learning" category, books from other categories occasionally appear in the results.\n\nThis has caused some confusion at the circulation desk. Could you please escalate this to the technical team?\n\nThank you,\nChannary Pich\nLibrarian',
    createdAt: isoAgo(4), read: false,
  },
  {
    id: 5003, fromRole: 'administrator', fromName: 'Library Administrator',
    subject: 'New Policy Suggestion — Overdue Fine Structure',
    body: 'Dear Super Administrator,\n\nAfter reviewing our current fine collection data, I propose updating our fine structure from $0.25/day to $0.50/day for books overdue by more than 7 days. This aligns with peer institutions and may encourage timely returns.\n\nI have prepared a full impact analysis report. Please let me know if you would like to discuss this further.\n\nRegards,\nLibrary Administrator',
    createdAt: isoAgo(6), read: true,
  },
  {
    id: 5004, fromRole: 'librarian', fromName: 'Sophea Meng',
    subject: 'Member Complaint — Damaged Book Returned',
    body: 'Dear Super Admin,\n\nA member (Sambath Try, MEM-107) returned a copy of "Dune" with significant water damage. The book is no longer usable.\n\nThe replacement cost is approximately $18.00. I have suspended the member\'s account pending resolution. Please advise on how to proceed with the damage claim.\n\nThank you,\nSophea Meng\nLibrarian',
    createdAt: isoAgo(9), read: true,
  },
  {
    id: 5005, fromRole: 'librarian', fromName: 'Head Librarian',
    subject: 'Staff Support Request — New Staff Onboarding',
    body: 'Hi,\n\nWe have two new part-time librarians joining next month. Could you please create system accounts for them in advance so they can complete their training?\n\nDetails:\n1. Makara Noun — makara.noun@library.com\n2. Sreynich Rath — sreynich.rath@library.com\n\nBoth will have Librarian-level access.\n\nThanks,\nHead Librarian',
    createdAt: isoAgo(14), read: true,
  },
];

/** Mock audit log entries. */
export const SEED_AUDIT_LOG = [
  { id: 6001, action: 'Login',          actor: 'Super Administrator', details: 'Logged in via email',              createdAt: isoAgo(0)  },
  { id: 6002, action: 'Book Borrowed',  actor: 'Visal Chen',         details: '"Clean Code" — due in 6 days',     createdAt: isoAgo(8)  },
  { id: 6003, action: 'Book Borrowed',  actor: 'Pisey Heng',         details: '"Hands-On Machine Learning" — due in 9 days', createdAt: isoAgo(5)  },
  { id: 6004, action: 'Book Borrowed',  actor: 'Davan Sor',          details: '"Introduction to Algorithms" — due in 4 days', createdAt: isoAgo(10) },
  { id: 6005, action: 'Fine Issued',    actor: 'System',             details: 'Visal Chen — "Design Patterns" — $2.00', createdAt: isoAgo(8)  },
  { id: 6006, action: 'Fine Issued',    actor: 'System',             details: 'Pisey Heng — "Foundations of ML" — $2.75', createdAt: isoAgo(11) },
  { id: 6007, action: 'Book Returned',  actor: 'Davan Sor',          details: '"Cracking the Coding Interview" returned on time', createdAt: isoAgo(13) },
  { id: 6008, action: 'Book Returned',  actor: 'Bopha Sim',          details: '"JavaScript for Beginners" returned', createdAt: isoAgo(15) },
  { id: 6009, action: 'Staff Created',  actor: 'Library Administrator', details: 'Account: channary.pich@library.com', createdAt: isoAgo(120) },
  { id: 6010, action: 'Staff Created',  actor: 'Library Administrator', details: 'Account: sophea.meng@library.com',  createdAt: isoAgo(118) },
  { id: 6011, action: 'Staff Created',  actor: 'Head Librarian',     details: 'Member account: visal.chen@student.edu.kh', createdAt: isoAgo(115) },
  { id: 6012, action: 'Staff Created',  actor: 'Head Librarian',     details: 'Member account: pisey.heng@student.edu.kh', createdAt: isoAgo(115) },
  { id: 6013, action: 'Setting Changed',actor: 'Admin',              details: 'max_borrow_days = 14',              createdAt: isoAgo(100) },
  { id: 6014, action: 'Setting Changed',actor: 'Admin',              details: 'fine_per_day = 0.25',              createdAt: isoAgo(100) },
  { id: 6015, action: 'Login',          actor: 'Dara Keo',           details: 'Logged in via email',              createdAt: isoAgo(2)  },
  { id: 6016, action: 'Login',          actor: 'Channary Pich',      details: 'Logged in via email',              createdAt: isoAgo(1)  },
  { id: 6017, action: 'Fine Paid',      actor: 'Davan Sor',          details: '"Cracking the Coding Interview" fine — $1.25 cleared', createdAt: isoAgo(13) },
  { id: 6018, action: 'Staff Updated',  actor: 'System',             details: 'Account: sambath.try@student.edu.kh suspended', createdAt: isoAgo(9)  },
  { id: 6019, action: 'Book Borrowed',  actor: 'Rattana Khun',       details: '"Sapiens" — due in 11 days',       createdAt: isoAgo(3)  },
  { id: 6020, action: 'Book Borrowed',  actor: 'Leakhena Ros',       details: '"Site Reliability Engineering" — due in 12 days', createdAt: isoAgo(2)  },
];

/** Richer member notification seed. */
export const SEED_MEMBER_MESSAGES = [
  {
    id: 1, icon: '📚', title: 'Welcome to the Library',
    body: 'Your account is set up. Browse the catalog to borrow books and manage your loans from your profile.',
    tag: 'Account', read: true, createdAt: isoAgo(30),
  },
  {
    id: 2, icon: '✅', title: 'Account Verified',
    body: 'Your library membership has been verified by staff. You can now borrow up to 5 books at a time.',
    tag: 'Account', read: true, createdAt: isoAgo(28),
  },
  {
    id: 3, icon: '📖', title: 'New Books Added to Catalog',
    body: 'We have added 12 new titles in AI, Machine Learning, and Software Engineering. Check out the catalog to explore them!',
    tag: 'Library', read: true, createdAt: isoAgo(14),
  },
  {
    id: 4, icon: '⏰', title: 'Return Reminder',
    body: 'Your borrowed book "Clean Code" is due in 3 days. Please return or request a renewal at the circulation desk.',
    tag: 'Reminder', read: false, createdAt: isoAgo(1),
  },
  {
    id: 5, icon: '🔔', title: 'Library Hours Update',
    body: 'The library will be closed on public holidays. Regular hours: Mon–Fri 8 AM–10 PM, Sat 10 AM–6 PM, Sun 12–5 PM.',
    tag: 'Library', read: false, createdAt: isoAgo(3),
  },
];

// Resolve alias so the messages entity module can use it as a fallback
SEED_MESSAGES = SEED_MEMBER_MESSAGES;

/** Complete book catalog — 220 titles with full metadata. */
export const SEED_BOOKS = [
  // ── Computer Science & AI ──────────────────────────────────────────────────
  { id: 1,   title: 'Foundations of ML',                          author: 'Mehryar Mohri et al.',            category: 'AI & Machine Learning',  publisher: 'MIT Press',            isbn: '978-0262018029', type: 'Book',    status: 'Available',   copies: 3, requiresPayment: false, price: 0,   description: '"Foundations of ML" is a Book resource in our library collection.',                   link: 'https://www.amazon.com/Foundations-Machine-Learning-Adaptive-Computation/dp/0262018020' },
  { id: 2,   title: 'Python for Data Analysis',                   author: 'Wes McKinney',                    category: 'Data Science',            publisher: "O'Reilly Media",       isbn: '978-1491957660', type: 'Dataset', status: 'Checked Out', copies: 3, requiresPayment: false, price: 0,   description: '"Python for Data Analysis" is a Dataset resource in our library collection.',         link: 'https://wesmckinney.com/book/' },
  { id: 3,   title: 'Deep Learning with PyTorch',                 author: 'Eli Stevens & Luca Antiga',       category: 'Deep Learning',           publisher: 'Manning',              isbn: '978-1617295263', type: 'Book',    status: 'Available',   copies: 3, requiresPayment: false, price: 0,   description: '"Deep Learning with PyTorch" is a Book resource in our library collection.',          link: 'https://www.manning.com/books/deep-learning-with-pytorch' },
  { id: 4,   title: 'Introduction to Artificial Intelligence',    author: 'Stuart Russell & Peter Norvig',   category: 'Artificial Intelligence', publisher: 'Pearson',              isbn: '978-0134610993', type: 'Book',    status: 'Available',   copies: 3, requiresPayment: false, price: 0,   description: '"Introduction to Artificial Intelligence" is a Book resource in our library collection.',link: 'https://aima.cs.berkeley.edu/' },
  { id: 5,   title: 'Machine Learning Basics',                    author: 'Andrew Ng',                       category: 'Machine Learning',        publisher: 'Coursera',             isbn: '978-0000000005', type: 'Book',    status: 'Available',   copies: 3, requiresPayment: false, price: 0,   description: '"Machine Learning Basics" is a Book resource in our library collection.',             link: 'https://www.coursera.org/learn/machine-learning' },
  { id: 6,   title: 'Data Structures and Algorithms',             author: 'Thomas H. Cormen et al.',         category: 'Algorithms',              publisher: 'GeeksforGeeks',        isbn: '978-0000000006', type: 'Book',    status: 'Checked Out', copies: 3, requiresPayment: false, price: 0,   description: '"Data Structures and Algorithms" is a Book resource in our library collection.',      link: 'https://www.geeksforgeeks.org/data-structures/' },
  { id: 7,   title: 'Computer Networks',                          author: 'James F. Kurose & Keith Ross',    category: 'Networking',              publisher: 'Pearson',              isbn: '978-0133594140', type: 'Book',    status: 'Available',   copies: 3, requiresPayment: false, price: 0,   description: '"Computer Networks" is a Book resource in our library collection.',                   link: 'https://www.amazon.com/Computer-Networks-Top-Down-Approach-7th/dp/0133594149' },
  { id: 8,   title: 'Operating System Concepts',                  author: 'Abraham Silberschatz et al.',     category: 'Operating Systems',       publisher: 'Wiley',                isbn: '978-1118063330', type: 'Book',    status: 'Available',   copies: 3, requiresPayment: false, price: 0,   description: '"Operating System Concepts" is a Book resource in our library collection.',            link: 'https://os-book.com/' },
  { id: 9,   title: 'Database Management Systems',                author: 'Raghu Ramakrishnan',               category: 'Databases',               publisher: 'McGraw-Hill',          isbn: '978-0072465631', type: 'Book',    status: 'Checked Out', copies: 3, requiresPayment: false, price: 0,   description: '"Database Management Systems" is a Book resource in our library collection.',          link: 'https://www.amazon.com/Database-Management-Systems-Raghu-Ramakrishnan/dp/0072465638' },
  { id: 10,  title: 'Software Engineering Principles',            author: 'Ian Sommerville',                 category: 'Software Engineering',    publisher: 'Pearson',              isbn: '978-0133943030', type: 'Book',    status: 'Available',   copies: 3, requiresPayment: false, price: 0,   description: '"Software Engineering Principles" is a Book resource in our library collection.',      link: 'https://www.amazon.com/Software-Engineering-10th-Ian-Sommerville/dp/0133943038' },
  { id: 11,  title: 'React.js Complete Guide',                    author: 'Wes Bos',                         category: 'Web Development',         publisher: 'Self-Published',       isbn: '978-0000000011', type: 'Book',    status: 'Available',   copies: 3, requiresPayment: false, price: 0,   description: '"React.js Complete Guide" is a Book resource in our library collection.',             link: 'https://react.dev/' },
  { id: 12,  title: 'JavaScript for Beginners',                   author: 'Marijn Haverbeke',                category: 'JavaScript',              publisher: 'No Starch Press',      isbn: '978-1593272821', type: 'Book',    status: 'Available',   copies: 3, requiresPayment: false, price: 0,   description: '"JavaScript for Beginners" is a Book resource in our library collection.',            link: 'https://javascript.info/' },
  { id: 13,  title: 'Advanced Java Programming',                  author: 'James Gosling et al.',            category: 'Programming',             publisher: 'Oracle',               isbn: '978-0000000013', type: 'Book',    status: 'Checked Out', copies: 3, requiresPayment: false, price: 0,   description: '"Advanced Java Programming" is a Book resource in our library collection.',            link: 'https://dev.java/learn/' },
  { id: 14,  title: 'C++ Programming Fundamentals',               author: 'Stanley B. Lippman',              category: 'Programming',             publisher: 'Addison-Wesley',       isbn: '978-0321714114', type: 'Book',    status: 'Available',   copies: 3, requiresPayment: false, price: 0,   description: '"C++ Programming Fundamentals" is a Book resource in our library collection.',         link: 'https://www.learncpp.com/' },
  { id: 15,  title: 'Cybersecurity Essentials',                   author: 'Chuck Easttom',                   category: 'Cybersecurity',           publisher: 'Cisco Press',          isbn: '978-0000000015', type: 'Book',    status: 'Available',   copies: 3, requiresPayment: false, price: 0,   description: '"Cybersecurity Essentials" is a Book resource in our library collection.',             link: 'https://www.cisco.com' },
  { id: 16,  title: 'Cloud Computing Concepts',                   author: 'Arshdeep Bahga',                  category: 'Cloud Computing',         publisher: 'VPT',                  isbn: '978-0000000016', type: 'Book',    status: 'Available',   copies: 3, requiresPayment: false, price: 0,   description: '"Cloud Computing Concepts" is a Book resource in our library collection.',             link: 'https://www.coursera.org/learn/cloud-computing' },
  { id: 17,  title: 'Big Data Analytics',                         author: 'Rick Smolan & Jennifer Erwitt',   category: 'Big Data',                publisher: 'Against All Odds',     isbn: '978-0000000017', type: 'Book',    status: 'Checked Out', copies: 3, requiresPayment: false, price: 0,   description: '"Big Data Analytics" is a Book resource in our library collection.',                  link: 'https://www.amazon.com' },
  { id: 18,  title: 'Data Science Handbook',                      author: 'Carl Shan et al.',                category: 'Data Science',            publisher: 'Blurb',                isbn: '978-0000000018', type: 'Book',    status: 'Available',   copies: 3, requiresPayment: false, price: 0,   description: '"Data Science Handbook" is a Book resource in our library collection.',               link: 'https://www.thedatasciencehandbook.com/' },
  { id: 19,  title: 'Human Computer Interaction',                 author: 'Alan Dix et al.',                 category: 'HCI',                     publisher: 'Pearson',              isbn: '978-0000000019', type: 'Book',    status: 'Available',   copies: 3, requiresPayment: false, price: 0,   description: '"Human Computer Interaction" is a Book resource in our library collection.',           link: 'https://www.interaction-design.org' },
  { id: 20,  title: 'Mobile App Development',                     author: 'Reto Meier',                      category: 'Mobile Development',      publisher: "O'Reilly Media",       isbn: '978-0000000020', type: 'Book',    status: 'Available',   copies: 3, requiresPayment: false, price: 0,   description: '"Mobile App Development" is a Book resource in our library collection.',              link: 'https://developer.android.com/courses' },
  // ── Software Engineering ───────────────────────────────────────────────────
  { id: 31,  title: 'Clean Code',                                 author: 'Robert C. Martin',                category: 'Software Engineering',    publisher: 'Prentice Hall',        isbn: '978-0132350884', type: 'Book',    status: 'Available',   copies: 3, requiresPayment: true,  price: 3.0, description: 'Clean Code teaches you how to write readable, maintainable software. Robert C. Martin shares practical rules and examples for naming, functions, comments, and refactoring so your code stays easy to work with over time.', link: 'https://www.amazon.com/Clean-Code-Handbook-Software-Craftsmanship/dp/0132350882' },
  { id: 32,  title: 'The Pragmatic Programmer',                   author: 'David Thomas & Andrew Hunt',      category: 'Software Engineering',    publisher: 'Addison-Wesley',       isbn: '978-0135957059', type: 'Book',    status: 'Available',   copies: 3, requiresPayment: true,  price: 3.0, description: 'The Pragmatic Programmer teaches practical software development habits, focusing on problem-solving, code quality, and long-term thinking for developers.',                                                             link: 'https://pragprog.com/titles/tpp20' },
  { id: 33,  title: 'Design Patterns',                            author: 'Gang of Four',                    category: 'Design Patterns',         publisher: 'Addison-Wesley',       isbn: '978-0201633610', type: 'Book',    status: 'Checked Out', copies: 3, requiresPayment: true,  price: 4.0, description: 'Design Patterns introduces reusable solutions to common software design problems, helping developers build flexible and maintainable applications.',                                                                     link: 'https://www.amazon.com/Design-Patterns-Elements-Reusable-Object-Oriented/dp/0201633612' },
  { id: 34,  title: 'Refactoring',                                author: 'Martin Fowler',                   category: 'Software Engineering',    publisher: 'Addison-Wesley',       isbn: '978-0201485677', type: 'Book',    status: 'Available',   copies: 3, requiresPayment: true,  price: 3.5, description: 'Refactoring shows how to safely improve existing code structure to make it cleaner, more efficient, and easier to maintain.',                                                                                            link: 'https://martinfowler.com/books/refactoring.html' },
  { id: 35,  title: 'The Clean Coder',                            author: 'Robert C. Martin',                category: 'Software Engineering',    publisher: 'Prentice Hall',        isbn: '978-0137081073', type: 'Book',    status: 'Available',   copies: 3, requiresPayment: false, price: 0,   description: '"The Clean Coder" is a Book resource in our library collection.',                     link: 'https://www.amazon.com/Clean-Coder-Conduct-Professional-Programmers/dp/0137081073' },
  { id: 36,  title: 'Introduction to Algorithms',                 author: 'Thomas H. Cormen et al.',         category: 'Algorithms',              publisher: 'MIT Press',            isbn: '978-0262046305', type: 'Book',    status: 'Checked Out', copies: 3, requiresPayment: false, price: 0,   description: '"Introduction to Algorithms" is a Book resource in our library collection.',           link: 'https://mitpress.mit.edu/9780262046305' },
  { id: 37,  title: 'Cracking the Coding Interview',              author: 'Gayle Laakmann McDowell',         category: 'Coding Interviews',       publisher: 'CareerCup',            isbn: '978-0984782857', type: 'Book',    status: 'Available',   copies: 3, requiresPayment: true,  price: 3.0, description: 'Cracking the Coding Interview prepares you for technical interviews with hundreds of programming questions, solutions, and strategies for problem-solving, data structures, and algorithms.',                            link: 'https://www.amazon.com/Cracking-Coding-Interview-Programming-Questions/dp/0984782850' },
  { id: 38,  title: 'The Art of Computer Programming',            author: 'Donald E. Knuth',                 category: 'Computer Science',        publisher: 'Addison-Wesley',       isbn: '978-0321751041', type: 'Book',    status: 'Available',   copies: 3, requiresPayment: true,  price: 6.0, description: 'The Art of Computer Programming is a deep mathematical exploration of algorithms and computational theory by Donald Knuth.',                                                                                            link: 'https://www.amazon.com/Computer-Programming-Volumes-1-4A-Boxed/dp/0321751043' },
  { id: 39,  title: 'Structure and Interpretation of Computer Programs', author: 'Harold Abelson & Gerald Sussman', category: 'Computer Science', publisher: 'MIT Press',          isbn: '978-0262510875', type: 'Book',    status: 'Available',   copies: 3, requiresPayment: false, price: 0,   description: '"Structure and Interpretation of Computer Programs" is a Book resource in our library collection.', link: 'https://mitpress.mit.edu/9780262510875' },
  { id: 40,  title: 'Compilers: Principles, Techniques & Tools',  author: 'Alfred V. Aho et al.',            category: 'Compilers',               publisher: 'Pearson',              isbn: '978-0321486813', type: 'Book',    status: 'Checked Out', copies: 3, requiresPayment: false, price: 0,   description: '"Compilers: Principles, Techniques & Tools" is a Book resource in our library collection.', link: 'https://www.amazon.com/Compilers-Principles-Techniques-Tools-2nd/dp/0321486811' },
  // ── AI & ML ────────────────────────────────────────────────────────────────
  { id: 41,  title: 'Artificial Intelligence: A Modern Approach',  author: 'Stuart Russell & Peter Norvig',  category: 'Artificial Intelligence', publisher: 'Pearson',              isbn: '978-0134610993', type: 'Book',    status: 'Available',   copies: 3, requiresPayment: true,  price: 4.0, description: 'Artificial Intelligence: A Modern Approach explains core AI concepts such as search, logic, planning, and intelligent agents.',                                                                                          link: 'https://aima.cs.berkeley.edu/' },
  { id: 43,  title: 'Deep Learning',                              author: 'Ian Goodfellow et al.',           category: 'Deep Learning',           publisher: 'MIT Press',            isbn: '978-0262035613', type: 'Book',    status: 'Checked Out', copies: 3, requiresPayment: true,  price: 4.5, description: 'Deep Learning is a comprehensive textbook covering neural networks, optimization, convolutional networks, sequence modeling, and modern AI research.',                                                                  link: 'https://www.deeplearningbook.org/' },
  { id: 44,  title: 'Hands-On Machine Learning',                  author: 'Aurélien Géron',                  category: 'Machine Learning',        publisher: "O'Reilly Media",       isbn: '978-1492032632', type: 'Book',    status: 'Available',   copies: 3, requiresPayment: true,  price: 3.5, description: 'Hands-On Machine Learning provides practical guidance for building real AI models using Python, Scikit-Learn, and TensorFlow.',                                                                                         link: 'https://www.oreilly.com/library/view/hands-on-machine-learning/9781492032632/' },
  { id: 48,  title: 'Reinforcement Learning: An Introduction',    author: 'Richard S. Sutton & Andrew Barto',category: 'AI & Machine Learning',   publisher: 'MIT Press',            isbn: '978-0262039246', type: 'Book',    status: 'Available',   copies: 3, requiresPayment: true,  price: 3.0, description: 'Reinforcement Learning: An Introduction explains how machines learn by interacting with environments using rewards and penalties.',                                                                                      link: 'http://incompleteideas.net/book/the-book-2nd.html' },
  { id: 49,  title: 'Mathematics for Machine Learning',           author: 'Marc Peter Deisenroth et al.',    category: 'Mathematics',             publisher: 'Cambridge UP',         isbn: '978-1108470049', type: 'Book',    status: 'Available',   copies: 3, requiresPayment: true,  price: 3.5, description: 'Mathematics for Machine Learning covers essential math topics like linear algebra and probability for AI understanding.',                                                                                               link: 'https://mml-book.github.io/' },
  { id: 52,  title: 'Discrete Mathematics',                       author: 'Kenneth H. Rosen',                category: 'Mathematics',             publisher: 'McGraw-Hill',          isbn: '978-0072899054', type: 'Book',    status: 'Available',   copies: 3, requiresPayment: true,  price: 2.5, description: 'Discrete Mathematics introduces logic, sets, graphs, and proofs that form the foundation of computer science.',                                                                                                        link: 'https://www.amazon.com/Discrete-Mathematics-Applications-Kenneth-Rosen/dp/0072899050' },
  { id: 57,  title: 'Data Mining: Concepts and Techniques',       author: 'Jiawei Han et al.',               category: 'Data Mining',             publisher: 'Elsevier',             isbn: '978-0123814791', type: 'Book',    status: 'Available',   copies: 3, requiresPayment: true,  price: 3.0, description: 'Data Mining: Concepts and Techniques explains how to extract patterns and knowledge from large datasets.',                                                                                                             link: 'https://www.amazon.com/Data-Mining-Concepts-Techniques-Management/dp/0123814790' },
  { id: 59,  title: 'Designing Data-Intensive Applications',      author: 'Martin Kleppmann',                category: 'Databases',               publisher: "O'Reilly Media",       isbn: '978-1449373320', type: 'Book',    status: 'Available',   copies: 3, requiresPayment: true,  price: 4.0, description: 'Designing Data-Intensive Applications explores how modern systems handle storage, processing, and reliability at scale. Essential reading for backend engineers and system designers.',                                 link: 'https://dataintensive.net/' },
  // ── DevOps & Architecture ──────────────────────────────────────────────────
  { id: 61,  title: 'Domain-Driven Design',                       author: 'Eric Evans',                      category: 'Software Architecture',   publisher: 'Addison-Wesley',       isbn: '978-0321125217', type: 'Book',    status: 'Available',   copies: 3, requiresPayment: true,  price: 3.5, description: 'Domain-Driven Design focuses on structuring software based on real-world business logic and domain understanding.',                                                                                                    link: 'https://www.amazon.com/Domain-Driven-Design-Tackling-Complexity-Software/dp/0321125215' },
  { id: 62,  title: 'Microservices Patterns',                     author: 'Chris Richardson',                category: 'Microservices',           publisher: 'Manning',              isbn: '978-1617294549', type: 'Book',    status: 'Available',   copies: 3, requiresPayment: true,  price: 3.0, description: 'Microservices Patterns teaches how to design scalable distributed systems using independent services.',                                                                                                                link: 'https://microservices.io/book' },
  { id: 63,  title: 'Building Microservices',                     author: 'Sam Newman',                      category: 'Microservices',           publisher: "O'Reilly Media",       isbn: '978-1492034018', type: 'Book',    status: 'Available',   copies: 3, requiresPayment: true,  price: 3.5, description: 'Building Microservices explains how to create, deploy, and manage microservice-based applications.',                                                                                                                   link: 'https://www.oreilly.com/library/view/building-microservices-2nd/9781492034018/' },
  { id: 65,  title: 'Kubernetes in Action',                       author: 'Marko Lukša',                     category: 'DevOps',                  publisher: 'Manning',              isbn: '978-1617293726', type: 'Book',    status: 'Available',   copies: 3, requiresPayment: true,  price: 4.0, description: 'Kubernetes in Action teaches how to deploy and manage containerized applications in real-world systems.',                                                                                                               link: 'https://www.manning.com/books/kubernetes-in-action' },
  { id: 66,  title: 'The DevOps Handbook',                        author: 'Gene Kim et al.',                 category: 'DevOps',                  publisher: 'IT Revolution',        isbn: '978-1942788003', type: 'Book',    status: 'Available',   copies: 3, requiresPayment: true,  price: 3.0, description: 'The DevOps Handbook explains how to improve collaboration between development and operations teams for faster delivery.',                                                                                               link: 'https://itrevolution.com/product/the-devops-handbook/' },
  { id: 67,  title: 'Site Reliability Engineering',               author: 'Betsy Beyer et al.',              category: 'Site Reliability',        publisher: "O'Reilly Media",       isbn: '978-1491929124', type: 'Book',    status: 'Available',   copies: 3, requiresPayment: true,  price: 4.0, description: 'Site Reliability Engineering introduces how Google manages large-scale systems with reliability and automation.',                                                                                                      link: 'https://sre.google/sre-book/table-of-contents/' },
  { id: 69,  title: 'Test-Driven Development',                    author: 'Kent Beck',                       category: 'Testing',                 publisher: 'Addison-Wesley',       isbn: '978-0321146533', type: 'Book',    status: 'Available',   copies: 3, requiresPayment: true,  price: 2.5, description: 'Test-Driven Development teaches writing tests before code to improve software quality and reduce bugs.',                                                                                                               link: 'https://www.amazon.com/Test-Driven-Development-Kent-Beck/dp/0321146530' },
  { id: 72,  title: 'Code Complete',                              author: 'Steve McConnell',                 category: 'Software Engineering',    publisher: 'Microsoft Press',      isbn: '978-0735619678', type: 'Book',    status: 'Checked Out', copies: 3, requiresPayment: true,  price: 3.0, description: 'Code Complete is a guide to writing high-quality software with best practices for construction and design.',                                                                                                          link: 'https://www.amazon.com/Code-Complete-Practical-Handbook-Construction/dp/0735619670' },
  { id: 75,  title: 'Eloquent JavaScript',                        author: 'Marijn Haverbeke',                category: 'JavaScript',              publisher: 'No Starch Press',      isbn: '978-1593279509', type: 'Book',    status: 'Available',   copies: 3, requiresPayment: true,  price: 2.0, description: 'Eloquent JavaScript teaches modern JavaScript programming with clear explanations and practical exercises.',                                                                                                          link: 'https://eloquentjavascript.net/' },
  { id: 79,  title: 'Learning SQL',                               author: 'Alan Beaulieu',                   category: 'Databases',               publisher: "O'Reilly Media",       isbn: '978-1492057604', type: 'Book',    status: 'Available',   copies: 3, requiresPayment: true,  price: 2.5, description: 'Learning SQL teaches how to query, manage, and analyze data using relational databases.',                                                                                                                            link: 'https://www.oreilly.com/library/view/learning-sql-3rd/9781492057604/' },
  // ── Fiction & Literature ───────────────────────────────────────────────────
  { id: 101, title: 'The Hobbit',                                 author: 'J.R.R. Tolkien',                  category: 'Fantasy',                 publisher: 'Allen & Unwin',        isbn: '978-0547928227', type: 'Book',    status: 'Available',   copies: 3, requiresPayment: true,  price: 2.5, description: 'The Hobbit follows Bilbo Baggins on an unexpected journey with dwarves and Gandalf to reclaim treasure guarded by the dragon Smaug.',                                                                                link: 'https://www.amazon.com/dp/054792822X' },
  { id: 102, title: 'The Fellowship of the Ring',                 author: 'J.R.R. Tolkien',                  category: 'Fantasy',                 publisher: 'Allen & Unwin',        isbn: '978-0547928210', type: 'Book',    status: 'Available',   copies: 3, requiresPayment: false, price: 0,   description: '"The Fellowship of the Ring" is a Book resource in our library collection.',           link: 'https://www.amazon.com/dp/0547928211' },
  { id: 103, title: 'The Two Towers',                             author: 'J.R.R. Tolkien',                  category: 'Fantasy',                 publisher: 'Allen & Unwin',        isbn: '978-0547928203', type: 'Book',    status: 'Checked Out', copies: 3, requiresPayment: false, price: 0,   description: '"The Two Towers" is a Book resource in our library collection.',                       link: 'https://www.amazon.com/dp/0547928203' },
  { id: 104, title: 'The Return of the King',                     author: 'J.R.R. Tolkien',                  category: 'Fantasy',                 publisher: 'Allen & Unwin',        isbn: '978-0547928197', type: 'Book',    status: 'Available',   copies: 3, requiresPayment: false, price: 0,   description: '"The Return of the King" is a Book resource in our library collection.',               link: 'https://www.amazon.com/dp/054792819X' },
  { id: 105, title: 'Dune',                                       author: 'Frank Herbert',                   category: 'Science Fiction',         publisher: 'Chilton Books',        isbn: '978-0441172719', type: 'Book',    status: 'Available',   copies: 3, requiresPayment: true,  price: 3.0, description: 'Dune is set on the desert planet Arrakis, where politics, ecology, and prophecy collide. Paul Atreides must navigate betrayal and destiny in one of science fiction\'s most influential epics.',                    link: 'https://www.amazon.com/dp/0441172717' },
  { id: 106, title: 'The Hunger Games',                           author: 'Suzanne Collins',                 category: 'Young Adult',             publisher: 'Scholastic',           isbn: '978-0439023481', type: 'Book',    status: 'Checked Out', copies: 3, requiresPayment: true,  price: 2.0, description: 'The Hunger Games is set in Panem, where Katniss Everdeen volunteers for a televised fight to the death to save her sister.',                                                                                         link: 'https://www.amazon.com/dp/0439023483' },
  { id: 111, title: 'The Fault in Our Stars',                     author: 'John Green',                      category: 'Young Adult',             publisher: 'Dutton Books',         isbn: '978-0525478812', type: 'Book',    status: 'Available',   copies: 3, requiresPayment: false, price: 0,   description: '"The Fault in Our Stars" is a Book resource in our library collection.',               link: 'https://www.amazon.com/dp/014242417X' },
  { id: 116, title: 'The Shining',                                author: 'Stephen King',                    category: 'Horror',                  publisher: 'Doubleday',            isbn: '978-0307743657', type: 'Book',    status: 'Checked Out', copies: 3, requiresPayment: false, price: 0,   description: '"The Shining" is a Book resource in our library collection.',                          link: 'https://www.amazon.com/dp/0307743659' },
  { id: 117, title: 'It',                                         author: 'Stephen King',                    category: 'Horror',                  publisher: 'Viking Press',         isbn: '978-1501142970', type: 'Book',    status: 'Available',   copies: 3, requiresPayment: false, price: 0,   description: '"It" is a Book resource in our library collection.',                                   link: 'https://www.amazon.com/dp/1501142976' },
  // ── Self-Help & Biography ──────────────────────────────────────────────────
  { id: 121, title: 'The Alchemist',                              author: 'Paulo Coelho',                    category: 'Self-Help',               publisher: 'HarperOne',            isbn: '978-0061122415', type: 'Book',    status: 'Available',   copies: 3, requiresPayment: false, price: 0,   description: '"The Alchemist" is a Book resource in our library collection.',                        link: 'https://www.amazon.com/dp/0061122416' },
  { id: 123, title: 'Atomic Habits',                              author: 'James Clear',                     category: 'Self-Help',               publisher: 'Avery',                isbn: '978-0735211292', type: 'Book',    status: 'Checked Out', copies: 3, requiresPayment: true,  price: 2.0, description: 'Atomic Habits explains how small, consistent changes compound into remarkable results. James Clear offers practical strategies for building good habits and breaking bad ones.',                                       link: 'https://www.amazon.com/dp/0735211299' },
  { id: 125, title: 'Rich Dad Poor Dad',                          author: 'Robert Kiyosaki',                 category: 'Personal Finance',        publisher: 'Warner Books',         isbn: '978-1612680194', type: 'Book',    status: 'Available',   copies: 3, requiresPayment: false, price: 0,   description: '"Rich Dad Poor Dad" is a Book resource in our library collection.',                   link: 'https://www.amazon.com/dp/1612680194' },
  { id: 126, title: 'Steve Jobs',                                 author: 'Walter Isaacson',                 category: 'Biography',               publisher: 'Simon & Schuster',     isbn: '978-1451648539', type: 'Book',    status: 'Checked Out', copies: 3, requiresPayment: false, price: 0,   description: '"Steve Jobs" is a Book resource in our library collection.',                           link: 'https://www.amazon.com/dp/1451648537' },
  { id: 129, title: 'Becoming',                                   author: 'Michelle Obama',                  category: 'Biography',               publisher: 'Crown',                isbn: '978-1524763138', type: 'Book',    status: 'Available',   copies: 3, requiresPayment: false, price: 0,   description: '"Becoming" is a Book resource in our library collection.',                             link: 'https://www.amazon.com/dp/1524763136' },
  { id: 131, title: 'Sapiens',                                    author: 'Yuval Noah Harari',               category: 'History',                 publisher: 'Harper',               isbn: '978-0062316097', type: 'Book',    status: 'Available',   copies: 3, requiresPayment: true,  price: 2.5, description: 'Sapiens traces the history of humankind from the Cognitive Revolution to the present, exploring how biology and culture shaped societies, economies, and the world we live in today.',                               link: 'https://www.amazon.com/dp/0062316095' },
  { id: 136, title: 'The Psychology of Money',                    author: 'Morgan Housel',                   category: 'Personal Finance',        publisher: 'Harriman House',       isbn: '978-0857197689', type: 'Book',    status: 'Checked Out', copies: 3, requiresPayment: false, price: 0,   description: '"The Psychology of Money" is a Book resource in our library collection.',              link: 'https://www.amazon.com/dp/0857197681' },
  { id: 151, title: 'The Martian',                                author: 'Andy Weir',                       category: 'Science Fiction',         publisher: 'Crown',                isbn: '978-0553418026', type: 'Book',    status: 'Available',   copies: 3, requiresPayment: true,  price: 3.5, description: 'The Martian tells the story of astronaut Mark Watney, stranded on Mars and forced to survive using science, ingenuity, and humor while NASA races to bring him home.',                                              link: 'https://www.amazon.com/dp/0553418025' },
  { id: 163, title: 'The Kite Runner',                            author: 'Khaled Hosseini',                 category: 'Literary Fiction',        publisher: 'Riverhead Books',      isbn: '978-1594631931', type: 'Book',    status: 'Checked Out', copies: 3, requiresPayment: false, price: 0,   description: '"The Kite Runner" is a Book resource in our library collection.',                      link: 'https://www.amazon.com/' },
  { id: 171, title: 'Gone Girl',                                  author: 'Gillian Flynn',                   category: 'Mystery & Thriller',      publisher: 'Crown',                isbn: '978-0307588371', type: 'Book',    status: 'Available',   copies: 3, requiresPayment: false, price: 0,   description: '"Gone Girl" is a Book resource in our library collection.',                            link: 'https://www.amazon.com/' },
  { id: 175, title: 'The Silent Patient',                         author: 'Alex Michaelides',                category: 'Mystery & Thriller',      publisher: 'Celadon Books',        isbn: '978-1250301697', type: 'Book',    status: 'Available',   copies: 3, requiresPayment: false, price: 0,   description: '"The Silent Patient" is a Book resource in our library collection.',                   link: 'https://www.amazon.com/' },
  { id: 191, title: "Man's Search for Meaning",                   author: 'Viktor E. Frankl',                category: 'Self-Help',               publisher: 'Beacon Press',         isbn: '978-0807014295', type: 'Book',    status: 'Checked Out', copies: 3, requiresPayment: false, price: 0,   description: '"Man\'s Search for Meaning" is a Book resource in our library collection.',            link: 'https://www.amazon.com/' },
  { id: 192, title: 'The 7 Habits of Highly Effective People',   author: 'Stephen R. Covey',                category: 'Self-Help',               publisher: 'Free Press',           isbn: '978-1982137274', type: 'Book',    status: 'Available',   copies: 3, requiresPayment: false, price: 0,   description: '"The 7 Habits of Highly Effective People" is a Book resource in our library collection.', link: 'https://www.amazon.com/' },
  { id: 199, title: "The Subtle Art of Not Giving a F*ck",        author: 'Mark Manson',                     category: 'Self-Help',               publisher: 'HarperOne',            isbn: '978-0062457714', type: 'Book',    status: 'Available',   copies: 3, requiresPayment: false, price: 0,   description: '"The Subtle Art of Not Giving a F*ck" is a Book resource in our library collection.',  link: 'https://www.amazon.com/' },
  // ── Classics ───────────────────────────────────────────────────────────────
  { id: 201, title: 'The Odyssey',                                author: 'Homer',                           category: 'Classics',                publisher: 'Project Gutenberg',    isbn: '978-0000000201', type: 'Book',    status: 'Available',   copies: 3, requiresPayment: false, price: 0,   description: '"The Odyssey" is a Book resource in our library collection.',                          link: 'https://www.gutenberg.org/' },
  { id: 205, title: 'The Count of Monte Cristo',                  author: 'Alexandre Dumas',                 category: 'Classics',                publisher: 'Project Gutenberg',    isbn: '978-0000000205', type: 'Book',    status: 'Available',   copies: 3, requiresPayment: false, price: 0,   description: '"The Count of Monte Cristo" is a Book resource in our library collection.',             link: 'https://www.gutenberg.org/' },
  { id: 208, title: 'Crime and Punishment',                       author: 'Fyodor Dostoevsky',               category: 'Classics',                publisher: 'Project Gutenberg',    isbn: '978-0000000208', type: 'Book',    status: 'Available',   copies: 3, requiresPayment: false, price: 0,   description: '"Crime and Punishment" is a Book resource in our library collection.',                  link: 'https://www.gutenberg.org/' },
  { id: 216, title: 'Walden',                                     author: 'Henry David Thoreau',             category: 'Philosophy',              publisher: 'Project Gutenberg',    isbn: '978-0000000216', type: 'Book',    status: 'Available',   copies: 3, requiresPayment: false, price: 0,   description: '"Walden" is a Book resource in our library collection.',                               link: 'https://www.gutenberg.org/' },
];

// ── 4. Low-level helpers ───────────────────────────────────────────────────────

function read(key, fallback = null) {
  try {
    const raw = localStorage.getItem(key);
    return raw !== null ? JSON.parse(raw) : fallback;
  } catch {
    return fallback;
  }
}

function write(key, value) {
  localStorage.setItem(key, JSON.stringify(value));
}

// ── 5. Entity modules ─────────────────────────────────────────────────────────

const staff = {
  /** @returns {StaffAccount[]} */
  getAll() { return read(KEYS.STAFF, []); },

  /** @param {string} id @returns {StaffAccount|undefined} */
  getById(id) { return this.getAll().find(a => a.id === id); },

  /** @param {string} emailOrPhone @returns {StaffAccount|undefined} */
  getByCredential(emailOrPhone) {
    return this.getAll().find(a => a.email === emailOrPhone || a.phone === emailOrPhone);
  },

  /** Upsert — updates if id exists, inserts otherwise. @param {StaffAccount} account */
  save(account) {
    const all = this.getAll();
    const idx = all.findIndex(a => a.id === account.id);
    if (idx >= 0) all[idx] = { ...all[idx], ...account };
    else          all.push(account);
    write(KEYS.STAFF, all);
    db.audit.log({ action: idx >= 0 ? 'Staff Updated' : 'Staff Created', actor: 'System', details: `Account: ${account.email}` });
  },

  /** @param {string} id */
  delete(id) {
    const all = this.getAll().filter(a => a.id !== id);
    write(KEYS.STAFF, all);
    db.audit.log({ action: 'Staff Deleted', actor: 'System', details: `ID: ${id}` });
  },

  /** @param {string} id @param {string} newStatus */
  setStatus(id, newStatus) {
    this.save({ ...this.getById(id), status: newStatus });
  },
};

const members = {
  /** @returns {MemberAccount|null} */
  get() { return read(KEYS.MEMBER, null); },

  /** @param {MemberAccount} member */
  save(member) { write(KEYS.MEMBER, member); },

  clear() { localStorage.removeItem(KEYS.MEMBER); },
};

const books = {
  /** Returns full catalog from SEED_BOOKS (static — not stored in localStorage). */
  getAll() { return SEED_BOOKS; },

  /** @param {number} id @returns {Book|undefined} */
  getById(id) { return SEED_BOOKS.find(b => b.id === Number(id)); },

  /** @param {string} query */
  search(query) {
    const q = query.toLowerCase();
    return SEED_BOOKS.filter(b =>
      b.title.toLowerCase().includes(q) ||
      b.author.toLowerCase().includes(q) ||
      b.category.toLowerCase().includes(q)
    );
  },

  /** @param {string} category */
  byCategory(category) {
    return SEED_BOOKS.filter(b => b.category === category);
  },

  /** Unique category list. */
  categories() {
    return [...new Set(SEED_BOOKS.map(b => b.category))].sort();
  },
};

const circulation = {
  /** @returns {CirculationRecord[]} */
  getAll() { return read(KEYS.CIRCULATION, []); },

  /** @param {CirculationRecord[]} records */
  saveAll(records) { write(KEYS.CIRCULATION, records); },

  /** @param {CirculationRecord} record */
  add(record) {
    const all = this.getAll();
    all.push(record);
    this.saveAll(all);
    db.audit.log({ action: 'Book Borrowed', actor: record.user, details: `"${record.book}" due ${record.returnDate}` });
    return all;
  },

  /** @param {string} user */
  getByUser(user) { return this.getAll().filter(r => r.user === user); },

  /** @param {number} bookId */
  getActiveByBook(bookId) {
    return this.getAll().filter(r => r.bookId === bookId && ['Borrowed', 'Overdue'].includes(r.status));
  },

  /** Count of copies currently out for a book. @param {number} bookId */
  activeCopies(bookId) { return this.getActiveByBook(bookId).length; },

  /** Mark a record returned. @param {number} recordId */
  markReturned(recordId) {
    const all = this.getAll().map(r =>
      r.id === recordId
        ? { ...r, status: 'Returned', returnDate: new Date().toISOString().slice(0, 10) }
        : r
    );
    this.saveAll(all);
    const rec = all.find(r => r.id === recordId);
    if (rec) db.audit.log({ action: 'Book Returned', actor: rec.user, details: `"${rec.book}"` });
  },

  /** Auto-update Borrowed → Overdue for past-due records. */
  processOverdue() {
    const today = new Date(); today.setHours(0, 0, 0, 0);
    let changed = false;
    const all = this.getAll().map(r => {
      if (r.status !== 'Borrowed' || !r.returnDate) return r;
      const due = new Date(r.returnDate); due.setHours(0, 0, 0, 0);
      if (today > due) { changed = true; return { ...r, status: 'Overdue' }; }
      return r;
    });
    if (changed) this.saveAll(all);
    return all;
  },
};

const fines = {
  /** @returns {FineRecord[]} */
  getAll() { return read(KEYS.FINE_RECORDS, []); },

  /** @param {Omit<FineRecord,'id'|'createdAt'>} fine */
  add(fine) {
    const all = this.getAll();
    const record = { ...fine, id: Date.now(), status: 'Pending', createdAt: new Date().toISOString() };
    all.push(record);
    write(KEYS.FINE_RECORDS, all);
    db.audit.log({ action: 'Fine Issued', actor: 'System', details: `${fine.member} — ${fine.amount}` });
    return record;
  },

  /** @param {number} id @param {Partial<FineRecord>} updates */
  update(id, updates) {
    const all = this.getAll().map(f => f.id === id ? { ...f, ...updates } : f);
    write(KEYS.FINE_RECORDS, all);
  },

  /** @param {string} member */
  getByMember(member) { return this.getAll().filter(f => f.member === member); },

  totalPending() {
    return this.getAll()
      .filter(f => f.status === 'Pending')
      .reduce((sum, f) => sum + parseFloat(f.amount.replace('$', '') || 0), 0);
  },
};

const messages = {
  /** @returns {Message[]} */
  getAll() { return read(KEYS.MESSAGES, SEED_MESSAGES); },

  /** @param {Omit<Message,'id'|'createdAt'>} msg */
  add(msg) {
    const all = this.getAll();
    const record = { ...msg, id: Date.now(), read: false, createdAt: new Date().toISOString() };
    all.unshift(record);
    write(KEYS.MESSAGES, all);
    write(KEYS.UNREAD_COUNT, String(all.filter(m => !m.read).length));
    return record;
  },

  /** @param {number} id */
  markRead(id) {
    const all = this.getAll().map(m => m.id === id ? { ...m, read: true } : m);
    write(KEYS.MESSAGES, all);
    write(KEYS.UNREAD_COUNT, String(all.filter(m => !m.read).length));
  },

  markAllRead() {
    const all = this.getAll().map(m => ({ ...m, read: true }));
    write(KEYS.MESSAGES, all);
    write(KEYS.UNREAD_COUNT, '0');
  },

  unreadCount() { return this.getAll().filter(m => !m.read).length; },
};

const settings = {
  /** @returns {Setting[]} */
  getAll() { return read(KEYS.SETTINGS, SEED_SETTINGS); },

  /** @param {string} key @returns {string|null} */
  get(key) {
    return this.getAll().find(s => s.key === key)?.value ?? null;
  },

  /** @param {string} key @param {string} value */
  set(key, value) {
    const all = this.getAll();
    const idx = all.findIndex(s => s.key === key);
    const entry = { key, value, description: all[idx]?.description ?? '', updatedAt: new Date().toISOString() };
    if (idx >= 0) all[idx] = entry; else all.push(entry);
    write(KEYS.SETTINGS, all);
    db.audit.log({ action: 'Setting Changed', actor: 'Admin', details: `${key} = ${value}` });
  },

  /** Convenience getters parsed to the right type. */
  maxBorrowDays()      { return parseInt(this.get('max_borrow_days')      ?? '14',  10); },
  maxBooksPerMember()  { return parseInt(this.get('max_books_per_member') ?? '5',   10); },
  finePerDay()         { return parseFloat(this.get('fine_per_day')       ?? '0.25'); },
  renewalLimit()       { return parseInt(this.get('renewal_limit')        ?? '2',   10); },
  totalBookCopies()    { return parseInt(this.get('total_book_copies')    ?? '3',   10); },
};

const paidBooks = {
  /** @returns {number[]} */
  getAll() { return read(KEYS.PAID_BOOKS, []); },

  /** @param {number} bookId */
  isPaid(bookId) { return this.getAll().includes(Number(bookId)); },

  /** @param {number} bookId */
  markPaid(bookId) {
    const all = this.getAll();
    if (!all.includes(Number(bookId))) write(KEYS.PAID_BOOKS, [...all, Number(bookId)]);
  },
};

const auditLog = {
  /** @returns {AuditEntry[]} */
  getAll() { return read(KEYS.AUDIT_LOG, []); },

  /** @param {{ action: string, actor: string, details: string }} entry */
  log(entry) {
    const all = this.getAll();
    all.unshift({ ...entry, id: Date.now(), createdAt: new Date().toISOString() });
    // Keep last 500 entries
    write(KEYS.AUDIT_LOG, all.slice(0, 500));
  },

  /** @param {string} action */
  getByAction(action) { return this.getAll().filter(e => e.action === action); },
};

const session = {
  /** @returns {Object|null} */
  get() { return read(KEYS.SESSION, null); },

  /** @param {Object} user */
  set(user) { write(KEYS.SESSION, user); },

  clear() { localStorage.removeItem(KEYS.SESSION); },

  isLoggedIn() { return Boolean(this.get()); },
};

// ── 6. db — unified namespace ─────────────────────────────────────────────────

export const db = {
  staff,
  members,
  books,
  circulation,
  fines,
  messages,
  settings,
  paidBooks,
  auditLog,
  session,
};

// ── 7. initDatabase ───────────────────────────────────────────────────────────

/**
 * Seed all collections that need initial data.
 * Safe to call on every app start — only writes if data is missing.
 */
export function initDatabase() {
  // ── Staff accounts ────────────────────────────────────────────────────────
  // Strategy: always MERGE — never wipe user-added accounts.
  // 1. Start from what's stored (or empty on first run).
  // 2. Migrate super admin password if on an old default.
  // 3. Add any SEED_STAFF entry whose id/email isn't in the list yet
  //    (covers new mock accounts added to SEED_STAFF after first run).
  // 4. User-created accounts (different ids/emails) are never touched.
  const storedStaff = read(KEYS.STAFF, null) || [];
  const superAdmin   = SEED_STAFF[0];
  const OLD_PASSWORDS = ['super123'];
  let accounts = storedStaff;
  let changed  = !storedStaff.length; // force write on very first run

  // Migrate super admin if still on an old default password
  accounts = accounts.map(a => {
    const isSA = a.id === superAdmin.id || a.email === superAdmin.email;
    if (isSA && OLD_PASSWORDS.includes(a.password)) {
      changed = true;
      return { ...superAdmin, ...a, password: superAdmin.password, fullName: superAdmin.fullName };
    }
    return a;
  });

  // Merge any SEED_STAFF entry that doesn't exist yet
  // (safe: user-created accounts always have different ids and emails)
  for (const seed of SEED_STAFF) {
    const exists = accounts.some(a => a.id === seed.id || a.email === seed.email);
    if (!exists) {
      accounts.push(seed);
      changed = true;
    }
  }

  if (changed) write(KEYS.STAFF, accounts);

  // Settings — seed if not present
  if (!read(KEYS.SETTINGS, null)) {
    write(KEYS.SETTINGS, SEED_SETTINGS);
  }

  // Circulation — seed realistic records if empty
  if (!read(KEYS.CIRCULATION, null)) {
    write(KEYS.CIRCULATION, SEED_CIRCULATION);
  }

  // Fines — seed realistic records if empty
  if (!read(KEYS.FINE_RECORDS, null)) {
    write(KEYS.FINE_RECORDS, SEED_FINES);
  }

  // Audit log — seed if empty
  if (!read(KEYS.AUDIT_LOG, null)) {
    write(KEYS.AUDIT_LOG, SEED_AUDIT_LOG);
  }

  // Member notifications — use richer seed
  if (!read(KEYS.MESSAGES, null)) {
    write(KEYS.MESSAGES, SEED_MEMBER_MESSAGES);
    const unread = SEED_MEMBER_MESSAGES.filter(m => !m.read).length;
    write(KEYS.UNREAD_COUNT, String(unread));
  }

  // Staff messages (super admin inbox) — seed if empty
  const STAFF_MSG_KEY = 'staffMessages';
  if (!localStorage.getItem(STAFF_MSG_KEY)) {
    localStorage.setItem(STAFF_MSG_KEY, JSON.stringify(SEED_STAFF_MESSAGES));
  }

  // Paid books
  if (!read(KEYS.PAID_BOOKS, null)) write(KEYS.PAID_BOOKS, []);
}

/**
 * Wipe all library data from localStorage and re-seed defaults.
 * Use only in development / testing.
 */
export function resetDatabase() {
  Object.values(KEYS).forEach(key => localStorage.removeItem(key));
  initDatabase();
  console.info('[DB] Database reset to defaults.');
}
