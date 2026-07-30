import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import fs from "fs";
// import { componentTagger } from "lovable-tagger";

// Plugin: copiar index.html a /centro y /express para que hosting estático (Lovable) sirva esas rutas.
// Lovable lee `lovable.json` → output `dist`. Si cambias index.html o tema, ejecuta `npm run build`
// y sube `dist/` al repo (este proyecto versiona dist para despliegues estáticos).
function spaFallbackRoutes() {
  return {
    name: "spa-fallback-routes",
    closeBundle() {
      const outDir = path.resolve(__dirname, "dist");
      const indexPath = path.join(outDir, "index.html");
      if (!fs.existsSync(indexPath)) return;
      const html = fs.readFileSync(indexPath, "utf-8");
      for (const route of ["centro", "express"]) {
        const dir = path.join(outDir, route);
        fs.mkdirSync(dir, { recursive: true });
        fs.writeFileSync(path.join(dir, "index.html"), html);
      }
      console.log("✅ SPA fallback: index.html copiado a /centro y /express");
    },
  };
}

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  server: {
    host: "::",
    port: 8080,
  },
  plugins: [
    react(),
    spaFallbackRoutes(),
    // mode === 'development' &&
    // componentTagger(),
  ].filter(Boolean),
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  build: {
    outDir: "dist",
    assetsDir: "assets",
    sourcemap: false,
    rollupOptions: {
      output: {
        // El [hash] de contenido ya hace cache busting: solo cambian de nombre
        // los chunks que realmente cambian, y el resto queda cacheado entre deploys.
        entryFileNames: `assets/[name]-[hash].js`,
        chunkFileNames: `assets/[name]-[hash].js`,
        assetFileNames: `assets/[name]-[hash].[ext]`,
        // Sin manualChunks: con el code splitting por ruta (React.lazy) Rollup
        // calcula solo los chunks compartidos. La asignación manual anterior
        // provocaba dependencias circulares entre chunks (página en blanco por
        // "Object.defineProperty called on non-object" al inicializar módulos).
      },
    },
    chunkSizeWarningLimit: 1000,
  },
  base: "/",
}));
