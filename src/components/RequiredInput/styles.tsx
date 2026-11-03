import { StyleSheet } from 'react-native';
import colors from '@/styles/colors';

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
    color: colors.black,
    fontFamily: 'Lato',
  },
  requiredText: {
    color: colors.missingRed,
    fontSize: 14,
    fontFamily: 'Lato',
  },
  input: {
    borderWidth: 1,
    borderColor: colors.white,
    borderRadius: 8,
    paddingVertical: 14,
    paddingHorizontal: 20,
    fontSize: 14,
    backgroundColor: 'white',
    fontFamily: 'Lato',
  },
  placeholderText: {
    color: colors.filterGray,
  },
  dropdownInputOpen: {
    borderColor: colors.jasmine,
  },
  dropdownContainer: {
    borderColor: colors.lightBg,
    borderRadius: 8,
  },
  dropdownText: {
    fontSize: 14,
    color: colors.black,
    fontFamily: 'Lato',
  },
  errorBorder: {
    borderColor: colors.missingRed,
  },
  focusBorder: {
    borderColor: colors.jasmine,
  },
  selectedItemContainer: {
    backgroundColor: colors.lightBg,
  },
  selectedItemLabel: {
    color: colors.black,
    fontFamily: 'Lato',
    fontSize: 14,
    fontWeight: '500',
  },
});
