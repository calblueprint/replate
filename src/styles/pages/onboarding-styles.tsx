import { StyleSheet } from 'react-native';
import colors from '../colors';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.backgroundSecondary,
    paddingHorizontal: 16,
    paddingTop: 65,
    paddingBottom: 20,
    justifyContent: 'space-between',
  },
  header: {
    alignItems: 'center',
    marginBottom: 38,
  },
  welcomeTitle: {
    fontSize: 30,
    fontFamily: 'LatoBold',
    color: colors.secondaryGreen,
    marginBottom: 4,
  },
  welcomeSubtitle: {
    fontSize: 15,
    fontFamily: 'Lato',
    color: colors.textTertiary,
  },
  title: {
    fontSize: 20,
    fontFamily: 'LatoBold',
    color: colors.black,
    marginBottom: 16,
  },
  textStyle: {
    fontSize: 14,
    fontFamily: 'Lato',
  },
  dropdownStyle: {
    width: '100%',
    height: 48,
    borderColor: colors.borderPrimary,
    borderWidth: 1,
    borderRadius: 7,
    backgroundColor: colors.white,
    paddingHorizontal: 18,
  },
  dropdownOpenStyle: {
    borderColor: colors.primaryGreen,
  },
  placeholderStyle: {
    color: colors.textTertiary,
    fontFamily: 'Lato',
    fontSize: 14,
  },
  dropdownListStyle: {
    borderColor: colors.white,
    borderWidth: 0,
    marginTop: 8,
    paddingVertical: 6,
    paddingHorizontal: 6,
    borderRadius: 16,
    backgroundColor: colors.white,
    shadowColor: '#2D8A62',
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.15,
    shadowRadius: 15,
    elevation: 6,
  },
  selectedItemContainer: {
    backgroundColor: colors.profileBg,
    borderRadius: 8,
  },
  itemContainerStyle: {
    height: 46,
    width: '100%',
    justifyContent: 'center',
    paddingHorizontal: 16,
  },
  buttonBase: {
    marginBottom: 26,
    height: 56,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonEnabled: {
    backgroundColor: colors.primaryGreen,
  },
  buttonDisabled: {
    backgroundColor: colors.fillInactive,
  },
  buttonText: {
    color: colors.white,
    fontSize: 16,
    fontFamily: 'LatoBold',
  },
});
