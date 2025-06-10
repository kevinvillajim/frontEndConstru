// src/ui/pages/calculations/materials/components/SharedComponents.tsx
import React from "react";
import {
	CheckCircleIcon,
	ExclamationTriangleIcon,
	InformationCircleIcon,
	XCircleIcon,
	SparklesIcon,
	StarIcon,
	ClockIcon,
	ChartBarIcon,
	CheckBadgeIcon,
} from "@heroicons/react/24/outline";
import type {MaterialCalculationType} from "../../shared/types/material.types";

// Props interfaces
interface LoadingSpinnerProps {
	size?: "sm" | "md" | "lg";
	color?: string;
}

interface AlertProps {
	type: "success" | "error" | "warning" | "info";
	title?: string;
	message: string;
	onClose?: () => void;
}

interface BadgeProps {
	variant: "primary" | "success" | "warning" | "error" | "gray";
	children: React.ReactNode;
	size?: "sm" | "md";
}

interface MaterialTypeBadgeProps {
	type: MaterialCalculationType;
	size?: "sm" | "md";
}

interface StatsCardProps {
	title: string;
	value: string | number;
	subtitle?: string;
	icon: React.ComponentType<{className?: string}>;
	trend?: {
		value: number;
		isPositive: boolean;
	};
	color?: "primary" | "emerald" | "amber" | "purple" | "red";
}

interface TemplateCardStatsProps {
	usageCount: number;
	averageRating: number;
	estimatedTime?: string;
	isFeatured?: boolean;
	isVerified?: boolean;
}

interface EmptyStateProps {
	icon: React.ComponentType<{className?: string}>;
	title: string;
	description: string;
	action?: {
		label: string;
		onClick: () => void;
	};
}

// Loading Spinner Component
export const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({
	size = "md",
	color = "border-primary-600",
}) => {
	const sizeClasses = {
		sm: "h-6 w-6",
		md: "h-8 w-8",
		lg: "h-12 w-12",
	};

	return (
		<div
			className={`animate-spin rounded-full border-b-2 ${color} ${sizeClasses[size]}`}
		/>
	);
};

// Alert Component
export const Alert: React.FC<AlertProps> = ({
	type,
	title,
	message,
	onClose,
}) => {
	const config = {
		success: {
			bg: "bg-green-50",
			border: "border-green-200",
			icon: CheckCircleIcon,
			iconColor: "text-green-600",
			titleColor: "text-green-800",
			textColor: "text-green-700",
		},
		error: {
			bg: "bg-red-50",
			border: "border-red-200",
			icon: XCircleIcon,
			iconColor: "text-red-600",
			titleColor: "text-red-800",
			textColor: "text-red-700",
		},
		warning: {
			bg: "bg-amber-50",
			border: "border-amber-200",
			icon: ExclamationTriangleIcon,
			iconColor: "text-amber-600",
			titleColor: "text-amber-800",
			textColor: "text-amber-700",
		},
		info: {
			bg: "bg-blue-50",
			border: "border-blue-200",
			icon: InformationCircleIcon,
			iconColor: "text-blue-600",
			titleColor: "text-blue-800",
			textColor: "text-blue-700",
		},
	};

	const {
		bg,
		border,
		icon: Icon,
		iconColor,
		titleColor,
		textColor,
	} = config[type];

	return (
		<div className={`${bg} ${border} border rounded-xl p-6`}>
			<div className="flex items-start gap-3">
				<Icon className={`h-6 w-6 ${iconColor} flex-shrink-0 mt-0.5`} />
				<div className="flex-1">
					{title && (
						<h3 className={`font-semibold ${titleColor} mb-1`}>{title}</h3>
					)}
					<p className={`${textColor}`}>{message}</p>
				</div>
				{onClose && (
					<button
						onClick={onClose}
						className={`p-1 ${textColor} hover:opacity-75 transition-opacity`}
					>
						<XCircleIcon className="h-5 w-5" />
					</button>
				)}
			</div>
		</div>
	);
};

// Badge Component
export const Badge: React.FC<BadgeProps> = ({
	variant,
	children,
	size = "md",
}) => {
	const variants = {
		primary: "bg-primary-50 text-primary-700 border-primary-200",
		success: "bg-emerald-50 text-emerald-700 border-emerald-200",
		warning: "bg-amber-50 text-amber-700 border-amber-200",
		error: "bg-red-50 text-red-700 border-red-200",
		gray: "bg-gray-50 text-gray-700 border-gray-200",
	};

	const sizes = {
		sm: "px-2 py-1 text-xs",
		md: "px-3 py-1.5 text-sm",
	};

	return (
		<span
			className={`
      inline-flex items-center rounded-full font-medium border
      ${variants[variant]} ${sizes[size]}
    `}
		>
			{children}
		</span>
	);
};

// Material Type Badge
export const MaterialTypeBadge: React.FC<MaterialTypeBadgeProps> = ({
	type,
	size = "md",
}) => {
	const typeConfig = {
		STEEL_STRUCTURES: {name: "Acero", emoji: "🔩", color: "slate"},
		CERAMIC_FINISHES: {name: "Cerámicos", emoji: "🔲", color: "emerald"},
		CONCRETE_FOUNDATIONS: {name: "Hormigón", emoji: "🏗️", color: "stone"},
		ELECTRICAL_INSTALLATIONS: {name: "Eléctrico", emoji: "⚡", color: "yellow"},
		MELAMINE_FURNITURE: {name: "Muebles", emoji: "🗄️", color: "orange"},
	};

	const config = typeConfig[type];
	if (!config) return null;

	return (
		<span
			className={`
      inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-medium
      bg-${config.color}-50 text-${config.color}-700 border border-${config.color}-200
    `}
		>
			<span className="text-base">{config.emoji}</span>
			{config.name}
		</span>
	);
};

// Stats Card Component
export const StatsCard: React.FC<StatsCardProps> = ({
	title,
	value,
	subtitle,
	icon: Icon,
	trend,
	color = "primary",
}) => {
	const colorConfig = {
		primary:
			"from-primary-50 to-primary-100 border-primary-200 text-primary-600",
		emerald:
			"from-emerald-50 to-emerald-100 border-emerald-200 text-emerald-600",
		amber: "from-amber-50 to-amber-100 border-amber-200 text-amber-600",
		purple: "from-purple-50 to-purple-100 border-purple-200 text-purple-600",
		red: "from-red-50 to-red-100 border-red-200 text-red-600",
	};

	return (
		<div
			className={`bg-gradient-to-r ${colorConfig[color]} border rounded-xl p-6`}
		>
			<div className="flex items-center">
				<div className="flex-shrink-0">
					<Icon className={`h-8 w-8 ${colorConfig[color].split(" ")[2]}`} />
				</div>
				<div className="ml-4 flex-1">
					<p
						className={`text-sm font-medium ${colorConfig[color].split(" ")[2].replace("text-", "text-").replace("-600", "-700")}`}
					>
						{title}
					</p>
					<p
						className={`text-2xl font-bold ${colorConfig[color].split(" ")[2].replace("text-", "text-").replace("-600", "-900")}`}
					>
						{typeof value === "number" ? value.toLocaleString() : value}
					</p>
					{subtitle && <p className="text-xs text-gray-600 mt-1">{subtitle}</p>}
					{trend && (
						<div className="flex items-center mt-1">
							{trend.isPositive ? (
								<ChartBarIcon className="h-4 w-4 text-green-500 mr-1" />
							) : (
								<ChartBarIcon className="h-4 w-4 text-red-500 mr-1" />
							)}
							<span
								className={`text-xs ${trend.isPositive ? "text-green-600" : "text-red-600"}`}
							>
								{trend.isPositive ? "+" : ""}
								{trend.value}%
							</span>
						</div>
					)}
				</div>
			</div>
		</div>
	);
};

// Template Card Stats Component
export const TemplateCardStats: React.FC<TemplateCardStatsProps> = ({
	usageCount,
	averageRating,
	estimatedTime,
	isFeatured,
	isVerified,
}) => {
	return (
		<div className="space-y-3">
			{/* Badges */}
			<div className="flex items-center gap-2">
				{isVerified && (
					<Badge variant="primary" size="sm">
						<CheckBadgeIcon className="h-3 w-3 mr-1" />
						Verificado
					</Badge>
				)}
				{isFeatured && (
					<Badge variant="warning" size="sm">
						<SparklesIcon className="h-3 w-3 mr-1" />
						Destacado
					</Badge>
				)}
			</div>

			{/* Stats */}
			<div className="grid grid-cols-3 gap-4 text-sm">
				<div className="text-center">
					<div className="flex items-center justify-center gap-1 text-gray-500 mb-1">
						<ChartBarIcon className="h-4 w-4" />
					</div>
					<p className="font-medium text-gray-900">{usageCount}</p>
					<p className="text-xs text-gray-500">Usos</p>
				</div>
				<div className="text-center">
					<div className="flex items-center justify-center gap-1 text-gray-500 mb-1">
						<StarIcon className="h-4 w-4" />
					</div>
					<p className="font-medium text-gray-900">
						{averageRating ? averageRating.toFixed(1) : "0.0"}
					</p>
					<p className="text-xs text-gray-500">Rating</p>
				</div>
				<div className="text-center">
					<div className="flex items-center justify-center gap-1 text-gray-500 mb-1">
						<ClockIcon className="h-4 w-4" />
					</div>
					<p className="font-medium text-gray-900">{estimatedTime || "5min"}</p>
					<p className="text-xs text-gray-500">Tiempo</p>
				</div>
			</div>
		</div>
	);
};

// Empty State Component
export const EmptyState: React.FC<EmptyStateProps> = ({
	icon: Icon,
	title,
	description,
	action,
}) => {
	return (
		<div className="text-center py-12">
			<div className="mx-auto h-24 w-24 rounded-full bg-gray-100 flex items-center justify-center mb-4">
				<Icon className="h-12 w-12 text-gray-400" />
			</div>
			<h3 className="text-lg font-medium text-gray-900 mb-2">{title}</h3>
			<p className="text-gray-600 mb-6 max-w-sm mx-auto">{description}</p>
			{action && (
				<button
					onClick={action.onClick}
					className="inline-flex items-center gap-2 px-6 py-3 bg-primary-600 text-white font-medium rounded-lg hover:bg-primary-700 transition-colors"
				>
					{action.label}
				</button>
			)}
		</div>
	);
};

// Utility function for formatting currency
export const formatCurrency = (
	amount: number,
	currency: string = "USD"
): string => {
	return new Intl.NumberFormat("es-EC", {
		style: "currency",
		currency: currency,
	}).format(amount);
};

// Utility function for formatting dates
export const formatDate = (
	date: string | Date,
	options?: Intl.DateTimeFormatOptions
): string => {
	const defaultOptions: Intl.DateTimeFormatOptions = {
		year: "numeric",
		month: "short",
		day: "numeric",
		hour: "2-digit",
		minute: "2-digit",
	};

	return new Intl.DateTimeFormat("es-EC", {
		...defaultOptions,
		...options,
	}).format(new Date(date));
};

// Utility function for formatting numbers
export const formatNumber = (num: number, decimals: number = 2): string => {
	return num.toLocaleString("es-EC", {
		maximumFractionDigits: decimals,
		minimumFractionDigits: 0,
	});
};

// Utility function for truncating text
export const truncateText = (text: string, maxLength: number): string => {
	if (text.length <= maxLength) return text;
	return text.substring(0, maxLength - 3) + "...";
};

// Utility function for getting relative time
export const getRelativeTime = (date: string | Date): string => {
	const rtf = new Intl.RelativeTimeFormat("es", {numeric: "auto"});
	const now = new Date();
	const target = new Date(date);
	const diffInSeconds = (target.getTime() - now.getTime()) / 1000;

	if (Math.abs(diffInSeconds) < 60) {
		return rtf.format(Math.round(diffInSeconds), "second");
	} else if (Math.abs(diffInSeconds) < 3600) {
		return rtf.format(Math.round(diffInSeconds / 60), "minute");
	} else if (Math.abs(diffInSeconds) < 86400) {
		return rtf.format(Math.round(diffInSeconds / 3600), "hour");
	} else if (Math.abs(diffInSeconds) < 2592000) {
		return rtf.format(Math.round(diffInSeconds / 86400), "day");
	} else if (Math.abs(diffInSeconds) < 31536000) {
		return rtf.format(Math.round(diffInSeconds / 2592000), "month");
	} else {
		return rtf.format(Math.round(diffInSeconds / 31536000), "year");
	}
};

// Material quantity formatter
export const formatMaterialQuantity = (
	quantity: number,
	unit: string
): string => {
	return `${formatNumber(quantity)} ${unit}`;
};

// Success rate formatter
export const formatSuccessRate = (rate: number): string => {
	return `${(rate * 100).toFixed(1)}%`;
};

// Execution time formatter
export const formatExecutionTime = (timeMs: number): string => {
	if (timeMs < 1000) {
		return `${timeMs}ms`;
	} else {
		return `${(timeMs / 1000).toFixed(1)}s`;
	}
};
