import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';

export default defineConfig({
  plugins: [vue()],
  server: {
    host: true,
    port: 5174,  // 使用不同的端口避免与Client冲突
    proxy: {
      // 转发后端 API
      '/api': {
        target: 'http://localhost:5000',
        changeOrigin: true,
        rewrite: path => path.replace(/^\/api/, '/api')
      },
      // 转发 WebSocket
      '/ws': {
        target: 'ws://localhost:5000',
        ws: true,
        changeOrigin: true
      }
    }
  },
  preview: {
    host: true,
    port: 5174
  }
});


