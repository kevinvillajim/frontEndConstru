// src/ui/components/templates/ToggleButton.tsx
import React from "react";
import { CheckIcon } from "@heroicons/react/24/outline";

interface ToggleButtonProps {
	isSelected: boolean;
	onToggle: () => void;
	children: React.ReactNode;
	icon?: React.ReactNode;
}

export const ToggleButton: React.FC<ToggleButtonProps> = ({
	isSelected,
	onToggle,
	children,
	icon,
}) => {
	return (
		<button
			type="button"
			onClick={onToggle}
			className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200 border ${
				isSelected
					? "bg-primary-50 text-primary-700 border-primary-200 shadow-sm"
					: "bg-white text-gray-700 border-gray-200 hover:border-primary-200 hover:bg-primary-25"
			}`}
		>
			{icon && (
				<div className={`w-4 h-4 ${isSelected ? "text-primary-600" : "text-gray-400"}`}>
					{icon}
				</div>
			)}
			{children}
			{isSelected && <CheckIcon className="w-4 h-4 text-primary-600" />}
		</button>
	);
};