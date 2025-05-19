import React, { useEffect, useState } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import { db } from "./firebase.config";
import HomePage from "./components/HomePage";
import RegisterPage from "./components/RegisterPage";
import Dashboard from "./components/Dashboard";
import UserDashboard from "./components/UserDashboard";
import ClientesList from "./components/ClientesList";
import AgregarCliente from "./components/AgregarCliente";
import ProtectedRoute from "./components/ProtectedRoute";
import LoginPage from "./components/LoginPage";
import AgendaCitas from "./components/AgendaCitas";
import MedicamentosList from "./components/MedicamentosList";
import CondicionesMedicas from "./components/CondicionesMedicas";
import Navbar from "./components/Navbar";
import Perfil from "./components/Perfil";
import AddClientInfo from "./components/AddClientInfo";

const AppRoutes = () => {
  const [role, setRole] = useState(null);

  useEffect(() => {
    const auth = getAuth();
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        let userDoc = await getDoc(doc(db, "administradores", user.uid));
        if (userDoc.exists()) {
          setRole("admin");
        } else {
          userDoc = await getDoc(doc(db, "clientes", user.uid));
          if (userDoc.exists()) {
            setRole("user");
          } else {
            setRole(null);
          }
        }
      } else {
        setRole(null);
      }
    });
    return () => unsubscribe();
  }, []);

  return (
    <Router>
      <Navbar role={role} />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route
          path="/admin-dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/user-dashboard"
          element={
            <ProtectedRoute>
              <UserDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/clientes"
          element={
            <ProtectedRoute>
              <ClientesList />
            </ProtectedRoute>
          }
        />
        <Route
          path="/clientes/agregar"
          element={
            <ProtectedRoute>
              <AgregarCliente />
            </ProtectedRoute>
          }
        />
        <Route
          path="/agenda-citas"
          element={
            <ProtectedRoute>
              <AgendaCitas />
            </ProtectedRoute>
          }
        />
        <Route
          path="/medicamentos"
          element={
            <ProtectedRoute>
              <MedicamentosList />
            </ProtectedRoute>
          }
        />
        <Route
          path="/condiciones-medicas"
          element={
            <ProtectedRoute>
              <CondicionesMedicas />
            </ProtectedRoute>
          }
        />
        <Route
          path="/perfil"
          element={
            <ProtectedRoute>
              <Perfil />
            </ProtectedRoute>
          }
        />
        <Route
          path="/add-client-info/:userId"
          element={<AddClientInfo />}
        />
      </Routes>
    </Router>
  );
};

export default AppRoutes;