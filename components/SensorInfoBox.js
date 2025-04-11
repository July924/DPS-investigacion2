import React from 'react';
import { View, Text } from 'react-native';
import { ProgressBar } from 'react-native-paper';
import { dashboardStyles } from '../styles/dashboardStyles';

const SensorInfoBox = ({ label, value, progress, color, showPercentage }) => (
  <View style={dashboardStyles.infoBox}>
    <Text style={dashboardStyles.label}>{label}</Text>
    <Text style={dashboardStyles.value}>
      {value} 
      {label === 'TEMPERATURA' ? ' °C' : ''}
      {showPercentage && label === 'HUMEDAD' ? ' %' : ''}
    </Text>
    {progress !== undefined && <ProgressBar progress={progress} color={color || '#000'} />}
  </View>
);

export default SensorInfoBox;
