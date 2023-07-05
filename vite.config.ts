import { NodeGlobalsPolyfillPlugin } from '@esbuild-plugins/node-globals-polyfill'
import react from '@vitejs/plugin-react'

import { UserConfigExport, defineConfig, loadEnv } from 'vite'
import eslint from 'vite-plugin-eslint'
import svgrPlugin from 'vite-plugin-svgr'
import viteTsconfigPaths from 'vite-tsconfig-paths'

const commonConfigOptions = ({ mode }: { mode: Mode }): UserConfigExport => {
  process.env = { ...process.env, ...loadEnv(mode, process.cwd()) }

  const config: UserConfigExport = {
    resolve: {
      alias: {
        stream: 'stream-browserify',
      },
    },
    plugins: [react(), viteTsconfigPaths(), svgrPlugin(), eslint()],
    define: {
      APP_VERSION: JSON.stringify(process.env.npm_package_version),
    },

    optimizeDeps: {
      include: ['base64-arraybuffer', 'diffie-hellman'],
      esbuildOptions: {
        define: {
          global: 'globalThis',
        },
        plugins: [
          NodeGlobalsPolyfillPlugin({
            buffer: true,
            process: true,
          }),
        ],
      },
    },
  }

  return config
}

const devConfigOptions: UserConfigExport = commonConfigOptions({ mode: 'development' })

const prodConfigOptions: UserConfigExport = commonConfigOptions({ mode: 'production' })

type Mode = 'development' | 'production'

const configDispatch: Record<Mode, UserConfigExport> = {
  development: devConfigOptions,
  production: prodConfigOptions,
}

// https://vitejs.dev/config/
export default ({ mode }: { mode: Mode }) => {
  const config = configDispatch[mode]

  return defineConfig(config)
}

