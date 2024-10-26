import path from 'node:path'
import build from '@hono/vite-build/cloudflare-pages'
import devServer from '@hono/vite-dev-server'
import adapter from '@hono/vite-dev-server/cloudflare'
import { defineConfig } from 'vite'

export default defineConfig(({ mode }) => {
  if (mode === 'client') {
    return {
      build: {
        rollupOptions: {
          input: './src/client/index.tsx',
          output: {
            entryFileNames: 'static/client.js',
            assetFileNames: 'static/assets/[name].[ext]',
          },
        },
      },
      resolve: {
        alias: {
          '@': path.resolve(__dirname, './src'),
        },
      },
    }
  }

  return {
    plugins: [
      build({
        entry: 'src/api/index.tsx',
      }),
      devServer({
        adapter,
        entry: 'src/api/index.tsx',
      }),
    ],
    resolve: {
      alias: {
        '@': path.resolve(__dirname, './src'),
      },
    },
  }
})
