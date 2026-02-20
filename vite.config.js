import { defineConfig } from 'vite';
import { resolve } from 'path';

export default defineConfig({
  root: '.',
  base: './', // Chemin relatif — requis pour GitHub Pages et Vercel

  publicDir: 'public',

  server: {
    port: 3000,
    open: true,
    cors: true,
    // HMR pour les fichiers JS sans rechargement complet
    hmr: {
      overlay: true,
    },
  },

  build: {
    outDir: 'dist',
    emptyOutDir: true,
    target: 'esnext',     // Navigateurs modernes — ES2022+
    minify: 'terser',
    sourcemap: false,     // Désactivé en prod pour Vercel

    rollupOptions: {
      input: {
        main: resolve(__dirname, 'index.html'),
      },
      output: {
        // Sépare les librairies lourdes (three, cannon) en chunks distincts pour le cache navigateur
        manualChunks(id) {
          if (id.includes('node_modules/three')) return 'vendor-three';
          if (id.includes('node_modules/cannon-es')) return 'vendor-physics';
          if (id.includes('node_modules')) return 'vendor';
        },
        chunkFileNames: 'assets/js/[name]-[hash].js',
        entryFileNames: 'assets/js/[name]-[hash].js',
        assetFileNames: ({ name }) => {
          // Organisation des assets par type dans dist/
          if (/\.(png|jpe?g|webp|avif|gif|svg)$/i.test(name ?? '')) {
            return 'assets/images/[name]-[hash][extname]';
          }
          if (/\.(woff2?|eot|ttf|otf)$/i.test(name ?? '')) {
            return 'assets/fonts/[name]-[hash][extname]';
          }
          if (/\.css$/i.test(name ?? '')) {
            return 'assets/css/[name]-[hash][extname]';
          }
          return 'assets/[name]-[hash][extname]';
        },
      },
    },

    // Seuil d'alerte chunk 3D (~1.5Mo pour three.js seul)
    chunkSizeWarningLimit: 1600,
  },

  resolve: {
    alias: {
      '@': resolve(__dirname, 'src'),
      '@data': resolve(__dirname, 'src/data'),
      '@core': resolve(__dirname, 'src/core'),
      '@ui': resolve(__dirname, 'src/ui'),
      '@systems': resolve(__dirname, 'src/systems'),
      '@entities': resolve(__dirname, 'src/entities'),
      '@world': resolve(__dirname, 'src/world'),
      '@utils': resolve(__dirname, 'src/utils'),
    },
  },

  // Optimisation des dépendances lourdes
  optimizeDeps: {
    include: ['three', 'cannon-es'],
    exclude: [],
  },
});
