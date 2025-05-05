import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import HomePage from "./components/HomePage";
import RegisterPage from "./components/RegisterPage";
import Dashboard from "./components/Dashboard";
import UserDashboard from "./components/UserDashboard";
import ClientesList from "./components/ClientesList";
import AgregarCliente from "./components/AgregarCliente";
import Navbar from "./components/navbar";
import ProtectedRoute from "./components/ProtectedRoute";
import LoginPage from "./components/LoginPage";

const AppRoutes = () => {
  return (
    <Router>
      <Navbar />
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
      </Routes>
    </Router>
  );
};

export default AppRoutes;