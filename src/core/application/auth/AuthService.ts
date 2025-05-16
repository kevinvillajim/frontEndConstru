// src/core/application/auth/AuthService.ts

import type {
	LoginRequest,
	LoginResponse,
	RegisterRequest,
	RegisterResponse,
	User,
} from "../../domain/models/auth/AuthModels";
import type {AuthRepository} from "../../domain/repositories/AuthRepository";

/**
 * Servicio de autenticación que proporciona lógica de negocio relacionada
 * con la autenticación y gestión del usuario
 */
export class AuthService {
	private authRepository: AuthRepository;

	constructor(authRepository: AuthRepository) {
		this.authRepository = authRepository;
	}

	/**
	 * Inicia sesión con credenciales
	 * @param credentials Credenciales (email, password y opcional totpToken)
	 */
	async login(credentials: LoginRequest): Promise<LoginResponse> {
		return await this.authRepository.login(credentials);
	}

	/**
	 * Registra un nuevo usuario
	 * @param userData Datos del nuevo usuario
	 */
	async register(userData: RegisterRequest): Promise<RegisterResponse> {
		return await this.authRepository.register(userData);
	}

	/**
	 * Cierra la sesión actual
	 */
	async logout(): Promise<void> {
		return await this.authRepository.logout();
	}

	/**
	 * Obtiene el perfil del usuario actual
	 */
	async getProfile(): Promise<User> {
		return await this.authRepository.getProfile();
	}

	/**
	 * Refresca el token de autenticación
	 */
	async refreshToken(): Promise<void> {
		return await this.authRepository.refreshToken();
	}

	/**
	 * Solicita recuperación de contraseña
	 * @param email Email del usuario
	 */
	async forgotPassword(
		email: string
	): Promise<{success: boolean; message: string}> {
		return await this.authRepository.forgotPassword(email);
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
		return await this.authRepository.resetPassword(
			token,
			password,
			confirmPassword
		);
	}

	/**
	 * Verifica si el token de recuperación es válido
	 * @param token Token de recuperación
	 */
	async verifyResetToken(
		token: string
	): Promise<{success: boolean; message: string}> {
		return await this.authRepository.verifyResetToken(token);
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
		return await this.authRepository.changePassword(
			currentPassword,
			newPassword
		);
	}
}
