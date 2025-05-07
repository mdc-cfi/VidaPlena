import React from "react";
import { Navigate } from "react-router-dom";
import { getAuth } from "firebase/auth";

const ProtectedRoute = ({ children, requiredRole }) => {
  const auth = getAuth();
  const user = auth.currentUser;
  const userRole = user ? user.role : null;

  if (!user) {
    return <Navigate to="/" replace />;
  }

  if (requiredRole === "admin" && userRole !== "admin") {
    console.error("Acceso denegado: el usuario no tiene el rol de administrador.");
    return <Navigate to="/" replace />;
  }

  return children;
};

export default ProtectedRoute;