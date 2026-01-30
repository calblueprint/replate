import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  container: {
    marginBottom: 16,
  },
  labelRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 6,
  },
  label: {
    fontSize: 13,
    fontWeight: '500',
    color: '#525454',
    fontFamily: 'Lato',
  },
  requiredText: {
    color: '#FC5A61',
    fontSize: 12,
    fontWeight: '500',
    fontFamily: 'Lato',
  },
  input: {
    borderWidth: 0.8,
    borderColor: '#A9A9A980',
    borderRadius: 7,
    paddingVertical: 14,
    paddingHorizontal: 16,
    fontSize: 14,
    backgroundColor: 'white',
    fontFamily: 'Lato',
  },
  dropdownInputOpen: {
    borderColor: '#2D8A62B2',
  },
  dropdownContainer: {
    borderColor: '#E0E0E0',
    borderRadius: 7,
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
    borderColor: '#77C29F',
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
