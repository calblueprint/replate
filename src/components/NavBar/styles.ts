import { ImageStyle, StyleSheet, TextStyle, ViewStyle } from 'react-native';
import colors from '../../styles/colors';

const TEXT_GRAY = '#9CA3AF';

type ContainerStyles = {
  wrapper: ViewStyle;
  card: ViewStyle;
  item: ViewStyle;
};

type TextStyles = {
  label: TextStyle;
  labelActive: TextStyle;
};

type IconStyles = {
  icon: ImageStyle;
  iconActive: ImageStyle;
  iconInactive: ImageStyle;
};

export const containerStyles = StyleSheet.create<ContainerStyles>({
  wrapper: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: '#E5E7EB',
  },
  card: {
    paddingTop: 12,
    paddingBottom: 18,
    paddingHorizontal: 40,

    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,

    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',

    shadowColor: '#000000',
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.08,
    shadowRadius: 10,
    elevation: 12,
  },
  item: {
    alignItems: 'center',
    justifyContent: 'center',
    gap: 4,
  },
});

export const textStyles = StyleSheet.create<TextStyles>({
  label: {
    fontSize: 14,
    color: TEXT_GRAY,
  },
  labelActive: {
    fontSize: 14,
    color: colors.jasmine,
    fontWeight: '600',
  },
});

export const iconStyles = StyleSheet.create<IconStyles>({
  icon: {
    width: 24,
    height: 24,
  },
  iconActive: {
    tintColor: colors.jasmine,
  },
  iconInactive: {
    tintColor: '#C7CFD6',
  },
});
