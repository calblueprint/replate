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
    fontSize: 16,
    fontWeight: '600',
    color: '#6E6E6E',
  },

  requiredText: {
    color: '#DE3B40',
    fontSize: 14,
    fontWeight: '500',
  },

  input: {
    borderWidth: 1,
    borderColor: '#E0E0E0',
    borderRadius: 20, // <<< this makes it pill shape
    paddingVertical: 14,
    paddingHorizontal: 18,
    fontSize: 16,
    backgroundColor: 'white',
  },

  errorBorder: {
    borderColor: '#DE3B40',
  },

  picker: {
    width: '100%',
  },

  focusBorder: {
    borderColor: 'green',
  },
});
