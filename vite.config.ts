import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"), // Алиас для папки src
      app: path.resolve(__dirname, "./src/app"), // Алиас для app
      helpers: path.resolve(__dirname, "./src/helpers"),
      components: path.resolve(__dirname, "./src/components"),
      pages: path.resolve(__dirname, "./src/pages"),
    },
  },
  server: {
    port: 3000, // Задаем порт для localhost
  },
});
