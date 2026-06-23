import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import { createBrowserRouter, RouterProvider } from "react-router";
import DashboardLayout from "./layouts/DashboardLayout.jsx";
import Home from "./pages/Home.jsx";
import EBooks from "./pages/EBooks.jsx";
import About from "./pages/About.jsx";
import Profile from "./pages/Profile.jsx";
import SignIn from "./pages/SignIn.jsx";
import Register from "./pages/Register.jsx";
import DashboardOverview from "./pages/DashboardOverview.jsx";
import ForgotPassword from "./pages/ForgotPassword.jsx";
import UserDashboard from "./pages/UserDashboard.jsx";
import Catalog, { CatalogGrid } from "./pages/Catalog";
import BookDetails from "./pages/BookDetails";
import ResetPassword from "./pages/ResetPassword.jsx";
import Circulation from "./pages/Circulation";
import Messages from "./pages/Messages";
import Help from "./pages/Help";


const router = createBrowserRouter([
  { path: "/", element: <Home /> },
  { path: "/ebooks", element: <EBooks /> },
  { path: "/about", element: <About /> },
  { path: "/profile", element: <Profile /> },
  { path: "/signin", element: <SignIn /> },
  { path: "/register", element: <Register /> },
  { path: "/forgot-password", element: <ForgotPassword /> },
  { path: "/reset-password", element: <ResetPassword /> },
  { path: "/userdashboard", element: <UserDashboard /> },
  {
    path: "/catalog",
    element: <Catalog />,
    children: [
      { index: true, element: <CatalogGrid /> },
      { path: ":id", element: <BookDetails /> },
    ],
  },
  { path: "/circulation", element: <Circulation /> },
  // 2. ADD THIS NEW PATH TARGET RIGHT HERE
  { path: "/messages", element: <Messages /> },
  { path: "/help", element: <Help /> },
  
  

  {
    path: "/superadmin",
    element: <DashboardLayout />,
    children: [
      { index: true, element: <DashboardOverview /> },
      { path: "users", element: <DashboardOverview /> },
      { path: "admins", element: <DashboardOverview /> },
      { path: "books", element: <DashboardOverview /> },
      { path: "notifications", element: <div style={{padding: '20px'}}>Notifications Stream Workspace</div> }
    ]
  },
  {
    path: "/admin",
    element: <DashboardLayout />,
    children: [
      { index: true, element: <DashboardOverview /> },
      { path: "users", element: <DashboardOverview /> },
      { path: "books", element: <DashboardOverview /> },
      { path: "notifications", element: <div style={{padding: '20px'}}>Notifications Stream Workspace</div> }
    ]
  }
]);

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>
);