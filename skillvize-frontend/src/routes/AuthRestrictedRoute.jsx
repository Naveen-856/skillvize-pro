import { Navigate } from "react-router-dom";

const AuthRestrictedRoute = ({ children }) => {
  const token = localStorage.getItem("token");
  return token ? <Navigate to="/" replace /> : children;
};

export default AuthRestrictedRoute;
