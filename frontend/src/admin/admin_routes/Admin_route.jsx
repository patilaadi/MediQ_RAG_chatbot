import { Navigate } from "react-router-dom";

const AdminRoute = ({ children }) => {
  
  const role = localStorage.getItem("role");

 
  if (role !== "admin") {
    return <Navigate to="/signin" replace />;
  }

  return children;
};

export default AdminRoute;