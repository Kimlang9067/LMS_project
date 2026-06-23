import { Navigate } from "react-router-dom";
import { getSession, getDashboardPath } from "../utils/auth";

export default function ProtectedRoute({ allowedRoles, children }) {
  const session = getSession();

  if (!session) {
    return <Navigate to="/signin" replace />;
  }

  if (allowedRoles && !allowedRoles.includes(session.role)) {
    return <Navigate to={getDashboardPath(session.role)} replace />;
  }

  return children;
}
