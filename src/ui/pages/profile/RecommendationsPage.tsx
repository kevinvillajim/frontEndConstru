// src/ui/pages/profile/RecommendationsPage.tsx
import {useState, useEffect} from "react";
import {useAuth} from "../../context/AuthContext";
import ToastService from "../../components/common/ToastService";
import {
	ChartBarIcon,
	ClockIcon,
	LightBulbIcon,
	BuildingLibraryIcon,
	CubeIcon,
	DocumentTextIcon,
	ArrowPathIcon,
	XCircleIcon,
} from "@heroicons/react/24/outline";

// Define types based on the UserBehaviorPattern and recommendation entities from the backend
interface UserBehaviorPattern {
	userId: string;
	frequentMaterials: Array<{
		materialId: string;
		frequency: number;
		name?: string;
	}>;
	frequentCategories: Array<{
		categoryId: string;
		frequency: number;
		name?: string;
	}>;
	searchPatterns: Array<{term: string; frequency: number}>;
	preferredCalculationTypes: Array<{type: string; frequency: number}>;
	sessionMetrics: {
		averageDuration: number;
		averageActionsPerSession: number;
		mostActiveTimeOfDay: string;
	};
	projectPreferences: {
		preferredProjectTypes: string[];
		averageProjectDuration: number;
		averageBudgetRange: {min: number; max: number};
	};
}

interface Recommendation {
	id: string;
	type: "material" | "category" | "project_type" | "supplier";
	materialId?: string;
	categoryId?: string;
	projectType?: string;
	supplierId?: string;
	score: number;
	reason: string;
	status: "pending" | "viewed" | "clicked" | "converted" | "dismissed";
	expiresAt?: Date;
	name?: string; // For display purposes
	thumbnailUrl?: string; // For display purposes
}

const RecommendationsPage = () => {
	const {user} = useAuth();
	const [isLoading, setIsLoading] = useState(true);
	const [behaviorPattern, setBehaviorPattern] =
		useState<UserBehaviorPattern | null>(null);
	const [recommendations, setRecommendations] = useState<Recommendation[]>([]);
	const [similarUsers, setSimilarUsers] = useState<
		Array<{userId: string; similarityScore: number}>
	>([]);
	const [activeTab, setActiveTab] = useState<"insights" | "recommendations">(
		"insights"
	);
	const [timeRange, setTimeRange] = useState<"30days" | "90days" | "allTime">(
		"30days"
	);

	// Fetch user behavior pattern and recommendations
	useEffect(() => {
		const fetchUserData = async () => {
			if (!user) return;

			setIsLoading(true);
			try {
				// In a real implementation, these would be API calls to your backend
				// For now, we'll simulate the data

				// Example call: const response = await userService.getUserBehaviorPattern(user.id, timeRange);
				// Example call: const recommendationsResponse = await userService.getUserRecommendations(user.id);

				// Simulate API response delay
				await new Promise((resolve) => setTimeout(resolve, 800));

				// Mock data for demonstration
				const mockPattern: UserBehaviorPattern = {
					userId: user.id,
					frequentMaterials: [
						{materialId: "m1", frequency: 23, name: "Cemento Portland Tipo I"},
						{materialId: "m2", frequency: 18, name: "Varilla Corrugada 12mm"},
						{
							materialId: "m3",
							frequency: 14,
							name: "Bloque de Hormigón 15x20x40",
						},
						{
							materialId: "m4",
							frequency: 9,
							name: "Impermeabilizante Acrílico",
						},
					],
					frequentCategories: [
						{categoryId: "c1", frequency: 35, name: "Estructurales"},
						{categoryId: "c2", frequency: 27, name: "Acabados"},
						{categoryId: "c3", frequency: 18, name: "Instalaciones"},
					],
					searchPatterns: [
						{term: "hormigón estructural", frequency: 12},
						{term: "impermeabilizante", frequency: 8},
						{term: "presupuesto vivienda", frequency: 7},
					],
					preferredCalculationTypes: [
						{type: "Estimación de materiales", frequency: 28},
						{type: "Cálculo estructural", frequency: 21},
						{type: "Presupuesto", frequency: 16},
					],
					sessionMetrics: {
						averageDuration: 32.5, // minutos
						averageActionsPerSession: 14,
						mostActiveTimeOfDay: "afternoon",
					},
					projectPreferences: {
						preferredProjectTypes: ["Residencial", "Comercial"],
						averageProjectDuration: 120, // días
						averageBudgetRange: {min: 50000, max: 150000},
					},
				};

				const mockRecommendations: Recommendation[] = [
					{
						id: "r1",
						type: "material",
						materialId: "m5",
						score: 0.92,
						reason: "Basado en tus proyectos recientes de tipo residencial",
						status: "pending",
						expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
						name: "Sistema de Encofrado Modulable",
						thumbnailUrl: "/assets/materials/encofrado.jpg",
					},
					{
						id: "r2",
						type: "category",
						categoryId: "c4",
						score: 0.87,
						reason: "Usuarios similares exploran frecuentemente esta categoría",
						status: "pending",
						expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
						name: "Sistemas de Reforzamiento Sísmico",
						thumbnailUrl: "/assets/categories/seismic.jpg",
					},
					{
						id: "r3",
						type: "project_type",
						projectType: "Comercial - Hospitality",
						score: 0.82,
						reason:
							"Compatible con tu experiencia profesional y búsquedas recientes",
						status: "pending",
						expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
						name: "Plantillas para Proyectos Hoteleros",
						thumbnailUrl: "/assets/projects/hospitality.jpg",
					},
					{
						id: "r4",
						type: "material",
						materialId: "m6",
						score: 0.79,
						reason: "Complementa los materiales que usas habitualmente",
						status: "pending",
						expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
						name: "Aditivo Acelerante de Fraguado",
						thumbnailUrl: "/assets/materials/aditivo.jpg",
					},
				];

				const mockSimilarUsers = [
					{userId: "u123", similarityScore: 0.89},
					{userId: "u456", similarityScore: 0.76},
					{userId: "u789", similarityScore: 0.72},
				];

				setBehaviorPattern(mockPattern);
				setRecommendations(mockRecommendations);
				setSimilarUsers(mockSimilarUsers);
			} catch (error) {
				console.error("Error al cargar datos de usuario:", error);
				ToastService.error("Error al cargar análisis de comportamiento");
			} finally {
				setIsLoading(false);
			}
		};

		fetchUserData();
	}, [user, timeRange]);

	// Handle recommendation action (View, Click, Dismiss)
	const handleRecommendationAction = async (
		recommendationId: string,
		action: "viewed" | "clicked" | "dismissed"
	) => {
		try {
			// In a real implementation, this would be an API call
			// await userService.updateRecommendationStatus(recommendationId, action);

			// Update local state
			setRecommendations((prev) =>
				prev.map((rec) =>
					rec.id === recommendationId ? {...rec, status: action} : rec
				)
			);

			// Show success message for specific actions
			if (action === "dismissed") {
				ToastService.info("Recomendación descartada");
			}
		} catch (error) {
			console.error(
				`Error al ${action === "dismissed" ? "descartar" : "actualizar"} recomendación:`,
				error
			);
			ToastService.error(
				`Error al ${action === "dismissed" ? "descartar" : "actualizar"} recomendación`
			);
		}
	};

	// Format time of day
	const formatTimeOfDay = (timeOfDay: string) => {
		switch (timeOfDay) {
			case "morning":
				return "Mañana (6am-12pm)";
			case "afternoon":
				return "Tarde (12pm-6pm)";
			case "evening":
				return "Noche (6pm-10pm)";
			case "night":
				return "Madrugada (10pm-6am)";
			default:
				return timeOfDay;
		}
	};

	// Format recommendation type
	const formatRecommendationType = (type: string) => {
		switch (type) {
			case "material":
				return "Material";
			case "category":
				return "Categoría";
			case "project_type":
				return "Tipo de Proyecto";
			case "supplier":
				return "Proveedor";
			default:
				return type;
		}
	};

	// Get icon for recommendation type
	const getRecommendationIcon = (type: string) => {
		switch (type) {
			case "material":
				return CubeIcon;
			case "category":
				return BuildingLibraryIcon;
			case "project_type":
				return DocumentTextIcon;
			case "supplier":
				return BuildingLibraryIcon;
			default:
				return LightBulbIcon;
		}
	};

	// Refresh data
	const handleRefresh = () => {
		// Re-trigger the data fetch
		setBehaviorPattern(null);
		setRecommendations([]);
		setTimeout(() => {
			// This will trigger the useEffect to re-fetch data
			setIsLoading(true);
		}, 100);
	};

	if (isLoading) {
		return (
			<div className="flex justify-center items-center h-64">
				<div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-500"></div>
			</div>
		);
	}

	return (
		<div>
			<div className="mb-6 flex justify-between items-center">
				<h2 className="text-2xl font-bold text-gray-900">
					Análisis y Recomendaciones
				</h2>
				<div className="flex items-center space-x-2">
					<select
						value={timeRange}
						onChange={(e) => setTimeRange(e.target.value as "30days" | "90days" | "allTime")}
						className="px-3 py-1.5 rounded-md border border-gray-300 focus:ring-primary-500 focus:border-primary-500 bg-white text-gray-900 text-sm"
					>
						<option value="30days">Últimos 30 días</option>
						<option value="90days">Últimos 90 días</option>
						<option value="allTime">Todo el historial</option>
					</select>
					<button
						onClick={handleRefresh}
						className="p-1.5 rounded-md text-gray-500 hover:text-primary-600 hover:bg-gray-100 transition-colors"
						title="Actualizar datos"
					>
						<ArrowPathIcon className="h-5 w-5" />
					</button>
				</div>
			</div>

			{/* Tabs */}
			<div className="mb-6 border-b border-gray-200">
				<div className="flex space-x-8">
					<button
						className={`py-3 border-b-2 font-medium text-sm ${
							activeTab === "insights"
								? "border-primary-500 text-primary-600"
								: "border-transparent text-gray-500 hover:text-gray-700"
						}`}
						onClick={() => setActiveTab("insights")}
					>
						Patrones de Comportamiento
					</button>
					<button
						className={`py-3 border-b-2 font-medium text-sm ${
							activeTab === "recommendations"
								? "border-primary-500 text-primary-600"
								: "border-transparent text-gray-500 hover:text-gray-700"
						}`}
						onClick={() => setActiveTab("recommendations")}
					>
						Recomendaciones Personalizadas
					</button>
				</div>
			</div>

			{/* Tab content */}
			{activeTab === "insights" && behaviorPattern && (
				<div className="space-y-6">
					{/* Usage patterns */}
					<div className="bg-white rounded-lg shadow-sm border border-gray-200 p-5">
						<h3 className="text-lg font-medium text-gray-900 mb-4 flex items-center">
							<ChartBarIcon className="h-5 w-5 mr-2 text-primary-500" />
							Patrones de Uso
						</h3>
						<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
							<div>
								<h4 className="text-sm font-medium text-gray-700 mb-2">
									Materiales Frecuentes
								</h4>
								<ul className="space-y-2">
									{behaviorPattern.frequentMaterials.map((material, index) => (
										<li
											key={material.materialId}
											className="flex items-center justify-between"
										>
											<span className="text-gray-800">
												{material.name || `Material ${index + 1}`}
											</span>
											<div className="flex items-center">
												<div className="w-32 bg-gray-200 rounded-full h-2.5 mr-2">
													<div
														className="bg-primary-500 h-2.5 rounded-full"
														style={{
															width: `${(material.frequency / Math.max(...behaviorPattern.frequentMaterials.map((m) => m.frequency))) * 100}%`,
														}}
													></div>
												</div>
												<span className="text-sm text-gray-500 min-w-[30px] text-right">
													{material.frequency}
												</span>
											</div>
										</li>
									))}
								</ul>
							</div>
							<div>
								<h4 className="text-sm font-medium text-gray-700 mb-2">
									Categorías Frecuentes
								</h4>
								<ul className="space-y-2">
									{behaviorPattern.frequentCategories.map((category, index) => (
										<li
											key={category.categoryId}
											className="flex items-center justify-between"
										>
											<span className="text-gray-800">
												{category.name || `Categoría ${index + 1}`}
											</span>
											<div className="flex items-center">
												<div className="w-32 bg-gray-200 rounded-full h-2.5 mr-2">
													<div
														className="bg-secondary-500 h-2.5 rounded-full"
														style={{
															width: `${(category.frequency / Math.max(...behaviorPattern.frequentCategories.map((c) => c.frequency))) * 100}%`,
														}}
													></div>
												</div>
												<span className="text-sm text-gray-500 min-w-[30px] text-right">
													{category.frequency}
												</span>
											</div>
										</li>
									))}
								</ul>
							</div>
						</div>
					</div>

					{/* Session metrics */}
					<div className="bg-white rounded-lg shadow-sm border border-gray-200 p-5">
						<h3 className="text-lg font-medium text-gray-900 mb-4 flex items-center">
							<ClockIcon className="h-5 w-5 mr-2 text-primary-500" />
							Métricas de Sesión
						</h3>
						<div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
							<div className="bg-gray-100 rounded-lg p-4">
								<span className="text-sm text-gray-500">
									Duración promedio
								</span>
								<p className="text-xl font-semibold text-gray-900 mt-1">
									{behaviorPattern.sessionMetrics.averageDuration.toFixed(1)}{" "}
									min
								</p>
							</div>
							<div className="bg-gray-100 rounded-lg p-4">
								<span className="text-sm text-gray-500">
									Acciones por sesión
								</span>
								<p className="text-xl font-semibold text-gray-900 mt-1">
									{behaviorPattern.sessionMetrics.averageActionsPerSession.toFixed(
										0
									)}
								</p>
							</div>
							<div className="bg-gray-100 rounded-lg p-4">
								<span className="text-sm text-gray-500">
									Horario más activo
								</span>
								<p className="text-xl font-semibold text-gray-900 mt-1">
									{formatTimeOfDay(
										behaviorPattern.sessionMetrics.mostActiveTimeOfDay
									)}
								</p>
							</div>
						</div>
					</div>

					{/* Search patterns and calculation preferences */}
					<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
						<div className="bg-white rounded-lg shadow-sm border border-gray-200 p-5">
							<h3 className="text-sm font-medium text-gray-700 mb-3">
								Patrones de Búsqueda
							</h3>
							<div className="space-y-3">
								{behaviorPattern.searchPatterns.map((pattern) => (
									<div
										key={pattern.term}
										className="flex items-center bg-gray-100 rounded-lg px-3 py-2"
									>
										<span className="text-gray-600 flex-1">
											{pattern.term}
										</span>
										<span className="text-xs px-2 py-1 rounded-full bg-primary-100">
											{pattern.frequency}x
										</span>
									</div>
								))}
							</div>
						</div>
						<div className="bg-white rounded-lg shadow-sm border border-gray-200 p-5">
							<h3 className="text-sm font-medium text-gray-700 mb-3">
								Cálculos Preferidos
							</h3>
							<div className="space-y-3">
								{behaviorPattern.preferredCalculationTypes.map((type) => (
									<div
										key={type.type}
										className="flex items-center bg-gray-100 rounded-lg px-3 py-2"
									>
										<span className="text-gray-600 flex-1">
											{type.type}
										</span>
										<span className="text-xs px-2 py-1 rounded-full bg-secondary-100 text-secondary-800">
											{type.frequency}x
										</span>
									</div>
								))}
							</div>
						</div>
					</div>

					{/* Project preferences */}
					<div className="bg-white rounded-lg shadow-sm border border-gray-200 p-5">
						<h3 className="text-lg font-medium text-gray-900 mb-4 flex items-center">
							<DocumentTextIcon className="h-5 w-5 mr-2 text-primary-500" />
							Preferencias de Proyectos
						</h3>
						<div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
							<div className="bg-gray-100 rounded-lg p-4">
								<span className="text-sm text-gray-500">
									Tipos frecuentes
								</span>
								<div className="mt-2 flex flex-wrap gap-2">
									{behaviorPattern.projectPreferences.preferredProjectTypes.map(
										(type) => (
											<span
												key={type}
												className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800"
											>
												{type}
											</span>
										)
									)}
								</div>
							</div>
							<div className="bg-gray-100 rounded-lg p-4">
								<span className="text-sm text-gray-500">
									Duración promedio
								</span>
								<p className="text-xl font-semibold text-gray-900 mt-1">
									{behaviorPattern.projectPreferences.averageProjectDuration}{" "}
									días
								</p>
							</div>
							<div className="bg-gray-100 rounded-lg p-4">
								<span className="text-sm text-gray-500">
									Rango presupuestario
								</span>
								<p className="text-xl font-semibold text-gray-900 mt-1">
									$
									{behaviorPattern.projectPreferences.averageBudgetRange.min.toLocaleString()}{" "}
									- $
									{behaviorPattern.projectPreferences.averageBudgetRange.max.toLocaleString()}
								</p>
							</div>
						</div>
					</div>
				</div>
			)}

			{activeTab === "recommendations" && (
				<div className="space-y-6">
					{/* Recommendations heading */}
					<div className="flex justify-between items-center">
						<h3 className="text-lg font-medium text-gray-900 flex items-center">
							<LightBulbIcon className="h-5 w-5 mr-2 text-primary-500" />
							Recomendaciones Personalizadas
						</h3>
						<span className="text-sm text-gray-500">
							{recommendations.filter((r) => r.status === "pending").length}{" "}
							nuevas recomendaciones
						</span>
					</div>

					{/* Recommendations list */}
					{recommendations.length > 0 ? (
						<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
							{recommendations.map((recommendation) => {
								const Icon = getRecommendationIcon(recommendation.type);
								return (
									<div
										key={recommendation.id}
										className={`bg-white rounded-lg shadow-sm border ${
											recommendation.status === "pending"
												? "border-primary-200"
												: "border-gray-200"
										} p-5 relative ${
											recommendation.status === "dismissed" ? "opacity-60" : ""
										}`}
									>
										{recommendation.status === "pending" && (
											<div className="absolute top-3 right-3 h-2 w-2 rounded-full bg-primary-500"></div>
										)}
										<div className="flex items-start mb-3">
											<div className="flex-shrink-0 h-10 w-10 rounded-full bg-primary-100 flex items-center justify-center text-primary-600">
												<Icon className="h-5 w-5" />
											</div>
											<div className="ml-3 flex-1">
												<h4 className="text-base font-medium text-gray-900">
													{recommendation.name || "Recomendación"}
												</h4>
												<p className="text-sm text-gray-500">
													{formatRecommendationType(recommendation.type)} •
													Relevancia: {(recommendation.score * 100).toFixed(0)}%
												</p>
											</div>
										</div>
										<p className="text-gray-600 text-sm mb-4">
											{recommendation.reason}
										</p>
										<div className="flex justify-between items-center">
											{recommendation.status !== "dismissed" ? (
												<div className="flex space-x-2">
													<button
														onClick={() =>
															handleRecommendationAction(
																recommendation.id,
																"clicked"
															)
														}
														className="px-3 py-1.5 text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 rounded-md"
													>
														Ver más
													</button>
													<button
														onClick={() =>
															handleRecommendationAction(
																recommendation.id,
																"dismissed"
															)
														}
														className="px-3 py-1.5 text-sm font-medium text-gray-500 hover:text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-md"
													>
														Descartar
													</button>
												</div>
											) : (
												<div className="flex items-center text-sm text-gray-500">
													<XCircleIcon className="h-4 w-4 mr-1" /> Descartada
												</div>
											)}

											{recommendation.expiresAt && (
												<div className="text-xs text-gray-400">
													Expira:{" "}
													{new Date(
														recommendation.expiresAt
													).toLocaleDateString()}
												</div>
											)}
										</div>
									</div>
								);
							})}
						</div>
					) : (
						<div className="bg-gray-50 rounded-lg p-8 text-center">
							<LightBulbIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
							<h3 className="text-lg font-medium text-gray-900 mb-2">
								No hay recomendaciones
							</h3>
							<p className="text-gray-500 max-w-md mx-auto">
								Sigue utilizando la plataforma para generar recomendaciones
								personalizadas basadas en tu comportamiento.
							</p>
						</div>
					)}

					{/* Similar users section (simplified) */}
					{similarUsers.length > 0 && (
						<div className="bg-white rounded-lg shadow-sm border border-gray-200 p-5 mt-6">
							<h3 className="text-lg font-medium text-gray-900 mb-4">
								Basado en el Comportamiento de Usuarios Similares
							</h3>
							<p className="text-sm text-gray-600 mb-3">
								Nuestro sistema ha identificado patrones similares entre tus
								actividades y las de otros profesionales, lo que nos permite
								ofrecerte recomendaciones más precisas.
							</p>
							<div className="flex items-center">
								<div className="h-2.5 w-full rounded-full bg-gray-200">
									<div
										className="h-2.5 rounded-full bg-primary-500"
										style={{width: "78%"}}
									></div>
								</div>
								<span className="ml-3 text-sm font-medium text-gray-700">
									78%
								</span>
							</div>
							<p className="mt-2 text-xs text-gray-500">
								Similitud con otros profesionales de tu área
							</p>
						</div>
					)}
				</div>
			)}
		</div>
	);
};

export default RecommendationsPage;
