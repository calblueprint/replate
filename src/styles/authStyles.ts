import { StyleSheet } from 'react-native';

const REGULAR = 'Lato';
const BOLD = 'LatoBold';
export const ERROR_COLOR = '#FF4444';

export const authStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  content: {
    padding: 20,
    paddingTop: 40,
    justifyContent: 'flex-start',
  },
  formCard: {
    width: '100%',
  },
  title: {
    fontSize: 24,
    fontFamily: BOLD,
    textAlign: 'left',
    marginBottom: 12,
    color: '#000',
  },
  subtitle: {
    fontSize: 14,
    fontFamily: REGULAR,
    textAlign: 'left',
    marginBottom: 24,
    color: '#666',
  },
  inputLabel: {
    fontSize: 11,
    fontFamily: BOLD,
    color: '#000',
    marginBottom: 8,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  input: {
    borderWidth: 1,
    borderRadius: 6,
    padding: 12,
    marginBottom: 24,
    fontSize: 14,
    fontFamily: REGULAR,
    backgroundColor: '#fff',
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
  passwordContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 0.8,
    borderRadius: 5,
    marginBottom: 16,
    backgroundColor: '#fff',
  },
  checkboxRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  checkboxBox: {
    width: 18,
    height: 18,
    borderWidth: 2,
    borderColor: '#000',
    borderRadius: 3,
    marginRight: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  checkboxMark: {
    color: '#fff',
    fontSize: 12,
    fontFamily: BOLD,
  },
  checkboxLabel: {
    fontFamily: REGULAR,
    color: '#000',
    fontSize: 14,
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
  showButtonText: {
    fontFamily: REGULAR,
    color: '#000',
    fontSize: 14,
  },
  showButtonTextGrey: {
    fontFamily: REGULAR,
    color: '#898989',
    fontSize: 14,
  },
  nameRow: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 16,
  },
  nameFieldContainer: {
    flex: 1,
  },
  inputHalf: {
    borderWidth: 1,
    borderRadius: 6,
    padding: 12,
    fontSize: 14,
    fontFamily: REGULAR,
    backgroundColor: '#fff',
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
  linkText: {
    textAlign: 'center',
    color: '#666',
    fontFamily: REGULAR,
    fontSize: 13,
  },
  link: {
    color: '#000',
    textDecorationLine: 'underline',
    fontFamily: BOLD,
  },
  logo: {
    fontSize: 24,
    fontFamily: BOLD,
    textAlign: 'center',
    marginBottom: 10,
  },
  buttonContainer: {
    marginTop: 12,
    marginBottom: 16,
  },
  orText: {
    textAlign: 'center',
    marginVertical: 16,
    color: '#666',
    fontFamily: REGULAR,
  },
  errorText: {
    fontSize: 11,
    fontFamily: REGULAR,
    color: ERROR_COLOR,
    marginTop: -16,
    marginBottom: 6,
    marginLeft: 2,
  },
  passwordRequirements: {
    marginTop: -6,
    marginBottom: 2,
  },
  requirementText: {
    fontSize: 11,
    fontFamily: REGULAR,
    marginBottom: 3,
    marginLeft: 2,
  },
  requirementMet: {
    color: '#4CAF50',
  },
  requirementUnmet: {
    color: ERROR_COLOR,
  },
  // Signup page specific styles
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
    marginBottom: 12,
    color: '#000',
  },
  subtitleCentered: {
    fontSize: 15,
    fontFamily: REGULAR,
    textAlign: 'center',
    marginBottom: 24,
    color: '#898989',
  },
  inputLabelDark: {
    fontSize: 12,
    fontFamily: BOLD,
    color: '#525454',
    marginBottom: 8,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
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
    backgroundColor: '#898989',
    marginRight: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  requirementCircleMet: {
    backgroundColor: '#58ad85',
  },
  requirementCheckmark: {
    width: 9,
    height: 9,
  },
  requirementTextDark: {
    fontSize: 12,
    fontFamily: REGULAR,
    color: '#000',
    lineHeight: 19.2, // 1.6 * 12
  },
  grayButton: {
    width: '100%',
    backgroundColor: '#58ad85',
    borderRadius: 10,
    paddingVertical: 13,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 50,
  },
  grayButtonText: {
    fontSize: 16,
    fontFamily: BOLD,
    color: '#fff',
    lineHeight: 30,
  },
  linkTextSignup: {
    textAlign: 'center',
    color: '#4f4f4f',
    fontFamily: REGULAR,
    fontSize: 14,
    marginTop: 16,
  },
  linkSignup: {
    color: '#58ad85',
    textDecorationLine: 'underline',
    fontFamily: BOLD,
  },
  // Common utility styles
  scrollViewFlex: {
    flex: 1,
  },
  scrollViewContent: {
    padding: 20,
    paddingTop: 40,
  },
  textBlack: {
    color: '#000',
  },
  forgotPasswordLink: {
    alignSelf: 'flex-start',
    marginBottom: 24,
  },
  forgotPasswordLinkText: {
    fontSize: 12,
  },
  hiddenInput: {
    height: 0.1,
    opacity: 0,
    position: 'absolute',
  },
  requirementCheckmarkMet: {
    tintColor: '#58ad85',
    opacity: 1,
  },
  requirementCheckmarkUnmet: {
    tintColor: '#898989',
    opacity: 0.5,
  },
  buttonEnabled: {
    backgroundColor: '#58ad85',
  },
});
