// src/ui/pages/calculations/budget/BudgetSettings.tsx

import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Cog6ToothIcon,
  ArrowLeftIcon,
  MapPinIcon,
  PaintBrushIcon,
  DocumentDuplicateIcon,
  CheckIcon,
  PhotoIcon,
  ExclamationTriangleIcon
} from "@heroicons/react/24/outline";

import { 
  GeographicalZone,
} from "../shared/types/budget.types";
import type {  BrandingSettings,
  WasteFactors,
  LaborRates,
  IndirectCosts,
  ProfessionalFees} from "../shared/types/budget.types";

const BudgetSettings: React.FC = () => {
  const navigate = useNavigate();
  
  const [activeTab, setActiveTab] = useState<'general' | 'branding' | 'templates' | 'regional'>('general');
  const [saving, setSaving] = useState(false);
  const [changes, setChanges] = useState(false);

  // Estados de configuración
  const [generalSettings, setGeneralSettings] = useState({
    defaultGeographicalZone: GeographicalZone.QUITO,
    defaultCurrency: 'USD',
    defaultContingency: 5,
    defaultTax: 15,
    autoUpdatePrices: true,
    includeNECReferences: true,
    defaultValidityDays: 30
  });

  const [brandingSettings, setBrandingSettings] = useState<Partial<BrandingSettings>>({
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
  });

  const [regionalSettings, setRegionalSettings] = useState({
    wasteFactors: {
      general: 3,
      concrete: 2,
      steel: 2,
      masonry: 5,
      electrical: 3,
      plumbing: 4,
      finishes: 8
    } as WasteFactors,
    laborRates: {
      architect: 25,
      civilEngineer: 30,
      masterBuilder: 18,
      electrician: 15,
      plumber: 15,
      painter: 12,
      helper: 10
    } as LaborRates,
    indirectCosts: {
      equipment: 8,
      transportation: 5,
      administration: 12,
      permits: 3,
      utilities: 4,
      insurance: 2
    } as IndirectCosts,
    professionalFees: {
      designPercentage: 10,
      supervisionPercentage: 5,
      managementPercentage: 8,
      consultingHourlyRate: 50,
      minimumFee: 500,
      complexityMultiplier: 1.2
    } as ProfessionalFees
  });

  // Cargar configuraciones al montar
  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    try {
      // TODO: Cargar desde API
      console.log('Loading settings...');
    } catch (error) {
      console.error('Error loading settings:', error);
    }
  };

  const saveSettings = async () => {
    setSaving(true);
    try {
      // TODO: Guardar en API
      await new Promise(resolve => setTimeout(resolve, 1000)); // Simular guardado
      setChanges(false);
      // TODO: Mostrar toast de éxito
    } catch (error) {
      console.error('Error saving settings:', error);
      // TODO: Mostrar toast de error
    } finally {
      setSaving(false);
    }
  };

  // Renderizar tab de configuración general
  const renderGeneralTab = () => (
    <div className="space-y-8">
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-6">Configuración Predeterminada</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Zona Geográfica Predeterminada
            </label>
            <select
              value={generalSettings.defaultGeographicalZone}
              onChange={(e) => {
                setGeneralSettings(prev => ({
                  ...prev,
                  defaultGeographicalZone: e.target.value as GeographicalZone
                }));
                setChanges(true);
              }}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              {Object.values(GeographicalZone).map(zone => (
                <option key={zone} value={zone}>{zone}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Moneda Predeterminada
            </label>
            <select
              value={generalSettings.defaultCurrency}
              onChange={(e) => {
                setGeneralSettings(prev => ({ ...prev, defaultCurrency: e.target.value }));
                setChanges(true);
              }}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="USD">USD - Dólar Americano</option>
              <option value="EUR">EUR - Euro</option>
              <option value="COP">COP - Peso Colombiano</option>
              <option value="PEN">PEN - Sol Peruano</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Contingencia Predeterminada (%)
            </label>
            <input
              type="number"
              value={generalSettings.defaultContingency}
              onChange={(e) => {
                setGeneralSettings(prev => ({ 
                  ...prev, 
                  defaultContingency: parseFloat(e.target.value) || 0 
                }));
                setChanges(true);
              }}
              min="0"
              max="50"
              step="0.5"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Impuestos Predeterminados (%)
            </label>
            <input
              type="number"
              value={generalSettings.defaultTax}
              onChange={(e) => {
                setGeneralSettings(prev => ({ 
                  ...prev, 
                  defaultTax: parseFloat(e.target.value) || 0 
                }));
                setChanges(true);
              }}
              min="0"
              max="30"
              step="0.1"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Validez de Cotizaciones (días)
            </label>
            <input
              type="number"
              value={generalSettings.defaultValidityDays}
              onChange={(e) => {
                setGeneralSettings(prev => ({ 
                  ...prev, 
                  defaultValidityDays: parseInt(e.target.value) || 30 
                }));
                setChanges(true);
              }}
              min="1"
              max="365"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
        </div>

        <div className="mt-8 space-y-4">
          <h4 className="font-medium text-gray-900">Opciones Automáticas</h4>
          
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h5 className="font-medium text-gray-700">Actualizar precios automáticamente</h5>
                <p className="text-sm text-gray-600">Sincronizar con fuentes de precios actualizadas</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={generalSettings.autoUpdatePrices}
                  onChange={(e) => {
                    setGeneralSettings(prev => ({ ...prev, autoUpdatePrices: e.target.checked }));
                    setChanges(true);
                  }}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
              </label>
            </div>

            <div className="flex items-center justify-between">
              <div>
                <h5 className="font-medium text-gray-700">Incluir referencias NEC</h5>
                <p className="text-sm text-gray-600">Mostrar referencias a normativas ecuatorianas</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={generalSettings.includeNECReferences}
                  onChange={(e) => {
                    setGeneralSettings(prev => ({ ...prev, includeNECReferences: e.target.checked }));
                    setChanges(true);
                  }}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
              </label>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  // Renderizar tab de marca empresarial
  const renderBrandingTab = () => (
    <div className="space-y-8">
      {/* Información de la empresa */}
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-6">Información Empresarial</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Nombre de la Empresa
            </label>
            <input
              type="text"
              value={brandingSettings.companyName || ''}
              onChange={(e) => {
                setBrandingSettings(prev => ({ ...prev, companyName: e.target.value }));
                setChanges(true);
              }}
              placeholder="Tu Empresa Constructora"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Nombre del Profesional
            </label>
            <input
              type="text"
              value={brandingSettings.professionalName || ''}
              onChange={(e) => {
                setBrandingSettings(prev => ({ ...prev, professionalName: e.target.value }));
                setChanges(true);
              }}
              placeholder="Arq. Juan Pérez"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Título Profesional
            </label>
            <input
              type="text"
              value={brandingSettings.professionalTitle || ''}
              onChange={(e) => {
                setBrandingSettings(prev => ({ ...prev, professionalTitle: e.target.value }));
                setChanges(true);
              }}
              placeholder="Arquitecto"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Registro Profesional
            </label>
            <input
              type="text"
              value={brandingSettings.professionalRegistration || ''}
              onChange={(e) => {
                setBrandingSettings(prev => ({ ...prev, professionalRegistration: e.target.value }));
                setChanges(true);
              }}
              placeholder="CAE-123456"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
        </div>
      </div>

      {/* Información de contacto */}
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-6">Información de Contacto</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Teléfono
            </label>
            <input
              type="tel"
              value={brandingSettings.contactInfo?.phone || ''}
              onChange={(e) => {
                setBrandingSettings(prev => ({ 
                  ...prev, 
                  contactInfo: { ...prev.contactInfo, phone: e.target.value } 
                }));
                setChanges(true);
              }}
              placeholder="+593 99 123 4567"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Email
            </label>
            <input
              type="email"
              value={brandingSettings.contactInfo?.email || ''}
              onChange={(e) => {
                setBrandingSettings(prev => ({ 
                  ...prev, 
                  contactInfo: { ...prev.contactInfo, email: e.target.value } 
                }));
                setChanges(true);
              }}
              placeholder="info@tuempresa.com"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Dirección
            </label>
            <textarea
              value={brandingSettings.contactInfo?.address || ''}
              onChange={(e) => {
                setBrandingSettings(prev => ({ 
                  ...prev, 
                  contactInfo: { ...prev.contactInfo, address: e.target.value } 
                }));
                setChanges(true);
              }}
              placeholder="Av. Principal 123, Quito, Ecuador"
              rows={2}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Sitio Web
            </label>
            <input
              type="url"
              value={brandingSettings.contactInfo?.website || ''}
              onChange={(e) => {
                setBrandingSettings(prev => ({ 
                  ...prev, 
                  contactInfo: { ...prev.contactInfo, website: e.target.value } 
                }));
                setChanges(true);
              }}
              placeholder="https://tuempresa.com"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
        </div>
      </div>

      {/* Colores de marca */}
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-6">Colores de Marca</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Color Primario
            </label>
            <div className="flex items-center gap-3">
              <input
                type="color"
                value={brandingSettings.colors?.primary || '#059669'}
                onChange={(e) => {
                  setBrandingSettings(prev => ({ 
                    ...prev, 
                    colors: { ...prev.colors, primary: e.target.value } 
                  }));
                  setChanges(true);
                }}
                className="w-12 h-12 rounded-lg border border-gray-300 cursor-pointer"
              />
              <input
                type="text"
                value={brandingSettings.colors?.primary || '#059669'}
                onChange={(e) => {
                  setBrandingSettings(prev => ({ 
                    ...prev, 
                    colors: { ...prev.colors, primary: e.target.value } 
                  }));
                  setChanges(true);
                }}
                className="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-1 focus:ring-blue-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Color Secundario
            </label>
            <div className="flex items-center gap-3">
              <input
                type="color"
                value={brandingSettings.colors?.secondary || '#0D9488'}
                onChange={(e) => {
                  setBrandingSettings(prev => ({ 
                    ...prev, 
                    colors: { ...prev.colors, secondary: e.target.value } 
                  }));
                  setChanges(true);
                }}
                className="w-12 h-12 rounded-lg border border-gray-300 cursor-pointer"
              />
              <input
                type="text"
                value={brandingSettings.colors?.secondary || '#0D9488'}
                onChange={(e) => {
                  setBrandingSettings(prev => ({ 
                    ...prev, 
                    colors: { ...prev.colors, secondary: e.target.value } 
                  }));
                  setChanges(true);
                }}
                className="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-1 focus:ring-blue-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Color de Acento
            </label>
            <div className="flex items-center gap-3">
              <input
                type="color"
                value={brandingSettings.colors?.accent || '#F59E0B'}
                onChange={(e) => {
                  setBrandingSettings(prev => ({ 
                    ...prev, 
                    colors: { ...prev.colors, accent: e.target.value } 
                  }));
                  setChanges(true);
                }}
                className="w-12 h-12 rounded-lg border border-gray-300 cursor-pointer"
              />
              <input
                type="text"
                value={brandingSettings.colors?.accent || '#F59E0B'}
                onChange={(e) => {
                  setBrandingSettings(prev => ({ 
                    ...prev, 
                    colors: { ...prev.colors, accent: e.target.value } 
                  }));
                  setChanges(true);
                }}
                className="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-1 focus:ring-blue-500"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Logo de empresa */}
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-6">Logo de Empresa</h3>
        
        <div className="flex items-center gap-6">
          <div className="w-32 h-32 border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center">
            {brandingSettings.companyLogo ? (
              <img
                src={brandingSettings.companyLogo}
                alt="Logo"
                className="w-full h-full object-contain rounded-lg"
              />
            ) : (
              <div className="text-center">
                <PhotoIcon className="h-12 w-12 text-gray-400 mx-auto mb-2" />
                <p className="text-sm text-gray-500">Sin logo</p>
              </div>
            )}
          </div>
          
          <div className="flex-1">
            <h4 className="font-medium text-gray-900 mb-2">Subir Logo</h4>
            <p className="text-sm text-gray-600 mb-4">
              Formato recomendado: PNG o SVG. Tamaño máximo: 2MB. 
              Dimensiones recomendadas: 400x200px.
            </p>
            
            <div className="flex gap-3">
              <button
                onClick={() => {
                  // TODO: Implementar subida de archivo
                }}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Subir Logo
              </button>
              
              {brandingSettings.companyLogo && (
                <button
                  onClick={() => {
                    setBrandingSettings(prev => ({ ...prev, companyLogo: undefined }));
                    setChanges(true);
                  }}
                  className="px-4 py-2 text-red-600 hover:text-red-800 hover:bg-red-50 rounded-lg transition-colors"
                >
                  Eliminar
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  // Renderizar tab de configuración regional
  const renderRegionalTab = () => (
    <div className="space-y-8">
      {/* Factores de desperdicio */}
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-6">Factores de Desperdicio por Material (%)</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {Object.entries(regionalSettings.wasteFactors).map(([material, factor]) => (
            <div key={material}>
              <label className="block text-sm font-medium text-gray-700 mb-2 capitalize">
                {material === 'general' ? 'General' : material}
              </label>
              <div className="relative">
                <input
                  type="number"
                  value={factor}
                  onChange={(e) => {
                    setRegionalSettings(prev => ({
                      ...prev,
                      wasteFactors: {
                        ...prev.wasteFactors,
                        [material]: parseFloat(e.target.value) || 0
                      }
                    }));
                    setChanges(true);
                  }}
                  min="0"
                  max="50"
                  step="0.5"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
                <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                  <span className="text-gray-500 text-sm">%</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Tarifas de mano de obra */}
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-6">Tarifas de Mano de Obra (USD/hora)</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {Object.entries(regionalSettings.laborRates).map(([role, rate]) => (
            <div key={role}>
              <label className="block text-sm font-medium text-gray-700 mb-2 capitalize">
                {role.replace(/([A-Z])/g, ' $1').toLowerCase()}
              </label>
              <div className="relative">
                <input
                  type="number"
                  value={rate}
                  onChange={(e) => {
                    setRegionalSettings(prev => ({
                      ...prev,
                      laborRates: {
                        ...prev.laborRates,
                        [role]: parseFloat(e.target.value) || 0
                      }
                    }));
                    setChanges(true);
                  }}
                  min="0"
                  step="0.5"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <span className="text-gray-500 text-sm">$</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Costos indirectos */}
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-6">Costos Indirectos (%)</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {Object.entries(regionalSettings.indirectCosts).map(([cost, percentage]) => (
            <div key={cost}>
              <label className="block text-sm font-medium text-gray-700 mb-2 capitalize">
                {cost === 'equipment' ? 'Equipos' :
                 cost === 'transportation' ? 'Transporte' :
                 cost === 'administration' ? 'Administración' :
                 cost === 'permits' ? 'Permisos' :
                 cost === 'utilities' ? 'Servicios' :
                 cost === 'insurance' ? 'Seguros' : cost}
              </label>
              <div className="relative">
                <input
                  type="number"
                  value={percentage}
                  onChange={(e) => {
                    setRegionalSettings(prev => ({
                      ...prev,
                      indirectCosts: {
                        ...prev.indirectCosts,
                        [cost]: parseFloat(e.target.value) || 0
                      }
                    }));
                    setChanges(true);
                  }}
                  min="0"
                  max="100"
                  step="0.5"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
                <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                  <span className="text-gray-500 text-sm">%</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Honorarios profesionales */}
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-6">Honorarios Profesionales</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Diseño (%)
            </label>
            <div className="relative">
              <input
                type="number"
                value={regionalSettings.professionalFees.designPercentage}
                onChange={(e) => {
                  setRegionalSettings(prev => ({
                    ...prev,
                    professionalFees: {
                      ...prev.professionalFees,
                      designPercentage: parseFloat(e.target.value) || 0
                    }
                  }));
                  setChanges(true);
                }}
                min="0"
                max="50"
                step="0.5"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
              <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                <span className="text-gray-500 text-sm">%</span>
              </div>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Supervisión (%)
            </label>
            <div className="relative">
              <input
                type="number"
                value={regionalSettings.professionalFees.supervisionPercentage}
                onChange={(e) => {
                  setRegionalSettings(prev => ({
                    ...prev,
                    professionalFees: {
                      ...prev.professionalFees,
                      supervisionPercentage: parseFloat(e.target.value) || 0
                    }
                  }));
                  setChanges(true);
                }}
                min="0"
                max="50"
                step="0.5"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
              <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                <span className="text-gray-500 text-sm">%</span>
              </div>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Consultoría (USD/hora)
            </label>
            <div className="relative">
              <input
                type="number"
                value={regionalSettings.professionalFees.consultingHourlyRate}
                onChange={(e) => {
                  setRegionalSettings(prev => ({
                    ...prev,
                    professionalFees: {
                      ...prev.professionalFees,
                      consultingHourlyRate: parseFloat(e.target.value) || 0
                    }
                  }));
                  setChanges(true);
                }}
                min="0"
                step="1"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <span className="text-gray-500 text-sm">$</span>
              </div>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Honorario Mínimo (USD)
            </label>
            <div className="relative">
              <input
                type="number"
                value={regionalSettings.professionalFees.minimumFee}
                onChange={(e) => {
                  setRegionalSettings(prev => ({
                    ...prev,
                    professionalFees: {
                      ...prev.professionalFees,
                      minimumFee: parseFloat(e.target.value) || 0
                    }
                  }));
                  setChanges(true);
                }}
                min="0"
                step="10"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <span className="text-gray-500 text-sm">$</span>
              </div>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Multiplicador de Complejidad
            </label>
            <input
              type="number"
              value={regionalSettings.professionalFees.complexityMultiplier}
              onChange={(e) => {
                setRegionalSettings(prev => ({
                  ...prev,
                  professionalFees: {
                    ...prev.professionalFees,
                    complexityMultiplier: parseFloat(e.target.value) || 1
                  }
                }));
                setChanges(true);
              }}
              min="1"
              max="5"
              step="0.1"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
        </div>
      </div>
    </div>
  );

  const tabs = [
    { key: 'general', label: 'General', icon: Cog6ToothIcon },
    { key: 'branding', label: 'Marca', icon: PaintBrushIcon },
    { key: 'regional', label: 'Regional', icon: MapPinIcon },
    { key: 'templates', label: 'Plantillas', icon: DocumentDuplicateIcon }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-4 py-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <button
                onClick={() => navigate("/calculations/budget")}
                className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <ArrowLeftIcon className="h-5 w-5" />
              </button>
              
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gradient-to-br from-gray-500 to-gray-600 rounded-xl flex items-center justify-center">
                  <Cog6ToothIcon className="h-5 w-5 text-white" />
                </div>
                <div>
                  <h1 className="text-2xl font-bold text-gray-900">
                    Configuración de Presupuestos
                  </h1>
                  <p className="text-sm text-gray-600">
                    Personaliza plantillas, marca y configuraciones regionales
                  </p>
                </div>
              </div>
            </div>

            {changes && (
              <button
                onClick={saveSettings}
                disabled={saving}
                className={`
                  flex items-center gap-2 px-6 py-3 rounded-lg font-medium transition-all duration-200
                  ${saving
                    ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                    : "bg-emerald-600 text-white hover:bg-emerald-700"
                  }
                `}
              >
                {saving ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Guardando...
                  </>
                ) : (
                  <>
                    <CheckIcon className="h-4 w-4" />
                    Guardar Cambios
                  </>
                )}
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4">
          <nav className="flex space-x-8">
            {tabs.map((tab) => (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key as any)}
                className={`
                  flex items-center gap-2 py-4 px-1 border-b-2 font-medium text-sm transition-all duration-200
                  ${activeTab === tab.key
                    ? "border-blue-500 text-blue-600"
                    : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                  }
                `}
              >
                <tab.icon className="h-4 w-4" />
                {tab.label}
              </button>
            ))}
          </nav>
        </div>
      </div>

      {/* Contenido */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        {activeTab === 'general' && renderGeneralTab()}
        {activeTab === 'branding' && renderBrandingTab()}
        {activeTab === 'regional' && renderRegionalTab()}
        {activeTab === 'templates' && (
          <div className="text-center py-12">
            <DocumentDuplicateIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              Gestión de Plantillas
            </h3>
            <p className="text-gray-600 mb-4">
              Funcionalidad en desarrollo. Pronto podrás gestionar tus plantillas personalizadas.
            </p>
          </div>
        )}

        {/* Advertencia de cambios no guardados */}
        {changes && (
          <div className="fixed bottom-6 right-6 bg-yellow-50 border border-yellow-200 rounded-xl p-4 shadow-lg">
            <div className="flex items-center gap-3">
              <ExclamationTriangleIcon className="h-5 w-5 text-yellow-600" />
              <div>
                <h4 className="font-medium text-yellow-800">Cambios no guardados</h4>
                <p className="text-yellow-700 text-sm">Tienes modificaciones pendientes de guardar</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default BudgetSettings;