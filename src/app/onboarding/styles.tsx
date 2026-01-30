import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 20,
    justifyContent: 'space-between',
  },
  imageContainer: {
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 40, // pushes the icon down from the header
    marginBottom: 10,
  },
  title: {
    fontSize: 20,
    fontWeight: '600',
    color: '#000',
    marginTop: 50,
    marginBottom: 42,
  },
  textStyle: {
    fontSize: 15,
  },
  dropdownStyle: {
    width: 355,
    height: 60,
    borderColor: '#b0b0b0',
    borderWidth: 1,
    borderRadius: 8,
  },
  dropdownOpenStyle: {
    borderColor: '#2D8A62', // green outline
  },
  placeholderStyle: {
    color: '#888',
  },
  dropdownListStyle: {
    borderColor: '#b0b0b0',
    borderWidth: 1,
    marginTop: 28,
    paddingVertical: 5,
    paddingHorizontal: 5,
    borderRadius: 8,
  },
  selectedItemContainer: {
    backgroundColor: '#AEDDC4',
    borderRadius: 8,
  },
  itemContainerStyle: {
    height: 50, // each item height
    width: 355, // inner width
    alignSelf: 'center', // centers the 319px items inside the 327px list
    justifyContent: 'center',
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
