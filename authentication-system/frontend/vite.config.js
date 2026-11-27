
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],

  // Development server configuration
  server: {
    host: "localhost",
    port: 5174,
    strictPort: true,
    open: true,
  },

  // Production preview configuration
  preview: {
    host: "localhost",
    port: 5174,
    strictPort: true,
  },

  // Production build configuration
  build: {
    outDir: "dist",
    emptyOutDir: true,
    sourcemap: false,
  },
});
