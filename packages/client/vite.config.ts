import { defineConfig } from "vite";
import solid from "vite-plugin-solid";
import tailwindcss from "@tailwindcss/vite";
import path from "path";

export default defineConfig({
  plugins: [solid(), tailwindcss()],
  resolve: {
    alias: {
      "@app": path.resolve(__dirname, "src/app"),
      "@features": path.resolve(__dirname, "src/features"),
      "@pages": path.resolve(__dirname, "src/pages"),
      "@shared": path.resolve(__dirname, "src/shared"),
      "@domain": path.resolve(__dirname, "../domain/src"),
    },
  },
});
