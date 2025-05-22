// src/ui/config/projectTemplatesConfig.ts
import {
	BuildingOfficeIcon,
	HomeIcon,
	CogIcon,
	LightBulbIcon,
	ArchiveBoxIcon,
	BeakerIcon,
	WrenchScrewdriverIcon,
	BuildingStorefrontIcon,
} from "@heroicons/react/24/outline";
import type { ProjectTemplate } from "../hooks/useProjectTemplates";

export const PROJECT_TEMPLATES: ProjectTemplate[] = [
	{
		id: "residential-house",
		name: "Casa Residencial",
		description: "Diseño y construcción de vivienda unifamiliar con todas las comodidades modernas y especificaciones técnicas optimizadas",
		icon: HomeIcon,
		category: "residential",
		color: "from-blue-500 to-cyan-500",
		gradient: "bg-gradient-to-br from-blue-50 to-cyan-50",
		estimatedDuration: "8-12 meses",
		complexity: "intermediate",
		features: [
			"Cálculos estructurales básicos",
			"Diseño de instalaciones eléctricas e hidráulicas",
			"Planificación de espacios y distribución",
			"Gestión de permisos municipales",
			"Especificaciones de materiales locales",
			"Análisis de costos detallado"
		],
		defaultSettings: {
			phases: [
				"Diseño arquitectónico", 
				"Cimentación y estructura", 
				"Instalaciones básicas", 
				"Mampostería y divisiones", 
				"Acabados interiores",
				"Acabados exteriores"
			],
			materials: [
				"Cemento Portland", 
				"Hierro de construcción", 
				"Ladrillo común", 
				"Cerámica para pisos", 
				"Pintura arquitectónica",
				"Tubería PVC",
				"Cable eléctrico",
				"Grifería básica"
			],
			formulas: [
				"Cálculo de áreas y volúmenes", 
				"Cargas estructurales básicas", 
				"Estimación de materiales",
				"Análisis de costos unitarios",
				"Cálculo de instalaciones eléctricas"
			],
			teamRoles: [
				"Arquitecto principal", 
				"Ingeniero estructural", 
				"Maestro mayor", 
				"Electricista certificado", 
				"Plomero especializado",
				"Ayudante de construcción"
			]
		}
	},
	{
		id: "commercial-building",
		name: "Edificio Comercial",
		description: "Desarrollo de espacios comerciales multifuncionales con normativas específicas, sistemas avanzados y alta eficiencia energética",
		icon: BuildingOfficeIcon,
		category: "commercial",
		color: "from-emerald-500 to-teal-500",
		gradient: "bg-gradient-to-br from-emerald-50 to-teal-50",
		estimatedDuration: "12-18 meses",
		complexity: "advanced",
		features: [
			"Cálculos sísmicos avanzados según NEC",
			"Sistemas de climatización HVAC",
			"Normativas comerciales ecuatorianas",
			"Diseño de accesibilidad universal",
			"Sistemas contra incendios",
			"Certificación energética",
			"Gestión de residuos de construcción"
		],
		defaultSettings: {
			phases: [
				"Estudios de factibilidad", 
				"Diseño arquitectónico", 
				"Estructura y cimentación", 
				"Instalaciones especializadas", 
				"Acabados comerciales",
				"Certificaciones y permisos"
			],
			materials: [
				"Acero estructural", 
				"Concreto de alta resistencia", 
				"Vidrio templado", 
				"Perfilería de aluminio", 
				"Sistemas HVAC",
				"Paneles de fachada",
				"Pisos técnicos",
				"Iluminación LED"
			],
			formulas: [
				"Análisis sísmico NEC", 
				"Cargas dinámicas comerciales", 
				"Eficiencia energética",
				"Cálculos de climatización",
				"Análisis de costos complejos"
			],
			teamRoles: [
				"Arquitecto comercial", 
				"Ingeniero estructural", 
				"Ingeniero eléctrico", 
				"Diseñador de interiores", 
				"Project Manager",
				"Especialista en HVAC",
				"Consultor en normativas"
			]
		}
	},
	{
		id: "electrical-systems",
		name: "Sistemas Eléctricos",
		description: "Diseño, instalación y certificación de sistemas eléctricos completos para proyectos de construcción de cualquier escala",
		icon: LightBulbIcon,
		category: "infrastructure",
		color: "from-yellow-500 to-orange-500",
		gradient: "bg-gradient-to-br from-yellow-50 to-orange-50",
		estimatedDuration: "3-6 meses",
		complexity: "intermediate",
		features: [
			"Cálculos de carga eléctrica completos",
			"Diseño de circuitos especializados",
			"Sistemas de iluminación eficiente",
			"Automatización y domótica",
			"Sistemas de respaldo (UPS)",
			"Certificaciones eléctricas"
		],
		defaultSettings: {
			phases: [
				"Análisis de cargas eléctricas", 
				"Diseño de circuitos", 
				"Instalación de redes", 
				"Pruebas y mediciones", 
				"Certificación eléctrica"
			],
			materials: [
				"Cable eléctrico THHN", 
				"Paneles de distribución", 
				"Interruptores termomagnéticos", 
				"Luminarias LED", 
				"Conduit metálico",
				"Tomacorrientes especializados",
				"Sistemas de puesta a tierra"
			],
			formulas: [
				"Cálculo de carga instalada", 
				"Caída de voltaje", 
				"Calibre de conductores",
				"Factor de potencia",
				"Análisis de cortocircuito"
			],
			teamRoles: [
				"Ingeniero eléctrico", 
				"Electricista especializado", 
				"Técnico instalador", 
				"Inspector eléctrico"
			]
		}
	},
	{
		id: "industrial-facility",
		name: "Instalación Industrial",
		description: "Construcción de facilidades industriales de gran escala con especificaciones técnicas avanzadas y sistemas especializados",
		icon: CogIcon,
		category: "industrial",
		color: "from-slate-500 to-gray-600",
		gradient: "bg-gradient-to-br from-slate-50 to-gray-50",
		estimatedDuration: "18-24 meses",
		complexity: "advanced",
		features: [
			"Estructuras de gran envergadura",
			"Sistemas mecánicos especializados",
			"Normativas industriales estrictas",
			"Sistemas de seguridad avanzados",
			"Gestión de residuos industriales",
			"Certificaciones ambientales"
		],
		defaultSettings: {
			phases: [
				"Estudios de impacto", 
				"Diseño industrial", 
				"Movimiento de tierras", 
				"Estructura metálica", 
				"Instalaciones industriales",
				"Equipamiento especializado"
			],
			materials: [
				"Acero industrial", 
				"Concreto reforzado", 
				"Materiales aislantes", 
				"Tuberías industriales", 
				"Equipos especializados",
				"Sistemas de ventilación",
				"Pisos industriales"
			],
			formulas: [
				"Análisis estructural avanzado", 
				"Cargas industriales", 
				"Sistemas mecánicos complejos",
				"Análisis de vibraciones",
				"Cálculos térmicos"
			],
			teamRoles: [
				"Ingeniero industrial", 
				"Ingeniero civil especializado", 
				"Especialista en sistemas", 
				"Supervisor de seguridad", 
				"Técnico especializado"
			]
		}
	},
	{
		id: "renovation-project",
		name: "Proyecto de Renovación",
		description: "Renovación integral de espacios existentes con enfoque en modernización, eficiencia y mantenimiento de estructuras",
		icon: ArchiveBoxIcon,
		category: "residential",
		color: "from-purple-500 to-pink-500",
		gradient: "bg-gradient-to-br from-purple-50 to-pink-50",
		estimatedDuration: "4-8 meses",
		complexity: "basic",
		features: [
			"Evaluación estructural existente",
			"Diseño de modernización",
			"Mantenimiento preventivo",
			"Mejoras estéticas y funcionales",
			"Eficiencia energética",
			"Gestión de residuos"
		],
		defaultSettings: {
			phases: [
				"Evaluación inicial", 
				"Diseño de renovación", 
				"Demolición selectiva", 
				"Reconstrucción", 
				"Acabados modernos"
			],
			materials: [
				"Materiales de acabado", 
				"Pintura especializada", 
				"Pisos laminados", 
				"Accesorios modernos",
				"Iluminación decorativa",
				"Herrajes actualizados"
			],
			formulas: [
				"Áreas de renovación", 
				"Costos de materiales", 
				"Análisis de espacios",
				"Estimación de tiempos"
			],
			teamRoles: [
				"Arquitecto renovador", 
				"Contratista especializado", 
				"Especialista en restauración", 
				"Pintor profesional"
			]
		}
	},
	{
		id: "research-facility",
		name: "Laboratorio de Investigación",
		description: "Construcción de facilidades especializadas para investigación científica y desarrollo tecnológico con ambientes controlados",
		icon: BeakerIcon,
		category: "commercial",
		color: "from-indigo-500 to-blue-600",
		gradient: "bg-gradient-to-br from-indigo-50 to-blue-50",
		estimatedDuration: "12-16 meses",
		complexity: "advanced",
		features: [
			"Ambientes controlados precisos",
			"Sistemas de aire especializado",
			"Seguridad de laboratorio avanzada",
			"Equipamiento técnico especializado",
			"Sistemas de emergencia",
			"Certificaciones internacionales"
		],
		defaultSettings: {
			phases: [
				"Estudios técnicos", 
				"Diseño especializado", 
				"Estructura reforzada", 
				"Instalaciones especiales", 
				"Equipamiento científico",
				"Certificaciones de seguridad"
			],
			materials: [
				"Materiales especiales", 
				"Sistemas HVAC de precisión", 
				"Equipos de laboratorio", 
				"Instrumentación científica",
				"Sistemas de seguridad",
				"Mobiliario especializado"
			],
			formulas: [
				"Análisis ambiental", 
				"Sistemas especializados", 
				"Cálculos de precisión",
				"Análisis de riesgos"
			],
			teamRoles: [
				"Arquitecto especializado", 
				"Ingeniero de sistemas", 
				"Técnico de laboratorio", 
				"Consultor en seguridad"
			]
		}
	},
	{
		id: "retail-store",
		name: "Tienda Comercial",
		description: "Diseño y construcción de espacios comerciales optimizados para venta retail con experiencia de cliente excepcional",
		icon: BuildingStorefrontIcon,
		category: "commercial",
		color: "from-rose-500 to-pink-500",
		gradient: "bg-gradient-to-br from-rose-50 to-pink-50",
		estimatedDuration: "6-10 meses",
		complexity: "intermediate",
		features: [
			"Diseño de experiencia de cliente",
			"Iluminación comercial especializada",
			"Sistemas de seguridad retail",
			"Espacios de almacenamiento",
			"Sistemas de punto de venta",
			"Accesibilidad comercial"
		],
		defaultSettings: {
			phases: [
				"Diseño conceptual", 
				"Estructura comercial", 
				"Instalaciones básicas", 
				"Diseño de interiores", 
				"Equipamiento comercial"
			],
			materials: [
				"Pisos comerciales", 
				"Iluminación LED", 
				"Sistemas de seguridad", 
				"Mobiliario comercial",
				"Señalética",
				"Sistemas de climatización"
			],
			formulas: [
				"Espacios comerciales", 
				"Iluminación retail", 
				"Flujo de clientes",
				"Análisis de costos comerciales"
			],
			teamRoles: [
				"Diseñador comercial", 
				"Contratista especializado", 
				"Especialista en retail", 
				"Técnico en seguridad"
			]
		}
	},
	{
		id: "infrastructure-project",
		name: "Proyecto de Infraestructura",
		description: "Desarrollo de infraestructura urbana incluyendo vías, puentes, sistemas de servicios públicos y obras civiles",
		icon: WrenchScrewdriverIcon,
		category: "infrastructure",
		color: "from-amber-500 to-yellow-500",
		gradient: "bg-gradient-to-br from-amber-50 to-yellow-50",
		estimatedDuration: "24-36 meses",
		complexity: "advanced",
		features: [
			"Diseño de infraestructura vial",
			"Sistemas de drenaje avanzados",
			"Estructuras de concreto",
			"Servicios públicos integrados",
			"Gestión ambiental",
			"Normativas gubernamentales"
		],
		defaultSettings: {
			phases: [
				"Estudios topográficos", 
				"Diseño de ingeniería", 
				"Movimiento de tierras", 
				"Obras civiles", 
				"Instalación de servicios",
				"Acabados y señalización"
			],
			materials: [
				"Concreto estructural", 
				"Acero de refuerzo", 
				"Materiales asfálticos", 
				"Tuberías de servicio",
				"Sistemas de drenaje",
				"Señalización vial"
			],
			formulas: [
				"Cálculos de tráfico", 
				"Diseño estructural", 
				"Hidráulica de drenajes",
				"Análisis geotécnico",
				"Costos de infraestructura"
			],
			teamRoles: [
				"Ingeniero civil", 
				"Topógrafo", 
				"Especialista vial", 
				"Supervisor de obra",
				"Técnico en servicios"
			]
		}
	}
];

// Funciones auxiliares para trabajar con las plantillas
export const getTemplateById = (id: string): ProjectTemplate | undefined => {
	return PROJECT_TEMPLATES.find(template => template.id === id);
};

export const getTemplatesByCategory = (category: string): ProjectTemplate[] => {
	if (category === "all") return PROJECT_TEMPLATES;
	return PROJECT_TEMPLATES.filter(template => template.category === category);
};

export const getTemplatesByComplexity = (complexity: string): ProjectTemplate[] => {
	return PROJECT_TEMPLATES.filter(template => template.complexity === complexity);
};

export const searchTemplates = (searchTerm: string): ProjectTemplate[] => {
	const term = searchTerm.toLowerCase();
	return PROJECT_TEMPLATES.filter(template => 
		template.name.toLowerCase().includes(term) ||
		template.description.toLowerCase().includes(term) ||
		template.features.some(feature => feature.toLowerCase().includes(term))
	);
};

export const getRecommendedTemplates = (userProfession?: string): ProjectTemplate[] => {
	// Lógica para recomendar plantillas basada en la profesión del usuario
	if (!userProfession) return PROJECT_TEMPLATES.slice(0, 3);
	
	const recommendations: Record<string, string[]> = {
		architect: ["residential-house", "commercial-building", "retail-store"],
		civil_engineer: ["infrastructure-project", "commercial-building", "industrial-facility"],
		electrician: ["electrical-systems", "commercial-building", "industrial-facility"],
		constructor: ["residential-house", "renovation-project", "retail-store"],
		contractor: ["renovation-project", "residential-house", "infrastructure-project"],
	};

	const recommendedIds = recommendations[userProfession] || [];
	return recommendedIds.map(id => getTemplateById(id)).filter(Boolean) as ProjectTemplate[];
};

export const getPopularTemplates = (): ProjectTemplate[] => {
	// Retornar las plantillas más populares (simulado)
	return [
		getTemplateById("residential-house"),
		getTemplateById("commercial-building"),
		getTemplateById("renovation-project"),
	].filter(Boolean) as ProjectTemplate[];
};