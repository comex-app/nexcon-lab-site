import { defineConfig } from "vite";
import { resolve } from "path";

export default defineConfig({
  base: "/",
  build: {
    rollupOptions: {
      input: {
        main: resolve(__dirname, "index.html"),
        atlas: resolve(__dirname, "atlas.html"),
        lineReservation: resolve(__dirname, "line-reservation.html"),
        lineReservationDemo: resolve(__dirname, "line-reservation-demo.html"),
      },
    },
  },
});
