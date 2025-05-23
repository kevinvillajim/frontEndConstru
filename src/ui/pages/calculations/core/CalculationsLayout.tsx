// src/ui/pages/calculations/core/CalculationsLayout.tsx
import React from "react";
import {CalculatorIcon, CheckBadgeIcon} from "@heroicons/react/24/outline";

interface CalculationsLayoutProps {
	children: React.ReactNode;
	title?: string;
	subtitle?: string;
	showVerificationBadge?: boolean;
	headerActions?: React.ReactNode;
	breadcrumbs?: Array<{
		label: string;
		href?: string;
		current?: boolean;
	}>;
	loading?: boolean;
}

const CalculationsLayout: React.FC<CalculationsLayoutProps> = ({
	children,
	title = "Centro de Cálculos Técnicos",
	subtitle = "Biblioteca completa de herramientas de cálculo verificadas NEC Ecuador",
	showVerificationBadge = true,
	headerActions,
	breadcrumbs,
	loading = false,
}) => {
	if (loading) {
		return (
			<div className="min-h-screen bg-gray-50 flex items-center justify-center">
				<div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-600"></div>
			</div>
		);
	}

	return (
		<div className="min-h-screen bg-gray-50">
			{/* Header */}
			<div className="bg-white border-b border-gray-200">
				<div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
					<div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
						<div className="flex items-start gap-4">
							<div className="p-3 bg-gradient-to-r from-primary-600 to-secondary-500 rounded-xl">
								<CalculatorIcon className="h-8 w-8 text-white" />
							</div>
							<div>
								<h1 className="text-3xl font-bold text-gray-900 tracking-tight mb-2">
									{title}
								</h1>
								<p className="text-gray-600 flex items-center gap-2">
									<span>{subtitle}</span>
									{showVerificationBadge && (
										<CheckBadgeIcon className="h-4 w-4 text-green-600" />
									)}
								</p>
							</div>
						</div>

						{headerActions && (
							<div className="flex items-center gap-3">{headerActions}</div>
						)}
					</div>
				</div>
			</div>

			{/* Breadcrumbs */}
			{breadcrumbs && breadcrumbs.length > 0 && (
				<div className="container mx-auto px-4 sm:px-6 lg:px-8 py-4">
					<nav className="flex items-center gap-2 text-sm text-gray-600">
						{breadcrumbs.map((crumb, index) => (
							<React.Fragment key={index}>
								{index > 0 && <span>/</span>}
								{crumb.href && !crumb.current ? (
									<a
										href={crumb.href}
										className="hover:text-gray-900 transition-colors"
									>
										{crumb.label}
									</a>
								) : (
									<span
										className={crumb.current ? "text-gray-900 font-medium" : ""}
									>
										{crumb.label}
									</span>
								)}
							</React.Fragment>
						))}
					</nav>
				</div>
			)}

			{/* Contenido Principal */}
			<div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
				{children}
			</div>
		</div>
	);
};

export default CalculationsLayout;
