// src/ui/context/AuthContext.tsx

import React, {createContext, useContext, useEffect, useState} from "react";
import type {
	User,
	RegisterRequest,
} from "../../core/domain/models/auth/AuthModels";
import {authService} from "../../core/application/ServiceFactory";
import {LocalStorageService} from "../../infrastructure/services/LocalStorageService";
import appConfig from "../../config/appConfig";

// Interfaz para el contexto de autenticación
interface AuthContextProps {
	user: User | null;
	isAuthenticated: boolean;
	isLoading: boolean;
	login: (email: string, password: string, totpToken?: string) => Promise<void>;
	register: (userData: RegisterRequest) => Promise<void>;
	logout: () => Promise<void>;
	refreshAuthStatus: () => Promise<void>;
	changePassword: (
		currentPassword: string,
		newPassword: string
	) => Promise<{success: boolean; message: string}>;
}

// Crear el contexto
const AuthContext = createContext<AuthContextProps | undefined>(undefined);

// Hook personalizado para acceder al contexto
const useAuth = (): AuthContextProps => {
	const context = useContext(AuthContext);
	if (context === undefined) {
		throw new Error("useAuth debe ser usado dentro de un AuthProvider");
	}
	return context;
};

// Proveedor del contexto
const AuthProvider: React.FC<{children: React.ReactNode}> = ({children}) => {
	const [user, setUser] = useState<User | null>(null);
	const [isLoading, setIsLoading] = useState<boolean>(true);
	const storageService = new LocalStorageService();

	// Verificar el estado de autenticación al cargar la aplicación
	const refreshAuthStatus = async (): Promise<void> => {
		setIsLoading(true);
		try {
			// Verificar si hay datos de usuario en localStorage
			const storedUser = storageService.getItem(
				appConfig.storage.userKey
			) as User | null;

			if (storedUser) {
				try {
					// Validar sesión con el backend
					const profile = await authService.getProfile();
					setUser(profile);
				} catch (refreshError) {
					// Si falla, limpiar datos almacenados
					storageService.removeItem(appConfig.storage.userKey);
					storageService.removeItem(appConfig.storage.authTokenKey);
					setUser(null);
					console.error("Error al validar sesión:", refreshError);
				}
			} else {
				setUser(null);
			}
		} catch (statusError) {
			console.error("Error al verificar estado de autenticación:", statusError);
			setUser(null);
		} finally {
			setIsLoading(false);
		}
	};

	// Verificar autenticación al montar el componente
	useEffect(() => {
		refreshAuthStatus();
		// Como refreshAuthStatus es una función definida dentro del componente,
		// no necesitamos incluirla en el arreglo de dependencias
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	// Función de login
	const login = async (
		email: string,
		password: string,
		totpToken?: string
	): Promise<void> => {
		setIsLoading(true);
		try {
			const response = await authService.login({email, password, totpToken});

			if (response.success && response.data) {
				storageService.setItem(appConfig.storage.userKey, response.data);
				setUser(response.data);
			} else {
				throw new Error(response.message || "Error al iniciar sesión");
			}
		} finally {
			setIsLoading(false);
		}
	};

	// Función de registro
	const register = async (userData: RegisterRequest): Promise<void> => {
		setIsLoading(true);
		try {
			const response = await authService.register(userData);
			if (!response.success) {
				throw new Error(response.message || "Error al registrarse");
			}
			// Normalmente no iniciamos sesión automáticamente después del registro
		} finally {
			setIsLoading(false);
		}
	};

	// Función de logout
	const logout = async (): Promise<void> => {
		setIsLoading(true);
		try {
			await authService.logout();
			storageService.removeItem(appConfig.storage.userKey);
			storageService.removeItem(appConfig.storage.authTokenKey);
			setUser(null);
		} catch (logoutError) {
			console.error("Error durante cierre de sesión:", logoutError);
			// Aunque falle la llamada API, limpiamos el estado local
			storageService.removeItem(appConfig.storage.userKey);
			storageService.removeItem(appConfig.storage.authTokenKey);
			setUser(null);
		} finally {
			setIsLoading(false);
		}
	};

	const changePassword = async (
		currentPassword: string,
		newPassword: string
	): Promise<{success: boolean; message: string}> => {
		setIsLoading(true);
		try {
			const response = await authService.changePassword(
				currentPassword,
				newPassword
			);
			setIsLoading(false);
			return response;
		} catch (error) {
			setIsLoading(false);
			console.error("Error al cambiar contraseña:", error);
			const err = error as {message: string};
			throw {
				success: false,
				message: err.message || "Error al cambiar la contraseña",
			};
		}
	};

	

	// Valor del contexto
	const contextValue: AuthContextProps = {
		user,
		isAuthenticated: !!user,
		isLoading,
		login,
		register,
		logout,
		refreshAuthStatus,
		changePassword,
	};

	return (
		<AuthContext.Provider value={contextValue}>{children}</AuthContext.Provider>
	);
};

export {useAuth, AuthProvider};
export default AuthProvider;
