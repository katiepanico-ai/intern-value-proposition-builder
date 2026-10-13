import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// Configured for static hosting on a SharePoint document library / web part.
// - base: './' keeps every generated asset path relative so the app works
//   no matter what folder/subsite it's dropped into.
// - outDir/assetsDir keep a predictable dist/assets structure to upload.
export default defineConfig({
  plugins: [react()],
  base: './',
  build: {
    outDir: 'dist',
    assetsDir: 'assets',
  },
})
