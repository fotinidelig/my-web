/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: [
    './src/**/*.{astro,html,js,jsx,ts,tsx,md,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        primary: '#C55D81',
        secondary: '#46B49A',
        accent: {
          DEFAULT: '#EAA57D',
          rose: '#C55D81',
          teal: '#46B49A',
          sand: '#EAA57D',
        },
      },
      fontFamily: {
        cabin: ['Cabin', 'ui-sans-serif', 'system-ui', 'sans-serif'],
      },
      fontSize: {
        title: ['32px', { lineHeight: '1.3' }],
        body: ['18px', { lineHeight: '1.75' }],
        small: ['14px', { lineHeight: '1.6' }],
      },
    },
  },
  plugins: [],
}

