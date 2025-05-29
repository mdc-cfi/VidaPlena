import React, { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import { getAuth } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../firebase.config";

// Componente que protege rutas según autenticación y rol
const ProtectedRoute = ({ children, requiredRoles = [] }) => {
  // Estado para el rol del usuario y el estado de carga
  const [userRole, setUserRole] = useState(null);
  const [loading, setLoading] = useState(true);
  const auth = getAuth();
  const user = auth.currentUser;

  useEffect(() => {
    // Obtiene el rol del usuario autenticado desde Firestore
    const fetchUserRole = async () => {
      if (user) {
        try {
          // Verifica si es administrador
          const adminDoc = await getDoc(doc(db, "administradores", user.uid));
          if (adminDoc.exists()) {
            setUserRole("admin");
          } else {
            // Si no, verifica si es cliente
            const clientDoc = await getDoc(doc(db, "clientes", user.uid));
            if (clientDoc.exists()) {
              setUserRole(clientDoc.data().role || "user");
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

  // Mientras se obtiene el rol, muestra mensaje de carga
  if (loading) {
    return <p>Cargando...</p>;
  }

  // Si no hay usuario autenticado, redirige a login
  if (!user) {
    console.warn("Usuario no autenticado. Redirigiendo a la página de inicio de sesión.");
    return <Navigate to="/login" replace />;
  }

  // Si el usuario no tiene un rol permitido, redirige a inicio
  if (requiredRoles.length > 0 && !requiredRoles.includes(userRole)) {
    console.error(`Acceso denegado: el usuario no tiene un rol permitido (${requiredRoles.join(", ")}).`);
    return <Navigate to="/" replace />;
  }

  // Si pasa todas las validaciones, muestra el contenido protegido
  return children;
};

export default ProtectedRoute;