// src/ui/components/common/Toast.tsx
import React, {
	useContext,
	createContext,
	useState,
	useCallback,
} from "react";
import type {ReactNode} from "react";
import {
	CheckCircleIcon,
	ExclamationTriangleIcon,
	InformationCircleIcon,
	XCircleIcon,
	XMarkIcon,
} from "@heroicons/react/24/outline";

export type ToastType = "success" | "error" | "warning" | "info";

export interface Toast {
	id: string;
	type: ToastType;
	title: string;
	message?: string;
	duration?: number;
	action?: {
		label: string;
		onClick: () => void;
	};
}

interface ToastContextValue {
	addToast: (toast: Omit<Toast, "id">) => void;
	removeToast: (id: string) => void;
	showSuccess: (title: string, message?: string, duration?: number) => void;
	showError: (title: string, message?: string, duration?: number) => void;
	showWarning: (title: string, message?: string, duration?: number) => void;
	showInfo: (title: string, message?: string, duration?: number) => void;
}

const ToastContext = createContext<ToastContextValue | null>(null);

export const useToast = () => {
	const context = useContext(ToastContext);
	if (!context) {
		throw new Error("useToast must be used within a ToastProvider");
	}
	return context;
};

interface ToastProviderProps {
	children: ReactNode;
}

export const ToastProvider: React.FC<ToastProviderProps> = ({children}) => {
	const [toasts, setToasts] = useState<Toast[]>([]);

	const addToast = useCallback((toast: Omit<Toast, "id">) => {
		const id = Math.random().toString(36).substring(2, 9);
		const newToast: Toast = {
			...toast,
			id,
			duration: toast.duration ?? 5000,
		};

		setToasts((prev) => [...prev, newToast]);

		// Auto-remove toast after duration
		if (newToast.duration && newToast.duration > 0) {
			setTimeout(() => {
				setToasts((prev) => prev.filter((t) => t.id !== id));
			}, newToast.duration);
		}
	}, []);

	const removeToast = useCallback((id: string) => {
		setToasts((prev) => prev.filter((toast) => toast.id !== id));
	}, []);

	const showSuccess = useCallback(
		(title: string, message?: string, duration?: number) => {
			addToast({type: "success", title, message, duration});
		},
		[addToast]
	);

	const showError = useCallback(
		(title: string, message?: string, duration?: number) => {
			addToast({type: "error", title, message, duration});
		},
		[addToast]
	);

	const showWarning = useCallback(
		(title: string, message?: string, duration?: number) => {
			addToast({type: "warning", title, message, duration});
		},
		[addToast]
	);

	const showInfo = useCallback(
		(title: string, message?: string, duration?: number) => {
			addToast({type: "info", title, message, duration});
		},
		[addToast]
	);

	const getToastIcon = (type: ToastType) => {
		switch (type) {
			case "success":
				return <CheckCircleIcon className="h-5 w-5 text-green-600" />;
			case "error":
				return <XCircleIcon className="h-5 w-5 text-red-600" />;
			case "warning":
				return <ExclamationTriangleIcon className="h-5 w-5 text-yellow-600" />;
			case "info":
				return <InformationCircleIcon className="h-5 w-5 text-blue-600" />;
		}
	};

	const getToastStyles = (type: ToastType) => {
		switch (type) {
			case "success":
				return "bg-green-50 border-green-200 text-green-800";
			case "error":
				return "bg-red-50 border-red-200 text-red-800";
			case "warning":
				return "bg-yellow-50 border-yellow-200 text-yellow-800";
			case "info":
				return "bg-blue-50 border-blue-200 text-blue-800";
		}
	};

	return (
		<ToastContext.Provider
			value={{
				addToast,
				removeToast,
				showSuccess,
				showError,
				showWarning,
				showInfo,
			}}
		>
			{children}

			{/* Toast Container */}
			<div className="fixed top-4 right-4 z-50 space-y-2 max-w-md">
				{toasts.map((toast) => (
					<div
						key={toast.id}
						className={`border rounded-xl p-4 shadow-lg backdrop-blur-sm transition-all duration-300 transform hover:scale-[1.02] ${getToastStyles(
							toast.type
						)}`}
						style={{
							animation: "slideInRight 0.3s ease-out",
						}}
					>
						<div className="flex items-start gap-3">
							<div className="flex-shrink-0 mt-0.5">
								{getToastIcon(toast.type)}
							</div>

							<div className="flex-1 min-w-0">
								<div className="flex items-start justify-between">
									<div>
										<h4 className="font-medium text-sm">{toast.title}</h4>
										{toast.message && (
											<p className="text-sm mt-1 opacity-90">{toast.message}</p>
										)}
									</div>

									<button
										onClick={() => removeToast(toast.id)}
										className="flex-shrink-0 ml-2 p-1 hover:bg-black/10 rounded-full transition-colors"
									>
										<XMarkIcon className="h-4 w-4" />
									</button>
								</div>

								{toast.action && (
									<div className="mt-3">
										<button
											onClick={() => {
												toast.action!.onClick();
												removeToast(toast.id);
											}}
											className="text-sm font-medium underline hover:no-underline transition-colors"
										>
											{toast.action.label}
										</button>
									</div>
								)}
							</div>
						</div>
					</div>
				))}
			</div>

			<style>{`
        @keyframes slideInRight {
          from {
            opacity: 0;
            transform: translateX(100%);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }
      `}</style>
		</ToastContext.Provider>
	);
};

export default ToastProvider;
