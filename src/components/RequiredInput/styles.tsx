import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  container: {
    marginBottom: 24,
  },
  labelRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginBottom: 10,
  },
  label: {
    fontSize: 14,
    color: '#000000',
    fontFamily: 'Lato',
  },
  requiredText: {
    color: '#EF4444',
    fontSize: 14,
    fontFamily: 'Lato',
  },
  input: {
    borderWidth: 1,
    borderColor: '#FFFFFF',
    borderRadius: 8,
    paddingVertical: 14,
    paddingHorizontal: 20,
    fontSize: 14,
    backgroundColor: 'white',
    fontFamily: 'Lato',
  },
  placeholderText: {
    color: '#A3A3A3',
  },
  dropdownInputOpen: {
    borderColor: '#58AD85',
  },
  dropdownContainer: {
    borderColor: '#E0E0E0',
    borderRadius: 8,
  },
  dropdownText: {
    fontSize: 14,
    color: '#000',
    fontFamily: 'Lato',
  },
  errorBorder: {
    borderColor: '#DE3B40',
  },
  focusBorder: {
    borderColor: '#58AD85',
  },
  selectedItemContainer: {
    backgroundColor: '#AEDDC4',
  },
  selectedItemLabel: {
    color: '#222222',
    fontFamily: 'Lato',
    fontSize: 14,
    fontWeight: '500',
  },
});
