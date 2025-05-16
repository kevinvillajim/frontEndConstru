// src/core/adapters/api/AxiosConfig.ts
import axios from "axios";
import ApiClient from "./ApiClient";
import endpoints from "../../../utils/endpoints";

/**
 * Configura Axios con opciones específicas para resolver problemas comunes
 * - Manejo de CORS
 * - Timeout adecuado
 * - Headers comunes
 * - Interceptores para refresh de token
 */

// Configuración básica de Axios
axios.defaults.withCredentials = true; // Importante para cookies en CORS
axios.defaults.timeout = 15000; // 15 segundos de timeout
axios.defaults.headers.common["Content-Type"] = "application/json";
axios.defaults.headers.common["Accept"] = "application/json";

// Log para debug durante desarrollo
console.log("Axios configurado. Base URL de endpoints:", endpoints.auth.login);

/**
 * Configura los interceptores de Axios
 */
export const setupAxiosInterceptors = () => {
	// Interceptor de petición
	axios.interceptors.request.use(
		(config) => {
			// Debug para desarrollo
			console.log(`Realizando petición a: ${config.url}`);

			return config;
		},
		(error) => {
			console.error("Error en interceptor de request:", error);
			return Promise.reject(error);
		}
	);

	// Interceptor de respuesta
	axios.interceptors.response.use(
		(response) => {
			return response;
		},
		async (error) => {
			const originalRequest = error.config;

			// Debug para desarrollo
			console.error(
				"Error en petición:",
				error.response?.status,
				error.config?.url
			);

			// Si recibimos un 401 (Unauthorized) y no estamos ya intentando refrescar el token
			if (
				error.response &&
				error.response.status === 401 &&
				!originalRequest._retry &&
				originalRequest.url !== endpoints.auth.refreshToken // Evita bucle infinito
			) {
				originalRequest._retry = true;

				try {
					// Intentar refrescar el token
					await ApiClient.post(endpoints.auth.refreshToken);

					// Token refrescado exitosamente, reintentar la petición original
					return axios(originalRequest);
				} catch (refreshError) {
					// El refresh falló, probablemente necesitamos autenticarnos de nuevo
					localStorage.removeItem("user");

					// Redirigir al login si estamos en el navegador
					if (
						window &&
						window.location &&
						window.location.pathname !== "/login"
					) {
						window.location.href = "/login";
					}

					return Promise.reject(refreshError);
				}
			}

			return Promise.reject(error);
		}
	);
};

// Exportar una instancia configurada por defecto
export const configuredAxios = ApiClient;

// Ejecutar la configuración automáticamente
setupAxiosInterceptors();
