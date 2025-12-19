import { defineConfig, createLogger } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'

const logger = createLogger();
const loggerInfo = logger.info;

// Filtramos la línea de "Network" y la de ayuda original para evitar duplicados
logger.info = (msg, options) => {
  const cleanMsg = msg.replace(/\x1B\[\d+m/g, ''); // Quitamos colores ANSI para comparar
  if (cleanMsg.includes('➜  Network:')) return;
  if (cleanMsg.includes('press h + enter to show help')) return;
  loggerInfo(msg, options);
};

// https://vite.dev/config/

export default defineConfig({
  customLogger: logger,
  server: {
    port: 5173,
    host: true,
    strictPort: true,
    proxy: {
      '/api': {
        target: 'http://localhost:4000',
        changeOrigin: true,
        secure: false,
      },
    }
  },
  plugins: [
    react({
      jsxRuntime: 'automatic'
    }),
    VitePWA({
      registerType: 'autoUpdate',
      injectRegister: 'auto',
      manifest: {
        name: 'Gestión de equipos',
        short_name: 'GE',
        description: 'App para gestión de equipos',
        lang: 'es',
        start_url: '/',
        display: 'standalone',
        background_color: '#f6f9ff',
        theme_color: '#2563eb',
        icons: [
          // Prefer PNG icons in /public/icons/*.png - SVG can be used as fallback
          { src: '/GeLogo.svg', sizes: 'any', type: 'image/svg+xml' }
        ]
      }
    }),
    {
      name: 'show-public-ip',
      configureServer(server) {
        server.httpServer?.once('listening', () => {
          setTimeout(() => {
            // Imprimimos la URL Pública sin el puerto
            console.log(`  \x1b[32m➜\x1b[0m  \x1b[1mPublic:\x1b[0m   \x1b[36mhttp://18.218.142.48/\x1b[0m`);
            console.log(`  \x1b[32m➜\x1b[0m  \x1b[1mpress h + enter to show help\x1b[0m\n`);
          }, 100);
        });
      },
    }
  ],
})
