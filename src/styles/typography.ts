import { StyleSheet } from 'react-native';

/** Typography scale synced to Figma Design System ("Typography" frame 665:274). */
export const typography = StyleSheet.create({
  h1: {
    fontSize: 36,
    fontFamily: 'LatoBold',
  },
  h1Caps: {
    fontSize: 32,
    fontFamily: 'LatoBold',
    letterSpacing: -3.2,
    textTransform: 'uppercase',
  },
  h2: {
    fontSize: 30,
    fontFamily: 'LatoBold',
  },
  h2Page: {
    fontSize: 20,
    fontFamily: 'Lato',
    letterSpacing: -1,
    textTransform: 'uppercase',
  },
  h3: {
    fontSize: 24,
    fontFamily: 'Lato',
  },
  h3Bold: {
    fontSize: 24,
    fontFamily: 'LatoBold',
  },
  h4: {
    fontSize: 14,
    fontFamily: 'LatoBold',
  },
  h4Bold: {
    fontSize: 18,
    fontFamily: 'LatoBold',
  },
  body1: {
    fontSize: 14,
    fontFamily: 'Lato',
  },
  body1Bold: {
    fontSize: 14,
    fontFamily: 'LatoBlack',
  },
  body2: {
    fontSize: 12,
    fontFamily: 'Lato',
  },
  body2Bold: {
    fontSize: 12,
    fontFamily: 'LatoBlack',
  },
  overline1: {
    fontSize: 14,
    fontFamily: 'LatoBlack',
    textTransform: 'uppercase',
  },
  overline2: {
    fontSize: 12,
    fontFamily: 'LatoBlack',
    textTransform: 'uppercase',
  },
});
