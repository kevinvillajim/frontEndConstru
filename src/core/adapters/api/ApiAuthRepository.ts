import axios, {AxiosError} from "axios";
import ApiClient from "./ApiClient";
import type {
	LoginRequest,
	LoginResponse,
	RegisterRequest,
	RegisterResponse,
	User,
	ApiError,
} from "../../domain/models/auth/AuthModels";
import type {AuthRepository} from "../../domain/repositories/AuthRepository";
import endpoints from "../../../utils/endpoints";

/**
 * Implementación de AuthRepository que usa Axios para comunicarse con la API
 */
export class ApiAuthRepository implements AuthRepository {
	async login(credentials: LoginRequest): Promise<LoginResponse> {
		console.log("Iniciando login con:", {...credentials, password: "******"});
		console.log("URL de endpoint:", endpoints.auth.login);

		try {
			const response = await ApiClient.post<LoginResponse>(
				"/auth/login",
				credentials
			);

			console.log("Respuesta login:", response.status, response.statusText);
			return response.data;
		} catch (error) {
			console.error("Error en login:", error);

			if (axios.isAxiosError(error)) {
				const axiosError = error as AxiosError<ApiError>;
				console.error("Detalles del error:", {
					status: axiosError.response?.status,
					statusText: axiosError.response?.statusText,
					data: axiosError.response?.data,
				});

				if (axiosError.response) {
					throw axiosError.response.data;
				}
			}
			throw {
				success: false,
				message:
					"Error de conexión al servidor. Verifica que el backend esté activo.",
			};
		}
	}

	async register(userData: RegisterRequest): Promise<RegisterResponse> {
		console.log("Iniciando registro con:", {...userData, password: "******"});
		console.log("URL de endpoint:", endpoints.auth.register);

		try {
			const response = await ApiClient.post<RegisterResponse>(
				"/auth/register",
				userData
			);

			console.log("Respuesta registro:", response.status, response.statusText);
			return response.data;
		} catch (error) {
			console.error("Error en registro:", error);

			if (axios.isAxiosError(error)) {
				const axiosError = error as AxiosError<ApiError>;
				console.error("Detalles del error:", {
					status: axiosError.response?.status,
					statusText: axiosError.response?.statusText,
					data: axiosError.response?.data,
				});

				if (axiosError.response) {
					throw axiosError.response.data;
				}
			}
			throw {
				success: false,
				message:
					"Error de conexión al servidor. Verifica que el backend esté activo.",
			};
		}
	}

	// Resto de métodos...

	async logout(): Promise<void> {
		try {
			await ApiClient.post("/auth/logout");
		} catch (error) {
			console.error("Error en logout:", error);
			if (axios.isAxiosError(error)) {
				const axiosError = error as AxiosError<ApiError>;
				if (axiosError.response) {
					throw axiosError.response.data;
				}
			}
			throw {success: false, message: "Error de conexión al servidor"};
		}
	}

	async getProfile(): Promise<User> {
		try {
			const response = await ApiClient.get<{success: boolean; data: User}>(
				"/auth/profile"
			);
			return response.data.data;
		} catch (error) {
			console.error("Error en getProfile:", error);
			if (axios.isAxiosError(error)) {
				const axiosError = error as AxiosError<ApiError>;
				if (axiosError.response) {
					throw axiosError.response.data;
				}
			}
			throw {success: false, message: "Error de conexión al servidor"};
		}
	}

	async refreshToken(): Promise<void> {
		try {
			await ApiClient.post("/auth/refresh-token");
		} catch (error) {
			console.error("Error en refreshToken:", error);
			if (axios.isAxiosError(error)) {
				const axiosError = error as AxiosError<ApiError>;
				if (axiosError.response) {
					throw axiosError.response.data;
				}
			}
			throw {success: false, message: "Error de conexión al servidor"};
		}
	}

	async forgotPassword(
		email: string
	): Promise<{success: boolean; message: string}> {
		try {
			const response = await ApiClient.post<{
				success: boolean;
				message: string;
			}>("/auth/forgot-password", {email});
			return response.data;
		} catch (error) {
			console.error("Error en forgotPassword:", error);
			if (axios.isAxiosError(error)) {
				const axiosError = error as AxiosError<ApiError>;
				if (axiosError.response) {
					throw axiosError.response.data;
				}
			}
			throw {success: false, message: "Error de conexión al servidor"};
		}
	}

	async resetPassword(
		token: string,
		password: string,
		confirmPassword: string
	): Promise<{success: boolean; message: string}> {
		try {
			const response = await ApiClient.post<{
				success: boolean;
				message: string;
			}>(`/auth/reset-password/${token}`, {password, confirmPassword});
			return response.data;
		} catch (error) {
			console.error("Error en resetPassword:", error);
			if (axios.isAxiosError(error)) {
				const axiosError = error as AxiosError<ApiError>;
				if (axiosError.response) {
					throw axiosError.response.data;
				}
			}
			throw {success: false, message: "Error de conexión al servidor"};
		}
	}
}
