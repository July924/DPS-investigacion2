import React, { useState, useEffect, useCallback } from 'react';
import { ScrollView, Text, Button, StyleSheet } from 'react-native';
import { Dimensions } from 'react-native';
import SensorInfoBox from '../components/SensorInfoBox';
import Chart from '../components/Chart';
import { dashboardStyles } from '../styles/dashboardStyles';

const screenWidth = Dimensions.get('window').width;

const OPENWEATHER_API_KEY = 'bd22d69862f86bd92865d048b1cdca2c';
const BASE_URL = 'https://api.openweathermap.org/data/2.5/weather';

export default function Dashboard() {
  const [temperature, setTemperature] = useState(null);
  const [humidity, setHumidity] = useState(null);
  const [sensorState, setSensorState] = useState('Cargando...');
  const [sensorLocation, setSensorLocation] = useState('Cargando...');
  const [chartData, setChartData] = useState({
    labels: ['10:00', '10:05', '10:10'],
    datasets: [
      { data: [1013, 1014, 1015], color: () => '#007aff' },
      { data: [63, 64, 66], color: () => '#2e8b57' },
    ],
    legend: ['Humedad', 'Temperatura'],
  });

  const obtenerDatosSensor = useCallback(() => {
    setSensorState('Cargando...');

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;

        fetch(`${BASE_URL}?lat=${latitude}&lon=${longitude}&appid=${OPENWEATHER_API_KEY}&units=metric`)
          .then((response) => response.json())
          .then((data) => {
            setTemperature(data.main.temp);
            setHumidity(data.main.humidity);
            setSensorLocation(`Lat: ${latitude.toFixed(2)}, Lon: ${longitude.toFixed(2)}`);
            setSensorState('Activo');

            setChartData((prevData) => {
              const newLabel = new Date().toLocaleTimeString().slice(0, 5);
              return {
                labels: [...prevData.labels.slice(1), newLabel],
                datasets: [
                  {
                    ...prevData.datasets[0],
                    data: [...prevData.datasets[0].data.slice(1), data.main.humidity],
                  },
                  {
                    ...prevData.datasets[1],
                    data: [...prevData.datasets[1].data.slice(1), data.main.temp],
                  },
                ],
                legend: prevData.legend,
              };
            });
          })
          .catch((error) => {
            console.error("Error al obtener los datos meteorológicos:", error);
            setSensorLocation('Ubicación no disponible');
            setSensorState('Desactivado');
          });
      },
      (error) => {
        console.error("Error al obtener la ubicación:", error);
        setSensorLocation('Ubicación no disponible');
        setSensorState('Desactivado');
      },
      { enableHighAccuracy: true, timeout: 20000, maximumAge: 1000 }
    );
  }, []);

  useEffect(() => {
    obtenerDatosSensor();
    const interval = setInterval(() => {
      obtenerDatosSensor();
    }, 5000);
    return () => clearInterval(interval);
  }, [obtenerDatosSensor]);

  return (
    <ScrollView style={dashboardStyles.container}>
      <Text style={dashboardStyles.header}>Sensor</Text>

      <Chart data={chartData} width={screenWidth - 1} height={220} />

      <SensorInfoBox
        label="TEMPERATURA"
        value={temperature !== null ? `${temperature.toFixed(2)}` : 'Cargando...'}
        progress={temperature / 40}
        color="#4caf50"
      />
      <SensorInfoBox
        label="HUMEDAD"
        value={humidity !== null ? `${humidity.toFixed(2)}` : 'Cargando...'}
        progress={humidity / 100}
        color="#2196f3"
        showPercentage
      />
      <SensorInfoBox label="Ubicación del sensor" value={sensorLocation} />
      <SensorInfoBox
        label="Estado del sensor"
        value={sensorState}
        color={sensorState === 'Activo' ? 'green' : sensorState === 'Desactivado' ? 'red' : 'gray'}
      />

      <Button
        title="Actualizar manualmente"
        onPress={obtenerDatosSensor}
      />
    </ScrollView>
  );
}
