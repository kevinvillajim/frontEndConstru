// src/core/application/user/UserService.ts

import type {
	UserProfile,
	ProfileUpdateResponse,
	UserAddress,
	UserPreferences,
} from "../../domain/models/user/User";
import type {UserRepository} from "../../domain/repositories/UserRepository";

/**
 * Servicio que gestiona las operaciones relacionadas con el perfil de usuario
 */
export class UserService {
	private userRepository: UserRepository;

	constructor(userRepository: UserRepository) {
		this.userRepository = userRepository;
	}

	/**
	 * Obtiene el perfil completo del usuario
	 * @param userId ID del usuario
	 */
	async getProfile(userId: string): Promise<UserProfile> {
		return await this.userRepository.getProfile(userId);
	}

	/**
	 * Actualiza la información personal del usuario
	 * @param userId ID del usuario
	 * @param data Datos personales a actualizar
	 */
	async updatePersonalInfo(
		userId: string,
		data: Partial<UserProfile>
	): Promise<ProfileUpdateResponse> {
		return await this.userRepository.updatePersonalInfo(userId, data);
	}

	/**
	 * Actualiza la información profesional del usuario
	 * @param userId ID del usuario
	 * @param data Datos profesionales a actualizar
	 */
	async updateProfessionalInfo(
		userId: string,
		data: Partial<UserProfile>
	): Promise<ProfileUpdateResponse> {
		return await this.userRepository.updateProfessionalInfo(userId, data);
	}

	/**
	 * Actualiza o crea una dirección para el usuario
	 * @param userId ID del usuario
	 * @param addressId ID de la dirección (si es para actualizar)
	 * @param addressData Datos de la dirección
	 */
	async updateAddress(
		userId: string,
		addressId: string | undefined,
		addressData: UserAddress
	): Promise<ProfileUpdateResponse> {
		return await this.userRepository.updateAddress(
			userId,
			addressId,
			addressData
		);
	}

	/**
	 * Elimina una dirección del usuario
	 * @param userId ID del usuario
	 * @param addressId ID de la dirección
	 */
	async deleteAddress(
		userId: string,
		addressId: string
	): Promise<ProfileUpdateResponse> {
		return await this.userRepository.deleteAddress(userId, addressId);
	}

	/**
	 * Actualiza la imagen de perfil del usuario
	 * @param userId ID del usuario
	 * @param imageFile Archivo de imagen
	 */
	async updateProfilePicture(
		userId: string,
		imageFile: File
	): Promise<ProfileUpdateResponse> {
		return await this.userRepository.updateProfilePicture(userId, imageFile);
	}

	/**
	 * Actualiza las preferencias del usuario
	 * @param userId ID del usuario
	 * @param preferences Preferencias a actualizar
	 */
	async updatePreferences(
		userId: string,
		preferences: Partial<UserPreferences>
	): Promise<ProfileUpdateResponse> {
		return await this.userRepository.updatePreferences(userId, preferences);
	}

	/**
	 * Actualiza las preferencias de notificaciones del usuario
	 * @param userId ID del usuario
	 * @param notificationPreferences Preferencias de notificaciones
	 */
	async updateNotificationPreferences(
		userId: string,
		notificationPreferences: unknown
	): Promise<ProfileUpdateResponse> {
		return await this.userRepository.updateNotificationPreferences(
			userId,
			notificationPreferences
		);
	}

	/**
	 * Registra un dispositivo para notificaciones push
	 * @param userId ID del usuario
	 * @param deviceToken Token del dispositivo
	 * @param deviceType Tipo de dispositivo (opcional)
	 */
	async registerDevice(
		userId: string,
		deviceToken: string,
		deviceType?: string
	): Promise<ProfileUpdateResponse> {
		return await this.userRepository.registerDevice(
			userId,
			deviceToken,
			deviceType
		);
	}

	/**
	 * Elimina un dispositivo registrado
	 * @param userId ID del usuario
	 * @param deviceToken Token del dispositivo
	 */
	async unregisterDevice(
		userId: string,
		deviceToken: string
	): Promise<ProfileUpdateResponse> {
		return await this.userRepository.unregisterDevice(userId, deviceToken);
	}
}
