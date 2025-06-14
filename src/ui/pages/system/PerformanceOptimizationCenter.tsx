// src/ui/pages/system/PerformanceOptimizationCenter.tsx
import React, { useState, useEffect, useCallback } from 'react';
import { 
  BoltIcon,
  ArrowPathIcon,
  ExclamationTriangleIcon,
  ClockIcon,
  AdjustmentsHorizontalIcon,
  PlayIcon,
  LightBulbIcon,
  ArrowTrendingUpIcon,
  ArrowTrendingDownIcon,
  ServerIcon,
  DevicePhoneMobileIcon,
  GlobeAltIcon,
  CircleStackIcon,
  CodeBracketIcon,
  BeakerIcon
} from '@heroicons/react/24/outline';
import { LoadingSpinner, Badge, ProgressBar, Alert } from '../shared/components/SharedComponents';

interface PerformanceMetrics {
  overall: {
    score: number;
    grade: 'A' | 'B' | 'C' | 'D' | 'F';
    trend: 'improving' | 'stable' | 'degrading';
  };
  frontend: {
    loadTime: number;
    fcp: number; // First Contentful Paint
    lcp: number; // Largest Contentful Paint
    cls: number; // Cumulative Layout Shift
    fid: number; // First Input Delay
    ttfb: number; // Time to First Byte
    bundleSize: number;
    cacheHitRate: number;
  };
  backend: {
    responseTime: number;
    throughput: number;
    errorRate: number;
    cpuUsage: number;
    memoryUsage: number;
    dbQueryTime: number;
    apiLatency: number;
    concurrentUsers: number;
  };
  mobile: {
    appLaunchTime: number;
    memoryUsage: number;
    batteryImpact: number;
    networkUsage: number;
    crashRate: number;
    offlineCapability: number;
  };
  integrations: {
    syncLatency: number;
    webhookResponseTime: number;
    externalApiLatency: number;
    dataConsistency: number;
    failureRate: number;
  };
}

interface OptimizationRule {
  id: string;
  name: string;
  category: 'frontend' | 'backend' | 'database' | 'mobile' | 'integration' | 'cache';
  priority: 'low' | 'medium' | 'high' | 'critical';
  impact: 'low' | 'medium' | 'high';
  effort: 'low' | 'medium' | 'high';
  description: string;
  currentValue: number;
  targetValue: number;
  unit: string;
  status: 'pending' | 'running' | 'completed' | 'failed' | 'disabled';
  automatable: boolean;
  schedule?: {
    enabled: boolean;
    frequency: 'continuous' | 'hourly' | 'daily' | 'weekly';
    conditions: string[];
  };
  implementation: {
    type: 'code_split' | 'lazy_load' | 'cache' | 'compression' | 'cdn' | 'database_index' | 'query_optimization' | 'resource_pooling';
    parameters: Record<string, any>;
  };
  metrics: {
    beforeOptimization?: number;
    afterOptimization?: number;
    improvement?: number;
    lastRun?: Date;
  };
}

interface PerformanceIssue {
  id: string;
  type: 'bottleneck' | 'memory_leak' | 'slow_query' | 'large_bundle' | 'cache_miss' | 'api_timeout';
  severity: 'low' | 'medium' | 'high' | 'critical';
  title: string;
  description: string;
  location: string;
  impact: string;
  detectedAt: Date;
  frequency: number;
  affectedUsers: number;
  recommendations: string[];
  status: 'new' | 'investigating' | 'fixing' | 'resolved' | 'ignored';
}

interface OptimizationJob {
  id: string;
  name: string;
  type: 'manual' | 'scheduled' | 'automated';
  rules: string[];
  status: 'pending' | 'running' | 'completed' | 'failed' | 'cancelled';
  progress: number;
  startedAt?: Date;
  completedAt?: Date;
  duration?: number;
  results?: {
    optimized: number;
    failed: number;
    skipped: number;
    totalImprovement: number;
  };
  logs: string[];
}

interface CacheStrategy {
  id: string;
  name: string;
  type: 'browser' | 'cdn' | 'api' | 'database' | 'memory';
  enabled: boolean;
  ttl: number; // Time to live in seconds
  hitRate: number;
  missRate: number;
  size: number;
  maxSize: number;
  evictionPolicy: 'lru' | 'lfu' | 'fifo' | 'ttl';
  lastClearance?: Date;
  configuration: Record<string, any>;
}

// Custom Hook
const usePerformanceOptimization = () => {
  const [metrics, setMetrics] = useState<PerformanceMetrics | null>(null);
  const [rules, setRules] = useState<OptimizationRule[]>([]);
  const [issues, setIssues] = useState<PerformanceIssue[]>([]);
  const [jobs, setJobs] = useState<OptimizationJob[]>([]);
  const [cacheStrategies, setCacheStrategies] = useState<CacheStrategy[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isOptimizing, setIsOptimizing] = useState(false);

  const loadPerformanceData = useCallback(async () => {
    setIsLoading(true);
    try {
      // Simulate API calls
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const mockMetrics: PerformanceMetrics = {
        overall: {
          score: 78,
          grade: 'B',
          trend: 'improving'
        },
        frontend: {
          loadTime: 2.3,
          fcp: 1.2,
          lcp: 2.8,
          cls: 0.12,
          fid: 45,
          ttfb: 180,
          bundleSize: 2.4,
          cacheHitRate: 87.5
        },
        backend: {
          responseTime: 245,
          throughput: 145.7,
          errorRate: 0.034,
          cpuUsage: 45,
          memoryUsage: 68,
          dbQueryTime: 23,
          apiLatency: 156,
          concurrentUsers: 234
        },
        mobile: {
          appLaunchTime: 3.2,
          memoryUsage: 45,
          batteryImpact: 12,
          networkUsage: 23,
          crashRate: 0.12,
          offlineCapability: 95
        },
        integrations: {
          syncLatency: 890,
          webhookResponseTime: 156,
          externalApiLatency: 2340,
          dataConsistency: 98.5,
          failureRate: 0.08
        }
      };

      const mockRules: OptimizationRule[] = [
        {
          id: 'rule-1',
          name: 'Lazy Loading de Componentes',
          category: 'frontend',
          priority: 'high',
          impact: 'high',
          effort: 'medium',
          description: 'Implementar lazy loading para componentes de cronograma pesados',
          currentValue: 2.8,
          targetValue: 1.5,
          unit: 'seconds',
          status: 'pending',
          automatable: true,
          schedule: {
            enabled: true,
            frequency: 'daily',
            conditions: ['lcp > 2.5']
          },
          implementation: {
            type: 'lazy_load',
            parameters: {
              components: ['ScheduleGantt', 'BudgetDetails', 'ProjectDashboard'],
              threshold: '50px'
            }
          },
          metrics: {}
        },
        {
          id: 'rule-2',
          name: 'Optimización de Consultas Budget',
          category: 'database',
          priority: 'critical',
          impact: 'high',
          effort: 'low',
          description: 'Agregar índices faltantes para consultas de presupuesto complejas',
          currentValue: 234,
          targetValue: 80,
          unit: 'ms',
          status: 'running',
          automatable: false,
          implementation: {
            type: 'database_index',
            parameters: {
              tables: ['budget_items', 'calculations', 'material_prices'],
              indexes: ['budget_id_created_at', 'calculation_type_zone']
            }
          },
          metrics: {
            beforeOptimization: 234,
            lastRun: new Date(Date.now() - 3600000)
          }
        },
        {
          id: 'rule-3',
          name: 'CDN para Assets Estáticos',
          category: 'frontend',
          priority: 'medium',
          impact: 'medium',
          effort: 'low',
          description: 'Configurar CDN para imágenes y archivos estáticos',
          currentValue: 1.8,
          targetValue: 0.8,
          unit: 'seconds',
          status: 'completed',
          automatable: true,
          implementation: {
            type: 'cdn',
            parameters: {
              provider: 'cloudflare',
              regions: ['us-east-1', 'eu-west-1', 'ap-south-1']
            }
          },
          metrics: {
            beforeOptimization: 1.8,
            afterOptimization: 0.9,
            improvement: 50,
            lastRun: new Date(Date.now() - 86400000)
          }
        },
        {
          id: 'rule-4',
          name: 'Compresión de Respuestas API',
          category: 'backend',
          priority: 'medium',
          impact: 'medium',
          effort: 'low',
          description: 'Habilitar compresión gzip/brotli para respuestas API',
          currentValue: 245,
          targetValue: 150,
          unit: 'ms',
          status: 'pending',
          automatable: true,
          implementation: {
            type: 'compression',
            parameters: {
              algorithm: 'brotli',
              level: 6,
              minSize: '1kb'
            }
          },
          metrics: {}
        },
        {
          id: 'rule-5',
          name: 'Cache de Cálculos Complejos',
          category: 'cache',
          priority: 'high',
          impact: 'high',
          effort: 'medium',
          description: 'Implementar cache Redis para resultados de cálculos técnicos',
          currentValue: 1240,
          targetValue: 200,
          unit: 'ms',
          status: 'pending',
          automatable: true,
          implementation: {
            type: 'cache',
            parameters: {
              provider: 'redis',
              ttl: 3600,
              keys: ['calculation_results', 'material_prices', 'nec_parameters']
            }
          },
          metrics: {}
        }
      ];

      const mockIssues: PerformanceIssue[] = [
        {
          id: 'issue-1',
          type: 'slow_query',
          severity: 'high',
          title: 'Query lenta en generación de presupuestos',
          description: 'La consulta para obtener precios de materiales tarda más de 2 segundos',
          location: 'BudgetGenerationService.getMaterialPrices()',
          impact: 'Afecta tiempo de generación de presupuestos en 40%',
          detectedAt: new Date(Date.now() - 7200000),
          frequency: 34,
          affectedUsers: 67,
          recommendations: [
            'Agregar índice compuesto en tabla material_prices',
            'Implementar cache para precios frecuentemente consultados',
            'Optimizar JOIN con tabla de proveedores'
          ],
          status: 'investigating'
        },
        {
          id: 'issue-2',
          type: 'large_bundle',
          severity: 'medium',
          title: 'Bundle JavaScript excesivamente grande',
          description: 'El bundle principal supera los 2MB, afectando tiempo de carga inicial',
          location: 'main.js',
          impact: 'Incrementa tiempo de First Contentful Paint en 800ms',
          detectedAt: new Date(Date.now() - 86400000),
          frequency: 100,
          affectedUsers: 245,
          recommendations: [
            'Implementar code splitting por rutas',
            'Lazy loading de componentes pesados',
            'Tree shaking más agresivo'
          ],
          status: 'new'
        },
        {
          id: 'issue-3',
          type: 'memory_leak',
          severity: 'critical',
          title: 'Memory leak en módulo de cronogramas',
          description: 'El componente de Gantt no limpia event listeners correctamente',
          location: 'ScheduleGanttChart.tsx',
          impact: 'Causa crashes en sesiones largas (>2 horas)',
          detectedAt: new Date(Date.now() - 3600000),
          frequency: 8,
          affectedUsers: 12,
          recommendations: [
            'Revisar cleanup en useEffect hooks',
            'Implementar debouncing en event handlers',
            'Usar WeakMap para referencias'
          ],
          status: 'fixing'
        }
      ];

      const mockJobs: OptimizationJob[] = [
        {
          id: 'job-1',
          name: 'Optimización Nocturna Automática',
          type: 'scheduled',
          rules: ['rule-1', 'rule-4'],
          status: 'completed',
          progress: 100,
          startedAt: new Date(Date.now() - 7200000),
          completedAt: new Date(Date.now() - 5400000),
          duration: 1800,
          results: {
            optimized: 2,
            failed: 0,
            skipped: 0,
            totalImprovement: 23.5
          },
          logs: [
            'Iniciando optimización de lazy loading...',
            'Componentes optimizados: 3',
            'Mejora en LCP: 0.8s',
            'Habilitando compresión API...',
            'Compresión configurada exitosamente',
            'Optimización completada'
          ]
        }
      ];

      const mockCacheStrategies: CacheStrategy[] = [
        {
          id: 'cache-1',
          name: 'Browser Cache',
          type: 'browser',
          enabled: true,
          ttl: 86400,
          hitRate: 78.5,
          missRate: 21.5,
          size: 45,
          maxSize: 100,
          evictionPolicy: 'lru',
          configuration: {
            maxAge: '1d',
            staleWhileRevalidate: '1h'
          }
        },
        {
          id: 'cache-2',
          name: 'API Response Cache',
          type: 'api',
          enabled: true,
          ttl: 1800,
          hitRate: 92.3,
          missRate: 7.7,
          size: 234,
          maxSize: 500,
          evictionPolicy: 'ttl',
          configuration: {
            endpoints: ['/api/calculations', '/api/materials', '/api/templates'],
            varyBy: ['user', 'zone']
          }
        },
        {
          id: 'cache-3',
          name: 'Database Query Cache',
          type: 'database',
          enabled: false,
          ttl: 3600,
          hitRate: 0,
          missRate: 0,
          size: 0,
          maxSize: 1000,
          evictionPolicy: 'lru',
          configuration: {
            queryTypes: ['complex_reports', 'material_pricing', 'nec_calculations']
          }
        }
      ];

      setMetrics(mockMetrics);
      setRules(mockRules);
      setIssues(mockIssues);
      setJobs(mockJobs);
      setCacheStrategies(mockCacheStrategies);
      
    } catch (error) {
      console.error('Error loading performance data:', error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const runOptimization = async (ruleIds: string[]) => {
    setIsOptimizing(true);
    try {
      const newJob: OptimizationJob = {
        id: `job-${Date.now()}`,
        name: 'Optimización Manual',
        type: 'manual',
        rules: ruleIds,
        status: 'running',
        progress: 0,
        startedAt: new Date(),
        logs: ['Iniciando optimización manual...']
      };

      setJobs(prev => [newJob, ...prev]);

      // Simulate optimization process
      for (let i = 0; i <= 100; i += 10) {
        await new Promise(resolve => setTimeout(resolve, 500));
        setJobs(prev => prev.map(job => 
          job.id === newJob.id 
            ? { ...job, progress: i, logs: [...job.logs, `Progreso: ${i}%`] }
            : job
        ));
      }

      // Complete job
      setJobs(prev => prev.map(job => 
        job.id === newJob.id 
          ? { 
              ...job, 
              status: 'completed' as const,
              completedAt: new Date(),
              duration: 5000,
              results: {
                optimized: ruleIds.length,
                failed: 0,
                skipped: 0,
                totalImprovement: 15.2
              },
              logs: [...job.logs, 'Optimización completada exitosamente']
            }
          : job
      ));

    } catch (error) {
      console.error('Error running optimization:', error);
    } finally {
      setIsOptimizing(false);
    }
  };

  const toggleCacheStrategy = async (cacheId: string) => {
    setCacheStrategies(prev => prev.map(cache =>
      cache.id === cacheId ? { ...cache, enabled: !cache.enabled } : cache
    ));
  };

  const clearCache = async (cacheId: string) => {
    setCacheStrategies(prev => prev.map(cache =>
      cache.id === cacheId 
        ? { 
            ...cache, 
            size: 0, 
            hitRate: 0, 
            missRate: 0, 
            lastClearance: new Date() 
          }
        : cache
    ));
  };

  useEffect(() => {
    loadPerformanceData();
  }, [loadPerformanceData]);

  return {
    metrics,
    rules,
    issues,
    jobs,
    cacheStrategies,
    isLoading,
    isOptimizing,
    loadPerformanceData,
    runOptimization,
    toggleCacheStrategy,
    clearCache
  };
};

// Components
const PerformanceOverview: React.FC<{ metrics: PerformanceMetrics }> = ({ metrics }) => {
  const getGradeColor = (grade: string) => {
    switch (grade) {
      case 'A': return 'text-green-600 bg-green-50';
      case 'B': return 'text-blue-600 bg-blue-50';
      case 'C': return 'text-yellow-600 bg-yellow-50';
      case 'D': return 'text-orange-600 bg-orange-50';
      case 'F': return 'text-red-600 bg-red-50';
      default: return 'text-gray-600 bg-gray-50';
    }
  };

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case 'improving': return <ArrowTrendingUpIcon className="h-5 w-5 text-green-600" />;
      case 'degrading': return <ArrowTrendingDownIcon className="h-5 w-5 text-red-600" />;
      default: return <ClockIcon className="h-5 w-5 text-gray-600" />;
    }
  };

  return (
    <div className={`rounded-2xl border-2 p-6 ${getGradeColor(metrics.overall.grade)} border-current`}>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-full bg-white/50 flex items-center justify-center">
            <BoltIcon className="h-8 w-8" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-2xl font-bold">Grade {metrics.overall.grade}</h2>
              {getTrendIcon(metrics.overall.trend)}
            </div>
            <p className="opacity-90">Performance General</p>
          </div>
        </div>
        
        <div className="text-right">
          <div className="text-4xl font-bold">{metrics.overall.score}</div>
          <div className="text-sm opacity-90">Performance Score</div>
        </div>
      </div>
    </div>
  );
};

const MetricsDashboard: React.FC<{ metrics: PerformanceMetrics }> = ({ metrics }) => (
  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
    {/* Frontend Metrics */}
    <div className="bg-white rounded-xl border border-gray-200 p-4">
      <div className="flex items-center gap-3 mb-4">
        <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
          <GlobeAltIcon className="h-5 w-5 text-blue-600" />
        </div>
        <div>
          <h3 className="font-medium text-gray-900">Frontend</h3>
          <p className="text-sm text-gray-600">Web Performance</p>
        </div>
      </div>
      
      <div className="space-y-3">
        <div className="flex justify-between text-sm">
          <span className="text-gray-600">Load Time</span>
          <span className="font-medium">{metrics.frontend.loadTime}s</span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-gray-600">LCP</span>
          <span className="font-medium">{metrics.frontend.lcp}s</span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-gray-600">FID</span>
          <span className="font-medium">{metrics.frontend.fid}ms</span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-gray-600">Cache Hit</span>
          <span className="font-medium">{metrics.frontend.cacheHitRate}%</span>
        </div>
      </div>
    </div>

    {/* Backend Metrics */}
    <div className="bg-white rounded-xl border border-gray-200 p-4">
      <div className="flex items-center gap-3 mb-4">
        <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
          <ServerIcon className="h-5 w-5 text-green-600" />
        </div>
        <div>
          <h3 className="font-medium text-gray-900">Backend</h3>
          <p className="text-sm text-gray-600">API Performance</p>
        </div>
      </div>
      
      <div className="space-y-3">
        <div className="flex justify-between text-sm">
          <span className="text-gray-600">Response Time</span>
          <span className="font-medium">{metrics.backend.responseTime}ms</span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-gray-600">Throughput</span>
          <span className="font-medium">{metrics.backend.throughput} req/s</span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-gray-600">Error Rate</span>
          <span className="font-medium">{metrics.backend.errorRate}%</span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-gray-600">CPU Usage</span>
          <span className="font-medium">{metrics.backend.cpuUsage}%</span>
        </div>
      </div>
    </div>

    {/* Mobile Metrics */}
    <div className="bg-white rounded-xl border border-gray-200 p-4">
      <div className="flex items-center gap-3 mb-4">
        <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
          <DevicePhoneMobileIcon className="h-5 w-5 text-purple-600" />
        </div>
        <div>
          <h3 className="font-medium text-gray-900">Mobile</h3>
          <p className="text-sm text-gray-600">App Performance</p>
        </div>
      </div>
      
      <div className="space-y-3">
        <div className="flex justify-between text-sm">
          <span className="text-gray-600">Launch Time</span>
          <span className="font-medium">{metrics.mobile.appLaunchTime}s</span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-gray-600">Memory</span>
          <span className="font-medium">{metrics.mobile.memoryUsage}MB</span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-gray-600">Crash Rate</span>
          <span className="font-medium">{metrics.mobile.crashRate}%</span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-gray-600">Offline Cap.</span>
          <span className="font-medium">{metrics.mobile.offlineCapability}%</span>
        </div>
      </div>
    </div>

    {/* Integration Metrics */}
    <div className="bg-white rounded-xl border border-gray-200 p-4">
      <div className="flex items-center gap-3 mb-4">
        <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center">
          <BeakerIcon className="h-5 w-5 text-orange-600" />
        </div>
        <div>
          <h3 className="font-medium text-gray-900">Integrations</h3>
          <p className="text-sm text-gray-600">Sync Performance</p>
        </div>
      </div>
      
      <div className="space-y-3">
        <div className="flex justify-between text-sm">
          <span className="text-gray-600">Sync Latency</span>
          <span className="font-medium">{metrics.integrations.syncLatency}ms</span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-gray-600">API Latency</span>
          <span className="font-medium">{metrics.integrations.externalApiLatency}ms</span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-gray-600">Consistency</span>
          <span className="font-medium">{metrics.integrations.dataConsistency}%</span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-gray-600">Failure Rate</span>
          <span className="font-medium">{metrics.integrations.failureRate}%</span>
        </div>
      </div>
    </div>
  </div>
);

const OptimizationRulesPanel: React.FC<{
  rules: OptimizationRule[];
  onRunOptimization: (ruleIds: string[]) => void;
  isOptimizing: boolean;
}> = ({ rules, onRunOptimization, isOptimizing }) => {
  const [selectedRules, setSelectedRules] = useState<string[]>([]);

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'critical': return 'bg-red-100 text-red-800';
      case 'high': return 'bg-orange-100 text-orange-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'low': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'bg-green-100 text-green-800';
      case 'running': return 'bg-blue-100 text-blue-800';
      case 'failed': return 'bg-red-100 text-red-800';
      case 'disabled': return 'bg-gray-100 text-gray-800';
      default: return 'bg-yellow-100 text-yellow-800';
    }
  };

  const handleSelectRule = (ruleId: string) => {
    setSelectedRules(prev => 
      prev.includes(ruleId) 
        ? prev.filter(id => id !== ruleId)
        : [...prev, ruleId]
    );
  };

  const handleRunSelected = () => {
    if (selectedRules.length > 0) {
      onRunOptimization(selectedRules);
      setSelectedRules([]);
    }
  };

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
          <AdjustmentsHorizontalIcon className="h-5 w-5 text-blue-600" />
          Reglas de Optimización
        </h3>
        
        <div className="flex gap-2">
          <button
            onClick={handleRunSelected}
            disabled={selectedRules.length === 0 || isOptimizing}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {isOptimizing ? (
              <LoadingSpinner size="sm" />
            ) : (
              <PlayIcon className="h-4 w-4" />
            )}
            Ejecutar Seleccionadas ({selectedRules.length})
          </button>
        </div>
      </div>

      <div className="space-y-4">
        {rules.map((rule) => (
          <div key={rule.id} className="border border-gray-200 rounded-lg p-4">
            <div className="flex items-start gap-4">
              <input
                type="checkbox"
                checked={selectedRules.includes(rule.id)}
                onChange={() => handleSelectRule(rule.id)}
                disabled={rule.status === 'running' || rule.status === 'disabled'}
                className="mt-1 rounded text-blue-600 focus:ring-blue-500"
              />
              
              <div className="flex-1">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-medium text-gray-900">{rule.name}</h4>
                  <div className="flex gap-2">
                    <Badge variant="outline" className={getPriorityColor(rule.priority)}>
                      {rule.priority}
                    </Badge>
                    <Badge variant="outline" className={getStatusColor(rule.status)}>
                      {rule.status}
                    </Badge>
                    {rule.automatable && (
                      <Badge variant="secondary">Auto</Badge>
                    )}
                  </div>
                </div>
                
                <p className="text-sm text-gray-600 mb-3">{rule.description}</p>
                
                <div className="grid grid-cols-3 gap-4 text-sm">
                  <div>
                    <span className="text-gray-500">Actual:</span>
                    <span className="ml-2 font-medium">
                      {rule.currentValue} {rule.unit}
                    </span>
                  </div>
                  <div>
                    <span className="text-gray-500">Objetivo:</span>
                    <span className="ml-2 font-medium text-green-600">
                      {rule.targetValue} {rule.unit}
                    </span>
                  </div>
                  <div>
                    <span className="text-gray-500">Mejora Potencial:</span>
                    <span className="ml-2 font-medium text-blue-600">
                      {(((rule.currentValue - rule.targetValue) / rule.currentValue) * 100).toFixed(1)}%
                    </span>
                  </div>
                </div>
                
                {rule.metrics.afterOptimization && (
                  <div className="mt-3 p-2 bg-green-50 rounded-lg">
                    <div className="text-sm text-green-800">
                      ✓ Optimizado: {rule.metrics.afterOptimization} {rule.unit} 
                      ({rule.metrics.improvement}% mejora)
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

const PerformanceIssuesPanel: React.FC<{ issues: PerformanceIssue[] }> = ({ issues }) => {
  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical': return 'bg-red-100 text-red-800 border-red-200';
      case 'high': return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'medium': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'low': return 'bg-green-100 text-green-800 border-green-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'resolved': return 'bg-green-100 text-green-800';
      case 'fixing': return 'bg-blue-100 text-blue-800';
      case 'investigating': return 'bg-yellow-100 text-yellow-800';
      case 'ignored': return 'bg-gray-100 text-gray-800';
      default: return 'bg-red-100 text-red-800';
    }
  };

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
        <ExclamationTriangleIcon className="h-5 w-5 text-orange-600" />
        Issues de Performance
      </h3>
      
      <div className="space-y-4">
        {issues.slice(0, 5).map((issue) => (
          <div key={issue.id} className={`border rounded-lg p-4 ${getSeverityColor(issue.severity)}`}>
            <div className="flex items-start justify-between mb-2">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <Badge variant="outline" className={getStatusColor(issue.status)}>
                    {issue.status.replace('_', ' ')}
                  </Badge>
                  <span className="text-xs text-gray-500">{issue.type.replace('_', ' ')}</span>
                </div>
                <h4 className="font-medium text-gray-900">{issue.title}</h4>
                <p className="text-sm text-gray-600 mb-2">{issue.description}</p>
                <div className="text-sm text-gray-500">
                  <div>📍 {issue.location}</div>
                  <div>📊 {issue.impact}</div>
                  <div>👥 Afecta {issue.affectedUsers} usuarios • Frecuencia: {issue.frequency}x</div>
                </div>
              </div>
            </div>
            
            {issue.recommendations.length > 0 && (
              <div className="mt-3">
                <h5 className="text-sm font-medium text-gray-900 mb-1">Recomendaciones:</h5>
                <ul className="text-sm text-gray-600 space-y-1">
                  {issue.recommendations.map((rec, index) => (
                    <li key={index} className="flex items-start gap-2">
                      <LightBulbIcon className="h-4 w-4 text-yellow-500 mt-0.5 flex-shrink-0" />
                      {rec}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

const CacheManagementPanel: React.FC<{
  strategies: CacheStrategy[];
  onToggle: (cacheId: string) => void;
  onClear: (cacheId: string) => void;
}> = ({ strategies, onToggle, onClear }) => (
  <div className="bg-white rounded-xl border border-gray-200 p-6">
    <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
      <CircleStackIcon className="h-5 w-5 text-purple-600" />
      Gestión de Cache
    </h3>
    
    <div className="space-y-4">
      {strategies.map((cache) => (
        <div key={cache.id} className="border border-gray-200 rounded-lg p-4">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                <CodeBracketIcon className="h-5 w-5 text-purple-600" />
              </div>
              <div>
                <h4 className="font-medium text-gray-900">{cache.name}</h4>
                <p className="text-sm text-gray-600 capitalize">{cache.type} Cache</p>
              </div>
            </div>
            
            <div className="flex items-center gap-2">
              <button
                onClick={() => onToggle(cache.id)}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                  cache.enabled ? 'bg-blue-600' : 'bg-gray-200'
                }`}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                    cache.enabled ? 'translate-x-6' : 'translate-x-1'
                  }`}
                />
              </button>
              
              <button
                onClick={() => onClear(cache.id)}
                disabled={!cache.enabled}
                className="px-3 py-1 bg-red-100 text-red-700 text-sm rounded-lg hover:bg-red-200 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Limpiar
              </button>
            </div>
          </div>
          
          {cache.enabled && (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
              <div>
                <div className="text-gray-600">Hit Rate</div>
                <div className="font-medium text-green-600">{cache.hitRate}%</div>
              </div>
              <div>
                <div className="text-gray-600">Size</div>
                <div className="font-medium">{cache.size}MB / {cache.maxSize}MB</div>
              </div>
              <div>
                <div className="text-gray-600">TTL</div>
                <div className="font-medium">{cache.ttl}s</div>
              </div>
              <div>
                <div className="text-gray-600">Policy</div>
                <div className="font-medium uppercase">{cache.evictionPolicy}</div>
              </div>
            </div>
          )}
        </div>
      ))}
    </div>
  </div>
);

// Main Component
const PerformanceOptimizationCenter: React.FC = () => {
  const {
    metrics,
    rules,
    issues,
    jobs,
    cacheStrategies,
    isLoading,
    isOptimizing,
    loadPerformanceData,
    runOptimization,
    toggleCacheStrategy,
    clearCache
  } = usePerformanceOptimization();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <LoadingSpinner />
      </div>
    );
  }

  if (!metrics) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500">No se pudo cargar la información de performance</p>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            Centro de Optimización de Performance
          </h1>
          <p className="text-gray-600 mt-1">
            Monitoreo y optimización automática del sistema
          </p>
        </div>
        
        <button
          onClick={loadPerformanceData}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          <ArrowPathIcon className="h-4 w-4" />
          Actualizar Métricas
        </button>
      </div>

      {/* Performance Overview */}
      <div className="mb-8">
        <PerformanceOverview metrics={metrics} />
      </div>

      {/* Metrics Dashboard */}
      <div className="mb-8">
        <MetricsDashboard metrics={metrics} />
      </div>

      {/* Optimization Rules */}
      <div className="mb-8">
        <OptimizationRulesPanel
          rules={rules}
          onRunOptimization={runOptimization}
          isOptimizing={isOptimizing}
        />
      </div>

      {/* Issues and Cache Management */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <PerformanceIssuesPanel issues={issues} />
        <CacheManagementPanel
          strategies={cacheStrategies}
          onToggle={toggleCacheStrategy}
          onClear={clearCache}
        />
      </div>

      {/* Recent Jobs */}
      {jobs.length > 0 && (
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <ClockIcon className="h-5 w-5 text-blue-600" />
            Trabajos de Optimización Recientes
          </h3>
          
          <div className="space-y-4">
            {jobs.slice(0, 3).map((job) => (
              <div key={job.id} className="border border-gray-200 rounded-lg p-4">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-medium text-gray-900">{job.name}</h4>
                  <Badge variant={
                    job.status === 'completed' ? 'success' :
                    job.status === 'running' ? 'primary' :
                    job.status === 'failed' ? 'danger' : 'secondary'
                  }>
                    {job.status}
                  </Badge>
                </div>
                
                {job.status === 'running' && (
                  <div className="mb-3">
                    <ProgressBar progress={job.progress} color="blue" />
                    <div className="text-sm text-gray-600 mt-1">
                      Progreso: {job.progress}%
                    </div>
                  </div>
                )}
                
                {job.results && (
                  <div className="grid grid-cols-4 gap-4 text-sm mb-3">
                    <div>
                      <div className="text-gray-600">Optimizadas</div>
                      <div className="font-medium text-green-600">{job.results.optimized}</div>
                    </div>
                    <div>
                      <div className="text-gray-600">Fallidas</div>
                      <div className="font-medium text-red-600">{job.results.failed}</div>
                    </div>
                    <div>
                      <div className="text-gray-600">Omitidas</div>
                      <div className="font-medium text-gray-600">{job.results.skipped}</div>
                    </div>
                    <div>
                      <div className="text-gray-600">Mejora Total</div>
                      <div className="font-medium text-blue-600">{job.results.totalImprovement}%</div>
                    </div>
                  </div>
                )}
                
                <div className="text-sm text-gray-500">
                  {job.startedAt && (
                    <span>Iniciado: {job.startedAt.toLocaleString()}</span>
                  )}
                  {job.duration && (
                    <span className="ml-4">Duración: {Math.round(job.duration / 1000)}s</span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default PerformanceOptimizationCenter;