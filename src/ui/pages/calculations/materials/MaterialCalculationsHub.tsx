// src/ui/pages/calculations/materials/MaterialCalculationsHub.tsx

import React, { useState, useEffect } from 'react';
import { MaterialCalculationType, MATERIAL_CATEGORIES, MATERIAL_UI_CONFIG } from '../shared/types/material.types';
import type { MaterialCalculationTemplate } from '../shared/types/material.types';
import { useMaterialTemplates, useMaterialTrending } from '../shared/hooks/useMaterialCalculations';

interface MaterialCalculationsHubProps {
  onNavigate: (state: { type: string; payload?: Record<string, unknown> }) => void;
  onTemplateSelect: (template: MaterialCalculationTemplate) => void;
}

const MaterialCalculationsHub: React.FC<MaterialCalculationsHubProps> = ({
  onNavigate,
  onTemplateSelect
}) => {
	const [selectedCategory, setSelectedCategory] =
		useState<MaterialCalculationType | null>(null);
	// fetchTemplates | abajo
	const {getFeaturedTemplates} = useMaterialTemplates();
	const {fetchTrending} = useMaterialTrending();

	useEffect(() => {
		// Cargar datos iniciales
		getFeaturedTemplates();
		fetchTrending("weekly", undefined, 5);
	}, [getFeaturedTemplates, fetchTrending]);

	const MaterialCategoryCard: React.FC<{
		category: MaterialCalculationType;
		isSelected: boolean;
		onClick: () => void;
	}> = ({category, isSelected, onClick}) => {
		const config = MATERIAL_CATEGORIES[category];

		return (
			<div
				onClick={onClick}
				className={`
          group cursor-pointer rounded-xl p-6 border-2 transition-all duration-300
          ${
						isSelected
							? "border-blue-500 bg-blue-50 dark:bg-blue-900/20 shadow-lg scale-105"
							: "border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 hover:border-blue-300 hover:shadow-md"
					}
          ${MATERIAL_UI_CONFIG.cardHover}
        `}
			>
				<div className="flex items-start space-x-4">
					<div
						className={`
            text-3xl p-3 rounded-lg ${config.color} bg-opacity-20 group-hover:bg-opacity-30 transition-all
          `}
					>
						{config.icon}
					</div>

					<div className="flex-1">
						<h3 className="font-semibold text-gray-900 dark:text-white text-lg mb-2">
							{config.name}
						</h3>
						<p className="text-gray-600 dark:text-gray-300 text-sm mb-3">
							{config.description}
						</p>

						<div className="flex flex-wrap gap-2">
							{config.subCategories.slice(0, 3).map((sub, index) => (
								<span
									key={index}
									className="px-2 py-1 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 text-xs rounded-full"
								>
									{sub}
								</span>
							))}
							{config.subCategories.length > 3 && (
								<span className="px-2 py-1 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 text-xs rounded-full">
									+{config.subCategories.length - 3} más
								</span>
							)}
						</div>
					</div>

					<div className="flex flex-col items-center space-y-2">
						<div className="text-xs text-gray-500 dark:text-gray-400">
							{Math.floor(Math.random() * 50) + 10} plantillas
						</div>
						<div className="w-6 h-6 rounded-full bg-green-100 dark:bg-green-900 flex items-center justify-center">
							<span className="text-green-600 dark:text-green-400 text-xs">
								✓
							</span>
						</div>
					</div>
				</div>
			</div>
		);
	};

	const QuickActionCard: React.FC<{
		title: string;
		description: string;
		icon: string;
		color: string;
		onClick: () => void;
	}> = ({title, description, icon, color, onClick}) => (
		<div
			onClick={onClick}
			className={`
        group cursor-pointer p-6 rounded-xl bg-gradient-to-br ${color} text-white
        ${MATERIAL_UI_CONFIG.cardHover} ${MATERIAL_UI_CONFIG.defaultTransition}
      `}
		>
			<div className="flex items-center space-x-4">
				<div className="text-3xl opacity-90 group-hover:opacity-100 transition-opacity">
					{icon}
				</div>
				<div>
					<h3 className="font-semibold text-lg mb-1">{title}</h3>
					<p className="text-white/80 text-sm">{description}</p>
				</div>
				<div className="ml-auto text-white/60 group-hover:text-white transition-colors">
					→
				</div>
			</div>
		</div>
	);

	return (
		<div className="min-h-screen bg-gray-50 dark:bg-gray-900">
			{/* Header */}
			<div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
				<div className="max-w-7xl mx-auto px-4 py-6">
					<div className="flex items-center justify-between">
						<div>
							<h1 className="text-3xl font-bold text-gray-900 dark:text-white">
								Cálculos de Materiales
							</h1>
							<p className="text-gray-600 dark:text-gray-300 mt-2">
								Herramientas profesionales para cálculo preciso de materiales de
								construcción
							</p>
						</div>

						<div className="flex items-center space-x-4">
							<button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
								Nueva Plantilla
							</button>
							<button className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
								Importar
							</button>
						</div>
					</div>
				</div>
			</div>

			{/* Navegación de pestañas */}
			<div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
				<div className="max-w-7xl mx-auto px-4">
					<div className="flex space-x-8 overflow-x-auto">
						{[
							{
								id: "catalog",
								label: "Catálogo",
								icon: "📚",
								description: "Explora plantillas verificadas",
							},
							{
								id: "templates",
								label: "Mis Plantillas",
								icon: "📝",
								description: "Gestiona tus plantillas",
							},
							{
								id: "trending",
								label: "Tendencias",
								icon: "📈",
								description: "Descubre populares",
							},
							{
								id: "results",
								label: "Resultados",
								icon: "📊",
								description: "Revisa tus cálculos",
							},
						].map((tab) => (
							<button
								key={tab.id}
								onClick={() => onNavigate({type: tab.id})}
								className="flex items-center space-x-2 py-4 px-2 border-b-2 border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 whitespace-nowrap font-medium transition-colors"
							>
								<span className="text-lg">{tab.icon}</span>
								<span>{tab.label}</span>
							</button>
						))}
					</div>
				</div>
			</div>

			{/* Contenido principal */}
			<div className="max-w-7xl mx-auto px-4 py-8">
				<div className="space-y-8">
					{/* Acciones rápidas */}
					<div className="grid grid-cols-1 md:grid-cols-3 gap-6">
						<QuickActionCard
							title="Cálculo Rápido"
							description="Inicia un cálculo con plantillas populares"
							icon="⚡"
							color="from-blue-500 to-blue-600"
							onClick={() => onNavigate({type: "catalog"})}
						/>
						<QuickActionCard
							title="Plantillas Trending"
							description="Descubre los cálculos más utilizados"
							icon="🔥"
							color="from-orange-500 to-red-500"
							onClick={() => onNavigate({type: "trending"})}
						/>
						<QuickActionCard
							title="Mis Resultados"
							description="Revisa tus cálculos anteriores"
							icon="📈"
							color="from-green-500 to-emerald-600"
							onClick={() => onNavigate({type: "results"})}
						/>
					</div>

					{/* Categorías de materiales */}
					<div>
						<div className="flex items-center justify-between mb-6">
							<h2 className="text-2xl font-bold text-gray-900 dark:text-white">
								Categorías de Materiales
							</h2>
							<div className="text-sm text-gray-500 dark:text-gray-400">
								Selecciona una categoría para ver plantillas específicas
							</div>
						</div>

						<div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
							{Object.values(MaterialCalculationType).map((category) => (
								<MaterialCategoryCard
									key={category}
									category={category}
									isSelected={selectedCategory === category}
									onClick={() =>
										setSelectedCategory(
											selectedCategory === category ? null : category
										)
									}
								/>
							))}
						</div>
					</div>

					{/* Plantillas destacadas */}
					<div>
						<h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
							Plantillas Destacadas
						</h2>

						<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
							{[1, 2, 3, 4, 5, 6].map((item) => (
								<div
									key={item}
									className={`
                      p-6 bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700
                      ${MATERIAL_UI_CONFIG.cardHover} ${MATERIAL_UI_CONFIG.defaultTransition}
                    `}
								>
									<div className="flex items-start justify-between mb-4">
										<div className="flex items-center space-x-3">
											<div className="w-10 h-10 bg-blue-100 dark:bg-blue-900 rounded-lg flex items-center justify-center">
												<span className="text-blue-600 dark:text-blue-400">
													🧱
												</span>
											</div>
											<div>
												<h3 className="font-semibold text-gray-900 dark:text-white">
													Pared de Ladrillo
												</h3>
												<p className="text-xs text-gray-500 dark:text-gray-400">
													por Ing. Juan Pérez
												</p>
											</div>
										</div>
										<div className="flex items-center space-x-1">
											<span className="text-yellow-400">★</span>
											<span className="text-sm text-gray-600 dark:text-gray-300">
												4.8
											</span>
										</div>
									</div>

									<p className="text-gray-600 dark:text-gray-300 text-sm mb-4">
										Cálculo completo para pared de ladrillo King Kong incluyendo
										mortero, enlucido y pintura.
									</p>

									<div className="flex items-center justify-between">
										<div className="flex items-center space-x-2 text-xs text-gray-500 dark:text-gray-400">
											<span>👥 {Math.floor(Math.random() * 100) + 50}</span>
											<span>•</span>
											<span>
												📊 {Math.floor(Math.random() * 500) + 100} usos
											</span>
										</div>
										<button className="px-3 py-1 bg-blue-600 text-white text-xs rounded-md hover:bg-blue-700 transition-colors">
											Usar
										</button>
									</div>
								</div>
							))}
						</div>
					</div>
				</div>

				{/* Plantillas destacadas */}
				<div>
					<h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
						Plantillas Destacadas
					</h2>

					<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
						{[
							{
								id: "1",
								name: "Pared de Ladrillo King Kong",
								description:
									"Cálculo completo para pared de ladrillo King Kong incluyendo mortero, enlucido y pintura.",
								author: "Ing. Juan Pérez",
								rating: 4.8,
								usage: 156,
								type: MaterialCalculationType.WALLS_MASONRY,
							},
							{
								id: "2",
								name: "Escalera de Hormigón",
								description:
									"Cálculo de materiales para escalera de hormigón armado con acabados.",
								author: "Arq. María López",
								rating: 4.6,
								usage: 89,
								type: MaterialCalculationType.STAIRS,
							},
							{
								id: "3",
								name: "Piso Cerámico 60x60",
								description:
									"Cálculo de cerámicos grandes con adhesivo especial y fragüe.",
								author: "Tec. Carlos Silva",
								rating: 4.4,
								usage: 234,
								type: MaterialCalculationType.CERAMIC_FINISHES,
							},
							{
								id: "4",
								name: "Contrapiso Reforzado",
								description: "Contrapiso con malla electrosoldada y aditivos.",
								author: "Ing. Ana Torres",
								rating: 4.7,
								usage: 67,
								type: MaterialCalculationType.SUBFLOORS,
							},
							{
								id: "5",
								name: "Instalación Eléctrica Básica",
								description:
									"Cálculo de cables y accesorios para instalación residencial.",
								author: "Elec. Pedro Ruiz",
								rating: 4.5,
								usage: 145,
								type: MaterialCalculationType.ELECTRICAL_INSTALLATIONS,
							},
							{
								id: "6",
								name: "Mueble de Cocina Modular",
								description:
									"Melamina y herrajes para muebles de cocina estándar.",
								author: "Carp. Luis Morales",
								rating: 4.3,
								usage: 78,
								type: MaterialCalculationType.MELAMINE_FURNITURE,
							},
						].map((template) => {
							const categoryConfig = MATERIAL_CATEGORIES[template.type];
							return (
								<div
									key={template.id}
									className={`
                      p-6 bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700
                      ${MATERIAL_UI_CONFIG.cardHover} ${MATERIAL_UI_CONFIG.defaultTransition}
                      cursor-pointer
                    `}
									onClick={() => {
										// Simular selección de plantilla
										const mockTemplate: MaterialCalculationTemplate = {
											id: template.id,
											name: template.name,
											description: template.description,
											type: template.type,
											formula: "",
											parameters: [],
											isActive: true,
											isVerified: true,
											isFeatured: true,
											usageCount: template.usage,
											averageRating: template.rating,
											ratingCount: Math.floor(template.usage * 0.3),
											author: {
												id: template.id,
												name: template.author,
												profession: "Profesional",
											},
											createdAt: "2024-01-01T00:00:00Z",
											updatedAt: "2024-01-15T00:00:00Z",
										};
										onTemplateSelect(mockTemplate);
									}}
								>
									<div className="flex items-start justify-between mb-4">
										<div className="flex items-center space-x-3">
											<div
												className={`
                          w-10 h-10 rounded-lg flex items-center justify-center
                          ${categoryConfig.color} bg-opacity-20
                        `}
											>
												<span className="text-xl">{categoryConfig.icon}</span>
											</div>
											<div>
												<h3 className="font-semibold text-gray-900 dark:text-white">
													{template.name}
												</h3>
												<p className="text-xs text-gray-500 dark:text-gray-400">
													por {template.author}
												</p>
											</div>
										</div>
										<div className="flex items-center space-x-1">
											<span className="text-yellow-400">★</span>
											<span className="text-sm text-gray-600 dark:text-gray-300">
												{template.rating}
											</span>
										</div>
									</div>

									<p className="text-gray-600 dark:text-gray-300 text-sm mb-4 line-clamp-2">
										{template.description}
									</p>

									<div className="flex items-center justify-between">
										<div className="flex items-center space-x-2 text-xs text-gray-500 dark:text-gray-400">
											<span>👥 {template.usage}</span>
											<span>•</span>
											<span>📊 {Math.floor(template.usage * 1.5)} usos</span>
										</div>
										<button className="px-3 py-1 bg-blue-600 text-white text-xs rounded-md hover:bg-blue-700 transition-colors">
											Usar
										</button>
									</div>
								</div>
							);
						})}
					</div>
				</div>
			</div>
		</div>
	);
};

export default MaterialCalculationsHub;