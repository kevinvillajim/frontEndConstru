// src/core/application/ServiceFactory.ts

import {AuthService} from "./auth/AuthService";
import {UserService} from "./user/UserService";
import {TemplateApplicationServiceImpl} from "./calculations/TemplateApplicationService";

import {ApiAuthRepository} from "../adapters/api/ApiAuthRepository";
import {ApiUserRepository} from "../adapters/api/ApiUserRepository";
import {
	ApiCalculationTemplateRepository,
	ApiCalculationExecutionRepository,
	ApiUserFavoritesRepository,
} from "../adapters/api/ApiCalculationRepository";

import type {AuthRepository} from "../domain/repositories/AuthRepository";
import type {UserRepository} from "../domain/repositories/UserRepository";
import type {
	CalculationTemplateRepository,
	CalculationExecutionRepository,
	UserFavoritesRepository,
} from "../domain/repositories/CalculationTemplateRepository";
import type {TemplateApplicationService} from "./calculations/TemplateApplicationService";

import ApiClient from "../adapters/api/ApiClient";

/**
 * Factory que proporciona instancias de servicios ya configuradas
 * Facilita el uso de inyección de dependencias y el testing
 */

// ==================== REPOSITORIOS ====================
// Auth & User (existentes)
const authRepository: AuthRepository = new ApiAuthRepository();
const userRepository: UserRepository = new ApiUserRepository();

// Calculation Repositories (nuevos)
const calculationTemplateRepository: CalculationTemplateRepository =
	new ApiCalculationTemplateRepository(ApiClient);
const calculationExecutionRepository: CalculationExecutionRepository =
	new ApiCalculationExecutionRepository(ApiClient);
const userFavoritesRepository: UserFavoritesRepository =
	new ApiUserFavoritesRepository(ApiClient);

// ==================== SERVICIOS ====================
// Auth & User Services (existentes)
export const authService = new AuthService(authRepository);
export const userService = new UserService(userRepository);

// Template Application Service (nuevo)
export const templateApplicationService: TemplateApplicationService =
	new TemplateApplicationServiceImpl(
		calculationTemplateRepository,
		calculationExecutionRepository,
		userFavoritesRepository
	);

// ==================== FACTORY FUNCTIONS ====================
// Para testing - Auth & User (existentes)
export const createAuthService = (
	customAuthRepository: AuthRepository
): AuthService => {
	return new AuthService(customAuthRepository);
};

export const createUserService = (
	customUserRepository: UserRepository
): UserService => {
	return new UserService(customUserRepository);
};

// Para testing - Templates (nuevos)
export const createTemplateApplicationService = (
	customTemplateRepository: CalculationTemplateRepository,
	customExecutionRepository: CalculationExecutionRepository,
	customFavoritesRepository: UserFavoritesRepository
): TemplateApplicationService => {
	return new TemplateApplicationServiceImpl(
		customTemplateRepository,
		customExecutionRepository,
		customFavoritesRepository
	);
};

// ==================== CONFIGURACIÓN ====================
/**
 * Configuración global de servicios
 */
export const ServiceConfig = {
	// Configuración de API
	apiBaseUrl: import.meta.env.VITE_API_BASE_URL || "http://localhost:4000/api",

	// Configuración de cache
	enableCache: true,
	cacheTimeout: 5 * 60 * 1000, // 5 minutos

	// Configuración de retry
	maxRetries: 3,
	retryDelay: 1000,

	// Configuración de templates
	templatesPerPage: 50,
	maxTemplatesCache: 200,
} as const;

// ==================== UTILIDADES ====================
/**
 * Inicializa todos los servicios con configuración
 */
export const initializeServices = async () => {
	try {
		// Aquí puedes agregar inicialización específica si es necesaria
		console.log("Services initialized successfully");
		return true;
	} catch (error) {
		console.error("Failed to initialize services:", error);
		return false;
	}
};

/**
 * Limpia cache y estado de servicios
 */
export const cleanupServices = () => {
	// Implementar limpieza si es necesaria
	console.log("Services cleaned up");
};

// ==================== TYPES EXPORT ====================
export type {
	TemplateApplicationService,
	CalculationTemplateRepository,
	CalculationExecutionRepository,
	UserFavoritesRepository,
};
