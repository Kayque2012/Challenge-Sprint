import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
  ],
  server: {
    proxy: {
      // Redireciona /api/* para o backend no Azure, eliminando o erro de CORS.
      // O Vite age como intermediário: o browser fala com localhost,
      // o Vite faz a requisição real para o Azure no servidor (sem CORS).
      '/api': {
        target: 'https://challengesprint-api.azurewebsites.net',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, ''),
        secure: true,
      },
    },
  },
});
