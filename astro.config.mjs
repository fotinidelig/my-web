import { defineConfig } from 'astro/config';
import react from '@astrojs/react';
import tailwind from '@astrojs/tailwind';

// Astro configuration enabling React and Tailwind integrations
export default defineConfig({
  vite: {
    optimizeDeps: {
      include: ['react', 'react-dom', 'react/jsx-runtime', 'react/jsx-dev-runtime'],
    },
  },
  integrations: [
    react({
      jsxRuntime: 'automatic',
    }),
    tailwind(),
  ],
});




