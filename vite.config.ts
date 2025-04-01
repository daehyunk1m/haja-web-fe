import { defineConfig } from "vite";
// Swap out the Rect plugin for React Router @see - https://reactrouter.com/upgrading/component-routes#features
// import react from "@vitejs/plugin-react";
import { reactRouter } from "@react-router/dev/vite";
import tailwindcss from "@tailwindcss/vite";

// https://vite.dev/config/
export default defineConfig({
  plugins: [reactRouter(), tailwindcss()],
});
