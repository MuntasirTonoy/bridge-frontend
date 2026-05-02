/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        'bg-primary': 'var(--bg-primary)',
        'bg-secondary': 'var(--bg-secondary)',
        'bg-white': 'var(--bg-white)',
        'bg-sidebar': 'var(--bg-sidebar)',
        'bg-chat': 'var(--bg-chat)',
        'accent-primary': 'var(--accent-primary)',
        'accent-dark': 'var(--accent-dark)',
        'accent-light': 'var(--accent-light)',
        'accent-bubble': 'var(--accent-bubble)',
        'text-primary': 'var(--text-primary)',
        'text-secondary': 'var(--text-secondary)',
        'text-muted': 'var(--text-muted)',
        'text-light': 'var(--text-light)',
        'border-light': 'var(--border-light)',
        'border-medium': 'var(--border-medium)',
        'bubble-sent': 'var(--bubble-sent)',
        'bubble-received': 'var(--bubble-received)',
        'bubble-received-alt': 'var(--bubble-received-alt)',
        'online-dot': 'var(--online-dot)',
      },
      keyframes: {
        'slide-up': {
          '0%': { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        'slide-down': {
          '0%': { opacity: '0', transform: 'translateY(-10px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        'pop-in': {
          '0%': { opacity: '0', transform: 'scale(0.9) translateY(-10px)' },
          '100%': { opacity: '1', transform: 'scale(1) translateY(0)' },
        },
        'fadeIn': {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        }
      },
      animation: {
        'slide-up': 'slide-up 0.6s cubic-bezier(0.16, 1, 0.3, 1)',
        'slide-down': 'slide-down 0.2s ease',
        'pop-in': 'pop-in 0.2s cubic-bezier(0.175, 0.885, 0.32, 1.275)',
        'fadeIn': 'fadeIn 0.2s ease',
      }
    },
  },
  plugins: [],
}

