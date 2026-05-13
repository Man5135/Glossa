import { StyleSheet, Dimensions } from 'react-native';

const { width } = Dimensions.get('window');

export const styles = StyleSheet.create({
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#000'
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 15,
    paddingTop: 10,
    marginBottom: 20,
  },
  title: {
    fontSize: 22,
  },
  container: {
    flex: 1,
    paddingHorizontal: 20,
    alignItems: 'center',
  },
  progressTextContainer: {
    marginBottom: 20,
    opacity: 0.6,
  },
  progressText: {
    fontSize: 14,
    color: '#FFF',
  },
  card: {
    width: '100%',
    backgroundColor: 'rgba(26, 26, 26, 0.8)',
    borderRadius: 25,
    paddingVertical: 50,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: 'rgba(0, 240, 255, 0.3)',
    marginBottom: 40,
    shadowColor: "#00F0FF",
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.2,
    shadowRadius: 15,
    elevation: 5,
  },
  wordText: {
    fontSize: 48,
    fontWeight: 'bold',
    color: '#00F0FF',
    textAlign: 'center',
  },
  optionsContainer: {
    width: '100%',
  },
  optionButton: {
    marginBottom: 15,
    width: '100%',
  },
});