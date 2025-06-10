// src/ui/pages/calculations/materials/components/SharedComponents.tsx
// CORRECCIÓN: Solo exportar componentes para cumplir con fast-refresh

import React from "react";
import {
	CheckCircleIcon,
	ExclamationTriangleIcon,
	InformationCircleIcon,
	XCircleIcon,
} from "@heroicons/react/24/outline";

// Tipos para props de componentes
interface LoadingSpinnerProps {
	size?: "sm" | "md" | "lg";
	className?: string;
}

interface EmptyStateProps {
	icon?: React.ComponentType<{className?: string}>;
	title: string;
	description?: string;
	actionButton?: React.ReactNode;
	className?: string;
}

interface StatCardProps {
	icon: React.ComponentType<{className?: string}>;
	title: string;
	value: string | number;
	subtitle?: string;
	trend?: {
		value: number;
		isPositive: boolean;
	};
	color?: "blue" | "green" | "yellow" | "red" | "purple" | "gray";
	className?: string;
}

interface AlertProps {
	type: "success" | "error" | "warning" | "info";
	title?: string;
	message: string;
	onClose?: () => void;
	className?: string;
}

interface BadgeProps {
	children: React.ReactNode;
	variant?: "default" | "primary" | "success" | "warning" | "error" | "info";
	size?: "sm" | "md" | "lg";
	className?: string;
}

interface ProgressBarProps {
	progress: number;
	max?: number;
	label?: string;
	showPercentage?: boolean;
	color?: "blue" | "green" | "yellow" | "red" | "purple";
	size?: "sm" | "md" | "lg";
	className?: string;
}

interface TooltipProps {
	content: string;
	children: React.ReactNode;
	position?: "top" | "bottom" | "left" | "right";
	className?: string;
}

// === COMPONENTES ===

export const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({
	size = "md",
	className = "",
}) => {
	const sizeClasses = {
		sm: "h-4 w-4",
		md: "h-8 w-8",
		lg: "h-12 w-12",
	};

	return (
		<div
			className={`animate-spin rounded-full border-b-2 border-primary-600 ${sizeClasses[size]} ${className}`}
		/>
	);
};

export const EmptyState: React.FC<EmptyStateProps> = ({
	icon: Icon = InformationCircleIcon,
	title,
	description,
	actionButton,
	className = "",
}) => {
	return (
		<div className={`text-center py-12 ${className}`}>
			<Icon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
			<h3 className="text-lg font-medium text-gray-900 mb-2">{title}</h3>
			{description && (
				<p className="text-gray-500 mb-6 max-w-md mx-auto">{description}</p>
			)}
			{actionButton}
		</div>
	);
};

export const StatCard: React.FC<StatCardProps> = ({
	icon: Icon,
	title,
	value,
	subtitle,
	trend,
	color = "blue",
	className = "",
}) => {
	const colorClasses = {
		blue: "text-blue-600 bg-blue-50",
		green: "text-green-600 bg-green-50",
		yellow: "text-yellow-600 bg-yellow-50",
		red: "text-red-600 bg-red-50",
		purple: "text-purple-600 bg-purple-50",
		gray: "text-gray-600 bg-gray-50",
	};

	return (
		<div
			className={`bg-white rounded-lg border border-gray-200 p-6 ${className}`}
		>
			<div className="flex items-center justify-between">
				<div className="flex-1">
					<div className="flex items-center">
						<div className={`p-2 rounded-lg ${colorClasses[color]}`}>
							<Icon className="h-5 w-5" />
						</div>
						<div className="ml-3">
							<p className="text-sm font-medium text-gray-600">{title}</p>
							<p className="text-2xl font-bold text-gray-900">{value}</p>
							{subtitle && <p className="text-sm text-gray-500">{subtitle}</p>}
						</div>
					</div>
				</div>
				{trend && (
					<div
						className={`text-sm font-medium ${
							trend.isPositive ? "text-green-600" : "text-red-600"
						}`}
					>
						{trend.isPositive ? "↗" : "↘"} {Math.abs(trend.value)}%
					</div>
				)}
			</div>
		</div>
	);
};

export const Alert: React.FC<AlertProps> = ({
	type,
	title,
	message,
	onClose,
	className = "",
}) => {
	const typeConfig = {
		success: {
			icon: CheckCircleIcon,
			bgColor: "bg-green-50",
			borderColor: "border-green-200",
			iconColor: "text-green-400",
			titleColor: "text-green-800",
			messageColor: "text-green-700",
		},
		error: {
			icon: XCircleIcon,
			bgColor: "bg-red-50",
			borderColor: "border-red-200",
			iconColor: "text-red-400",
			titleColor: "text-red-800",
			messageColor: "text-red-700",
		},
		warning: {
			icon: ExclamationTriangleIcon,
			bgColor: "bg-yellow-50",
			borderColor: "border-yellow-200",
			iconColor: "text-yellow-400",
			titleColor: "text-yellow-800",
			messageColor: "text-yellow-700",
		},
		info: {
			icon: InformationCircleIcon,
			bgColor: "bg-blue-50",
			borderColor: "border-blue-200",
			iconColor: "text-blue-400",
			titleColor: "text-blue-800",
			messageColor: "text-blue-700",
		},
	};

	const config = typeConfig[type];
	const Icon = config.icon;

	return (
		<div
			className={`rounded-md border p-4 ${config.bgColor} ${config.borderColor} ${className}`}
		>
			<div className="flex">
				<div className="flex-shrink-0">
					<Icon className={`h-5 w-5 ${config.iconColor}`} />
				</div>
				<div className="ml-3 flex-1">
					{title && (
						<h3 className={`text-sm font-medium ${config.titleColor}`}>
							{title}
						</h3>
					)}
					<div
						className={`text-sm ${config.messageColor} ${title ? "mt-2" : ""}`}
					>
						{message}
					</div>
				</div>
				{onClose && (
					<div className="ml-auto pl-3">
						<div className="-mx-1.5 -my-1.5">
							<button
								type="button"
								onClick={onClose}
								className={`inline-flex rounded-md p-1.5 focus:outline-none focus:ring-2 focus:ring-offset-2 ${config.iconColor} hover:bg-opacity-20`}
							>
								<span className="sr-only">Cerrar</span>
								<XCircleIcon className="h-5 w-5" />
							</button>
						</div>
					</div>
				)}
			</div>
		</div>
	);
};

export const Badge: React.FC<BadgeProps> = ({
	children,
	variant = "default",
	size = "md",
	className = "",
}) => {
	const variantClasses = {
		default: "bg-gray-100 text-gray-800",
		primary: "bg-primary-100 text-primary-800",
		success: "bg-green-100 text-green-800",
		warning: "bg-yellow-100 text-yellow-800",
		error: "bg-red-100 text-red-800",
		info: "bg-blue-100 text-blue-800",
	};

	const sizeClasses = {
		sm: "px-2 py-1 text-xs",
		md: "px-2.5 py-0.5 text-sm",
		lg: "px-3 py-1 text-base",
	};

	return (
		<span
			className={`inline-flex items-center rounded-full font-medium ${variantClasses[variant]} ${sizeClasses[size]} ${className}`}
		>
			{children}
		</span>
	);
};

export const ProgressBar: React.FC<ProgressBarProps> = ({
	progress,
	max = 100,
	label,
	showPercentage = true,
	color = "blue",
	size = "md",
	className = "",
}) => {
	const colorClasses = {
		blue: "bg-blue-600",
		green: "bg-green-600",
		yellow: "bg-yellow-600",
		red: "bg-red-600",
		purple: "bg-purple-600",
	};

	const sizeClasses = {
		sm: "h-2",
		md: "h-3",
		lg: "h-4",
	};

	const percentage = Math.min((progress / max) * 100, 100);

	return (
		<div className={className}>
			{(label || showPercentage) && (
				<div className="flex justify-between items-center mb-2">
					{label && (
						<span className="text-sm font-medium text-gray-700">{label}</span>
					)}
					{showPercentage && (
						<span className="text-sm text-gray-500">
							{Math.round(percentage)}%
						</span>
					)}
				</div>
			)}
			<div
				className={`w-full bg-gray-200 rounded-full overflow-hidden ${sizeClasses[size]}`}
			>
				<div
					className={`${colorClasses[color]} ${sizeClasses[size]} rounded-full transition-all duration-300 ease-out`}
					style={{width: `${percentage}%`}}
				/>
			</div>
		</div>
	);
};

export const Tooltip: React.FC<TooltipProps> = ({
	content,
	children,
	position = "top",
	className = "",
}) => {
	const [isVisible, setIsVisible] = React.useState(false);

	const positionClasses = {
		top: "bottom-full left-1/2 transform -translate-x-1/2 mb-2",
		bottom: "top-full left-1/2 transform -translate-x-1/2 mt-2",
		left: "right-full top-1/2 transform -translate-y-1/2 mr-2",
		right: "left-full top-1/2 transform -translate-y-1/2 ml-2",
	};

	const arrowClasses = {
		top: "top-full left-1/2 transform -translate-x-1/2 border-t-gray-900",
		bottom: "bottom-full left-1/2 transform -translate-x-1/2 border-b-gray-900",
		left: "left-full top-1/2 transform -translate-y-1/2 border-l-gray-900",
		right: "right-full top-1/2 transform -translate-y-1/2 border-r-gray-900",
	};

	return (
		<div className="relative inline-block">
			<div
				onMouseEnter={() => setIsVisible(true)}
				onMouseLeave={() => setIsVisible(false)}
				className={className}
			>
				{children}
			</div>
			{isVisible && (
				<div
					className={`absolute z-50 px-2 py-1 text-sm text-white bg-gray-900 rounded shadow-lg whitespace-nowrap ${positionClasses[position]}`}
				>
					{content}
					<div
						className={`absolute w-0 h-0 border-4 border-transparent ${arrowClasses[position]}`}
					/>
				</div>
			)}
		</div>
	);
};

// Componente de grid responsivo para cards
export const CardGrid: React.FC<{
	children: React.ReactNode;
	className?: string;
}> = ({children, className = ""}) => {
	return (
		<div
			className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 ${className}`}
		>
			{children}
		</div>
	);
};

// Componente de skeleton loading
export const SkeletonCard: React.FC<{className?: string}> = ({
	className = "",
}) => {
	return (
		<div
			className={`bg-white rounded-lg border border-gray-200 p-6 ${className}`}
		>
			<div className="animate-pulse">
				<div className="flex items-center space-x-4">
					<div className="rounded-full bg-gray-300 h-12 w-12"></div>
					<div className="flex-1 space-y-2">
						<div className="h-4 bg-gray-300 rounded w-3/4"></div>
						<div className="h-3 bg-gray-300 rounded w-1/2"></div>
					</div>
				</div>
				<div className="mt-4 space-y-2">
					<div className="h-3 bg-gray-300 rounded"></div>
					<div className="h-3 bg-gray-300 rounded w-5/6"></div>
				</div>
			</div>
		</div>
	);
};

// Componente de separador
export const Divider: React.FC<{
	orientation?: "horizontal" | "vertical";
	className?: string;
}> = ({orientation = "horizontal", className = ""}) => {
	const orientationClasses = {
		horizontal: "w-full h-px bg-gray-200",
		vertical: "h-full w-px bg-gray-200",
	};

	return <div className={`${orientationClasses[orientation]} ${className}`} />;
};

// Componente de contenedor con scroll
export const ScrollContainer: React.FC<{
	children: React.ReactNode;
	maxHeight?: string;
	className?: string;
}> = ({children, maxHeight = "max-h-96", className = ""}) => {
	return (
		<div className={`overflow-y-auto ${maxHeight} ${className}`}>
			{children}
		</div>
	);
};
