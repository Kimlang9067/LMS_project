export const ROLES = {
  SUPER_ADMIN: "super_admin",
  ADMINISTRATOR: "administrator",
  LIBRARIAN: "librarian",
  MEMBER: "member",
  IT_STAFF: "it_staff",
  DEVELOPER: "developer",
  BOOK_SUPPLIER: "book_supplier",
  INSTITUTION: "institution",
  COMMUNITY: "community",
};

export const ROLE_OPTIONS = [
  { value: ROLES.MEMBER, label: "Member / Patron", description: "Students, researchers, teachers, and public users" },
  { value: ROLES.ADMINISTRATOR, label: "Administrator", description: "Policies, budget, reporting, and system optimization" },
  { value: ROLES.SUPER_ADMIN, label: "Super Admin", description: "Full system oversight and admin management" },
  { value: ROLES.LIBRARIAN, label: "Librarian", description: "Cataloging, issuing, returns, fines, and member accounts" },
  { value: ROLES.IT_STAFF, label: "IT Staff", description: "Hardware, software, database, backups, and security" },
  { value: ROLES.DEVELOPER, label: "Developer", description: "System updates and troubleshooting" },
  { value: ROLES.BOOK_SUPPLIER, label: "Book Supplier", description: "Provide books and e-books for the library" },
  { value: ROLES.INSTITUTION, label: "Educational Institution", description: "Funding and operational standards oversight" },
  { value: ROLES.COMMUNITY, label: "Community Member", description: "Public access and community resources" },
];

export const ROLE_LABELS = {
  [ROLES.SUPER_ADMIN]: "Super Admin",
  [ROLES.ADMINISTRATOR]: "Administrator",
  [ROLES.LIBRARIAN]: "Librarian",
  [ROLES.MEMBER]: "Library Member",
  [ROLES.IT_STAFF]: "IT Staff",
  [ROLES.DEVELOPER]: "Developer",
  [ROLES.BOOK_SUPPLIER]: "Book Supplier",
  [ROLES.INSTITUTION]: "Institution",
  [ROLES.COMMUNITY]: "Community Member",
};

const STAFF_STORAGE_KEY = "libraryStaffAccounts";
const SESSION_KEY = "currentSession";

export const DEFAULT_STAFF_ACCOUNTS = [
  { id: "staff-1", email: "superadmin@library.com", phone: "1000000001", password: "super123", role: ROLES.SUPER_ADMIN, fullName: "Super Admin" },
  { id: "staff-2", email: "admin@library.com", phone: "1000000002", password: "admin123", role: ROLES.ADMINISTRATOR, fullName: "Library Administrator" },
  { id: "staff-3", email: "librarian@library.com", phone: "1000000003", password: "lib123", role: ROLES.LIBRARIAN, fullName: "Head Librarian" },
  { id: "staff-4", email: "it@library.com", phone: "1000000004", password: "it123", role: ROLES.IT_STAFF, fullName: "IT System Admin" },
  { id: "staff-5", email: "developer@library.com", phone: "1000000005", password: "dev123", role: ROLES.DEVELOPER, fullName: "Lead Developer" },
  { id: "staff-6", email: "supplier@library.com", phone: "1000000006", password: "supply123", role: ROLES.BOOK_SUPPLIER, fullName: "Book Supplier Co." },
  { id: "staff-7", email: "institution@library.com", phone: "1000000007", password: "edu123", role: ROLES.INSTITUTION, fullName: "University Board" },
  { id: "staff-8", email: "community@library.com", phone: "1000000008", password: "community123", role: ROLES.COMMUNITY, fullName: "Community Liaison" },
];

export function initStaffAccounts() {
  if (!localStorage.getItem(STAFF_STORAGE_KEY)) {
    localStorage.setItem(STAFF_STORAGE_KEY, JSON.stringify(DEFAULT_STAFF_ACCOUNTS));
  }
}

export function getStaffAccounts() {
  initStaffAccounts();
  return JSON.parse(localStorage.getItem(STAFF_STORAGE_KEY));
}

export function getSession() {
  const raw = localStorage.getItem(SESSION_KEY);
  return raw ? JSON.parse(raw) : null;
}

export function setSession(user) {
  localStorage.setItem(SESSION_KEY, JSON.stringify(user));
}

export function clearSession() {
  localStorage.removeItem(SESSION_KEY);
}

export function getCurrentUser() {
  const session = getSession();
  if (session) return session;

  const memberRaw = localStorage.getItem("userAccount");
  if (memberRaw) {
    return { ...JSON.parse(memberRaw), role: ROLES.MEMBER };
  }
  return null;
}

export function isLoggedIn() {
  return Boolean(getSession());
}

export function getRoleLabel(role) {
  return ROLE_LABELS[role] || "User";
}

export function getDashboardPath(role) {
  switch (role) {
    case ROLES.SUPER_ADMIN:
      return "/superadmin";
    case ROLES.ADMINISTRATOR:
      return "/admin";
    case ROLES.LIBRARIAN:
      return "/librarian";
    case ROLES.IT_STAFF:
      return "/it-staff";
    case ROLES.DEVELOPER:
      return "/developer";
    case ROLES.BOOK_SUPPLIER:
      return "/supplier";
    case ROLES.INSTITUTION:
      return "/institution";
    case ROLES.COMMUNITY:
      return "/community";
    case ROLES.MEMBER:
    default:
      return "/userdashboard";
  }
}

export function login(memberId, password, selectedRole) {
  initStaffAccounts();

  if (selectedRole === ROLES.MEMBER) {
    const savedAccount = JSON.parse(localStorage.getItem("userAccount") || "null");
    if (!savedAccount) {
      return { success: false, message: "No member account found. Please register first." };
    }
    if (savedAccount.email !== memberId && savedAccount.phone !== memberId) {
      return { success: false, message: "Invalid email or phone number." };
    }
    if (savedAccount.password && savedAccount.password !== password) {
      return { success: false, message: "Invalid password." };
    }
    const session = { ...savedAccount, role: ROLES.MEMBER, loginAt: new Date().toISOString() };
    setSession(session);
    return { success: true, user: session, redirect: getDashboardPath(ROLES.MEMBER) };
  }

  const staff = getStaffAccounts().find(
    (account) =>
      account.role === selectedRole &&
      (account.email === memberId || account.phone === memberId) &&
      account.password === password
  );

  if (!staff) {
    return { success: false, message: `Invalid credentials for ${getRoleLabel(selectedRole)}.` };
  }

  const session = {
    id: staff.id,
    fullName: staff.fullName,
    email: staff.email,
    phone: staff.phone,
    role: staff.role,
    userId: staff.id.toUpperCase(),
    status: "Active",
    loginAt: new Date().toISOString(),
  };
  setSession(session);
  return { success: true, user: session, redirect: getDashboardPath(staff.role) };
}

export function logout() {
  clearSession();
}

export function hasRole(...roles) {
  const user = getCurrentUser();
  return user ? roles.includes(user.role) : false;
}

export const STAFF_ROLES = [
  ROLES.SUPER_ADMIN,
  ROLES.ADMINISTRATOR,
  ROLES.LIBRARIAN,
  ROLES.IT_STAFF,
  ROLES.DEVELOPER,
  ROLES.BOOK_SUPPLIER,
  ROLES.INSTITUTION,
  ROLES.COMMUNITY,
];

export function getNavItems(role) {
  const base = [{ label: "Dashboard", path: getDashboardPath(role) }];

  switch (role) {
    case ROLES.SUPER_ADMIN:
      return [
        ...base,
        { label: "Users", path: "/superadmin/users" },
        { label: "Admins", path: "/superadmin/admins" },
        { label: "Books", path: "/superadmin/books" },
        { label: "Notifications", path: "/superadmin/notifications" },
      ];
    case ROLES.ADMINISTRATOR:
      return [
        ...base,
        { label: "Policies", path: "/admin/policies" },
        { label: "Budget", path: "/admin/budget" },
        { label: "Reports", path: "/admin/reports" },
        { label: "Books", path: "/admin/books" },
        { label: "Notifications", path: "/admin/notifications" },
      ];
    case ROLES.LIBRARIAN:
      return [
        ...base,
        { label: "Catalog", path: "/catalog" },
        { label: "Circulation", path: "/circulation" },
        { label: "Members", path: "/librarian/members" },
        { label: "Fines", path: "/librarian/fines" },
      ];
    case ROLES.IT_STAFF:
      return [
        ...base,
        { label: "System Health", path: "/it-staff/health" },
        { label: "Backups", path: "/it-staff/backups" },
        { label: "Security", path: "/it-staff/security" },
      ];
    case ROLES.DEVELOPER:
      return [
        ...base,
        { label: "Updates", path: "/developer/updates" },
        { label: "Troubleshooting", path: "/developer/support" },
        { label: "System Logs", path: "/developer/logs" },
      ];
    case ROLES.BOOK_SUPPLIER:
      return [
        ...base,
        { label: "Submit Materials", path: "/supplier/materials" },
        { label: "Orders", path: "/supplier/orders" },
      ];
    case ROLES.INSTITUTION:
      return [
        ...base,
        { label: "Funding", path: "/institution/funding" },
        { label: "Standards", path: "/institution/standards" },
        { label: "Reports", path: "/institution/reports" },
      ];
    case ROLES.COMMUNITY:
      return [
        ...base,
        { label: "Public Catalog", path: "/catalog" },
        { label: "Outreach", path: "/community/outreach" },
      ];
    default:
      return base;
  }
}
