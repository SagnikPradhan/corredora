import { defineConfig } from "vite";
import reactRefresh from "@vitejs/plugin-react-refresh";

const dev = !!process.env.BUILD_DEV;

export default defineConfig({
  plugins: [reactRefresh()],

  mode: dev ? "development" : "production",
  build: { watch: dev ? {} : null, brotliSize: dev ? false : true },

  resolve: {
    alias: {
      "socket.io-client": "socket.io-client/dist/socket.io.js",
    },
  },
});
