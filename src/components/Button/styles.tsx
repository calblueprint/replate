import { StyleSheet } from 'react-native';
import colors from '../../styles/colors';

export default StyleSheet.create({
  disabledStyle: {
    borderRadius: 10,
    backgroundColor: '#b5b5b5',
  },
  buttonStyle: {
    borderRadius: 10,
    backgroundColor: '#1E40AF',
  },
  titleStyle: {
    paddingHorizontal: 20,
    paddingVertical: 12,
    color: colors.white,
    fontFamily: 'Lato_700Bold',
    fontSize: 15,
  },
  disabledTitleStyle: {
    paddingHorizontal: 20,
    paddingVertical: 12,
    color: colors.white,
    fontFamily: 'Lato_700Bold',
    fontSize: 15,
  },
});
