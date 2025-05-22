import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import type { ProjectTemplate } from "./ProjectTemplatesPage";
import {
	BuildingOffice2Icon,
	MapPinIcon,
	CalendarIcon,
	CurrencyDollarIcon,
	UserGroupIcon,
	CogIcon,
	InformationCircleIcon,
	CheckIcon,
	PlusIcon,
	XMarkIcon,
} from "@heroicons/react/24/outline";

// Schema de validación
const customizationSchema = z.object({
	projectName: z.string().min(3, "El nombre debe tener al menos 3 caracteres"),
	clientName: z.string().min(2, "El nombre del cliente es requerido"),
	location: z.string().min(5, "La ubicación es requerida"),
	startDate: z.string().min(1, "La fecha de inicio es requerida"),
	endDate: z.string().min(1, "La fecha de finalización es requerida"),
	budget: z.number().min(1, "El presupuesto debe ser mayor a 0"),
	teamSize: z.number().min(1, "Debe tener al menos 1 miembro del equipo"),
	priority: z.enum(["low", "medium", "high"]),
	description: z.string().optional(),
});

type CustomizationFormValues = z.infer<typeof customizationSchema>;

interface TemplateCustomizerProps {
	template: ProjectTemplate;
	onCustomizationComplete: (data: CustomizationFormValues & { 
		selectedPhases: string[];
		selectedMaterials: string[];
		selectedFormulas: string[];
		selectedTeamRoles: string[];
		additionalFeatures: string[];
	}) => void;
	onBack: () => void;
}

const TemplateCustomizer: React.FC<TemplateCustomizerProps> = ({
	template,
	onCustomizationComplete,
	onBack,
}) => {
	const [selectedPhases, setSelectedPhases] = useState<string[]>(template.defaultSettings.phases);
	const [selectedMaterials, setSelectedMaterials] = useState<string[]>(template.defaultSettings.materials);
	const [selectedFormulas, setSelectedFormulas] = useState<string[]>(template.defaultSettings.formulas);
	const [selectedTeamRoles, setSelectedTeamRoles] = useState<string[]>(template.defaultSettings.teamRoles);
	const [additionalFeatures, setAdditionalFeatures] = useState<string[]>([]);
	const [customFeature, setCustomFeature] = useState("");

	const {
		register,
		handleSubmit,
		formState: { errors },
		watch,
	} = useForm<CustomizationFormValues>({
		resolver: zodResolver(customizationSchema),
		defaultValues: {
			priority: "medium",
			teamSize: 5,
		},
	});

	const watchedStartDate = watch("startDate");

	const handlePhaseToggle = (phase: string) => {
		setSelectedPhases(prev =>
			prev.includes(phase)
				? prev.filter(p => p !== phase)
				: [...prev, phase]
		);
	};

	const handleMaterialToggle = (material: string) => {
		setSelectedMaterials(prev =>
			prev.includes(material)
				? prev.filter(m => m !== material)
				: [...prev, material]
		);
	};

	const handleFormulaToggle = (formula: string) => {
		setSelectedFormulas(prev =>
			prev.includes(formula)
				? prev.filter(f => f !== formula)
				: [...prev, formula]
		);
	};

	const handleTeamRoleToggle = (role: string) => {
		setSelectedTeamRoles(prev =>
			prev.includes(role)
				? prev.filter(r => r !== role)
				: [...prev, role]
		);
	};

	const addCustomFeature = () => {
		if (customFeature.trim() && !additionalFeatures.includes(customFeature.trim())) {
			setAdditionalFeatures(prev => [...prev, customFeature.trim()]);
			setCustomFeature("");
		}
	};

	const removeCustomFeature = (feature: string) => {
		setAdditionalFeatures(prev => prev.filter(f => f !== feature));
	};

	const onSubmit = (data: CustomizationFormValues) => {
		onCustomizationComplete({
			...data,
			selectedPhases,
			selectedMaterials,
			selectedFormulas,
			selectedTeamRoles,
			additionalFeatures,
		});
	};

	const ToggleButton: React.FC<{
		isSelected: boolean;
		onToggle: () => void;
		children: React.ReactNode;
		icon?: React.ReactNode;
	}> = ({ isSelected, onToggle, children, icon }) => (
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
			{isSelected && (
				<CheckIcon className="w-4 h-4 text-primary-600" />
			)}
		</button>
	);

	return (
		<div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
			<div className="max-w-4xl mx-auto">
				{/* Header de la plantilla seleccionada */}
				<div className={`mb-8 p-6 rounded-2xl ${template.gradient} border border-gray-200`}>
					<div className="flex items-center gap-4">
						<div className={`w-16 h-16 bg-gradient-to-r ${template.color} rounded-2xl flex items-center justify-center`}>
							<template.icon className="h-8 w-8 text-white" />
						</div>
						<div>
							<h2 className="text-2xl font-bold text-gray-900">{template.name}</h2>
							<p className="text-gray-600">{template.description}</p>
							<div className="flex items-center gap-4 mt-2 text-sm text-gray-500">
								<span>Duración: {template.estimatedDuration}</span>
								<span>•</span>
								<span>Complejidad: {template.complexity}</span>
							</div>
						</div>
					</div>
				</div>

				<form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
					{/* Información básica del proyecto */}
					<div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8 animate-fade-in">
						<div className="flex items-center gap-3 mb-6">
							<div className="h-10 w-10 bg-blue-100 rounded-lg flex items-center justify-center">
								<BuildingOffice2Icon className="h-5 w-5 text-blue-600" />
							</div>
							<div>
								<h3 className="text-xl font-semibold text-gray-900">Información del Proyecto</h3>
								<p className="text-sm text-gray-600">Detalles básicos para identificar tu proyecto</p>
							</div>
						</div>

						<div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
							<div>
								<label className="block text-sm font-medium text-gray-700 mb-2">
									Nombre del Proyecto *
								</label>
								<input
									type="text"
									{...register("projectName")}
									className={`w-full px-4 py-3 rounded-xl border transition-all duration-200 focus:ring-2 focus:ring-primary-500 focus:border-primary-500 ${
										errors.projectName ? "border-red-500" : "border-gray-300"
									}`}
									placeholder="Ej: Torre Residencial Los Pinos"
								/>
								{errors.projectName && (
									<p className="mt-1 text-sm text-red-600">{errors.projectName.message}</p>
								)}
							</div>

							<div>
								<label className="block text-sm font-medium text-gray-700 mb-2">
									Cliente *
								</label>
								<input
									type="text"
									{...register("clientName")}
									className={`w-full px-4 py-3 rounded-xl border transition-all duration-200 focus:ring-2 focus:ring-primary-500 focus:border-primary-500 ${
										errors.clientName ? "border-red-500" : "border-gray-300"
									}`}
									placeholder="Nombre del cliente"
								/>
								{errors.clientName && (
									<p className="mt-1 text-sm text-red-600">{errors.clientName.message}</p>
								)}
							</div>

							<div>
								<label className="block text-sm font-medium text-gray-700 mb-2">
									Ubicación *
								</label>
								<div className="relative">
									<MapPinIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
									<input
										type="text"
										{...register("location")}
										className={`w-full pl-10 pr-4 py-3 rounded-xl border transition-all duration-200 focus:ring-2 focus:ring-primary-500 focus:border-primary-500 ${
											errors.location ? "border-red-500" : "border-gray-300"
										}`}
										placeholder="Ciudad, Provincia"
									/>
								</div>
								{errors.location && (
									<p className="mt-1 text-sm text-red-600">{errors.location.message}</p>
								)}
							</div>

							<div>
								<label className="block text-sm font-medium text-gray-700 mb-2">
									Prioridad *
								</label>
								<select
									{...register("priority")}
									className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all duration-200"
								>
									<option value="low">Baja</option>
									<option value="medium">Media</option>
									<option value="high">Alta</option>
								</select>
							</div>

							<div className="lg:col-span-2">
								<label className="block text-sm font-medium text-gray-700 mb-2">
									Descripción (Opcional)
								</label>
								<textarea
									{...register("description")}
									rows={3}
									className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all duration-200 resize-none"
									placeholder="Describe características especiales o requisitos adicionales..."
								/>
							</div>
						</div>
					</div>

					{/* Cronograma y presupuesto */}
					<div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8 animate-fade-in" style={{animationDelay: '0.1s'}}>
						<div className="flex items-center gap-3 mb-6">
							<div className="h-10 w-10 bg-green-100 rounded-lg flex items-center justify-center">
								<CalendarIcon className="h-5 w-5 text-green-600" />
							</div>
							<div>
								<h3 className="text-xl font-semibold text-gray-900">Cronograma y Presupuesto</h3>
								<p className="text-sm text-gray-600">Fechas y recursos estimados</p>
							</div>
						</div>

						<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
							<div>
								<label className="block text-sm font-medium text-gray-700 mb-2">
									Fecha de Inicio *
								</label>
								<input
									type="date"
									{...register("startDate")}
									className={`w-full px-4 py-3 rounded-xl border transition-all duration-200 focus:ring-2 focus:ring-primary-500 focus:border-primary-500 ${
										errors.startDate ? "border-red-500" : "border-gray-300"
									}`}
								/>
								{errors.startDate && (
									<p className="mt-1 text-sm text-red-600">{errors.startDate.message}</p>
								)}
							</div>

							<div>
								<label className="block text-sm font-medium text-gray-700 mb-2">
									Fecha de Finalización *
								</label>
								<input
									type="date"
									{...register("endDate")}
									min={watchedStartDate}
									className={`w-full px-4 py-3 rounded-xl border transition-all duration-200 focus:ring-2 focus:ring-primary-500 focus:border-primary-500 ${
										errors.endDate ? "border-red-500" : "border-gray-300"
									}`}
								/>
								{errors.endDate && (
									<p className="mt-1 text-sm text-red-600">{errors.endDate.message}</p>
								)}
							</div>

							<div>
								<label className="block text-sm font-medium text-gray-700 mb-2">
									Presupuesto (USD) *
								</label>
								<div className="relative">
									<CurrencyDollarIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
									<input
										type="number"
										{...register("budget", { valueAsNumber: true })}
										min="1"
										step="0.01"
										className={`w-full pl-10 pr-4 py-3 rounded-xl border transition-all duration-200 focus:ring-2 focus:ring-primary-500 focus:border-primary-500 ${
											errors.budget ? "border-red-500" : "border-gray-300"
										}`}
										placeholder="100000"
									/>
								</div>
								{errors.budget && (
									<p className="mt-1 text-sm text-red-600">{errors.budget.message}</p>
								)}
							</div>

							<div>
								<label className="block text-sm font-medium text-gray-700 mb-2">
									Tamaño del Equipo *
								</label>
								<div className="relative">
									<UserGroupIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
									<input
										type="number"
										{...register("teamSize", { valueAsNumber: true })}
										min="1"
										className={`w-full pl-10 pr-4 py-3 rounded-xl border transition-all duration-200 focus:ring-2 focus:ring-primary-500 focus:border-primary-500 ${
											errors.teamSize ? "border-red-500" : "border-gray-300"
										}`}
										placeholder="5"
									/>
								</div>
								{errors.teamSize && (
									<p className="mt-1 text-sm text-red-600">{errors.teamSize.message}</p>
								)}
							</div>
						</div>
					</div>

					{/* Fases del proyecto */}
					<div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8 animate-fade-in" style={{animationDelay: '0.2s'}}>
						<div className="flex items-center gap-3 mb-6">
							<div className="h-10 w-10 bg-purple-100 rounded-lg flex items-center justify-center">
								<CogIcon className="h-5 w-5 text-purple-600" />
							</div>
							<div>
								<h3 className="text-xl font-semibold text-gray-900">Fases del Proyecto</h3>
								<p className="text-sm text-gray-600">Selecciona las fases que incluirá tu proyecto</p>
							</div>
						</div>

						<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
							{template.defaultSettings.phases.map((phase) => (
								<ToggleButton
									key={phase}
									isSelected={selectedPhases.includes(phase)}
									onToggle={() => handlePhaseToggle(phase)}
								>
									{phase}
								</ToggleButton>
							))}
						</div>
					</div>

					{/* Materiales recomendados */}
					<div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8 animate-fade-in" style={{animationDelay: '0.3s'}}>
						<div className="flex items-center gap-3 mb-6">
							<div className="h-10 w-10 bg-orange-100 rounded-lg flex items-center justify-center">
								<BuildingOffice2Icon className="h-5 w-5 text-orange-600" />
							</div>
							<div>
								<h3 className="text-xl font-semibold text-gray-900">Materiales Recomendados</h3>
								<p className="text-sm text-gray-600">Materiales típicos para este tipo de proyecto</p>
							</div>
						</div>

						<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
							{template.defaultSettings.materials.map((material) => (
								<ToggleButton
									key={material}
									isSelected={selectedMaterials.includes(material)}
									onToggle={() => handleMaterialToggle(material)}
								>
									{material}
								</ToggleButton>
							))}
						</div>
					</div>

					{/* Fórmulas y cálculos */}
					<div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8 animate-fade-in" style={{animationDelay: '0.4s'}}>
						<div className="flex items-center gap-3 mb-6">
							<div className="h-10 w-10 bg-indigo-100 rounded-lg flex items-center justify-center">
								<InformationCircleIcon className="h-5 w-5 text-indigo-600" />
							</div>
							<div>
								<h3 className="text-xl font-semibold text-gray-900">Fórmulas y Cálculos</h3>
								<p className="text-sm text-gray-600">Herramientas de cálculo disponibles</p>
							</div>
						</div>

						<div className="grid grid-cols-1 md:grid-cols-2 gap-3">
							{template.defaultSettings.formulas.map((formula) => (
								<ToggleButton
									key={formula}
									isSelected={selectedFormulas.includes(formula)}
									onToggle={() => handleFormulaToggle(formula)}
								>
									{formula}
								</ToggleButton>
							))}
						</div>
					</div>

					{/* Roles del equipo */}
					<div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8 animate-fade-in" style={{animationDelay: '0.5s'}}>
						<div className="flex items-center gap-3 mb-6">
							<div className="h-10 w-10 bg-cyan-100 rounded-lg flex items-center justify-center">
								<UserGroupIcon className="h-5 w-5 text-cyan-600" />
							</div>
							<div>
								<h3 className="text-xl font-semibold text-gray-900">Roles del Equipo</h3>
								<p className="text-sm text-gray-600">Profesionales necesarios para el proyecto</p>
							</div>
						</div>

						<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
							{template.defaultSettings.teamRoles.map((role) => (
								<ToggleButton
									key={role}
									isSelected={selectedTeamRoles.includes(role)}
									onToggle={() => handleTeamRoleToggle(role)}
								>
									{role}
								</ToggleButton>
							))}
						</div>
					</div>

					{/* Características adicionales */}
					<div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8 animate-fade-in" style={{animationDelay: '0.6s'}}>
						<div className="flex items-center gap-3 mb-6">
							<div className="h-10 w-10 bg-pink-100 rounded-lg flex items-center justify-center">
								<PlusIcon className="h-5 w-5 text-pink-600" />
							</div>
							<div>
								<h3 className="text-xl font-semibold text-gray-900">Características Adicionales</h3>
								<p className="text-sm text-gray-600">Añade características específicas para tu proyecto</p>
							</div>
						</div>

						<div className="flex gap-3 mb-4">
							<input
								type="text"
								value={customFeature}
								onChange={(e) => setCustomFeature(e.target.value)}
								className="flex-1 px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all duration-200"
								placeholder="Ej: Sistema de seguridad avanzado"
								onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addCustomFeature())}
							/>
							<button
								type="button"
								onClick={addCustomFeature}
								className="px-6 py-3 bg-primary-600 hover:bg-primary-700 text-white rounded-xl transition-colors duration-200 flex items-center gap-2"
							>
								<PlusIcon className="h-4 w-4" />
								Añadir
							</button>
						</div>

						{additionalFeatures.length > 0 && (
							<div className="flex flex-wrap gap-2">
								{additionalFeatures.map((feature) => (
									<div
										key={feature}
										className="flex items-center gap-2 px-3 py-2 bg-primary-50 text-primary-700 rounded-lg border border-primary-200"
									>
										<span className="text-sm">{feature}</span>
										<button
											type="button"
											onClick={() => removeCustomFeature(feature)}
											className="text-primary-500 hover:text-primary-700 transition-colors duration-200"
										>
											<XMarkIcon className="h-4 w-4" />
										</button>
									</div>
								))}
							</div>
						)}
					</div>

					{/* Botones de acción */}
					<div className="flex justify-end gap-4 animate-fade-in" style={{animationDelay: '0.7s'}}>
						<button
							type="button"
							onClick={onBack}
							className="px-6 py-3 border border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 transition-colors duration-200"
						>
							Volver
						</button>
						<button
							type="submit"
							className="px-8 py-3 bg-primary-600 hover:bg-primary-700 text-white rounded-xl transition-all duration-200 transform hover:scale-105 flex items-center gap-2"
						>
							<span>Continuar</span>
							<CheckIcon className="h-4 w-4" />
						</button>
					</div>
				</form>
			</div>

			{/* Estilos para animaciones */}
			<style>{`
				@keyframes fadeIn {
					from {
						opacity: 0;
						transform: translateY(20px);
					}
					to {
						opacity: 1;
						transform: translateY(0);
					}
				}

				.animate-fade-in {
					animation: fadeIn 0.6s ease-out forwards;
					opacity: 0;
				}
			`}</style>
		</div>
	);
};

export default TemplateCustomizer;