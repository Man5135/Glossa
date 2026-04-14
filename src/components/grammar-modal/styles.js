import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.85)',
    justifyContent: 'flex-end',
  },
  sheet: {
    backgroundColor: '#121212',
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    height: SCREEN_HEIGHT * 0.8, // 80% высоты экрана
    paddingHorizontal: 20,
    paddingTop: 12,
  },
  dragIndicator: {
    width: 36,
    height: 4,
    backgroundColor: '#4E5F66',
    borderRadius: 2,
    alignSelf: 'center',
    marginBottom: 20,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 25,
  },
  titleContainer: {
    flex: 1,
    marginRight: 10,
  },
  title: {
    color: '#00F0FF',
    fontSize: 26,
    marginBottom: 4,
  },
  category: {
    color: '#4E5F66',
    fontSize: 14,
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  closeCircle: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'rgba(255,255,255,0.1)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  scrollContent: {
    paddingBottom: 40,
  },
  textContainer: {
    marginBottom: 25,
  },
  grammarText: {
    color: '#E0E0E0',
    fontSize: 18,
    lineHeight: 28,
  },
  exampleCard: {
    backgroundColor: '#1E2B32',
    padding: 20,
    borderRadius: 20,
    borderLeftWidth: 5,
    borderLeftColor: '#00F0FF',
    marginBottom: 30,
  },
  exampleHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  exampleLabel: {
    color: '#00F0FF',
    fontSize: 12,
    fontWeight: 'bold',
    marginLeft: 6,
    textTransform: 'uppercase',
  },
  exampleText: {
    color: '#FFFFFF',
    fontSize: 22,
    fontStyle: 'italic',
  },
  actionButton: {
    backgroundColor: '#00F0FF',
    height: 60,
    borderRadius: 18,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#00F0FF',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
  },
  actionButtonText: {
    color: '#000',
    fontWeight: '800',
    fontSize: 16,
  },
});