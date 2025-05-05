import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Dashboard from "./components/Dashboard";
import ClientesList from "./components/ClientesList";
import AgregarCliente from "./components/AgregarCliente";
import Navbar from "./components/navbar";
import Login from "./components/Login";
import AdminDashboard from "./components/AdminDashboard";
import ClientDashboard from "./components/ClientDashboard";
import SolicitarCita from "./components/AgendarCita";
import CitasPendientes from "./components/CitasPendientes";
import UserInfo from "./components/UserInfo";
import SeguimientoClientes from "./components/SeguimientoClientes";
import ClienteDetalle from "./components/ClienteDetalle";
import RecetarMedicamento from "./components/RecetarMedicamento";
import { useContext } from "react";
import { UserContext } from "./context/UserContext";

function AppRoutes() {
  const { user, setUser } = useContext(UserContext);

  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/" element={user ? <Dashboard /> : <Login setUser={setUser} />} />
        <Route path="/clientes" element={<ClientesList />} />
        <Route path="/clientes/agregar" element={<AgregarCliente />} />
        <Route path="/admin" element={<Dashboard />} />
        <Route path="/cliente" element={<Dashboard />} />
        <Route path="/cliente/solicitar-cita" element={<SolicitarCita />} />
        <Route path="/cliente/citas-pendientes" element={<CitasPendientes />} />
        <Route path="/usuario/informacion" element={<UserInfo />} />
        <Route path="/admin/seguimiento-clientes" element={<SeguimientoClientes />} />
        <Route path="/admin/cliente/:id" element={<ClienteDetalle />} />
        <Route path="/admin/recetar/:id" element={<RecetarMedicamento />} />
      </Routes>
    </Router>
  );
}

export default AppRoutes;