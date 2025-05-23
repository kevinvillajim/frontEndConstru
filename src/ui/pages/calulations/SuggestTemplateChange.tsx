import React, { useState } from 'react';
import {
  ArrowLeftIcon,
  CheckIcon,
  ExclamationTriangleIcon,
  LightBulbIcon,
  PaperAirplaneIcon,
  BookOpenIcon,
  CalculatorIcon,
  PencilSquareIcon,
  CodeBracketIcon,
  DocumentTextIcon,
  SparklesIcon,
  XMarkIcon,
} from '@heroicons/react/24/outline';

interface CalculationTemplate {
  id: string;
  name: string;
  description: string;
  category: string;
  necReference: string;
  verified: boolean;
  rating: number;
  usageCount: number;
  estimatedTime: string;
  tags: string[];
  profession: string[];
  difficulty: "basic" | "intermediate" | "advanced";
  requirements: string[];
}

interface SuggestionData {
  suggestionType: 'formula' | 'parameters' | 'description' | 'requirements' | 'necReference' | 'other';
  title: string;
  description: string;
  currentValue?: string;
  proposedValue?: string;
  justification: string;
  priority: 'low' | 'medium' | 'high';
  affectsAccuracy: boolean;
  affectsCompliance: boolean;
  references?: string[];
  contactForFollowUp: boolean;
}

interface SuggestTemplateChangeProps {
  template: CalculationTemplate;
  onSubmit: (suggestion: SuggestionData) => void;
  onCancel: () => void;
}

const SuggestTemplateChange: React.FC<SuggestTemplateChangeProps> = ({
  template,
  onSubmit,
  onCancel,
}) => {
  const [formData, setFormData] = useState<SuggestionData>({
    suggestionType: 'formula',
    title: '',
    description: '',
    currentValue: '',
    proposedValue: '',
    justification: '',
    priority: 'medium',
    affectsAccuracy: false,
    affectsCompliance: false,
    references: [],
    contactForFollowUp: false,
  });
  
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const suggestionTypes = [
    {
      id: 'formula',
      name: 'Fórmula de Cálculo',
      description: 'Mejorar o corregir la fórmula matemática utilizada',
      icon: CalculatorIcon,
      color: 'text-blue-600',
    },
    {
      id: 'parameters',
      name: 'Parámetros de Entrada',
      description: 'Agregar, modificar o quitar parámetros de entrada',
      icon: CodeBracketIcon,
      color: 'text-green-600',
    },
    {
      id: 'description',
      name: 'Descripción',
      description: 'Mejorar la descripción o explicación de la plantilla',
      icon: DocumentTextIcon,
      color: 'text-purple-600',
    },
    {
      id: 'requirements',
      name: 'Requisitos',
      description: 'Actualizar los requisitos necesarios para el cálculo',
      icon: ExclamationTriangleIcon,
      color: 'text-orange-600',
    },
    {
      id: 'necReference',
      name: 'Referencia NEC',
      description: 'Actualizar o corregir las referencias normativas',
      icon: BookOpenIcon,
      color: 'text-red-600',
    },
    {
      id: 'other',
      name: 'Otro',
      description: 'Cualquier otra mejora o corrección',
      icon: SparklesIcon,
      color: 'text-gray-600',
    },
  ];

  const priorityOptions = [
    { id: 'low', name: 'Baja', description: 'Mejora menor o estética', color: 'text-green-600' },
    { id: 'medium', name: 'Media', description: 'Mejora funcional importante', color: 'text-yellow-600' },
    { id: 'high', name: 'Alta', description: 'Error crítico o problema de precisión', color: 'text-red-600' },
  ];

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};
    
    if (!formData.title.trim()) {
      newErrors.title = 'El título es requerido';
    }
    
    if (!formData.description.trim()) {
      newErrors.description = 'La descripción es requerida';
    }
    
    if (!formData.justification.trim()) {
      newErrors.justification = 'La justificación es requerida';
    }
    
    if (formData.suggestionType !== 'other' && !formData.proposedValue?.trim()) {
      newErrors.proposedValue = 'El valor propuesto es requerido';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      // Simular envío
      await new Promise(resolve => setTimeout(resolve, 1500));
      onSubmit(formData);
    } catch (error) {
      console.error('Error submitting suggestion:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleInputChange = (field: keyof SuggestionData, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    
    // Limpiar error del campo si existe
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const addReference = () => {
    setFormData(prev => ({
      ...prev,
      references: [...(prev.references || []), '']
    }));
  };

  const updateReference = (index: number, value: string) => {
    setFormData(prev => ({
      ...prev,
      references: prev.references?.map((ref, i) => i === index ? value : ref) || []
    }));
  };

  const removeReference = (index: number) => {
    setFormData(prev => ({
      ...prev,
      references: prev.references?.filter((_, i) => i !== index) || []
    }));
  };

  const selectedType = suggestionTypes.find(type => type.id === formData.suggestionType);

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 mb-8">
          <div className="flex items-center gap-4 mb-6">
            <button
              onClick={onCancel}
              className="flex items-center gap-2 px-4 py-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <ArrowLeftIcon className="h-4 w-4" />
              <span>Volver</span>
            </button>
          </div>

          <div className="flex items-start gap-4">
            <div className="p-3 bg-gradient-to-r from-orange-100 to-yellow-100 rounded-xl">
              <PencilSquareIcon className="h-8 w-8 text-orange-600" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900 mb-2">
                Sugerir Mejora para Plantilla
              </h1>
              <p className="text-gray-600 mb-4">
                Ayúdanos a mejorar la plantilla "{template.name}" con tus conocimientos y experiencia.
              </p>
              <div className="flex items-center gap-4 text-sm text-gray-500">
                <div className="flex items-center gap-1">
                  <BookOpenIcon className="h-4 w-4" />
                  <span>{template.necReference}</span>
                </div>
                <div className="flex items-center gap-1">
                  <span>Categoría: {template.category}</span>
                </div>
                <div className="flex items-center gap-1">
                  <span>{template.usageCount} usos</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Formulario */}
        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Tipo de Sugerencia */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">
              Tipo de Sugerencia
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {suggestionTypes.map((type) => (
                <button
                  key={type.id}
                  type="button"
                  onClick={() => handleInputChange('suggestionType', type.id)}
                  className={`p-4 rounded-xl border-2 text-left transition-all duration-200 ${
                    formData.suggestionType === type.id
                      ? 'border-primary-500 bg-primary-50'
                      : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                  }`}
                >
                  <div className="flex items-center gap-3 mb-2">
                    <type.icon className={`h-5 w-5 ${type.color}`} />
                    <span className="font-medium text-gray-900">{type.name}</span>
                  </div>
                  <p className="text-sm text-gray-600">{type.description}</p>
                </button>
              ))}
            </div>
          </div>

          {/* Detalles de la Sugerencia */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <selectedType?.icon className={`h-5 w-5 ${selectedType?.color}`} />
              Detalles de la Sugerencia
            </h2>

            <div className="space-y-6">
              {/* Título */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Título de la sugerencia *
                </label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => handleInputChange('title', e.target.value)}
                  placeholder="Ej: Corregir factor de seguridad en cálculo de vigas"
                  className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 ${
                    errors.title ? 'border-red-500' : 'border-gray-300'
                  }`}
                />
                {errors.title && (
                  <p className="mt-1 text-sm text-red-600">{errors.title}</p>
                )}
              </div>

              {/* Descripción */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Descripción detallada *
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) => handleInputChange('description', e.target.value)}
                  rows={4}
                  placeholder="Describe en detalle qué problema has identificado o qué mejora propones..."
                  className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 ${
                    errors.description ? 'border-red-500' : 'border-gray-300'
                  }`}
                />
                {errors.description && (
                  <p className="mt-1 text-sm text-red-600">{errors.description}</p>
                )}
              </div>

              {/* Valor Actual y Propuesto */}
              {formData.suggestionType !== 'other' && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Valor/Contenido Actual
                    </label>
                    <textarea
                      value={formData.currentValue}
                      onChange={(e) => handleInputChange('currentValue', e.target.value)}
                      rows={3}
                      placeholder="Copia aquí el contenido actual que quieres cambiar..."
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Valor/Contenido Propuesto *
                    </label>
                    <textarea
                      value={formData.proposedValue}
                      onChange={(e) => handleInputChange('proposedValue', e.target.value)}
                      rows={3}
                      placeholder="Escribe aquí tu propuesta de mejora..."
                      className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 ${
                        errors.proposedValue ? 'border-red-500' : 'border-gray-300'
                      }`}
                    />
                    {errors.proposedValue && (
                      <p className="mt-1 text-sm text-red-600">{errors.proposedValue}</p>
                    )}
                  </div>
                </div>
              )}

              {/* Justificación */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Justificación técnica *
                </label>
                <textarea
                  value={formData.justification}
                  onChange={(e) => handleInputChange('justification', e.target.value)}
                  rows={4}
                  placeholder="Explica por qué tu sugerencia es necesaria, incluye fundamentos técnicos, experiencia práctica, o referencias normativas..."
                  className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 ${
                    errors.justification ? 'border-red-500' : 'border-gray-300'
                  }`}
                />
                {errors.justification && (
                  <p className="mt-1 text-sm text-red-600">{errors.justification}</p>
                )}
              </div>
            </div>
          </div>

          {/* Prioridad e Impacto */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">
              Prioridad e Impacto
            </h2>

            <div className="space-y-6">
              {/* Prioridad */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  Prioridad de la sugerencia
                </label>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {priorityOptions.map((priority) => (
                    <button
                      key={priority.id}
                      type="button"
                      onClick={() => handleInputChange('priority', priority.id)}
                      className={`p-4 rounded-lg border-2 text-left transition-all duration-200 ${
                        formData.priority === priority.id
                          ? 'border-primary-500 bg-primary-50'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <div className={`font-medium ${priority.color} mb-1`}>
                        {priority.name}
                      </div>
                      <div className="text-sm text-gray-600">
                        {priority.description}
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Checkboxes de Impacto */}
              <div className="space-y-3">
                <div className="flex items-start gap-3">
                  <input
                    id="affectsAccuracy"
                    type="checkbox"
                    checked={formData.affectsAccuracy}
                    onChange={(e) => handleInputChange('affectsAccuracy', e.target.checked)}
                    className="mt-1 h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                  />
                  <label htmlFor="affectsAccuracy" className="text-sm text-gray-700">
                    <span className="font-medium">Afecta la precisión del cálculo</span>
                    <br />
                    <span className="text-gray-500">Esta sugerencia corrige o mejora la precisión de los resultados</span>
                  </label>
                </div>

                <div className="flex items-start gap-3">
                  <input
                    id="affectsCompliance"
                    type="checkbox"
                    checked={formData.affectsCompliance}
                    onChange={(e) => handleInputChange('affectsCompliance', e.target.checked)}
                    className="mt-1 h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                  />
                  <label htmlFor="affectsCompliance" className="text-sm text-gray-700">
                    <span className="font-medium">Afecta el cumplimiento normativo</span>
                    <br />
                    <span className="text-gray-500">Esta sugerencia está relacionada con requisitos del NEC u otras normas</span>
                  </label>
                </div>
              </div>
            </div>
          </div>

          {/* Referencias */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold text-gray-900">
                Referencias (Opcional)
              </h2>
              <button
                type="button"
                onClick={addReference}
                className="px-3 py-1 text-sm bg-primary-100 text-primary-700 rounded-lg hover:bg-primary-200 transition-colors"
              >
                Agregar Referencia
              </button>
            </div>

            {formData.references && formData.references.length > 0 && (
              <div className="space-y-3">
                {formData.references.map((reference, index) => (
                  <div key={index} className="flex gap-3">
                    <input
                      type="text"
                      value={reference}
                      onChange={(e) => updateReference(index, e.target.value)}
                      placeholder="Ej: NEC-SE-HM, Sección 9.3.2 o Paper técnico, URL, etc."
                      className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                    />
                    <button
                      type="button"
                      onClick={() => removeReference(index)}
                      className="p-2 text-gray-400 hover:text-red-600 transition-colors"
                    >
                      <XMarkIcon className="h-4 w-4" />
                    </button>
                  </div>
                ))}
              </div>
            )}

            <p className="text-sm text-gray-500 mt-3">
              Incluye referencias a normas, papers técnicos, libros o fuentes que respalden tu sugerencia.
            </p>
          </div>

          {/* Contacto */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">
              Seguimiento
            </h2>

            <div className="flex items-start gap-3">
              <input
                id="contactForFollowUp"
                type="checkbox"
                checked={formData.contactForFollowUp}
                onChange={(e) => handleInputChange('contactForFollowUp', e.target.checked)}
                className="mt-1 h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
              />
              <label htmlFor="contactForFollowUp" className="text-sm text-gray-700">
                <span className="font-medium">Acepto ser contactado para seguimiento</span>
                <br />
                <span className="text-gray-500">
                  Nuestro equipo técnico podrá contactarte para aclarar detalles o notificarte sobre el estado de tu sugerencia
                </span>
              </label>
            </div>
          </div>

          {/* Botones de Acción */}
          <div className="flex justify-end gap-4 bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
            <button
              type="button"
              onClick={onCancel}
              className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-8 py-3 bg-gradient-to-r from-primary-600 to-secondary-500 text-white rounded-lg font-medium transition-all duration-200 transform hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
            >
              {isSubmitting ? (
                <>
                  <div className="animate-spin h-4 w-4 border-2 border-white rounded-full border-t-transparent" />
                  Enviando...
                </>
              ) : (
                <>
                  <PaperAirplaneIcon className="h-4 w-4" />
                  Enviar Sugerencia
                </>
              )}
            </button>
          </div>
        </form>

        {/* Nota informativa */}
        <div className="bg-blue-50 border border-blue-200 rounded-xl p-6 mt-8">
          <div className="flex gap-3">
            <LightBulbIcon className="h-5 w-5 text-blue-600 mt-0.5" />
            <div>
              <h3 className="text-sm font-medium text-blue-900 mb-1">
                Proceso de Revisión
              </h3>
              <p className="text-sm text-blue-800">
                Tu sugerencia será revisada por nuestro equipo técnico y expertos en normativa NEC. 
                Te notificaremos sobre el estado de tu propuesta y su posible implementación en futuras versiones de la plantilla.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SuggestTemplateChange;