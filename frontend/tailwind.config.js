/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Material Design 3 Dark Theme Palette (Expressive)
        m3: {
          primary: '#D0BCFF',         // Light purple
          onPrimary: '#381E72',       // Dark purple
          primaryContainer: '#4F378B', // Medium purple
          onPrimaryContainer: '#EADDFF',
          
          secondary: '#CCC2DC',       // Pastel grey-purple
          onSecondary: '#332D41',
          secondaryContainer: '#4A4458',
          onSecondaryContainer: '#E8DEF8',

          tertiary: '#EFB8C8',        // Warm pink
          onTertiary: '#492532',
          tertiaryContainer: '#633B48',
          onTertiaryContainer: '#FFD8E4',

          background: '#0F0D13',      // Sleek Dark Background
          onBackground: '#E6E1E5',

          surface: '#1D1B20',         // Material Card Surface
          onSurface: '#E6E1E5',
          surfaceVariant: '#49454F',
          onSurfaceVariant: '#CAC4D0',

          outline: '#938F99',
          error: '#F2B8B5',
          onError: '#601410'
        }
      },
      fontFamily: {
        display: ['Outfit', 'sans-serif'],
        sans: ['Inter', 'sans-serif'],
      },
      borderRadius: {
        '3xl': '24px', // Standard M3 large rounding
        '4xl': '32px', // Expressive extra rounding
      }
    },
  },
  plugins: [],
}
