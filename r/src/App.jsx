// src/App.js
import React, { useState } from 'react';
import axios from 'axios';

function App() {
  const [city, setCity] = useState('');
  const [weather, setWeather] = useState(null);
  const [error, setError] = useState('');

  const API_KEY = import.meta.env.VITE_WEATHER_API_KEY; // Access the environment variable

  const getWeather = async () => {
    if (!city.trim()) {
      setError('Please enter a city');
      return;
    }

    if (!API_KEY) {
      setError('API key is not defined');
      return;
    }

    try {
      const response = await axios.get(
        `http://api.weatherstack.com/current?access_key=${API_KEY}&query=${city}&units=m`
      );

      console.log('API response:', response);
      setWeather(response.data);
      setError(''); // Clear any previous errors
    } catch (err) {
      console.error('API error:', err);

      if (err.response && err.response.status === 404) {
        setError('City not found, please try again');
      } else if (err.message) {
        setError(`Error: ${err.message}`);
      } else {
        setError('Error fetching weather data');
      }
      setWeather(null); // Clear previous weather data if an error occurs
    }
  };

  return (
    <div style={{ textAlign: 'center', padding: '20px' }}>
      <h1>Weather App</h1>
      <input
        type="text"
        placeholder="Enter city"
        value={city}
        onChange={(e) => setCity(e.target.value)}
      />
      <button onClick={getWeather}>Get Weather</button>

      {error && <p style={{ color: 'red' }}>{error}</p>}

      {weather && weather.current && (
        <div>
          <h3>{weather.location.name}, {weather.location.country}</h3>
          <p>Temperature: {weather.current.temperature}°C</p>
          <p>Weather: {weather.current.weather_descriptions[0]}</p>
          <p>Humidity: {weather.current.humidity}%</p>
          <p>Wind Speed: {weather.current.wind_speed} m/s</p>
        </div>
      )}
    </div>
  );
}

export default App;
