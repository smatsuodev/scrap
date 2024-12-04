import build from '@hono/vite-build/cloudflare-pages'
import devServer, { defaultOptions } from '@hono/vite-dev-server'
import adapter from '@hono/vite-dev-server/cloudflare'
import { TanStackRouterVite } from '@tanstack/router-plugin/vite'
import { type AliasOptions, type Plugin, defineConfig } from 'vite'
import tsconfigPaths from 'vite-tsconfig-paths'

const commonAliasOptions: AliasOptions = {
  // アイコンごとにチャンクが生成されるバグの workaround
  // refs: https://github.com/tabler/tabler-icons/issues/1233#issuecomment-2428245119
  '@tabler/icons-react': '@tabler/icons-react/dist/esm/icons/index.mjs',
}

const commonTanStackRouterOptions: Parameters<typeof TanStackRouterVite>[0] = {
  routesDirectory: 'src/client/route',
  generatedRouteTree: 'src/client/routeTree.gen.ts',
}

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
        alias: commonAliasOptions,
      },
      plugins: [
        tsconfigPaths(),
        suppressModuleLevelDirectiveWarning(),
        TanStackRouterVite(commonTanStackRouterOptions),
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
        exclude: [/^\/src\/.*\.worker\.ts/, ...defaultOptions.exclude],
        entry: 'src/server/index.tsx',
      }),
      command === 'serve'
        ? TanStackRouterVite(commonTanStackRouterOptions)
        : null,
    ].filter(Boolean),
    resolve: commonAliasOptions,
  }
})
