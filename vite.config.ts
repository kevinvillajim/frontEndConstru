import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from "@tailwindcss/vite";
import {resolve} from "path";

// https://vite.dev/config/
export default defineConfig({
	plugins: [react(), tailwindcss()],
	// Configuración del servidor de desarrollo
	server: {
		port: 5173,
		host: true,

		// CONFIGURACIÓN DE PROXY CRÍTICA
		proxy: {
			// Proxy para todas las rutas de API hacia el backend
			"/api": {
				target: "http://localhost:4000",
				changeOrigin: true,
				secure: false,
				configure: (proxy, options) => {
					proxy.on("error", (err, req, res) => {
						console.log("🚨 Error de proxy:", err);
					});
					proxy.on("proxyReq", (proxyReq, req, res) => {
						console.log(
							"📤 Proxy request:",
							req.method,
							req.url,
							"-> http://localhost:4000" + req.url
						);
					});
					proxy.on("proxyRes", (proxyRes, req, res) => {
						console.log("📥 Proxy response:", proxyRes.statusCode, req.url);
					});
				},
			},
		},
	},

	// Configuración de build
	build: {
		outDir: "dist",
		sourcemap: true,
		rollupOptions: {
			input: {
				main: resolve(__dirname, "index.html"),
			},
		},
	},

	// Alias para imports
	resolve: {
		alias: {
			"@": resolve(__dirname, "./src"),
			"@components": resolve(__dirname, "./src/ui/components"),
			"@pages": resolve(__dirname, "./src/ui/pages"),
			"@hooks": resolve(__dirname, "./src/ui/hooks"),
			"@types": resolve(__dirname, "./src/types"),
			"@utils": resolve(__dirname, "./src/utils"),
			"@config": resolve(__dirname, "./src/config"),
		},
	},

	// Variables de entorno
	define: {
		__DEV__: JSON.stringify(process.env.NODE_ENV === "development"),
	},

	// Optimización de dependencias
	optimizeDeps: {
		include: ["react", "react-dom", "react-router-dom"],
	},
});
