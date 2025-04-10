import React, { useState, useEffect } from 'react';
import { ScrollView, Text, Button, StyleSheet } from 'react-native';
import { LineChart } from 'react-native-chart-kit';
import { ProgressBar } from 'react-native-paper';
import { Dimensions } from 'react-native';
import { actualizarDatos } from '../utils/api';
import SensorInfoBox from '../components/SensorInfoBox';
import Chart from '../components/Chart';
import { dashboardStyles } from '../styles/dashboardStyles';

const screenWidth = Dimensions.get('window').width;

export default function Dashboard() {
  const [temperature, setTemperature] = useState(22.5);
  const [humidity, setHumidity] = useState(65);
  const [sensorState, setSensorState] = useState('Activo');
  const [sensorLocation, setSensorLocation] = useState('San Salvador - San Salvador');
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
    const interval = setInterval(() => actualizarDatos(setTemperature, setHumidity, setSensorState, setChartData), 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <ScrollView style={dashboardStyles.container}>
      <Text style={dashboardStyles.header}>Sensor Data</Text>

      <Chart data={chartData} width={screenWidth - 1} height={220} />

      <SensorInfoBox label="TEMPERATURE" value={temperature} progress={temperature / 40} color="#4caf50" />
      <SensorInfoBox label="HUMIDITY" value={humidity} progress={humidity / 100} color="#2196f3" showPercentage />
      <SensorInfoBox label="Ubicación del sensor" value={sensorLocation} />
      <SensorInfoBox 
        label="Estado del sensor" 
        value={sensorState} 
        color={sensorState === 'Activo' ? 'green' : 'red'} 
      />

      <Button title="Actualizar manualmente" onPress={() => actualizarDatos(setTemperature, setHumidity, setSensorState, setChartData)} />
    </ScrollView>
  );
}
