import React from "react";
import {ArrowUpIcon, ArrowDownIcon} from "@heroicons/react/24/outline";
import type {CalculationResult} from "../../shared/hooks/useComparison";

interface ComparisonTableProps {
	calculations: CalculationResult[];
	title: string;
	icon: React.ComponentType<{className?: string}>;
	dataType: "parameters" | "results";
	compareValues: (
		values: Array<string | number>
	) => Array<"highest" | "lowest" | "equal">;
}

const ComparisonTable: React.FC<ComparisonTableProps> = ({
	calculations,
	title,
	icon: Icon,
	dataType,
	compareValues,
}) => {
	if (calculations.length < 2) return null;

	// Obtener todas las claves de parámetros o resultados
	const allKeys = Array.from(
		new Set(
			calculations.flatMap((calc) => {
				if (dataType === "parameters") {
					return Object.keys(calc.parameters);
				} else {
					return calc.results.secondary.map((result) => result.label);
				}
			})
		)
	);

	// Si no hay parámetros o resultados comparables, no mostrar la tabla
	if (allKeys.length === 0) return null;

	return (
		<div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 mb-8">
			<h3 className="text-xl font-semibold text-gray-900 mb-6 flex items-center gap-2">
				<Icon className="h-6 w-6 text-primary-600" />
				{title}
			</h3>

			<div className="overflow-x-auto">
				<table className="w-full">
					<thead>
						<tr className="border-b border-gray-200">
							<th className="text-left py-3 px-4 font-medium text-gray-900">
								{dataType === "parameters" ? "Parámetro" : "Métrica"}
							</th>
							{calculations.map((calc, index) => (
								<th
									key={calc.id}
									className="text-center py-3 px-4 font-medium text-gray-900"
								>
									Cálculo {index + 1}
								</th>
							))}
						</tr>
					</thead>
					<tbody>
						{allKeys.map((key) => {
							// Obtener valores para comparar
							const values = calculations.map((calc) => {
								if (dataType === "parameters") {
									return calc.parameters[key]?.value || "-";
								} else {
									const result = calc.results.secondary.find(
										(r) => r.label === key
									);
									return result?.value || "-";
								}
							});

							// Comparar valores (solo para valores que no son "-")
							const comparisons = compareValues(
								values.filter((v) => v !== "-")
							);

							return (
								<tr
									key={key}
									className="border-b border-gray-100 hover:bg-gray-50"
								>
									<td className="py-3 px-4 font-medium text-gray-700">
										{dataType === "parameters"
											? calculations.find((calc) => calc.parameters[key])
													?.parameters[key]?.label || key
											: key}
									</td>

									{calculations.map((calc, index) => {
										const data =
											dataType === "parameters"
												? calc.parameters[key]
												: calc.results.secondary.find((r) => r.label === key);

										const comparison = comparisons[index];
										const isHighest = comparison === "highest";
										const isLowest = comparison === "lowest";

										return (
											<td
												key={`${calc.id}-${key}`}
												className="text-center py-3 px-4"
											>
												{data ? (
													<div
														className={`flex items-center justify-center gap-1 ${
															isHighest
																? "text-green-600"
																: isLowest
																	? "text-red-600"
																	: "text-gray-700"
														}`}
													>
														<span className="font-medium">
															{dataType === "parameters"
																? data.value
																: data.value}{" "}
															{dataType === "parameters"
																? data.unit || ""
																: data.unit || ""}
														</span>
														{isHighest && <ArrowUpIcon className="h-4 w-4" />}
														{isLowest && <ArrowDownIcon className="h-4 w-4" />}
													</div>
												) : (
													<span className="text-gray-400">-</span>
												)}
											</td>
										);
									})}
								</tr>
							);
						})}
					</tbody>
				</table>
			</div>
		</div>
	);
};

export default ComparisonTable;
