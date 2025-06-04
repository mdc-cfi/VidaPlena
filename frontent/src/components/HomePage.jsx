import React from "react";
import { Link } from "react-router-dom";
import logo from "../imagenes/logo.png";

const HomePage = () => {
  return (
    <div style={{ textAlign: "center", marginTop: "60px", maxWidth: 700, marginLeft: "auto", marginRight: "auto" }}>
      <img src={logo} alt="Logo Vida Plena" style={{ width: 90, marginBottom: 24 }} />
      <h1 style={{ fontSize: "2.5em", marginBottom: 16 }}>Bienvenido a Vida Plena</h1>
      <p style={{ fontSize: "1.2em", marginBottom: 32 }}>
        Vida Plena es la plataforma digital diseñada para transformar el cuidado y la calidad de vida de las personas mayores y sus familias.
      </p>
      <div style={{ background: "#232323", borderRadius: 12, padding: 24, color: "#fff", marginBottom: 32, boxShadow: "0 2px 12px #0002" }}>
        <h2 style={{ marginBottom: 12 }}>¿Qué problemas resuelve?</h2>
        <ul style={{ textAlign: "left", fontSize: "1.1em", margin: "0 auto", maxWidth: 540 }}>
          <li style={{ marginBottom: 10 }}><strong>Desorganización en la gestión de citas y medicamentos:</strong> Centraliza recordatorios de citas médicas y toma de medicamentos para evitar olvidos y confusiones.</li>
          <li style={{ marginBottom: 10 }}><strong>Dificultad para compartir información médica:</strong> Permite a familiares y cuidadores acceder y actualizar el historial médico de manera segura y sencilla.</li>
          <li style={{ marginBottom: 10 }}><strong>Falta de seguimiento personalizado:</strong> Ofrece un perfil completo para cada usuario, facilitando el monitoreo de condiciones médicas, tratamientos y evolución.</li>
          <li style={{ marginBottom: 10 }}><strong>Comunicación fragmentada:</strong> Unifica la información relevante en un solo lugar, mejorando la comunicación entre profesionales, familiares y usuarios.</li>
        </ul>
      </div>
      <div style={{ fontSize: "1.15em", marginBottom: 24 }}>
        <strong>¿Cómo funciona?</strong>
        <ul style={{ textAlign: "left", margin: "18px auto 0", maxWidth: 540 }}>
          <li>Regístrate como usuario, familiar.</li>
          <li>Crea y gestiona perfiles para tus seres queridos.</li>
          <li>Agrega y consulta condiciones médicas, medicamentos y citas.</li>
          <li>Recibe recordatorios y mantén toda la información centralizada y segura.</li>
        </ul>
      </div>
      <div style={{ marginTop: 32 }}>
        <Link to="/register" style={{ background: "#1976d2", color: "#fff", padding: "14px 32px", borderRadius: 8, fontWeight: "bold", fontSize: "1.1em", textDecoration: "none", boxShadow: "0 2px 8px #0002" }}>
          ¡Comienza ahora!
        </Link>
      </div>
    </div>
  );
};

export default HomePage;