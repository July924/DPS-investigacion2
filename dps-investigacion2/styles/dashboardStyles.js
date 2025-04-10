import { StyleSheet } from 'react-native';

export const dashboardStyles = StyleSheet.create({
  container: {
    padding: 16,
    backgroundColor: '#f4f4f4',
  },
  header: {
    fontSize: 24,
    marginBottom: 12,
    fontWeight: 'bold',
  },
  infoBox: {
    backgroundColor: '#fff',
    padding: 12,
    marginVertical: 6,
    borderRadius: 8,
    elevation: 2,
  },
  label: {
    fontSize: 14,
    color: '#777',
  },
  value: {
    fontSize: 18,
    fontWeight: '600',
    marginVertical: 4,
  },
});
