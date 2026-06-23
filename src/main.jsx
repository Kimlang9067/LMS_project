import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import { createBrowserRouter, RouterProvider } from "react-router";
import StaffLayout from "./layouts/StaffLayout.jsx";
import ProtectedRoute from "./components/ProtectedRoute.jsx";
import Home from "./pages/Home.jsx";
import EBooks from "./pages/EBooks.jsx";
import About from "./pages/About.jsx";
import Profile from "./pages/Profile.jsx";
import SignIn from "./pages/SignIn.jsx";
import Register from "./pages/Register.jsx";
import ForgotPassword from "./pages/ForgotPassword.jsx";
import UserDashboard from "./pages/UserDashboard.jsx";
import Catalog, { CatalogGrid } from "./pages/Catalog";
import BookDetails from "./pages/BookDetails";
import ResetPassword from "./pages/ResetPassword.jsx";
import Circulation from "./pages/Circulation";
import Messages from "./pages/Messages";
import Help from "./pages/Help";
import RoleDashboard from "./pages/RoleDashboard.jsx";
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
    path: "/userdashboard",
    element: (
      <ProtectedRoute allowedRoles={[ROLES.MEMBER]}>
        <UserDashboard />
      </ProtectedRoute>
    ),
  },
  {
    path: "/profile",
    element: (
      <ProtectedRoute allowedRoles={[ROLES.MEMBER]}>
        <Profile />
      </ProtectedRoute>
    ),
  },
  {
    path: "/messages",
    element: (
      <ProtectedRoute allowedRoles={[ROLES.MEMBER]}>
        <Messages />
      </ProtectedRoute>
    ),
  },
  {
    path: "/catalog",
    element: (
      <ProtectedRoute
        allowedRoles={[
          ROLES.MEMBER,
          ROLES.LIBRARIAN,
          ROLES.ADMINISTRATOR,
          ROLES.SUPER_ADMIN,
          ROLES.COMMUNITY,
        ]}
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
        allowedRoles={[
          ROLES.MEMBER,
          ROLES.LIBRARIAN,
          ROLES.ADMINISTRATOR,
          ROLES.SUPER_ADMIN,
        ]}
      >
        <Circulation />
      </ProtectedRoute>
    ),
  },

  staffRoute("/superadmin", ROLES.SUPER_ADMIN, ["users", "admins", "books", "notifications"]),
  staffRoute("/admin", ROLES.ADMINISTRATOR, ["policies", "budget", "reports", "books", "notifications"]),
  staffRoute("/librarian", ROLES.LIBRARIAN, ["members", "fines"]),
  staffRoute("/it-staff", ROLES.IT_STAFF, ["health", "backups", "security"]),
  staffRoute("/developer", ROLES.DEVELOPER, ["updates", "support", "logs"]),
  staffRoute("/supplier", ROLES.BOOK_SUPPLIER, ["materials", "orders"]),
  staffRoute("/institution", ROLES.INSTITUTION, ["funding", "standards", "reports"]),
  staffRoute("/community", ROLES.COMMUNITY, ["outreach"]),
]);

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>
);
