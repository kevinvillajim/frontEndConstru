import axios, {AxiosError} from "axios";
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
	/**
	 * Inicia sesión con credenciales
	 * @param credentials Credenciales (email, password y opcional totpToken)
	 */
	async login(credentials: LoginRequest): Promise<LoginResponse> {
		console.log("Iniciando login con:", {...credentials, password: "******"});
		console.log("URL de endpoint:", endpoints.auth.login);

		try {
			const response = await axios.post<LoginResponse>(
				endpoints.auth.login,
				credentials,
				{
					withCredentials: true, // Importante para manejar cookies
					headers: {
						"Content-Type": "application/json",
						Accept: "application/json",
					},
				}
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

	/**
	 * Registra un nuevo usuario
	 * @param userData Datos del nuevo usuario
	 */
	async register(userData: RegisterRequest): Promise<RegisterResponse> {
		console.log("Iniciando registro con:", {...userData, password: "******"});
		console.log("URL de endpoint:", endpoints.auth.register);

		try {
			const response = await axios.post<RegisterResponse>(
				endpoints.auth.register,
				userData,
				{
					headers: {
						"Content-Type": "application/json",
						Accept: "application/json",
					},
				}
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

	/**
	 * Cierra la sesión actual
	 */
	async logout(): Promise<void> {
		try {
			await axios.post(endpoints.auth.logout, {}, {withCredentials: true});
			console.log("Sesión cerrada exitosamente");
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

	/**
	 * Obtiene el perfil del usuario actualmente autenticado
	 */
	async getProfile(): Promise<User> {
		try {
			const response = await axios.get<{success: boolean; data: User}>(
				endpoints.auth.profile,
				{withCredentials: true}
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

	/**
	 * Refresca el token de autenticación
	 */
	async refreshToken(): Promise<void> {
		try {
			await axios.post(
				endpoints.auth.refreshToken,
				{},
				{withCredentials: true}
			);
			console.log("Token refrescado exitosamente");
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

	/**
	 * Solicita recuperación de contraseña
	 * @param email Email del usuario
	 */
	async forgotPassword(
		email: string
	): Promise<{success: boolean; message: string}> {
		try {
			console.log("Solicitando recuperación para email:", email);
			console.log("URL:", endpoints.auth.forgotPassword);

			const response = await axios.post<{success: boolean; message: string}>(
				endpoints.auth.forgotPassword,
				{email},
				{
					headers: {
						"Content-Type": "application/json",
						Accept: "application/json",
					},
				}
			);

			console.log("Respuesta forgotPassword:", response.status, response.data);
			return response.data;
		} catch (error) {
			console.error("Error en forgotPassword:", error);
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

	/**
	 * Restablece la contraseña usando un token válido
	 * @param token Token de recuperación
	 * @param password Nueva contraseña
	 * @param confirmPassword Confirmación de nueva contraseña
	 */
	async resetPassword(
		token: string,
		password: string,
		confirmPassword: string
	): Promise<{success: boolean; message: string}> {
		try {
			console.log("Restableciendo contraseña con token:", token);
			console.log("URL:", endpoints.auth.resetPassword(token));

			const response = await axios.post<{success: boolean; message: string}>(
				endpoints.auth.resetPassword(token),
				{password, confirmPassword},
				{
					headers: {
						"Content-Type": "application/json",
						Accept: "application/json",
					},
				}
			);

			console.log("Respuesta resetPassword:", response.status, response.data);
			return response.data;
		} catch (error) {
			console.error("Error en resetPassword:", error);
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

	/**
	 * Verifica el token de restablecimiento
	 * @param token Token de recuperación
	 */
	async verifyResetToken(
		token: string
	): Promise<{success: boolean; message: string}> {
		try {
			// Usar una petición GET específica para verificar el token
			const response = await axios.get(
				`${endpoints.auth.verifyResetToken}/${token}`,
				{
					headers: {
						"Content-Type": "application/json",
						Accept: "application/json",
					},
				}
			);

			return response.data;
		} catch (error) {
			console.error("Error al verificar token de restablecimiento:", error);

			if (axios.isAxiosError(error)) {
				const axiosError = error as AxiosError<ApiError>;
				if (axiosError.response) {
					return {
						success: false,
						message:
							axiosError.response.data?.message || "Token inválido o expirado",
					};
				}
			}

			return {
				success: false,
				message: "Error de conexión al servidor",
			};
		}
	}

	/**
	 * Cambia la contraseña del usuario actual
	 * @param currentPassword Contraseña actual
	 * @param newPassword Nueva contraseña
	 */
	async changePassword(
		currentPassword: string,
		newPassword: string
	): Promise<{success: boolean; message: string}> {
		try {
			const response = await axios.post(
				endpoints.auth.changePassword,
				{currentPassword, newPassword},
				{withCredentials: true}
			);
			return response.data;
		} catch (error) {
			console.error("Error al cambiar contraseña:", error);
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
