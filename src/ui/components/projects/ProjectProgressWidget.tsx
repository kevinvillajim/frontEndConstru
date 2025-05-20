import React, {useState, useEffect} from "react";
import {
	ChartBarIcon,
	ClockIcon,
	CalendarIcon,
	ExclamationTriangleIcon,
	CheckCircleIcon,
	TrendingUpIcon,
	TrendingDownIcon,
} from "@heroicons/react/24/outline";

interface ProgressData {
	currentProgress: number;
	targetProgress: number;
	dailyProgress: number;
	weeklyProgress: number;
	tasksCompleted: number;
	totalTasks: number;
	estimatedDaysRemaining: number;
	status: "on_track" | "ahead" | "behind" | "critical";
	lastUpdated: string;
}

interface ProjectProgressWidgetProps {
	projectId: string;
	className?: string;
}

// Mock data - En producción vendría de la API en tiempo real
const mockProgressData: ProgressData = {
	currentProgress: 65,
	targetProgress: 68,
	dailyProgress: 1.2,
	weeklyProgress: 8.5,
	tasksCompleted: 45,
	totalTasks: 68,
	estimatedDaysRemaining: 45,
	status: "behind",
	lastUpdated: new Date().toISOString(),
};

const ProjectProgressWidget: React.FC<ProjectProgressWidgetProps> = ({
	projectId,
	className = "",
}) => {
	const [progressData, setProgressData] =
		useState<ProgressData>(mockProgressData);
	const [isLoading, setIsLoading] = useState(false);

	useEffect(() => {
		// Simular actualizaciones en tiempo real
		const interval = setInterval(() => {
			// En producción: llamar API para obtener datos actualizados
			setProgressData((prevData) => ({
				...prevData,
				lastUpdated: new Date().toISOString(),
				// Simular pequeños cambios en el progreso
				currentProgress: Math.min(
					100,
					prevData.currentProgress + Math.random() * 0.5
				),
			}));
		}, 30000); // Actualizar cada 30 segundos

		return () => clearInterval(interval);
	}, [projectId]);

	const getStatusInfo = (status: string) => {
		switch (status) {
			case "on_track":
				return {
					text: "En Tiempo",
					color: "text-green-600",
					bgColor: "bg-green-100",
					icon: CheckCircleIcon,
				};
			case "ahead":
				return {
					text: "Adelantado",
					color: "text-blue-600",
					bgColor: "bg-blue-100",
					icon: TrendingUpIcon,
				};
			case "behind":
				return {
					text: "Retrasado",
					color: "text-yellow-600",
					bgColor: "bg-yellow-100",
					icon: ClockIcon,
				};
			case "critical":
				return {
					text: "Crítico",
					color: "text-red-600",
					bgColor: "bg-red-100",
					icon: ExclamationTriangleIcon,
				};
			default:
				return {
					text: "Desconocido",
					color: "text-gray-600",
					bgColor: "bg-gray-100",
					icon: ClockIcon,
				};
		}
	};

	const statusInfo = getStatusInfo(progressData.status);
	const StatusIcon = statusInfo.icon;

	const formatLastUpdated = (dateString: string) => {
		const now = new Date();
		const updated = new Date(dateString);
		const diffInMinutes = Math.floor(
			(now.getTime() - updated.getTime()) / 60000
		);

		if (diffInMinutes < 1) {
			return "Hace unos segundos";
		} else if (diffInMinutes < 60) {
			return `Hace ${diffInMinutes} minuto${diffInMinutes > 1 ? "s" : ""}`;
		} else {
			const diffInHours = Math.floor(diffInMinutes / 60);
			return `Hace ${diffInHours} hora${diffInHours > 1 ? "s" : ""}`;
		}
	};

	const progressDifference =
		progressData.currentProgress - progressData.targetProgress;

	return (
		<div
			className={`bg-white rounded-xl shadow-sm border border-gray-100 p-6 ${className}`}
		>
			{/* Header */}
			<div className="flex items-center justify-between mb-6">
				<div className="flex items-center gap-3">
					<div className="h-10 w-10 bg-primary-100 rounded-lg flex items-center justify-center">
						<ChartBarIcon className="h-5 w-5 text-primary-600" />
					</div>
					<div>
						<h3 className="text-lg font-semibold text-gray-900">
							Progreso en Tiempo Real
						</h3>
						<p className="text-sm text-gray-500">
							Actualizado {formatLastUpdated(progressData.lastUpdated)}
						</p>
					</div>
				</div>
				<div
					className={`flex items-center gap-2 px-3 py-1 rounded-full text-sm font-medium ${statusInfo.color} ${statusInfo.bgColor}`}
				>
					<StatusIcon className="h-4 w-4" />
					{statusInfo.text}
				</div>
			</div>

			{/* Progreso Principal */}
			<div className="mb-6">
				<div className="flex items-center justify-between mb-3">
					<span className="text-sm font-medium text-gray-700">
						Progreso Actual
					</span>
					<div className="flex items-center gap-2">
						<span className="text-2xl font-bold text-primary-600">
							{progressData.currentProgress.toFixed(1)}%
						</span>
						{progressDifference !== 0 && (
							<span
								className={`text-sm ${progressDifference > 0 ? "text-green-600" : "text-red-600"}`}
							>
								{progressDifference > 0 ? "+" : ""}
								{progressDifference.toFixed(1)}%
							</span>
						)}
					</div>
				</div>

				{/* Barra de progreso principal */}
				<div className="relative">
					<div className="w-full bg-gray-200 rounded-full h-4">
						<div
							className="bg-gradient-to-r from-primary-500 to-primary-600 h-4 rounded-full transition-all duration-1000 ease-out relative overflow-hidden"
							style={{width: `${progressData.currentProgress}%`}}
						>
							<div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent -skew-x-12 animate-shimmer"></div>
						</div>
					</div>

					{/* Indicador de objetivo */}
					<div
						className="absolute top-0 h-4 w-1 bg-gray-600 rounded"
						style={{left: `${progressData.targetProgress}%`}}
						title={`Objetivo: ${progressData.targetProgress}%`}
					>
						<div className="absolute -top-6 left-1/2 transform -translate-x-1/2 text-xs text-gray-600 whitespace-nowrap">
							Meta: {progressData.targetProgress}%
						</div>
					</div>
				</div>
			</div>

			{/* Métricas de Rendimiento */}
			<div className="grid grid-cols-2 gap-4 mb-6">
				<div className="text-center p-3 bg-gray-50 rounded-lg">
					<div className="flex items-center justify-center mb-2">
						<CalendarIcon className="h-4 w-4 text-gray-500 mr-1" />
						<span className="text-xs text-gray-600">Progreso Diario</span>
					</div>
					<div className="text-lg font-bold text-gray-900">
						{progressData.dailyProgress.toFixed(1)}%
					</div>
				</div>

				<div className="text-center p-3 bg-gray-50 rounded-lg">
					<div className="flex items-center justify-center mb-2">
						<ChartBarIcon className="h-4 w-4 text-gray-500 mr-1" />
						<span className="text-xs text-gray-600">Progreso Semanal</span>
					</div>
					<div className="text-lg font-bold text-gray-900">
						{progressData.weeklyProgress.toFixed(1)}%
					</div>
				</div>
			</div>

			{/* Tareas Completadas */}
			<div className="mb-6">
				<div className="flex items-center justify-between mb-2">
					<span className="text-sm font-medium text-gray-700">
						Tareas Completadas
					</span>
					<span className="text-sm text-gray-600">
						{progressData.tasksCompleted} de {progressData.totalTasks}
					</span>
				</div>
				<div className="w-full bg-gray-200 rounded-full h-2">
					<div
						className="bg-green-500 h-2 rounded-full transition-all duration-500"
						style={{
							width: `${(progressData.tasksCompleted / progressData.totalTasks) * 100}%`,
						}}
					></div>
				</div>
			</div>

			{/* Estimación de Finalización */}
			<div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
				<div className="flex items-center gap-2">
					<ClockIcon className="h-5 w-5 text-gray-500" />
					<span className="text-sm font-medium text-gray-700">
						Días Restantes Estimados
					</span>
				</div>
				<span className="text-lg font-bold text-gray-900">
					{progressData.estimatedDaysRemaining}
				</span>
			</div>

			{/* Indicador de Carga */}
			{isLoading && (
				<div className="absolute top-4 right-4">
					<div className="animate-spin h-4 w-4 border-2 border-primary-600 border-t-transparent rounded-full"></div>
				</div>
			)}

			{/* Estilos para animaciones */}
			<style>{`
				@keyframes shimmer {
					0% {
						transform: translateX(-100%);
					}
					100% {
						transform: translateX(100%);
					}
				}

				.animate-shimmer {
					animation: shimmer 2s infinite;
				}
			`}</style>
		</div>
	);
};

export default ProjectProgressWidget;
