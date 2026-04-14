import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#1A2A32', padding: 20 },
  header: { alignItems: 'center', marginBottom: 30 },
  headerTitle: { fontSize: 32, color: '#FFF' },
  wordItem: {
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    padding: 15,
    borderRadius: 12,
    marginBottom: 10,
  },
  greekText: { color: '#FFF', fontSize: 18 },
  translationText: { color: '#ADB5BD', fontSize: 14 }
});