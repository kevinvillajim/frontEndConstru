// src/ui/components/calculations/CalculationsNavigation.tsx
import React from "react";
import {Link, useLocation} from "react-router-dom";
import {
	CalculatorIcon,
	ChartBarIcon,
	DocumentTextIcon,
	UserGroupIcon,
	BookmarkIcon,
	PuzzlePieceIcon,
	Cog6ToothIcon,
	SparklesIcon,
} from "@heroicons/react/24/outline";

interface NavigationItem {
	id: string;
	name: string;
	description: string;
	path: string;
	icon: React.ComponentType<React.SVGProps<SVGSVGElement>>;
	color: string;
	isNew?: boolean;
}

const navigationItems: NavigationItem[] = [
	{
		id: "catalog",
		name: "Catálogo de Plantillas",
		description: "Explora plantillas de cálculo verificadas NEC",
		path: "/calculations/catalog",
		icon: CalculatorIcon,
		color: "bg-blue-500",
	},
	{
		id: "dashboard",
		name: "Dashboard",
		description: "Métricas y análisis de uso",
		path: "/calculations/dashboard",
		icon: ChartBarIcon,
		color: "bg-purple-500",
	},
	{
		id: "interface",
		name: "Nueva Calculadora",
		description: "Inicia un nuevo cálculo técnico",
		path: "/calculations/interface",
		icon: SparklesIcon,
		color: "bg-green-500",
		isNew: true,
	},
	{
		id: "saved",
		name: "Cálculos Guardados",
		description: "Revisa y reutiliza tus cálculos",
		path: "/calculations/saved",
		icon: BookmarkIcon,
		color: "bg-yellow-500",
	},
	{
		id: "comparison",
		name: "Comparar Cálculos",
		description: "Analiza diferentes opciones lado a lado",
		path: "/calculations/comparison",
		icon: DocumentTextIcon,
		color: "bg-indigo-500",
	},
	{
		id: "collaboration",
		name: "Colaboración",
		description: "Comparte y trabaja en equipo",
		path: "/calculations/collaboration",
		icon: UserGroupIcon,
		color: "bg-pink-500",
	},
	{
		id: "templates",
		name: "Editor de Plantillas",
		description: "Crea plantillas personalizadas",
		path: "/calculations/templates/editor",
		icon: PuzzlePieceIcon,
		color: "bg-orange-500",
	},
	{
		id: "settings",
		name: "Configuración",
		description: "Personaliza tu experiencia",
		path: "/calculations/settings",
		icon: Cog6ToothIcon,
		color: "bg-gray-500",
	},
];

interface CalculationsNavigationProps {
	showAsGrid?: boolean;
	showDescriptions?: boolean;
	maxColumns?: number;
}

const CalculationsNavigation: React.FC<CalculationsNavigationProps> = ({
	showAsGrid = true,
	showDescriptions = true,
	maxColumns = 4,
}) => {
	const location = useLocation();

	const isActivePath = (path: string) => {
		if (path === "/calculations/catalog") {
			return location.pathname === "/calculations/catalog";
		}
		if (path === "/calculations") {
			return location.pathname === "/calculations";
		}
		return location.pathname.startsWith(path);
	};

	if (!showAsGrid) {
		// Renderizado como lista vertical (para sidebar)
		return (
			<nav className="space-y-2">
				{navigationItems.map((item) => (
					<Link
						key={item.id}
						to={item.path}
						className={`flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-all duration-200 group ${
							isActivePath(item.path)
								? "bg-primary-100 text-primary-700 border border-primary-200"
								: "text-gray-600 hover:bg-gray-100 hover:text-gray-900"
						}`}
					>
						<div
							className={`w-10 h-10 ${item.color} rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform duration-200`}
						>
							<item.icon className="h-5 w-5 text-white" />
						</div>
						<div className="flex-1">
							<div className="flex items-center gap-2">
								<span>{item.name}</span>
								{item.isNew && (
									<span className="px-2 py-0.5 bg-green-100 text-green-700 text-xs font-medium rounded-full">
										NUEVO
									</span>
								)}
							</div>
							{showDescriptions && (
								<p className="text-xs opacity-70 mt-1">{item.description}</p>
							)}
						</div>
					</Link>
				))}
			</nav>
		);
	}

	// Renderizado como grid
	return (
		<div
			className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-${Math.min(maxColumns, 4)} gap-6`}
		>
			{navigationItems.map((item) => (
				<Link
					key={item.id}
					to={item.path}
					className={`group relative bg-white rounded-2xl p-6 border border-gray-100 hover:shadow-xl hover:border-primary-200 transition-all duration-300 transform hover:-translate-y-1 ${
						isActivePath(item.path)
							? "ring-2 ring-primary-500 ring-opacity-20 bg-primary-50"
							: ""
					}`}
				>
					{item.isNew && (
						<div className="absolute -top-2 -right-2">
							<span className="px-2 py-1 bg-green-500 text-white text-xs font-bold rounded-full shadow-lg">
								NUEVO
							</span>
						</div>
					)}

					<div className="flex items-start gap-4">
						<div
							className={`w-16 h-16 ${item.color} rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300 shadow-lg`}
						>
							<item.icon className="h-8 w-8 text-white" />
						</div>

						<div className="flex-1">
							<h3 className="text-lg font-semibold text-gray-900 group-hover:text-primary-700 transition-colors duration-200 mb-2">
								{item.name}
							</h3>
							{showDescriptions && (
								<p className="text-gray-600 text-sm leading-relaxed">
									{item.description}
								</p>
							)}
						</div>
					</div>

					{/* Indicador visual para ruta activa */}
					{isActivePath(item.path) && (
						<div className="absolute inset-0 bg-gradient-to-r from-primary-500/5 to-secondary-500/5 rounded-2xl pointer-events-none" />
					)}
				</Link>
			))}
		</div>
	);
};

export default CalculationsNavigation;
