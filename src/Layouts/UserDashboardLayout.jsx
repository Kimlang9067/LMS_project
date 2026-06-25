import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router';
import { logout } from '../utils/auth';
import AppLayout from '../components/shared/AppLayout';

const MEMBER_NAV = [
  { label: 'Dashboard',   path: '/user/dashboard',   pageTitle: 'My Dashboard'      },
  { label: 'Catalog',     path: '/user/catalog',     pageTitle: 'Library Catalog'   },
  { label: 'Circulation', path: '/user/circulation', pageTitle: 'My Circulation'    },
  { label: 'Profile',     path: '/user/profile',     pageTitle: 'My Profile'        },
  { label: 'Messages',    path: '/user/messages',    pageTitle: 'Messages'          },
  { label: 'About',       path: '/user/about',       pageTitle: 'About the Library' },
  { label: 'Help',        path: '/user/help',        pageTitle: 'Help Center'       },
];

export default function UserDashboardLayout() {
  const navigate = useNavigate();

  const savedUser = localStorage.getItem('userAccount');
  const user = savedUser ? JSON.parse(savedUser) : { fullName: 'Member', username: 'member' };

  const [notifVisible, setNotifVisible] = useState(false);

  useEffect(() => {
    const seen = sessionStorage.getItem('memberNotifShown');
    if (!seen) {
      setNotifVisible(true);
      sessionStorage.setItem('memberNotifShown', 'true');
    }
  }, []);

  const avatarSrc = localStorage.getItem(`memberAvatar_${user.username || 'member'}`);

  return (
    <AppLayout
      navItems={MEMBER_NAV}
      portalLabel="Member Portal"
      displayName={user.fullName || 'Member'}
      roleLabel={`@${user.username || 'member'}`}
      avatarSrc={avatarSrc}
      onLogout={() => {
        logout();
        sessionStorage.removeItem('memberNotifShown');
        navigate('/signin');
      }}
      loginNotif={{
        visible:   notifVisible,
        message:   `Welcome back, ${user.fullName}! You are logged in as a Library Member.`,
        onDismiss: () => setNotifVisible(false),
      }}
    />
  );
}
