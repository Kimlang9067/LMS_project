import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

// ── Layouts ──────────────────────────────────────────────────────────────────
import StaffLayout from './Layouts/StaffLayout';
import UserDashboardLayout from './Layouts/UserDashboardLayout';

// ── Public pages ─────────────────────────────────────────────────────────────
import Home from './pages/public/Home';
import About from './pages/public/About';
import Help from './pages/public/Help';
import Catalog from './pages/public/Catalog';
import Circulation from './pages/public/Circulation';
import EBooks from './pages/public/EBooks';
import BookDetails from './pages/public/BookDetails';
import SignIn from './pages/public/SignIn';
import Register from './pages/public/Register';
import ForgotPassword from './pages/public/ForgotPassword';
import ResetPassword from './pages/public/ResetPassword';

// ── Member pages ──────────────────────────────────────────────────────────────
import UserDashboard from './pages/member/UserDashboard';
import Profile from './pages/member/Profile';
import EditProfile from './pages/member/EditProfile';
import Messages from './pages/member/Messages';
import Settings from './pages/member/Settings';

// ── Role / Staff dashboard (shared component, role-aware) ────────────────────
import RoleDashboard from './pages/staff/RoleDashboard';

export default function App() {
  const [userAccount, setUserAccount] = useState(null);

  return (
    <Router>
      <Routes>

        {/* ━━ PUBLIC ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
        <Route path="/"                element={<Home isLoggedIn={false} user={null} />} />
        <Route path="/about"           element={<About />} />
        <Route path="/help"            element={<Help />} />
        <Route path="/catalog"         element={<Catalog />} />
        <Route path="/books"           element={<Catalog />} />
        <Route path="/books/:id"       element={<BookDetails />} />
        <Route path="/circulation"     element={<Circulation />} />
        <Route path="/ebooks"          element={<EBooks />} />
        <Route path="/signin"          element={<SignIn  userAccount={userAccount} setUserAccount={setUserAccount} />} />
        <Route path="/register"        element={<Register userAccount={userAccount} setUserAccount={setUserAccount} />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password"  element={<ResetPassword />} />

        {/* ━━ MEMBER (UserDashboardLayout) ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
        <Route element={<UserDashboardLayout />}>
          <Route path="/userdashboard"   element={<UserDashboard />} />
          <Route path="/user/dashboard"  element={<UserDashboard />} />
          <Route path="/user/profile"    element={<Profile userAccount={userAccount} setUserAccount={setUserAccount} />} />
        </Route>
        <Route path="/profile"      element={<Profile  userAccount={userAccount} setUserAccount={setUserAccount} />} />
        <Route path="/edit-profile" element={<EditProfile />} />
        <Route path="/messages"     element={<Messages />} />
        <Route path="/settings"     element={<Settings />} />

        {/* ━━ STAFF / ROLE DASHBOARDS (StaffLayout) ━━━━━━━━━━━━━━━━━━━━━━━━ */}
        <Route element={<StaffLayout />}>

          {/* ── Super Admin ─────────────────────────────────────────────────── */}
          <Route path="/superadmin"                element={<RoleDashboard />} />
          <Route path="/superadmin/users"          element={<RoleDashboard />} />
          <Route path="/superadmin/admins"         element={<RoleDashboard />} />
          <Route path="/superadmin/books"          element={<RoleDashboard />} />
          <Route path="/superadmin/notifications"  element={<RoleDashboard />} />

          {/* ── Administrator ───────────────────────────────────────────────── */}
          <Route path="/admin"                     element={<RoleDashboard />} />
          <Route path="/admin/policies"            element={<RoleDashboard />} />
          <Route path="/admin/budget"              element={<RoleDashboard />} />
          <Route path="/admin/reports"             element={<RoleDashboard />} />
          <Route path="/admin/books"               element={<RoleDashboard />} />
          <Route path="/admin/notifications"       element={<RoleDashboard />} />

          {/* ── Librarian ───────────────────────────────────────────────────── */}
          <Route path="/librarian"                 element={<RoleDashboard />} />
          <Route path="/librarian/members"         element={<RoleDashboard />} />
          <Route path="/librarian/fines"           element={<RoleDashboard />} />

          {/* ── IT Staff ────────────────────────────────────────────────────── */}
          <Route path="/it-staff"                  element={<RoleDashboard />} />
          <Route path="/it-staff/health"           element={<RoleDashboard />} />
          <Route path="/it-staff/backups"          element={<RoleDashboard />} />
          <Route path="/it-staff/security"         element={<RoleDashboard />} />

          {/* ── Developer ───────────────────────────────────────────────────── */}
          <Route path="/developer"                 element={<RoleDashboard />} />
          <Route path="/developer/updates"         element={<RoleDashboard />} />
          <Route path="/developer/support"         element={<RoleDashboard />} />
          <Route path="/developer/logs"            element={<RoleDashboard />} />

          {/* ── Book Supplier ───────────────────────────────────────────────── */}
          <Route path="/supplier"                  element={<RoleDashboard />} />
          <Route path="/supplier/materials"        element={<RoleDashboard />} />
          <Route path="/supplier/orders"           element={<RoleDashboard />} />

          {/* ── Institution ─────────────────────────────────────────────────── */}
          <Route path="/institution"               element={<RoleDashboard />} />
          <Route path="/institution/funding"       element={<RoleDashboard />} />
          <Route path="/institution/standards"     element={<RoleDashboard />} />
          <Route path="/institution/reports"       element={<RoleDashboard />} />

          {/* ── Community ───────────────────────────────────────────────────── */}
          <Route path="/community"                 element={<RoleDashboard />} />
          <Route path="/community/outreach"        element={<RoleDashboard />} />

        </Route>

      </Routes>
    </Router>
  );
}
