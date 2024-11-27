import path from 'node:path'
import build from '@hono/vite-build/cloudflare-pages'
import devServer from '@hono/vite-dev-server'
import adapter from '@hono/vite-dev-server/cloudflare'
import { TanStackRouterVite } from '@tanstack/router-plugin/vite'
import { defineConfig } from 'vite'

export default defineConfig(({ mode, command }) => {
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
          // アイコンごとにチャンクが生成されるバグの workaround
          // refs: https://github.com/tabler/tabler-icons/issues/1233#issuecomment-2428245119
          '@tabler/icons-react': '@tabler/icons-react/dist/esm/icons/index.mjs',
        },
      },
      plugins: [
        TanStackRouterVite({
          routesDirectory: 'src/client/route',
          generatedRouteTree: 'src/client/routeTree.gen.ts',
        }),
      ],
    }
  }

  return {
    plugins: [
      build({
        entry: 'src/server/index.tsx',
      }),
      devServer({
        adapter,
        entry: 'src/server/index.tsx',
      }),
      ...(command === 'serve'
        ? [
            TanStackRouterVite({
              routesDirectory: 'src/client/route',
              generatedRouteTree: 'src/client/routeTree.gen.ts',
            }),
          ]
        : []),
    ],
    resolve: {
      alias: {
        '@': path.resolve(__dirname, './src'),
        '@tabler/icons-react': '@tabler/icons-react/dist/esm/icons/index.mjs',
      },
    },
  }
})
