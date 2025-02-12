import { Navigate, useLocation } from "react-router-dom";
import { isAuthenticated } from "../services/authService";

export const PrivateRoute = ({ element }) => {
  const location = useLocation();
  const isUserAuthenticated = isAuthenticated();
  return isUserAuthenticated
    ? element
    : <Navigate to="/" replace state={{ from: location }} />;
};