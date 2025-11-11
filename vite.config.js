import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import { defineConfig } from 'vite'

const __dirname = dirname(fileURLToPath(import.meta.url))

export default defineConfig({
  build: {
    rollupOptions: {
      input: {
        index: resolve(__dirname, 'index.html'),
        mares: resolve(__dirname, 'mares.html'),
        wc: resolve(__dirname, 'wc/index.html'),
        th3a: resolve(__dirname, 'Th3a/index.html'),
      },
    },
  },
})