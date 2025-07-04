import path from 'path'
import { defineConfig } from 'vite'
import svgr from 'vite-plugin-svgr'
import tailwindcss from 'tailwindcss'
import autoprefixer from 'autoprefixer'
import { viteMockServe } from 'vite-plugin-mock'

import react from '@vitejs/plugin-react-swc'
import ViteYaml from '@modyfi/vite-plugin-yaml'

import { tanstackRouter } from '@tanstack/router-plugin/vite'

// https://vite.dev/config/
export default defineConfig({
  base: '/',
  server: {
    host: '0.0.0.0',
    port: 3001,
    open: true,
    cors: true,
    proxy: {},
    headers: {
      'Access-Control-Allow-Origin': '*',
    },
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  plugins: [
    tanstackRouter({
      target: 'react',
      autoCodeSplitting: true,
    }),
    react(),
    ViteYaml(),
    viteMockServe({
      mockPath: './mock/',
      enable: true,
      logger: true,
      watchFiles: true,
    }),
    svgr({ svgrOptions: { icon: true }, include: '**/*.svg?react' }),
  ],
  css: {
    postcss: {
      plugins: [tailwindcss(), autoprefixer()],
    },
  },
})
