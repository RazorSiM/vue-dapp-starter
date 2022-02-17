import path from "path";
import gzipPlugin from "rollup-plugin-gzip";
import rollupNodePolyFill from "rollup-plugin-node-polyfills";
import analyze from "rollup-plugin-visualizer";
import AutoImport from "unplugin-auto-import/vite";
import IconsResolver from "unplugin-icons/resolver";
import Icons from "unplugin-icons/vite";
import Components from "unplugin-vue-components/vite";
import { defineConfig } from "vite";
import WindiCSS from "vite-plugin-windicss";
import { brotliCompressSync } from "zlib";

import { NodeGlobalsPolyfillPlugin } from "@esbuild-plugins/node-globals-polyfill";
import { NodeModulesPolyfillPlugin } from "@esbuild-plugins/node-modules-polyfill";
import Vue from "@vitejs/plugin-vue";

// https://vitejs.dev/config/
export default defineConfig({
  resolve: {
    alias: {
      "~/": `${path.resolve(__dirname, "src")}/`,
      // This Rollup aliases are extracted from @esbuild-plugins/node-modules-polyfill,
      // see https://github.com/remorses/esbuild-plugins/blob/master/node-modules-polyfill/src/polyfills.ts
      // process and buffer are excluded because already managed
      // by node-globals-polyfill
      util: "rollup-plugin-node-polyfills/polyfills/util",
      // sys: "util",
      // stream: 'rollup-plugin-node-polyfills/polyfills/stream',
      // path: 'rollup-plugin-node-polyfills/polyfills/path',
      // querystring: 'rollup-plugin-node-polyfills/polyfills/qs',
      // punycode: 'rollup-plugin-node-polyfills/polyfills/punycode',
      // url: 'rollup-plugin-node-polyfills/polyfills/url',
      // http: 'rollup-plugin-node-polyfills/polyfills/http',
      // https: 'rollup-plugin-node-polyfills/polyfills/http',
      // os: 'rollup-plugin-node-polyfills/polyfills/os',
      // assert: 'rollup-plugin-node-polyfills/polyfills/assert',
      // constants: 'rollup-plugin-node-polyfills/polyfills/constants',
      // _stream_duplex:
      //     'rollup-plugin-node-polyfills/polyfills/readable-stream/duplex',
      // _stream_passthrough:
      //     'rollup-plugin-node-polyfills/polyfills/readable-stream/passthrough',
      // _stream_readable:
      //     'rollup-plugin-node-polyfills/polyfills/readable-stream/readable',
      // _stream_writable:
      //     'rollup-plugin-node-polyfills/polyfills/readable-stream/writable',
      // _stream_transform:
      //     'rollup-plugin-node-polyfills/polyfills/readable-stream/transform',
      // timers: 'rollup-plugin-node-polyfills/polyfills/timers',
      // console: 'rollup-plugin-node-polyfills/polyfills/console',
      // vm: 'rollup-plugin-node-polyfills/polyfills/vm',
      // zlib: 'rollup-plugin-node-polyfills/polyfills/zlib',
      // tty: 'rollup-plugin-node-polyfills/polyfills/tty',
      // domain: 'rollup-plugin-node-polyfills/polyfills/domain'
    },
  },
  optimizeDeps: {
    esbuildOptions: {
      // Node.js global to browser globalThis
      define: {
        global: "globalThis",
      },
      // Enable esbuild polyfill plugins
      plugins: [
        NodeGlobalsPolyfillPlugin({
          process: true,
          buffer: true,
        }),
        NodeModulesPolyfillPlugin(),
      ],
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
  build: {
    commonjsOptions: {
      transformMixedEsModules: true,
    },
    rollupOptions: {
      output: {
        manualChunks: {
          walletconnect: ["@walletconnect/web3-provider"],
        },
      },
      plugins: [
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore build mode polyfills
        rollupNodePolyFill(),
        // GZIP compression as .gz files
        gzipPlugin(),
        // Brotil compression as .br files
        gzipPlugin({
          customCompression: (c: any) => brotliCompressSync(Buffer.from(c)),
          fileName: ".br",
        }),
        analyze({
          filename: "dist/report.html",
          gzipSize: true,
          brotliSize: true,
        }),
      ],
    },
  },
});
