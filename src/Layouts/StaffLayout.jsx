import React from "react";
import { Link, Outlet, useLocation, useNavigate } from "react-router-dom";
import {
  getSession,
  getRoleLabel,
  getNavItems,
  logout,
} from "../utils/auth";

export default function StaffLayout() {
  const location = useLocation();
  const navigate = useNavigate();
  const session = getSession();

  if (!session) return null;

  const navItems = getNavItems(session.role);

  const handleLogout = () => {
    logout();
    navigate("/signin");
  };

  return (
    <div style={styles.container}>
      <aside style={styles.sidebar}>
        <div style={styles.profileArea}>
          <div style={styles.avatar}>👤</div>
          <div style={styles.adminEmail}>{session.email || session.fullName}</div>
          <div style={styles.adminRole}>{getRoleLabel(session.role)}</div>
        </div>
        <nav style={styles.nav}>
          {navItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              style={{
                ...styles.navLink,
                ...(location.pathname === item.path ? styles.navLinkActive : {}),
              }}
            >
              {item.label}
            </Link>
          ))}
          <button type="button" onClick={handleLogout} style={styles.logoutBtn}>
            Log out
          </button>
        </nav>
      </aside>
      <main style={styles.main}>
        <header style={styles.topbar}>
          <span style={styles.welcomeText}>
            Welcome back, {session.fullName || getRoleLabel(session.role)}
          </span>
          <div style={styles.searchWrap}>
            <input type="text" placeholder="Search..." style={styles.topSearch} />
          </div>
        </header>
        <div style={styles.content}>
          <Outlet />
        </div>
      </main>
    </div>
  );
}

const styles = {
  container: {
    display: "flex",
    minHeight: "100vh",
    backgroundColor: "#f4f6f9",
    fontFamily: "system-ui, sans-serif",
  },
  sidebar: {
    width: "260px",
    backgroundColor: "#1e2229",
    color: "#fff",
    padding: "24px 16px",
    display: "flex",
    flexDirection: "column",
    gap: "30px",
  },
  profileArea: {
    textAlign: "center",
    borderBottom: "1px solid #323945",
    paddingBottom: "20px",
  },
  avatar: { fontSize: "40px", marginBottom: "8px" },
  adminEmail: { fontSize: "14px", color: "#cbd5e1", fontWeight: "500" },
  adminRole: { fontSize: "12px", color: "#94a3b8", marginTop: "4px" },
  nav: { display: "flex", flexDirection: "column", gap: "8px" },
  navLink: {
    color: "#cbd5e1",
    textDecoration: "none",
    padding: "12px",
    borderRadius: "6px",
    fontSize: "15px",
    fontWeight: "500",
    transition: "background 0.2s",
  },
  navLinkActive: {
    backgroundColor: "#323945",
    color: "#00ccff",
  },
  logoutBtn: {
    color: "#ef4444",
    backgroundColor: "transparent",
    border: "none",
    padding: "12px",
    borderRadius: "6px",
    fontSize: "15px",
    fontWeight: "500",
    marginTop: "40px",
    display: "block",
    textAlign: "left",
    cursor: "pointer",
    width: "100%",
  },
  main: { flex: 1, display: "flex", flexDirection: "column" },
  topbar: {
    height: "70px",
    backgroundColor: "#fff",
    borderBottom: "1px solid #e2e8f0",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "0 30px",
  },
  welcomeText: { fontSize: "18px", fontWeight: "600", color: "#1e293b" },
  topSearch: {
    padding: "8px 16px",
    borderRadius: "6px",
    border: "1px solid #cbd5e1",
    outline: "none",
    width: "220px",
  },
  content: { padding: "30px", flex: 1, overflowY: "auto" },
};
