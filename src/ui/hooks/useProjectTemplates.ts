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

export const useProjectTemplates = () => {
	const [favorites, setFavorites] = useState<Set<string>>(new Set());
	const [isLoading, setIsLoading] = useState(false);

	// Cargar favoritos desde localStorage
	useEffect(() => {
		const savedFavorites = localStorage.getItem('project-template-favorites');
		if (savedFavorites) {
			try {
				const parsed = JSON.parse(savedFavorites);
				setFavorites(new Set(parsed));
			} catch (error) {
				console.error('Error loading favorites:', error);
			}
		}
	}, []);

	// Guardar favoritos en localStorage
	useEffect(() => {
		localStorage.setItem('project-template-favorites', JSON.stringify([...favorites]));
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
	) => {
		setIsLoading(true);
		try {
			// Aquí se haría la llamada a la API para crear el proyecto
			// const response = await api.post('/projects', {
			//   templateId: template.id,
			//   ...customization
			// });
			
			// Simular llamada API
			await new Promise(resolve => setTimeout(resolve, 1500));
			
			// Retornar datos simulados del proyecto creado
			return {
				id: `proj_${Date.now()}`,
				name: customization.projectName,
				template: template.id,
				status: 'planning' as const,
				createdAt: new Date().toISOString(),
			};
		} catch (error) {
			console.error('Error creating project:', error);
			throw error;
		} finally {
			setIsLoading(false);
		}
	};

	return {
		favorites,
		toggleFavorite,
		isFavorite,
		filterTemplates,
		getCategories,
		createProjectFromTemplate,
		isLoading,
	};
};