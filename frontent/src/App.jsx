import React, { useEffect, useState } from "react";
import Navbar from './components/Navbar';
import { getAuth, onAuthStateChanged } from "firebase/auth";
import AdminDashboard from "./components/AdminDashboard";
import UserDashboard from "./components/UserDashboard";

const App = () => {
  const [userId, setUserId] = useState(null);
  const [role, setRole] = useState(null);

  useEffect(() => {
    const auth = getAuth();
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setUserId(user.uid);
        // Aquí se puede agregar lógica para obtener el rol del usuario desde Firestore
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

  return (
    <div>
      <Navbar />
      {role === "administrador" ? (
        <AdminDashboard userId={userId} />
      ) : (
        <UserDashboard userId={userId} />
      )}
    </div>
  );
};

export default App;
