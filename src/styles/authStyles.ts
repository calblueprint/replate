import { StyleSheet } from 'react-native';

const REGULAR = 'Lato_400Regular';
const BOLD = 'Lato_700Bold';
export const ERROR_COLOR = '#FF4444';

export const authStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  content: {
    flex: 1,
    padding: 24,
    paddingTop: 60,
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
    marginBottom: 40,
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
    borderWidth: 1,
    borderRadius: 6,
    marginBottom: 24,
    backgroundColor: '#fff',
  },
  inputInner: {
    padding: 12,
    fontSize: 14,
    fontFamily: REGULAR,
  },
  passwordContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderRadius: 6,
    marginBottom: 24,
    backgroundColor: '#fff',
  },
  checkboxRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 24,
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
    fontSize: 14,
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
  nameRow: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 24,
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
    borderWidth: 1,
    borderRadius: 6,
    backgroundColor: '#fff',
  },
  inputHalfInner: {
    padding: 12,
    fontSize: 14,
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
    marginTop: 16,
    marginBottom: 24,
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
    marginTop: -20,
    marginBottom: 8,
    marginLeft: 2,
  },
});
