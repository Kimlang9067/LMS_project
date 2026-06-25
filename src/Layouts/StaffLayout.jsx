import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router';
import { getSession, getRoleLabel, getNavItems, logout, getDashboardPath } from '../utils/auth';
import AppLayout from '../components/shared/AppLayout';

export default function StaffLayout() {
  const navigate = useNavigate();
  const session  = getSession();

  const [notifVisible, setNotifVisible] = useState(false);

  useEffect(() => {
    if (session?.loginAt) {
      const seen = sessionStorage.getItem('staffNotifLoginAt');
      if (seen !== session.loginAt) {
        setNotifVisible(true);
        sessionStorage.setItem('staffNotifLoginAt', session.loginAt);
      }
    }
  }, [session?.loginAt]);

  if (!session) return null;

  const baseItems   = getNavItems(session.role);
  const profilePath = `${getDashboardPath(session.role)}/profile`;

  // AppLayout resolves icons from the URL segment automatically
  const navItems = [
    ...baseItems,
    { label: 'Profile', path: profilePath, pageTitle: `${getRoleLabel(session.role)} Profile` },
  ];

  const avatarSrc = session.id ? localStorage.getItem(`staffAvatar_${session.id}`) : null;

  return (
    <AppLayout
      navItems={navItems}
      portalLabel={`${getRoleLabel(session.role)} Portal`}
      displayName={session.fullName}
      roleLabel={getRoleLabel(session.role)}
      avatarSrc={avatarSrc}
      onLogout={() => { logout(); navigate('/signin'); }}
      loginNotif={{
        visible:   notifVisible,
        message:   `Welcome back, ${session.fullName}! You are logged in as ${getRoleLabel(session.role)}.`,
        onDismiss: () => setNotifVisible(false),
      }}
    />
  );
}
