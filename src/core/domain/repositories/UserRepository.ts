// src/core/domain/repositories/UserRepository.ts

import type {
	UserProfile,
	ProfileUpdateResponse,
	UserAddress,
	UserPreferences,
} from "../models/user/User";

/**
 * Puerto (interfaz) para el repositorio de perfiles de usuario
 * Define los métodos que cualquier implementación debe proveer
 */
export interface UserRepository {
	/**
	 * Obtiene el perfil completo del usuario
	 * @param userId ID del usuario
	 */
	getProfile(userId: string): Promise<UserProfile>;

	/**
	 * Actualiza la información personal del usuario
	 * @param userId ID del usuario
	 * @param data Datos personales a actualizar
	 */
	updatePersonalInfo(
		userId: string,
		data: Partial<UserProfile>
	): Promise<ProfileUpdateResponse>;

	/**
	 * Actualiza la información profesional del usuario
	 * @param userId ID del usuario
	 * @param data Datos profesionales a actualizar
	 */
	updateProfessionalInfo(
		userId: string,
		data: Partial<UserProfile>
	): Promise<ProfileUpdateResponse>;

	/**
	 * Actualiza la dirección del usuario
	 * @param userId ID del usuario
	 * @param addressId ID de la dirección (opcional, si se omite se crea una nueva)
	 * @param data Datos de la dirección
	 */
	updateAddress(
		userId: string,
		addressId: string | undefined,
		data: UserAddress
	): Promise<ProfileUpdateResponse>;

	/**
	 * Elimina una dirección del usuario
	 * @param userId ID del usuario
	 * @param addressId ID de la dirección
	 */
	deleteAddress(
		userId: string,
		addressId: string
	): Promise<ProfileUpdateResponse>;

	/**
	 * Actualiza la imagen de perfil del usuario
	 * @param userId ID del usuario
	 * @param imageFile Archivo de imagen
	 */
	updateProfilePicture(
		userId: string,
		imageFile: File
	): Promise<ProfileUpdateResponse>;

	/**
	 * Actualiza las preferencias del usuario
	 * @param userId ID del usuario
	 * @param preferences Preferencias a actualizar
	 */
	updatePreferences(
		userId: string,
		preferences: Partial<UserPreferences>
	): Promise<ProfileUpdateResponse>;

	/**
	 * Actualiza las preferencias de notificaciones del usuario
	 * @param userId ID del usuario
	 * @param notificationPreferences Preferencias de notificaciones
	 */
	updateNotificationPreferences(
		userId: string,
		notificationPreferences: unknown
	): Promise<ProfileUpdateResponse>;

	/**
	 * Registra un dispositivo para notificaciones push
	 * @param userId ID del usuario
	 * @param deviceToken Token del dispositivo
	 * @param deviceType Tipo de dispositivo (opcional)
	 */
	registerDevice(
		userId: string,
		deviceToken: string,
		deviceType?: string
	): Promise<ProfileUpdateResponse>;

	/**
	 * Elimina un dispositivo registrado
	 * @param userId ID del usuario
	 * @param deviceToken Token del dispositivo
	 */
	unregisterDevice(
		userId: string,
		deviceToken: string
	): Promise<ProfileUpdateResponse>;
}
