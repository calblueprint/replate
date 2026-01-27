import { StyleSheet } from 'react-native';

const REGULAR = 'Lato_400Regular';
const BOLD = 'Lato_700Bold';

export const myAccountStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  scrollContent: {
    padding: 20,
    paddingBottom: 100,
  },
  avatarContainer: {
    alignItems: 'center',
    marginTop: 20,
    marginBottom: 16,
  },
  avatar: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: '#1d3557',
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarText: {
    fontSize: 24,
    fontFamily: BOLD,
    color: '#fff',
  },
  nameDisplay: {
    fontSize: 24,
    fontFamily: REGULAR,
    textAlign: 'center',
    color: '#000',
    marginBottom: 32,
  },
  fieldContainer: {
    marginBottom: 24,
  },
  fieldContainerLast: {
    marginBottom: 32,
  },
  fieldLabel: {
    fontSize: 12,
    fontFamily: BOLD,
    color: '#525454',
    textTransform: 'uppercase',
    marginBottom: 8,
  },
  nameRow: {
    flexDirection: 'row',
    gap: 12,
  },
  nameFieldBox: {
    flex: 1,
    borderWidth: 0.7,
    borderColor: '#1d3557',
    borderRadius: 5,
    padding: 12,
  },
  fieldBox: {
    borderWidth: 0.7,
    borderColor: '#111111',
    borderRadius: 5,
    padding: 12,
  },
  fieldText: {
    fontSize: 15,
    fontFamily: REGULAR,
    color: '#2c2c2c',
  },
  fieldTextDark: {
    fontSize: 15,
    fontFamily: REGULAR,
    color: '#131414',
  },
  logoutButton: {
    backgroundColor: '#58ad85',
    padding: 13,
    borderRadius: 10,
    alignItems: 'center',
    width: '100%',
  },
  logoutButtonText: {
    color: 'white',
    fontSize: 16,
    fontFamily: BOLD,
  },
});
