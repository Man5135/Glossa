import { StyleSheet, Platform } from 'react-native';

export const styles = StyleSheet.create({
  topTabBar: {
    backgroundColor: '#1A2A32',
    height: 80,
    elevation: 0,
    shadowOpacity: 0,
    borderBottomWidth: 1,
    borderBottomColor: '#2A3A42',
  },
  bottomTabBar: {
    backgroundColor: '#1A2A32',
    borderTopWidth: 0,
    height: Platform.OS === 'ios' ? 85 : 65,
    paddingBottom: Platform.OS === 'ios' ? 25 : 10,
  },
  label: {
    fontSize: 12,
    fontWeight: '600',
    marginBottom: 2,
  },
  indicator: {
    backgroundColor: '#00F0FF',
    height: 3,
  },
});