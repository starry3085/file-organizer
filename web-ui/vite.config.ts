import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  base: '/file-organizer/', // 适配GitHub Pages仓库路径
  plugins: [react()],
})
