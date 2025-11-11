import { StyleSheet, TextStyle } from 'react-native';

type TypographyStyles = {
  h1: TextStyle;
  h2: TextStyle;
  h3: TextStyle;
  h4: TextStyle;
  p1: TextStyle;
  p2: TextStyle;
  p3: TextStyle;
};

// Add more components for different text elements if needed,
// or edit current component props according to the project's design system
export const typography: TypographyStyles = StyleSheet.create({
  h1: {
    fontSize: 32,
    fontFamily: 'Lato_700Bold',
  },
  h2: {
    fontSize: 28,
    fontFamily: 'Lato_700Bold',
  },
  h3: {
    fontSize: 24,
    fontFamily: 'Lato_700Bold',
  },
  h4: {
    fontSize: 20,
    fontFamily: 'Lato_700Bold',
  },
  p1: {
    fontSize: 16,
    fontFamily: 'Lato_400Regular',
  },
  p2: {
    fontSize: 14,
    fontFamily: 'Lato_400Regular',
  },
  p3: {
    fontSize: 12,
    fontFamily: 'Lato_400Regular',
  },
});
