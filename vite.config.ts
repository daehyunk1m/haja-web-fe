import { defineConfig, InlineConfig, UserConfig } from "vite";
// Swap out the Rect plugin for React Router @see - https://reactrouter.com/upgrading/component-routes#features
import react from "@vitejs/plugin-react";
import { reactRouter } from "@react-router/dev/vite";
import tailwindcss from "@tailwindcss/vite";

interface VitestConfigExport extends UserConfig {
  test: InlineConfig;
}

const isTest = process.env.NODE_ENV === "test";

// https://vite.dev/config/
export default defineConfig({
  plugins: isTest ? [react(), tailwindcss()] : [reactRouter(), tailwindcss()],
  resolve: {
    alias: [{ find: "@", replacement: "/src" }],
  },
  // reactRouter 문서 다시 한번 확인해볼 것!
  test: {
    globals: true,
    environment: "jsdom",
    setupFiles: "./src/test/setup.ts",
  },
} as VitestConfigExport);
