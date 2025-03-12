import { Navigate } from "react-router-dom";
import { useAuth } from "../context/auth.jsx";

const ProtectedRoute = ({ children }) => {
  const [auth, setAuth] = useAuth();
  const token = auth?.token;

  return token ? children : <Navigate to="/login" />;
};

export default ProtectedRoute;
