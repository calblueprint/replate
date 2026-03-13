/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{js,jsx,ts,tsx}'],
  presets: [require('nativewind/preset')],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#E8F5EE',
          100: '#D4F4E4',
          200: '#AEDDC4',
          300: '#71C79F',
          400: '#58AD85',
          500: '#3EA377',
          600: '#2D8A60',
          700: '#427B60',
          800: '#1F6B47',
          900: '#0C3623',
        },
        neutral: {
          50: '#F8FAFB',
          100: '#F1F4F7',
          200: '#E2E8EE',
          300: '#CBD5E0',
          400: '#A0AEC0',
          500: '#718096',
          600: '#525454',
          700: '#2D3748',
          800: '#1A202C',
          900: '#0D1117',
        },
        error: {
          light: '#FEE2E2',
          DEFAULT: '#EF4444',
          dark: '#991B1B',
        },
        success: {
          light: '#D4F4E4',
          DEFAULT: '#059669',
          dark: '#065F46',
        },
        warning: {
          light: '#FFF8EE',
          DEFAULT: '#F59E0B',
          dark: '#92400E',
        },
        background: '#F1F4F7',
        card: '#FFFFFF',
      },
      fontFamily: {
        heading: ['Lato-Black'],
        subheading: ['Lato-Bold'],
        label: ['Lato-Bold'],
        body: ['Lato-Regular'],
        'body-medium': ['Lato-Bold'],
      },
      boxShadow: {
        sm: '0 2px 4px rgba(0,0,0,0.06)',
        md: '0 4px 12px rgba(0,0,0,0.12)',
        lg: '0 8px 20px rgba(0,0,0,0.15)',
        header: '0 4px 12px rgba(0,0,0,0.08)',
      },
    },
  },
  plugins: [],
};
