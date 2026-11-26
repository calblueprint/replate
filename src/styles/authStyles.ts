import { StyleSheet } from 'react-native';
import colors from './colors';

const REGULAR = 'Lato';
const BOLD = 'LatoBold';
export const ERROR_COLOR = colors.missingRed;

export const authStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.backgroundSecondary,
  },
  scrollViewFlex: {
    flex: 1,
  },
  scrollViewContent: {
    padding: 20,
    paddingTop: 40,
  },
  formCard: {
    width: '100%',
  },
  logoContainer: {
    alignItems: 'center',
    marginBottom: 24,
    marginTop: 20,
  },
  logoImage: {
    width: 80,
    height: 80,
    resizeMode: 'contain',
  },
  titleCentered: {
    fontSize: 30,
    fontFamily: BOLD,
    textAlign: 'center',
    marginBottom: 8,
    color: colors.secondaryGreen,
  },
  subtitleCentered: {
    fontSize: 15,
    fontFamily: REGULAR,
    textAlign: 'center',
    marginBottom: 24,
    color: colors.textTertiary,
  },
  inputLabelDark: {
    fontSize: 12,
    fontFamily: BOLD,
    color: colors.textTertiary,
    marginBottom: 8,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  inputWrapper: {
    borderWidth: 0.8,
    borderRadius: 5,
    marginBottom: 16,
    backgroundColor: '#fff',
  },
  inputInner: {
    padding: 12,
    fontSize: 15,
    fontFamily: REGULAR,
  },
  nameRow: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 16,
  },
  nameFieldContainer: {
    flex: 1,
  },
  inputHalfWrapper: {
    borderWidth: 0.8,
    borderRadius: 5,
    backgroundColor: '#fff',
  },
  inputHalfInner: {
    padding: 12,
    fontSize: 15,
    fontFamily: REGULAR,
  },
  passwordContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 0.8,
    borderRadius: 5,
    marginBottom: 16,
    backgroundColor: '#fff',
  },
  passwordInput: {
    flex: 1,
    padding: 12,
    fontSize: 15,
    fontFamily: REGULAR,
  },
  showButton: {
    padding: 12,
  },
  textBlack: {
    color: colors.black,
  },
  errorText: {
    fontSize: 12,
    fontFamily: REGULAR,
    color: ERROR_COLOR,
    marginTop: -10,
    marginBottom: 10,
    marginLeft: 2,
  },
  passwordRequirements: {
    marginTop: -6,
    marginBottom: 2,
  },
  requirementRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 2,
  },
  requirementCircle: {
    width: 11,
    height: 11,
    borderRadius: 8,
    backgroundColor: colors.textTertiary,
    marginRight: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  requirementCircleMet: {
    backgroundColor: colors.primaryGreen,
  },
  requirementCheckmark: {
    width: 9,
    height: 9,
  },
  requirementCheckmarkMet: {
    tintColor: colors.white,
    opacity: 1,
  },
  requirementCheckmarkUnmet: {
    tintColor: colors.white,
    opacity: 0.7,
  },
  requirementTextDark: {
    fontSize: 12,
    fontFamily: REGULAR,
    color: colors.black,
    lineHeight: 19.2,
  },
  buttonContainer: {
    marginTop: 12,
    marginBottom: 16,
  },
  primaryButton: {
    width: '100%',
    backgroundColor: colors.primaryGreen,
    borderRadius: 10,
    paddingVertical: 13,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 56,
  },
  buttonDisabled: {
    backgroundColor: colors.fillInactive,
  },
  primaryButtonText: {
    fontSize: 16,
    fontFamily: BOLD,
    color: colors.white,
    lineHeight: 30,
  },
  forgotPasswordLink: {
    alignSelf: 'flex-end',
    marginBottom: 16,
  },
  footerText: {
    textAlign: 'center',
    color: colors.textTertiary,
    fontFamily: REGULAR,
    fontSize: 14,
    marginTop: 16,
  },
  footerLink: {
    color: colors.secondaryGreen,
    textDecorationLine: 'underline',
    fontFamily: BOLD,
  },
  hiddenInput: {
    height: 0.1,
    opacity: 0,
    position: 'absolute',
  },
});
