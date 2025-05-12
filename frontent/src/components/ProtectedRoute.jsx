import React, { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import { getAuth } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../firebase.config";

const ProtectedRoute = ({ children, requiredRole }) => {
  const [userRole, setUserRole] = useState(null);
  const [loading, setLoading] = useState(true);
  const auth = getAuth();
  const user = auth.currentUser;

  useEffect(() => {
    const fetchUserRole = async () => {
      if (user) {
        try {
          const adminDoc = await getDoc(doc(db, "administradores", user.uid));
          if (adminDoc.exists()) {
            setUserRole("admin");
          } else {
            const clientDoc = await getDoc(doc(db, "clientes", user.uid));
            if (clientDoc.exists()) {
              setUserRole(clientDoc.data().role);
            }
          }
        } catch (error) {
          console.error("Error al obtener el rol del usuario:", error);
        } finally {
          setLoading(false);
        }
      } else {
        setLoading(false);
      }
    };

    fetchUserRole();
  }, [user]);

  if (loading) {
    return <p>Cargando...</p>;
  }

  if (!user) {
    console.warn("Usuario no autenticado. Redirigiendo a la página de inicio de sesión.");
    return <Navigate to="/login" replace />;
  }

  if (requiredRole && userRole !== requiredRole) {
    console.error(`Acceso denegado: el usuario no tiene el rol requerido (${requiredRole}).`);
    return <Navigate to="/" replace />;
  }

  return children;
};

export default ProtectedRoute;