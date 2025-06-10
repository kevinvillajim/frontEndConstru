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
	profile: getFullUrl("/auth/profile"),
	personalInfo: getFullUrl("/user/personal-info"),
	professionalInfo: getFullUrl("/user/professional-info"),
	addresses: getFullUrl("/user/addresses"),
	preferences: getFullUrl("/user/preferences"),
	profilePicture: getFullUrl("/user/profile-picture"),
};

// Endpoints de cálculos técnicos
const calculations = {
	execute: getFullUrl("/calculations/execute"),
	saveResult: getFullUrl("/calculations/save"),
	recommendations: getFullUrl("/calculations/recommendations"),
	savedCalculations: getFullUrl("/calculations/saved"), // Endpoint que puede necesitar ser agregado al backend
	templates: {
		list: getFullUrl("/calculations/templates"),
		create: getFullUrl("/calculations/templates"),
		search: getFullUrl("/calculations/templates/search"), // Añadida ruta de búsqueda
		trending: getFullUrl("/calculations/templates/trending"),
		getById: (id: string) => getFullUrl(`/calculations/templates/${id}`),
		update: (id: string) => getFullUrl(`/calculations/templates/${id}`),
		delete: (id: string) => getFullUrl(`/calculations/templates/${id}`),
		preview: (id: string) =>
			getFullUrl(`/calculations/templates/${id}/preview`),
		export: (id: string) => getFullUrl(`/calculations/templates/export/${id}`),
		exportMultiple: getFullUrl("/calculations/templates/export-multiple"),
		import: getFullUrl("/calculations/templates/import"),
		importMultiple: getFullUrl("/calculations/templates/import-multiple"),
		toggleFavorite: (templateId: string) =>
			getFullUrl(`/calculations/templates/${templateId}/favorite`), // Endpoint que puede necesitar ser agregado
		getUserFavorites: getFullUrl("/calculations/users/favorites"),

		rate: (templateId: string) =>
			getFullUrl(`/calculations/templates/${templateId}/rate`),
		// Sugerencias
		suggest: (templateId: string) =>
			getFullUrl(`/calculations/templates/${templateId}/suggestions`),
		getSuggestions: (templateId: string) =>
			getFullUrl(`/calculations/templates/${templateId}/suggestions`),
		getUserSuggestions: getFullUrl("/users/suggestions"),
	},
	compare: getFullUrl("/calculations/compare"),
	savedComparisons: getFullUrl("/calculations/comparisons"),
	deleteComparison: (id: string) =>
		getFullUrl(`/calculations/comparisons/${id}`),
};

const materialCalculations = {
	base: getFullUrl("/material-calculation"), // ← CORREGIDO: singular
	execute: getFullUrl("/material-calculation/execute"),
	templates: {
		list: getFullUrl("/material-calculation/templates"),
		featured: getFullUrl("/material-calculation/templates/featured"),
		byType: (type: string) =>
			getFullUrl(`/material-calculation/templates/by-type/${type}`),
		byId: (id: string) => getFullUrl(`/material-calculation/templates/${id}`),
		preview: (id: string) =>
			getFullUrl(`/material-calculation/templates/${id}/preview`),
		search: getFullUrl("/material-calculation/templates/search"),
	},
	results: {
		list: getFullUrl("/material-calculation/results"),
		byId: (id: string) => getFullUrl(`/material-calculation/results/${id}`),
		save: (id: string) =>
			getFullUrl(`/material-calculation/results/${id}/save`),
		share: (id: string) =>
			getFullUrl(`/material-calculation/results/${id}/share`),
	},
	trending: {
		overview: getFullUrl("/material-calculation/trending"),
		analytics: getFullUrl("/material-calculation/analytics/overview"),
		byType: getFullUrl("/material-calculation/analytics/by-type"),
	},
};

// Endpoints de recomendaciones
const recommendations = {
	templates: getFullUrl("/recommendations/templates"),
	materials: getFullUrl("/recommendations/materials"),
	interactions: getFullUrl("/recommendations/interactions"),
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
	priceHistory: (id: string) => getFullUrl(`/materials/${id}/price-history`),
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
	updateStatus: (budgetId: string) => getFullUrl(`/budgets/${budgetId}/status`),
	compare: getFullUrl("/budgets/compare"),
	addCosts: (budgetId: string) => getFullUrl(`/budgets/${budgetId}/costs`),
	exportPDF: (budgetId: string) =>
		getFullUrl(`/budgets/${budgetId}/export-pdf`),
};

// Endpoints de contabilidad
const accounting = {
	systems: getFullUrl("/accounting/systems"),
	syncBudget: (budgetId: string) =>
		getFullUrl(`/accounting/budgets/${budgetId}/sync`),
	syncHistory: (budgetId: string) =>
		getFullUrl(`/accounting/budgets/${budgetId}/sync-history`),
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
	devices: getFullUrl("/notifications/devices"),
};

// Endpoints de solicitudes de materiales
const materialRequests = {
	create: getFullUrl("/material-requests"),
	approve: (requestId: string) =>
		getFullUrl(`/material-requests/${requestId}/approve`),
	reject: (requestId: string) =>
		getFullUrl(`/material-requests/${requestId}/reject`),
	listByProject: (projectId: string) =>
		getFullUrl(`/material-requests/project/${projectId}`),
	confirmDelivery: (requestId: string) =>
		getFullUrl(`/material-requests/${requestId}/delivery`),
};

// Endpoints de órdenes
const orders = {
	createFromRequests: getFullUrl("/orders/from-material-requests"),
	listByUser: getFullUrl("/orders/user"),
	getById: (orderId: string) => getFullUrl(`/orders/${orderId}`),
	updateStatus: (orderId: string) => getFullUrl(`/orders/${orderId}/status`),
};

// Endpoints de fases
const phases = {
	getById: (phaseId: string) => getFullUrl(`/phases/${phaseId}`),
	getTasks: (phaseId: string) => getFullUrl(`/phases/${phaseId}/tasks`),
	updateDates: (phaseId: string) => getFullUrl(`/phases/${phaseId}/dates`),
};

// Endpoints de tareas
const tasks = {
	getById: (taskId: string) => getFullUrl(`/tasks/${taskId}`),
	updateProgress: (taskId: string) => getFullUrl(`/tasks/${taskId}/progress`),
	assign: (taskId: string) => getFullUrl(`/tasks/${taskId}/assign`),
};

// Endpoints de reportes
const reports = {
	projectProgress: (projectId: string) =>
		getFullUrl(`/reports/progress/${projectId}`),
	exportProgressPDF: (projectId: string) =>
		getFullUrl(`/reports/progress/${projectId}/export-pdf`),
};

// Endpoints de dashboards
const dashboards = {
	project: (projectId: string) =>
		getFullUrl(`/dashboards/project/${projectId}`),
	enhanced: (projectId: string) =>
		getFullUrl(`/dashboards/enhanced/${projectId}`),
	widget: (projectId: string, widgetType: string) =>
		getFullUrl(`/dashboards/enhanced/${projectId}/${widgetType}`),
};

// Endpoints de métricas
const metrics = {
	project: (projectId: string) => getFullUrl(`/metrics/project/${projectId}`),
	predictDelays: (projectId: string) =>
		getFullUrl(`/metrics/predictions/${projectId}/delays`),
	predictionHistory: (projectId: string) =>
		getFullUrl(`/metrics/predictions/${projectId}/history`),
};

// Endpoints de integración con proveedores
const suppliers = {
	list: getFullUrl("/suppliers"),
	getProducts: (supplierId: string) =>
		getFullUrl(`/suppliers/${supplierId}/products`),
	searchProducts: (supplierId: string) =>
		getFullUrl(`/suppliers/${supplierId}/search`),
	importProducts: (supplierId: string) =>
		getFullUrl(`/suppliers/${supplierId}/import`),
};

// Endpoints de propiedades de materiales
const materialProperties = {
	getCategoryProperties: (categoryId: string) =>
		getFullUrl(`/material-properties/categories/${categoryId}/properties`),
	createProperty: getFullUrl("/material-properties/properties"),
	updateProperty: (definitionId: string) =>
		getFullUrl(`/material-properties/properties/${definitionId}`),
	deleteProperty: (definitionId: string) =>
		getFullUrl(`/material-properties/properties/${definitionId}`),
	getMaterialProperties: (materialId: string) =>
		getFullUrl(`/material-properties/materials/${materialId}/properties`),
	setMaterialProperties: (materialId: string) =>
		getFullUrl(`/material-properties/materials/${materialId}/properties`),
	deleteMaterialProperties: (materialId: string) =>
		getFullUrl(`/material-properties/materials/${materialId}/properties`),
};

// Exportar todos los endpoints agrupados
const endpoints = {
	auth,
	user,
	calculations,
	recommendations,
	materials,
	materialProperties,
	materialRequests,
	projects,
	budgets,
	accounting,
	invoices,
	notifications,
	orders,
	phases,
	tasks,
	reports,
	dashboards,
	metrics,
	suppliers,
	materialCalculations,
};

export default endpoints;
