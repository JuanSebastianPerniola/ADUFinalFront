import React, { useState } from "react";
import axios from "axios";

function Search() {
  const [reservations, setReservations] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchReservations = async () => {
    setLoading(true);
    try {
      const response = await axios.get("http://localhost:8081/reserva/listar");
      const transformedReservations = response.data.map((r) => ({
        idReserva: r[0],
        checkIn: r[1],
        checkOut: r[2],
        persona: {
          nombre: r[3],
          apellido: r[4],
          email: r[5],
        },
      }));
      setReservations(transformedReservations);
    } catch (error) {
      console.error("Error al obtener reservas:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h1>Lista de Reservas</h1>

      {/* Botón para obtener reservas */}
      <button type="button" className="btn btn-primary" onClick={fetchReservations} disabled={loading}>
        {loading ? "Cargando..." : "Ver todas las reservas"}
      </button>

      {/* Lista de Reservas */}
      <div>
        <h3>Lista de Reservas:</h3>
        {reservations.map((res) => (
          <div key={res.idReserva} className="reservaCard">
            <p><strong>ID:</strong> {res.idReserva}</p>
            <p><strong>Nombre:</strong> {res.persona.nombre} {res.persona.apellido}</p>
            <p><strong>Email:</strong> {res.persona.email}</p>
            <p><strong>Check-in:</strong> {res.checkIn}</p>
            <p><strong>Check-out:</strong> {res.checkOut}</p>
            <button className="navBarButton">Modificar</button>
            <button className="navBarButton">Eliminar</button>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Search;
