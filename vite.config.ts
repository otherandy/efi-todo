import { fileURLToPath, URL } from 'node:url';
import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import svgLoader from 'vite-svg-loader';
import vueDevTools from 'vite-plugin-vue-devtools';

// https://vite.dev/config/
export default defineConfig(({ mode }) => ({
  plugins: [
    vue(),
    svgLoader({
      defaultImport: 'component', // treat all .svg imports as Vue components by default
    }),
    ...(mode !== 'production' ? [vueDevTools()] : [])
  ],
  build: {
    // Keep asset URLs as real file paths — some consumers (e.g. the emoji
    // picker's background-image: url(...) construction) break on data URIs
    // that contain unescaped parentheses, which small inlined SVGs can have.
    assetsInlineLimit: 0,
  },
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
      '@assets': fileURLToPath(new URL('./src/assets', import.meta.url)),
      '@models': fileURLToPath(new URL('./src/models', import.meta.url)),
    },
  },
}));