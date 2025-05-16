// src/ui/components/common/ToastService.ts

/**
 * Servicio para mostrar notificaciones toast
 * Este servicio es un wrapper simple que se puede reemplazar con cualquier
 * biblioteca de toasts (react-toastify, react-hot-toast, etc.)
 */

type ToastType = "success" | "error" | "info" | "warning";

// Por ahora, usando console.log como fallback, pero esto se reemplazaría
// con la implementación real de toasts
const showToast = (message: string, type: ToastType = "info") => {
	// Placeholder - aquí iría la implementación real
	console.log(`[${type.toUpperCase()}]: ${message}`);

	// Ejemplo de implementación con alert (solo para desarrollo)
	const icon = {
		success: "✅",
		error: "❌",
		info: "ℹ️",
		warning: "⚠️",
	}[type];

	alert(`${icon} ${message}`);
};

const ToastService = {
	success: (message: string) => showToast(message, "success"),
	error: (message: string) => showToast(message, "error"),
	info: (message: string) => showToast(message, "info"),
	warning: (message: string) => showToast(message, "warning"),
};

export default ToastService;
