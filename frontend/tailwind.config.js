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
      },
      borderRadius: {
        DEFAULT: '6px',
        md: '6px',
        lg: '6px',
      },
      minHeight: {
        touch: '44px',
      },
      boxShadow: {
        subtle: '0 1px 2px 0 rgba(0, 0, 0, 0.03)',
      },
      fontFamily: {
        sans: ['Inter', 'Segoe UI', 'system-ui', 'sans-serif'],
        mono: ['SFMono-Regular', 'Menlo', 'Monaco', 'Consolas', 'monospace'],
      },
    },
  },
  plugins: [],
};
