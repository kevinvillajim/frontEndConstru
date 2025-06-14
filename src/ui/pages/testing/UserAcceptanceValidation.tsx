// src/ui/pages/testing/UserAcceptanceValidation.tsx
import React, { useState, useEffect } from 'react';
import { 
  UserGroupIcon,
  CheckCircleIcon,
  XCircleIcon,
  ExclamationTriangleIcon,
  ClockIcon,
  ChatBubbleLeftRightIcon,
  StarIcon,
  EyeIcon,
  DocumentTextIcon,
  ArrowRightIcon,
  PlusIcon,
  PlayIcon,
  HandRaisedIcon,
  BugAntIcon,
  LightBulbIcon,
  ChartBarIcon
} from '@heroicons/react/24/outline';
import { StarIcon as StarIconSolid } from '@heroicons/react/24/solid';
import { LoadingSpinner, Badge, ProgressBar, Alert } from '../shared/components/SharedComponents';

interface UserScenario {
  id: string;
  title: string;
  description: string;
  userType: 'architect' | 'engineer' | 'contractor' | 'project_manager' | 'admin';
  complexity: 'basic' | 'intermediate' | 'advanced';
  estimatedTime: number; // minutes
  status: 'draft' | 'active' | 'completed' | 'archived';
  steps: ScenarioStep[];
  acceptanceCriteria: AcceptanceCriteria[];
  testResults: TestResult[];
  feedback: UserFeedback[];
  createdAt: Date;
  lastModified: Date;
}

interface ScenarioStep {
  id: string;
  stepNumber: number;
  title: string;
  description: string;
  userAction: string;
  expectedResult: string;
  actualResult?: string;
  status: 'pending' | 'in_progress' | 'passed' | 'failed' | 'blocked';
  notes?: string;
  screenshots?: string[];
  timeSpent?: number;
}

interface AcceptanceCriteria {
  id: string;
  criterion: string;
  priority: 'must_have' | 'should_have' | 'could_have';
  status: 'not_tested' | 'passed' | 'failed';
  testDate?: Date;
  tester?: string;
  notes?: string;
}

interface TestResult {
  id: string;
  testerId: string;
  testerName: string;
  testerType: 'internal' | 'beta_user' | 'external';
  completedAt: Date;
  duration: number;
  overallRating: number; // 1-5
  usabilityScore: number; // 1-10
  status: 'passed' | 'failed' | 'passed_with_issues';
  issues: Issue[];
  suggestions: Suggestion[];
  wouldRecommend: boolean;
}

interface Issue {
  id: string;
  type: 'bug' | 'usability' | 'performance' | 'design' | 'content';
  severity: 'low' | 'medium' | 'high' | 'critical';
  title: string;
  description: string;
  stepId?: string;
  reproduced: boolean;
  status: 'open' | 'in_progress' | 'resolved' | 'wont_fix';
}

interface Suggestion {
  id: string;
  type: 'feature' | 'improvement' | 'usability' | 'performance';
  title: string;
  description: string;
  priority: 'low' | 'medium' | 'high';
  votes: number;
  status: 'submitted' | 'under_review' | 'approved' | 'implemented' | 'rejected';
}

interface UserFeedback {
  id: string;
  userId: string;
  userName: string;
  rating: number;
  comment: string;
  createdAt: Date;
  helpful: boolean;
}

interface TestMetrics {
  totalScenarios: number;
  completedScenarios: number;
  passedScenarios: number;
  failedScenarios: number;
  averageRating: number;
  averageUsabilityScore: number;
  averageCompletionTime: number;
  totalTesters: number;
  recommendationRate: number;
  criticalIssues: number;
  resolvedIssues: number;
}

// Custom Hook
const useUserAcceptanceValidation = () => {
  const [scenarios, setScenarios] = useState<UserScenario[]>([]);
  const [metrics, setMetrics] = useState<TestMetrics | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedScenario, setSelectedScenario] = useState<UserScenario | null>(null);

  const loadScenarios = async () => {
    setIsLoading(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const mockScenarios: UserScenario[] = [
        {
          id: '1',
          title: 'Crear Proyecto Residencial Completo',
          description: 'Flujo completo desde cálculo inicial hasta cronograma detallado para proyecto residencial',
          userType: 'architect',
          complexity: 'intermediate',
          estimatedTime: 45,
          status: 'active',
          createdAt: new Date(2024, 5, 10),
          lastModified: new Date(2024, 5, 12),
          steps: [
            {
              id: '1.1',
              stepNumber: 1,
              title: 'Acceso a la Plataforma',
              description: 'Usuario inicia sesión y accede al dashboard principal',
              userAction: 'Ingresar credenciales y hacer clic en "Ingresar"',
              expectedResult: 'Dashboard principal cargado con proyectos del usuario',
              status: 'passed',
              timeSpent: 2
            },
            {
              id: '1.2',
              stepNumber: 2,
              title: 'Crear Nuevo Proyecto',
              description: 'Crear un nuevo proyecto residencial desde cero',
              userAction: 'Hacer clic en "Nuevo Proyecto" y completar formulario',
              expectedResult: 'Proyecto creado y usuario redirigido a vista de proyecto',
              status: 'passed',
              timeSpent: 5
            },
            {
              id: '1.3',
              stepNumber: 3,
              title: 'Seleccionar Template de Cálculo',
              description: 'Elegir template apropiado para cálculo estructural',
              userAction: 'Navegar a catálogo de cálculos y seleccionar template',
              expectedResult: 'Template cargado con parámetros editables',
              status: 'passed',
              timeSpent: 8
            },
            {
              id: '1.4',
              stepNumber: 4,
              title: 'Completar Cálculo Estructural',
              description: 'Ingresar parámetros y ejecutar cálculo estructural',
              userAction: 'Completar campos requeridos y ejecutar cálculo',
              expectedResult: 'Resultados generados con cantidades de materiales',
              status: 'failed',
              actualResult: 'Error en validación de parámetros sísmicos',
              notes: 'Mensaje de error no es claro para el usuario'
            },
            {
              id: '1.5',
              stepNumber: 5,
              title: 'Generar Presupuesto',
              description: 'Crear presupuesto basado en cálculos realizados',
              userAction: 'Acceder a generador de presupuesto desde resultados',
              expectedResult: 'Presupuesto generado con precios actualizados',
              status: 'blocked'
            }
          ],
          acceptanceCriteria: [
            {
              id: 'ac1',
              criterion: 'El usuario puede completar el flujo completo en menos de 60 minutos',
              priority: 'must_have',
              status: 'failed',
              testDate: new Date(2024, 5, 12),
              tester: 'Usuario Beta #1',
              notes: 'Tomó 75 minutos debido a error en paso 4'
            },
            {
              id: 'ac2',
              criterion: 'Todos los cálculos deben ser precisos según normativa NEC',
              priority: 'must_have',
              status: 'not_tested'
            },
            {
              id: 'ac3',
              criterion: 'La interfaz debe ser intuitiva para arquitectos sin experiencia técnica',
              priority: 'should_have',
              status: 'passed',
              testDate: new Date(2024, 5, 12),
              tester: 'Usuario Beta #2'
            }
          ],
          testResults: [
            {
              id: 'tr1',
              testerId: 'beta1',
              testerName: 'Arq. María González',
              testerType: 'beta_user',
              completedAt: new Date(2024, 5, 12, 14, 30),
              duration: 75,
              overallRating: 3,
              usabilityScore: 7,
              status: 'passed_with_issues',
              wouldRecommend: true,
              issues: [
                {
                  id: 'i1',
                  type: 'usability',
                  severity: 'medium',
                  title: 'Mensaje de error poco claro',
                  description: 'El error en validación de parámetros sísmicos no explica claramente qué debe corregir el usuario',
                  stepId: '1.4',
                  reproduced: true,
                  status: 'open'
                },
                {
                  id: 'i2',
                  type: 'performance',
                  severity: 'low',
                  title: 'Carga lenta de templates',
                  description: 'El catálogo de templates tarda más de 5 segundos en cargar',
                  stepId: '1.3',
                  reproduced: true,
                  status: 'in_progress'
                }
              ],
              suggestions: [
                {
                  id: 's1',
                  type: 'usability',
                  title: 'Agregar tooltips en campos técnicos',
                  description: 'Incluir explicaciones breves para parámetros técnicos complejos',
                  priority: 'medium',
                  votes: 3,
                  status: 'approved'
                }
              ]
            }
          ],
          feedback: [
            {
              id: 'f1',
              userId: 'beta1',
              userName: 'Arq. María González',
              rating: 4,
              comment: 'En general muy buena herramienta, pero necesita mejorar la claridad de los mensajes de error.',
              createdAt: new Date(2024, 5, 12, 15, 0),
              helpful: true
            }
          ]
        },
        {
          id: '2',
          title: 'Seguimiento de Obra en Campo',
          description: 'Uso de la aplicación móvil para reportar avances desde la obra',
          userType: 'contractor',
          complexity: 'basic',
          estimatedTime: 20,
          status: 'completed',
          createdAt: new Date(2024, 5, 8),
          lastModified: new Date(2024, 5, 11),
          steps: [
            {
              id: '2.1',
              stepNumber: 1,
              title: 'Acceso desde Móvil',
              description: 'Acceder a la aplicación desde dispositivo móvil en obra',
              userAction: 'Abrir app y iniciar sesión',
              expectedResult: 'Vista móvil optimizada cargada',
              status: 'passed',
              timeSpent: 2
            },
            {
              id: '2.2',
              stepNumber: 2,
              title: 'Reportar Avance',
              description: 'Reportar porcentaje de avance de actividad',
              userAction: 'Seleccionar actividad y actualizar progreso',
              expectedResult: 'Avance registrado y sincronizado',
              status: 'passed',
              timeSpent: 5
            },
            {
              id: '2.3',
              stepNumber: 3,
              title: 'Subir Fotografías',
              description: 'Documentar avance con fotografías',
              userAction: 'Tomar fotos y subirlas a la actividad',
              expectedResult: 'Fotos subidas con geolocalización',
              status: 'passed',
              timeSpent: 8
            }
          ],
          acceptanceCriteria: [
            {
              id: 'ac4',
              criterion: 'La app debe funcionar sin conexión a internet',
              priority: 'must_have',
              status: 'passed',
              testDate: new Date(2024, 5, 11),
              tester: 'Contratista Beta'
            },
            {
              id: 'ac5',
              criterion: 'Los reportes deben sincronizarse automáticamente cuando hay conexión',
              priority: 'must_have',
              status: 'passed',
              testDate: new Date(2024, 5, 11),
              tester: 'Contratista Beta'
            }
          ],
          testResults: [
            {
              id: 'tr2',
              testerId: 'beta2',
              testerName: 'Ing. Carlos Mendoza',
              testerType: 'beta_user',
              completedAt: new Date(2024, 5, 11, 10, 45),
              duration: 18,
              overallRating: 5,
              usabilityScore: 9,
              status: 'passed',
              wouldRecommend: true,
              issues: [],
              suggestions: [
                {
                  id: 's2',
                  type: 'feature',
                  title: 'Agregar grabación de audio',
                  description: 'Permitir grabación de notas de voz para reportes',
                  priority: 'low',
                  votes: 2,
                  status: 'under_review'
                }
              ]
            }
          ],
          feedback: [
            {
              id: 'f2',
              userId: 'beta2',
              userName: 'Ing. Carlos Mendoza',
              rating: 5,
              comment: 'Excelente para uso en campo. Muy intuitiva y rápida.',
              createdAt: new Date(2024, 5, 11, 11, 0),
              helpful: true
            }
          ]
        }
      ];

      const mockMetrics: TestMetrics = {
        totalScenarios: 5,
        completedScenarios: 2,
        passedScenarios: 1,
        failedScenarios: 1,
        averageRating: 4.0,
        averageUsabilityScore: 8.0,
        averageCompletionTime: 46.5,
        totalTesters: 8,
        recommendationRate: 87.5,
        criticalIssues: 0,
        resolvedIssues: 3
      };
      
      setScenarios(mockScenarios);
      setMetrics(mockMetrics);
    } catch (error) {
      console.error('Error loading scenarios:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const runScenario = async (scenarioId: string) => {
    console.log('Running scenario:', scenarioId);
    // Simulate running scenario
  };

  const createScenario = async (scenarioData: Partial<UserScenario>) => {
    console.log('Creating scenario:', scenarioData);
    // Simulate creating scenario
  };

  useEffect(() => {
    loadScenarios();
  }, []);

  return {
    scenarios,
    metrics,
    isLoading,
    selectedScenario,
    setSelectedScenario,
    runScenario,
    createScenario
  };
};

// Components
const MetricsOverview: React.FC<{ metrics: TestMetrics }> = ({ metrics }) => (
  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
    <div className="bg-white rounded-xl border border-gray-200 p-4">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
          <DocumentTextIcon className="h-5 w-5 text-blue-600" />
        </div>
        <div>
          <div className="text-sm text-gray-600">Escenarios</div>
          <div className="text-xl font-bold text-gray-900">
            {metrics.completedScenarios}/{metrics.totalScenarios}
          </div>
        </div>
      </div>
    </div>

    <div className="bg-white rounded-xl border border-gray-200 p-4">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
          <CheckCircleIcon className="h-5 w-5 text-green-600" />
        </div>
        <div>
          <div className="text-sm text-gray-600">Tasa de Éxito</div>
          <div className="text-xl font-bold text-gray-900">
            {((metrics.passedScenarios / metrics.completedScenarios) * 100).toFixed(1)}%
          </div>
        </div>
      </div>
    </div>

    <div className="bg-white rounded-xl border border-gray-200 p-4">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 bg-yellow-100 rounded-lg flex items-center justify-center">
          <StarIcon className="h-5 w-5 text-yellow-600" />
        </div>
        <div>
          <div className="text-sm text-gray-600">Rating Promedio</div>
          <div className="text-xl font-bold text-gray-900">
            {metrics.averageRating.toFixed(1)}/5
          </div>
        </div>
      </div>
    </div>

    <div className="bg-white rounded-xl border border-gray-200 p-4">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
          <UserGroupIcon className="h-5 w-5 text-purple-600" />
        </div>
        <div>
          <div className="text-sm text-gray-600">Testers</div>
          <div className="text-xl font-bold text-gray-900">
            {metrics.totalTesters}
          </div>
        </div>
      </div>
    </div>
  </div>
);

const ScenarioCard: React.FC<{
  scenario: UserScenario;
  onView: (scenario: UserScenario) => void;
  onRun: (scenarioId: string) => void;
}> = ({ scenario, onView, onRun }) => {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'bg-green-100 text-green-800';
      case 'active':
        return 'bg-blue-100 text-blue-800';
      case 'draft':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getComplexityColor = (complexity: string) => {
    switch (complexity) {
      case 'basic':
        return 'bg-green-100 text-green-800';
      case 'intermediate':
        return 'bg-yellow-100 text-yellow-800';
      case 'advanced':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const passedSteps = scenario.steps.filter(s => s.status === 'passed').length;
  const progress = (passedSteps / scenario.steps.length) * 100;

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-6">
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          <h3 className="font-semibold text-gray-900 mb-1">{scenario.title}</h3>
          <p className="text-sm text-gray-600 mb-3">{scenario.description}</p>
          
          <div className="flex items-center gap-2 mb-3">
            <Badge variant="secondary" className={getStatusColor(scenario.status)}>
              {scenario.status}
            </Badge>
            <Badge variant="outline" className={getComplexityColor(scenario.complexity)}>
              {scenario.complexity}
            </Badge>
            <span className="text-sm text-gray-500">
              {scenario.estimatedTime} min
            </span>
          </div>
        </div>
        
        <div className="text-right">
          <div className="text-sm text-gray-600">Usuario</div>
          <div className="text-sm font-medium text-gray-900 capitalize">
            {scenario.userType.replace('_', ' ')}
          </div>
        </div>
      </div>

      <div className="mb-4">
        <div className="flex justify-between items-center mb-2">
          <span className="text-sm text-gray-600">Progreso</span>
          <span className="text-sm font-medium text-gray-900">
            {passedSteps}/{scenario.steps.length} pasos
          </span>
        </div>
        <ProgressBar 
          progress={progress} 
          color={progress === 100 ? 'green' : progress > 50 ? 'blue' : 'gray'} 
        />
      </div>

      {scenario.testResults.length > 0 && (
        <div className="mb-4">
          <div className="flex items-center gap-2 mb-2">
            <span className="text-sm text-gray-600">Rating:</span>
            <div className="flex">
              {[1, 2, 3, 4, 5].map((star) => (
                <StarIconSolid
                  key={star}
                  className={`h-4 w-4 ${
                    star <= scenario.testResults[0].overallRating
                      ? 'text-yellow-400'
                      : 'text-gray-300'
                  }`}
                />
              ))}
            </div>
            <span className="text-sm text-gray-600">
              ({scenario.testResults.length} test{scenario.testResults.length !== 1 ? 's' : ''})
            </span>
          </div>
        </div>
      )}

      <div className="flex gap-2">
        <button
          onClick={() => onView(scenario)}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          <EyeIcon className="h-4 w-4" />
          Ver Detalles
        </button>
        
        {scenario.status === 'active' && (
          <button
            onClick={() => onRun(scenario.id)}
            className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
          >
            <PlayIcon className="h-4 w-4" />
            Ejecutar
          </button>
        )}
      </div>
    </div>
  );
};

const ScenarioDetailsModal: React.FC<{
  scenario: UserScenario;
  isOpen: boolean;
  onClose: () => void;
}> = ({ scenario, isOpen, onClose }) => {
  const [activeTab, setActiveTab] = useState<'steps' | 'criteria' | 'results' | 'feedback'>('steps');

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl max-w-6xl w-full max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-semibold text-gray-900">{scenario.title}</h2>
              <p className="text-gray-600 mt-1">{scenario.description}</p>
            </div>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600"
            >
              <XCircleIcon className="h-6 w-6" />
            </button>
          </div>
        </div>

        {/* Tabs */}
        <div className="border-b border-gray-200">
          <nav className="flex space-x-8 px-6">
            {[
              { id: 'steps', label: 'Pasos', icon: ArrowRightIcon },
              { id: 'criteria', label: 'Criterios', icon: CheckCircleIcon },
              { id: 'results', label: 'Resultados', icon: ChartBarIcon },
              { id: 'feedback', label: 'Feedback', icon: ChatBubbleLeftRightIcon }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex items-center gap-2 py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === tab.id
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700'
                }`}
              >
                <tab.icon className="h-4 w-4" />
                {tab.label}
              </button>
            ))}
          </nav>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto max-h-[calc(90vh-200px)]">
          {activeTab === 'steps' && (
            <div className="space-y-4">
              {scenario.steps.map((step, index) => (
                <div key={step.id} className="bg-gray-50 rounded-lg p-4">
                  <div className="flex items-start gap-4">
                    <div className="flex-shrink-0">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                        step.status === 'passed' ? 'bg-green-100 text-green-800' :
                        step.status === 'failed' ? 'bg-red-100 text-red-800' :
                        step.status === 'blocked' ? 'bg-gray-100 text-gray-800' :
                        'bg-blue-100 text-blue-800'
                      }`}>
                        {step.stepNumber}
                      </div>
                    </div>
                    
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="font-medium text-gray-900">{step.title}</h4>
                        <Badge variant={
                          step.status === 'passed' ? 'success' :
                          step.status === 'failed' ? 'danger' :
                          step.status === 'blocked' ? 'secondary' : 'primary'
                        }>
                          {step.status}
                        </Badge>
                      </div>
                      
                      <p className="text-sm text-gray-600 mb-3">{step.description}</p>
                      
                      <div className="space-y-2">
                        <div>
                          <span className="text-xs font-medium text-gray-500 uppercase tracking-wide">
                            Acción del Usuario:
                          </span>
                          <p className="text-sm text-gray-700">{step.userAction}</p>
                        </div>
                        
                        <div>
                          <span className="text-xs font-medium text-gray-500 uppercase tracking-wide">
                            Resultado Esperado:
                          </span>
                          <p className="text-sm text-gray-700">{step.expectedResult}</p>
                        </div>
                        
                        {step.actualResult && (
                          <div>
                            <span className="text-xs font-medium text-red-500 uppercase tracking-wide">
                              Resultado Actual:
                            </span>
                            <p className="text-sm text-red-700">{step.actualResult}</p>
                          </div>
                        )}
                        
                        {step.notes && (
                          <div>
                            <span className="text-xs font-medium text-gray-500 uppercase tracking-wide">
                              Notas:
                            </span>
                            <p className="text-sm text-gray-700">{step.notes}</p>
                          </div>
                        )}
                        
                        {step.timeSpent && (
                          <div className="text-xs text-gray-500">
                            Tiempo: {step.timeSpent} minutos
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {activeTab === 'criteria' && (
            <div className="space-y-4">
              {scenario.acceptanceCriteria.map((criterion) => (
                <div key={criterion.id} className="bg-gray-50 rounded-lg p-4">
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex-1">
                      <p className="text-sm font-medium text-gray-900">{criterion.criterion}</p>
                      <div className="flex items-center gap-2 mt-2">
                        <Badge variant={
                          criterion.priority === 'must_have' ? 'danger' :
                          criterion.priority === 'should_have' ? 'warning' : 'secondary'
                        }>
                          {criterion.priority.replace('_', ' ')}
                        </Badge>
                        <Badge variant={
                          criterion.status === 'passed' ? 'success' :
                          criterion.status === 'failed' ? 'danger' : 'secondary'
                        }>
                          {criterion.status.replace('_', ' ')}
                        </Badge>
                      </div>
                    </div>
                  </div>
                  
                  {criterion.testDate && (
                    <div className="text-xs text-gray-500 mt-2">
                      Probado: {criterion.testDate.toLocaleDateString()} por {criterion.tester}
                    </div>
                  )}
                  
                  {criterion.notes && (
                    <div className="mt-2">
                      <span className="text-xs font-medium text-gray-500 uppercase tracking-wide">
                        Notas:
                      </span>
                      <p className="text-sm text-gray-700">{criterion.notes}</p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}

          {activeTab === 'results' && (
            <div className="space-y-6">
              {scenario.testResults.map((result) => (
                <div key={result.id} className="bg-gray-50 rounded-lg p-4">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h4 className="font-medium text-gray-900">{result.testerName}</h4>
                      <p className="text-sm text-gray-600">
                        {result.testerType} • {result.completedAt.toLocaleDateString()} • {result.duration} min
                      </p>
                    </div>
                    <Badge variant={
                      result.status === 'passed' ? 'success' :
                      result.status === 'failed' ? 'danger' : 'warning'
                    }>
                      {result.status.replace('_', ' ')}
                    </Badge>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4 mb-4">
                    <div>
                      <div className="text-sm text-gray-600">Rating General</div>
                      <div className="flex items-center gap-2">
                        <div className="flex">
                          {[1, 2, 3, 4, 5].map((star) => (
                            <StarIconSolid
                              key={star}
                              className={`h-4 w-4 ${
                                star <= result.overallRating ? 'text-yellow-400' : 'text-gray-300'
                              }`}
                            />
                          ))}
                        </div>
                        <span className="text-sm text-gray-600">({result.overallRating}/5)</span>
                      </div>
                    </div>
                    <div>
                      <div className="text-sm text-gray-600">Usabilidad</div>
                      <div className="text-lg font-semibold text-gray-900">
                        {result.usabilityScore}/10
                      </div>
                    </div>
                  </div>
                  
                  {result.issues.length > 0 && (
                    <div className="mb-4">
                      <h5 className="text-sm font-medium text-gray-900 mb-2">Issues Reportados</h5>
                      <div className="space-y-2">
                        {result.issues.map((issue) => (
                          <div key={issue.id} className="flex items-start gap-3 p-2 bg-white rounded border">
                            <BugAntIcon className="h-4 w-4 text-red-500 mt-0.5" />
                            <div className="flex-1">
                              <div className="flex items-center gap-2 mb-1">
                                <span className="text-sm font-medium text-gray-900">{issue.title}</span>
                                <Badge variant={
                                  issue.severity === 'critical' ? 'danger' :
                                  issue.severity === 'high' ? 'warning' : 'secondary'
                                }>
                                  {issue.severity}
                                </Badge>
                              </div>
                              <p className="text-sm text-gray-600">{issue.description}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                  
                  {result.suggestions.length > 0 && (
                    <div>
                      <h5 className="text-sm font-medium text-gray-900 mb-2">Sugerencias</h5>
                      <div className="space-y-2">
                        {result.suggestions.map((suggestion) => (
                          <div key={suggestion.id} className="flex items-start gap-3 p-2 bg-white rounded border">
                            <LightBulbIcon className="h-4 w-4 text-blue-500 mt-0.5" />
                            <div className="flex-1">
                              <div className="flex items-center gap-2 mb-1">
                                <span className="text-sm font-medium text-gray-900">{suggestion.title}</span>
                                <Badge variant="outline">{suggestion.priority}</Badge>
                              </div>
                              <p className="text-sm text-gray-600">{suggestion.description}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}

          {activeTab === 'feedback' && (
            <div className="space-y-4">
              {scenario.feedback.map((feedback) => (
                <div key={feedback.id} className="bg-gray-50 rounded-lg p-4">
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                        <span className="text-sm font-medium text-blue-600">
                          {feedback.userName.charAt(0)}
                        </span>
                      </div>
                      <div>
                        <h4 className="font-medium text-gray-900">{feedback.userName}</h4>
                        <div className="flex">
                          {[1, 2, 3, 4, 5].map((star) => (
                            <StarIconSolid
                              key={star}
                              className={`h-4 w-4 ${
                                star <= feedback.rating ? 'text-yellow-400' : 'text-gray-300'
                              }`}
                            />
                          ))}
                        </div>
                      </div>
                    </div>
                    <span className="text-sm text-gray-500">
                      {feedback.createdAt.toLocaleDateString()}
                    </span>
                  </div>
                  <p className="text-sm text-gray-700">{feedback.comment}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

// Main Component
const UserAcceptanceValidation: React.FC = () => {
  const {
    scenarios,
    metrics,
    isLoading,
    selectedScenario,
    setSelectedScenario,
    runScenario,
    createScenario
  } = useUserAcceptanceValidation();

  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showDetailsModal, setShowDetailsModal] = useState(false);

  const handleViewScenario = (scenario: UserScenario) => {
    setSelectedScenario(scenario);
    setShowDetailsModal(true);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <LoadingSpinner />
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto p-6">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              Validación de Aceptación de Usuario
            </h1>
            <p className="text-gray-600 mt-1">
              Scenarios de uso real y validación con usuarios beta
            </p>
          </div>
          
          <button
            onClick={() => setShowCreateModal(true)}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <PlusIcon className="h-4 w-4" />
            Nuevo Escenario
          </button>
        </div>
      </div>

      {/* Metrics Overview */}
      {metrics && <MetricsOverview metrics={metrics} />}

      {/* Scenarios Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {scenarios.map((scenario) => (
          <ScenarioCard
            key={scenario.id}
            scenario={scenario}
            onView={handleViewScenario}
            onRun={runScenario}
          />
        ))}
      </div>

      {/* Details Modal */}
      {selectedScenario && (
        <ScenarioDetailsModal
          scenario={selectedScenario}
          isOpen={showDetailsModal}
          onClose={() => setShowDetailsModal(false)}
        />
      )}
    </div>
  );
};

export default UserAcceptanceValidation;