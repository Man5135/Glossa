import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  header: { 
    paddingTop: 20,          // Отступ сверху (чтобы не прилипало к краю)
    paddingBottom: 20,
    paddingHorizontal: 20,
    alignItems: 'center',    // Центрирует элементы по горизонтали
    justifyContent: 'center',
    
  },

  headerTitle: {
    fontSize: 28,
    textAlign: 'center',
    marginBottom: 5,
    fontWeight: 'bold',
  },
  
  headerSubtitle: {
    color: '#888',
    fontSize: 14,
    textAlign: 'center',
    letterSpacing: 1.2,
    textTransform: 'uppercase', // Делает текст маленьким, но важным
  },
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 20,
    borderRadius: 12,
    marginBottom: 10,
    elevation: 2,
  },
  lockedCard: { 
    borderRadius: 5,
    elevation: 0 
  },
  category: { 
    color: '#2196F3', 
    marginBottom: 4 
  },
  lockedText: { 
    color: '#aaa' 
  },
  topicInfo: { 
    flex: 1 
  },
});