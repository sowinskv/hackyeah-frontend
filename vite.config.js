import { defineConfig } from "vite";

export default defineConfig({
  root: ".",
  publicDir: "./public",
  build: {
    outDir: "./dist",
    emptyOutDir: true,
    rollupOptions: {
      input: {
        main: "./index.html",
        loading: "./src/pages/loading.html",
        app: "./src/pages/index.html",
        login: "./src/pages/login.html",
        calculator: "./src/pages/calculator.html",
      },
    },
  },
  server: {
    port: 3000,
    open: true,
    cors: true,
  },
});
