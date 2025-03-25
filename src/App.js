import React, { useEffect, useState } from 'react';
import axios from 'axios';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

function Search() {
  const [reservations, setReservationList] = useState([]);
  const [searchOptions, setSearchOptions] = useState([]);
  const [selectedReservation, setSelectedReservation] = useState(null);
  const [selectedDate, setSelectedDate] = useState(new Date());

  useEffect(() => {
    // Obtener lista de reservas desde el backend
    axios.get('https://localhost:8080/reserva/reservationList') // Ajustar la URL
      .then((response) => setReservationList(response.data))
      .catch((error) => console.error('Error al obtener reservas:', error));
  }, []);

  const handleSearch = () => {
    // Hacer una petición POST con la fecha seleccionada (ajustar la URL del backend)
    axios.post('http://localhost:8080/reserva/search', { date: selectedDate }) // Ajustar la URL
      .then((response) => setSearchOptions(response.data))
      .catch((error) => console.error('Error en búsqueda:', error));
  };

  const handleReservationClick = (idReserva) => {
    // Filtrar la reserva seleccionada y mostrarla
    const reservaSeleccionada = reservations.find(res => res.idReserva === idReserva);
    setSelectedReservation(reservaSeleccionada);
  };

  return (
    <div>
      <h1>Search Page</h1>

      {/* Botones para listar las reservas */}
      <div>
        <h3>Reservas hechas:</h3>
        {reservations.map((res) => (
          <button 
            key={res.idReserva} 
            onClick={() => handleReservationClick(res.idReserva)}
            style={{ marginBottom: '10px', padding: '10px' }}
          >
            Reserva {res.idReserva} - {res.persona.nombre}
          </button>
        ))}
      </div>

      {/* Calendario para elegir la fecha */}
      <div>
        <label>Seleccionar fecha:</label>
        <DatePicker
          selected={selectedDate}
          onChange={(date) => setSelectedDate(date)}
          dateFormat="yyyy-MM-dd"
        />
        <button onClick={handleSearch}>Buscar</button>
      </div>

      {/* Mostrar los detalles de la reserva seleccionada */}
      {selectedReservation && (
        <div>
          <h3>Detalles de la Reserva:</h3>
          <p><strong>ID de Reserva:</strong> {selectedReservation.idReserva}</p>
          <p><strong>Persona:</strong> {selectedReservation.persona.nombre}</p>
          <p><strong>Hotel:</strong> {selectedReservation.hotel.nombre}</p>
          <p><strong>Check-in:</strong> {selectedReservation.checkIn}</p>
          <p><strong>Check-out:</strong> {selectedReservation.checkOut}</p>
        </div>
      )}

      {/* Resultados de búsqueda */}
      {searchOptions.length > 0 && (
        <ul>
          {searchOptions.map((item, index) => (
            <li key={index}>{item.resultado}</li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default Search;
