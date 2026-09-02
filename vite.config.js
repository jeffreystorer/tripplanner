import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import jsconfigPaths from "vite-jsconfig-paths";
import { VitePWA } from "vite-plugin-pwa";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react({
      include: "**/*.jsx",
    }),
    jsconfigPaths(),
    // Without a service worker the browser must fetch index.html and the JS
    // bundle from the network, so the app could not start at all offline - and
    // none of the localStorage fallback code ever got a chance to run.
    // This precaches the built app shell so it loads with no connection.
    VitePWA({
      registerType: "autoUpdate",
      includeAssets: ["favicon.ico", "apple-touch-icon.png", "manifest.json"],
      // the app already ships its own manifest.json in public/
      manifest: false,
      workbox: {
        globPatterns: ["**/*.{js,css,html,ico,png,svg,woff,woff2}"],
        // SPA routes must resolve to index.html when offline
        navigateFallback: "index.html",
        // never serve a cached Firebase response - reads go to the network and
        // fall back to the localStorage snapshot in services/index.js, which
        // knows how stale it is. A cached API response would bypass that.
        navigateFallbackDenylist: [/^\/__/, /firebaseio\.com/, /googleapis\.com/],
        runtimeCaching: [],
        cleanupOutdatedCaches: true,
      },
    }),
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
