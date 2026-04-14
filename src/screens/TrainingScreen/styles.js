import { StyleSheet } from "react-native"

export const styles = StyleSheet.create = ({
  container: {
    flex: 1,
    backgroundColor: '#1A2A32',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 10,
    marginTop: 20,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});