import React from 'react';
import { LineChart } from 'react-native-chart-kit';

const Chart = ({ data, width, height }) => (
  <LineChart
    data={data}
    width={width}
    height={height}
    chartConfig={{
      backgroundGradientFrom: '#fff',
      backgroundGradientTo: '#fff',
      color: (opacity = 1) => `rgba(0,0,0,${opacity})`,
    }}
    bezier
  />
);

export default Chart;
