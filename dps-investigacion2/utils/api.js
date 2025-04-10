export const actualizarDatos = (setTemperature, setHumidity, setSensorState, setChartData) => {
  setTemperature(parseFloat((Math.random() * 10 + 20).toFixed(1)));
  setHumidity(Math.floor(Math.random() * 40 + 40));
  setSensorState(Math.random() > 0.2 ? 'Activo' : 'Desconectado');
  
  setChartData(prevChartData => ({
    ...prevChartData,
    datasets: prevChartData.datasets.map(dataset => ({
      ...dataset,
      data: dataset.data.map(valor => valor + Math.random() * 2 - 1), // Simula variación
    })),
  }));
};
