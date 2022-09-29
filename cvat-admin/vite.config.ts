import { fileURLToPath, URL } from "node:url";

import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
const port = 5173;
// https://vitejs.dev/config/
export default defineConfig({
  plugins: [vue()],
  resolve: {
    alias: {
      "@": fileURLToPath(new URL("./src", import.meta.url)),
    },
  },
  server: {
    port: port, // 源地址端口，自行修改
    proxy: {
      "/api": {
        target: "http://43.138.66.202:8080/", // 3组测试服务器
        changeOrigin: true,
        // rewrite: {
        //   "^/api": "" // 重写地址
        // },
        rewrite: (path) => path.replace(/^\/api/, ""),
      },
    },
  },
});
