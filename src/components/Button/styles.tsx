import { StyleSheet } from 'react-native';
import colors from '../../styles/colors';

export default StyleSheet.create({
  disabledStyle: {
    borderRadius: 6,
    backgroundColor: '#9CA3AF',
  },
  buttonStyle: {
    borderRadius: 6,
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
