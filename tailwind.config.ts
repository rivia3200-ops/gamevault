import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './contexts/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        // Core backgrounds
        background:  '#0a0a0f',
        surface: {
          DEFAULT: '#13131a',
          hover:   '#1e1e2e',
        },
        // Borders
        border: {
          DEFAULT: '#2a2a3e',
          subtle:  '#1e1e2e',
        },
        // Accent (CrazyGames-style purple)
        accent: {
          DEFAULT: '#6c63ff',
          hover:   '#5a52e0',
          muted:   '#3d3680',
          glow:    'rgba(108, 99, 255, 0.3)',
        },
        // Text
        primary:   '#ffffff',
        secondary: '#8888aa',
        muted:     '#555570',
        // Status
        success:   '#22c55e',
        warning:   '#f59e0b',
        danger:    '#ef4444',
        info:      '#3b82f6',
        // Overlay
        overlay:   'rgba(0,0,0,0.7)',
      },

      fontFamily: {
        sans:    ['var(--font-inter)',         'system-ui', 'sans-serif'],
        display: ['var(--font-space-grotesk)', 'var(--font-inter)', 'system-ui', 'sans-serif'],
      },

      fontSize: {
        '2xs': ['0.625rem', { lineHeight: '0.875rem' }],
        xs:    ['0.75rem',  { lineHeight: '1rem' }],
        sm:    ['0.875rem', { lineHeight: '1.25rem' }],
        base:  ['1rem',     { lineHeight: '1.5rem' }],
        lg:    ['1.125rem', { lineHeight: '1.75rem' }],
        xl:    ['1.25rem',  { lineHeight: '1.75rem' }],
        '2xl': ['1.5rem',   { lineHeight: '2rem' }],
        '3xl': ['1.875rem', { lineHeight: '2.25rem' }],
        '4xl': ['2.25rem',  { lineHeight: '2.5rem' }],
        '5xl': ['3rem',     { lineHeight: '1' }],
      },

      spacing: {
        navbar:  '64px',
        sidebar: '240px',
      },

      screens: {
        xs:  '480px',
        sm:  '640px',
        md:  '768px',
        lg:  '1024px',
        xl:  '1280px',
        '2xl': '1536px',
      },

      borderRadius: {
        sm:  '4px',
        DEFAULT: '8px',
        md:  '8px',
        lg:  '12px',
        xl:  '16px',
        '2xl': '20px',
        full: '9999px',
      },

      boxShadow: {
        card:   '0 4px 12px rgba(0,0,0,0.4)',
        'card-hover': '0 8px 24px rgba(0,0,0,0.6)',
        accent: '0 4px 20px rgba(108,99,255,0.35)',
        glow:   '0 0 20px rgba(108,99,255,0.4)',
        inner:  'inset 0 1px 0 rgba(255,255,255,0.05)',
      },

      backgroundImage: {
        'gradient-accent':  'linear-gradient(135deg, #6c63ff 0%, #5a52e0 100%)',
        'gradient-card':    'linear-gradient(180deg, rgba(108,99,255,0.08) 0%, transparent 100%)',
        'gradient-overlay': 'linear-gradient(0deg, rgba(0,0,0,0.85) 0%, rgba(0,0,0,0.4) 50%, transparent 100%)',
        'gradient-sidebar': 'linear-gradient(180deg, #13131a 0%, #0f0f16 100%)',
        'grid-pattern':     'radial-gradient(#2a2a3e 1px, transparent 1px)',
      },

      backgroundSize: {
        'grid-sm': '24px 24px',
        'grid-md': '40px 40px',
      },

      animation: {
        'fade-in':       'fadeIn 0.2s ease-in-out',
        'fade-up':       'fadeUp 0.3s ease-out',
        'slide-in-left': 'slideInLeft 0.25s ease-out',
        'slide-in-right':'slideInRight 0.25s ease-out',
        'slide-up':      'slideUp 0.25s ease-out',
        'scale-in':      'scaleIn 0.15s ease-out',
        'pulse-accent':  'pulseAccent 2s infinite',
        'spin-slow':     'spin 3s linear infinite',
        'bounce-subtle': 'bounceSlight 1s ease-in-out infinite',
      },

      keyframes: {
        fadeIn: {
          '0%':   { opacity: '0' },
          '100%': { opacity: '1' },
        },
        fadeUp: {
          '0%':   { opacity: '0', transform: 'translateY(12px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        slideInLeft: {
          '0%':   { transform: 'translateX(-100%)' },
          '100%': { transform: 'translateX(0)' },
        },
        slideInRight: {
          '0%':   { transform: 'translateX(100%)' },
          '100%': { transform: 'translateX(0)' },
        },
        slideUp: {
          '0%':   { transform: 'translateY(100%)' },
          '100%': { transform: 'translateY(0)' },
        },
        scaleIn: {
          '0%':   { transform: 'scale(0.95)', opacity: '0' },
          '100%': { transform: 'scale(1)',    opacity: '1' },
        },
        pulseAccent: {
          '0%, 100%': { boxShadow: '0 0 0 0 rgba(108,99,255,0.4)' },
          '50%':      { boxShadow: '0 0 0 8px rgba(108,99,255,0)' },
        },
        bounceSlight: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%':      { transform: 'translateY(-3px)' },
        },
      },

      transitionTimingFunction: {
        spring: 'cubic-bezier(0.34, 1.56, 0.64, 1)',
      },

      zIndex: {
        navbar:  '50',
        sidebar: '40',
        overlay: '45',
        modal:   '60',
        tooltip: '70',
      },
    },
  },
  plugins: [
    require('@tailwindcss/typography'),
  ],
}

export default config
