export const ROLES = {
  SUPER_ADMIN: "super_admin",
  ADMINISTRATOR: "administrator",
  LIBRARIAN: "librarian",
  MEMBER: "member",
};

export const ROLE_OPTIONS = [
  { value: ROLES.MEMBER,        label: "Member",         description: "Students, researchers, teachers, and public users" },
  { value: ROLES.LIBRARIAN,     label: "Librarian",      description: "Cataloging, issuing, returns, fines, and member accounts" },
  { value: ROLES.ADMINISTRATOR, label: "Administrator",  description: "Policies, budget, reporting, and system optimization" },
  { value: ROLES.SUPER_ADMIN,   label: "Super Admin",    description: "Full system oversight and admin management" },
];

export const ROLE_LABELS = {
  [ROLES.SUPER_ADMIN]:   "Super Admin",
  [ROLES.ADMINISTRATOR]: "Administrator",
  [ROLES.LIBRARIAN]:     "Librarian",
  [ROLES.MEMBER]:        "Library Member",
};

const STAFF_STORAGE_KEY = "libraryStaffAccounts";
const SESSION_KEY = "currentSession";

export const DEFAULT_STAFF_ACCOUNTS = [
  { id: "staff-1", email: "superadmin@library.com", phone: "1000000001", password: "super123", role: ROLES.SUPER_ADMIN,   fullName: "Super Admin" },
  { id: "staff-2", email: "admin@library.com",      phone: "1000000002", password: "admin123", role: ROLES.ADMINISTRATOR, fullName: "Library Administrator" },
  { id: "staff-3", email: "librarian@library.com",  phone: "1000000003", password: "lib123",   role: ROLES.LIBRARIAN,     fullName: "Head Librarian" },
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
    case ROLES.SUPER_ADMIN:   return "/superadmin";
    case ROLES.ADMINISTRATOR: return "/admin";
    case ROLES.LIBRARIAN:     return "/librarian";
    case ROLES.MEMBER:
    default:                  return "/user";
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
];

export function getNavItems(role) {
  const base = [{ label: "Dashboard", path: getDashboardPath(role), pageTitle: `${getRoleLabel(role)} Dashboard` }];

  switch (role) {
    case ROLES.SUPER_ADMIN:
      return [
        ...base,
        { label: "Users",         path: "/superadmin/users",         pageTitle: "User Management" },
        { label: "Admins",        path: "/superadmin/admins",        pageTitle: "Admin Management" },
        { label: "Books",         path: "/superadmin/books",         pageTitle: "Book Management" },
        { label: "Notifications", path: "/superadmin/notifications", pageTitle: "Notifications Center" },
      ];
    case ROLES.ADMINISTRATOR:
      return [
        ...base,
        { label: "Policies",      path: "/admin/policies",           pageTitle: "Policy Management" },
        { label: "Budget",        path: "/admin/budget",             pageTitle: "Budget Management" },
        { label: "Reports",       path: "/admin/reports",            pageTitle: "Reports & Analytics" },
        { label: "Books",         path: "/admin/books",              pageTitle: "Book Management" },
        { label: "Notifications", path: "/admin/notifications",      pageTitle: "Notifications Center" },
      ];
    case ROLES.LIBRARIAN:
      return [
        ...base,
        { label: "Catalog", path: "/librarian/catalog", pageTitle: "Catalog & Checkout" },
        { label: "Members", path: "/librarian/members", pageTitle: "Member Management" },
        { label: "Fines",   path: "/librarian/fines",   pageTitle: "Fines Management" },
      ];
    default:
      return base;
  }
}
