import React, { useState } from "react";
import axios from "axios";

function Search() {
  const [reservations, setReservations] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedReserva, setSelectedReserva] = useState(null);

  // Obtener reservas
  const fetchReservations = async () => {
    setLoading(true);
    try {
      const response = await axios.get("http://localhost:8080/reserva/listar");
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

  // Actualizar reserva
  const fetchUpdate = async () => {
    if (!selectedReserva) return;

    try {
      const updatedReserva = {
        idReserva: selectedReserva.idReserva,
        checkIn: selectedReserva.checkIn.split("T")[0],
        checkOut: selectedReserva.checkOut.split("T")[0],
        persona: {
          nombre: selectedReserva.persona.nombre,
          apellido: selectedReserva.persona.apellido,
          email: selectedReserva.persona.email
        }
      };

      const response = await axios.put("http://localhost:8080/reserva/actualizar", updatedReserva);
      console.log("Respuesta del backend:", response.data); // 👀

      await fetchReservations();
      setSelectedReserva(null);
    } catch (error) {
      console.error("Error al actualizar reserva:", error.response?.data || error.message);
    }
  };

  // Eliminar reserva
  const fetchDelete = async (idReserva) => {
    try {
      await axios.delete(`http://localhost:8080/reserva/deleteReservar/${idReserva}`);
      fetchReservations(); // Recargar la lista después de eliminar
    } catch (error) {
      console.error("Error al eliminar reserva:", error);
    }
  };

  const handleUpdateClick = (reserva) => {
    setSelectedReserva(reserva);
  };

  const handleSaveUpdate = () => {
    if (selectedReserva) {
      fetchUpdate(); // No necesita argumento
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
            <p><strong>Nombre:</strong> {res.persona.nombre} {res.persona.apellido}</p>
            <p><strong>Email:</strong> {res.persona.email}</p>
            <p><strong>Check-in:</strong> {res.checkIn}</p>
            <p><strong>Check-out:</strong> {res.checkOut}</p>
            <button className="navBarButton" onClick={() => handleUpdateClick(res)}>Modificar</button>
            <button className="navBarButton" onClick={() => fetchDelete(res.idReserva)}>Eliminar</button>
          </div>
        ))}
      </div>

      {/* Modal de edición */}
      {selectedReserva && (
        <div className="modal">
          <h3>Editar Reserva</h3>
          <label>Nombre:
            <input type="text" value={selectedReserva.persona.nombre}
              onChange={(e) => setSelectedReserva({
                ...selectedReserva,
                persona: { ...selectedReserva.persona, nombre: e.target.value }
              })}
            />
          </label>

          <label>Apellido:
            <input type="text" value={selectedReserva.persona.apellido}
              onChange={(e) => setSelectedReserva({
                ...selectedReserva,
                persona: { ...selectedReserva.persona, apellido: e.target.value }
              })}
            />
          </label>

          <label>Check-in:
            <input type="date" value={selectedReserva.checkIn}
              onChange={(e) => setSelectedReserva({ ...selectedReserva, checkIn: e.target.value })}
            />
          </label>

          <label>Check-out:
            <input type="date" value={selectedReserva.checkOut}
              onChange={(e) => setSelectedReserva({ ...selectedReserva, checkOut: e.target.value })}
            />
          </label>

          <button onClick={handleSaveUpdate}>Guardar</button>
          <button onClick={() => setSelectedReserva(null)}>Cancelar</button>
        </div>
      )}
    </div>
  );
}

export default Search;
