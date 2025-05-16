// src/ui/hooks/useUserProfile.ts
import {useState} from "react";
import {useAuth} from "../context/AuthContext";
import {userService} from "../../core/application/ServiceFactory";
import type {
	User,
	UserAddress,
	UserPreferences,
} from "../../core/domain/models/user/User";
import ToastService from "../components/common/ToastService";

export const useUserProfile = () => {
	const {user, refreshAuthStatus} = useAuth();
	const [isLoading, setIsLoading] = useState(false);

	const updatePersonalInfo = async (personalInfo: Partial<User>) => {
		if (!user?.id) return {success: false, message: "Usuario no autenticado"};

		setIsLoading(true);
		try {
			const result = await userService.updatePersonalInfo(
				user.id,
				personalInfo
			);
			if (result.success) {
				ToastService.success(result.message);
				// Actualizar el estado de autenticación para reflejar los cambios
				await refreshAuthStatus();
			} else {
				ToastService.error(result.message);
			}
			return result;
		} catch (error) {
			const errorMessage =
				error instanceof Error
					? error.message
					: "Error al actualizar información personal";
			ToastService.error(errorMessage);
			return {success: false, message: errorMessage};
		} finally {
			setIsLoading(false);
		}
	};

	const updateProfessionalInfo = async (professionalInfo: Partial<User>) => {
		if (!user?.id) return {success: false, message: "Usuario no autenticado"};

		setIsLoading(true);
		try {
			const result = await userService.updateProfessionalInfo(
				user.id,
				professionalInfo
			);
			if (result.success) {
				ToastService.success(result.message);
				await refreshAuthStatus();
			} else {
				ToastService.error(result.message);
			}
			return result;
		} catch (error) {
			const errorMessage =
				error instanceof Error
					? error.message
					: "Error al actualizar información profesional";
			ToastService.error(errorMessage);
			return {success: false, message: errorMessage};
		} finally {
			setIsLoading(false);
		}
	};

	const updatePreferences = async (preferences: UserPreferences) => {
		if (!user?.id) return {success: false, message: "Usuario no autenticado"};

		setIsLoading(true);
		try {
			const result = await userService.updateUserPreferences(
				user.id,
				preferences
			);
			if (result.success) {
				ToastService.success(result.message);
				await refreshAuthStatus();
			} else {
				ToastService.error(result.message);
			}
			return result;
		} catch (error) {
			const errorMessage =
				error instanceof Error
					? error.message
					: "Error al actualizar preferencias";
			ToastService.error(errorMessage);
			return {success: false, message: errorMessage};
		} finally {
			setIsLoading(false);
		}
	};

	const updateAddresses = async (addresses: UserAddress[]) => {
		if (!user?.id) return {success: false, message: "Usuario no autenticado"};

		setIsLoading(true);
		try {
			const result = await userService.updateUserAddresses(user.id, addresses);
			if (result.success) {
				ToastService.success(result.message);
				await refreshAuthStatus();
			} else {
				ToastService.error(result.message);
			}
			return result;
		} catch (error) {
			const errorMessage =
				error instanceof Error
					? error.message
					: "Error al actualizar direcciones";
			ToastService.error(errorMessage);
			return {success: false, message: errorMessage};
		} finally {
			setIsLoading(false);
		}
	};

	return {
		user,
		isLoading,
		updatePersonalInfo,
		updateProfessionalInfo,
		updatePreferences,
		updateAddresses,
	};
};
