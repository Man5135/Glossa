import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  header: { 
    padding: 20, 
    borderBottomWidth: 1, 
    borderBottomColor: '#eee' 
  },
  topicCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 20,
    backgroundColor: '#fff',
    borderRadius: 12,
    marginBottom: 10,
    elevation: 2,
  },
  lockedCard: { 
    backgroundColor: '#636363',
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
  }
});