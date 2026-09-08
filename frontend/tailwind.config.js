/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        moonrow: {
          50: '#FFF5F3',
          100: '#FFE9E4',
          200: '#FFD3C9',
          300: '#FFAFA0',
          400: '#FF7E66',
          500: '#FD451B', // MoonRow Signature Vermilion Accent
          600: '#E22610',
          700: '#B11006',
          800: '#8C120B',
          900: '#75150E',
          950: '#320F16',
          black: '#040811',
          canvas: '#FBFBFC',
          surface: '#F3F4F7',
          card: '#FFFFFF',
          border: '#E8EAED',
          gray: '#93969D',
        },
        // Design Token Semantic System mapped to CSS Variables
        token: {
          bg: 'var(--color-bg-primary)',
          secondary: 'var(--color-bg-secondary)',
          sidebar: 'var(--color-bg-sidebar)',
          card: 'var(--color-bg-card)',
          muted: 'var(--color-bg-muted)',
          border: 'var(--color-border)',
          'text-primary': 'var(--color-text-primary)',
          'text-secondary': 'var(--color-text-secondary)',
          'text-muted': 'var(--color-text-muted)',
          accent: 'var(--color-accent)',
          'accent-hover': 'var(--color-accent-hover)',
          success: 'var(--color-success)',
          warning: 'var(--color-warning)',
          error: 'var(--color-error)',
        },
      },
      fontSize: {
        '2xs': ['11px', '14px'],
        xs: ['12px', '16px'],
        sm: ['14px', '20px'],
        base: ['16px', '24px'],
        lg: ['20px', '28px'],
        xl: ['24px', '32px'],
        '2xl': ['28px', '36px'],
      },
      borderRadius: {
        'lg': '12px',
        'xl': '16px',
        '2xl': '20px',
        '3xl': '24px',
      },
      minHeight: {
        touch: '44px',
      },
      boxShadow: {
        subtle: '0 1px 2px 0 rgba(4, 8, 17, 0.04)',
        card: '0 1px 3px 0 rgba(4, 8, 17, 0.04), 0 1px 2px -1px rgba(4, 8, 17, 0.04)',
        elevated: '0 4px 12px -2px rgba(4, 8, 17, 0.08)',
      },
      fontFamily: {
        sans: ['"Plus Jakarta Sans"', 'Inter', 'Segoe UI', 'system-ui', 'sans-serif'],
        mono: ['SFMono-Regular', 'Menlo', 'Monaco', 'Consolas', 'monospace'],
      },
    },
  },
  plugins: [],
};
