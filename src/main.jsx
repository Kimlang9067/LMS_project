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
import ResetPassword from "./pages/public/ResetPassword.jsx";
import Help from "./pages/public/Help.jsx";
import Catalog, { CatalogGrid } from "./pages/public/Catalog";
import BookDetails from "./pages/public/BookDetails";
import Circulation from "./pages/public/Circulation";
import MemberDashboard from "./pages/member/MemberDashboard.jsx";
import MemberCatalog from "./pages/member/MemberCatalog.jsx";
import MemberCirculation from "./pages/member/MemberCirculation.jsx";
import Profile from "./pages/member/Profile.jsx";
import Messages from "./pages/member/Messages";
import RoleDashboard from "./pages/staff/RoleDashboard.jsx";
import StaffProfile from "./pages/staff/StaffProfile.jsx";
import LibrarianCatalog from "./pages/staff/LibrarianCatalog.jsx";
import { ROLES, initStaffAccounts } from "./utils/auth";

initStaffAccounts();

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
      { index: true,            element: <Navigate to="/user/dashboard" replace /> },
      { path: "dashboard",      element: <MemberDashboard /> },
      { path: "catalog",        element: <MemberCatalog /> },
      { path: "catalog/:id",    element: <BookDetails /> },
      { path: "circulation",    element: <MemberCirculation /> },
      { path: "profile",        element: <Profile /> },
      { path: "messages",       element: <Messages /> },
      { path: "about",          element: <About /> },
      { path: "help",           element: <Help /> },
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
    path: "/circulation",
    element: (
      <ProtectedRoute
        allowedRoles={[ROLES.MEMBER, ROLES.LIBRARIAN, ROLES.ADMINISTRATOR, ROLES.SUPER_ADMIN]}
      >
        <Circulation />
      </ProtectedRoute>
    ),
  },

  staffRoute("/superadmin", ROLES.SUPER_ADMIN,   ["users", "admins", "books", "notifications"]),
  staffRoute("/admin",      ROLES.ADMINISTRATOR, ["policies", "budget", "reports", "books", "notifications"]),
  {
    path: "/librarian",
    element: (
      <ProtectedRoute allowedRoles={[ROLES.LIBRARIAN]}>
        <StaffLayout />
      </ProtectedRoute>
    ),
    children: [
      { index: true,      element: <RoleDashboard /> },
      { path: "profile",  element: <StaffProfile /> },
      { path: "members",  element: <RoleDashboard /> },
      { path: "fines",    element: <RoleDashboard /> },
      { path: "catalog",  element: <LibrarianCatalog /> },
    ],
  },
]);

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>
);
