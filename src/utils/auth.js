export const ROLES = {
  SUPER_ADMIN:   "super_admin",
  ADMINISTRATOR: "administrator",
  LIBRARIAN:     "librarian",
  MEMBER:        "member",   // stored value is "member"; displayed as "User" everywhere
};

export const ROLE_OPTIONS = [
  { value: ROLES.MEMBER,        label: "User",          description: "Students, researchers, teachers, and public users" },
  { value: ROLES.LIBRARIAN,     label: "Librarian",     description: "Cataloging, issuing, returns, fines, and member accounts" },
  { value: ROLES.ADMINISTRATOR, label: "Administrator", description: "Policies, budget, reporting, and system optimization" },
  { value: ROLES.SUPER_ADMIN,   label: "Super Admin",   description: "Full system oversight and admin management" },
];

export const ROLE_LABELS = {
  [ROLES.SUPER_ADMIN]:   "Super Admin",
  [ROLES.ADMINISTRATOR]: "Administrator",
  [ROLES.LIBRARIAN]:     "Librarian",
  [ROLES.MEMBER]:        "User",
};

const STAFF_STORAGE_KEY = "libraryStaffAccounts";
const SESSION_KEY = "currentSession";

export const SUPER_ADMIN_ACCOUNT = {
  id:       "staff-1",
  email:    "superadmin@library.com",
  phone:    "1000000001",
  password: "Admin@123",
  role:     ROLES.SUPER_ADMIN,
  fullName: "Super Administrator",
  userId:   "STAFF-1",
  status:   "Active",
};

export const DEFAULT_STAFF_ACCOUNTS = [
  SUPER_ADMIN_ACCOUNT,
  { id: "staff-2", email: "admin@library.com",     phone: "1000000002", password: "admin123", role: ROLES.ADMINISTRATOR, fullName: "Library Administrator", userId: "STAFF-2", status: "Active" },
  { id: "staff-3", email: "librarian@library.com", phone: "1000000003", password: "lib123",   role: ROLES.LIBRARIAN,     fullName: "Head Librarian",         userId: "STAFF-3", status: "Active" },
];

const OLD_SUPER_ADMIN_DEFAULTS = ["super123"];

export function initStaffAccounts() {
  const raw = localStorage.getItem(STAFF_STORAGE_KEY);
  if (!raw) {
    localStorage.setItem(STAFF_STORAGE_KEY, JSON.stringify(DEFAULT_STAFF_ACCOUNTS));
    return;
  }

  let accounts = JSON.parse(raw);
  let changed = false;

  // Migrate super admin if still on an old default password → update to canonical credentials
  accounts = accounts.map(a => {
    const isSuperAdmin = a.id === SUPER_ADMIN_ACCOUNT.id || a.email === SUPER_ADMIN_ACCOUNT.email;
    if (isSuperAdmin && OLD_SUPER_ADMIN_DEFAULTS.includes(a.password)) {
      changed = true;
      return { ...SUPER_ADMIN_ACCOUNT, ...a, password: SUPER_ADMIN_ACCOUNT.password, fullName: SUPER_ADMIN_ACCOUNT.fullName };
    }
    return a;
  });

  // Guarantee the super admin always exists — cannot be permanently removed
  const hasSuperAdmin = accounts.some(
    a => a.id === SUPER_ADMIN_ACCOUNT.id || a.email === SUPER_ADMIN_ACCOUNT.email
  );
  if (!hasSuperAdmin) {
    accounts.unshift(SUPER_ADMIN_ACCOUNT);
    changed = true;
  }

  if (changed) {
    localStorage.setItem(STAFF_STORAGE_KEY, JSON.stringify(accounts));
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

export function login(memberId, password) {
  initStaffAccounts();

  // ── 1. Staff accounts first (includes admin-created members with role='member') ──
  // Checking staff BEFORE userAccount ensures admin-set passwords and suspended
  // status always take effect — userAccount could have an older stale password.
  const staff = getStaffAccounts().find(
    (account) =>
      (account.email === memberId || account.phone === memberId) &&
      account.password === password
  );

  if (staff) {
    if (staff.status === "Suspended") {
      return { success: false, message: "Your account has been suspended. Please contact the library administrator." };
    }

    const session = {
      id:       staff.id,
      fullName: staff.fullName,
      email:    staff.email,
      phone:    staff.phone || "",
      role:     staff.role,
      userId:   staff.userId || staff.id.toUpperCase(),
      status:   "Active",
      loginAt:  new Date().toISOString(),
    };
    setSession(session);

    // Sync userAccount so member pages (Profile, Catalog, etc.) work without changes.
    if (staff.role === ROLES.MEMBER) {
      localStorage.setItem("userAccount", JSON.stringify({
        username: staff.fullName,
        fullName: staff.fullName,
        email:    staff.email,
        phone:    staff.phone || "",
        password: staff.password,
        role:     ROLES.MEMBER,
      }));
    }

    return { success: true, user: session, redirect: getDashboardPath(staff.role) };
  }

  // ── 2. Fall back to self-registered member account ────────────────────────────
  const savedAccount = JSON.parse(localStorage.getItem("userAccount") || "null");
  if (
    savedAccount &&
    (savedAccount.email === memberId || savedAccount.phone === memberId) &&
    savedAccount.password === password
  ) {
    if (savedAccount.status === "Suspended") {
      return { success: false, message: "Your account has been suspended. Please contact the library administrator." };
    }
    const session = { ...savedAccount, role: ROLES.MEMBER, loginAt: new Date().toISOString() };
    setSession(session);
    return { success: true, user: session, redirect: getDashboardPath(ROLES.MEMBER) };
  }

  return { success: false, message: "Invalid email/phone or password. Please check your credentials." };
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
        { label: "Accounts",      path: "/superadmin/users",         pageTitle: "Account Management"  },
        { label: "Catalog",       path: "/superadmin/catalog",       pageTitle: "Books & Catalog"     },
        { label: "Reports",       path: "/superadmin/reports",       pageTitle: "Reports & Analytics" },
        { label: "Budget",        path: "/superadmin/budget",        pageTitle: "Budget Management"   },
        { label: "Inbox",         path: "/superadmin/notifications", pageTitle: "Staff Inbox"         },
        { label: "Settings",      path: "/superadmin/settings",      pageTitle: "System Settings"     },
      ];
    case ROLES.ADMINISTRATOR:
      return [
        ...base,
        { label: "Budget",        path: "/admin/budget",             pageTitle: "Budget Management"   },
        { label: "Reports",       path: "/admin/reports",            pageTitle: "Reports & Analytics" },
        { label: "Books",         path: "/admin/books",              pageTitle: "Book Management"     },
        { label: "Notifications", path: "/admin/notifications",      pageTitle: "Notifications Center"},
        { label: "Messages",      path: "/admin/messages",           pageTitle: "Message Super Admin" },
        { label: "Settings",      path: "/admin/settings",           pageTitle: "Settings"            },
      ];
    case ROLES.LIBRARIAN:
      return [
        ...base,
        { label: "Catalog",       path: "/librarian/catalog",        pageTitle: "Catalog & Checkout" },
        { label: "Members",       path: "/librarian/members",        pageTitle: "Member Management"  },
        { label: "Fines",         path: "/librarian/fines",          pageTitle: "Fines Management"   },
        { label: "Messages",      path: "/librarian/messages",       pageTitle: "Message Super Admin"},
        { label: "Settings",      path: "/librarian/settings",       pageTitle: "Settings"           },
      ];
    default:
      return base;
  }
}
