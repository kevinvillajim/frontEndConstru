/* eslint-disable @typescript-eslint/no-explicit-any */
import React from "react";
import type {CalculationResult} from "../../shared/hooks/useComparison";
import {
	BarChart,
	Bar,
	XAxis,
	YAxis,
	CartesianGrid,
	Tooltip,
	Legend,
	ResponsiveContainer,
} from "recharts";
import {ChartBarIcon} from "@heroicons/react/24/outline";

interface ResultsChartProps {
	calculations: CalculationResult[];
	compareValues: (
		values: Array<string | number>
	) => Array<"highest" | "lowest" | "equal">;
}

const ResultsChart: React.FC<ResultsChartProps> = ({
	calculations,
	compareValues,
}) => {
	if (calculations.length < 2) return null;

	// Verificar si todos los resultados tienen la misma unidad
	const allSameUnit = calculations.every(
		(calc) => calc.results.primary.unit === calculations[0].results.primary.unit
	);

	// Si no todos tienen la misma unidad, no podemos comparar gráficamente
	if (!allSameUnit) {
		return (
			<div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 mb-8">
				<h3 className="text-xl font-semibold text-gray-900 mb-6 flex items-center gap-2">
					<ChartBarIcon className="h-6 w-6 text-primary-600" />
					Comparación Gráfica
				</h3>
				<div className="text-center py-6 text-gray-600">
					No se puede generar gráfico comparativo porque los resultados tienen
					diferentes unidades.
				</div>
			</div>
		);
	}

	// Obtener valores numéricos para la comparación
	const primaryValues = calculations.map((calc) => {
		const valueStr = calc.results.primary.value;
		// Convertir a número, eliminando cualquier carácter no numérico (como comas, espacios, etc.)
		return {
			name:
				calc.name.length > 20 ? calc.name.substring(0, 20) + "..." : calc.name,
			value: parseFloat(valueStr.replace(/[^0-9.-]/g, "")),
			fullName: calc.name,
		};
	});

	// Determinar comparaciones (qué valor es el más alto, el más bajo, etc.)
	const comparisons = compareValues(primaryValues.map((item) => item.value));

	// Preparar datos para el gráfico
	const chartData = primaryValues.map((item, index) => ({
		name: `Cálculo ${index + 1}`,
		fullName: item.fullName,
		value: item.value,
		comparison: comparisons[index],
	}));

	// Colores para las barras según la comparación
	const getBarColor = (entry: any) => {
		if (entry.comparison === "highest") return "#10B981"; // Verde para el más alto
		if (entry.comparison === "lowest") return "#EF4444"; // Rojo para el más bajo
		return "#6366F1"; // Púrpura para valor intermedio
	};

	// Formatear el tooltip
	// eslint-disable-next-line @typescript-eslint/no-unused-vars
	const CustomTooltip = ({active, payload, label}: any) => {
		if (active && payload && payload.length) {
			return (
				<div className="bg-white p-3 shadow-lg rounded-lg border border-gray-200">
					<p className="font-semibold text-gray-900">
						{payload[0].payload.fullName}
					</p>
					<p className="text-gray-600">
						Valor:{" "}
						<span className="font-medium">
							{payload[0].value} {calculations[0].results.primary.unit}
						</span>
					</p>
				</div>
			);
		}
		return null;
	};

	return (
		<div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 mb-8">
			<h3 className="text-xl font-semibold text-gray-900 mb-6 flex items-center gap-2">
				<ChartBarIcon className="h-6 w-6 text-primary-600" />
				Comparación Gráfica: {calculations[0].results.primary.label}
			</h3>

			<div className="h-80">
				<ResponsiveContainer width="100%" height="100%">
					<BarChart
						data={chartData}
						margin={{top: 20, right: 30, left: 20, bottom: 60}}
					>
						<CartesianGrid strokeDasharray="3 3" />
						<XAxis
							dataKey="name"
							angle={-45}
							textAnchor="end"
							height={60}
							tick={{fontSize: 12}}
						/>
						<YAxis
							label={{
								value: calculations[0].results.primary.unit,
								angle: -90,
								position: "insideLeft",
								style: {textAnchor: "middle"},
							}}
						/>
						<Tooltip content={<CustomTooltip />} />
						<Legend />
						<Bar
							dataKey="value"
							name={calculations[0].results.primary.label}
							fill="#6366F1"
							shape={(props: any) => {
								return (
									<rect
										{...props}
										fill={getBarColor(props.payload)}
										rx={4}
										ry={4}
									/>
								);
							}}
						/>
					</BarChart>
				</ResponsiveContainer>
			</div>

			<div className="flex justify-center gap-4 mt-4">
				<div className="flex items-center gap-1">
					<div className="w-3 h-3 rounded-full bg-green-500"></div>
					<span className="text-xs text-gray-600">Valor más alto</span>
				</div>
				<div className="flex items-center gap-1">
					<div className="w-3 h-3 rounded-full bg-red-500"></div>
					<span className="text-xs text-gray-600">Valor más bajo</span>
				</div>
				<div className="flex items-center gap-1">
					<div className="w-3 h-3 rounded-full bg-primary-500"></div>
					<span className="text-xs text-gray-600">Valor intermedio</span>
				</div>
			</div>
		</div>
	);
};

export default ResultsChart;
