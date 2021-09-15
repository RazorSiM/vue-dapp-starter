import AutoImport from "unplugin-auto-import/vite";
import Icons from "unplugin-icons/vite";
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
      refTransform: true,
    }),
    AutoImport({
      imports: [
        "vue",
        "vue-router",
        // "vue-i18n",
        // "@vueuse/head",
        "@vueuse/core",
      ],
      dts: true,
    }),
    Icons(),
    WindiCSS(),
  ],
});
