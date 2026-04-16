import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  header: { flexDirection: 'row', alignItems: 'center', padding: 15, height: 70 },
  prog: { flex: 1, marginLeft: 15 },
  main: { flex: 1, width: '100%', padding: 20 },
  footer: { padding: 20, borderTopWidth: 1, borderTopColor: '#eee' },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  cardContainer: { flex: 1, width: '100%' },
  innerCard: { padding: 15, backgroundColor: '#fff', borderRadius: 12 },
  wordImage: { width: '100%', height: 200, borderRadius: 12, marginBottom: 15 },
  row: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  translation: { color: '#666', marginTop: 5 },
  exampleBox: { marginTop: 15, padding: 10, backgroundColor: '#f9f9f9', borderRadius: 8 },
  badge: { backgroundColor: '#2196F3', padding: 5, borderRadius: 5, alignSelf: 'flex-start' },
  ruleBox: { padding: 15, backgroundColor: '#E3F2FD', borderRadius: 8, marginVertical: 15 },
  marginV: { marginVertical: 10 },
  optionBtn: { padding: 15, borderWidth: 1, borderColor: '#ddd', borderRadius: 10, marginVertical: 8 },
});