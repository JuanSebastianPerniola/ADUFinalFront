import React, { useState } from "react";
import axios from "axios";

function Search() {
  const [reservations, setReservations] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedReserva, setSelectedReserva] = useState(null);
  const [editMode, setEditMode] = useState(false);

  const fetchReservations = async () => {
    setLoading(true);
    try {
      const response = await axios.get("http://localhost:8084/reserva/listar");
      console.log("Datos recibidos:", response.data);
      
      const validReservations = response.data.filter(reserva => 
        reserva.idReserva && reserva.persona
      );
      
      setReservations(validReservations);
    } catch (error) {
      console.error("Error al obtener reservas:", error);
    } finally {
      setLoading(false);
    }
  };

  // Eliminar reserva
  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:8084/reserva/${id}`);
      // Actualizar la lista después de eliminar
      fetchReservations();
      alert("Reserva eliminada correctamente");
    } catch (error) {
      console.error("Error al eliminar reserva:", error);
      alert("Error al eliminar la reserva");
    }
  };

  // Manejar edición
  const handleEdit = (reserva) => {
    setSelectedReserva(reserva);
    setEditMode(true);
  };

  // Manejar cambios en los campos editables
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setSelectedReserva(prev => ({
      ...prev,
      [name]: value,
      persona: {
        ...prev.persona,
        [name]: value
      }
    }));
  };

  // Actualizar reserva
  const handleUpdate = async () => {
    try {
      await axios.put(`http://localhost:8084/reserva/Update/${selectedReserva.idReserva}`, selectedReserva);
      setEditMode(false);
      setSelectedReserva(null);
      fetchReservations();
      alert("Reserva actualizada correctamente");
    } catch (error) {
      console.error("Error al actualizar reserva:", error);
      alert("Error al actualizar la reserva");
    }
  };

  return (
    <div className="container">
      <h1>Lista de Reservas</h1>
      <button onClick={fetchReservations} disabled={loading}>
        {loading ? "Cargando..." : "Ver reservas"}
      </button>

      <div className="reservas-container">
        {reservations.map((reserva) => (
          <div key={`reserva-${reserva.idReserva}`} className="reserva-card">
            {editMode && selectedReserva?.idReserva === reserva.idReserva ? (
              <div>
                <h3>Editando Reserva #{reserva.idReserva}</h3>
                <div>
                  <label>Check-in:</label>
                  <input
                    type="text"
                    name="checkIn"
                    value={selectedReserva.checkIn}
                    onChange={handleInputChange}
                  />
                </div>
                <div>
                  <label>Check-out:</label>
                  <input
                    type="text"
                    name="checkOut"
                    value={selectedReserva.checkOut}
                    onChange={handleInputChange}
                  />
                </div>
                <div>
                  <label>Nombre:</label>
                  <input
                    type="text"
                    name="nombre"
                    value={selectedReserva.persona.nombre}
                    onChange={handleInputChange}
                  />
                </div>
                <div>
                  <label>Apellido:</label>
                  <input
                    type="text"
                    name="apellidos"
                    value={selectedReserva.persona.apellidos}
                    onChange={handleInputChange}
                  />
                </div>
                <div>
                  <label>Email:</label>
                  <input
                    type="text"
                    name="email"
                    value={selectedReserva.persona.email}
                    onChange={handleInputChange}
                  />
                </div>
                <button onClick={handleUpdate}>Guardar</button>
                <button onClick={() => setEditMode(false)}>Cancelar</button>
              </div>
            ) : (
              <div>
                <h3>Reserva #{reserva.idReserva}</h3>
                <p><strong>Fechas:</strong> {reserva.checkIn} al {reserva.checkOut}</p>
                
                {reserva.hotel && Object.keys(reserva.hotel).length > 0 && (
                  <div className="hotel-info">
                    <h4>Hotel</h4>
                    <p><strong>Nombre:</strong> {reserva.hotel.nombre}</p>
                    {reserva.hotel.direccion && <p><strong>Dirección:</strong> {reserva.hotel.direccion}</p>}
                  </div>
                )}
                
                {reserva.habitacion && Object.keys(reserva.habitacion).length > 0 && (
                  <div className="habitacion-info">
                    <h4>Habitación</h4>
                    <p><strong>Tipo:</strong> {reserva.habitacion.tipo}</p>
                    {reserva.habitacion.capacidad && <p><strong>Capacidad:</strong> {reserva.habitacion.capacidad}</p>}
                  </div>
                )}
                
                <div className="persona-info">
                  <h4>Cliente</h4>
                  <p><strong>Nombre:</strong> {reserva.persona.nombre} {reserva.persona.apellidos}</p>
                  <p><strong>Email:</strong> {reserva.persona.email}</p>
                  {reserva.persona.telefono && <p><strong>Teléfono:</strong> {reserva.persona.telefono}</p>}
                </div>
                
                <div className="reserva-actions">
                  <button onClick={() => handleEdit(reserva)}>Editar</button>
                  <button onClick={() => handleDelete(reserva.idReserva)}>Eliminar</button>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

export default Search;