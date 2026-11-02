import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './app/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
    './lib/**/*.{ts,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        canvas: '#F3F1EC',
        'reading-surface': '#FAF8F4',
        'surface-raised': '#FFFFFF',
        'ink-strong': '#1C1B19',
        'ink-body': '#2E2C29',
        'ink-muted': '#6B6862',
        'ink-faint': '#9C988F',
        line: '#E4E0D8',
        accent: '#2F6B4F',
        'accent-hover': '#25553E',
        'accent-soft': '#E7F0EA',
        'status-processing': '#B5761E',
        'status-processing-bg': '#FBF3E4',
        'status-ready': '#2F6B4F',
        'status-ready-bg': '#E7F0EA',
        'status-failed': '#A8503C',
        'status-failed-bg': '#F7E9E4',
      },
      fontFamily: {
        serif: ['"Source Serif 4"', 'Georgia', 'serif'],
        sans: ['"Inter"', 'system-ui', 'sans-serif'],
      },
      fontSize: {
        display: ['2.125rem', { lineHeight: '2.625rem', letterSpacing: '-0.02em', fontWeight: '600' }],
        headline: ['1.3125rem', { lineHeight: '1.75rem', fontWeight: '600' }],
        'body-reading': ['1.0625rem', { lineHeight: '1.75', fontWeight: '400' }],
        'body-ui': ['0.9375rem', { lineHeight: '1.5', fontWeight: '400' }],
        label: ['0.8125rem', { lineHeight: '1.25rem', fontWeight: '500' }],
        caption: ['0.75rem', { lineHeight: '1rem', fontWeight: '400' }],
        micro: ['0.6875rem', { lineHeight: '0.875rem', fontWeight: '500' }],
      },
      borderRadius: {
        sm: '0.375rem',
        btn: '0.5rem',
        md: '0.625rem',
        lg: '0.875rem',
      },
      boxShadow: {
        'elevation-1': '0 1px 2px rgba(28,27,25,0.05)',
      },
      spacing: {
        'space-1': '0.25rem',
        'space-2': '0.5rem',
        'space-3': '0.75rem',
        'space-4': '1rem',
        'space-6': '1.5rem',
        'space-8': '2rem',
        'space-12': '3rem',
        'space-16': '4rem',
      },
    },
  },
  plugins: [],
}

export default config
