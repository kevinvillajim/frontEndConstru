// src/ui/pages/calculations/budget/BudgetExportCenter.tsx

import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  ArrowTopRightOnSquareIcon,
  ArrowLeftIcon,
  DocumentArrowDownIcon,
  EyeIcon,
  EnvelopeIcon,
  CheckIcon,
  ExclamationTriangleIcon,
  UserIcon,
  BuildingOfficeIcon,
  DocumentTextIcon,
} from "@heroicons/react/24/outline";

import {
  ExportFormat,
} from "../shared/types/budget.types";


import type {
  CalculationBudget,
  GenerateBudgetDocumentRequest,
  BrandingSettings,
  ClientInfo,
  DocumentSettings,
  DeliverySettings
} from "../shared/types/budget.types";

const BudgetExportCenter: React.FC = () => {
  const { budgetId } = useParams();
  const navigate = useNavigate();
  
  const [budget, setBudget] = useState<CalculationBudget | null>(null);
  const [loading, setLoading] = useState(true);
  const [exporting, setExporting] = useState(false);
  const [activeStep, setActiveStep] = useState(1);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  // Estados del formulario de exportación
  const [exportRequest, setExportRequest] = useState<GenerateBudgetDocumentRequest>({
    format: ExportFormat.PDF,
    branding: {
      companyName: '',
      professionalName: '',
      professionalTitle: '',
      professionalRegistration: '',
      contactInfo: {
        phone: '',
        email: '',
        address: '',
        website: ''
      },
      colors: {
        primary: '#059669',
        secondary: '#0D9488',
        accent: '#F59E0B'
      }
    },
    clientInfo: {
      name: '',
      company: '',
      address: '',
      phone: '',
      email: '',
      ruc: ''
    },
    documentSettings: {
      includeCalculationDetails: false,
      includeMaterialSpecs: true,
      includeNECReferences: false,
      showPriceBreakdown: true,
      showLaborDetails: true,
      includeTermsAndConditions: true,
      includeValidityPeriod: true,
      validityDays: 30,
      language: 'es',
      currency: 'USD'
    },
    delivery: {
      sendByEmail: false,
      recipientEmails: [],
      emailSubject: '',
      emailMessage: '',
      generateDownloadLink: false
    }
  });

  // Cargar presupuesto al montar
  useEffect(() => {
    if (budgetId) {
      loadBudget();
    }
  }, [budgetId]);

  const loadBudget = async () => {
    try {
      setLoading(true);
      // TODO: Cargar desde API
      // const response = await ApiClient.get<CalculationBudget>(`/api/calculation-budgets/${budgetId}`);
      // setBudget(response);
      
      // Mock data para desarrollo
      const mockBudget: CalculationBudget = {
        id: budgetId!,
        name: "Presupuesto Casa Residencial 180m²",
        description: "Casa unifamiliar de 180m² en Urbanización Los Arrayanes",
        projectId: "project-1",
        budgetType: "complete_project" as any,
        status: "approved" as any,
        lineItems: [],
        summary: {
          materialsTotal: 45000,
          laborTotal: 18000,
          indirectCostsTotal: 5000,
          professionalFeesTotal: 8000,
          contingencyTotal: 3800,
          taxTotal: 9696,
          subtotal: 79800,
          grandTotal: 89496,
          currency: 'USD'
        },
        configuration: {
          includeLabor: true,
          includeProfessionalFees: true,
          includeIndirectCosts: true,
          contingencyPercentage: 5,
          taxPercentage: 12,
          geographicalZone: "QUITO" as any,
          currency: 'USD',
          customMaterials: [],
          customLaborCosts: []
        },
        versions: [],
        createdBy: "user-1",
        createdAt: "2024-01-15T10:00:00Z",
        updatedAt: "2024-01-15T10:00:00Z"
      };
      setBudget(mockBudget);
      
      // Pre-llenar información del cliente si está disponible
      if (mockBudget.projectId) {
        // TODO: Cargar información del cliente desde el proyecto
      }
    } catch (error) {
      console.error('Error loading budget:', error);
    } finally {
      setLoading(false);
    }
  };

  const generatePreview = async () => {
    try {
      // TODO: Llamar API para generar vista previa
      setPreviewUrl('/api/budget-preview.pdf'); // Mock URL
    } catch (error) {
      console.error('Error generating preview:', error);
    }
  };

  const exportDocument = async () => {
    if (!budget) return;

    try {
      setExporting(true);
      
      // Validar campos requeridos
      if (!exportRequest.branding?.companyName || !exportRequest.clientInfo?.name) {
        alert('Por favor completa la información requerida');
        return;
      }

      // TODO: Llamar API para generar y descargar documento
      await new Promise(resolve => setTimeout(resolve, 2000)); // Simular exportación
      
      // Simular descarga
      const link = document.createElement('a');
      link.href = 'data:application/pdf;base64,'; // Mock PDF data
      link.download = `${budget.name}.${exportRequest.format.toLowerCase()}`;
      link.click();

      // TODO: Mostrar toast de éxito
      alert('Documento exportado exitosamente');
      
      // Enviar por email si está configurado
      if (exportRequest.delivery?.sendByEmail && exportRequest.delivery.recipientEmails.length > 0) {
        // TODO: Enviar email
      }
      
    } catch (error) {
      console.error('Error exporting document:', error);
      alert('Error al exportar documento');
    } finally {
      setExporting(false);
    }
  };

  // Renderizar paso 1: Configuración del documento
  const renderDocumentSettingsStep = () => (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
          <DocumentTextIcon className="h-8 w-8 text-white" />
        </div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          Configuración del Documento
        </h2>
        <p className="text-gray-600">
          Personaliza el contenido y formato de tu presupuesto
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Formato y configuración básica */}
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Formato del Documento</h3>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Formato de Exportación
              </label>
              <div className="grid grid-cols-2 gap-3">
                {Object.values(ExportFormat).map((format) => (
                  <button
                    key={format}
                    onClick={() => setExportRequest(prev => ({ ...prev, format }))}
                    className={`
                      p-3 rounded-lg border-2 transition-all duration-200 flex items-center justify-center gap-2
                      ${exportRequest.format === format
                        ? "border-blue-500 bg-blue-50 text-blue-700"
                        : "border-gray-200 hover:border-gray-300"
                      }
                    `}
                  >
                    <DocumentArrowDownIcon className="h-5 w-5" />
                    {format}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Idioma del Documento
              </label>
              <select
                value={exportRequest.documentSettings?.language || 'es'}
                onChange={(e) => setExportRequest(prev => ({
                  ...prev,
                  documentSettings: {
                    ...prev.documentSettings!,
                    language: e.target.value as 'es' | 'en'
                  }
                }))}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500"
              >
                <option value="es">Español</option>
                <option value="en">English</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Validez de la Cotización (días)
              </label>
              <input
                type="number"
                value={exportRequest.documentSettings?.validityDays || 30}
                onChange={(e) => setExportRequest(prev => ({
                  ...prev,
                  documentSettings: {
                    ...prev.documentSettings!,
                    validityDays: parseInt(e.target.value) || 30
                  }
                }))}
                min="1"
                max="365"
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>
        </div>

        {/* Contenido del documento */}
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Contenido a Incluir</h3>
          
          <div className="space-y-4">
            {[
              { key: 'includeMaterialSpecs', label: 'Especificaciones de Materiales', description: 'Detalles técnicos de cada material' },
              { key: 'showPriceBreakdown', label: 'Desglose de Precios', description: 'Mostrar precios unitarios y totales' },
              { key: 'showLaborDetails', label: 'Detalles de Mano de Obra', description: 'Incluir costos de mano de obra' },
              { key: 'includeCalculationDetails', label: 'Detalles de Cálculos', description: 'Mostrar fórmulas y cálculos técnicos' },
              { key: 'includeNECReferences', label: 'Referencias NEC', description: 'Incluir referencias a normativas ecuatorianas' },
              { key: 'includeTermsAndConditions', label: 'Términos y Condiciones', description: 'Incluir condiciones comerciales' },
              { key: 'includeValidityPeriod', label: 'Período de Validez', description: 'Mostrar fecha de vencimiento' }
            ].map((option) => (
              <div key={option.key} className="flex items-start gap-3">
                <input
                  type="checkbox"
                  id={option.key}
                  checked={exportRequest.documentSettings?.[option.key as keyof DocumentSettings] as boolean}
                  onChange={(e) => setExportRequest(prev => ({
                    ...prev,
                    documentSettings: {
                      ...prev.documentSettings!,
                      [option.key]: e.target.checked
                    }
                  }))}
                  className="mt-1 w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
                />
                <label htmlFor={option.key} className="cursor-pointer">
                  <div className="font-medium text-gray-900">{option.label}</div>
                  <div className="text-sm text-gray-600">{option.description}</div>
                </label>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );

  // Renderizar paso 2: Información empresarial
  const renderBrandingStep = () => (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
          <BuildingOfficeIcon className="h-8 w-8 text-white" />
        </div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          Información Empresarial
        </h2>
        <p className="text-gray-600">
          Personaliza la marca y presentación de tu empresa
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Datos de la empresa */}
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Datos de la Empresa</h3>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Nombre de la Empresa *
              </label>
              <input
                type="text"
                value={exportRequest.branding?.companyName || ''}
                onChange={(e) => setExportRequest(prev => ({
                  ...prev,
                  branding: {
                    ...prev.branding!,
                    companyName: e.target.value
                  }
                }))}
                placeholder="Tu Empresa Constructora S.A."
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Profesional Responsable *
              </label>
              <input
                type="text"
                value={exportRequest.branding?.professionalName || ''}
                onChange={(e) => setExportRequest(prev => ({
                  ...prev,
                  branding: {
                    ...prev.branding!,
                    professionalName: e.target.value
                  }
                }))}
                placeholder="Arq. Juan Pérez"
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Título Profesional
              </label>
              <input
                type="text"
                value={exportRequest.branding?.professionalTitle || ''}
                onChange={(e) => setExportRequest(prev => ({
                  ...prev,
                  branding: {
                    ...prev.branding!,
                    professionalTitle: e.target.value
                  }
                }))}
                placeholder="Arquitecto"
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Registro Profesional
              </label>
              <input
                type="text"
                value={exportRequest.branding?.professionalRegistration || ''}
                onChange={(e) => setExportRequest(prev => ({
                  ...prev,
                  branding: {
                    ...prev.branding!,
                    professionalRegistration: e.target.value
                  }
                }))}
                placeholder="CAE-123456"
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>
        </div>

        {/* Información de contacto */}
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Información de Contacto</h3>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Teléfono
              </label>
              <input
                type="tel"
                value={exportRequest.branding?.contactInfo?.phone || ''}
                onChange={(e) => setExportRequest(prev => ({
                  ...prev,
                  branding: {
                    ...prev.branding!,
                    contactInfo: {
                      ...prev.branding!.contactInfo!,
                      phone: e.target.value
                    }
                  }
                }))}
                placeholder="+593 99 123 4567"
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Email
              </label>
              <input
                type="email"
                value={exportRequest.branding?.contactInfo?.email || ''}
                onChange={(e) => setExportRequest(prev => ({
                  ...prev,
                  branding: {
                    ...prev.branding!,
                    contactInfo: {
                      ...prev.branding!.contactInfo!,
                      email: e.target.value
                    }
                  }
                }))}
                placeholder="info@tuempresa.com"
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Dirección
              </label>
              <textarea
                value={exportRequest.branding?.contactInfo?.address || ''}
                onChange={(e) => setExportRequest(prev => ({
                  ...prev,
                  branding: {
                    ...prev.branding!,
                    contactInfo: {
                      ...prev.branding!.contactInfo!,
                      address: e.target.value
                    }
                  }
                }))}
                placeholder="Av. Principal 123, Quito, Ecuador"
                rows={2}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Sitio Web
              </label>
              <input
                type="url"
                value={exportRequest.branding?.contactInfo?.website || ''}
                onChange={(e) => setExportRequest(prev => ({
                  ...prev,
                  branding: {
                    ...prev.branding!,
                    contactInfo: {
                      ...prev.branding!.contactInfo!,
                      website: e.target.value
                    }
                  }
                }))}
                placeholder="https://tuempresa.com"
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  // Renderizar paso 3: Información del cliente
  const renderClientInfoStep = () => (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-green-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
          <UserIcon className="h-8 w-8 text-white" />
        </div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          Información del Cliente
        </h2>
        <p className="text-gray-600">
          Datos del cliente para el encabezado del presupuesto
        </p>
      </div>

      <div className="max-w-2xl mx-auto">
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Datos del Cliente</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Nombre del Cliente *
              </label>
              <input
                type="text"
                value={exportRequest.clientInfo?.name || ''}
                onChange={(e) => setExportRequest(prev => ({
                  ...prev,
                  clientInfo: {
                    ...prev.clientInfo!,
                    name: e.target.value
                  }
                }))}
                placeholder="Juan Carlos Pérez"
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Empresa (opcional)
              </label>
              <input
                type="text"
                value={exportRequest.clientInfo?.company || ''}
                onChange={(e) => setExportRequest(prev => ({
                  ...prev,
                  clientInfo: {
                    ...prev.clientInfo!,
                    company: e.target.value
                  }
                }))}
                placeholder="Inmobiliaria XYZ"
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Teléfono
              </label>
              <input
                type="tel"
                value={exportRequest.clientInfo?.phone || ''}
                onChange={(e) => setExportRequest(prev => ({
                  ...prev,
                  clientInfo: {
                    ...prev.clientInfo!,
                    phone: e.target.value
                  }
                }))}
                placeholder="+593 99 987 6543"
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Email
              </label>
              <input
                type="email"
                value={exportRequest.clientInfo?.email || ''}
                onChange={(e) => setExportRequest(prev => ({
                  ...prev,
                  clientInfo: {
                    ...prev.clientInfo!,
                    email: e.target.value
                  }
                }))}
                placeholder="cliente@email.com"
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Dirección
              </label>
              <textarea
                value={exportRequest.clientInfo?.address || ''}
                onChange={(e) => setExportRequest(prev => ({
                  ...prev,
                  clientInfo: {
                    ...prev.clientInfo!,
                    address: e.target.value
                  }
                }))}
                placeholder="Av. Secundaria 456, Urbanización Los Arrayanes, Quito"
                rows={2}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                RUC / Cédula
              </label>
              <input
                type="text"
                value={exportRequest.clientInfo?.ruc || ''}
                onChange={(e) => setExportRequest(prev => ({
                  ...prev,
                  clientInfo: {
                    ...prev.clientInfo!,
                    ruc: e.target.value
                  }
                }))}
                placeholder="1234567890001"
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  // Renderizar paso 4: Entrega y finalización
  const renderDeliveryStep = () => (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <div className="w-16 h-16 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
          <EnvelopeIcon className="h-8 w-8 text-white" />
        </div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          Entrega del Documento
        </h2>
        <p className="text-gray-600">
          Configura cómo entregar el presupuesto a tu cliente
        </p>
      </div>

      <div className="max-w-4xl mx-auto space-y-8">
        {/* Opciones de entrega */}
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Opciones de Entrega</h3>
          
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <input
                type="checkbox"
                id="sendByEmail"
                checked={exportRequest.delivery?.sendByEmail || false}
                onChange={(e) => setExportRequest(prev => ({
                  ...prev,
                  delivery: {
                    ...prev.delivery!,
                    sendByEmail: e.target.checked
                  }
                }))}
                className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
              />
              <label htmlFor="sendByEmail" className="cursor-pointer">
                <div className="font-medium text-gray-900">Enviar por Email</div>
                <div className="text-sm text-gray-600">Enviar automáticamente el documento por correo electrónico</div>
              </label>
            </div>

            {exportRequest.delivery?.sendByEmail && (
              <div className="ml-7 space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Destinatarios (separados por comas)
                  </label>
                  <input
                    type="text"
                    value={exportRequest.delivery.recipientEmails.join(', ')}
                    onChange={(e) => setExportRequest(prev => ({
                      ...prev,
                      delivery: {
                        ...prev.delivery!,
                        recipientEmails: e.target.value.split(',').map(email => email.trim()).filter(Boolean)
                      }
                    }))}
                    placeholder="cliente@email.com, copia@empresa.com"
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Asunto del Email
                  </label>
                  <input
                    type="text"
                    value={exportRequest.delivery.emailSubject || `Presupuesto: ${budget?.name || ''}`}
                    onChange={(e) => setExportRequest(prev => ({
                      ...prev,
                      delivery: {
                        ...prev.delivery!,
                        emailSubject: e.target.value
                      }
                    }))}
                    placeholder={`Presupuesto: ${budget?.name || ''}`}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Mensaje del Email
                  </label>
                  <textarea
                    value={exportRequest.delivery.emailMessage || ''}
                    onChange={(e) => setExportRequest(prev => ({
                      ...prev,
                      delivery: {
                        ...prev.delivery!,
                        emailMessage: e.target.value
                      }
                    }))}
                    placeholder="Estimado cliente, adjunto encontrará el presupuesto solicitado..."
                    rows={3}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>
            )}

            <div className="flex items-center gap-3">
              <input
                type="checkbox"
                id="generateDownloadLink"
                checked={exportRequest.delivery?.generateDownloadLink || false}
                onChange={(e) => setExportRequest(prev => ({
                  ...prev,
                  delivery: {
                    ...prev.delivery!,
                    generateDownloadLink: e.target.checked
                  }
                }))}
                className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
              />
              <label htmlFor="generateDownloadLink" className="cursor-pointer">
                <div className="font-medium text-gray-900">Generar Enlace de Descarga</div>
                <div className="text-sm text-gray-600">Crear enlace compartible para descargar el documento</div>
              </label>
            </div>
          </div>
        </div>

        {/* Vista previa */}
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Vista Previa</h3>
            <button
              onClick={generatePreview}
              className="flex items-center gap-2 px-4 py-2 text-blue-600 hover:text-blue-800 hover:bg-blue-50 rounded-lg transition-colors"
            >
              <EyeIcon className="h-4 w-4" />
              Generar Vista Previa
            </button>
          </div>
          
          {previewUrl ? (
            <div className="border border-gray-200 rounded-lg p-4 bg-gray-50">
              <iframe
                src={previewUrl}
                className="w-full h-96 rounded border border-gray-300"
                title="Vista previa del documento"
              />
            </div>
          ) : (
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
              <EyeIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600">
                Genera una vista previa para revisar cómo se verá el documento final
              </p>
            </div>
          )}
        </div>

        {/* Resumen final */}
        <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-6">
          <h3 className="text-lg font-semibold text-emerald-900 mb-4">Resumen de Exportación</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm">
            <div>
              <h4 className="font-medium text-emerald-800 mb-2">Documento</h4>
              <ul className="space-y-1 text-emerald-700">
                <li>• Formato: {exportRequest.format}</li>
                <li>• Idioma: {exportRequest.documentSettings?.language === 'es' ? 'Español' : 'English'}</li>
                <li>• Validez: {exportRequest.documentSettings?.validityDays} días</li>
                <li>• Total: ${budget?.summary.grandTotal.toLocaleString('es-EC')}</li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-medium text-emerald-800 mb-2">Entrega</h4>
              <ul className="space-y-1 text-emerald-700">
                <li>• Email: {exportRequest.delivery?.sendByEmail ? 'Sí' : 'No'}</li>
                {exportRequest.delivery?.sendByEmail && (
                  <li>• Destinatarios: {exportRequest.delivery.recipientEmails.length}</li>
                )}
                <li>• Enlace de descarga: {exportRequest.delivery?.generateDownloadLink ? 'Sí' : 'No'}</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  // Renderizar indicador de pasos
  const renderStepIndicator = () => (
    <div className="bg-white border-b border-gray-200 px-4 py-6">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center justify-between">
          {[
            { number: 1, title: 'Documento', icon: DocumentTextIcon },
            { number: 2, title: 'Empresa', icon: BuildingOfficeIcon },
            { number: 3, title: 'Cliente', icon: UserIcon },
            { number: 4, title: 'Entrega', icon: EnvelopeIcon }
          ].map((step, index) => {
            const isActive = step.number === activeStep;
            const isCompleted = step.number < activeStep;

            return (
              <div key={step.number} className="flex items-center">
                <div
                  className={`flex items-center cursor-pointer ${
                    step.number <= activeStep ? "opacity-100" : "opacity-50"
                  }`}
                  onClick={() => setActiveStep(step.number)}
                >
                  <div
                    className={`
                      w-10 h-10 rounded-full flex items-center justify-center border-2 transition-all duration-200
                      ${isCompleted
                        ? "bg-emerald-500 border-emerald-500 text-white"
                        : isActive
                        ? "bg-blue-100 border-blue-500 text-blue-700"
                        : "bg-gray-100 border-gray-300 text-gray-500"
                      }
                    `}
                  >
                    {isCompleted ? (
                      <CheckIcon className="h-5 w-5" />
                    ) : (
                      <step.icon className="h-5 w-5" />
                    )}
                  </div>
                  <div className="ml-3 hidden sm:block">
                    <div
                      className={`text-sm font-medium ${
                        isActive ? "text-blue-700" : "text-gray-700"
                      }`}
                    >
                      {step.title}
                    </div>
                  </div>
                </div>

                {index < 3 && (
                  <div
                    className={`hidden sm:block w-12 h-0.5 mx-4 ${
                      step.number < activeStep
                        ? "bg-emerald-500"
                        : "bg-gray-300"
                    }`}
                  />
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );

  // Renderizar botones de navegación
  const renderNavigationButtons = () => (
    <div className="bg-white border-t border-gray-200 px-4 py-6">
      <div className="max-w-4xl mx-auto flex items-center justify-between">
        <button
          onClick={() => activeStep > 1 ? setActiveStep(activeStep - 1) : navigate("/calculations/budget")}
          className="flex items-center gap-2 px-6 py-3 text-gray-700 hover:text-gray-900 hover:bg-gray-100 rounded-xl font-medium transition-all duration-200"
        >
          <ArrowLeftIcon className="h-5 w-5" />
          {activeStep > 1 ? 'Anterior' : 'Volver'}
        </button>

        <div className="flex items-center gap-4">
          {activeStep === 4 && (
            <button
              onClick={generatePreview}
              className="flex items-center gap-2 px-6 py-3 text-blue-700 hover:text-blue-800 hover:bg-blue-50 rounded-xl font-medium transition-all duration-200"
            >
              <EyeIcon className="h-5 w-5" />
              Vista Previa
            </button>
          )}

          {activeStep < 4 ? (
            <button
              onClick={() => setActiveStep(activeStep + 1)}
              className="flex items-center gap-2 px-8 py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white hover:from-blue-700 hover:to-blue-800 rounded-xl font-medium transition-all duration-200 shadow-lg hover:shadow-xl"
            >
              Siguiente
              <ArrowLeftIcon className="h-5 w-5 rotate-180" />
            </button>
          ) : (
            <button
              onClick={exportDocument}
              disabled={exporting || !exportRequest.branding?.companyName || !exportRequest.clientInfo?.name}
              className={`
                flex items-center gap-2 px-8 py-3 rounded-xl font-medium transition-all duration-200 shadow-lg hover:shadow-xl
                ${exporting || !exportRequest.branding?.companyName || !exportRequest.clientInfo?.name
                  ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                  : "bg-gradient-to-r from-emerald-600 to-emerald-700 text-white hover:from-emerald-700 hover:to-emerald-800"
                }
              `}
            >
              {exporting ? (
                <>
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Exportando...
                </>
              ) : (
                <>
                  <DocumentArrowDownIcon className="h-5 w-5" />
                  Exportar Documento
                </>
              )}
            </button>
          )}
        </div>
      </div>
    </div>
  );

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin mx-auto mb-4" />
          <p className="text-gray-600">Cargando centro de exportación...</p>
        </div>
      </div>
    );
  }

  if (!budget) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <ExclamationTriangleIcon className="h-12 w-12 text-red-500 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            Presupuesto no encontrado
          </h3>
          <p className="text-gray-600 mb-4">
            El presupuesto que intentas exportar no existe o no tienes permisos para acceder a él.
          </p>
          <button
            onClick={() => navigate("/calculations/budget")}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Volver a Presupuestos
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-4 py-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center gap-4">
            <button
              onClick={() => navigate("/calculations/budget")}
              className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <ArrowLeftIcon className="h-5 w-5" />
            </button>
            
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-indigo-600 rounded-xl flex items-center justify-center">
                <ArrowTopRightOnSquareIcon className="h-5 w-5 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">
                  Exportar Presupuesto
                </h1>
                <p className="text-sm text-gray-600">
                  {budget.name}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Indicador de pasos */}
      {renderStepIndicator()}

      {/* Contenido principal */}
      <div className="flex-1 py-8">
        <div className="max-w-6xl mx-auto px-4">
          {activeStep === 1 && renderDocumentSettingsStep()}
          {activeStep === 2 && renderBrandingStep()}
          {activeStep === 3 && renderClientInfoStep()}
          {activeStep === 4 && renderDeliveryStep()}
        </div>
      </div>

      {/* Botones de navegación */}
      {renderNavigationButtons()}
    </div>
  );
};

export default BudgetExportCenter;