import path from 'path'
import { defineConfig, loadEnv } from 'vite'
import svgr from 'vite-plugin-svgr'
import { viteMockServe } from 'vite-plugin-mock'
import viteImagemin from 'vite-plugin-imagemin'

import react from '@vitejs/plugin-react-swc'
import ViteYaml from '@modyfi/vite-plugin-yaml'
import { tanstackRouter } from '@tanstack/router-plugin/vite'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
    const env = loadEnv(mode, process.cwd(), 'VITE_')
    const useMock = env.VITE_USE_MOCK === 'true' || mode === 'development'
    const base = env.VITE_BASE?.trim() || '/'

    return {
        base,
        server: {
            host: '0.0.0.0',
            port: 8989,
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
            tailwindcss(),
            ViteYaml(),
            viteMockServe({
                mockPath: './mock/',
                enable: useMock,
                logger: true,
                watchFiles: true,
            }),
            svgr({ svgrOptions: { icon: true }, include: '**/*.svg?react' }),
            viteImagemin({
                gifsicle: {
                    optimizationLevel: 7,
                    interlaced: false,
                },
                optipng: {
                    optimizationLevel: 7,
                },
                mozjpeg: {
                    quality: 80,
                },
                pngquant: {
                    quality: [0.8, 0.9],
                    speed: 4,
                },
                svgo: {
                    plugins: [
                        {
                            name: 'removeViewBox',
                        },
                        {
                            name: 'removeEmptyAttrs',
                            active: false,
                        },
                    ],
                },
            }),
        ],
        build: {
            rollupOptions: {
                output: {
                    manualChunks: {
                        antd: ['antd'],
                        charts: ['@ant-design/charts'],
                        react: ['react', 'react-dom'],
                        router: ['@tanstack/react-router', '@tanstack/react-router-devtools'],
                        i18n: ['i18next', 'react-i18next'],
                        utils: ['lodash-es', 'axios', 'qs', 'nprogress'],
                        markdown: ['react-markdown', 'remark-gfm', 'react-syntax-highlighter'],
                    },
                },
            },
            chunkSizeWarningLimit: 1000,
            terserOptions: {
                compress: {
                    drop_console: true,
                    drop_debugger: true,
                },
            },
        },
    }
})
