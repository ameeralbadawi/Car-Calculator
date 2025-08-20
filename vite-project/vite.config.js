import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  base: './',
  plugins: [react()],
  // REMOVE the build.rollupOptions.external section entirely
  build: {
    commonjsOptions: {
      transformMixedEsModules: true
    }
  }
})