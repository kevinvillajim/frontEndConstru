// src/ui/pages/calculations/materials/components/SharedComponents.tsx

import React from "react";

// Loading Spinner Component
export const LoadingSpinner: React.FC<{
	size?: "sm" | "md" | "lg";
	className?: string;
}> = ({size = "md", className = ""}) => {
	const sizeClasses = {
		sm: "h-4 w-4",
		md: "h-8 w-8",
		lg: "h-12 w-12",
	};

	return (
		<div
			className={`animate-spin rounded-full border-b-2 border-blue-600 ${sizeClasses[size]} ${className}`}
		/>
	);
};

// Empty State Component
export const EmptyState: React.FC<{
	icon: string;
	title: string;
	description: string;
	action?: {
		label: string;
		onClick: () => void;
		variant?: "primary" | "secondary";
	};
	className?: string;
}> = ({icon, title, description, action, className = ""}) => (
	<div className={`text-center py-12 ${className}`}>
		<div className="text-6xl mb-4">{icon}</div>
		<h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
			{title}
		</h3>
		<p className="text-gray-600 dark:text-gray-300 mb-6">{description}</p>
		{action && (
			<button
				onClick={action.onClick}
				className={`px-6 py-3 rounded-lg transition-colors font-medium ${
					action.variant === "secondary"
						? "border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700"
						: "bg-blue-600 text-white hover:bg-blue-700"
				}`}
			>
				{action.label}
			</button>
		)}
	</div>
);

// Error Boundary Component
interface ErrorBoundaryState {
	hasError: boolean;
	error?: Error;
}

export class ErrorBoundary extends React.Component<
	{children: React.ReactNode; fallback?: React.ReactNode},
	ErrorBoundaryState
> {
	constructor(props: {children: React.ReactNode; fallback?: React.ReactNode}) {
		super(props);
		this.state = {hasError: false};
	}

	static getDerivedStateFromError(error: Error): ErrorBoundaryState {
		return {hasError: true, error};
	}

	componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
		console.error("Material Calculations Error:", error, errorInfo);
	}

	render() {
		if (this.state.hasError) {
			if (this.props.fallback) {
				return this.props.fallback;
			}

			return (
				<EmptyState
					icon="⚠️"
					title="Error en la Aplicación"
					description="Ha ocurrido un error inesperado. Por favor, recarga la página."
					action={{
						label: "Recargar Página",
						onClick: () => window.location.reload(),
					}}
				/>
			);
		}

		return this.props.children;
	}
}

// Feature Flag Component
export const FeatureFlag: React.FC<{
	feature: string;
	children: React.ReactNode;
	fallback?: React.ReactNode;
}> = ({feature, children, fallback = null}) => {
	// En una implementación real, esto consultaría un servicio de feature flags
	const enabledFeatures = [
		"material-comparison",
		"advanced-analytics",
		"template-sharing",
		"export-functionality",
		"trending-analytics",
		"collaborative-editing",
	];

	return enabledFeatures.includes(feature) ? <>{children}</> : <>{fallback}</>;
};

// Confirmation Modal Component
export const ConfirmationModal: React.FC<{
	isOpen: boolean;
	onClose: () => void;
	onConfirm: () => void;
	title: string;
	message: string;
	confirmText?: string;
	cancelText?: string;
	variant?: "danger" | "warning" | "info";
}> = ({
	isOpen,
	onClose,
	onConfirm,
	title,
	message,
	confirmText = "Confirmar",
	cancelText = "Cancelar",
	variant = "info",
}) => {
	if (!isOpen) return null;

	const variantStyles = {
		danger: "bg-red-600 hover:bg-red-700",
		warning: "bg-yellow-600 hover:bg-yellow-700",
		info: "bg-blue-600 hover:bg-blue-700",
	};

	return (
		<div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
			<div className="bg-white dark:bg-gray-800 rounded-lg p-6 max-w-md w-full mx-4">
				<h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
					{title}
				</h3>
				<p className="text-gray-600 dark:text-gray-300 mb-6">{message}</p>
				<div className="flex space-x-3 justify-end">
					<button
						onClick={onClose}
						className="px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
					>
						{cancelText}
					</button>
					<button
						onClick={onConfirm}
						className={`px-4 py-2 text-white rounded-lg transition-colors ${variantStyles[variant]}`}
					>
						{confirmText}
					</button>
				</div>
			</div>
		</div>
	);
};

// Toast Notification Component
export const Toast: React.FC<{
	message: string;
	type: "success" | "error" | "warning" | "info";
	isVisible: boolean;
	onClose: () => void;
	duration?: number;
}> = ({message, type, isVisible, onClose, duration = 5000}) => {
	React.useEffect(() => {
		if (isVisible && duration > 0) {
			const timer = setTimeout(onClose, duration);
			return () => clearTimeout(timer);
		}
	}, [isVisible, duration, onClose]);

	if (!isVisible) return null;

	const typeStyles = {
		success:
			"bg-green-100 dark:bg-green-900 border-green-500 text-green-800 dark:text-green-200",
		error:
			"bg-red-100 dark:bg-red-900 border-red-500 text-red-800 dark:text-red-200",
		warning:
			"bg-yellow-100 dark:bg-yellow-900 border-yellow-500 text-yellow-800 dark:text-yellow-200",
		info: "bg-blue-100 dark:bg-blue-900 border-blue-500 text-blue-800 dark:text-blue-200",
	};

	const icons = {
		success: "✅",
		error: "❌",
		warning: "⚠️",
		info: "ℹ️",
	};

	return (
		<div
			className={`fixed top-4 right-4 z-50 p-4 rounded-lg border-l-4 ${typeStyles[type]} shadow-lg max-w-sm`}
		>
			<div className="flex items-center space-x-3">
				<span className="text-xl">{icons[type]}</span>
				<p className="flex-1">{message}</p>
				<button
					onClick={onClose}
					className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
				>
					<svg
						className="w-4 h-4"
						fill="none"
						stroke="currentColor"
						viewBox="0 0 24 24"
					>
						<path
							strokeLinecap="round"
							strokeLinejoin="round"
							strokeWidth={2}
							d="M6 18L18 6M6 6l12 12"
						/>
					</svg>
				</button>
			</div>
		</div>
	);
};

// Progress Bar Component
export const ProgressBar: React.FC<{
	progress: number;
	className?: string;
	showPercentage?: boolean;
	color?: "blue" | "green" | "yellow" | "red";
}> = ({progress, className = "", showPercentage = true, color = "blue"}) => {
	const colorClasses = {
		blue: "bg-blue-600",
		green: "bg-green-600",
		yellow: "bg-yellow-600",
		red: "bg-red-600",
	};

	return (
		<div className={`w-full ${className}`}>
			<div className="flex justify-between items-center mb-2">
				{showPercentage && (
					<span className="text-sm font-medium text-gray-700 dark:text-gray-300">
						{Math.round(progress)}%
					</span>
				)}
			</div>
			<div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
				<div
					className={`h-2 rounded-full transition-all duration-300 ${colorClasses[color]}`}
					style={{width: `${Math.max(0, Math.min(100, progress))}%`}}
				/>
			</div>
		</div>
	);
};

// Card Component
export const Card: React.FC<{
	children: React.ReactNode;
	className?: string;
	padding?: "sm" | "md" | "lg";
	hover?: boolean;
}> = ({children, className = "", padding = "md", hover = false}) => {
	const paddingClasses = {
		sm: "p-4",
		md: "p-6",
		lg: "p-8",
	};

	return (
		<div
			className={`
      bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700
      ${paddingClasses[padding]}
      ${hover ? "hover:shadow-lg hover:scale-[1.02] transition-all duration-200 cursor-pointer" : ""}
      ${className}
    `}
		>
			{children}
		</div>
	);
};

// Badge Component
export const Badge: React.FC<{
	children: React.ReactNode;
	variant?: "default" | "success" | "warning" | "error" | "info";
	size?: "sm" | "md" | "lg";
}> = ({children, variant = "default", size = "md"}) => {
	const variantClasses = {
		default: "bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200",
		success:
			"bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200",
		warning:
			"bg-yellow-100 dark:bg-yellow-900 text-yellow-800 dark:text-yellow-200",
		error: "bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-200",
		info: "bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200",
	};

	const sizeClasses = {
		sm: "px-2 py-1 text-xs",
		md: "px-3 py-1 text-sm",
		lg: "px-4 py-2 text-base",
	};

	return (
		<span
			className={`
      inline-flex items-center rounded-full font-medium
      ${variantClasses[variant]}
      ${sizeClasses[size]}
    `}
		>
			{children}
		</span>
	);
};

// Skeleton Loader Component
export const SkeletonLoader: React.FC<{
	lines?: number;
	className?: string;
}> = ({lines = 3, className = ""}) => {
	return (
		<div className={`animate-pulse space-y-3 ${className}`}>
			{Array.from({length: lines}).map((_, index) => (
				<div
					key={index}
					className={`h-4 bg-gray-200 dark:bg-gray-700 rounded ${
						index === lines - 1 ? "w-3/4" : "w-full"
					}`}
				/>
			))}
		</div>
	);
};

// Tabs Component
export const Tabs: React.FC<{
	tabs: Array<{
		id: string;
		label: string;
		icon?: string;
		content: React.ReactNode;
	}>;
	activeTab: string;
	onTabChange: (tabId: string) => void;
	className?: string;
}> = ({tabs, activeTab, onTabChange, className = ""}) => {
	return (
		<div className={className}>
			<div className="flex space-x-6 border-b border-gray-200 dark:border-gray-700">
				{tabs.map((tab) => (
					<button
						key={tab.id}
						onClick={() => onTabChange(tab.id)}
						className={`
              flex items-center space-x-2 pb-4 border-b-2 font-medium transition-colors
              ${
								activeTab === tab.id
									? "border-blue-500 text-blue-600 dark:text-blue-400"
									: "border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300"
							}
            `}
					>
						{tab.icon && <span>{tab.icon}</span>}
						<span>{tab.label}</span>
					</button>
				))}
			</div>

			<div className="mt-6">
				{tabs.find((tab) => tab.id === activeTab)?.content}
			</div>
		</div>
	);
};

// Hook personalizado para manejo de errores
export const useErrorHandler = () => {
	const [error, setError] = React.useState<string | null>(null);

	const handleError = React.useCallback((error: any) => {
		console.error("Error en cálculos de materiales:", error);
		setError(error.message || "Error desconocido");
	}, []);

	const clearError = React.useCallback(() => {
		setError(null);
	}, []);

	return {error, handleError, clearError};
};

// Hook para persistencia local
export const useLocalStorage = <T,>(key: string, initialValue: T) => {
	const [storedValue, setStoredValue] = React.useState<T>(() => {
		try {
			const item = window.localStorage.getItem(key);
			return item ? JSON.parse(item) : initialValue;
		} catch (error) {
			console.error(`Error loading from localStorage key "${key}":`, error);
			return initialValue;
		}
	});

	const setValue = React.useCallback(
		(value: T | ((val: T) => T)) => {
			try {
				const valueToStore =
					value instanceof Function ? value(storedValue) : value;
				setStoredValue(valueToStore);
				window.localStorage.setItem(key, JSON.stringify(valueToStore));
			} catch (error) {
				console.error(`Error saving to localStorage key "${key}":`, error);
			}
		},
		[key, storedValue]
	);

	return [storedValue, setValue] as const;
};

// Hook para notificaciones toast
export const useToast = () => {
	const [toasts, setToasts] = React.useState<
		Array<{
			id: string;
			message: string;
			type: "success" | "error" | "warning" | "info";
		}>
	>([]);

	const showToast = React.useCallback(
		(
			message: string,
			type: "success" | "error" | "warning" | "info" = "info"
		) => {
			const id = Date.now().toString();
			setToasts((prev) => [...prev, {id, message, type}]);

			// Auto remove after 5 seconds
			setTimeout(() => {
				setToasts((prev) => prev.filter((toast) => toast.id !== id));
			}, 5000);
		},
		[]
	);

	const removeToast = React.useCallback((id: string) => {
		setToasts((prev) => prev.filter((toast) => toast.id !== id));
	}, []);

	const ToastContainer = React.useCallback(
		() => (
			<div className="fixed top-4 right-4 z-50 space-y-2">
				{toasts.map((toast) => (
					<Toast
						key={toast.id}
						message={toast.message}
						type={toast.type}
						isVisible={true}
						onClose={() => removeToast(toast.id)}
					/>
				))}
			</div>
		),
		[toasts, removeToast]
	);

	return {
		showToast,
		ToastContainer,
	};
};

// Hook para confirmación
export const useConfirmation = () => {
	const [confirmation, setConfirmation] = React.useState<{
		isOpen: boolean;
		title: string;
		message: string;
		onConfirm: () => void;
		variant?: "danger" | "warning" | "info";
	} | null>(null);

	const confirm = React.useCallback(
		(
			title: string,
			message: string,
			onConfirm: () => void,
			variant: "danger" | "warning" | "info" = "info"
		) => {
			setConfirmation({
				isOpen: true,
				title,
				message,
				onConfirm,
				variant,
			});
		},
		[]
	);

	const handleConfirm = React.useCallback(() => {
		if (confirmation) {
			confirmation.onConfirm();
			setConfirmation(null);
		}
	}, [confirmation]);

	const handleCancel = React.useCallback(() => {
		setConfirmation(null);
	}, []);

	const ConfirmationDialog = React.useCallback(
		() =>
			confirmation ? (
				<ConfirmationModal
					isOpen={confirmation.isOpen}
					title={confirmation.title}
					message={confirmation.message}
					onConfirm={handleConfirm}
					onClose={handleCancel}
					variant={confirmation.variant}
				/>
			) : null,
		[confirmation, handleConfirm, handleCancel]
	);

	return {
		confirm,
		ConfirmationDialog,
	};
};
