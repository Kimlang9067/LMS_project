import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import { createBrowserRouter, RouterProvider, Navigate } from "react-router";
import StaffLayout from "./Layouts/StaffLayout.jsx";
import UserDashboardLayout from "./Layouts/UserDashboardLayout.jsx";
import ProtectedRoute from "./components/ProtectedRoute.jsx";
import Home from "./pages/public/Home.jsx";
import EBooks from "./pages/public/EBooks.jsx";
import About from "./pages/public/About.jsx";
import SignIn from "./pages/public/SignIn.jsx";
import Register from "./pages/public/Register.jsx";
import ForgotPassword from "./pages/public/ForgotPassword.jsx";
import VerifyOTP from "./pages/public/VerifyOTP.jsx";
import ResetPassword from "./pages/public/ResetPassword.jsx";
import Help from "./pages/public/Help.jsx";
import Catalog, { CatalogGrid } from "./pages/public/Catalog";
import BookDetails from "./pages/public/BookDetails";
import MemberDashboard from "./pages/member/MemberDashboard.jsx";
import MemberCatalog from "./pages/member/MemberCatalog.jsx";
import Profile from "./pages/member/Profile.jsx";
import Messages from "./pages/member/Messages";
import SettingsPage from "./pages/shared/SettingsPage.jsx";
import RoleDashboard from "./pages/staff/RoleDashboard.jsx";
import StaffProfile from "./pages/staff/StaffProfile.jsx";
import LibrarianCatalog from "./pages/staff/LibrarianCatalog.jsx";
import SuperAdminInbox from "./pages/staff/SuperAdminInbox.jsx";
import MessageSuperAdmin from "./pages/staff/MessageSuperAdmin.jsx";
import { ROLES, initStaffAccounts } from "./utils/auth";
import { initDatabase } from "./data/database";
import "./utils/theme";   // applies saved theme on startup
import "./utils/i18n";    // applies saved language on startup

initStaffAccounts();
initDatabase();

function staffRoute(path, role, subPaths = []) {
  return {
    path,
    element: (
      <ProtectedRoute allowedRoles={[role]}>
        <StaffLayout />
      </ProtectedRoute>
    ),
    children: [
      { index: true, element: <RoleDashboard /> },
      { path: "profile", element: <StaffProfile /> },
      ...subPaths.map((sub) => ({ path: sub, element: <RoleDashboard /> })),
    ],
  };
}

const router = createBrowserRouter([
  { path: "/", element: <Home /> },
  { path: "/ebooks", element: <EBooks /> },
  { path: "/about", element: <About /> },
  { path: "/signin", element: <SignIn /> },
  { path: "/register", element: <Register /> },
  { path: "/forgot-password", element: <ForgotPassword /> },
  { path: "/verify-otp",     element: <VerifyOTP /> },
  { path: "/reset-password", element: <ResetPassword /> },
  { path: "/help", element: <Help /> },

  {
    path: "/user",
    element: (
      <ProtectedRoute allowedRoles={[ROLES.MEMBER]}>
        <UserDashboardLayout />
      </ProtectedRoute>
    ),
    children: [
      { index: true,        element: <Navigate to="/user/dashboard" replace /> },
      { path: "dashboard",  element: <MemberDashboard /> },
      { path: "catalog",    element: <MemberCatalog /> },
      { path: "profile",    element: <Profile /> },
      { path: "messages",   element: <Messages /> },
      { path: "about",    element: <About />       },
      { path: "help",     element: <Help />        },
      { path: "settings", element: <SettingsPage />},
    ],
  },
  // Legacy redirects so old bookmarks still work
  { path: "/userdashboard", element: <Navigate to="/user/dashboard" replace /> },
  { path: "/profile",       element: <Navigate to="/user/profile"   replace /> },
  { path: "/messages",      element: <Navigate to="/user/messages"  replace /> },
  {
    path: "/catalog",
    element: (
      <ProtectedRoute
        allowedRoles={[ROLES.MEMBER, ROLES.LIBRARIAN, ROLES.ADMINISTRATOR, ROLES.SUPER_ADMIN]}
      >
        <Catalog />
      </ProtectedRoute>
    ),
    children: [
      { index: true, element: <CatalogGrid /> },
      { path: ":id", element: <BookDetails /> },
    ],
  },
  {
    path: "/superadmin",
    element: (
      <ProtectedRoute allowedRoles={[ROLES.SUPER_ADMIN]}>
        <StaffLayout />
      </ProtectedRoute>
    ),
    children: [
      { index: true,              element: <RoleDashboard /> },
      { path: "profile",          element: <StaffProfile /> },
      { path: "users",            element: <RoleDashboard /> },
      { path: "catalog",          element: <RoleDashboard /> },
      { path: "reports",          element: <RoleDashboard /> },
      { path: "budget",           element: <RoleDashboard /> },
      { path: "notifications",    element: <SuperAdminInbox /> },
      { path: "settings",         element: <RoleDashboard /> },
    ],
  },
  {
    path: "/admin",
    element: (
      <ProtectedRoute allowedRoles={[ROLES.ADMINISTRATOR]}>
        <StaffLayout />
      </ProtectedRoute>
    ),
    children: [
      { index: true,              element: <RoleDashboard /> },
      { path: "profile",          element: <StaffProfile /> },
      { path: "budget",           element: <RoleDashboard /> },
      { path: "reports",          element: <RoleDashboard /> },
      { path: "books",            element: <RoleDashboard /> },
      { path: "notifications",    element: <RoleDashboard /> },
      { path: "messages",         element: <MessageSuperAdmin /> },
      { path: "settings",         element: <RoleDashboard /> },
    ],
  },
  {
    path: "/librarian",
    element: (
      <ProtectedRoute allowedRoles={[ROLES.LIBRARIAN]}>
        <StaffLayout />
      </ProtectedRoute>
    ),
    children: [
      { index: true,       element: <RoleDashboard /> },
      { path: "profile",   element: <StaffProfile />  },
      { path: "members",   element: <RoleDashboard /> },
      { path: "fines",     element: <RoleDashboard /> },
      { path: "catalog",   element: <LibrarianCatalog /> },
      { path: "messages",  element: <MessageSuperAdmin /> },
      { path: "settings",  element: <RoleDashboard /> },
    ],
  },
]);

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>
);
