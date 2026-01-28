import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  container: {
    width: '100%',
  },

  placeholder: {
    width: 315,
    height: 70,
    borderRadius: 11,
    marginLeft: 16,
    marginTop: 11,
    backgroundColor: '#F2F2F2',
    justifyContent: 'center',
    alignItems: 'center',
  },

  icon: {
    width: 160,
    height: 160,
  },

  image: {
    width: '100%',
    height: '100%',
    padding: 11,
    resizeMode: 'cover',
    borderRadius: 11,
  },
  imageWrapper: {
    width: '100%',
    aspectRatio: 4 / 3,
    overflow: 'hidden',
  },
});
