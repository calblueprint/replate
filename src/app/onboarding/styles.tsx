import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 20,
    justifyContent: 'space-between',
  },
  title: {
    fontSize: 20,
    fontWeight: '600',
    color: '#000',
    marginTop: 50,
    marginBottom: 42,
  },
  dropdownStyle: {
    borderColor: '#b0b0b0',
    borderWidth: 1,
    borderRadius: 8,
  },
  placeholderStyle: {
    color: '#888',
  },
  dropdownListStyle: {
    borderColor: '#b0b0b0',
    borderWidth: 1,
  },
  selectedItemContainer: {
    backgroundColor: '#AEDDC4',
  },
  buttonBase: {
    marginBottom: 35,
    paddingVertical: 16,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonEnabled: {
    backgroundColor: '#58AD85',
  },
  buttonDisabled: {
    backgroundColor: '#cccccc',
  },
  buttonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: 'bold',
  },
  backButton: {
    marginTop: 34,
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  backIcon: {
    fontSize: 23,
    color: '#888',
    marginRight: 4,
    transform: [{ translateY: -1 }],
  },
  backText: {
    fontSize: 17,
    color: '#888',
  },
});
