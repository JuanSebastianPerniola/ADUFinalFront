import React, { useEffect, useState } from 'react';
import axios from 'axios';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

function Search() {
  const [reservations, setReservations] = useState([]);
  const [searchOptions, setSearchOptions] = useState([]);
  const [selectedReservation, setSelectedReservation] = useState('');
  const [selectedDate, setSelectedDate] = useState(new Date());

  useEffect(() => {
    // Obtener lista de reservas
    axios.get('https://api.ejemplo.com/reservations')
      .then((response) => setReservations(response.data))
      .catch((error) => console.error('Error al obtener reservas:', error));
  }, []);

  const handleSearch = () => {
    // Hacer una petición POST con la fecha seleccionada
    axios.post('https://api.ejemplo.com/search', { date: selectedDate })
      .then((response) => setSearchOptions(response.data))
      .catch((error) => console.error('Error en búsqueda:', error));
  };

  return (
    <div>
      <h1>Search Page</h1>

      {/* Desplegable de Reservas */}
      <label>Seleccionar Reserva:</label>
      <select value={selectedReservation} onChange={(e) => setSelectedReservation(e.target.value)}>
        <option value="">-- Seleccionar --</option>
        {reservations.map((res) => (
          <option key={res.id} value={res.id}>{res.nombre}</option>
        ))}
      </select>

      {/* Calendario para elegir la fecha */}
      <label>Seleccionar fecha:</label>
      <DatePicker 
        selected={selectedDate} 
        onChange={(date) => setSelectedDate(date)} 
        dateFormat="yyyy-MM-dd"
      />

      <button onClick={handleSearch}>Buscar</button>

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
