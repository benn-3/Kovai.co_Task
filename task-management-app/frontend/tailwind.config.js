/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: ['selector', '[data-theme="dark"]'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['"IBM Plex Sans"', '"Segoe UI"', 'system-ui', 'sans-serif'],
      },
      colors: {
        // Map all design tokens so Tailwind utilities can reference CSS vars
        bg:       'var(--bg)',
        surface:  'var(--surface)',
        border:   'var(--border)',
        text:     'var(--text)',
        muted:    'var(--text-muted)',
        accent:   'var(--accent)',
        'accent-hover': 'var(--accent-hover)',
        'status-planned':    'var(--status-planned)',
        'status-progress':   'var(--status-in-progress)',
        'status-complete':   'var(--status-complete)',
      },
    },
  },
  plugins: [],
}
