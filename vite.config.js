import { defineConfig, loadEnv } from "vite";
import react, { reactCompilerPreset } from "@vitejs/plugin-react";
import babel from "@rolldown/plugin-babel";
import tailwindcss from "@tailwindcss/vite";

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), "");

  const apiPrefix = env.VITE_API_PREFIX || "/api/v1";
  const apiBaseUrl = env.VITE_API_BASE_URL || "http://localhost:3000";

  return {
    plugins: [
      tailwindcss(),
      react(),
      babel({ presets: [reactCompilerPreset()] }),
    ],
    server: {
      proxy: {
        [apiPrefix]: {
          target: apiBaseUrl,
          changeOrigin: true,
          rewrite: (path) => path,
          ws: true,
        },
      },
    },
  };
});
