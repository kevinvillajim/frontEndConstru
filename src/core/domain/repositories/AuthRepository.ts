// src/core/domain/repositories/AuthRepository.ts

import type {
	LoginRequest,
	LoginResponse,
	RegisterRequest,
	RegisterResponse,
	User,
} from "../models/auth/AuthModels";

/**
 * Puerto (interfaz) para el repositorio de autenticación
 * Define los métodos que cualquier implementación debe proveer
 */
export interface AuthRepository {
	/**
	 * Inicia sesión con las credenciales proporcionadas
	 * @param credentials Credenciales (email, password y opcional totpToken)
	 */
	login(credentials: LoginRequest): Promise<LoginResponse>;

	/**
	 * Registra un nuevo usuario
	 * @param userData Datos del nuevo usuario
	 */
	register(userData: RegisterRequest): Promise<RegisterResponse>;

	/**
	 * Cierra la sesión actual
	 */
	logout(): Promise<void>;

	/**
	 * Obtiene el perfil del usuario actualmente autenticado
	 */
	getProfile(): Promise<User>;

	/**
	 * Refresca el token de autenticación
	 */
	refreshToken(): Promise<void>;

	/**
	 * Solicita recuperación de contraseña
	 * @param email Email del usuario
	 */
	forgotPassword(email: string): Promise<{success: boolean; message: string}>;

	/**
	 * Restablece la contraseña usando un token válido
	 * @param token Token de recuperación
	 * @param password Nueva contraseña
	 * @param confirmPassword Confirmación de nueva contraseña
	 */
	resetPassword(
		token: string,
		password: string,
		confirmPassword: string
	): Promise<{success: boolean; message: string}>;
}
