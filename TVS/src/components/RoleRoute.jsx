// RoleRoute.jsx
import { Navigate } from "react-router-dom";
import { useRole } from "../context/RoleContext";

export default function RoleRoute({ allow = [], children }) {
  const { role } = useRole(); // "ADMIN" / "OFFICER" / null

  if (role && allow.includes(role)) return children;

  return <Navigate to="/officer-dashboard" replace />;
}
