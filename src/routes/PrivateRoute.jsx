import { Navigate } from "react-router-dom";

const PrivateRoute = ({ children, accessToken }) => {
  const isAuthenticated = !!accessToken;

  return isAuthenticated ? children : <Navigate to="/login" replace />;
};

export default PrivateRoute;
