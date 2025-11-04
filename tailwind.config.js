/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: [
    './src/**/*.{astro,html,js,jsx,ts,tsx,md,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        accent: {
          rose: '#C55D81',
          teal: '#46B49A',
          sand: '#EAA57D',
        },
      },
      fontFamily: {
        cabin: ['Cabin', 'ui-sans-serif', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
}

