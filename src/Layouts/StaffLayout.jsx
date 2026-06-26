import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router';
import { getSession, getRoleLabel, getNavItems, logout, getDashboardPath, ROLES } from '../utils/auth';
import AppLayout from '../components/shared/AppLayout';
import { getSuperAdminUnreadCount } from '../utils/staffMessages';

export default function StaffLayout() {
  const navigate = useNavigate();

  // Reactive session — updates when profile is saved without a page reload
  const [session, setSessionState] = useState(() => getSession());

  const [notifVisible, setNotifVisible] = useState(false);
  const avatarKey = session?.id ? `staffAvatar_${session.id}` : null;
  const [avatarSrc, setAvatarSrc] = useState(() => avatarKey ? localStorage.getItem(avatarKey) : null);
  const isSuperAdmin = session?.role === ROLES.SUPER_ADMIN;
  const [unreadMsgs, setUnreadMsgs] = useState(() => isSuperAdmin ? getSuperAdminUnreadCount() : 0);

  // Refresh display name / role when staff saves their profile
  useEffect(() => {
    const onProfileUpdated = () => setSessionState(getSession());
    window.addEventListener('profileUpdated', onProfileUpdated);
    return () => window.removeEventListener('profileUpdated', onProfileUpdated);
  }, []);

  useEffect(() => {
    if (session?.loginAt) {
      const seen = sessionStorage.getItem('staffNotifLoginAt');
      if (seen !== session.loginAt) {
        setNotifVisible(true);
        sessionStorage.setItem('staffNotifLoginAt', session.loginAt);
      }
    }
  }, [session?.loginAt]);

  useEffect(() => {
    const refresh = () => setAvatarSrc(avatarKey ? localStorage.getItem(avatarKey) : null);
    window.addEventListener('avatarUpdated', refresh);
    return () => window.removeEventListener('avatarUpdated', refresh);
  }, [avatarKey]);

  useEffect(() => {
    if (!isSuperAdmin) return;
    const refresh = () => setUnreadMsgs(getSuperAdminUnreadCount());
    window.addEventListener('staffMessagesUpdated', refresh);
    return () => window.removeEventListener('staffMessagesUpdated', refresh);
  }, [isSuperAdmin]);

  if (!session) return null;

  const navItems    = getNavItems(session.role);
  const profilePath = `${getDashboardPath(session.role)}/profile`;

  const inboxPath = `${getDashboardPath(session.role)}/notifications`;

  return (
    <AppLayout
      navItems={navItems}
      profilePath={profilePath}
      portalLabel={`${getRoleLabel(session.role)} Portal`}
      displayName={session.fullName}
      roleLabel={getRoleLabel(session.role)}
      avatarSrc={avatarSrc}
      onLogout={() => { logout(); navigate('/signin'); }}
      topbarExtra={isSuperAdmin ? (
        <Link
          to={inboxPath}
          title={unreadMsgs > 0 ? `${unreadMsgs} unread message${unreadMsgs !== 1 ? 's' : ''}` : 'Staff Inbox'}
          style={{ position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center', width: '38px', height: '38px', borderRadius: '50%', backgroundColor: unreadMsgs > 0 ? 'rgba(99,102,241,0.12)' : 'transparent', border: unreadMsgs > 0 ? '1px solid rgba(99,102,241,0.3)' : '1px solid transparent', textDecoration: 'none', transition: 'all 0.15s', flexShrink: 0 }}
          onMouseEnter={e => { e.currentTarget.style.backgroundColor = 'rgba(148,163,184,0.2)'; e.currentTarget.style.border = '1px solid #cbd5e1'; }}
          onMouseLeave={e => { e.currentTarget.style.backgroundColor = unreadMsgs > 0 ? 'rgba(99,102,241,0.12)' : 'transparent'; e.currentTarget.style.border = unreadMsgs > 0 ? '1px solid rgba(99,102,241,0.3)' : '1px solid transparent'; }}
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={unreadMsgs > 0 ? '#6366f1' : '#64748b'} strokeWidth="2.2">
            <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/>
            <path d="M13.73 21a2 2 0 0 1-3.46 0"/>
          </svg>
          {unreadMsgs > 0 && (
            <span style={{ position: 'absolute', top: '-4px', right: '-4px', minWidth: '17px', height: '17px', backgroundColor: '#ef4444', borderRadius: '10px', fontSize: '10px', fontWeight: '800', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '0 3px', border: '2px solid white' }}>
              {unreadMsgs > 9 ? '9+' : unreadMsgs}
            </span>
          )}
        </Link>
      ) : null}
      loginNotif={{
        visible:   notifVisible,
        message:   isSuperAdmin && unreadMsgs > 0
          ? `Welcome back, ${session.fullName}! You have ${unreadMsgs} unread message${unreadMsgs !== 1 ? 's' : ''} from staff.`
          : `Welcome back, ${session.fullName}! You are logged in as ${getRoleLabel(session.role)}.`,
        onDismiss: () => setNotifVisible(false),
      }}
    />
  );
}
