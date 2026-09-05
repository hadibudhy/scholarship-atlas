import tailwindcss from '@tailwindcss/postcss';
import vinext from 'vinext';
import { defineConfig } from 'vite';

const measurementId = process.env.VITE_GA_MEASUREMENT_ID?.match(/\bG-[A-Z0-9]+\b/i)?.[0] ?? '';

export default defineConfig({
  define: { __SCHOLARSHIP_ATLAS_GA_MEASUREMENT_ID__: JSON.stringify(measurementId) },
  css: { postcss: { plugins: [tailwindcss()] } },
  plugins: [vinext()],
});
