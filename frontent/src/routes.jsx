import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { getFirestore, doc, getDoc } from "firebase/firestore";
import HomePage from "./components/HomePage";
import RegisterPage from "./components/RegisterPage";
import Dashboard from "./components/Dashboard";
import UserDashboard from "./components/UserDashboard";
import ClientesList from "./components/ClientesList";
import AgregarCliente from "./components/AgregarCliente";
import ProtectedRoute from "./components/ProtectedRoute";
import LoginPage from "./components/LoginPage";
import AddClientInfo from "./components/AddClientInfo";
import MedicamentosList from "./components/MedicamentosList";
import CondicionesMedicas from "./components/CondicionesMedicas";

const AppRoutes = () => {
  const auth = getAuth();
  const db = getFirestore();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        let userDoc = await getDoc(doc(db, "administradores", user.uid));
        if (!userDoc.exists()) {
          userDoc = await getDoc(doc(db, "users", user.uid));
        }
      }
    });
    return () => unsubscribe();
  }, [auth, db]);

  return (
    <Router>
      <Routes>
        <Route
          path="/"
          element={<HomePage />}
        />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route
          path="/admin-dashboard"
          element={
            <ProtectedRoute requiredRole="admin">
              <Dashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/user-dashboard"
          element={
            <ProtectedRoute requiredRole="user">
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
        <Route path="/add-client-info/:userId" element={<AddClientInfo />} />
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
      </Routes>
    </Router>
  );
};

export default AppRoutes;