// src/ui/pages/training/TrainingDocumentationSystem.tsx
import React, { useState, useEffect } from 'react';
import { 
  BookOpenIcon,
  PlayIcon,
  DocumentTextIcon,
  VideoCameraIcon,
  QuestionMarkCircleIcon,
  AcademicCapIcon,
  LightBulbIcon,
  UserGroupIcon,
  ChartBarIcon,
  ClockIcon,
  StarIcon,
  EyeIcon,
  MagnifyingGlassIcon,
  ComputerDesktopIcon,
  PrinterIcon,
  ShareIcon,
  HeartIcon,
  FunnelIcon,
} from '@heroicons/react/24/outline';
import { StarIcon as StarIconSolid } from '@heroicons/react/24/solid';
import { LoadingSpinner, Badge, ProgressBar, Alert } from '../shared/components/SharedComponents';

interface TrainingModule {
  id: string;
  title: string;
  description: string;
  category: 'getting_started' | 'calculations' | 'budget' | 'schedule' | 'mobile' | 'advanced' | 'admin';
  level: 'beginner' | 'intermediate' | 'advanced' | 'expert';
  estimatedTime: number; // minutes
  format: 'interactive' | 'video' | 'document' | 'quiz' | 'hands_on';
  status: 'published' | 'draft' | 'archived';
  prerequisites: string[];
  learningObjectives: string[];
  content: TrainingContent[];
  quiz?: Quiz;
  resources: Resource[];
  tags: string[];
  languages: string[];
  version: string;
  lastUpdated: Date;
  createdBy: string;
  popularity: number;
  rating: number;
  completions: number;
  userProgress?: UserProgress;
}

interface TrainingContent {
  id: string;
  type: 'text' | 'video' | 'image' | 'interactive' | 'code' | 'checklist';
  title: string;
  content: string;
  duration?: number;
  interactive?: InteractiveElement;
  resources?: string[];
}

interface InteractiveElement {
  type: 'tour' | 'simulation' | 'demo' | 'practice';
  config: {
    targetComponent?: string;
    steps?: TourStep[];
    scenario?: string;
    mockData?: any;
  };
}

interface TourStep {
  id: string;
  target: string;
  title: string;
  description: string;
  action?: 'click' | 'type' | 'wait' | 'observe';
  validation?: string;
}

interface Quiz {
  id: string;
  title: string;
  description: string;
  questions: Question[];
  passingScore: number;
  timeLimit?: number;
  retryAllowed: boolean;
  showResults: boolean;
}

interface Question {
  id: string;
  type: 'multiple_choice' | 'multiple_select' | 'true_false' | 'short_answer' | 'drag_drop';
  question: string;
  options?: string[];
  correctAnswers: string[];
  explanation: string;
  points: number;
  difficulty: 'easy' | 'medium' | 'hard';
}

interface Resource {
  id: string;
  name: string;
  type: 'pdf' | 'video' | 'link' | 'template' | 'sample_project';
  url: string;
  description: string;
  size?: string;
  downloadable: boolean;
}

interface UserProgress {
  moduleId: string;
  userId: string;
  status: 'not_started' | 'in_progress' | 'completed' | 'certified';
  progress: number; // 0-100
  startedAt?: Date;
  completedAt?: Date;
  timeSpent: number; // minutes
  currentSection: number;
  quizAttempts: QuizAttempt[];
  notes: string;
  bookmarked: boolean;
}

interface QuizAttempt {
  id: string;
  attemptNumber: number;
  score: number;
  maxScore: number;
  passed: boolean;
  answers: QuizAnswer[];
  completedAt: Date;
  timeSpent: number;
}

interface QuizAnswer {
  questionId: string;
  answer: string | string[];
  correct: boolean;
  points: number;
}

interface LearningPath {
  id: string;
  name: string;
  description: string;
  targetRole: 'architect' | 'engineer' | 'contractor' | 'project_manager' | 'admin' | 'all';
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  estimatedHours: number;
  modules: string[];
  prerequisites: string[];
  certification?: {
    name: string;
    validityMonths: number;
    requirements: {
      completionRate: number;
      quizScore: number;
      practicalExercises: number;
    };
  };
  enrolled: number;
  completions: number;
  rating: number;
}

interface Documentation {
  id: string;
  title: string;
  type: 'user_guide' | 'api_docs' | 'tutorial' | 'faq' | 'troubleshooting' | 'release_notes';
  category: 'general' | 'calculations' | 'budget' | 'schedule' | 'mobile' | 'integrations' | 'admin';
  content: string;
  attachments: Resource[];
  tags: string[];
  searchable: boolean;
  version: string;
  lastUpdated: Date;
  author: string;
  views: number;
  helpful: number;
  notHelpful: number;
  comments: Comment[];
}

interface Comment {
  id: string;
  userId: string;
  userName: string;
  content: string;
  createdAt: Date;
  helpful: number;
  replies: Comment[];
}

interface SearchFilters {
  category?: string;
  level?: string;
  format?: string;
  language?: string;
  duration?: {
    min: number;
    max: number;
  };
}

// Custom Hook
const useTrainingSystem = () => {
  const [modules, setModules] = useState<TrainingModule[]>([]);
  const [learningPaths, setLearningPaths] = useState<LearningPath[]>([]);
  const [documentation, setDocumentation] = useState<Documentation[]>([]);
  const [userProgress, setUserProgress] = useState<UserProgress[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState<SearchFilters>({});

  const loadTrainingData = async () => {
    setIsLoading(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const mockModules: TrainingModule[] = [
        {
          id: 'module-1',
          title: 'Introducción a CONSTRU',
          description: 'Aprende los conceptos básicos y la navegación principal de la plataforma CONSTRU',
          category: 'getting_started',
          level: 'beginner',
          estimatedTime: 30,
          format: 'interactive',
          status: 'published',
          prerequisites: [],
          learningObjectives: [
            'Comprender la estructura general de CONSTRU',
            'Navegar entre los módulos principales',
            'Configurar tu perfil profesional',
            'Conocer las funciones básicas de cada módulo'
          ],
          content: [
            {
              id: 'content-1',
              type: 'video',
              title: 'Bienvenida a CONSTRU',
              content: 'Video introductorio sobre la plataforma',
              duration: 5
            },
            {
              id: 'content-2',
              type: 'interactive',
              title: 'Tour Guiado del Dashboard',
              content: 'Explora el dashboard principal con nuestro tour interactivo',
              duration: 10,
              interactive: {
                type: 'tour',
                config: {
                  targetComponent: 'Dashboard',
                  steps: [
                    {
                      id: 'step-1',
                      target: '.sidebar',
                      title: 'Menú Principal',
                      description: 'Aquí encontrarás acceso a todos los módulos de CONSTRU',
                      action: 'observe'
                    },
                    {
                      id: 'step-2',
                      target: '.project-cards',
                      title: 'Mis Proyectos',
                      description: 'Visualiza y accede a tus proyectos activos',
                      action: 'click'
                    }
                  ]
                }
              }
            },
            {
              id: 'content-3',
              type: 'checklist',
              title: 'Configuración Inicial',
              content: '- [ ] Completar perfil profesional\n- [ ] Configurar zona geográfica\n- [ ] Seleccionar templates favoritos\n- [ ] Configurar notificaciones',
              duration: 15
            }
          ],
          quiz: {
            id: 'quiz-1',
            title: 'Evaluación: Introducción a CONSTRU',
            description: 'Verifica tu comprensión de los conceptos básicos',
            passingScore: 80,
            timeLimit: 10,
            retryAllowed: true,
            showResults: true,
            questions: [
              {
                id: 'q1',
                type: 'multiple_choice',
                question: '¿Cuáles son los módulos principales de CONSTRU?',
                options: [
                  'Cálculos, Presupuestos, Cronogramas',
                  'Solo Presupuestos',
                  'Cálculos y Dibujos',
                  'Cronogramas únicamente'
                ],
                correctAnswers: ['Cálculos, Presupuestos, Cronogramas'],
                explanation: 'CONSTRU integra cálculos técnicos, presupuestos y cronogramas en una plataforma unificada',
                points: 25,
                difficulty: 'easy'
              },
              {
                id: 'q2',
                type: 'true_false',
                question: 'Los templates de CONSTRU están basados en normativa NEC de Ecuador',
                options: ['Verdadero', 'Falso'],
                correctAnswers: ['Verdadero'],
                explanation: 'Todos los cálculos y templates siguen estrictamente la normativa NEC ecuatoriana',
                points: 25,
                difficulty: 'easy'
              }
            ]
          },
          resources: [
            {
              id: 'res-1',
              name: 'Guía de Inicio Rápido',
              type: 'pdf',
              url: '/resources/quick-start-guide.pdf',
              description: 'Guía completa para empezar con CONSTRU',
              size: '2.4 MB',
              downloadable: true
            }
          ],
          tags: ['introducción', 'básico', 'dashboard', 'navegación'],
          languages: ['es'],
          version: '1.2',
          lastUpdated: new Date(2024, 5, 15),
          createdBy: 'CONSTRU Team',
          popularity: 95,
          rating: 4.8,
          completions: 1247,
          userProgress: {
            moduleId: 'module-1',
            userId: 'current-user',
            status: 'completed',
            progress: 100,
            startedAt: new Date(2024, 5, 10),
            completedAt: new Date(2024, 5, 12),
            timeSpent: 32,
            currentSection: 3,
            quizAttempts: [
              {
                id: 'attempt-1',
                attemptNumber: 1,
                score: 85,
                maxScore: 100,
                passed: true,
                answers: [
                  {
                    questionId: 'q1',
                    answer: 'Cálculos, Presupuestos, Cronogramas',
                    correct: true,
                    points: 25
                  }
                ],
                completedAt: new Date(2024, 5, 12),
                timeSpent: 8
              }
            ],
            notes: 'Módulo muy útil para empezar',
            bookmarked: true
          }
        },
        {
          id: 'module-2',
          title: 'Cálculos Estructurales con NEC',
          description: 'Domina los cálculos estructurales siguiendo la normativa ecuatoriana NEC',
          category: 'calculations',
          level: 'intermediate',
          estimatedTime: 90,
          format: 'hands_on',
          status: 'published',
          prerequisites: ['module-1'],
          learningObjectives: [
            'Aplicar parámetros sísmicos según NEC',
            'Calcular cargas de diseño correctamente',
            'Interpretar resultados de cálculos estructurales',
            'Generar reportes técnicos profesionales'
          ],
          content: [
            {
              id: 'content-4',
              type: 'text',
              title: 'Fundamentos de la Normativa NEC',
              content: 'La Norma Ecuatoriana de la Construcción (NEC) establece los parámetros mínimos...',
              duration: 20
            },
            {
              id: 'content-5',
              type: 'interactive',
              title: 'Práctica: Cálculo de Viga Simplemente Apoyada',
              content: 'Ejercicio práctico usando el simulador de cálculos',
              duration: 45,
              interactive: {
                type: 'simulation',
                config: {
                  scenario: 'beam_calculation',
                  mockData: {
                    length: 6,
                    load: 500,
                    material: 'concrete',
                    supports: 'simple'
                  }
                }
              }
            }
          ],
          quiz: {
            id: 'quiz-2',
            title: 'Evaluación: Cálculos Estructurales NEC',
            description: 'Demuestra tu conocimiento de cálculos estructurales',
            passingScore: 75,
            timeLimit: 30,
            retryAllowed: true,
            showResults: true,
            questions: [
              {
                id: 'q3',
                type: 'multiple_choice',
                question: '¿Cuál es el factor de zona sísmica para Quito según NEC?',
                options: ['0.15', '0.25', '0.30', '0.40'],
                correctAnswers: ['0.40'],
                explanation: 'Quito se encuentra en zona sísmica V con factor Z=0.40',
                points: 20,
                difficulty: 'medium'
              }
            ]
          },
          resources: [
            {
              id: 'res-2',
              name: 'Tabla de Parámetros Sísmicos NEC',
              type: 'pdf',
              url: '/resources/nec-seismic-parameters.pdf',
              description: 'Tabla completa de parámetros sísmicos por zona',
              downloadable: true
            },
            {
              id: 'res-3',
              name: 'Proyecto Ejemplo: Edificio 3 Pisos',
              type: 'sample_project',
              url: '/resources/sample-building-3-floors.json',
              description: 'Proyecto completo de ejemplo para práctica',
              downloadable: true
            }
          ],
          tags: ['estructural', 'NEC', 'sísmico', 'concreto', 'acero'],
          languages: ['es'],
          version: '2.1',
          lastUpdated: new Date(2024, 5, 20),
          createdBy: 'Ing. Carlos Mendoza',
          popularity: 87,
          rating: 4.6,
          completions: 543,
          userProgress: {
            moduleId: 'module-2',
            userId: 'current-user',
            status: 'in_progress',
            progress: 65,
            startedAt: new Date(2024, 5, 15),
            timeSpent: 58,
            currentSection: 1,
            quizAttempts: [],
            notes: '',
            bookmarked: false
          }
        },
        {
          id: 'module-3',
          title: 'Presupuestación Avanzada',
          description: 'Técnicas avanzadas de presupuestación y análisis de precios',
          category: 'budget',
          level: 'advanced',
          estimatedTime: 120,
          format: 'video',
          status: 'published',
          prerequisites: ['module-1', 'module-2'],
          learningObjectives: [
            'Crear templates personalizados de presupuesto',
            'Integrar precios variables del mercado',
            'Analizar sensibilidad de costos',
            'Generar documentos profesionales'
          ],
          content: [],
          resources: [],
          tags: ['presupuesto', 'costos', 'análisis', 'templates'],
          languages: ['es'],
          version: '1.5',
          lastUpdated: new Date(2024, 5, 18),
          createdBy: 'Arq. María González',
          popularity: 72,
          rating: 4.3,
          completions: 289
        }
      ];

      const mockLearningPaths: LearningPath[] = [
        {
          id: 'path-1',
          name: 'Arquitecto Profesional',
          description: 'Ruta completa para arquitectos que buscan dominar CONSTRU',
          targetRole: 'architect',
          difficulty: 'intermediate',
          estimatedHours: 8,
          modules: ['module-1', 'module-2', 'module-3'],
          prerequisites: ['Título profesional en Arquitectura'],
          certification: {
            name: 'Arquitecto Certificado CONSTRU',
            validityMonths: 24,
            requirements: {
              completionRate: 95,
              quizScore: 80,
              practicalExercises: 5
            }
          },
          enrolled: 145,
          completions: 87,
          rating: 4.7
        },
        {
          id: 'path-2',
          name: 'Ingeniero Estructurista',
          description: 'Especialización en cálculos estructurales y normativa NEC',
          targetRole: 'engineer',
          difficulty: 'advanced',
          estimatedHours: 12,
          modules: ['module-1', 'module-2'],
          prerequisites: ['Título en Ingeniería Civil', 'Experiencia en diseño estructural'],
          certification: {
            name: 'Ingeniero Estructurista Certificado CONSTRU',
            validityMonths: 18,
            requirements: {
              completionRate: 98,
              quizScore: 85,
              practicalExercises: 8
            }
          },
          enrolled: 78,
          completions: 52,
          rating: 4.9
        }
      ];

      const mockDocumentation: Documentation[] = [
        {
          id: 'doc-1',
          title: 'Guía de Usuario - Módulo de Cálculos',
          type: 'user_guide',
          category: 'calculations',
          content: '# Módulo de Cálculos\n\nEl módulo de cálculos permite realizar cálculos técnicos siguiendo la normativa NEC...',
          attachments: [],
          tags: ['cálculos', 'usuario', 'guía'],
          searchable: true,
          version: '3.2',
          lastUpdated: new Date(2024, 5, 22),
          author: 'Equipo Técnico CONSTRU',
          views: 1234,
          helpful: 89,
          notHelpful: 12,
          comments: [
            {
              id: 'comment-1',
              userId: 'user-1',
              userName: 'Ana García',
              content: 'Excelente documentación, muy clara y detallada.',
              createdAt: new Date(2024, 5, 20),
              helpful: 5,
              replies: []
            }
          ]
        },
        {
          id: 'doc-2',
          title: 'FAQ - Preguntas Frecuentes',
          type: 'faq',
          category: 'general',
          content: '## ¿Cómo resetear mi contraseña?\n\nPara resetear tu contraseña...',
          attachments: [],
          tags: ['faq', 'ayuda', 'soporte'],
          searchable: true,
          version: '1.8',
          lastUpdated: new Date(2024, 5, 25),
          author: 'Soporte CONSTRU',
          views: 2341,
          helpful: 156,
          notHelpful: 23,
          comments: []
        }
      ];

      setModules(mockModules);
      setLearningPaths(mockLearningPaths);
      setDocumentation(mockDocumentation);
      
    } catch (error) {
      console.error('Error loading training data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const startModule = async (moduleId: string) => {
    console.log('Starting module:', moduleId);
    // Implementation would track user progress
  };

  const enrollInPath = async (pathId: string) => {
    console.log('Enrolling in path:', pathId);
    // Implementation would enroll user in learning path
  };

  const submitQuiz = async (moduleId: string, answers: QuizAnswer[]) => {
    console.log('Submitting quiz for module:', moduleId, 'Answers:', answers);
    // Implementation would process quiz submission
  };

  const bookmarkModule = async (moduleId: string) => {
    setModules(prev => prev.map(module =>
      module.id === moduleId && module.userProgress
        ? {
            ...module,
            userProgress: {
              ...module.userProgress,
              bookmarked: !module.userProgress.bookmarked
            }
          }
        : module
    ));
  };

  const rateModule = async (moduleId: string, rating: number) => {
    console.log('Rating module:', moduleId, 'Rating:', rating);
    // Implementation would submit rating
  };

  useEffect(() => {
    loadTrainingData();
  }, []);

  const filteredModules = modules.filter(module => {
    const matchesSearch = !searchTerm || 
      module.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      module.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      module.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
    
    const matchesCategory = !filters.category || module.category === filters.category;
    const matchesLevel = !filters.level || module.level === filters.level;
    const matchesFormat = !filters.format || module.format === filters.format;
    
    return matchesSearch && matchesCategory && matchesLevel && matchesFormat;
  });

  return {
    modules: filteredModules,
    learningPaths,
    documentation,
    userProgress,
    isLoading,
    searchTerm,
    setSearchTerm,
    filters,
    setFilters,
    startModule,
    enrollInPath,
    submitQuiz,
    bookmarkModule,
    rateModule
  };
};

// Components
const ModuleCard: React.FC<{
  module: TrainingModule;
  onStart: (moduleId: string) => void;
  onBookmark: (moduleId: string) => void;
  onRate: (moduleId: string, rating: number) => void;
}> = ({ module, onStart, onBookmark, onRate }) => {
  const [showRating, setShowRating] = useState(false);

  const getLevelColor = (level: string) => {
    switch (level) {
      case 'beginner': return 'bg-green-100 text-green-800';
      case 'intermediate': return 'bg-yellow-100 text-yellow-800';
      case 'advanced': return 'bg-orange-100 text-orange-800';
      case 'expert': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getFormatIcon = (format: string) => {
    switch (format) {
      case 'video': return VideoCameraIcon;
      case 'interactive': return ComputerDesktopIcon;
      case 'document': return DocumentTextIcon;
      case 'quiz': return QuestionMarkCircleIcon;
      case 'hands_on': return LightBulbIcon;
      default: return BookOpenIcon;
    }
  };

  const getStatusColor = (status?: string) => {
    switch (status) {
      case 'completed': return 'text-green-600';
      case 'in_progress': return 'text-blue-600';
      default: return 'text-gray-600';
    }
  };

  const FormatIcon = getFormatIcon(module.format);

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-6 hover:shadow-lg transition-shadow">
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
            <FormatIcon className="h-6 w-6 text-blue-600" />
          </div>
          <div>
            <h3 className="font-semibold text-gray-900">{module.title}</h3>
            <div className="flex items-center gap-2 mt-1">
              <Badge variant="outline" className={getLevelColor(module.level)}>
                {module.level}
              </Badge>
              <Badge variant="secondary">
                {module.category.replace('_', ' ')}
              </Badge>
            </div>
          </div>
        </div>
        
        <button
          onClick={() => onBookmark(module.id)}
          className={`text-gray-400 hover:text-red-500 transition-colors ${
            module.userProgress?.bookmarked ? 'text-red-500' : ''
          }`}
        >
          <HeartIcon className={`h-5 w-5 ${module.userProgress?.bookmarked ? 'fill-current' : ''}`} />
        </button>
      </div>

      <p className="text-gray-600 text-sm mb-4 line-clamp-2">{module.description}</p>

      <div className="flex items-center gap-4 text-sm text-gray-500 mb-4">
        <div className="flex items-center gap-1">
          <ClockIcon className="h-4 w-4" />
          {module.estimatedTime} min
        </div>
        <div className="flex items-center gap-1">
          <UserGroupIcon className="h-4 w-4" />
          {module.completions} completados
        </div>
        <div className="flex items-center gap-1">
          <StarIcon className="h-4 w-4" />
          {module.rating.toFixed(1)}
        </div>
      </div>

      {module.userProgress && (
        <div className="mb-4">
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm font-medium text-gray-700">Progreso</span>
            <span className={`text-sm font-medium ${getStatusColor(module.userProgress.status)}`}>
              {module.userProgress.progress}%
            </span>
          </div>
          <ProgressBar 
            progress={module.userProgress.progress} 
            color={module.userProgress.status === 'completed' ? 'green' : 'blue'} 
          />
        </div>
      )}

      <div className="flex items-center justify-between">
        <div className="flex flex-wrap gap-1">
          {module.tags.slice(0, 3).map((tag) => (
            <span
              key={tag}
              className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full"
            >
              {tag}
            </span>
          ))}
        </div>

        <div className="flex gap-2">
          {!showRating ? (
            <button
              onClick={() => setShowRating(true)}
              className="text-gray-400 hover:text-yellow-500 transition-colors"
            >
              <StarIcon className="h-4 w-4" />
            </button>
          ) : (
            <div className="flex">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  onClick={() => {
                    onRate(module.id, star);
                    setShowRating(false);
                  }}
                  className="text-yellow-400 hover:text-yellow-500"
                >
                  <StarIconSolid className="h-4 w-4" />
                </button>
              ))}
            </div>
          )}
          
          <button
            onClick={() => onStart(module.id)}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            {module.userProgress?.status === 'completed' ? (
              <>
                <EyeIcon className="h-4 w-4" />
                Revisar
              </>
            ) : module.userProgress?.status === 'in_progress' ? (
              <>
                <PlayIcon className="h-4 w-4" />
                Continuar
              </>
            ) : (
              <>
                <PlayIcon className="h-4 w-4" />
                Empezar
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

const LearningPathCard: React.FC<{
  path: LearningPath;
  onEnroll: (pathId: string) => void;
}> = ({ path, onEnroll }) => {
  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'beginner': return 'bg-green-100 text-green-800';
      case 'intermediate': return 'bg-yellow-100 text-yellow-800';
      case 'advanced': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const completionRate = path.completions > 0 ? (path.completions / path.enrolled) * 100 : 0;

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-6">
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
            <AcademicCapIcon className="h-6 w-6 text-purple-600" />
          </div>
          <div>
            <h3 className="font-semibold text-gray-900">{path.name}</h3>
            <div className="flex items-center gap-2 mt-1">
              <Badge variant="outline" className={getDifficultyColor(path.difficulty)}>
                {path.difficulty}
              </Badge>
              <Badge variant="secondary">
                {path.targetRole.replace('_', ' ')}
              </Badge>
            </div>
          </div>
        </div>
      </div>

      <p className="text-gray-600 text-sm mb-4">{path.description}</p>

      <div className="grid grid-cols-2 gap-4 text-sm mb-4">
        <div>
          <div className="text-gray-500">Duración Estimada</div>
          <div className="font-medium">{path.estimatedHours} horas</div>
        </div>
        <div>
          <div className="text-gray-500">Módulos</div>
          <div className="font-medium">{path.modules.length} módulos</div>
        </div>
        <div>
          <div className="text-gray-500">Inscritos</div>
          <div className="font-medium">{path.enrolled}</div>
        </div>
        <div>
          <div className="text-gray-500">Tasa de Finalización</div>
          <div className="font-medium">{completionRate.toFixed(1)}%</div>
        </div>
      </div>

      {path.certification && (
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3 mb-4">
          <div className="flex items-center gap-2 mb-1">
            <AcademicCapIcon className="h-4 w-4 text-yellow-600" />
            <span className="text-sm font-medium text-yellow-800">Certificación Disponible</span>
          </div>
          <div className="text-sm text-yellow-700">{path.certification.name}</div>
          <div className="text-xs text-yellow-600">
            Válida por {path.certification.validityMonths} meses
          </div>
        </div>
      )}

      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="flex">
            {[1, 2, 3, 4, 5].map((star) => (
              <StarIconSolid
                key={star}
                className={`h-4 w-4 ${
                  star <= path.rating ? 'text-yellow-400' : 'text-gray-300'
                }`}
              />
            ))}
          </div>
          <span className="text-sm text-gray-600">({path.rating.toFixed(1)})</span>
        </div>

        <button
          onClick={() => onEnroll(path.id)}
          className="flex items-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
        >
          <AcademicCapIcon className="h-4 w-4" />
          Inscribirse
        </button>
      </div>
    </div>
  );
};

const SearchAndFilters: React.FC<{
  searchTerm: string;
  onSearchChange: (term: string) => void;
  filters: SearchFilters;
  onFiltersChange: (filters: SearchFilters) => void;
}> = ({ searchTerm, onSearchChange, filters, onFiltersChange }) => {
  const [showFilters, setShowFilters] = useState(false);

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-4">
      <div className="flex items-center gap-4">
        <div className="flex-1 relative">
          <MagnifyingGlassIcon className="h-5 w-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Buscar módulos, rutas de aprendizaje..."
            value={searchTerm}
            onChange={(e) => onSearchChange(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>
        
        <button
          onClick={() => setShowFilters(!showFilters)}
          className="flex items-center gap-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
        >
          <FunnelIcon className="h-4 w-4" />
          Filtros
        </button>
      </div>

      {showFilters && (
        <div className="mt-4 pt-4 border-t border-gray-200">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Categoría
              </label>
              <select
                value={filters.category || ''}
                onChange={(e) => onFiltersChange({ ...filters, category: e.target.value || undefined })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="">Todas</option>
                <option value="getting_started">Introducción</option>
                <option value="calculations">Cálculos</option>
                <option value="budget">Presupuestos</option>
                <option value="schedule">Cronogramas</option>
                <option value="mobile">Móvil</option>
                <option value="advanced">Avanzado</option>
                <option value="admin">Administración</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Nivel
              </label>
              <select
                value={filters.level || ''}
                onChange={(e) => onFiltersChange({ ...filters, level: e.target.value || undefined })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="">Todos</option>
                <option value="beginner">Principiante</option>
                <option value="intermediate">Intermedio</option>
                <option value="advanced">Avanzado</option>
                <option value="expert">Experto</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Formato
              </label>
              <select
                value={filters.format || ''}
                onChange={(e) => onFiltersChange({ ...filters, format: e.target.value || undefined })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="">Todos</option>
                <option value="interactive">Interactivo</option>
                <option value="video">Video</option>
                <option value="document">Documento</option>
                <option value="quiz">Quiz</option>
                <option value="hands_on">Práctica</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Idioma
              </label>
              <select
                value={filters.language || ''}
                onChange={(e) => onFiltersChange({ ...filters, language: e.target.value || undefined })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="">Todos</option>
                <option value="es">Español</option>
                <option value="en">English</option>
              </select>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// Main Component
const TrainingDocumentationSystem: React.FC = () => {
  const {
    modules,
    learningPaths,
    documentation,
    isLoading,
    searchTerm,
    setSearchTerm,
    filters,
    setFilters,
    startModule,
    enrollInPath,
    bookmarkModule,
    rateModule
  } = useTrainingSystem();

  const [activeTab, setActiveTab] = useState<'modules' | 'paths' | 'docs'>('modules');

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
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            Centro de Capacitación
          </h1>
          <p className="text-gray-600 mt-1">
            Aprende a dominar CONSTRU con nuestros módulos interactivos
          </p>
        </div>
        
        <div className="flex gap-2">
          <button className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors">
            <AcademicCapIcon className="h-4 w-4" />
            Mis Certificaciones
          </button>
          <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
            <ChartBarIcon className="h-4 w-4" />
            Mi Progreso
          </button>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="mb-6">
        <SearchAndFilters
          searchTerm={searchTerm}
          onSearchChange={setSearchTerm}
          filters={filters}
          onFiltersChange={setFilters}
        />
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200 mb-6">
        <nav className="flex space-x-8">
          {[
            { id: 'modules', label: 'Módulos de Capacitación', icon: BookOpenIcon },
            { id: 'paths', label: 'Rutas de Aprendizaje', icon: AcademicCapIcon },
            { id: 'docs', label: 'Documentación', icon: DocumentTextIcon }
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
      {activeTab === 'modules' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
          {modules.map((module) => (
            <ModuleCard
              key={module.id}
              module={module}
              onStart={startModule}
              onBookmark={bookmarkModule}
              onRate={rateModule}
            />
          ))}
        </div>
      )}

      {activeTab === 'paths' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {learningPaths.map((path) => (
            <LearningPathCard
              key={path.id}
              path={path}
              onEnroll={enrollInPath}
            />
          ))}
        </div>
      )}

      {activeTab === 'docs' && (
        <div className="space-y-4">
          {documentation.map((doc) => (
            <div key={doc.id} className="bg-white rounded-xl border border-gray-200 p-6">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h3 className="font-semibold text-gray-900">{doc.title}</h3>
                  <div className="flex items-center gap-2 mt-1">
                    <Badge variant="secondary">
                      {doc.type.replace('_', ' ')}
                    </Badge>
                    <Badge variant="outline">
                      {doc.category}
                    </Badge>
                    <span className="text-sm text-gray-500">v{doc.version}</span>
                  </div>
                </div>
                
                <div className="flex gap-2">
                  <button className="text-gray-400 hover:text-gray-600">
                    <ShareIcon className="h-4 w-4" />
                  </button>
                  <button className="text-gray-400 hover:text-gray-600">
                    <PrinterIcon className="h-4 w-4" />
                  </button>
                </div>
              </div>

              <div className="text-sm text-gray-600 mb-4 line-clamp-3">
                {doc.content.substring(0, 200)}...
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4 text-sm text-gray-500">
                  <span>{doc.views} visualizaciones</span>
                  <span>{doc.helpful} útiles</span>
                  <span>Por {doc.author}</span>
                </div>
                
                <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                  <EyeIcon className="h-4 w-4" />
                  Ver Documento
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default TrainingDocumentationSystem;