/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        ink: 'oklch(23% 0.02 250)',
        paper: 'oklch(98% 0.006 250)',
        muted: 'oklch(93% 0.01 250)',
        accent: 'oklch(52% 0.16 245)',
      },
      boxShadow: {
        panel: '0 24px 80px oklch(35% 0.04 250 / 0.14)',
      },
    },
  },
  plugins: [],
};
