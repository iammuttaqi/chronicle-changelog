import type { Config } from 'tailwindcss'
import typography from '@tailwindcss/typography'

export default {
  content: [
    './components/**/*.{vue,js,ts}',
    './layouts/**/*.vue',
    './pages/**/*.vue',
    './composables/**/*.{js,ts}',
    './plugins/**/*.{js,ts}',
    './app.vue',
    './error.vue'
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'],
        mono: ['JetBrains Mono', 'ui-monospace', 'SFMono-Regular', 'Menlo', 'monospace']
      },
      colors: {
        canvas: '#fafaf9',
        card: '#ffffff',
        subtle: '#f5f5f4',
        accent: {
          DEFAULT: '#ea580c',
          hover: '#c2410c',
          subtle: '#ffedd5'
        }
      },
      boxShadow: {
        'paper-sm': '0 1px 2px 0 rgba(15, 23, 42, 0.04), 0 1px 3px 0 rgba(15, 23, 42, 0.02)',
        'paper-md': '0 4px 6px -1px rgba(15, 23, 42, 0.05), 0 2px 4px -2px rgba(15, 23, 42, 0.03)',
        'paper-lg': '0 10px 15px -3px rgba(15, 23, 42, 0.06), 0 4px 6px -4px rgba(15, 23, 42, 0.03)',
        'modal': '0 20px 25px -5px rgba(15, 23, 42, 0.1), 0 8px 10px -6px rgba(15, 23, 42, 0.05)'
      },
      typography: {
        DEFAULT: {
          css: {
            maxWidth: '100%',
            color: '#334155',
            lineHeight: '1.65',
            a: {
              color: '#ea580c',
              textDecoration: 'underline',
              textUnderlineOffset: '3px',
              fontWeight: '500',
              '&:hover': {
                color: '#c2410c'
              }
            },
            h1: {
              color: '#0f172a',
              fontWeight: '700',
              letterSpacing: '-0.02em'
            },
            h2: {
              color: '#0f172a',
              fontWeight: '600',
              letterSpacing: '-0.015em',
              marginTop: '1.5em',
              marginBottom: '0.6em'
            },
            h3: {
              color: '#0f172a',
              fontWeight: '600',
              letterSpacing: '-0.01em',
              marginTop: '1.25em',
              marginBottom: '0.5em'
            },
            code: {
              color: '#0f172a',
              backgroundColor: '#f5f5f4',
              padding: '0.2em 0.4em',
              borderRadius: '0.25rem',
              fontWeight: '500',
              fontSize: '0.875em'
            },
            'code::before': {
              content: '""'
            },
            'code::after': {
              content: '""'
            },
            pre: {
              backgroundColor: '#0f172a',
              color: '#f8fafc',
              borderRadius: '0.5rem',
              padding: '0.875rem 1rem',
              fontSize: '0.85em',
              overflowX: 'auto'
            },
            'pre code': {
              backgroundColor: 'transparent',
              color: 'inherit',
              padding: '0'
            },
            ul: {
              listStyleType: 'disc',
              paddingLeft: '1.25rem'
            },
            ol: {
              listStyleType: 'decimal',
              paddingLeft: '1.25rem'
            },
            li: {
              marginTop: '0.25rem',
              marginBottom: '0.25rem'
            },
            blockquote: {
              borderLeftColor: '#ea580c',
              color: '#475569',
              fontStyle: 'normal'
            }
          }
        }
      }
    }
  },
  plugins: [
    typography
  ]
} satisfies Config
