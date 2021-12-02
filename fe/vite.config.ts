import { defineConfig } from 'vite'
import reactRefresh from '@vitejs/plugin-react-refresh'
import path from 'path'
import vitePluginImp from 'vite-plugin-imp'
import { getThemeVariables } from 'antd/dist/theme'

import packageJson from './package.json'

import MonacoEditorNlsPlugin, { esbuildPluginMonacoEditorNls, Languages } from 'vite-plugin-monaco-editor-nls'

const prefix = `monaco-editor/esm/vs`
const theme = packageJson.theme || {}
// https://vitejs.dev/config/
export default defineConfig({
  envPrefix: 'CVB_',
  plugins: [
    reactRefresh(),
    MonacoEditorNlsPlugin({ locale: Languages.zh_hans }),
    {
      ...vitePluginImp({
        libList: [
          {
            libName: 'antd',
            style: (name) => `antd/es/${name}/style/index.js`
          }
        ]
      }),
      apply: 'build'
    }
  ],
  esbuild: {
    jsxInject: `import React from 'react'`
  },
  resolve: {
    alias: [
      { find: /^~/, replacement: '' },
      { find: '@', replacement: path.resolve(__dirname, '/src') },
      { find: 'workOrder', replacement: path.resolve(__dirname, '/src/packages/workOrder') },
      { find: 'docsManage', replacement: path.resolve(__dirname, '/src/packages/docsManage') },
      { find: 'developer', replacement: path.resolve(__dirname, '/src/packages/developer') },
      { find: 'control', replacement: path.resolve(__dirname, '/src/packages/control') }
    ]
  },
  server: {
    host: '0.0.0.0',
    port: 2000,
    proxy: {
      '/api': {
        target: 'https://t0-cloud.shizhuang-inc.net',
        // rewrite: (path) => path.replace(/^\/api/, ''),
        rewrite: (path) => path,
        changeOrigin: true
      },
      '/graphql': {
        target: 'http://localhost:2020',
        rewrite: (path) => path,
        changeOrigin: true
      },

      '/thrall/api': {
        target: 'http://sit-thrall.shizhuang-inc.net',
        // rewrite: (path) => path.replace(/^\/api/, ''),
        rewrite: (path) => path,
        changeOrigin: true
      }
    }
  },
  optimizeDeps: {
    /** vite >= 2.3.0 */
    esbuildOptions: {
      plugins: [
        esbuildPluginMonacoEditorNls({
          locale: Languages.zh_hans
        })
      ]
    }
  },

  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          jsonWorker: [`${prefix}/language/json/json.worker`],
          cssWorker: [`${prefix}/language/css/css.worker`],
          htmlWorker: [`${prefix}/language/html/html.worker`],
          tsWorker: [`${prefix}/language/typescript/ts.worker`],
          editorWorker: [`${prefix}/editor/editor.worker`]
        }
      }
    },
    terserOptions: {
      parse: {
        ecma: 2020
      },
      compress: {
        ecma: 5,
        comparisons: false,
        inline: 2
      },
      mangle: {
        safari10: true
      },
      keep_classnames: false,
      keep_fnames: false,
      output: {
        ecma: 5,
        comments: false,
        ascii_only: true
      }
    }
  },
  css: {
    preprocessorOptions: {
      less: {
        javascriptEnabled: true,
        modifyVars: {
          ...getThemeVariables(theme),
          ...theme
        }
      }
    }
  }
})
