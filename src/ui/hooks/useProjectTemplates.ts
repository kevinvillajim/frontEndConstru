// src/ui/hooks/useProjectTemplates.ts
import { useState, useEffect } from "react";

export interface ProjectTemplate {
	id: string;
	name: string;
	description: string;
	icon: React.ComponentType<React.SVGProps<SVGSVGElement>>;
	category: "residential" | "commercial" | "industrial" | "infrastructure";
	color: string;
	gradient: string;
	estimatedDuration: string;
	complexity: "basic" | "intermediate" | "advanced";
	features: string[];
	defaultSettings: {
		phases: string[];
		materials: string[];
		formulas: string[];
		teamRoles: string[];
	};
}

export interface TemplateCustomization {
	projectName: string;
	clientName: string;
	location: string;
	startDate: string;
	endDate: string;
	budget: number;
	teamSize: number;
	priority: "low" | "medium" | "high";
	description?: string;
	selectedPhases: string[];
	selectedMaterials: string[];
	selectedFormulas: string[];
	selectedTeamRoles: string[];
	additionalFeatures: string[];
}

interface CreatedProject {
	id: string;
	name: string;
	template: string;
	status: 'planning';
	createdAt: string;
}

export const useProjectTemplates = () => {
	const [favorites, setFavorites] = useState<Set<string>>(new Set());
	const [isLoading, setIsLoading] = useState(false);

	// Cargar favoritos desde localStorage al montar el componente
	useEffect(() => {
		try {
			const savedFavorites = localStorage.getItem('project-template-favorites');
			if (savedFavorites) {
				const parsed = JSON.parse(savedFavorites);
				setFavorites(new Set(parsed));
			}
		} catch (error) {
			console.error('Error loading favorites from localStorage:', error);
		}
	}, []);

	// Guardar favoritos en localStorage cuando cambien
	useEffect(() => {
		try {
			localStorage.setItem('project-template-favorites', JSON.stringify([...favorites]));
		} catch (error) {
			console.error('Error saving favorites to localStorage:', error);
		}
	}, [favorites]);

	const toggleFavorite = (templateId: string) => {
		setFavorites(prev => {
			const newFavorites = new Set(prev);
			if (newFavorites.has(templateId)) {
				newFavorites.delete(templateId);
			} else {
				newFavorites.add(templateId);
			}
			return newFavorites;
		});
	};

	const isFavorite = (templateId: string) => favorites.has(templateId);

	const filterTemplates = (
		templates: ProjectTemplate[], 
		category: string, 
		searchTerm?: string
	) => {
		return templates.filter(template => {
			const matchesCategory = category === "all" || template.category === category;
			const matchesSearch = !searchTerm || 
				template.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
				template.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
				template.features.some(feature => 
					feature.toLowerCase().includes(searchTerm.toLowerCase())
				);
			
			return matchesCategory && matchesSearch;
		});
	};

	const getCategories = (templates: ProjectTemplate[]) => {
		return [
			{ id: "all", name: "Todos", count: templates.length },
			{
				id: "residential",
				name: "Residencial",
				count: templates.filter(t => t.category === "residential").length,
			},
			{
				id: "commercial",
				name: "Comercial",
				count: templates.filter(t => t.category === "commercial").length,
			},
			{
				id: "industrial",
				name: "Industrial",
				count: templates.filter(t => t.category === "industrial").length,
			},
			{
				id: "infrastructure",
				name: "Infraestructura",
				count: templates.filter(t => t.category === "infrastructure").length,
			},
		];
	};

	const createProjectFromTemplate = async (
		template: ProjectTemplate, 
		customization: TemplateCustomization
	): Promise<CreatedProject> => {
		setIsLoading(true);
		try {
			// Validar datos requeridos
			if (!customization.projectName?.trim()) {
				throw new Error('El nombre del proyecto es requerido');
			}
			if (!customization.clientName?.trim()) {
				throw new Error('El nombre del cliente es requerido');
			}
			if (!customization.location?.trim()) {
				throw new Error('La ubicación es requerida');
			}
			if (!customization.startDate) {
				throw new Error('La fecha de inicio es requerida');
			}
			if (!customization.endDate) {
				throw new Error('La fecha de finalización es requerida');
			}
			if (!customization.budget || customization.budget <= 0) {
				throw new Error('El presupuesto debe ser mayor a 0');
			}

			// Validar fechas
			const startDate = new Date(customization.startDate);
			const endDate = new Date(customization.endDate);
			if (endDate <= startDate) {
				throw new Error('La fecha de finalización debe ser posterior a la fecha de inicio');
			}

			// Aquí se haría la llamada a la API para crear el proyecto
			// const response = await api.post('/projects', {
			//   templateId: template.id,
			//   ...customization
			// });
			
			// Simular llamada API
			await new Promise(resolve => setTimeout(resolve, 2000));
			
			// Simular error ocasional para testing
			if (Math.random() < 0.1) {
				throw new Error('Error de conexión con el servidor');
			}
			
			// Retornar datos simulados del proyecto creado
			const newProject: CreatedProject = {
				id: `proj_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
				name: customization.projectName,
				template: template.id,
				status: 'planning',
				createdAt: new Date().toISOString(),
			};

			return newProject;
		} catch (error) {
			console.error('Error creating project:', error);
			throw error;
		} finally {
			setIsLoading(false);
		}
	};

	const getTemplatesByCategory = (templates: ProjectTemplate[], category: string) => {
		return filterTemplates(templates, category);
	};

	const searchTemplates = (templates: ProjectTemplate[], searchTerm: string) => {
		return filterTemplates(templates, "all", searchTerm);
	};

	const getRecommendedTemplates = (templates: ProjectTemplate[], userProfession?: string) => {
		// Lógica para recomendar plantillas basada en la profesión del usuario
		if (!userProfession) return templates.slice(0, 3);
		
		const recommendations: Record<string, string[]> = {
			architect: ["residential-house", "commercial-building", "retail-store"],
			civil_engineer: ["infrastructure-project", "commercial-building", "industrial-facility"],
			electrician: ["electrical-systems", "commercial-building", "industrial-facility"],
			constructor: ["residential-house", "renovation-project", "retail-store"],
			contractor: ["renovation-project", "residential-house", "infrastructure-project"],
		};

		const recommendedIds = recommendations[userProfession] || [];
		return templates.filter(template => recommendedIds.includes(template.id));
	};

	return {
		// Estado
		favorites,
		isLoading,
		
		// Funciones de favoritos
		toggleFavorite,
		isFavorite,
		
		// Funciones de filtrado y búsqueda
		filterTemplates,
		getCategories,
		getTemplatesByCategory,
		searchTemplates,
		getRecommendedTemplates,
		
		// Función principal
		createProjectFromTemplate,
	};
};