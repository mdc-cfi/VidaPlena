import React, { useContext } from "react";
import { UserContext } from "../context/UserContext";

function UserInfo() {
  const { user } = useContext(UserContext);

  if (!user) {
    return <p>No hay información disponible del usuario.</p>;
  }

  return (
    <div className="container mt-5">
      <h1 className="text-center mb-4">Información del Usuario</h1>
      <ul className="list-group">
        <li className="list-group-item">
          <strong>Nombre:</strong> {user.name}
        </li>
        <li className="list-group-item">
          <strong>Correo Electrónico:</strong> {user.email || 'No proporcionado'}
        </li>
        <li className="list-group-item">
          <strong>Teléfono:</strong> {user.phone || 'No proporcionado'}
        </li>
        <li className="list-group-item">
          <strong>Dirección:</strong> {user.address || 'No proporcionada'}
        </li>
        <li className="list-group-item">
          <strong>Rol:</strong> {user.role === "admin" ? "Administrador" : "Cliente"}
        </li>
      </ul>
    </div>
  );
}

export default UserInfo;