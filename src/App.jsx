import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import UserDashboard from './pages/UserDashboard'; 
import SignIn from './pages/SignIn';
import Register from './pages/Register';
import Profile from './pages/Profile';
export default function App() {
  const [userAccount, setUserAccount] = useState(null); 

  return (
    <Router>
      <Routes>
        {/* Public Homepage */}
        <Route path="/" element={<Home isLoggedIn={false} user={null} />} />
        
        {/* User Dashboard */}
        <Route path="/userdashboard" element={<UserDashboard />} />
        
        {/* 2. Add the Settings Route right here */}
        <Route path="/signin" element={<SignIn userAccount={userAccount} setUserAccount={setUserAccount} />} />
        <Route path="/register" element={<Register userAccount={userAccount} setUserAccount={setUserAccount} />} />
        <Route path="/profile" element={<Profile userAccount={userAccount} setUserAccount={setUserAccount} />} />
        
      </Routes>
    </Router>
  );
}