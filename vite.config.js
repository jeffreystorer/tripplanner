import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import jsconfigPaths from "vite-jsconfig-paths";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react({
      include: "**/*.jsx",
    }),
    jsconfigPaths(),
  ],
  assetsInclude: ["**/*.JPG", "**/*.svg", "**/*.ico", "**/*.png"],
  build: {
    rollupOptions: {
      output: {
        // Split the big, rarely-changing dependencies into their own chunks.
        // This does not shrink a first-ever visit, but on every deploy after
        // that the browser reuses these from cache and only re-downloads the
        // app code that actually changed.
        manualChunks: {
          firebase: ["firebase/app", "firebase/auth", "firebase/database"],
          react: ["react", "react-dom", "react-router-dom"],
          recoil: ["recoil"],
        },
      },
    },
  },
});
