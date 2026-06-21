import React from 'react';
import { Outlet, Link, useLocation } from 'react-router';

export default function DashboardLayout() {
  const location = useLocation();
  const isAdmin = location.pathname.includes('/admin');
  const email = isAdmin ? 'admin@company.com' : 'superadmin@company.com';
  const roleLabel = isAdmin ? 'Admin' : 'Super Admin';

  return (
    <div style={styles.container}>
      <aside style={styles.sidebar}>
        <div style={styles.profileArea}>
          <div style={styles.avatar}>👤</div>
          <div style={styles.adminEmail}>{email}</div>
          <div style={styles.adminRole}>{roleLabel}</div>
        </div>
        <nav style={styles.nav}>
          <Link to={isAdmin ? "/admin" : "/superadmin"} style={styles.navLink}>Dashboard</Link>
          <Link to={isAdmin ? "/admin/users" : "/superadmin/users"} style={styles.navLink}>Users</Link>
          {!isAdmin && <Link to="/superadmin/admins" style={styles.navLink}>Admins</Link>}
          <Link to={isAdmin ? "/admin/books" : "/superadmin/books"} style={styles.navLink}>Books</Link>
          <Link to={isAdmin ? "/admin/notifications" : "/superadmin/notifications"} style={styles.navLink}>Notification</Link>
          <Link to="/" style={styles.logoutBtn}>Log out</Link>
        </nav>
      </aside>
      <main style={styles.main}>
        <header style={styles.topbar}>
          <span style={styles.welcomeText}>Welcome back, {roleLabel}</span>
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
  container: { display: 'flex', minHeight: '100vh', backgroundColor: '#f4f6f9', fontFamily: 'system-ui, sans-serif' },
  sidebar: { width: '260px', backgroundColor: '#1e2229', color: '#fff', padding: '24px 16px', display: 'flex', flexDirection: 'column', gap: '30px' },
  profileArea: { textAlign: 'center', borderBottom: '1px solid #323945', paddingBottom: '20px' },
  avatar: { fontSize: '40px', marginBottom: '8px' },
  adminEmail: { fontSize: '14px', color: '#cbd5e1', fontWeight: '500' },
  adminRole: { fontSize: '12px', color: '#94a3b8', marginTop: '4px' },
  nav: { display: 'flex', flexDirection: 'column', gap: '8px' },
  navLink: { color: '#00ccff', textDecoration: 'none', padding: '12px', borderRadius: '6px', fontSize: '15px', fontWeight: '500', transition: 'background 0.2s' },
  logoutBtn: { color: '#ef4444', textDecoration: 'none', padding: '12px', borderRadius: '6px', fontSize: '15px', fontWeight: '500', marginTop: '40px', display: 'block' },
  main: { flex: 1, display: 'flex', flexDirection: 'column' },
  topbar: { height: '70px', backgroundColor: '#fff', borderBottom: '1px solid #e2e8f0', display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0 30px' },
  welcomeText: { fontSize: '18px', fontWeight: '600', color: '#1e293b' },
  topSearch: { padding: '8px 16px', borderRadius: '6px', border: '1px solid #cbd5e1', outline: 'none', width: '220px' },
  content: { padding: '30px', flex: 1, overflowY: 'auto' }
};
