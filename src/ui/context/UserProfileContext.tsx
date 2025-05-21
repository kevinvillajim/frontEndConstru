// src/ui/context/UserProfileContext.tsx

import React, {createContext, useContext, useState, useEffect, ReactNode} from "react";
import {userService} from "../../core/application/ServiceFactory";
import {useAuth} from "./AuthContext";
import ToastService from "../components/common/ToastService";
import type {
	UserProfile,
	UserAddress,
	UserPreferences,
	ProfileUpdateResponse,
} from "../../core/domain/models/user/User";

// Definición del contexto
interface UserProfileContextProps {
	profile: UserProfile | null;
	isLoading: boolean;
	error: string | null;

	// Métodos para actualizar el perfil
	updatePersonalInfo: (
		data: Partial<UserProfile>
	) => Promise<ProfileUpdateResponse>;
	updateProfessionalInfo: (
		data: Partial<UserProfile>
	) => Promise<ProfileUpdateResponse>;
	updateAddress: (
		addressId: string | undefined,
		data: UserAddress
	) => Promise<ProfileUpdateResponse>;
	deleteAddress: (addressId: string) => Promise<ProfileUpdateResponse>;
	updateProfilePicture: (imageFile: File) => Promise<ProfileUpdateResponse>;
	updatePreferences: (
		preferences: Partial<UserPreferences>
	) => Promise<ProfileUpdateResponse>;
	updateNotificationPreferences: (
		notificationPreferences: unknown
	) => Promise<ProfileUpdateResponse>;

	// Método para recargar el perfil
	refreshProfile: () => Promise<void>;
}

// Crear el contexto
const UserProfileContext = createContext<UserProfileContextProps | undefined>(
	undefined
);

// Hook para usar el contexto
export const useUserProfile = () => {
	const context = useContext(UserProfileContext);
	if (context === undefined) {
		throw new Error(
			"useUserProfile debe ser usado dentro de un UserProfileProvider"
		);
	}
	return context;
};

// Props del proveedor
interface UserProfileProviderProps {
	children: React.ReactNode;
}

// Proveedor del contexto
export const UserProfileProvider: React.FC<UserProfileProviderProps> = ({
	children,
}) => {
	const {user} = useAuth();
	const [profile, setProfile] = useState<UserProfile | null>(null);
	const [isLoading, setIsLoading] = useState<boolean>(true);
	const [error, setError] = useState<string | null>(null);

	// Cargar el perfil cuando el componente se monta
	useEffect(() => {
		if (user) {
			refreshProfile();
		} else {
			setProfile(null);
			setIsLoading(false);
		}
	}, [user]);

	// Función para recargar el perfil desde el servidor
	const refreshProfile = async () => {
		if (!user) return;

		setIsLoading(true);
		setError(null);

		try {
			const profileData = await userService.getProfile(user.id);
			setProfile(profileData);
		} catch (error) {
			console.error("Error al cargar perfil:", error);
			const err = error as {message: string};
			setError(err.message || "Error al cargar perfil");
			ToastService.error("Error al cargar datos de perfil");
		} finally {
			setIsLoading(false);
		}
	};

	// Actualizar información personal
	const updatePersonalInfo = async (data: Partial<UserProfile>) => {
		if (!user) throw new Error("Usuario no autenticado");

		setIsLoading(true);
		try {
			const response = await userService.updatePersonalInfo(user.id, data);
			if (response.success) {
				await refreshProfile();
				ToastService.success("Información personal actualizada correctamente");
			}
			return response;
		} catch (error) {
			console.error("Error al actualizar información personal:", error);
			const err = error as {message: string};
			ToastService.error(
				err.message || "Error al actualizar información personal"
			);
			throw error;
		} finally {
			setIsLoading(false);
		}
	};

	// Actualizar información profesional
	const updateProfessionalInfo = async (data: Partial<UserProfile>) => {
		if (!user) throw new Error("Usuario no autenticado");

		setIsLoading(true);
		try {
			const response = await userService.updateProfessionalInfo(user.id, data);
			if (response.success) {
				await refreshProfile();
				ToastService.success(
					"Información profesional actualizada correctamente"
				);
			}
			return response;
		} catch (error) {
			console.error("Error al actualizar información profesional:", error);
			const err = error as {message: string};
			ToastService.error(
				err.message || "Error al actualizar información profesional"
			);
			throw error;
		} finally {
			setIsLoading(false);
		}
	};

	// Actualizar dirección
	const updateAddress = async (
		addressId: string | undefined,
		data: UserAddress
	) => {
		if (!user) throw new Error("Usuario no autenticado");

		setIsLoading(true);
		try {
			const response = await userService.updateAddress(
				user.id,
				addressId,
				data
			);
			if (response.success) {
				await refreshProfile();
				ToastService.success(
					addressId
						? "Dirección actualizada correctamente"
						: "Dirección agregada correctamente"
				);
			}
			return response;
		} catch (error) {
			console.error("Error al actualizar dirección:", error);
			const err = error as {message: string};
			ToastService.error(err.message || "Error al actualizar dirección");
			throw error;
		} finally {
			setIsLoading(false);
		}
	};

	// Eliminar dirección
	const deleteAddress = async (addressId: string) => {
		if (!user) throw new Error("Usuario no autenticado");

		setIsLoading(true);
		try {
			const response = await userService.deleteAddress(user.id, addressId);
			if (response.success) {
				await refreshProfile();
				ToastService.success("Dirección eliminada correctamente");
			}
			return response;
		} catch (error) {
			console.error("Error al eliminar dirección:", error);
			const err = error as {message: string};
			ToastService.error(err.message || "Error al eliminar dirección");
			throw error;
		} finally {
			setIsLoading(false);
		}
	};

	// Actualizar imagen de perfil
	const updateProfilePicture = async (imageFile: File) => {
		if (!user) throw new Error("Usuario no autenticado");

		setIsLoading(true);
		try {
			const response = await userService.updateProfilePicture(
				user.id,
				imageFile
			);
			if (response.success) {
				await refreshProfile();
				ToastService.success("Imagen de perfil actualizada correctamente");
			}
			return response;
		} catch (error) {
			console.error("Error al actualizar imagen de perfil:", error);
			const err = error as {message: string};
			ToastService.error(err.message || "Error al actualizar imagen de perfil");
			throw error;
		} finally {
			setIsLoading(false);
		}
	};

	// Actualizar preferencias
	const updatePreferences = async (preferences: Partial<UserPreferences>) => {
		if (!user) throw new Error("Usuario no autenticado");

		setIsLoading(true);
		try {
			const response = await userService.updatePreferences(
				user.id,
				preferences
			);
			if (response.success) {
				await refreshProfile();
				ToastService.success("Preferencias actualizadas correctamente");
			}
			return response;
		} catch (error) {
			console.error("Error al actualizar preferencias:", error);
			const err = error as {message: string};
			ToastService.error(err.message || "Error al actualizar preferencias");
			throw error;
		} finally {
			setIsLoading(false);
		}
	};

	// Actualizar preferencias de notificaciones
	const updateNotificationPreferences = async (
		notificationPreferences: unknown
	) => {
		if (!user) throw new Error("Usuario no autenticado");

		setIsLoading(true);
		try {
			const response = await userService.updateNotificationPreferences(
				user.id,
				notificationPreferences
			);
			if (response.success) {
				await refreshProfile();
				ToastService.success(
					"Preferencias de notificaciones actualizadas correctamente"
				);
			}
			return response;
		} catch (error) {
			console.error(
				"Error al actualizar preferencias de notificaciones:",
				error
			);
			const err = error as {message: string};
			ToastService.error(
				err.message || "Error al actualizar preferencias de notificaciones"
			);
			throw error;
		} finally {
			setIsLoading(false);
		}
	};

	// Valor del contexto
	const contextValue: UserProfileContextProps = {
		profile,
		isLoading,
		error,
		updatePersonalInfo,
		updateProfessionalInfo,
		updateAddress,
		deleteAddress,
		updateProfilePicture,
		updatePreferences,
		updateNotificationPreferences,
		refreshProfile,
	};

	return (
		<UserProfileContext.Provider value={contextValue}>
			{children}
		</UserProfileContext.Provider>
	);
};

export default UserProfileProvider;
