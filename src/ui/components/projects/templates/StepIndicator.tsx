// src/ui/components/templates/StepIndicator.tsx
import React from "react";
import { CheckIcon, ChevronRightIcon } from "@heroicons/react/24/outline";

interface StepIndicatorProps {
	steps: string[];
	currentStep: string;
	onStepClick?: (step: string) => void;
}

export const StepIndicator: React.FC<StepIndicatorProps> = ({
	steps,
	currentStep,
	onStepClick,
}) => {
	const currentIndex = steps.indexOf(currentStep);

	return (
		<div className="flex items-center gap-3">
			{steps.map((step, index) => {
				const isActive = step === currentStep;
				const isCompleted = index < currentIndex;
				const isClickable = onStepClick && index <= currentIndex;

				return (
					<div key={step} className="flex items-center">
						<button
							onClick={() => isClickable && onStepClick(step)}
							disabled={!isClickable}
							className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium transition-all duration-300 ${
								isActive
									? 'bg-primary-600 text-white scale-110'
									: isCompleted
									? 'bg-primary-100 text-primary-600 hover:bg-primary-200'
									: 'bg-gray-200 text-gray-500'
							} ${isClickable ? 'cursor-pointer' : 'cursor-not-allowed'}`}
						>
							{isCompleted ? (
								<CheckIcon className="h-4 w-4" />
							) : (
								<span>{index + 1}</span>
							)}
						</button>
						{index < steps.length - 1 && (
							<ChevronRightIcon className={`h-4 w-4 mx-2 transition-colors duration-300 ${
								isCompleted ? 'text-primary-600' : 'text-gray-400'
							}`} />
						)}
					</div>
				);
			})}
		</div>
	);
};