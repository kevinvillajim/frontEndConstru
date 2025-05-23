import React from "react";
import {
	ChevronDownIcon,
	BuildingOffice2Icon,
	BoltIcon,
	AcademicCapIcon,
	BeakerIcon,
	WrenchScrewdriverIcon,
	CubeIcon,
} from "@heroicons/react/24/outline";
import type {TemplateCategory} from "../../shared/types/template.types";

interface CategoryFilterProps {
	categories: TemplateCategory[];
	selectedCategory: string | null;
	selectedSubcategory: string | null;
	onCategoryChange: (categoryId: string | null) => void;
	onSubcategoryChange: (subcategoryId: string | null) => void;
	showCounts?: boolean;
}

// Configuración de iconos por categoría
const CATEGORY_ICONS: {[key: string]: React.ComponentType<any>} = {
	structural: BuildingOffice2Icon,
	electrical: BoltIcon,
	architectural: AcademicCapIcon,
	hydraulic: BeakerIcon,
	mechanical: WrenchScrewdriverIcon,
	geotechnical: CubeIcon,
};

export const CategoryFilter: React.FC<CategoryFilterProps> = ({
	categories,
	selectedCategory,
	selectedSubcategory,
	onCategoryChange,
	onSubcategoryChange,
	showCounts = true,
}) => {
	const handleCategoryClick = (categoryId: string) => {
		if (selectedCategory === categoryId) {
			// Si la categoría ya está seleccionada, deseleccionar
			onCategoryChange(null);
			onSubcategoryChange(null);
		} else {
			// Seleccionar nueva categoría y limpiar subcategoría
			onCategoryChange(categoryId);
			onSubcategoryChange(null);
		}
	};

	const handleSubcategoryClick = (subcategoryId: string) => {
		if (selectedSubcategory === subcategoryId) {
			// Si la subcategoría ya está seleccionada, deseleccionar
			onSubcategoryChange(null);
		} else {
			// Seleccionar nueva subcategoría
			onSubcategoryChange(subcategoryId);
		}
	};

	return (
		<div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
			<div className="flex items-center justify-between mb-4">
				<h3 className="text-lg font-semibold text-gray-900">Especialidades</h3>
				{selectedCategory && (
					<button
						onClick={() => {
							onCategoryChange(null);
							onSubcategoryChange(null);
						}}
						className="text-xs text-primary-600 hover:text-primary-700 font-medium"
					>
						Limpiar
					</button>
				)}
			</div>

			<div className="space-y-1">
				{categories.map((category) => {
					const isSelected = selectedCategory === category.id;
					const Icon = CATEGORY_ICONS[category.id] || BuildingOffice2Icon;

					return (
						<div key={category.id} className="space-y-1">
							{/* Categoría principal */}
							<button
								onClick={() => handleCategoryClick(category.id)}
								className={`w-full flex items-center justify-between p-3 rounded-xl transition-all duration-200 text-left ${
									isSelected
										? `${category.color} shadow-sm`
										: "hover:bg-gray-50 text-gray-700"
								}`}
							>
								<div className="flex items-center gap-3">
									<Icon className="h-5 w-5 flex-shrink-0" />
									<div>
										<span className="font-medium block">{category.name}</span>
										{category.description && (
											<span className="text-xs text-gray-500 block">
												{category.description}
											</span>
										)}
									</div>
								</div>
								<div className="flex items-center gap-2">
									{showCounts && (
										<span className="text-xs px-2 py-0.5 bg-white bg-opacity-70 rounded-full font-medium">
											{category.count}
										</span>
									)}
									<ChevronDownIcon
										className={`h-4 w-4 transition-transform duration-200 ${
											isSelected ? "rotate-180" : ""
										}`}
									/>
								</div>
							</button>

							{/* Subcategorías */}
							{isSelected &&
								category.subcategories &&
								category.subcategories.length > 0 && (
									<div className="ml-8 space-y-1 pb-2">
										{category.subcategories.map((subcategory) => {
											const isSubSelected =
												selectedSubcategory === subcategory.id;

											return (
												<button
													key={subcategory.id}
													onClick={() => handleSubcategoryClick(subcategory.id)}
													className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-all duration-200 ${
														isSubSelected
															? "bg-primary-100 text-primary-700 font-medium shadow-sm"
															: "text-gray-600 hover:bg-gray-100 hover:text-gray-900"
													}`}
												>
													<div className="flex items-center justify-between">
														<span>{subcategory.name}</span>
														{showCounts && (
															<span className="text-xs text-gray-500 font-normal">
																({subcategory.count})
															</span>
														)}
													</div>
													{subcategory.description && (
														<div className="text-xs text-gray-500 mt-1">
															{subcategory.description}
														</div>
													)}
												</button>
											);
										})}
									</div>
								)}
						</div>
					);
				})}
			</div>

			{/* Botón para mostrar todas las categorías */}
			<div className="border-t border-gray-100 mt-4 pt-4">
				<button
					onClick={() => {
						onCategoryChange(null);
						onSubcategoryChange(null);
					}}
					className={`w-full flex items-center justify-center gap-2 p-3 rounded-xl text-sm font-medium transition-all duration-200 ${
						!selectedCategory
							? "bg-primary-50 text-primary-700 border border-primary-200"
							: "text-gray-600 hover:bg-gray-50"
					}`}
				>
					<span>Ver Todas las Especialidades</span>
					{showCounts && (
						<span className="text-xs px-2 py-0.5 bg-white bg-opacity-70 rounded-full">
							{categories.reduce((sum, cat) => sum + cat.count, 0)}
						</span>
					)}
				</button>
			</div>

			{/* Indicador de filtros activos */}
			{(selectedCategory || selectedSubcategory) && (
				<div className="mt-4 p-3 bg-blue-50 rounded-lg">
					<div className="flex items-center justify-between">
						<div className="text-sm">
							<span className="text-blue-700 font-medium">
								Filtros activos:
							</span>
							<div className="text-blue-600 text-xs mt-1">
								{selectedCategory && (
									<span>
										{categories.find((c) => c.id === selectedCategory)?.name}
									</span>
								)}
								{selectedSubcategory && (
									<span>
										{" > "}
										{
											categories
												.find((c) => c.id === selectedCategory)
												?.subcategories?.find(
													(s) => s.id === selectedSubcategory
												)?.name
										}
									</span>
								)}
							</div>
						</div>
						<button
							onClick={() => {
								onCategoryChange(null);
								onSubcategoryChange(null);
							}}
							className="text-blue-600 hover:text-blue-700 text-xs font-medium"
						>
							Limpiar
						</button>
					</div>
				</div>
			)}
		</div>
	);
};
