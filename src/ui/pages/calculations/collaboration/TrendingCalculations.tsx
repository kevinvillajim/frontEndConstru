import React, {useState} from "react";
import {
	GlobeAltIcon,
	ChartBarIcon,
	FireIcon,
	StarIcon,
	MagnifyingGlassIcon,
	ArrowPathIcon,
} from "@heroicons/react/24/outline";
import TrendingCard from "./components/TrendingCard";

// Tipos
interface TrendingCalculation {
	id: string;
	name: string;
	templateName: string;
	category: "structural" | "electrical" | "architectural" | "hydraulic";
	author: {
		name: string;
		company?: string;
		country: string;
	};
	stats: {
		uses: number;
		saves: number;
		rating: number;
		reviews: number;
	};
	tags: string[];
	isFavorite: boolean;
	results: {
		preview: string;
		unit: string;
	};
	publishedAt: string;
	updatedAt: string;
}

// Datos mock
const mockTrendingCalculations: TrendingCalculation[] = [
	{
		id: "trend-001",
		name: "Análisis Sísmico NEC-2015 (Actualizado)",
		templateName: "Análisis Sísmico Estático",
		category: "structural",
		author: {
			name: "Ing. María Vásquez",
			company: "Universidad Politécnica",
			country: "EC",
		},
		stats: {
			uses: 2453,
			saves: 987,
			rating: 4.8,
			reviews: 124,
		},
		tags: ["sismo", "espectro", "NEC-2015", "verificado"],
		isFavorite: false,
		results: {
			preview: "Espectro NEC-2015",
			unit: "",
		},
		publishedAt: "2023-11-15T10:30:00Z",
		updatedAt: "2024-02-28T14:20:00Z",
	},
	{
		id: "trend-002",
		name: "Demanda Eléctrica Residencial Optimizada",
		templateName: "Demanda Eléctrica Residencial",
		category: "electrical",
		author: {
			name: "Ing. Carlos Mendoza",
			company: "EEQSA",
			country: "EC",
		},
		stats: {
			uses: 1876,
			saves: 765,
			rating: 4.6,
			reviews: 98,
		},
		tags: ["eléctrico", "residencial", "demanda", "certificado"],
		isFavorite: true,
		results: {
			preview: "Automatizado",
			unit: "kW",
		},
		publishedAt: "2023-12-05T16:45:00Z",
		updatedAt: "2024-03-10T09:15:00Z",
	},
	{
		id: "trend-003",
		name: "Cálculo de Zapata Aislada - Pro",
		templateName: "Diseño de Zapatas",
		category: "structural",
		author: {
			name: "Ing. Roberto Suárez",
			company: "Constructora Nacional",
			country: "EC",
		},
		stats: {
			uses: 1542,
			saves: 621,
			rating: 4.9,
			reviews: 87,
		},
		tags: ["cimentación", "zapata", "suelos", "profesional"],
		isFavorite: false,
		results: {
			preview: "Optimizado",
			unit: "",
		},
		publishedAt: "2024-01-20T11:30:00Z",
		updatedAt: "2024-03-15T10:40:00Z",
	},
	{
		id: "trend-004",
		name: "Cálculo de Áreas Computables PUOS",
		templateName: "Cálculo de Áreas",
		category: "architectural",
		author: {
			name: "Arq. Sofía Torres",
			company: "Municipio de Quito",
			country: "EC",
		},
		stats: {
			uses: 1235,
			saves: 543,
			rating: 4.5,
			reviews: 76,
		},
		tags: ["áreas", "PUOS", "municipal", "oficial"],
		isFavorite: true,
		results: {
			preview: "Conforme normativa",
			unit: "m²",
		},
		publishedAt: "2023-10-10T14:15:00Z",
		updatedAt: "2024-03-01T16:30:00Z",
	},
	{
		id: "trend-005",
		name: "Presupuesto Rápido de Obra",
		templateName: "Presupuesto Referencial",
		category: "architectural",
		author: {
			name: "Ing. David Ramos",
			company: "Consultora Edificar",
			country: "EC",
		},
		stats: {
			uses: 2187,
			saves: 876,
			rating: 4.7,
			reviews: 103,
		},
		tags: ["presupuesto", "referencial", "obra", "rápido"],
		isFavorite: false,
		results: {
			preview: "Actualizado 2024",
			unit: "USD",
		},
		publishedAt: "2024-01-05T09:20:00Z",
		updatedAt: "2024-03-12T11:45:00Z",
	},
	{
		id: "trend-006",
		name: "Diseño de Sistema Contraincendios",
		templateName: "Sistemas Contraincendios",
		category: "hydraulic",
		author: {
			name: "Ing. Laura Moreno",
			company: "Cuerpo de Bomberos",
			country: "EC",
		},
		stats: {
			uses: 987,
			saves: 432,
			rating: 4.8,
			reviews: 65,
		},
		tags: ["incendios", "bomberos", "sprinklers", "oficial"],
		isFavorite: false,
		results: {
			preview: "Normativa 2023",
			unit: "",
		},
		publishedAt: "2023-11-25T13:40:00Z",
		updatedAt: "2024-02-20T15:15:00Z",
	},
];

// Categorías con iconos y colores
const categories = [
	{
		id: "all",
		name: "Todos",
		icon: "🔍",
		color: "bg-gray-100 text-gray-700",
	},
	{
		id: "structural",
		name: "Estructural",
		icon: "🏗️",
		color: "bg-blue-50 text-blue-700",
	},
	{
		id: "electrical",
		name: "Eléctrico",
		icon: "⚡",
		color: "bg-yellow-50 text-yellow-700",
	},
	{
		id: "architectural",
		name: "Arquitectónico",
		icon: "🏛️",
		color: "bg-green-50 text-green-700",
	},
	{
		id: "hydraulic",
		name: "Hidráulico",
		icon: "🚰",
		color: "bg-cyan-50 text-cyan-700",
	},
];

// Países disponibles
const countries = [
	{code: "ALL", name: "Global"},
	{code: "EC", name: "Ecuador"},
	{code: "CO", name: "Colombia"},
	{code: "PE", name: "Perú"},
	{code: "CL", name: "Chile"},
];

// Períodos de tiempo
const timePeriods = [
	{id: "day", name: "Hoy"},
	{id: "week", name: "Esta semana"},
	{id: "month", name: "Este mes"},
	{id: "year", name: "Este año"},
	{id: "all", name: "Todo el tiempo"},
];

const TrendingCalculations: React.FC = () => {
	const [searchTerm, setSearchTerm] = useState("");
	const [selectedCategory, setSelectedCategory] = useState("all");
	const [selectedCountry, setSelectedCountry] = useState("EC");
	const [selectedTimePeriod, setSelectedTimePeriod] = useState("month");
	const [calculations, setCalculations] = useState(mockTrendingCalculations);

	// Función para marcar/desmarcar favoritos
	const toggleFavorite = (calculationId: string) => {
		setCalculations((prev) =>
			prev.map((calc) =>
				calc.id === calculationId
					? {...calc, isFavorite: !calc.isFavorite}
					: calc
			)
		);
	};

	// Filtrar cálculos
	const filteredCalculations = calculations.filter((calc) => {
		const matchesSearch =
			calc.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
			calc.templateName.toLowerCase().includes(searchTerm.toLowerCase()) ||
			calc.tags.some((tag) =>
				tag.toLowerCase().includes(searchTerm.toLowerCase())
			);

		const matchesCategory =
			selectedCategory === "all" || calc.category === selectedCategory;
		const matchesCountry =
			selectedCountry === "ALL" || calc.author.country === selectedCountry;

		return matchesSearch && matchesCategory && matchesCountry;
	});

	// Formatear números grandes
	const formatNumber = (num: number): string => {
		if (num >= 1000) {
			return (num / 1000).toFixed(1) + "k";
		}
		return num.toString();
	};

	return (
		<div className="space-y-6">
			{/* Filtros y búsqueda */}
			<div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
				<div className="flex flex-col lg:flex-row gap-4">
					<div className="flex-1">
						<div className="relative">
							<MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
							<input
								type="text"
								placeholder="Buscar cálculos populares..."
								value={searchTerm}
								onChange={(e) => setSearchTerm(e.target.value)}
								className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
							/>
						</div>
					</div>

					<div className="flex flex-wrap gap-3">
						<select
							value={selectedCategory}
							onChange={(e) => setSelectedCategory(e.target.value)}
							className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
						>
							{categories.map((category) => (
								<option key={category.id} value={category.id}>
									{category.icon} {category.name}
								</option>
							))}
						</select>

						<select
							value={selectedCountry}
							onChange={(e) => setSelectedCountry(e.target.value)}
							className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
						>
							{countries.map((country) => (
								<option key={country.code} value={country.code}>
									{country.code === "ALL"
										? "🌎"
										: country.code === "EC"
											? "🇪🇨"
											: country.code === "CO"
												? "🇨🇴"
												: country.code === "PE"
													? "🇵🇪"
													: "🇨🇱"}{" "}
									{country.name}
								</option>
							))}
						</select>

						<select
							value={selectedTimePeriod}
							onChange={(e) => setSelectedTimePeriod(e.target.value)}
							className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
						>
							{timePeriods.map((period) => (
								<option key={period.id} value={period.id}>
									{period.name}
								</option>
							))}
						</select>

						<button className="px-3 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors flex items-center gap-2">
							<ArrowPathIcon className="h-4 w-4" />
							Actualizar
						</button>
					</div>
				</div>
			</div>

			{/* Estadísticas de tendencia */}
			<div className="grid grid-cols-1 md:grid-cols-4 gap-4">
				<div className="bg-white rounded-xl p-4 border border-gray-200 flex items-center">
					<div className="p-3 bg-orange-100 rounded-lg">
						<FireIcon className="h-6 w-6 text-orange-600" />
					</div>
					<div className="ml-4">
						<p className="text-sm text-gray-600">Más popular</p>
						<p className="font-semibold text-gray-900 line-clamp-1">
							Análisis Sísmico NEC-2015
						</p>
					</div>
				</div>

				<div className="bg-white rounded-xl p-4 border border-gray-200 flex items-center">
					<div className="p-3 bg-blue-100 rounded-lg">
						<ChartBarIcon className="h-6 w-6 text-blue-600" />
					</div>
					<div className="ml-4">
						<p className="text-sm text-gray-600">Usos totales</p>
						<p className="font-semibold text-gray-900">12.5k este mes</p>
					</div>
				</div>

				<div className="bg-white rounded-xl p-4 border border-gray-200 flex items-center">
					<div className="p-3 bg-green-100 rounded-lg">
						<StarIcon className="h-6 w-6 text-green-600" />
					</div>
					<div className="ml-4">
						<p className="text-sm text-gray-600">Mejor calificado</p>
						<p className="font-semibold text-gray-900">Zapata Aislada Pro</p>
					</div>
				</div>

				<div className="bg-white rounded-xl p-4 border border-gray-200 flex items-center">
					<div className="p-3 bg-purple-100 rounded-lg">
						<GlobeAltIcon className="h-6 w-6 text-purple-600" />
					</div>
					<div className="ml-4">
						<p className="text-sm text-gray-600">Región</p>
						<p className="font-semibold text-gray-900">
							{selectedCountry === "ALL"
								? "Global"
								: selectedCountry === "EC"
									? "Ecuador"
									: selectedCountry === "CO"
										? "Colombia"
										: selectedCountry === "PE"
											? "Perú"
											: "Chile"}
						</p>
					</div>
				</div>
			</div>

			{/* Listado de cálculos en tendencia */}
			<div>
				<h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
					<FireIcon className="h-5 w-5 text-orange-500 mr-2" />
					Cálculos Populares{" "}
					{selectedCountry === "ALL"
						? "Global"
						: `en ${countries.find((c) => c.code === selectedCountry)?.name || ""}`}
				</h3>

				<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
					{filteredCalculations.map((calculation) => (
						<TrendingCard
							key={calculation.id}
							calculation={calculation}
							toggleFavorite={toggleFavorite}
							formatNumber={formatNumber}
						/>
					))}
				</div>

				{filteredCalculations.length === 0 && (
					<div className="text-center py-12 bg-white rounded-xl border border-gray-200">
						<FireIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
						<h3 className="text-lg font-medium text-gray-900 mb-2">
							No se encontraron cálculos en tendencia
						</h3>
						<p className="text-gray-600 mb-6">
							Intenta ajustar los filtros o términos de búsqueda.
						</p>
					</div>
				)}
			</div>
		</div>
	);
};

export default TrendingCalculations;
