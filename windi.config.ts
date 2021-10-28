import { defineConfig } from "vite-plugin-windicss";
export default defineConfig({
  darkMode: "class",
  attributify: {
    prefix: "w:",
  },
  theme: {
    extend: {
      fontFamily: {
        halant: ["Halant", "serif"],
        nunito: ["Nunito Sans", "sans-serif"],
      },
    },
  },
  plugins: [],
});
