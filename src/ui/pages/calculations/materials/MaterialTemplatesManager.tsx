// src/ui/pages/calculations/materials/MaterialTemplatesManager.tsx

import React, {useState, useEffect} from "react";
import {
	MaterialCalculationType,
	MATERIAL_CATEGORIES,
	MATERIAL_UI_CONFIG,
} from "../shared/types/material.types";

import type {
	MaterialCalculationTemplate,
	MaterialParameter,
} from "../shared/types/material.types";

interface MaterialTemplatesManagerProps {
	onTemplateSelect: (template: MaterialCalculationTemplate) => void;
}

interface UserTemplate extends Omit<MaterialCalculationTemplate, "id"> {
	id?: string;
	isDraft: boolean;
	isPublic: boolean;
	shareLevel: "private" | "team" | "public";
}

const MaterialTemplatesManager: React.FC<MaterialTemplatesManagerProps> = ({
	onTemplateSelect,
}) => {
	const [activeTab, setActiveTab] = useState<
		"my-templates" | "create" | "drafts"
	>("my-templates");
	const [templates, setTemplates] = useState<UserTemplate[]>([]);
	const [editingTemplate, setEditingTemplate] = useState<UserTemplate | null>(
		null
	);
	//const [loading, setLoading] = useState(false);

	// Datos de ejemplo
	useEffect(() => {
		const exampleTemplates: UserTemplate[] = [
			{
				name: "Pared de Ladrillo Personalizada",
				description:
					"Mi fórmula mejorada para cálculo de paredes con ladrillo King Kong",
				type: MaterialCalculationType.WALLS_MASONRY,
				subCategory: "Ladrillos",
				formula: `
          // Cálculo personalizado con factor de desperdicio regional
          const areaTotal = largo * alto;
          const areaVanos = ventanas * areaVentana + puertas * areaPuerta;
          const areaNeta = areaTotal - areaVanos;
          
          const ladrillosPorM2 = 40; // King Kong incluye junta
          const factorDesperdicio = desperdicioPersonalizado / 100;
          
          const cantidadLadrillos = Math.ceil(areaNeta * ladrillosPorM2 * (1 + factorDesperdicio));
          const volumenMortero = areaNeta * 0.032; // 32 litros por m2
          const cemento = volumenMortero * 350; // kg
          const arena = volumenMortero * 0.6; // m3
          
          return {
            cantidadLadrillos,
            cemento,
            arena,
            volumenMortero,
            areaNeta
          };
        `,
				parameters: [
					{
						id: "1",
						name: "largo",
						description: "Largo de la pared",
						dataType: "number",
						scope: "input",
						displayOrder: 1,
						isRequired: true,
						unitOfMeasure: "m",
						minValue: 0.1,
						maxValue: 50,
					},
					{
						id: "2",
						name: "alto",
						description: "Alto de la pared",
						dataType: "number",
						scope: "input",
						displayOrder: 2,
						isRequired: true,
						unitOfMeasure: "m",
						minValue: 0.1,
						maxValue: 10,
					},
					{
						id: "3",
						name: "desperdicioPersonalizado",
						description: "Factor de desperdicio",
						dataType: "number",
						scope: "input",
						displayOrder: 3,
						isRequired: true,
						unitOfMeasure: "%",
						defaultValue: "8",
						minValue: 5,
						maxValue: 20,
					},
				],
				isActive: true,
				isVerified: false,
				isFeatured: false,
				usageCount: 23,
				averageRating: 4.5,
				ratingCount: 8,
				createdAt: "2024-01-15T10:00:00Z",
				updatedAt: "2024-01-20T15:30:00Z",
				isDraft: false,
				isPublic: true,
				shareLevel: "public",
			},
		];
		setTemplates(exampleTemplates);
	}, []);

	const TemplateCard: React.FC<{template: UserTemplate}> = ({template}) => {
		const categoryConfig = MATERIAL_CATEGORIES[template.type];

		return (
			<div
				className={`
        bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700
        ${MATERIAL_UI_CONFIG.cardHover} ${MATERIAL_UI_CONFIG.defaultTransition} p-6
      `}
			>
				{/* Header */}
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
							<div className="flex items-center space-x-2 text-sm">
								<span className="text-gray-500 dark:text-gray-400">
									{categoryConfig.name}
								</span>
								{template.isDraft && (
									<span className="px-2 py-1 bg-yellow-100 dark:bg-yellow-900 text-yellow-700 dark:text-yellow-300 text-xs rounded-full">
										Borrador
									</span>
								)}
								<span
									className={`px-2 py-1 text-xs rounded-full ${
										template.shareLevel === "public"
											? "bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-300"
											: template.shareLevel === "team"
												? "bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300"
												: "bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300"
									}`}
								>
									{template.shareLevel === "public"
										? "Público"
										: template.shareLevel === "team"
											? "Equipo"
											: "Privado"}
								</span>
							</div>
						</div>
					</div>

					<div className="flex items-center space-x-2">
						<button
							onClick={() => setEditingTemplate(template)}
							className="p-2 text-gray-400 hover:text-blue-500 transition-colors"
						>
							<svg
								className="w-5 h-5"
								fill="none"
								stroke="currentColor"
								viewBox="0 0 24 24"
							>
								<path
									strokeLinecap="round"
									strokeLinejoin="round"
									strokeWidth={2}
									d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
								/>
							</svg>
						</button>

						<div className="relative group">
							<button className="p-2 text-gray-400 hover:text-gray-600 transition-colors">
								<svg
									className="w-5 h-5"
									fill="currentColor"
									viewBox="0 0 20 20"
								>
									<path d="M10 6a2 2 0 110-4 2 2 0 010 4zM10 12a2 2 0 110-4 2 2 0 010 4zM10 18a2 2 0 110-4 2 2 0 010 4z" />
								</svg>
							</button>

							<div className="absolute right-0 top-full mt-2 w-48 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-10">
								<div className="py-2">
									<button className="w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700">
										Duplicar
									</button>
									<button className="w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700">
										Exportar
									</button>
									<button className="w-full text-left px-4 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20">
										Eliminar
									</button>
								</div>
							</div>
						</div>
					</div>
				</div>

				<p className="text-gray-600 dark:text-gray-300 text-sm mb-4">
					{template.description}
				</p>

				{/* Stats */}
				<div className="flex items-center justify-between pt-4 border-t border-gray-100 dark:border-gray-700">
					<div className="flex items-center space-x-4 text-sm text-gray-500 dark:text-gray-400">
						<div className="flex items-center space-x-1">
							<svg
								className="w-4 h-4"
								fill="none"
								stroke="currentColor"
								viewBox="0 0 24 24"
							>
								<path
									strokeLinecap="round"
									strokeLinejoin="round"
									strokeWidth={2}
									d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
								/>
								<path
									strokeLinecap="round"
									strokeLinejoin="round"
									strokeWidth={2}
									d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
								/>
							</svg>
							<span>{template.usageCount}</span>
						</div>

						<div className="flex items-center space-x-1">
							<svg
								className="w-4 h-4 text-yellow-400"
								fill="currentColor"
								viewBox="0 0 20 20"
							>
								<path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
							</svg>
							<span>{template.averageRating}</span>
							<span>({template.ratingCount})</span>
						</div>
					</div>

					<button
						onClick={() =>
							onTemplateSelect(template as MaterialCalculationTemplate)
						}
						className="px-4 py-2 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700 transition-colors"
					>
						Usar Plantilla
					</button>
				</div>
			</div>
		);
	};

	const TemplateEditor: React.FC<{
		template: UserTemplate | null;
		onSave: (template: UserTemplate) => void;
		onCancel: () => void;
	}> = ({template, onSave, onCancel}) => {
		const [formData, setFormData] = useState<UserTemplate>(
			template || {
				name: "",
				description: "",
				type: MaterialCalculationType.WALLS_MASONRY,
				formula: "",
				parameters: [],
				isActive: true,
				isVerified: false,
				isFeatured: false,
				usageCount: 0,
				averageRating: 0,
				ratingCount: 0,
				createdAt: new Date().toISOString(),
				updatedAt: new Date().toISOString(),
				isDraft: true,
				isPublic: false,
				shareLevel: "private",
			}
		);

		const [newParameter, setNewParameter] = useState<
			Partial<MaterialParameter>
		>({
			name: "",
			description: "",
			dataType: "number",
			scope: "input",
			isRequired: true,
			displayOrder: formData.parameters.length + 1,
		});

		const addParameter = () => {
			if (!newParameter.name || !newParameter.description) return;

			const parameter: MaterialParameter = {
				id: Date.now().toString(),
				name: newParameter.name,
				description: newParameter.description,
				dataType: newParameter.dataType || "number",
				scope: newParameter.scope || "input",
				displayOrder: formData.parameters.length + 1,
				isRequired: newParameter.isRequired || false,
				unitOfMeasure: newParameter.unitOfMeasure,
				minValue: newParameter.minValue,
				maxValue: newParameter.maxValue,
				defaultValue: newParameter.defaultValue,
			};

			setFormData((prev) => ({
				...prev,
				parameters: [...prev.parameters, parameter],
			}));

			setNewParameter({
				name: "",
				description: "",
				dataType: "number",
				scope: "input",
				isRequired: true,
				displayOrder: formData.parameters.length + 2,
			});
		};

		const removeParameter = (index: number) => {
			setFormData((prev) => ({
				...prev,
				parameters: prev.parameters.filter((_, i) => i !== index),
			}));
		};

		return (
			<div className="space-y-6">
				{/* Header */}
				<div className="flex items-center justify-between">
					<h2 className="text-2xl font-bold text-gray-900 dark:text-white">
						{template ? "Editar Plantilla" : "Nueva Plantilla"}
					</h2>
					<button
						onClick={onCancel}
						className="p-2 text-gray-500 hover:text-gray-700 transition-colors"
					>
						<svg
							className="w-6 h-6"
							fill="none"
							stroke="currentColor"
							viewBox="0 0 24 24"
						>
							<path
								strokeLinecap="round"
								strokeLinejoin="round"
								strokeWidth={2}
								d="M6 18L18 6M6 6l12 12"
							/>
						</svg>
					</button>
				</div>

				{/* Información básica */}
				<div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
					<h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
						Información Básica
					</h3>

					<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
						<div>
							<label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
								Nombre de la plantilla *
							</label>
							<input
								type="text"
								value={formData.name}
								onChange={(e) =>
									setFormData((prev) => ({...prev, name: e.target.value}))
								}
								className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
								placeholder="Ej: Pared de Ladrillo Mejorada"
							/>
						</div>

						<div>
							<label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
								Categoría *
							</label>
							<select
								value={formData.type}
								onChange={(e) =>
									setFormData((prev) => ({
										...prev,
										type: e.target.value as MaterialCalculationType,
									}))
								}
								className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
							>
								{Object.values(MaterialCalculationType).map((type) => (
									<option key={type} value={type}>
										{MATERIAL_CATEGORIES[type].name}
									</option>
								))}
							</select>
						</div>

						<div className="md:col-span-2">
							<label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
								Descripción *
							</label>
							<textarea
								value={formData.description}
								onChange={(e) =>
									setFormData((prev) => ({
										...prev,
										description: e.target.value,
									}))
								}
								rows={3}
								className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
								placeholder="Describe qué calcula esta plantilla y cuándo usarla..."
							/>
						</div>
					</div>
				</div>

				{/* Parámetros */}
				<div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
					<h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
						Parámetros de Entrada
					</h3>

					{/* Lista de parámetros */}
					{formData.parameters.length > 0 && (
						<div className="space-y-3 mb-6">
							{formData.parameters.map((param, index) => (
								<div
									key={index}
									className="flex items-center space-x-4 p-3 bg-gray-50 dark:bg-gray-700 rounded-lg"
								>
									<div className="flex-1">
										<div className="font-medium text-gray-900 dark:text-white">
											{param.description}
										</div>
										<div className="text-sm text-gray-500 dark:text-gray-400">
											{param.name} ({param.dataType}){" "}
											{param.unitOfMeasure && `- ${param.unitOfMeasure}`}
										</div>
									</div>

									<button
										onClick={() => removeParameter(index)}
										className="p-2 text-red-500 hover:text-red-700 transition-colors"
									>
										<svg
											className="w-5 h-5"
											fill="none"
											stroke="currentColor"
											viewBox="0 0 24 24"
										>
											<path
												strokeLinecap="round"
												strokeLinejoin="round"
												strokeWidth={2}
												d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
											/>
										</svg>
									</button>
								</div>
							))}
						</div>
					)}

					{/* Agregar nuevo parámetro */}
					<div className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-4">
						<div className="grid grid-cols-1 md:grid-cols-4 gap-4">
							<div>
								<input
									type="text"
									placeholder="Nombre del parámetro"
									value={newParameter.name || ""}
									onChange={(e) =>
										setNewParameter((prev) => ({...prev, name: e.target.value}))
									}
									className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm"
								/>
							</div>

							<div>
								<input
									type="text"
									placeholder="Descripción"
									value={newParameter.description || ""}
									onChange={(e) =>
										setNewParameter((prev) => ({
											...prev,
											description: e.target.value,
										}))
									}
									className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm"
								/>
							</div>

							<div>
								<select
									value={newParameter.dataType || "number"}
									onChange={(e) =>
										setNewParameter((prev) => ({
											...prev,
											dataType: e.target.value as MaterialParameter['dataType'],
										}))
									}
									className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm"
								>
									<option value="number">Número</option>
									<option value="string">Texto</option>
									<option value="boolean">Sí/No</option>
									<option value="enum">Lista</option>
								</select>
							</div>

							<div>
								<input
									type="text"
									placeholder="Unidad (ej: m, kg)"
									value={newParameter.unitOfMeasure || ""}
									onChange={(e) =>
										setNewParameter((prev) => ({
											...prev,
											unitOfMeasure: e.target.value,
										}))
									}
									className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm"
								/>
							</div>
						</div>

						<div className="flex justify-end mt-4">
							<button
								onClick={addParameter}
								disabled={!newParameter.name || !newParameter.description}
								className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors text-sm"
							>
								Agregar Parámetro
							</button>
						</div>
					</div>
				</div>

				{/* Fórmula */}
				<div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
					<h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
						Fórmula de Cálculo
					</h3>

					<div className="mb-4">
						<div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4 text-sm">
							<div className="font-medium text-blue-900 dark:text-blue-100 mb-2">
								💡 Consejos para escribir la fórmula:
							</div>
							<ul className="text-blue-800 dark:text-blue-200 space-y-1">
								<li>• Usa JavaScript estándar</li>
								<li>
									• Los parámetros de entrada están disponibles como variables
								</li>
								<li>
									• Retorna un objeto con los resultados: return{" "}
									{`{ resultado1, resultado2 }`}
								</li>
								<li>• Usa Math.ceil(), Math.floor(), etc. para redondear</li>
							</ul>
						</div>
					</div>

					<textarea
						value={formData.formula}
						onChange={(e) =>
							setFormData((prev) => ({...prev, formula: e.target.value}))
						}
						rows={12}
						className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-white font-mono text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
						placeholder={`// Ejemplo:
const areaTotal = largo * alto;
const ladrillosPorM2 = 40;
const cantidadLadrillos = Math.ceil(areaTotal * ladrillosPorM2);
const cemento = areaTotal * 32; // kg por m2

return {
  cantidadLadrillos,
  cemento,
  areaTotal
};`}
					/>
				</div>

				{/* Configuración de compartir */}
				<div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
					<h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
						Configuración de Acceso
					</h3>

					<div className="space-y-4">
						<div>
							<label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
								Nivel de acceso
							</label>
							<select
								value={formData.shareLevel}
								onChange={(e) =>
									setFormData((prev) => ({
										...prev,
										shareLevel: e.target.value as "private" | "team" | "public",
									}))
								}
								className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
							>
								<option value="private">Privado - Solo yo</option>
								<option value="team">Equipo - Mi organización</option>
								<option value="public">Público - Todos los usuarios</option>
							</select>
						</div>

						<div className="flex items-center space-x-3">
							<input
								type="checkbox"
								checked={!formData.isDraft}
								onChange={(e) =>
									setFormData((prev) => ({...prev, isDraft: !e.target.checked}))
								}
								className="w-5 h-5 text-blue-600 rounded border-gray-300 focus:ring-blue-500"
							/>
							<label className="text-gray-700 dark:text-gray-300">
								Publicar plantilla (quitar del modo borrador)
							</label>
						</div>
					</div>
				</div>

				{/* Botones de acción */}
				<div className="flex justify-end space-x-4">
					<button
						onClick={onCancel}
						className="px-6 py-3 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
					>
						Cancelar
					</button>

					<button
						onClick={() => {
							setFormData((prev) => ({...prev, isDraft: true}));
							onSave({...formData, isDraft: true});
						}}
						className="px-6 py-3 border border-blue-600 text-blue-600 rounded-lg hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-colors"
					>
						Guardar Borrador
					</button>

					<button
						onClick={() => onSave({...formData, isDraft: false})}
						disabled={
							!formData.name || !formData.description || !formData.formula
						}
						className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
					>
						{template ? "Actualizar" : "Crear"} Plantilla
					</button>
				</div>
			</div>
		);
	};

	const handleSaveTemplate = (template: UserTemplate) => {
		if (template.id) {
			// Actualizar
			setTemplates((prev) =>
				prev.map((t) => (t.id === template.id ? template : t))
			);
		} else {
			// Crear nuevo
			const newTemplate = {...template, id: Date.now().toString()};
			setTemplates((prev) => [...prev, newTemplate]);
		}
		setEditingTemplate(null);
	};

	if (editingTemplate !== null) {
		return (
			<TemplateEditor
				template={editingTemplate}
				onSave={handleSaveTemplate}
				onCancel={() => setEditingTemplate(null)}
			/>
		);
	}

	return (
		<div className="space-y-6">
			{/* Header con tabs */}
			<div className="flex items-center justify-between">
				<div className="flex space-x-6">
					{[
						{
							id: "my-templates",
							label: "Mis Plantillas",
							count: templates.filter((t) => !t.isDraft).length,
						},
						{
							id: "drafts",
							label: "Borradores",
							count: templates.filter((t) => t.isDraft).length,
						},
						{id: "create", label: "Crear Nueva", icon: "+"},
					].map((tab) => (
						<button
							key={tab.id}
							onClick={() =>
								tab.id === "create"
									? setEditingTemplate({} as UserTemplate)
									: setActiveTab(tab.id as "my-templates" | "create" | "drafts")
							}
							className={`
                flex items-center space-x-2 px-4 py-2 rounded-lg font-medium transition-colors
                ${
									activeTab === tab.id
										? "bg-blue-600 text-white"
										: "text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200"
								}
              `}
						>
							<span>{tab.icon || tab.label}</span>
							{tab.count !== undefined && (
								<span
									className={`
                  px-2 py-1 rounded-full text-xs
                  ${
										activeTab === tab.id
											? "bg-white/20 text-white"
											: "bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400"
									}
                `}
								>
									{tab.count}
								</span>
							)}
						</button>
					))}
				</div>

				<button
					onClick={() => setEditingTemplate({} as UserTemplate)}
					className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2"
				>
					<svg
						className="w-5 h-5"
						fill="none"
						stroke="currentColor"
						viewBox="0 0 24 24"
					>
						<path
							strokeLinecap="round"
							strokeLinejoin="round"
							strokeWidth={2}
							d="M12 4v16m8-8H4"
						/>
					</svg>
					<span>Nueva Plantilla</span>
				</button>
			</div>

			{/* Contenido */}
			{templates.length === 0 ? (
				<div className="text-center py-20">
					<div className="text-6xl mb-4">📝</div>
					<h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
						No tienes plantillas aún
					</h3>
					<p className="text-gray-600 dark:text-gray-300 mb-6">
						Crea tu primera plantilla personalizada para optimizar tus cálculos
					</p>
					<button
						onClick={() => setEditingTemplate({} as UserTemplate)}
						className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
					>
						Crear Primera Plantilla
					</button>
				</div>
			) : (
				<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
					{templates
						.filter((t) => (activeTab === "drafts" ? t.isDraft : !t.isDraft))
						.map((template, index) => (
							<TemplateCard key={template.id || index} template={template} />
						))}
				</div>
			)}
		</div>
	);
};

export default MaterialTemplatesManager;
