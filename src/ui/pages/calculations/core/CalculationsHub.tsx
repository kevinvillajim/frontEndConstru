// src/ui/pages/calculations/core/CalculationsHub.tsx
import React, {useState, useEffect, useRef} from "react";
import {Link, useNavigate} from "react-router-dom";
import {
	PlusIcon,
	ClockIcon,
	BookmarkIcon,
	UserGroupIcon,
	ArrowTrendingUpIcon,
	CalculatorIcon,
	FolderIcon,
	ChartBarIcon,
	SparklesIcon,
	ExclamationTriangleIcon,
	PlayIcon,
} from "@heroicons/react/24/outline";
import {useCalculations} from "../shared/hooks/useCalculations";
import type {
	QuickStat,
	RecentActivity,
	NavigationItem,
} from "../shared/types/calculation.types";

// Configuración de navegación principal
const MAIN_SECTIONS = [
	{
		id: "catalog",
		name: "Catálogo de Plantillas",
		description: "Plantillas verificadas y aprobadas por la comunidad",
		icon: CalculatorIcon,
		route: "/calculations/catalog",
		color: "from-blue-500 to-blue-600",
		bgColor: "bg-blue-50",
		borderColor: "border-blue-200",
		textColor: "text-blue-700",
		badge: "230+ plantillas",
		isMain: true,
	},
	{
		id: "my-templates",
		name: "Mis Plantillas",
		description: "Plantillas personalizadas creadas por ti",
		icon: FolderIcon,
		route: "/calculations/templates",
		color: "from-emerald-500 to-emerald-600",
		bgColor: "bg-emerald-50",
		borderColor: "border-emerald-200",
		textColor: "text-emerald-700",
		badge: "Crear nueva",
		isMain: true,
	},
	{
		id: "comparison",
		name: "Comparar Cálculos",
		description: "Compara resultados y analiza diferencias",
		icon: ChartBarIcon,
		route: "/calculations/comparison",
		color: "from-amber-500 to-amber-600",
		bgColor: "bg-amber-50",
		borderColor: "border-amber-200",
		textColor: "text-amber-700",
		badge: "Herramienta",
		isMain: true,
	},
	{
		id: "collaboration",
		name: "Colaboración",
		description: "Espacio colaborativo y cálculos en tendencia",
		icon: SparklesIcon,
		route: "/calculations/collaboration",
		color: "from-purple-500 to-purple-600",
		bgColor: "bg-purple-50",
		borderColor: "border-purple-200",
		textColor: "text-purple-700",
		badge: "Nuevo",
		isMain: true,
	},
];

// Estadísticas rápidas mejoradas
const QUICK_STATS = [
	{
		label: "Cálculos Guardados",
		value: "47",
		change: "+12",
		icon: BookmarkIcon,
		color: "from-blue-500 to-blue-600",
	},
	{
		label: "Plantillas Usadas",
		value: "18",
		change: "+8",
		icon: CalculatorIcon,
		color: "from-emerald-500 to-emerald-600",
	},
	{
		label: "Tiempo Ahorrado",
		value: "24h",
		change: "+15",
		icon: ClockIcon,
		color: "from-purple-500 to-purple-600",
	},
	{
		label: "Colaboraciones",
		value: "3",
		change: "+2",
		icon: UserGroupIcon,
		color: "from-amber-500 to-amber-600",
	},
];

// Actividad reciente simulada
const RECENT_ACTIVITY = [
	{
		id: 1,
		type: "calculation",
		title: "Demanda Eléctrica Residencial",
		user: "Ejecutado por ti",
		time: "Hace 2 minutos",
		icon: PlayIcon,
		color: "text-green-600",
	},
	{
		id: 2,
		type: "template",
		title: "Plantilla personalizada creada",
		user: "Cálculo de vigas especiales",
		time: "Hace 15 minutos",
		icon: PlusIcon,
		color: "text-blue-600",
	},
	{
		id: 3,
		type: "collaboration",
		title: "Cálculo compartido con equipo",
		user: "Análisis sísmico",
		time: "Hace 1 hora",
		icon: ArrowTrendingUpIcon,
		color: "text-purple-600",
	},
];

const CalculationsHub: React.FC = () => {
	const navigate = useNavigate();
	const {templates, savedCalculations, loading, error, clearError} =
		useCalculations();

	const [selectedSection, setSelectedSection] = useState<string | null>(null);
	const [headerHeight, setHeaderHeight] = useState(0);
	const [isMobile, setIsMobile] = useState(false);
	const [recommendationsError, setRecommendationsError] = useState<
		string | null
	>(null);
	const secondSectionRef = useRef<HTMLDivElement>(null);

	// Detectar tamaño de pantalla de forma reactiva
	useEffect(() => {
		const checkScreenSize = () => {
			setIsMobile(window.innerWidth < 768);
		};

		checkScreenSize();
		window.addEventListener("resize", checkScreenSize);
		return () => window.removeEventListener("resize", checkScreenSize);
	}, []);

	const handleSectionClick = (route: string, sectionId: string) => {
		setSelectedSection(sectionId);
		setTimeout(() => {
			navigate(route);
		}, 150);
	};

	useEffect(() => {
		const header =
			document.querySelector("header") || document.querySelector("nav");
		if (header) {
			setHeaderHeight(header.getBoundingClientRect().height);
		} else {
			setHeaderHeight(64);
		}
	}, []);

	const scrollToNextSection = () => {
		if (secondSectionRef.current) {
			secondSectionRef.current.scrollIntoView({behavior: "smooth"});
		}
	};

	const renderHeader = () => (
		<div className="text-center mb-12">
			<div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl mb-6 shadow-lg">
				<CalculatorIcon className="h-10 w-10 text-white" />
			</div>
			<h1 className="text-3xl font-bold text-gray-900 mb-3">
				Cálculos de Construcción
			</h1>
			<p className="text-lg text-gray-600 max-w-2xl mx-auto">
				Herramientas profesionales para cálculos técnicos de construcción según
				normativa ecuatoriana NEC
			</p>
		</div>
	);

	const renderQuickStats = () => (
		<div className="mb-12">
			<h2 className="text-xl font-semibold text-gray-900 mb-6 text-center">
				Tu Actividad de Cálculos
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
				Herramientas de Cálculo
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
						to="/calculations/comparison"
						className="text-blue-600 hover:text-blue-700 font-medium text-sm hover:underline"
					>
						Ver toda la actividad →
					</Link>
				</div>
			</div>
		</div>
	);

	// Mostrar mensaje de error si hay problemas críticos
	if (error) {
		return (
			<div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center p-4">
				<div className="bg-red-50 border border-red-200 rounded-2xl p-8 max-w-md w-full">
					<div className="flex items-center gap-3 mb-4">
						<ExclamationTriangleIcon className="h-8 w-8 text-red-600" />
						<div>
							<h3 className="text-lg font-semibold text-red-900 mb-1">
								Error al cargar los datos
							</h3>
							<p className="text-red-700 text-sm">{error}</p>
						</div>
					</div>
					<button
						onClick={() => {
							clearError();
							window.location.reload();
						}}
						className="w-full mt-4 px-4 py-3 bg-red-600 text-white rounded-xl text-sm hover:bg-red-700 transition-colors"
					>
						Reintentar
					</button>
				</div>
			</div>
		);
	}

	// CONDICIONAL COMPLETO: DOS RENDERIZADOS DIFERENTES
	if (isMobile) {
		// ===== VISTA MÓVIL: Scroll normal, sin snap =====
		return (
			<div className="bg-gradient-to-br from-gray-50 to-gray-100 min-h-screen">
				{/* Mostrar advertencia si hay errores en recomendaciones */}
				{recommendationsError && (
					<div className="mx-auto px-3 sm:px-4 pt-4">
						<div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4 mb-4">
							<div className="flex items-center gap-2">
								<ExclamationTriangleIcon className="h-5 w-5 text-yellow-600" />
								<p className="text-yellow-800 text-sm">
									{recommendationsError}
								</p>
							</div>
						</div>
					</div>
				)}

				{/* Primera sección - móvil */}
				<div
					className="mx-auto px-3 sm:px-4 py-8 min-h-screen flex flex-col justify-center"
					style={{maxWidth: "80rem"}}
				>
					{renderHeader()}
					{renderQuickStats()}
				</div>

				{/* Segunda sección - móvil */}
				<div className="mx-auto px-3 sm:px-4 py-8" style={{maxWidth: "90rem"}}>
					{renderMainSections()}
					{renderRecentActivity()}
				</div>
			</div>
		);
	}

	// ===== VISTA DESKTOP: Scroll snapping =====
	return (
		<div
			className="bg-gradient-to-br from-gray-50 to-gray-100"
			style={{
				height: `calc(100vh - ${headerHeight}px)`,
				overflowY: "auto",
				scrollSnapType: "y mandatory",
				scrollBehavior: "smooth",
			}}
		>
			{/* Mostrar advertencia si hay errores en recomendaciones */}
			{recommendationsError && (
				<div className="absolute top-4 left-1/2 transform -translate-x-1/2 z-10 max-w-md">
					<div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4">
						<div className="flex items-center gap-2">
							<ExclamationTriangleIcon className="h-5 w-5 text-yellow-600" />
							<p className="text-yellow-800 text-sm">{recommendationsError}</p>
						</div>
					</div>
				</div>
			)}

			{/* Primera sección - desktop */}
			<div
				className="relative mx-auto px-4 sm:px-6 lg:px-8 flex flex-col justify-center items-center"
				style={{
					height: `calc(100vh - ${headerHeight}px)`,
					maxWidth: "80rem",
					scrollSnapAlign: "start",
				}}
			>
				<div className="flex flex-col justify-center items-center h-full">
					{renderHeader()}
					{renderQuickStats()}
				</div>

				<div className="absolute bottom-8 left-1/2 transform -translate-x-1/2">
					<button
						onClick={scrollToNextSection}
						className="p-3 bg-white/80 backdrop-blur-sm rounded-full shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-110"
						style={{animation: "bounce 2s infinite"}}
					>
						<svg
							xmlns="http://www.w3.org/2000/svg"
							fill="none"
							viewBox="0 0 24 24"
							strokeWidth="1.5"
							stroke="currentColor"
							className="size-6"
						>
							<path
								strokeLinecap="round"
								strokeLinejoin="round"
								d="m19.5 8.25-7.5 7.5-7.5-7.5"
							/>
						</svg>
					</button>
				</div>
			</div>

			{/* Segunda sección - desktop */}
			<div
				ref={secondSectionRef}
				className="relative mx-auto px-4 sm:px-6 lg:px-8 flex items-center gap-8"
				style={{
					height: `calc(100vh - ${headerHeight}px)`,
					maxWidth: "90rem",
					scrollSnapAlign: "start",
				}}
			>
				<div className="flex-1">{renderMainSections()}</div>
				<div className="w-96 flex-shrink-0">{renderRecentActivity()}</div>
			</div>

			{/* CSS para animación */}
			<style>{`
				@keyframes bounce {
					0%, 20%, 53%, 80%, 100% {
						transform: translate3d(0, 0, 0);
					}
					40%, 43% {
						transform: translate3d(0, -10px, 0);
					}
					70% {
						transform: translate3d(0, -5px, 0);
					}
					90% {
						transform: translate3d(0, -2px, 0);
					}
				}
				html { scroll-snap-type: none !important; }
				body { overflow-x: hidden; }
			`}</style>
		</div>
	);
};

export default CalculationsHub;
