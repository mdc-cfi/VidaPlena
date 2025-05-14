import React, { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import { getAuth } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../firebase.config";

const ProtectedRoute = ({ children, requiredRole }) => {
  const [userRole, setUserRole] = useState(() => sessionStorage.getItem("userRole"));
  const [loading, setLoading] = useState(true);
  const [isAuthReady, setIsAuthReady] = useState(false);
  const auth = getAuth();
  const [user, setUser] = useState(auth.currentUser);

  // Escuchar cambios de autenticación de forma reactiva
  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((firebaseUser) => {
      setUser(firebaseUser);
      setIsAuthReady(true);
    });
    return () => unsubscribe();
  }, [auth]);

  useEffect(() => {
    const fetchUserRole = async () => {
      if (user && !userRole) {
        try {
          const adminDoc = await getDoc(doc(db, "administradores", user.uid));
          if (adminDoc.exists()) {
            setUserRole("admin");
            sessionStorage.setItem("userRole", "admin");
          } else {
            const clientDoc = await getDoc(doc(db, "clientes", user.uid));
            if (clientDoc.exists()) {
              setUserRole(clientDoc.data().role);
              sessionStorage.setItem("userRole", clientDoc.data().role);
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
    if (isAuthReady && !userRole) fetchUserRole();
    if (isAuthReady && userRole) setLoading(false);
  }, [user, isAuthReady, userRole]);

  if (loading || !isAuthReady) {
    return <p>Cargando...</p>;
  }

  if (!user) {
    sessionStorage.removeItem("userRole");
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