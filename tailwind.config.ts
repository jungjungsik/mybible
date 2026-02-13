import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      fontFamily: {
        serif: ['var(--font-noto-serif-kr)', 'Georgia', 'serif'],
        sans: ['var(--font-dm-sans)', 'system-ui', 'sans-serif'],
        display: ['var(--font-playfair)', 'Georgia', 'serif'],
      },
      colors: {
        bible: {
          // Light mode
          bg: '#FFFDF7',
          'bg-dark': '#0F0F17',
          surface: '#FFF8EE',
          'surface-dark': '#1A1A2E',
          text: '#2C1810',
          'text-dark': '#E8E0D4',
          'text-secondary': '#6B5744',
          'text-secondary-dark': '#9A8E7F',
          accent: '#C4956A',
          'accent-hover': '#A07A52',
          'accent-light': '#F0E4D4',
          'accent-dark': '#D4A574',
          gold: '#D4A574',
          'verse-num': '#B8A08A',
          'verse-num-dark': '#6B5F53',
          border: '#E8DDD0',
          'border-dark': '#2A2A3E',
          // Highlight colors - warmer tones
          'highlight-yellow': '#FFF3C4',
          'highlight-yellow-dark': '#3D3400',
          'highlight-green': '#D4EDBC',
          'highlight-green-dark': '#1B3D1C',
          'highlight-blue': '#C5DCF0',
          'highlight-blue-dark': '#0D2B4A',
          'highlight-pink': '#F4C4D4',
          'highlight-pink-dark': '#4A0D2B',
          'highlight-purple': '#DBC4E8',
          'highlight-purple-dark': '#2D0D3D',
        },
      },
      boxShadow: {
        'warm': '0 2px 16px rgba(196, 149, 106, 0.08)',
        'warm-lg': '0 8px 32px rgba(196, 149, 106, 0.12)',
        'warm-xl': '0 16px 48px rgba(196, 149, 106, 0.16)',
        'glow': '0 0 20px rgba(196, 149, 106, 0.15)',
        'inner-warm': 'inset 0 1px 2px rgba(196, 149, 106, 0.06)',
      },
      backgroundImage: {
        'gradient-warm': 'linear-gradient(135deg, #C4956A 0%, #D4A574 50%, #E8C9A8 100%)',
        'gradient-dark': 'linear-gradient(135deg, #1A1A2E 0%, #16213E 100%)',
        'gradient-surface': 'linear-gradient(180deg, #FFFDF7 0%, #FFF8EE 100%)',
      },
      animation: {
        'slide-up': 'slideUp 0.35s cubic-bezier(0.16, 1, 0.3, 1)',
        'fade-in': 'fadeIn 0.3s ease-out',
        'scale-in': 'scaleIn 0.2s ease-out',
        'pulse-highlight': 'pulseHighlight 2s ease-in-out',
        'shimmer': 'shimmer 2s infinite linear',
        'glow-pulse': 'glowPulse 2s ease-in-out infinite',
      },
      keyframes: {
        slideUp: {
          '0%': { transform: 'translateY(100%)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        scaleIn: {
          '0%': { transform: 'scale(0.95)', opacity: '0' },
          '100%': { transform: 'scale(1)', opacity: '1' },
        },
        pulseHighlight: {
          '0%, 100%': { backgroundColor: 'transparent' },
          '50%': { backgroundColor: 'rgba(196, 149, 106, 0.15)' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
        glowPulse: {
          '0%, 100%': { boxShadow: '0 0 5px rgba(196, 149, 106, 0.2)' },
          '50%': { boxShadow: '0 0 20px rgba(196, 149, 106, 0.4)' },
        },
      },
      borderRadius: {
        '2xl': '1rem',
        '3xl': '1.5rem',
      },
    },
  },
  plugins: [],
};
export default config;
