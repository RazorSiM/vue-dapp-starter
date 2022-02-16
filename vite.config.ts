import AutoImport from "unplugin-auto-import/vite";
import Components from "unplugin-vue-components/vite";
import Icons from "unplugin-icons/vite";
import IconsResolver from "unplugin-icons/resolver";
import Vue from "@vitejs/plugin-vue";
import WindiCSS from "vite-plugin-windicss";
import { defineConfig } from "vite";
import path from "path";

// https://vitejs.dev/config/
export default defineConfig({
  resolve: {
    alias: {
      "~/": `${path.resolve(__dirname, "src")}/`,
    },
  },
  plugins: [
    Vue({
      reactivityTransform: true,
    }),
    AutoImport({
      imports: ["vue", "vue-router", "@vueuse/core"],
      dts: "src/auto-imports.d.ts",
    }),
    Components({
      resolvers: [IconsResolver({ prefix: "icon" })],
      dts: "src/components.d.ts",
    }),
    Icons({
      autoInstall: true,
    }),
    WindiCSS(),
  ],
});
