// src/ui/components/templates/CategoryFilter.tsx
import React from "react";
import { AdjustmentsHorizontalIcon } from "@heroicons/react/24/outline";

interface Category {
	id: string;
	name: string;
	count: number;
}

interface CategoryFilterProps {
	categories: Category[];
	selectedCategory: string;
	onCategoryChange: (categoryId: string) => void;
}

export const CategoryFilter: React.FC<CategoryFilterProps> = ({
	categories,
	selectedCategory,
	onCategoryChange,
}) => {
	return (
		<div className="mb-8">
			<div className="flex items-center gap-2 mb-4">
				<AdjustmentsHorizontalIcon className="h-5 w-5 text-gray-500" />
				<span className="text-sm font-medium text-gray-700">Categorías</span>
			</div>
			<div className="flex flex-wrap gap-3">
				{categories.map((category) => (
					<button
						key={category.id}
						onClick={() => onCategoryChange(category.id)}
						className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 border ${
							selectedCategory === category.id
								? "bg-primary-600 text-white border-primary-600 shadow-lg scale-105"
								: "bg-white text-gray-700 border-gray-200 hover:border-primary-300 hover:bg-primary-50"
						}`}
					>
						{category.name}
						<span
							className={`ml-2 px-2 py-0.5 rounded-full text-xs ${
								selectedCategory === category.id
									? "bg-white/20 text-white"
									: "bg-gray-100 text-gray-600"
							}`}
						>
							{category.count}
						</span>
					</button>
				))}
			</div>
		</div>
	);
};