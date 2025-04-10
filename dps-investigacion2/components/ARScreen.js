import React, { useState, useEffect } from 'react';
import { ScrollView, Text, Button, StyleSheet } from 'react-native';
import { LineChart } from 'react-native-chart-kit';
import { ProgressBar } from 'react-native-paper';
import { Dimensions } from 'react-native';
import SensorInfoBox from '../components/SensorInfoBox';
import Chart from '../components/Chart';
import { dashboardStyles } from '../styles/dashboardStyles';

const screenWidth = Dimensions.get('window').width;

const OPENWEATHER_API_KEY = 'bd22d69862f86bd92865d048b1cdca2c'; // Tu clave API de OpenWeather
const BASE_URL = 'https://api.openweathermap.org/data/2.5/weather';

export default function Dashboard() {
  const [temperature, setTemperature] = useState(null);
  const [humidity, setHumidity] = useState(null);
  const [sensorState, setSensorState] = useState('Activo');
  const [sensorLocation, setSensorLocation] = useState('Cargando...');
  const [chartData, setChartData] = useState({
    labels: ['10:00', '10:05', '10:10'],
    datasets: [
      { data: [1013, 1014, 1015], color: () => '#007aff' },
      { data: [63, 64, 66], color: () => '#2e8b57' },
      { data: [1011, 1010, 1009], color: () => '#555' },
    ],
    legend: ['Humedad', 'Temperatura', 'Pressure'],
  });

  useEffect(() => {
    // Obtener la ubicación del sensor
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;

        // Aquí hacemos la llamada a la API de OpenWeather
        fetch(`${BASE_URL}?lat=${latitude}&lon=${longitude}&appid=${OPENWEATHER_API_KEY}&units=metric`)
          .then((response) => response.json())
          .then((data) => {
            // Extraemos la temperatura y la humedad desde la respuesta de la API
            setTemperature(data.main.temp); // Temperatura en grados Celsius
            setHumidity(data.main.humidity); // Humedad en porcentaje
            setSensorLocation(`Lat: ${latitude.toFixed(2)}, Lon: ${longitude.toFixed(2)}`);
          })
          .catch((error) => {
            console.error("Error al obtener los datos meteorológicos:", error);
            setSensorLocation('Ubicación no disponible');
          });
      },
      (error) => {
        setSensorLocation('Ubicación no disponible');
        console.error(error);
      },
      { enableHighAccuracy: true, timeout: 20000, maximumAge: 1000 }
    );

    const interval = setInterval(() => {
      setChartData(prevData => {
        const newLabel = new Date().toLocaleTimeString().slice(0, 5); // Hora actual
        return {
          labels: [...prevData.labels.slice(1), newLabel],
          datasets: prevData.datasets.map(dataset => ({
            ...dataset,
            data: [...dataset.data.slice(1), dataset.data[dataset.data.length - 1]], // Mantiene los valores estáticos
          })),
          legend: prevData.legend,
        };
      });
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  return (
    <ScrollView style={dashboardStyles.container}>
      <Text style={dashboardStyles.header}>Sensor Data</Text>

      <Chart data={chartData} width={screenWidth - 1} height={220} />

      <SensorInfoBox label="TEMPERATURE" value={temperature !== null ? `${temperature.toFixed(2)}°C` : 'Cargando...'} progress={temperature / 40} color="#4caf50" />
      <SensorInfoBox label="HUMIDITY" value={humidity !== null ? `${humidity.toFixed(2)}%` : 'Cargando...'} progress={humidity / 100} color="#2196f3" showPercentage />
      <SensorInfoBox label="Ubicación del sensor" value={sensorLocation} />
      <SensorInfoBox 
        label="Estado del sensor" 
        value={sensorState} 
        color={sensorState === 'Activo' ? 'green' : 'red'} 
      />

      <Button title="Actualizar manualmente" onPress={() => {
        // Este botón ya no hace nada ya que no simulamos los datos
      }} />
    </ScrollView>
  );
}
