import { defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  test: {
    globals: true,
    environment: "jsdom",
    css: true,
    server: {
      deps: {
        // Add these to avoid `TypeError: Unknown file extension ".css"
        // for /workspace/frontend/node_modules/@h5web/lib/dist/styles.css`
        // errors: https://stackoverflow.com/a/78993174
        inline: ["@diamondlightsource/davidia", /@h5web/],
      },
    },
  },
});
