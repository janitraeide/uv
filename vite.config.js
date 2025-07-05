import { defineConfig } from "vite";
import { resolve } from "path";

export default defineConfig({
  build: {
    rollupOptions: {
      input: {
        main: resolve(__dirname, "index.html"),
        contact: resolve(__dirname, "contact.html"),
        terms_and_conditions: resolve(__dirname, "public/terms-and-conditions.html"),
        privacy_policy: resolve(__dirname, "public/privacy-policy.html"),
      },
    },
    assetsInclude: [
      "**/*.jpeg",
      "**/*.jpg",
      "**/*.png",
      "**/*.svg",
      "**/*.gif",
    ],
    copyPublicDir: true,
  },
});
