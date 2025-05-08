import React, { useEffect, useState } from "react";
import Navbar from './components/Navbar';
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { getDoc, doc } from "firebase/firestore";
import AdminDashboard from "./components/AdminDashboard";
import UserDashboard from "./components/UserDashboard";

const App = () => {
  const [userId, setUserId] = useState(null);
  const [role, setRole] = useState(null);

  useEffect(() => {
    const auth = getAuth();
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        console.log("Usuario autenticado:", user);
        setUserId(user.uid);
        try {
          console.log("Obteniendo rol para el usuario con UID:", user.uid);
          const adminDoc = await getDoc(doc(db, "administradores", user.uid));
          if (adminDoc.exists()) {
            console.log("Rol encontrado: admin");
            setRole("admin");
          } else {
            const clientDoc = await getDoc(doc(db, "clientes", user.uid));
            if (clientDoc.exists()) {
              console.log("Rol encontrado: user");
              setRole("user");
            } else {
              console.log("No se encontró rol para el usuario");
            }
          }
        } catch (error) {
          console.error("Error al obtener el rol del usuario:", error);
        }
      } else {
        setUserId(null);
        setRole(null);
      }
    });

    return () => unsubscribe();
  }, []);

  if (!userId) {
    return <p>Inicia sesión para ver tu información.</p>;
  }

  console.log("Rol del usuario en App.jsx:", role);
  console.log("Rol obtenido en App.jsx:", role);

  return (
    <div>
      <Navbar role={role} />
      {role === "admin" ? (
        <AdminDashboard userId={userId} />
      ) : (
        <UserDashboard userId={userId} />
      )}
    </div>
  );
};

export default App;
