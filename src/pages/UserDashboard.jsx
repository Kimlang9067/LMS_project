import React from 'react';
import { useNavigate } from 'react-router-dom'; // 1. Import useNavigate
import Home from './Home';

export default function UserDashboard() {
  const navigate = useNavigate(); // 2. Initialize the navigation hook
  
  const user = JSON.parse(localStorage.getItem("userAccount"));

  const s = {
    navItem: {
      display: 'flex',
      alignItems: 'center',
      gap: '10px',
      padding: '10px 12px',
      cursor: 'pointer',
      color: '#ccc',
      fontSize: '14px',
      borderRadius: '8px',
      transition: 'background-color 0.15s ease'
    },
    newEntryBtn: {
      width: '100%',
      padding: '10px 16px',
      backgroundColor: '#ffffff',
      color: '#000000',
      border: 'none',
      borderRadius: '8px',
      cursor: 'pointer',
      fontWeight: 'bold',
      fontSize: '14px',
      marginBottom: '12px',
      transition: 'background-color 0.15s ease'
    }
  };

  const dashboardSidebarItems = (
    <>
    </>
  );

  return (
    <Home 
      isLoggedIn={!!user} 
      user={user} 
      sidebarExtension={dashboardSidebarItems} 
      showNav={true}
    />
  );
}