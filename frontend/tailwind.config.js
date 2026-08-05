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
        // Enterprise Neutral Palette
        app: {
          bg: '#FFFFFF',
          secondary: '#F8F9FA',
          sidebar: '#F5F5F5',
          border: '#E5E7EB',
          'text-primary': '#111827',
          'text-secondary': '#6B7280',
          accent: '#2563EB',
          'accent-hover': '#1D4ED8',
          success: '#16A34A',
          warning: '#D97706',
          error: '#DC2626',
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
