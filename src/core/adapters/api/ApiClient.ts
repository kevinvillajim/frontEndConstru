// src/core/adapters/api/ApiClient.ts
import axios from "axios";
import environment from "../../../config/environment";

// Create a consistent axios instance to use throughout the app
const ApiClient = axios.create({
	baseURL: environment.apiBaseUrl,
	withCredentials: true, // Important for cookies
	headers: {
		"Content-Type": "application/json",
		Accept: "application/json",
	},
	timeout: 15000, // 15 seconds
});

// Add request interceptor for logging in development
ApiClient.interceptors.request.use(
	(config) => {
		if (import.meta.env.DEV) {
			console.log(
				`Making ${config.method?.toUpperCase()} request to: ${config.baseURL}${config.url}`
			);
		}
		return config;
	},
	(error) => {
		return Promise.reject(error);
	}
);

// Add response interceptor for handling common errors
ApiClient.interceptors.response.use(
	(response) => {
		return response;
	},
	async (error) => {
		if (import.meta.env.DEV) {
			console.error("API Error:", error.message);

			// Log more details if available
			if (error.response) {
				console.error("Response data:", error.response.data);
				console.error("Response status:", error.response.status);
			}
		}

		// Handle 401 unauthorized errors (optional)
		if (error.response && error.response.status === 401) {
			// Could trigger a refresh token flow here or redirect to login
		}

		return Promise.reject(error);
	}
);

export default ApiClient;
