import { defineConfig } from "vite";
import { resolve } from "path";

const devRewrites = {
  "/atlas": "/atlas.html",
  "/assistant": "/assistant.html",
  "/pricing": "/pricing.html",
  "/partners": "/partners.html",
  "/line-reservation": "/line-reservation.html",
  "/line-reservation/demo": "/line-reservation-demo.html",
  "/line-reservation/demo/admin": "/line-reservation-demo-admin.html",
};

function rewriteMiddleware() {
  return (req, _res, next) => {
    const pathOnly = req.url?.split("?")[0] ?? "";
    const query = req.url?.includes("?") ? req.url.slice(req.url.indexOf("?")) : "";
    const target = devRewrites[pathOnly];
    if (target) {
      req.url = target + query;
    }
    next();
  };
}

function cleanUrlPlugin() {
  return {
    name: "clean-url-rewrites",
    configureServer(server) {
      server.middlewares.use(rewriteMiddleware());
    },
    configurePreviewServer(server) {
      server.middlewares.use(rewriteMiddleware());
    },
  };
}

export default defineConfig({
  base: "/",
  plugins: [cleanUrlPlugin()],
  build: {
    rollupOptions: {
      input: {
        main: resolve(__dirname, "index.html"),
        atlas: resolve(__dirname, "atlas.html"),
        lineReservation: resolve(__dirname, "line-reservation.html"),
        lineReservationDemo: resolve(__dirname, "line-reservation-demo.html"),
        lineReservationDemoAdmin: resolve(__dirname, "line-reservation-demo-admin.html"),
        assistant: resolve(__dirname, "assistant.html"),
        pricing: resolve(__dirname, "pricing.html"),
        partners: resolve(__dirname, "partners.html"),
      },
    },
  },
});
