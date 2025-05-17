// src/utils/endpoints.ts

/**
 * Centralización de endpoints de la API de CONSTRU
 * Organizado por módulos para facilitar mantenimiento
 */

// Base URL se toma del entorno
import environment from "../config/environment";

// Construir rutas completas usando la URL base
const getFullUrl = (path: string): string => `${environment.apiBaseUrl}${path}`;

// Endpoints de autenticación y gestión de usuarios
const auth = {
	login: getFullUrl("/auth/login"),
	register: getFullUrl("/auth/register"),
	refreshToken: getFullUrl("/auth/refresh-token"),
	logout: getFullUrl("/auth/logout"),
	verifyEmail: (token: string) => getFullUrl(`/auth/verify-email/${token}`),
	forgotPassword: getFullUrl("/auth/forgot-password"),
	resetPassword: (token: string) => getFullUrl(`/auth/reset-password/${token}`),
	profile: getFullUrl("/auth/profile"),
	setup2FA: getFullUrl("/auth/2fa/setup"),
	verify2FA: getFullUrl("/auth/2fa/verify"),
	disable2FA: getFullUrl("/auth/2fa/disable"),
	validate2FA: getFullUrl("/auth/2fa/validate"),
	recovery2FA: getFullUrl("/auth/2fa/recovery"),
	verifyResetToken: getFullUrl("/auth/verify-reset-token"),
	changePassword: getFullUrl("/auth/change-password"),
};

// Endpoints de perfil de usuario
const user = {
  profile: getFullUrl("/user/profile"),
  personalInfo: getFullUrl("/user/personal-info"),
  professionalInfo: getFullUrl("/user/professional-info"),
  addresses: getFullUrl("/user/addresses"),
  preferences: getFullUrl("/user/preferences"),
  profilePicture: getFullUrl("/user/profile-picture"),
};

// Endpoints de cálculos técnicos
const calculations = {
	execute: getFullUrl("/calculations/execute"),
	saveResult: getFullUrl("/calculations/save-result"),
	recommendations: getFullUrl("/calculations/recommendations"),
	templates: {
		list: getFullUrl("/calculations/templates"),
		create: getFullUrl("/calculations/templates"),
		getById: (id: string) => getFullUrl(`/calculations/templates/${id}`),
		update: (id: string) => getFullUrl(`/calculations/templates/${id}`),
		delete: (id: string) => getFullUrl(`/calculations/templates/${id}`),
		preview: (id: string) =>
			getFullUrl(`/calculations/templates/${id}/preview`),
		export: (id: string) =>
			getFullUrl(`/calculations/templates/export/${id}`),
		exportMultiple: getFullUrl("/calculations/templates/export-multiple"),
		import: getFullUrl("/calculations/templates/import"),
		importMultiple: getFullUrl("/calculations/templates/import-multiple"),
	},
};

// Endpoints de materiales
const materials = {
	list: getFullUrl("/materials"),
	create: getFullUrl("/materials"),
	getById: (id: string) => getFullUrl(`/materials/${id}`),
	update: (id: string) => getFullUrl(`/materials/${id}`),
	delete: (id: string) => getFullUrl(`/materials/${id}`),
	updateStock: (id: string) => getFullUrl(`/materials/${id}/stock`),
	bulkUpdatePrices: getFullUrl("/materials/bulk-update-prices"),
	priceHistory: (id: string) =>
		getFullUrl(`/materials/${id}/price-history`),
	comparePrices: (materialId: string) =>
		getFullUrl(`/materials/${materialId}/compare-prices`),
};

// Endpoints de proyectos
const projects = {
	list: getFullUrl("/projects"),
	create: getFullUrl("/projects"),
	getById: (id: string) => getFullUrl(`/projects/${id}`),
	update: (id: string) => getFullUrl(`/projects/${id}`),
	delete: (id: string) => getFullUrl(`/projects/${id}`),
	schedule: (projectId: string) =>
		getFullUrl(`/projects/${projectId}/schedule`),
};

// Endpoints de presupuestos
const budgets = {
	generate: getFullUrl("/budgets/generate"),
	listByProject: (projectId: string) =>
		getFullUrl(`/budgets/project/${projectId}`),
	getById: (budgetId: string) => getFullUrl(`/budgets/${budgetId}`),
	createVersion: (budgetId: string) =>
		getFullUrl(`/budgets/${budgetId}/version`),
	updateStatus: (budgetId: string) =>
		getFullUrl(`/budgets/${budgetId}/status`),
	compare: getFullUrl("/budgets/compare"),
	addCosts: (budgetId: string) => getFullUrl(`/budgets/${budgetId}/costs`),
	exportPDF: (budgetId: string) =>
		getFullUrl(`/budgets/${budgetId}/export-pdf`),
};

// Endpoints de facturas
const invoices = {
	list: getFullUrl("/invoices"),
	create: getFullUrl("/invoices"),
	getById: (id: string) => getFullUrl(`/invoices/${id}`),
	update: (id: string) => getFullUrl(`/invoices/${id}`),
	delete: (id: string) => getFullUrl(`/invoices/${id}`),
	generatePDF: (id: string) => getFullUrl(`/invoices/${id}/pdf`),
	syncSRI: (id: string) => getFullUrl(`/invoices/${id}/sri`),
	sendEmail: (id: string) => getFullUrl(`/invoices/${id}/email`),
	registerPayment: (id: string) => getFullUrl(`/invoices/${id}/payment`),
};

// Endpoints de notificaciones
const notifications = {
	list: getFullUrl("/notifications"),
	markAsRead: (id: string) => getFullUrl(`/notifications/${id}/read`),
	markAllAsRead: getFullUrl("/notifications/mark-all-read"),
	delete: (id: string) => getFullUrl(`/notifications/${id}`),
	deleteAll: getFullUrl("/notifications/delete-all"),
	preferences: getFullUrl("/notifications/preferences"),
	updatePreferences: getFullUrl("/notifications/preferences"),
	registerDevice: getFullUrl("/notifications/devices"),
	unregisterDevice: (token: string) =>
		getFullUrl(`/notifications/devices/${token}`),
	devices: getFullUrl("/notifications/devices"), // Add this line
};

// Exportar todos los endpoints agrupados
const endpoints = {
	auth,
	user,
	calculations,
	materials,
	projects,
	budgets,
	invoices,
	notifications,
};

export default endpoints;
