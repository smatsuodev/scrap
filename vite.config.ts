import build from '@hono/vite-build/cloudflare-pages'
import devServer from '@hono/vite-dev-server'
import adapter from '@hono/vite-dev-server/cloudflare'
import { TanStackRouterVite } from '@tanstack/router-plugin/vite'
import { type Plugin, defineConfig } from 'vite'
import tsconfigPaths from 'vite-tsconfig-paths'

/**
 *  Module level directives cause errors when bundled, "use client" in "..." was ignored.
 *  という警告の抑制。
 *  RSC は使っていないので、無視してよいはず
 */
function suppressModuleLevelDirectiveWarning(): Plugin {
  return {
    name: 'suppress-module-level-directive-warning',
    config: () => ({
      build: {
        rollupOptions: {
          onwarn(warning, warn) {
            if (warning.code === 'MODULE_LEVEL_DIRECTIVE') {
              return
            }
            warn(warning)
          },
        },
      },
    }),
  }
}

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
          // アイコンごとにチャンクが生成されるバグの workaround
          // refs: https://github.com/tabler/tabler-icons/issues/1233#issuecomment-2428245119
          '@tabler/icons-react': '@tabler/icons-react/dist/esm/icons/index.mjs',
        },
      },
      plugins: [
        tsconfigPaths(),
        suppressModuleLevelDirectiveWarning(),
        TanStackRouterVite({
          routesDirectory: 'src/client/route',
          generatedRouteTree: 'src/client/routeTree.gen.ts',
        }),
      ],
    }
  }

  return {
    ssr: {
      external: ['react', 'react-dom'],
    },
    plugins: [
      tsconfigPaths(),
      suppressModuleLevelDirectiveWarning(),
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
