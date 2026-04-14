import { defineConfig } from "vite";
import path from "path";

const rawPort = process.env.PORT;
if (!rawPort) throw new Error("PORT environment variable is required but was not provided.");
const port = Number(rawPort);
if (Number.isNaN(port) || port <= 0) throw new Error(`Invalid PORT value: "${rawPort}"`);

const basePath = process.env.BASE_PATH;
if (!basePath) throw new Error("BASE_PATH environment variable is required but was not provided.");

export default defineConfig({
  base: basePath,
  root: path.resolve(import.meta.dirname),
  build: {
    outDir: path.resolve(import.meta.dirname, "dist/public"),
    emptyOutDir: true,
    rollupOptions: {
      input: {
        main: path.resolve(import.meta.dirname, "index.html"),
        catalog: path.resolve(import.meta.dirname, "pages/catalog.html"),
        product: path.resolve(import.meta.dirname, "pages/product.html"),
        categories: path.resolve(import.meta.dirname, "pages/categories.html"),
        contacts: path.resolve(import.meta.dirname, "pages/contacts.html"),
        admin: path.resolve(import.meta.dirname, "pages/admin.html"),
        adminCategory: path.resolve(import.meta.dirname, "pages/admin-category.html"),
        adminCategories: path.resolve(import.meta.dirname, "pages/admin-categories.html"),
        adminProducts: path.resolve(import.meta.dirname, "pages/admin-products.html"),
        adminProduct: path.resolve(import.meta.dirname, "pages/admin-product.html"),
        adminOrders: path.resolve(import.meta.dirname, "pages/admin-orders.html"),
        adminBanners: path.resolve(import.meta.dirname, "pages/admin-banners.html"),
        adminLogin: path.resolve(import.meta.dirname, "pages/admin-login.html"),
        adminSettings: path.resolve(import.meta.dirname, "pages/admin-settings.html"),
      },
    },
  },
  server: {
    port,
    host: "0.0.0.0",
    allowedHosts: true,
    proxy: {
      "/dotnet-api": {
        target: "http://localhost:3001",
        rewrite: (p) => p.replace(/^\/dotnet-api/, ""),
        changeOrigin: true,
      },
    },
  },
  preview: {
    port,
    host: "0.0.0.0",
    allowedHosts: true,
  },
});
