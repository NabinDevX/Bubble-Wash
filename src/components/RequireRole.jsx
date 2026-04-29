import { Navigate, useLocation } from "react-router-dom";

import { useAuth } from "../lib/AuthContext.jsx";
import { getToken } from "../lib/api.js";

function redirectPathForRole(role) {
  const normalized = String(role ?? "").toLowerCase();
  if (
    normalized === "admin" ||
    normalized === "staff" ||
    normalized === "store_manager"
  ) {
    return "/admin";
  }
  if (normalized === "rider") return "/rider";
  return "/customer";
}

export default function RequireRole({ allow, children }) {
  const { user, loading } = useAuth();
  const location = useLocation();

  const token = getToken();

  if (!token) {
    return <Navigate to="/signin" replace state={{ from: location }} />;
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh] text-on-surface-variant">
        Loading…
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/signin" replace state={{ from: location }} />;
  }

  if (Array.isArray(allow) && allow.length > 0) {
    const role = String(user.role ?? "").toLowerCase();
    const allowed = new Set(allow.map((r) => String(r).toLowerCase()));
    if (!allowed.has(role)) {
      return <Navigate to={redirectPathForRole(role)} replace />;
    }
  }

  return children;
}
