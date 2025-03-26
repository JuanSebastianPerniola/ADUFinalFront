import React, { useState } from "react";
import axios from "axios";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

function Search() {
  const [reservations, setReservations] = useState([]);
  const [selectedView, setSelectedView] = useState("reservas"); // Alterna entre "reservas" y "search"
  const [selectedDate, setSelectedDate] = useState(new Date());
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
      <h1>Pagina de búsqueda y reservas</h1>

      {/* Barra de navegación */}
      <nav className="navBar">
        <button className="navBarButton" onClick={() => setSelectedView("reservas")}>
          Reservas
        </button>
        <button className="navBarButton" onClick={() => setSelectedView("search")}>
          Search
        </button>
      </nav>

      {/* Vista de Reservas */}
      {selectedView === "reservas" && (
        <div>
          <button type="button" className="btn btn-primary" onClick={fetchReservations} disabled={loading}>
            {loading ? "Cargando..." : "Ver todas las reservas"}
          </button>

          <div>
            <h3>Lista de Reservas:</h3>
            {reservations.map((res) => (
              <div key={res.idReserva} className="reservaCard">
                <p><strong>ID:</strong> {res.idReserva}</p>
                <p><strong>Nombre:</strong> {res.persona.nombre} {res.persona.apellido}</p>
                <p><strong>Email:</strong> {res.persona.email}</p>
                <p><strong>Check-in:</strong> {res.checkIn}</p>
                <p><strong>Check-out:</strong> {res.checkOut}</p>
              </div>
            ))}
          </div>

        </div>
      )}

      {/* Vista de Búsqueda */}
      {selectedView === "search" && (
        <div>
          <h3>Buscar por fecha</h3>
          <DatePicker selected={selectedDate} onChange={(date) => setSelectedDate(date)} dateFormat="yyyy-MM-dd" />
          <button className="btn btn-secondary">Buscar</button>
        </div>
      )}
    </div>
  );
}

export default Search;
