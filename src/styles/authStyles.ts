import { StyleSheet } from 'react-native';

export const authStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  content: {
    flex: 1,
    padding: 20,
    justifyContent: 'center',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    textAlign: 'left',
    marginTop: 20,
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 16,
    textAlign: 'left',
    marginBottom: 30,
    color: '#666',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 12,
    marginBottom: 16,
    fontSize: 16,
  },
  passwordContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    marginBottom: 16,
  },
  passwordInput: {
    flex: 1,
    padding: 12,
    fontSize: 16,
  },
  showButton: {
    padding: 12,
  },
  showButtonText: {
    fontWeight: '500',
  },
  inputHalf: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 12,
    marginBottom: 8,
    fontSize: 16,
    flex: 1,
    marginLeft: 3,
    marginRight: 3,
  },
  linkText: {
    textAlign: 'center',
    marginTop: 20,
    color: '#666',
  },
  link: {
    color: '#007AFF',
    textDecorationLine: 'underline',
  },
  inputContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  logo: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 10,
  },
  buttonContainer: {
    paddingHorizontal: 20,
    paddingVertical: 10,
  },
  orText: {
    textAlign: 'center',
    marginVertical: 16,
    color: '#666',
  },
});
