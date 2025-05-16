// src/core/domain/models/auth/AuthModels.ts

/**
 * Modelos relacionados con autenticación y usuario
 */

// Solicitud de login
export interface LoginRequest {
	email: string;
	password: string;
	totpToken?: string;
}

// Respuesta del servidor al login
export interface LoginResponse {
	success: boolean;
	message: string;
	data?: User;
}

// Solicitud de registro
export interface RegisterRequest {
	firstName: string;
	lastName: string;
	email: string;
	password: string;
	professionalType: string;
	referralCode?: string;
}

// Respuesta del servidor al registro
export interface RegisterResponse {
	success: boolean;
	message: string;
	data?: {
		id: string;
		email: string;
	};
}

// Modelo de usuario
export interface User {
	id: string;
	firstName: string;
	lastName: string;
	email: string;
	role: string;
	subscriptionPlan: string;
	profilePicture?: string;
	professionalType: string;
	isActive?: boolean;
	isVerified?: boolean;
}

// Estructura de error API
export interface ApiError {
	success: false;
	message: string;
	errors?: Array<{
		field: string;
		message: string;
	}>;
}
