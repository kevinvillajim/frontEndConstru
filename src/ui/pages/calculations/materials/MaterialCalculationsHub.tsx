// src/ui/pages/calculations/materials/MaterialCalculationsHub.tsx
import React, {useState, useEffect} from "react";
import {useNavigate, useLocation} from "react-router-dom";
import {
	BeakerIcon,
	RectangleStackIcon,
	UserGroupIcon,
	ChartBarIcon,
	ClockIcon,
	CogIcon,
	PlusIcon,
	SparklesIcon,
	ArrowTrendingUpIcon,
} from "@heroicons/react/24/outline";
import MaterialCalculationsRouter from "./MaterialCalculationsRouter";

// Navegación mejorada con estilo minimalista
const NAVIGATION_ITEMS = [
	{
		id: "catalog",
		name: "Catálogo",
		description: "Plantillas públicas verificadas",
		icon: RectangleStackIcon,
		path: "/calculations/materials",
		color: "text-primary-600 bg-primary-50",
		isDefault: true,
	},
	{
		id: "templates",
		name: "Mis Plantillas",
		description: "Gestiona tus plantillas personales",
		icon: BeakerIcon,
		path: "/calculations/materials/templates",
		color: "text-emerald-600 bg-emerald-50",
	},
	{
		id: "results",
		name: "Historial",
		description: "Resultados y cálculos guardados",
		icon: ClockIcon,
		path: "/calculations/materials/results",
		color: "text-amber-600 bg-amber-50",
	},
	{
		id: "trending",
		name: "Tendencias",
		description: "Análisis y plantillas populares",
		icon: ArrowTrendingUpIcon,
		path: "/calculations/materials/trending",
		color: "text-purple-600 bg-purple-50",
	},
];

const MaterialCalculationsHub: React.FC = () => {
	const navigate = useNavigate();
	const location = useLocation();
	const [activeTab, setActiveTab] = useState("catalog");

	// Determinar tab activo basado en la ruta
	useEffect(() => {
		const path = location.pathname;
		if (
			path === "/calculations/materials" ||
			path === "/calculations/materials/"
		) {
			setActiveTab("catalog");
		} else if (path.includes("/templates")) {
			setActiveTab("templates");
		} else if (path.includes("/results")) {
			setActiveTab("results");
		} else if (path.includes("/trending") || path.includes("/analytics")) {
			setActiveTab("trending");
		}
	}, [location.pathname]);

	const handleTabChange = (tabId: string, path: string) => {
		setActiveTab(tabId);
		navigate(path);
	};

	const renderHeader = () => (
		<div className="bg-white border-b border-gray-200">
			<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
				<div className="flex items-center justify-between py-4">
					<div className="flex items-center gap-4">
						<div className="p-2 bg-gradient-to-br from-primary-500 to-primary-600 rounded-lg">
							<BeakerIcon className="h-6 w-6 text-white" />
						</div>
						<div>
							<h1 className="text-xl font-bold text-gray-900">
								Cálculos de Materiales
							</h1>
							<p className="text-sm text-gray-600">
								Sistema profesional de cálculo de materiales de construcción
							</p>
						</div>
					</div>

					<div className="flex items-center gap-3">
						<button
							onClick={() =>
								navigate("/calculations/materials/templates/create")
							}
							className="inline-flex items-center gap-2 px-4 py-2 bg-primary-600 text-white text-sm font-medium rounded-lg hover:bg-primary-700 transition-colors duration-200"
						>
							<PlusIcon className="h-4 w-4" />
							Nueva Plantilla
						</button>

						<button className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors">
							<CogIcon className="h-5 w-5" />
						</button>
					</div>
				</div>

				{/* Navegación por tabs */}
				<div className="flex space-x-1">
					{NAVIGATION_ITEMS.map((item) => {
						const isActive = activeTab === item.id;
						const Icon = item.icon;

						return (
							<button
								key={item.id}
								onClick={() => handleTabChange(item.id, item.path)}
								className={`
                  flex items-center gap-3 px-4 py-3 text-sm font-medium rounded-t-lg
                  transition-all duration-200 ease-in-out
                  ${
										isActive
											? "bg-gray-50 text-primary-700 border-b-2 border-primary-600"
											: "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
									}
                `}
							>
								<div
									className={`p-1.5 rounded-md ${isActive ? item.color : "text-gray-400 bg-gray-100"}`}
								>
									<Icon className="h-4 w-4" />
								</div>
								<div className="text-left">
									<div className="font-medium">{item.name}</div>
									<div className="text-xs text-gray-500 hidden lg:block">
										{item.description}
									</div>
								</div>
							</button>
						);
					})}
				</div>
			</div>
		</div>
	);

	const renderQuickStats = () => (
		<div className="bg-gradient-to-r from-gray-50 to-white border-b border-gray-200">
			<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
				<div className="grid grid-cols-1 md:grid-cols-4 gap-4">
					<div className="flex items-center gap-3">
						<div className="p-2 bg-blue-100 rounded-lg">
							<RectangleStackIcon className="h-5 w-5 text-blue-600" />
						</div>
						<div>
							<p className="text-sm font-medium text-gray-900">Plantillas</p>
							<p className="text-lg font-bold text-blue-600">24</p>
						</div>
					</div>

					<div className="flex items-center gap-3">
						<div className="p-2 bg-emerald-100 rounded-lg">
							<ChartBarIcon className="h-5 w-5 text-emerald-600" />
						</div>
						<div>
							<p className="text-sm font-medium text-gray-900">Esta Semana</p>
							<p className="text-lg font-bold text-emerald-600">156</p>
						</div>
					</div>

					<div className="flex items-center gap-3">
						<div className="p-2 bg-amber-100 rounded-lg">
							<SparklesIcon className="h-5 w-5 text-amber-600" />
						</div>
						<div>
							<p className="text-sm font-medium text-gray-900">Destacadas</p>
							<p className="text-lg font-bold text-amber-600">8</p>
						</div>
					</div>

					<div className="flex items-center gap-3">
						<div className="p-2 bg-purple-100 rounded-lg">
							<UserGroupIcon className="h-5 w-5 text-purple-600" />
						</div>
						<div>
							<p className="text-sm font-medium text-gray-900">Usuarios</p>
							<p className="text-lg font-bold text-purple-600">1.2k</p>
						</div>
					</div>
				</div>
			</div>
		</div>
	);

	const renderBreadcrumb = () => {
		const currentItem = NAVIGATION_ITEMS.find((item) => item.id === activeTab);
		if (!currentItem) return null;

		return (
			<div className="bg-gray-50 border-b border-gray-200">
				<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-2">
					<nav className="flex items-center text-sm">
						<span className="text-gray-500">Cálculos</span>
						<span className="mx-2 text-gray-400">/</span>
						<span className="text-gray-500">Materiales</span>
						<span className="mx-2 text-gray-400">/</span>
						<span className="font-medium text-gray-900">
							{currentItem.name}
						</span>
					</nav>
				</div>
			</div>
		);
	};

	return (
		<div className="min-h-screen bg-gray-50">
			{renderHeader()}
			{renderQuickStats()}
			{renderBreadcrumb()}

			{/* Contenido principal */}
			<div className="flex-1">
				<MaterialCalculationsRouter />
			</div>
		</div>
	);
};

export default MaterialCalculationsHub;