import WindiCSS from "vite-plugin-windicss";
import { defineConfig } from "vite";
import path from "path";
import vue from "@vitejs/plugin-vue";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    vue({
      script: {
        refTransform: true,
      },
    }),
    WindiCSS(),
  ],
  resolve: {
    alias: {
      "/@": path.resolve(__dirname, "./src"),
    },
  },
});
