import React, { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../firebase.config";

const ProtectedRoute = ({ children, requiredRoles = [] }) => {
  const [user, setUser] = useState(null);
  const [userRole, setUserRole] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const auth = getAuth();
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      setUser(firebaseUser);
      if (firebaseUser) {
        try {
          const adminDoc = await getDoc(doc(db, "administradores", firebaseUser.uid));
          if (adminDoc.exists()) {
            setUserRole("admin");
          } else {
            const clientDoc = await getDoc(doc(db, "clientes", firebaseUser.uid));
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
    });
    return () => unsubscribe();
  }, []);

  if (loading) {
    return <p>Cargando...</p>;
  }

  if (!user) {
    console.warn("Usuario no autenticado. Redirigiendo a la página de inicio de sesión.");
    return <Navigate to="/login" replace />;
  }

  if (requiredRoles.length > 0 && !requiredRoles.includes(userRole)) {
    console.error(`Acceso denegado: el usuario no tiene un rol permitido (${requiredRoles.join(", ")}).`);
    return <Navigate to="/" replace />;
  }

  return children;
};

export default ProtectedRoute;