// src/core/adapters/api/ApiUserRepository.ts

import axios, {AxiosError} from "axios";
import type {
	UserProfile,
	ProfileUpdateResponse,
	UserAddress,
	UserPreferences,
} from "../../domain/models/user/User";
import type {UserRepository} from "../../domain/repositories/UserRepository";
import endpoints from "../../../utils/endpoints";

/**
 * Implementación del repositorio de usuario que utiliza
 * endpoints de API para operaciones de perfil
 */
export class ApiUserRepository implements UserRepository {
	/**
	 * Obtiene el perfil completo del usuario
	 * @param userId ID del usuario
	 */
	// eslint-disable-next-line @typescript-eslint/no-unused-vars
	async getProfile(userId: string): Promise<UserProfile> {
		try {
			// En la mayoría de los casos, el userId no es necesario porque
			// el backend determina el usuario mediante el token de autenticación
			const response = await axios.get<{success: boolean; data: UserProfile}>(
				endpoints.user.profile,
				{withCredentials: true}
			);

			return response.data.data;
		} catch (error) {
			console.error("Error al obtener perfil de usuario:", error);
			if (axios.isAxiosError(error)) {
				const axiosError = error as AxiosError<{
					success: false;
					message: string;
				}>;
				if (axiosError.response) {
					throw axiosError.response.data;
				}
			}
			throw {success: false, message: "Error de conexión al servidor"};
		}
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
		try {
			const response = await axios.put<ProfileUpdateResponse>(
				endpoints.user.personalInfo,
				data,
				{withCredentials: true}
			);

			return response.data;
		} catch (error) {
			console.error("Error al actualizar información personal:", error);
			if (axios.isAxiosError(error)) {
				const axiosError = error as AxiosError<{
					success: false;
					message: string;
				}>;
				if (axiosError.response) {
					throw axiosError.response.data;
				}
			}
			throw {success: false, message: "Error de conexión al servidor"};
		}
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
		try {
			const response = await axios.put<ProfileUpdateResponse>(
				endpoints.user.professionalInfo,
				data,
				{withCredentials: true}
			);

			return response.data;
		} catch (error) {
			console.error("Error al actualizar información profesional:", error);
			if (axios.isAxiosError(error)) {
				const axiosError = error as AxiosError<{
					success: false;
					message: string;
				}>;
				if (axiosError.response) {
					throw axiosError.response.data;
				}
			}
			throw {success: false, message: "Error de conexión al servidor"};
		}
	}

	/**
	 * Actualiza la dirección del usuario
	 * @param userId ID del usuario
	 * @param addressId ID de la dirección (opcional, si se omite se crea una nueva)
	 * @param data Datos de la dirección
	 */
	async updateAddress(
		userId: string,
		addressId: string | undefined,
		data: UserAddress
	): Promise<ProfileUpdateResponse> {
		try {
			let url = endpoints.user.addresses;
			let method = "post";

			// Si existe addressId, actualizar dirección existente
			if (addressId) {
				url = `${url}/${addressId}`;
				method = "put";
			}

			const response = await axios.request<ProfileUpdateResponse>({
				url,
				method,
				data,
				withCredentials: true,
			});

			return response.data;
		} catch (error) {
			console.error("Error al actualizar dirección:", error);
			if (axios.isAxiosError(error)) {
				const axiosError = error as AxiosError<{
					success: false;
					message: string;
				}>;
				if (axiosError.response) {
					throw axiosError.response.data;
				}
			}
			throw {success: false, message: "Error de conexión al servidor"};
		}
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
		try {
			const response = await axios.delete<ProfileUpdateResponse>(
				`${endpoints.user.addresses}/${addressId}`,
				{withCredentials: true}
			);

			return response.data;
		} catch (error) {
			console.error("Error al eliminar dirección:", error);
			if (axios.isAxiosError(error)) {
				const axiosError = error as AxiosError<{
					success: false;
					message: string;
				}>;
				if (axiosError.response) {
					throw axiosError.response.data;
				}
			}
			throw {success: false, message: "Error de conexión al servidor"};
		}
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
		try {
			const formData = new FormData();
			formData.append("profilePicture", imageFile);

			const response = await axios.post<ProfileUpdateResponse>(
				endpoints.user.profilePicture,
				formData,
				{
					withCredentials: true,
					headers: {
						"Content-Type": "multipart/form-data",
					},
				}
			);

			return response.data;
		} catch (error) {
			console.error("Error al actualizar imagen de perfil:", error);
			if (axios.isAxiosError(error)) {
				const axiosError = error as AxiosError<{
					success: false;
					message: string;
				}>;
				if (axiosError.response) {
					throw axiosError.response.data;
				}
			}
			throw {success: false, message: "Error de conexión al servidor"};
		}
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
		try {
			const response = await axios.put<ProfileUpdateResponse>(
				endpoints.user.preferences,
				preferences,
				{withCredentials: true}
			);

			return response.data;
		} catch (error) {
			console.error("Error al actualizar preferencias:", error);
			if (axios.isAxiosError(error)) {
				const axiosError = error as AxiosError<{
					success: false;
					message: string;
				}>;
				if (axiosError.response) {
					throw axiosError.response.data;
				}
			}
			throw {success: false, message: "Error de conexión al servidor"};
		}
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
		try {
			const response = await axios.patch<ProfileUpdateResponse>(
				endpoints.notifications.preferences,
				notificationPreferences,
				{withCredentials: true}
			);

			return response.data;
		} catch (error) {
			console.error(
				"Error al actualizar preferencias de notificaciones:",
				error
			);
			if (axios.isAxiosError(error)) {
				const axiosError = error as AxiosError<{
					success: false;
					message: string;
				}>;
				if (axiosError.response) {
					throw axiosError.response.data;
				}
			}
			throw {success: false, message: "Error de conexión al servidor"};
		}
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
		try {
			const response = await axios.post<ProfileUpdateResponse>(
				endpoints.notifications.devices,
				{deviceToken, deviceType},
				{withCredentials: true}
			);

			return response.data;
		} catch (error) {
			console.error("Error al registrar dispositivo:", error);
			if (axios.isAxiosError(error)) {
				const axiosError = error as AxiosError<{
					success: false;
					message: string;
				}>;
				if (axiosError.response) {
					throw axiosError.response.data;
				}
			}
			throw {success: false, message: "Error de conexión al servidor"};
		}
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
		try {
			const response = await axios.delete<ProfileUpdateResponse>(
				`${endpoints.notifications.devices}/${deviceToken}`,
				{withCredentials: true}
			);

			return response.data;
		} catch (error) {
			console.error("Error al eliminar dispositivo:", error);
			if (axios.isAxiosError(error)) {
				const axiosError = error as AxiosError<{
					success: false;
					message: string;
				}>;
				if (axiosError.response) {
					throw axiosError.response.data;
				}
			}
			throw {success: false, message: "Error de conexión al servidor"};
		}
	}
}
