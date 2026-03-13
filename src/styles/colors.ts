const colors = {
  // Brand primary (green) - consolidated from 15+ scattered greens
  primary: {
    50: '#E8F5EE', // lightest tint (backgrounds)
    100: '#D4F4E4', // success banner bg, progress button bg
    200: '#AEDDC4', // avatar bg, selected item bg, dropdown selected
    300: '#71C79F', // card accent, filled button bg (secondary)
    400: '#58AD85', // THE brand green - primary CTA, buttons, links
    500: '#3EA377', // avatar border, emphasis
    600: '#2D8A60', // subtext green
    700: '#427B60', // greeting/header text green
    800: '#1F6B47', // dark green accents
    900: '#0C3623', // darkest green
  },
  // Neutrals
  neutral: {
    50: '#F8FAFB', // lightest bg
    100: '#F1F4F7', // page backgrounds
    200: '#E2E8EE', // borders, dividers
    300: '#CBD5E0', // disabled borders
    400: '#A0AEC0', // placeholder text, inactive icons
    500: '#718096', // secondary text
    600: '#525454', // labels, input labels
    700: '#2D3748', // primary text
    800: '#1A202C', // headings
    900: '#0D1117', // near-black
  },
  // Semantic
  error: { light: '#FEE2E2', main: '#EF4444', dark: '#991B1B' },
  success: { light: '#D4F4E4', main: '#059669', dark: '#065F46' },
  warning: { light: '#FFF8EE', main: '#F59E0B', dark: '#92400E' },
  // Surfaces
  white: '#FFFFFF',
  black: '#000000', // kept for RN shadow compatibility; prefer neutral.900
  background: '#F1F4F7',
  card: '#FFFFFF',
} as const;

export default colors;
