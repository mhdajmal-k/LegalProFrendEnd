import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  base: "/", // added to the base
  server: {
    port: 3000,
  },
  define: {
    global: {}, // Add this line to define `global` as an empty object
  },
});
