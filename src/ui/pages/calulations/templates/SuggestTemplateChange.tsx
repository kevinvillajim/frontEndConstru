import React, { useState, useEffect } from 'react';
import { useNavigate, useParams, useLocation } from 'react-router-dom';
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
  InformationCircleIcon,
  UserIcon,
  ClockIcon,
} from '@heroicons/react/24/outline';

// Types y hooks
import type { 
  PublicCalculationTemplate, 
  TemplateSuggestion, 
  SuggestionType, 
  SuggestionPriority 
} from '../shared/types/template.types';
import { useTemplates } from '../shared/hooks/useTemplates';

interface SuggestionFormData {
  suggestionType: SuggestionType;
  title: string;
  description: string;
  currentValue: string;
  proposedValue: string;
  justification: string;
  priority: SuggestionPriority;
  affectsAccuracy: boolean;
  affectsCompliance: boolean;
  references: string[];
  contactForFollowUp: boolean;
}

interface SuggestTemplateChangeProps {
  template?: PublicCalculationTemplate;
  onSubmit?: (suggestion: TemplateSuggestion) => void;
  onCancel?: () => void;
}

const suggestionTypes = [
  {
    id: 'formula' as SuggestionType,
    name: 'Fórmula de Cálculo',
    description: 'Mejorar o corregir la fórmula matemática utilizada',
    icon: CalculatorIcon,
    color: 'text-blue-600',
    bgColor: 'bg-blue-50',
    borderColor: 'border-blue-200',
  },
  {
    id: 'parameters' as SuggestionType,
    name: 'Parámetros de Entrada',
    description: 'Agregar, modificar o quitar parámetros de entrada',
    icon: CodeBracketIcon,
    color: 'text-green-600',
    bgColor: 'bg-green-50',
    borderColor: 'border-green-200',
  },
  {
    id: 'description' as SuggestionType,
    name: 'Descripción',
    description: 'Mejorar la descripción o explicación de la plantilla',
    icon: DocumentTextIcon,
    color: 'text-purple-600',
    bgColor: 'bg-purple-50',
    borderColor: 'border-purple-200',
  },
  {
    id: 'requirements' as SuggestionType,
    name: 'Requisitos',
    description: 'Actualizar los requisitos necesarios para el cálculo',
    icon: ExclamationTriangleIcon,
    color: 'text-orange-600',
    bgColor: 'bg-orange-50',
    borderColor: 'border-orange-200',
  },
  {
    id: 'necReference' as SuggestionType,
    name: 'Referencia NEC',
    description: 'Actualizar o corregir las referencias normativas',
    icon: BookOpenIcon,
    color: 'text-red-600',
    bgColor: 'bg-red-50',
    borderColor: 'border-red-200',
  },
  {
    id: 'other' as SuggestionType,
    name: 'Otro',
    description: 'Cualquier otra mejora o corrección',
    icon: SparklesIcon,
    color: 'text-gray-600',
    bgColor: 'bg-gray-50',
    borderColor: 'border-gray-200',
  },
];

const priorityOptions = [
  { 
    id: 'low' as SuggestionPriority, 
    name: 'Baja', 
    description: 'Mejora menor o estética', 
    color: 'text-green-600',
    bgColor: 'bg-green-50',
    icon: '📝'
  },
  { 
    id: 'medium' as SuggestionPriority, 
    name: 'Media', 
    description: 'Mejora funcional importante', 
    color: 'text-yellow-600',
    bgColor: 'bg-yellow-50',
    icon: '⚠️'
  },
  { 
    id: 'high' as SuggestionPriority, 
    name: 'Alta', 
    description: 'Error crítico o problema de precisión', 
    color: 'text-red-600',
    bgColor: 'bg-red-50',
    icon: '🚨'
  },
];

// Mock template si no viene como prop (para pruebas)
const mockTemplate: PublicCalculationTemplate = {
  id: 'template-001',
  name: 'Cálculo de Escaleras Residenciales',
  description: 'Plantilla para el cálculo de dimensiones de escaleras según NEC',
  longDescription: 'Cálculo completo que incluye huella, contrahuella, ancho y altura total de escaleras residenciales',
  category: 'architectural',
  subcategory: 'circulation',
  targetProfessions: ['architect'],
  difficulty: 'intermediate',
  estimatedTime: '10-15 min',
  necReference: 'NEC-HS-A, Art. 45',
  tags: ['escaleras', 'residencial', 'circulación'],
  isPublic: true,
  isActive: true,
  status: 'active',
  sharedWith: [],
  usageCount: 245,
  version: '2.1',
  createdAt: '2024-01-15T10:30:00Z',
  lastModified: '2024-02-20T14:45:00Z',
  parameters: [],
  verified: true,
  downloadCount: 150,
  communityRating: {
    average: 4.5,
    count: 23,
    distribution: { 1: 0, 2: 1, 3: 2, 4: 8, 5: 12 }
  },
};

const SuggestTemplateChange: React.FC<SuggestTemplateChangeProps> = ({
  template = mockTemplate,
  onSubmit,
  onCancel,
}) => {
  const navigate = useNavigate();
  const { templateId } = useParams();
  const location = useLocation();
  
  // Hook para envío de sugerencias
  const { submitSuggestion } = useTemplates({ autoLoad: false });

  // Estado del formulario
  const [formData, setFormData] = useState<SuggestionFormData>({
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
  const [currentStep, setCurrentStep] = useState(0);
  const [submitSuccess, setSubmitSuccess] = useState(false);

  // Obtener tipo seleccionado
  const selectedType = suggestionTypes.find(type => type.id === formData.suggestionType);

  // Validación del formulario
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

    // Validar que la justificación tenga suficiente detalle
    if (formData.justification.trim().length < 50) {
      newErrors.justification = 'La justificación debe tener al menos 50 caracteres';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Manejo de cambios en el formulario
  const handleInputChange = (field: keyof SuggestionFormData, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    
    // Limpiar error del campo si existe
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  // Manejo de referencias
  const addReference = () => {
    setFormData(prev => ({
      ...prev,
      references: [...prev.references, '']
    }));
  };

  const updateReference = (index: number, value: string) => {
    setFormData(prev => ({
      ...prev,
      references: prev.references.map((ref, i) => i === index ? value : ref)
    }));
  };

  const removeReference = (index: number) => {
    setFormData(prev => ({
      ...prev,
      references: prev.references.filter((_, i) => i !== index)
    }));
  };

  // Envío del formulario
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      const suggestionData: Partial<TemplateSuggestion> = {
        templateId: template.id,
        templateName: template.name,
        ...formData,
        references: formData.references.filter(ref => ref.trim() !== ''),
      };

      const result = await submitSuggestion(suggestionData);
      
      if (onSubmit) {
        onSubmit(result);
      } else {
        setSubmitSuccess(true);
      }
    } catch (error) {
      console.error('Error submitting suggestion:', error);
      setErrors({ submit: 'Error al enviar la sugerencia. Intenta nuevamente.' });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancel = () => {
    if (onCancel) {
      onCancel();
    } else {
      navigate(-1);
    }
  };

  // Pasos del formulario
  const steps = [
    { id: 0, name: 'Tipo de Sugerencia', icon: SparklesIcon },
    { id: 1, name: 'Detalles', icon: DocumentTextIcon },
    { id: 2, name: 'Prioridad e Impacto', icon: ExclamationTriangleIcon },
    { id: 3, name: 'Referencias', icon: BookOpenIcon },
    { id: 4, name: 'Revisar y Enviar', icon: CheckIcon },
  ];

  // Pantalla de éxito
  if (submitSuccess) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-white rounded-2xl shadow-lg p-8 text-center">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <CheckIcon className="h-8 w-8 text-green-600" />
          </div>
          <h2 className="text-xl font-semibold text-gray-900 mb-2">
            ¡Sugerencia Enviada!
          </h2>
          <p className="text-gray-600 mb-6">
            Tu sugerencia ha sido enviada exitosamente. Nuestro equipo técnico la revisará y te contactaremos si es necesario.
          </p>
          <div className="space-y-2 text-sm text-gray-500 mb-6">
            <p>• Tiempo estimado de revisión: 3-5 días laborables</p>
            <p>• Recibirás una notificación sobre el estado</p>
            <p>• Tu contribución ayuda a mejorar la plataforma</p>
          </div>
          <button
            onClick={handleCancel}
            className="w-full px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
          >
            Continuar
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center gap-4 mb-6">
            <button
              onClick={handleCancel}
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
            <div className="flex-1">
              <h1 className="text-2xl font-bold text-gray-900 mb-2">
                Sugerir Mejora para Plantilla
              </h1>
              <p className="text-gray-600 mb-4">
                Ayúdanos a mejorar la plantilla "{template.name}" con tus conocimientos y experiencia.
              </p>
              
              {/* Información de la plantilla */}
              <div className="bg-gray-50 rounded-lg p-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                  <div className="flex items-center gap-2">
                    <BookOpenIcon className="h-4 w-4 text-gray-500" />
                    <span className="text-gray-600">NEC:</span>
                    <span className="font-medium">{template.necReference}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <UserIcon className="h-4 w-4 text-gray-500" />
                    <span className="text-gray-600">Categoría:</span>
                    <span className="font-medium">{template.category}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <ClockIcon className="h-4 w-4 text-gray-500" />
                    <span className="text-gray-600">Usos:</span>
                    <span className="font-medium">{template.usageCount}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Progress Steps */}
      <div className="bg-white border-b border-gray-200">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            {steps.map((step, index) => (
              <div key={step.id} className="flex items-center">
                <button
                  onClick={() => setCurrentStep(step.id)}
                  className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                    currentStep === step.id
                      ? 'bg-primary-100 text-primary-700'
                      : currentStep > step.id
                      ? 'text-green-700 hover:bg-green-50'
                      : 'text-gray-500 hover:bg-gray-50'
                  }`}
                >
                  <step.icon className="h-4 w-4" />
                  <span className="hidden sm:inline">{step.name}</span>
                  {currentStep > step.id && (
                    <CheckIcon className="h-3 w-3 text-green-600" />
                  )}
                </button>
                {index < steps.length - 1 && (
                  <div className="h-px bg-gray-300 w-8 mx-2" />
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <form onSubmit={handleSubmit} className="max-w-4xl mx-auto">
          {/* Paso 0: Tipo de Sugerencia */}
          {currentStep === 0 && (
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-6">
                ¿Qué aspecto te gustaría mejorar?
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {suggestionTypes.map((type) => (
                  <button
                    key={type.id}
                    type="button"
                    onClick={() => handleInputChange('suggestionType', type.id)}
                    className={`p-6 rounded-xl border-2 text-left transition-all duration-200 ${
                      formData.suggestionType === type.id
                        ? `border-primary-500 ${type.bgColor}`
                        : `${type.borderColor} hover:${type.bgColor}`
                    }`}
                  >
                    <div className="flex items-center gap-3 mb-3">
                      <div className={`p-2 rounded-lg ${type.bgColor}`}>
                        <type.icon className={`h-6 w-6 ${type.color}`} />
                      </div>
                      <span className="font-semibold text-gray-900">{type.name}</span>
                    </div>
                    <p className="text-sm text-gray-600">{type.description}</p>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Paso 1: Detalles */}
          {currentStep === 1 && (
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-6 flex items-center gap-2">
                <selectedType?.icon className={`h-5 w-5 ${selectedType?.color}`} />
                Detalles de la Sugerencia - {selectedType?.name}
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
                    placeholder="ej: Corregir factor de seguridad en cálculo de vigas"
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
                        Contenido Actual
                      </label>
                      <textarea
                        value={formData.currentValue}
                        onChange={(e) => handleInputChange('currentValue', e.target.value)}
                        rows={4}
                        placeholder="Copia aquí el contenido actual que quieres cambiar..."
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                      />
                      <p className="text-xs text-gray-500 mt-1">
                        Opcional: Ayuda a contextualizar tu sugerencia
                      </p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Contenido Propuesto *
                      </label>
                      <textarea
                        value={formData.proposedValue}
                        onChange={(e) => handleInputChange('proposedValue', e.target.value)}
                        rows={4}
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
                    rows={5}
                    placeholder="Explica por qué tu sugerencia es necesaria, incluye fundamentos técnicos, experiencia práctica, o referencias normativas..."
                    className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 ${
                      errors.justification ? 'border-red-500' : 'border-gray-300'
                    }`}
                  />
                  <div className="flex justify-between items-center mt-1">
                    {errors.justification && (
                      <p className="text-sm text-red-600">{errors.justification}</p>
                    )}
                    <p className="text-xs text-gray-500 ml-auto">
                      {formData.justification.length}/50 caracteres mínimos
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Paso 2: Prioridad e Impacto */}
          {currentStep === 2 && (
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-6">
                Prioridad e Impacto
              </h2>

              <div className="space-y-6">
                {/* Prioridad */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-3">
                    ¿Qué tan urgente es esta sugerencia?
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
                        <div className="flex items-center gap-3 mb-2">
                          <span className="text-xl">{priority.icon}</span>
                          <span className={`font-semibold ${priority.color}`}>
                            {priority.name}
                          </span>
                        </div>
                        <p className="text-sm text-gray-600">
                          {priority.description}
                        </p>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Checkboxes de Impacto */}
                <div className="space-y-4">
                  <h3 className="text-sm font-medium text-gray-700">
                    ¿Qué aspectos afecta tu sugerencia?
                  </h3>
                  
                  <div className="space-y-3">
                    <div className="flex items-start gap-3 p-4 border border-gray-200 rounded-lg">
                      <input
                        id="affectsAccuracy"
                        type="checkbox"
                        checked={formData.affectsAccuracy}
                        onChange={(e) => handleInputChange('affectsAccuracy', e.target.checked)}
                        className="mt-1 h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                      />
                      <div>
                        <label htmlFor="affectsAccuracy" className="text-sm font-medium text-gray-900">
                          Precisión del cálculo
                        </label>
                        <p className="text-sm text-gray-600 mt-1">
                          Esta sugerencia corrige o mejora la precisión de los resultados
                        </p>
                      </div>
                    </div>

                    <div className="flex items-start gap-3 p-4 border border-gray-200 rounded-lg">
                      <input
                        id="affectsCompliance"
                        type="checkbox"
                        checked={formData.affectsCompliance}
                        onChange={(e) => handleInputChange('affectsCompliance', e.target.checked)}
                        className="mt-1 h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                      />
                      <div>
                        <label htmlFor="affectsCompliance" className="text-sm font-medium text-gray-900">
                          Cumplimiento normativo
                        </label>
                        <p className="text-sm text-gray-600 mt-1">
                          Esta sugerencia está relacionada con requisitos del NEC u otras normas
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Paso 3: Referencias */}
          {currentStep === 3 && (
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold text-gray-900">
                  Referencias y Fuentes
                </h2>
                <button
                  type="button"
                  onClick={addReference}
                  className="px-3 py-1 text-sm bg-primary-100 text-primary-700 rounded-lg hover:bg-primary-200 transition-colors"
                >
                  Agregar Referencia
                </button>
              </div>

              <div className="space-y-4">
                {formData.references.length === 0 ? (
                  <div className="text-center py-8 text-gray-500">
                    <BookOpenIcon className="h-12 w-12 mx-auto mb-3 text-gray-300" />
                    <p className="mb-2">No has agregado referencias</p>
                    <p className="text-sm">
                      Las referencias ayudan a validar tu sugerencia pero son opcionales
                    </p>
                  </div>
                ) : (
                  formData.references.map((reference, index) => (
                    <div key={index} className="flex gap-3">
                      <input
                        type="text"
                        value={reference}
                        onChange={(e) => updateReference(index, e.target.value)}
                        placeholder="ej: NEC-SE-HM, Sección 9.3.2 o URL de paper técnico"
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
                  ))
                )}

                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <div className="flex gap-3">
                    <InformationCircleIcon className="h-5 w-5 text-blue-600 mt-0.5" />
                    <div>
                      <h3 className="text-sm font-medium text-blue-900 mb-1">
                        Tipos de referencias útiles
                      </h3>
                      <ul className="text-sm text-blue-800 space-y-1">
                        <li>• Códigos y normas (NEC, ACI, AISC, etc.)</li>
                        <li>• Papers técnicos y publicaciones científicas</li>
                        <li>• Libros de texto especializados</li>
                        <li>• Documentos oficiales de organismos técnicos</li>
                      </ul>
                    </div>
                  </div>
                </div>

                {/* Contacto para seguimiento */}
                <div className="border-t border-gray-200 pt-6">
                  <div className="flex items-start gap-3">
                    <input
                      id="contactForFollowUp"
                      type="checkbox"
                      checked={formData.contactForFollowUp}
                      onChange={(e) => handleInputChange('contactForFollowUp', e.target.checked)}
                      className="mt-1 h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                    />
                    <div>
                      <label htmlFor="contactForFollowUp" className="text-sm font-medium text-gray-900">
                        Acepto ser contactado para seguimiento
                      </label>
                      <p className="text-sm text-gray-600 mt-1">
                        Nuestro equipo técnico podrá contactarte para aclarar detalles o notificarte sobre el estado de tu sugerencia
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Paso 4: Revisar y Enviar */}
          {currentStep === 4 && (
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-6">
                Revisar y Enviar Sugerencia
              </h2>

              <div className="space-y-6">
                {/* Resumen */}
                <div className="bg-gray-50 rounded-lg p-4">
                  <h3 className="font-medium text-gray-900 mb-3">Resumen de tu sugerencia</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="text-gray-600">Tipo:</span>
                      <span className="ml-2 font-medium">{selectedType?.name}</span>
                    </div>
                    <div>
                      <span className="text-gray-600">Prioridad:</span>
                      <span className="ml-2 font-medium">
                        {priorityOptions.find(p => p.id === formData.priority)?.name}
                      </span>
                    </div>
                    <div>
                      <span className="text-gray-600">Afecta precisión:</span>
                      <span className="ml-2 font-medium">{formData.affectsAccuracy ? 'Sí' : 'No'}</span>
                    </div>
                    <div>
                      <span className="text-gray-600">Afecta normativa:</span>
                      <span className="ml-2 font-medium">{formData.affectsCompliance ? 'Sí' : 'No'}</span>
                    </div>
                    <div>
                      <span className="text-gray-600">Referencias:</span>
                      <span className="ml-2 font-medium">{formData.references.filter(r => r.trim()).length}</span>
                    </div>
                    <div>
                      <span className="text-gray-600">Seguimiento:</span>
                      <span className="ml-2 font-medium">{formData.contactForFollowUp ? 'Sí' : 'No'}</span>
                    </div>
                  </div>
                </div>

                {/* Vista previa de contenido */}
                <div className="border border-gray-200 rounded-lg p-4">
                  <h4 className="font-medium text-gray-900 mb-2">{formData.title}</h4>
                  <p className="text-gray-700 text-sm mb-3">{formData.description}</p>
                  {formData.justification && (
                    <div className="bg-blue-50 border-l-4 border-blue-400 p-3">
                      <p className="text-blue-800 text-sm">{formData.justification}</p>
                    </div>
                  )}
                </div>

                {/* Advertencias */}
                {(formData.affectsAccuracy || formData.affectsCompliance) && (
                  <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                    <div className="flex gap-3">
                      <ExclamationTriangleIcon className="h-5 w-5 text-yellow-600 mt-0.5" />
                      <div>
                        <h3 className="text-sm font-medium text-yellow-900 mb-1">
                          Sugerencia de Alto Impacto
                        </h3>
                        <p className="text-sm text-yellow-800">
                          Has marcado que esta sugerencia afecta la precisión o el cumplimiento normativo.
                          Será revisada con especial atención por nuestros expertos técnicos.
                        </p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Navegación */}
          <div className="flex justify-between items-center mt-8 pt-6 border-t border-gray-200">
            <div>
              {currentStep > 0 && (
                <button
                  type="button"
                  onClick={() => setCurrentStep(currentStep - 1)}
                  className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  ← Anterior
                </button>
              )}
            </div>

            <div className="flex gap-3">
              <button
                type="button"
                onClick={handleCancel}
                className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Cancelar
              </button>

              {currentStep < steps.length - 1 ? (
                <button
                  type="button"
                  onClick={() => setCurrentStep(currentStep + 1)}
                  className="px-6 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
                >
                  Siguiente →
                </button>
              ) : (
                <button
                  type="submit"
                  disabled={isSubmitting || !validateForm()}
                  className="px-8 py-2 bg-gradient-to-r from-primary-600 to-secondary-500 text-white rounded-lg font-medium transition-all duration-200 transform hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
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
              )}
            </div>
          </div>

          {/* Error de envío */}
          {errors.submit && (
            <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-red-800 text-sm">{errors.submit}</p>
            </div>
          )}
        </form>

        {/* Nota informativa */}
        <div className="bg-blue-50 border border-blue-200 rounded-xl p-6 mt-8 max-w-4xl mx-auto">
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