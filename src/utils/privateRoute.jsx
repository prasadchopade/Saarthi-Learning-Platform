import { Navigate, useLocation } from "react-router-dom";
import { getAuthToken } from "../services/api";

/**
 * This previously called isAuthenticated(), which is async, without awaiting
 * it. A promise is always truthy, so the guard let everyone through. Checking
 * for a stored token is synchronous and honest about what it can know; the
 * server still validates the token on every request.
 */
export const PrivateRoute = ({ element }) => {
  const location = useLocation();

  return getAuthToken()
    ? element
    : <Navigate to="/" replace state={{ from: location }} />;
};
