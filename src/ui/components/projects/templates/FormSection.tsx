// src/ui/components/templates/FormSection.tsx
import React from "react";

interface FormSectionProps {
	title: string;
	description: string;
	icon: React.ReactNode;
	children: React.ReactNode;
	delay?: string;
}

export const FormSection: React.FC<FormSectionProps> = ({
	title,
	description,
	icon,
	children,
	delay = "0s",
}) => {
	return (
		<div 
			className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8 animate-fade-in"
			style={{ animationDelay: delay }}
		>
			<div className="flex items-center gap-3 mb-6">
				<div className="h-10 w-10 bg-primary-100 rounded-lg flex items-center justify-center">
					{icon}
				</div>
				<div>
					<h3 className="text-xl font-semibold text-gray-900">{title}</h3>
					<p className="text-sm text-gray-600">{description}</p>
				</div>
			</div>
			{children}
		</div>
	);
};