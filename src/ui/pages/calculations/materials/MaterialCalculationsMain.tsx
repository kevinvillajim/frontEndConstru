// src/ui/pages/calculations/materials/MaterialCalculationsMain.tsx
import React, {useState} from "react";
import {Link, useNavigate} from "react-router-dom";
import {
	BeakerIcon,
	RectangleStackIcon,
	ClockIcon,
	ArrowTrendingUpIcon,
	PlayIcon,
	SparklesIcon,
	UserGroupIcon,
	PlusIcon,
	CpuChipIcon,
} from "@heroicons/react/24/outline";

// Configuración de navegación principal mejorada
const MAIN_SECTIONS = [
	{
		id: "catalog",
		name: "Catálogo de Materiales",
		description:
			"Plantillas públicas verificadas para cálculos de materiales y propiedades",
		icon: RectangleStackIcon,
		route: "/calculations/materials/catalog",
		color: "from-blue-500 to-blue-600",
		bgColor: "bg-blue-50",
		borderColor: "border-blue-200",
		textColor: "text-blue-700",
		badge: "156 plantillas",
		isMain: true,
	},
	{
		id: "templates",
		name: "Mis Plantillas",
		description: "Crea y gestiona tus plantillas personales de materiales",
		icon: BeakerIcon,
		route: "/calculations/materials/templates",
		color: "from-emerald-500 to-emerald-600",
		bgColor: "bg-emerald-50",
		borderColor: "border-emerald-200",
		textColor: "text-emerald-700",
		badge: "Crear nueva",
		isMain: true,
	},
	{
		id: "results",
		name: "Historial de Resultados",
		description: "Resultados guardados y historial de cálculos ejecutados",
		icon: ClockIcon,
		route: "/calculations/materials/results",
		color: "from-amber-500 to-amber-600",
		bgColor: "bg-amber-50",
		borderColor: "border-amber-200",
		textColor: "text-amber-700",
		badge: "42 resultados",
		isMain: true,
	},
	{
		id: "trending",
		name: "Tendencias y Analytics",
		description: "Plantillas populares, análisis de uso y estadísticas",
		icon: ArrowTrendingUpIcon,
		route: "/calculations/materials/trending",
		color: "from-purple-500 to-purple-600",
		bgColor: "bg-purple-50",
		borderColor: "border-purple-200",
		textColor: "text-purple-700",
		badge: "Análisis",
		isMain: true,
	},
];

// Estadísticas rápidas mejoradas
const QUICK_STATS = [
	{
		label: "Plantillas Activas",
		value: "156",
		change: "+12",
		icon: RectangleStackIcon,
		color: "from-blue-500 to-blue-600",
	},
	{
		label: "Cálculos Este Mes",
		value: "2.4k",
		change: "+18",
		icon: CpuChipIcon,
		color: "from-emerald-500 to-emerald-600",
	},
	{
		label: "Usuarios Activos",
		value: "834",
		change: "+7",
		icon: UserGroupIcon,
		color: "from-purple-500 to-purple-600",
	},
	{
		label: "Nuevas Plantillas",
		value: "23",
		change: "+5",
		icon: SparklesIcon,
		color: "from-amber-500 to-amber-600",
	},
];

// Actividad reciente simulada
const RECENT_ACTIVITY = [
	{
		id: 1,
		type: "calculation",
		title: "Dosificación de Hormigón H21",
		user: "María García",
		time: "Hace 2 minutos",
		icon: PlayIcon,
		color: "text-green-600",
	},
	{
		id: 2,
		type: "template",
		title: "Nueva plantilla: Acero Estructural",
		user: "Carlos Ruiz",
		time: "Hace 15 minutos",
		icon: PlusIcon,
		color: "text-blue-600",
	},
	{
		id: 3,
		type: "trending",
		title: "Cálculo de Agregados trending",
		time: "Hace 1 hora",
		icon: ArrowTrendingUpIcon,
		color: "text-purple-600",
	},
];

const MaterialCalculationsMain: React.FC = () => {
	const navigate = useNavigate();
	const [selectedSection, setSelectedSection] = useState<string | null>(null);

	const handleSectionClick = (route: string, sectionId: string) => {
		setSelectedSection(sectionId);
		// Pequeño delay para la animación
		setTimeout(() => {
			navigate(route);
		}, 150);
	};

	const renderHeader = () => (
		<div className="text-center mb-12">
			<div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl mb-6 shadow-lg">
				<BeakerIcon className="h-10 w-10 text-white" />
			</div>
			<h1 className="text-3xl font-bold text-gray-900 mb-3">
				Cálculos de Materiales
			</h1>
			<p className="text-lg text-gray-600 max-w-2xl mx-auto">
				Herramientas especializadas para cálculos de materiales de construcción,
				dosificaciones y propiedades según normativa ecuatoriana
			</p>
		</div>
	);

	const renderQuickStats = () => (
		<div className="mb-12">
			<h2 className="text-xl font-semibold text-gray-900 mb-6 text-center">
				Resumen de Actividad
			</h2>
			<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
				{QUICK_STATS.map((stat, index) => (
					<div
						key={index}
						className="bg-white rounded-2xl border border-gray-100 p-6 hover:shadow-lg transition-all duration-300 group"
					>
						<div className="flex items-center justify-between mb-4">
							<div
								className={`w-12 h-12 bg-gradient-to-r ${stat.color} rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300`}
							>
								<stat.icon className="h-6 w-6 text-white" />
							</div>
							{stat.change && (
								<div className="flex items-center gap-1 text-sm text-green-600 bg-green-50 px-2 py-1 rounded-full">
									<ArrowTrendingUpIcon className="h-3 w-3" />
									<span className="font-medium">{stat.change}%</span>
								</div>
							)}
						</div>
						<div>
							<div className="text-2xl font-bold text-gray-900 mb-1">
								{stat.value}
							</div>
							<div className="text-sm text-gray-600">{stat.label}</div>
						</div>
					</div>
				))}
			</div>
		</div>
	);

	const renderMainSections = () => (
		<div className="mb-12">
			<h2 className="text-xl font-semibold text-gray-900 mb-6 text-center">
				Herramientas Principales
			</h2>
			<div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
				{MAIN_SECTIONS.map((section) => (
					<div
						key={section.id}
						className={`
							bg-white rounded-2xl border-2 p-8 cursor-pointer transition-all duration-300 group
							hover:shadow-xl hover:scale-[1.02] active:scale-[0.98]
							${
								selectedSection === section.id
									? "border-blue-300 shadow-lg scale-[1.02]"
									: "border-gray-100 hover:border-gray-200"
							}
						`}
						onClick={() => handleSectionClick(section.route, section.id)}
					>
						<div className="flex items-start justify-between mb-6">
							<div
								className={`w-14 h-14 bg-gradient-to-r ${section.color} rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300`}
							>
								<section.icon className="h-7 w-7 text-white" />
							</div>
							<div
								className={`px-3 py-1 ${section.bgColor} ${section.textColor} text-xs font-medium rounded-full border ${section.borderColor}`}
							>
								{section.badge}
							</div>
						</div>

						<div>
							<h3 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-blue-700 transition-colors">
								{section.name}
							</h3>
							<p className="text-gray-600 leading-relaxed">
								{section.description}
							</p>
						</div>

						{/* Indicador visual de hover */}
						<div className="mt-6 flex items-center text-blue-600 font-medium opacity-0 group-hover:opacity-100 transition-opacity duration-300">
							<span>Acceder</span>
							<ArrowTrendingUpIcon className="h-4 w-4 ml-2 transform group-hover:translate-x-1 transition-transform duration-300" />
						</div>
					</div>
				))}
			</div>
		</div>
	);

	const renderRecentActivity = () => (
		<div className="max-w-4xl mx-auto">
			<h2 className="text-xl font-semibold text-gray-900 mb-6 text-center">
				Actividad Reciente
			</h2>
			<div className="bg-white rounded-2xl border border-gray-100 p-6">
				<div className="space-y-4">
					{RECENT_ACTIVITY.map((activity) => (
						<div
							key={activity.id}
							className="flex items-center gap-4 p-4 hover:bg-gray-50 rounded-xl transition-colors"
						>
							<div
								className={`w-10 h-10 ${activity.color} bg-opacity-10 rounded-lg flex items-center justify-center`}
							>
								<activity.icon className={`h-5 w-5 ${activity.color}`} />
							</div>
							<div className="flex-1">
								<div className="font-medium text-gray-900">
									{activity.title}
								</div>
								<div className="text-sm text-gray-600">
									{activity.user && `${activity.user} • `}
									{activity.time}
								</div>
							</div>
						</div>
					))}
				</div>

				<div className="mt-6 text-center">
					<Link
						to="/calculations/materials/results"
						className="text-blue-600 hover:text-blue-700 font-medium text-sm hover:underline"
					>
						Ver toda la actividad →
					</Link>
				</div>
			</div>
		</div>
	);

	return (
		<div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
			<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
				{renderHeader()}
				{renderQuickStats()}
				{renderMainSections()}
				{renderRecentActivity()}
			</div>
		</div>
	);
};

export default MaterialCalculationsMain;
