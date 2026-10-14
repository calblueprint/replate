import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  container: {
    width: 66,
    height: 66,
    borderRadius: 6,
    overflow: 'hidden',
  },

  placeholder: {
    flex: 1,
    backgroundColor: '#CBD5E1',
    justifyContent: 'center',
    alignItems: 'center',
  },

  image: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
});
