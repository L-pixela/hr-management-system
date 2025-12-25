import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

// https://vitejs.dev/config/
export default defineConfig({
    plugins: [vue()],
    server: {
        host: true,
        port: 5173,
        proxy: {
            '/auth': {
                target: 'http://localhost',
                changeOrigin: true,
                rewrite: (path) => path
            },
            '/employees': {
                target: 'http://localhost',
                changeOrigin: true,
                rewrite: (path) => path
            },
            '/departments': {
                target: 'http://localhost',
                changeOrigin: true,
                rewrite: (path) => path
            }
        }
    }
})
