/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './app/**/*.{js,ts,jsx,tsx}',
    './components/**/*.{js,ts,jsx,tsx}'
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#A78BFA', // Violet-400: Soft lavender
          light: '#C4B5FD',   // Violet-300: Light lavender
          dark: '#8B5CF6',    // Violet-500: Medium lavender
        },
        danger: {
          DEFAULT: '#DC2626', // Red-600: Clear red
          light: '#F87171',   // Red-400: Soft red
          dark: '#B91C1C',    // Red-700: Deep red
        },
        neutral: {
          DEFAULT: '#F8FAFC', // Slate-50: Crisp light
          dark: '#1E293B',    // Slate-800: Rich dark
          darker: '#0F172A',  // Slate-900: Deep dark
        },
        text: {
          DEFAULT: '#0F172A', // Slate-900: Sharp text
          light: '#64748B',   // Slate-500: Soft text
          dark: '#F8FAFC',    // Slate-50: Light text
        },
        surface: {
          light: '#FFFFFF',   // Pure white
          dark: '#1E293B',    // Slate-800: Rich surface
        },
        accent: {
          DEFAULT: '#38BDF8', // Sky-400: Fresh blue
          light: '#7DD3FC',   // Sky-300: Soft blue
          dark: '#0EA5E9',    // Sky-500: Deep blue
        }
      },
      boxShadow: {
        'subtle': '0 1px 3px rgba(0,0,0,0.05)',
        'hover': '0 4px 6px -1px rgba(139, 92, 246, 0.1), 0 2px 4px -1px rgba(139, 92, 246, 0.06)', // Softer violet shadow
      },
      textShadow: {
        'outline-black': '-2px -2px 0 black, 2px -2px 0 black, -2px 2px 0 black, 2px 2px 0 black',
        'outline-bold': '-3px -3px 0 black, 3px -3px 0 black, -3px 3px 0 black, 3px 3px 0 black, 0px -3px 0 black, 0px 3px 0 black, -3px 0px 0 black, 3px 0px 0 black',
        'outline-extra-bold': '-12px -12px 0 black, 12px -12px 0 black, -12px 12px 0 black, 12px 12px 0 black, -12px 0px 0 black, 12px 0px 0 black, 0px -12px 0 black, 0px 12px 0 black, -6px -12px 0 black, 6px -12px 0 black, -6px 12px 0 black, 6px 12px 0 black'
      },
      animation: {
        'spin-slow': 'spin 2s linear infinite',
        'shimmer': 'shimmer 2s infinite',
        'ping-slow': 'ping 2s cubic-bezier(0, 0, 0.2, 1) infinite',
      },
      keyframes: {
        shimmer: {
          '0%': { transform: 'translateX(-100%)' },
          '100%': { transform: 'translateX(100%)' },
        },
      },
    },
  },
  plugins: [],
}

