import { defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig({
  // No GitHub Pages o site mora em /CRUD/, então o workflow define BASE_PATH.
  base: process.env.BASE_PATH ?? "/",
  plugins: [react(), tailwindcss()],
  server: {
    host: true,
    port: 5173,
  },
  test: {
    environment: "node",
  },
});
