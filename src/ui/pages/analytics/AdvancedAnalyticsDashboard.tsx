// src/ui/pages/analytics/AdvancedAnalyticsDashboard.tsx
import React, { useState, useEffect} from 'react';
import { 
  ChartBarIcon,
  ArrowTrendingUpIcon,
  ArrowTrendingDownIcon,
  UserGroupIcon,
  CurrencyDollarIcon,
  CalendarDaysIcon,
  BuildingOfficeIcon,
  MapPinIcon,
  ClockIcon,
  EyeIcon,
  ArrowDownTrayIcon,
  FunnelIcon,
  ShareIcon,
  DocumentChartBarIcon,
  PresentationChartLineIcon,
  BeakerIcon,
  CpuChipIcon,
  DevicePhoneMobileIcon,
  GlobeAltIcon,
  ExclamationTriangleIcon,
  CheckCircleIcon,
} from '@heroicons/react/24/outline';
import { LoadingSpinner, Badge, ProgressBar } from '../shared/components/SharedComponents';

interface AnalyticsMetrics {
  period: {
    start: Date;
    end: Date;
    comparison: {
      start: Date;
      end: Date;
    };
  };
  overview: {
    totalUsers: number;
    activeUsers: number;
    newUsers: number;
    revenue: number;
    projects: number;
    calculations: number;
    budgets: number;
    schedules: number;
  };
  growth: {
    users: number;
    revenue: number;
    projects: number;
    engagement: number;
  };
  usage: {
    moduleUsage: ModuleUsage[];
    featureAdoption: FeatureAdoption[];
    userBehavior: UserBehaviorMetrics;
    deviceBreakdown: DeviceMetrics[];
    geographicDistribution: GeographicMetrics[];
  };
  performance: {
    systemHealth: number;
    responseTime: number;
    uptime: number;
    errorRate: number;
    satisfaction: number;
  };
  business: {
    conversionRate: number;
    churnRate: number;
    ltv: number; // Customer Lifetime Value
    cac: number; // Customer Acquisition Cost
    mrr: number; // Monthly Recurring Revenue
    arr: number; // Annual Recurring Revenue
  };
  predictions: {
    userGrowth: PredictionData[];
    revenueForcast: PredictionData[];
    churnRisk: ChurnRiskData[];
    featureDemand: FeatureDemandData[];
  };
}

interface ModuleUsage {
  module: 'calculations' | 'budget' | 'schedule' | 'mobile' | 'integration' | 'exports';
  name: string;
  sessions: number;
  uniqueUsers: number;
  avgSessionDuration: number;
  completionRate: number;
  growth: number;
  satisfaction: number;
}

interface FeatureAdoption {
  feature: string;
  category: string;
  adoptionRate: number;
  activeUsers: number;
  retentionRate: number;
  timeToFirstUse: number; // days
  powerUsers: number;
  growth: number;
}

interface UserBehaviorMetrics {
  avgSessionDuration: number;
  avgPagesPerSession: number;
  bounceRate: number;
  returnVisitorRate: number;
  featureUsageDepth: number;
  workflowCompletionRate: number;
  supportTicketRate: number;
  referralRate: number;
}

interface DeviceMetrics {
  type: 'desktop' | 'mobile' | 'tablet';
  users: number;
  percentage: number;
  avgSessionDuration: number;
  conversionRate: number;
  satisfaction: number;
}

interface GeographicMetrics {
  region: string;
  city: string;
  users: number;
  percentage: number;
  revenue: number;
  growth: number;
  popularFeatures: string[];
}

interface PredictionData {
  date: Date;
  actual?: number;
  predicted: number;
  confidence: number;
  factors: string[];
}

interface ChurnRiskData {
  userId: string;
  userName: string;
  riskScore: number; // 0-100
  factors: string[];
  lastActivity: Date;
  recommendations: string[];
}

interface FeatureDemandData {
  feature: string;
  currentDemand: number;
  predictedDemand: number;
  priority: 'low' | 'medium' | 'high' | 'critical';
  requestCount: number;
  userSegments: string[];
}

interface AnalyticsFilter {
  dateRange: {
    start: Date;
    end: Date;
  };
  userSegment?: 'all' | 'new' | 'returning' | 'premium' | 'enterprise';
  region?: string;
  module?: string;
  device?: 'all' | 'desktop' | 'mobile' | 'tablet';
}

interface ReportConfig {
  title: string;
  metrics: string[];
  format: 'pdf' | 'excel' | 'csv' | 'json';
  schedule?: {
    frequency: 'daily' | 'weekly' | 'monthly';
    recipients: string[];
  };
  visualization: {
    charts: ChartConfig[];
    layout: 'standard' | 'executive' | 'technical';
  };
}

interface ChartConfig {
  id: string;
  type: 'line' | 'bar' | 'pie' | 'area' | 'heatmap' | 'funnel';
  metric: string;
  title: string;
  size: 'small' | 'medium' | 'large';
}

// Custom Hook
const useAdvancedAnalytics = () => {
  const [analyticsData, setAnalyticsData] = useState<AnalyticsMetrics | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [filters, setFilters] = useState<AnalyticsFilter>({
    dateRange: {
      start: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
      end: new Date()
    },
    userSegment: 'all',
    device: 'all'
  });
  const [selectedView, setSelectedView] = useState<'overview' | 'usage' | 'performance' | 'business' | 'predictions'>('overview');

  const loadAnalyticsData = async () => {
    setIsLoading(true);
    try {
      // Simulate API call with complex analytics data
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      const mockData: AnalyticsMetrics = {
        period: {
          start: filters.dateRange.start,
          end: filters.dateRange.end,
          comparison: {
            start: new Date(filters.dateRange.start.getTime() - 30 * 24 * 60 * 60 * 1000),
            end: new Date(filters.dateRange.end.getTime() - 30 * 24 * 60 * 60 * 1000)
          }
        },
        overview: {
          totalUsers: 2847,
          activeUsers: 1923,
          newUsers: 234,
          revenue: 47890,
          projects: 1456,
          calculations: 8934,
          budgets: 3421,
          schedules: 2876
        },
        growth: {
          users: 12.3,
          revenue: 18.7,
          projects: 15.2,
          engagement: 8.9
        },
        usage: {
          moduleUsage: [
            {
              module: 'calculations',
              name: 'Cálculos Técnicos',
              sessions: 5234,
              uniqueUsers: 1876,
              avgSessionDuration: 18.5,
              completionRate: 89.2,
              growth: 15.3,
              satisfaction: 4.6
            },
            {
              module: 'budget',
              name: 'Presupuestos',
              sessions: 3421,
              uniqueUsers: 1234,
              avgSessionDuration: 25.7,
              completionRate: 92.1,
              growth: 22.8,
              satisfaction: 4.8
            },
            {
              module: 'schedule',
              name: 'Cronogramas',
              sessions: 2876,
              uniqueUsers: 987,
              avgSessionDuration: 31.2,
              completionRate: 78.9,
              growth: -3.2,
              satisfaction: 4.2
            },
            {
              module: 'mobile',
              name: 'App Móvil',
              sessions: 4567,
              uniqueUsers: 1567,
              avgSessionDuration: 12.8,
              completionRate: 85.6,
              growth: 45.7,
              satisfaction: 4.5
            },
            {
              module: 'integration',
              name: 'Integraciones',
              sessions: 1234,
              uniqueUsers: 456,
              avgSessionDuration: 8.9,
              completionRate: 94.3,
              growth: 8.1,
              satisfaction: 4.7
            },
            {
              module: 'exports',
              name: 'Exportaciones',
              sessions: 2345,
              uniqueUsers: 890,
              avgSessionDuration: 6.7,
              completionRate: 96.8,
              growth: 12.4,
              satisfaction: 4.4
            }
          ],
          featureAdoption: [
            {
              feature: 'Budget Templates',
              category: 'budget',
              adoptionRate: 78.5,
              activeUsers: 1234,
              retentionRate: 89.2,
              timeToFirstUse: 3.2,
              powerUsers: 234,
              growth: 15.7
            },
            {
              feature: 'Schedule Optimization',
              category: 'schedule',
              adoptionRate: 45.3,
              activeUsers: 567,
              retentionRate: 76.4,
              timeToFirstUse: 7.8,
              powerUsers: 89,
              growth: -5.2
            },
            {
              feature: 'Mobile Progress Tracking',
              category: 'mobile',
              adoptionRate: 82.1,
              activeUsers: 1456,
              retentionRate: 91.7,
              timeToFirstUse: 1.5,
              powerUsers: 345,
              growth: 32.8
            },
            {
              feature: 'Real-time Sync',
              category: 'integration',
              adoptionRate: 67.9,
              activeUsers: 890,
              retentionRate: 94.2,
              timeToFirstUse: 5.1,
              powerUsers: 178,
              growth: 18.9
            }
          ],
          userBehavior: {
            avgSessionDuration: 19.7,
            avgPagesPerSession: 8.3,
            bounceRate: 23.4,
            returnVisitorRate: 78.9,
            featureUsageDepth: 4.2,
            workflowCompletionRate: 87.6,
            supportTicketRate: 3.8,
            referralRate: 12.1
          },
          deviceBreakdown: [
            {
              type: 'desktop',
              users: 1789,
              percentage: 62.8,
              avgSessionDuration: 24.6,
              conversionRate: 18.9,
              satisfaction: 4.6
            },
            {
              type: 'mobile',
              users: 823,
              percentage: 28.9,
              avgSessionDuration: 14.2,
              conversionRate: 15.3,
              satisfaction: 4.3
            },
            {
              type: 'tablet',
              users: 235,
              percentage: 8.3,
              avgSessionDuration: 18.7,
              conversionRate: 16.8,
              satisfaction: 4.4
            }
          ],
          geographicDistribution: [
            {
              region: 'Pichincha',
              city: 'Quito',
              users: 1234,
              percentage: 43.4,
              revenue: 28450,
              growth: 15.2,
              popularFeatures: ['NEC Calculations', 'Budget Templates']
            },
            {
              region: 'Guayas',
              city: 'Guayaquil',
              users: 876,
              percentage: 30.8,
              revenue: 19870,
              growth: 18.9,
              popularFeatures: ['Mobile App', 'Export Tools']
            },
            {
              region: 'Azuay',
              city: 'Cuenca',
              users: 345,
              percentage: 12.1,
              revenue: 7890,
              growth: 12.4,
              popularFeatures: ['Schedule Management', 'Integration']
            },
            {
              region: 'Otros',
              city: 'Varias',
              users: 392,
              percentage: 13.7,
              revenue: 8230,
              growth: 22.1,
              popularFeatures: ['Basic Calculations', 'Templates']
            }
          ]
        },
        performance: {
          systemHealth: 94.2,
          responseTime: 187,
          uptime: 99.7,
          errorRate: 0.034,
          satisfaction: 4.5
        },
        business: {
          conversionRate: 16.8,
          churnRate: 4.2,
          ltv: 2840,
          cac: 187,
          mrr: 12340,
          arr: 148080
        },
        predictions: {
          userGrowth: [
            {
              date: new Date(2024, 6, 1),
              predicted: 3200,
              confidence: 85,
              factors: ['Marketing Campaign', 'Feature Releases']
            },
            {
              date: new Date(2024, 7, 1),
              predicted: 3580,
              confidence: 78,
              factors: ['Seasonal Growth', 'Word of Mouth']
            },
            {
              date: new Date(2024, 8, 1),
              predicted: 3920,
              confidence: 72,
              factors: ['University Partnerships', 'Feature Adoption']
            }
          ],
          revenueForcast: [
            {
              date: new Date(2024, 6, 1),
              predicted: 56000,
              confidence: 82,
              factors: ['User Growth', 'Premium Upgrades']
            },
            {
              date: new Date(2024, 7, 1),
              predicted: 64800,
              confidence: 79,
              factors: ['Enterprise Sales', 'Feature Monetization']
            },
            {
              date: new Date(2024, 8, 1),
              predicted: 73200,
              confidence: 74,
              factors: ['Market Expansion', 'New Products']
            }
          ],
          churnRisk: [
            {
              userId: 'user-123',
              userName: 'Constructora ABC',
              riskScore: 78,
              factors: ['Low Usage', 'No Recent Projects', 'Support Issues'],
              lastActivity: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000),
              recommendations: [
                'Personal outreach by account manager',
                'Offer training session',
                'Provide project templates'
              ]
            },
            {
              userId: 'user-456',
              userName: 'Ing. Roberto Silva',
              riskScore: 65,
              factors: ['Feature Confusion', 'Long Response Times'],
              lastActivity: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
              recommendations: [
                'Send tutorial videos',
                'Schedule demo call',
                'Optimize performance'
              ]
            }
          ],
          featureDemand: [
            {
              feature: 'Advanced Schedule Analytics',
              currentDemand: 45,
              predictedDemand: 78,
              priority: 'high',
              requestCount: 234,
              userSegments: ['Enterprise', 'Project Managers']
            },
            {
              feature: 'Multi-language Support',
              currentDemand: 32,
              predictedDemand: 89,
              priority: 'critical',
              requestCount: 187,
              userSegments: ['International', 'Large Teams']
            },
            {
              feature: 'AI-Powered Cost Estimation',
              currentDemand: 67,
              predictedDemand: 92,
              priority: 'high',
              requestCount: 345,
              userSegments: ['Premium', 'Architects']
            }
          ]
        }
      };

      setAnalyticsData(mockData);
    } catch (error) {
      console.error('Error loading analytics data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const generateReport = async (config: ReportConfig) => {
    console.log('Generating report with config:', config);
    // Simulate report generation
    await new Promise(resolve => setTimeout(resolve, 2000));
  };

  const exportData = async (format: 'csv' | 'excel' | 'json') => {
    console.log('Exporting data in format:', format);
    // Simulate data export
  };

  useEffect(() => {
    loadAnalyticsData();
  }, [filters]);

  return {
    analyticsData,
    isLoading,
    filters,
    setFilters,
    selectedView,
    setSelectedView,
    generateReport,
    exportData,
    loadAnalyticsData
  };
};

// Components
const MetricsOverview: React.FC<{ 
  overview: AnalyticsMetrics['overview']; 
  growth: AnalyticsMetrics['growth'];
}> = ({ overview, growth }) => {
  const formatNumber = (num: number) => {
    if (num >= 1000000) {
      return (num / 1000000).toFixed(1) + 'M';
    } else if (num >= 1000) {
      return (num / 1000).toFixed(1) + 'K';
    }
    return num.toString();
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('es-EC', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0
    }).format(amount);
  };

  const getGrowthColor = (growth: number) => {
    return growth >= 0 ? 'text-green-600' : 'text-red-600';
  };

  const getGrowthIcon = (growth: number) => {
    return growth >= 0 ? ArrowTrendingUpIcon : ArrowTrendingDownIcon;
  };

  const metrics = [
    {
      label: 'Usuarios Totales',
      value: formatNumber(overview.totalUsers),
      growth: growth.users,
      icon: UserGroupIcon,
      color: 'blue'
    },
    {
      label: 'Ingresos',
      value: formatCurrency(overview.revenue),
      growth: growth.revenue,
      icon: CurrencyDollarIcon,
      color: 'green'
    },
    {
      label: 'Proyectos Activos',
      value: formatNumber(overview.projects),
      growth: growth.projects,
      icon: BuildingOfficeIcon,
      color: 'purple'
    },
    {
      label: 'Engagement',
      value: `${overview.activeUsers}/${overview.totalUsers}`,
      growth: growth.engagement,
      icon: ChartBarIcon,
      color: 'orange'
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {metrics.map((metric, index) => {
        const IconComponent = metric.icon;
        const GrowthIcon = getGrowthIcon(metric.growth);

        return (
          <div key={index} className="bg-white rounded-xl border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-4">
              <div className={`w-12 h-12 bg-${metric.color}-100 rounded-lg flex items-center justify-center`}>
                <IconComponent className={`h-6 w-6 text-${metric.color}-600`} />
              </div>
              <div className={`flex items-center gap-1 ${getGrowthColor(metric.growth)}`}>
                <GrowthIcon className="h-4 w-4" />
                <span className="text-sm font-medium">
                  {metric.growth > 0 ? '+' : ''}{metric.growth.toFixed(1)}%
                </span>
              </div>
            </div>
            
            <div>
              <div className="text-2xl font-bold text-gray-900 mb-1">
                {metric.value}
              </div>
              <div className="text-sm text-gray-600">
                {metric.label}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

const ModuleUsageChart: React.FC<{ moduleUsage: ModuleUsage[] }> = ({ moduleUsage }) => {
  const getModuleIcon = (module: string) => {
    switch (module) {
      case 'calculations': return BeakerIcon;
      case 'budget': return CurrencyDollarIcon;
      case 'schedule': return CalendarDaysIcon;
      case 'mobile': return DevicePhoneMobileIcon;
      case 'integration': return GlobeAltIcon;
      case 'exports': return DocumentChartBarIcon;
      default: return ChartBarIcon;
    }
  };

  const maxSessions = Math.max(...moduleUsage.map(m => m.sessions));

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-gray-900">Uso por Módulo</h3>
        <div className="flex gap-2">
          <button className="text-gray-400 hover:text-gray-600">
            <EyeIcon className="h-4 w-4" />
          </button>
          <button className="text-gray-400 hover:text-gray-600">
            <ArrowDownTrayIcon className="h-4 w-4" />
          </button>
        </div>
      </div>

      <div className="space-y-4">
        {moduleUsage.map((module) => {
          const IconComponent = getModuleIcon(module.module);
          const percentage = (module.sessions / maxSessions) * 100;

          return (
            <div key={module.module} className="flex items-center gap-4">
              <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                <IconComponent className="h-5 w-5 text-blue-600" />
              </div>
              
              <div className="flex-1">
                <div className="flex items-center justify-between mb-2">
                  <span className="font-medium text-gray-900">{module.name}</span>
                  <div className="flex items-center gap-3 text-sm">
                    <span className="text-gray-600">{module.sessions.toLocaleString()} sesiones</span>
                    <div className={`flex items-center gap-1 ${
                      module.growth >= 0 ? 'text-green-600' : 'text-red-600'
                    }`}>
                      {module.growth >= 0 ? (
                        <ArrowTrendingUpIcon className="h-3 w-3" />
                      ) : (
                        <ArrowTrendingDownIcon className="h-3 w-3" />
                      )}
                      <span>{module.growth > 0 ? '+' : ''}{module.growth.toFixed(1)}%</span>
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center gap-4">
                  <div className="flex-1">
                    <ProgressBar 
                      progress={percentage} 
                      color={module.growth >= 0 ? 'green' : 'red'} 
                    />
                  </div>
                  <div className="text-sm text-gray-500">
                    {module.uniqueUsers} usuarios
                  </div>
                </div>
                
                <div className="flex items-center justify-between mt-2 text-xs text-gray-500">
                  <span>Duración: {module.avgSessionDuration}min</span>
                  <span>Finalización: {module.completionRate}%</span>
                  <span>★ {module.satisfaction}</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

const GeographicHeatmap: React.FC<{ distribution: GeographicMetrics[] }> = ({ distribution }) => {
  const totalUsers = distribution.reduce((sum, region) => sum + region.users, 0);
  const totalRevenue = distribution.reduce((sum, region) => sum + region.revenue, 0);

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-gray-900">Distribución Geográfica</h3>
        <Badge variant="secondary">{totalUsers.toLocaleString()} usuarios</Badge>
      </div>

      <div className="space-y-4">
        {distribution.map((region, index) => (
          <div key={index} className="border border-gray-200 rounded-lg p-4">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                  <MapPinIcon className="h-4 w-4 text-blue-600" />
                </div>
                <div>
                  <h4 className="font-medium text-gray-900">{region.city}</h4>
                  <p className="text-sm text-gray-600">{region.region}</p>
                </div>
              </div>
              
              <div className="text-right">
                <div className="font-medium text-gray-900">
                  {((region.revenue / totalRevenue) * 100).toFixed(1)}%
                </div>
                <div className="text-sm text-gray-600">ingresos</div>
              </div>
            </div>
            
            <div className="grid grid-cols-3 gap-4 text-sm mb-3">
              <div>
                <div className="text-gray-600">Usuarios</div>
                <div className="font-medium">{region.users.toLocaleString()}</div>
              </div>
              <div>
                <div className="text-gray-600">Ingresos</div>
                <div className="font-medium">
                  ${region.revenue.toLocaleString()}
                </div>
              </div>
              <div>
                <div className="text-gray-600">Crecimiento</div>
                <div className={`font-medium flex items-center gap-1 ${
                  region.growth >= 0 ? 'text-green-600' : 'text-red-600'
                }`}>
                  {region.growth >= 0 ? (
                    <ArrowTrendingUpIcon className="h-3 w-3" />
                  ) : (
                    <ArrowTrendingDownIcon className="h-3 w-3" />
                  )}
                  {region.growth > 0 ? '+' : ''}{region.growth.toFixed(1)}%
                </div>
              </div>
            </div>
            
            <div className="mb-2">
              <ProgressBar 
                progress={(region.users / totalUsers) * 100} 
                color="blue" 
              />
            </div>
            
            <div className="flex flex-wrap gap-1">
              {region.popularFeatures.map((feature, idx) => (
                <span
                  key={idx}
                  className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full"
                >
                  {feature}
                </span>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

const PredictiveInsights: React.FC<{ predictions: AnalyticsMetrics['predictions'] }> = ({ predictions }) => {
  const [selectedInsight, setSelectedInsight] = useState<'growth' | 'revenue' | 'churn' | 'features'>('growth');

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-gray-900">Insights Predictivos</h3>
        <div className="flex gap-2">
          {[
            { id: 'growth', label: 'Crecimiento' },
            { id: 'revenue', label: 'Ingresos' },
            { id: 'churn', label: 'Churn' },
            { id: 'features', label: 'Features' }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setSelectedInsight(tab.id as any)}
              className={`px-3 py-2 text-sm rounded-lg transition-colors ${
                selectedInsight === tab.id
                  ? 'bg-blue-100 text-blue-700'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {selectedInsight === 'growth' && (
        <div className="space-y-4">
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <h4 className="font-medium text-blue-900 mb-2">Predicción de Crecimiento de Usuarios</h4>
            <div className="space-y-3">
              {predictions.userGrowth.map((prediction, index) => (
                <div key={index} className="flex items-center justify-between">
                  <div>
                    <div className="font-medium text-blue-800">
                      {prediction.date.toLocaleDateString('es-EC', { month: 'long', year: 'numeric' })}
                    </div>
                    <div className="text-sm text-blue-600">
                      Confianza: {prediction.confidence}%
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-2xl font-bold text-blue-900">
                      {prediction.predicted.toLocaleString()}
                    </div>
                    <div className="text-sm text-blue-600">usuarios</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {selectedInsight === 'churn' && (
        <div className="space-y-4">
          <div className="bg-red-50 border border-red-200 rounded-lg p-4">
            <h4 className="font-medium text-red-900 mb-2">Usuarios en Riesgo de Churn</h4>
            <div className="space-y-3">
              {predictions.churnRisk.map((risk) => (
                <div key={risk.userId} className="border border-red-200 rounded-lg p-3 bg-white">
                  <div className="flex items-center justify-between mb-2">
                    <h5 className="font-medium text-gray-900">{risk.userName}</h5>
                    <Badge variant="danger">
                      Riesgo: {risk.riskScore}%
                    </Badge>
                  </div>
                  
                  <div className="text-sm text-gray-600 mb-2">
                    Última actividad: {risk.lastActivity.toLocaleDateString()}
                  </div>
                  
                  <div className="mb-3">
                    <div className="text-sm font-medium text-gray-700 mb-1">Factores de riesgo:</div>
                    <div className="flex flex-wrap gap-1">
                      {risk.factors.map((factor, idx) => (
                        <span
                          key={idx}
                          className="px-2 py-1 bg-red-100 text-red-700 text-xs rounded-full"
                        >
                          {factor}
                        </span>
                      ))}
                    </div>
                  </div>
                  
                  <div>
                    <div className="text-sm font-medium text-gray-700 mb-1">Recomendaciones:</div>
                    <ul className="text-sm text-gray-600 space-y-1">
                      {risk.recommendations.map((rec, idx) => (
                        <li key={idx} className="flex items-start gap-2">
                          <LightBulbIcon className="h-4 w-4 text-yellow-500 mt-0.5 flex-shrink-0" />
                          {rec}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {selectedInsight === 'features' && (
        <div className="space-y-4">
          <div className="bg-green-50 border border-green-200 rounded-lg p-4">
            <h4 className="font-medium text-green-900 mb-2">Demanda Predicha de Features</h4>
            <div className="space-y-3">
              {predictions.featureDemand.map((feature, index) => (
                <div key={index} className="border border-green-200 rounded-lg p-3 bg-white">
                  <div className="flex items-center justify-between mb-2">
                    <h5 className="font-medium text-gray-900">{feature.feature}</h5>
                    <Badge variant={
                      feature.priority === 'critical' ? 'danger' :
                      feature.priority === 'high' ? 'warning' : 'secondary'
                    }>
                      {feature.priority}
                    </Badge>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4 text-sm mb-3">
                    <div>
                      <div className="text-gray-600">Demanda Actual</div>
                      <div className="font-medium">{feature.currentDemand}%</div>
                    </div>
                    <div>
                      <div className="text-gray-600">Demanda Predicha</div>
                      <div className="font-medium text-green-600">{feature.predictedDemand}%</div>
                    </div>
                  </div>
                  
                  <div className="mb-2">
                    <ProgressBar 
                      progress={feature.predictedDemand} 
                      color="green" 
                    />
                  </div>
                  
                  <div className="text-sm text-gray-600">
                    {feature.requestCount} solicitudes • Segmentos: {feature.userSegments.join(', ')}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

const FilterPanel: React.FC<{
  filters: AnalyticsFilter;
  onFiltersChange: (filters: AnalyticsFilter) => void;
}> = ({ filters, onFiltersChange }) => {
  return (
    <div className="bg-white rounded-xl border border-gray-200 p-4">
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2">
          <FunnelIcon className="h-5 w-5 text-gray-400" />
          <span className="text-sm font-medium text-gray-700">Filtros:</span>
        </div>
        
        <div className="flex gap-4">
          <div>
            <label className="block text-xs text-gray-500 mb-1">Segmento</label>
            <select
              value={filters.userSegment}
              onChange={(e) => onFiltersChange({ ...filters, userSegment: e.target.value as any })}
              className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="all">Todos</option>
              <option value="new">Nuevos</option>
              <option value="returning">Recurrentes</option>
              <option value="premium">Premium</option>
              <option value="enterprise">Enterprise</option>
            </select>
          </div>
          
          <div>
            <label className="block text-xs text-gray-500 mb-1">Dispositivo</label>
            <select
              value={filters.device}
              onChange={(e) => onFiltersChange({ ...filters, device: e.target.value as any })}
              className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="all">Todos</option>
              <option value="desktop">Desktop</option>
              <option value="mobile">Móvil</option>
              <option value="tablet">Tablet</option>
            </select>
          </div>
          
          <div>
            <label className="block text-xs text-gray-500 mb-1">Período</label>
            <select className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
              <option>Últimos 30 días</option>
              <option>Últimos 7 días</option>
              <option>Último mes</option>
              <option>Últimos 3 meses</option>
              <option>Personalizado</option>
            </select>
          </div>
        </div>
        
        <div className="ml-auto flex gap-2">
          <button className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors">
            <ArrowDownTrayIcon className="h-4 w-4" />
            Exportar
          </button>
          <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
            <DocumentChartBarIcon className="h-4 w-4" />
            Reporte
          </button>
        </div>
      </div>
    </div>
  );
};

// Main Component
const AdvancedAnalyticsDashboard: React.FC = () => {
  const {
    analyticsData,
    isLoading,
    filters,
    setFilters,
    selectedView,
    setSelectedView,
    generateReport,
    exportData,
    loadAnalyticsData
  } = useAdvancedAnalytics();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <LoadingSpinner />
      </div>
    );
  }

  if (!analyticsData) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500">No se pudieron cargar los datos de análisis</p>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            Dashboard de Análisis Avanzado
          </h1>
          <p className="text-gray-600 mt-1">
            Insights profundos sobre uso, performance y predicciones del sistema
          </p>
        </div>
        
        <div className="flex gap-2">
          <button
            onClick={loadAnalyticsData}
            className="flex items-center gap-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
          >
            <ArrowPathIcon className="h-4 w-4" />
            Actualizar
          </button>
          <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
            <ShareIcon className="h-4 w-4" />
            Compartir
          </button>
        </div>
      </div>

      {/* Filters */}
      <div className="mb-6">
        <FilterPanel filters={filters} onFiltersChange={setFilters} />
      </div>

      {/* View Tabs */}
      <div className="border-b border-gray-200 mb-6">
        <nav className="flex space-x-8">
          {[
            { id: 'overview', label: 'Resumen General', icon: ChartBarIcon },
            { id: 'usage', label: 'Análisis de Uso', icon: UserGroupIcon },
            { id: 'performance', label: 'Performance', icon: CpuChipIcon },
            { id: 'business', label: 'Métricas de Negocio', icon: CurrencyDollarIcon },
            { id: 'predictions', label: 'Predicciones', icon: PresentationChartLineIcon }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setSelectedView(tab.id as any)}
              className={`flex items-center gap-2 py-4 px-1 border-b-2 font-medium text-sm ${
                selectedView === tab.id
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
      {selectedView === 'overview' && (
        <div className="space-y-6">
          <MetricsOverview 
            overview={analyticsData.overview} 
            growth={analyticsData.growth} 
          />
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <ModuleUsageChart moduleUsage={analyticsData.usage.moduleUsage} />
            <GeographicHeatmap distribution={analyticsData.usage.geographicDistribution} />
          </div>
        </div>
      )}

      {selectedView === 'usage' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <ModuleUsageChart moduleUsage={analyticsData.usage.moduleUsage} />
          <GeographicHeatmap distribution={analyticsData.usage.geographicDistribution} />
          
          {/* Feature Adoption */}
          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Adopción de Features</h3>
            <div className="space-y-4">
              {analyticsData.usage.featureAdoption.map((feature, index) => (
                <div key={index} className="flex items-center justify-between">
                  <div>
                    <div className="font-medium text-gray-900">{feature.feature}</div>
                    <div className="text-sm text-gray-600">{feature.activeUsers} usuarios activos</div>
                  </div>
                  <div className="text-right">
                    <div className="font-medium text-gray-900">{feature.adoptionRate}%</div>
                    <div className={`text-sm ${feature.growth >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                      {feature.growth > 0 ? '+' : ''}{feature.growth.toFixed(1)}%
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Device Breakdown */}
          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Distribución por Dispositivo</h3>
            <div className="space-y-4">
              {analyticsData.usage.deviceBreakdown.map((device, index) => (
                <div key={index} className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                      {device.type === 'mobile' ? (
                        <DevicePhoneMobileIcon className="h-4 w-4 text-blue-600" />
                      ) : device.type === 'tablet' ? (
                        <DevicePhoneMobileIcon className="h-4 w-4 text-blue-600" />
                      ) : (
                        <ComputerDesktopIcon className="h-4 w-4 text-blue-600" />
                      )}
                    </div>
                    <div>
                      <div className="font-medium text-gray-900 capitalize">{device.type}</div>
                      <div className="text-sm text-gray-600">{device.users} usuarios</div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="font-medium text-gray-900">{device.percentage}%</div>
                    <div className="text-sm text-gray-600">★ {device.satisfaction}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {selectedView === 'performance' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                <CheckCircleIcon className="h-6 w-6 text-green-600" />
              </div>
              <div>
                <div className="text-2xl font-bold text-gray-900">{analyticsData.performance.systemHealth}%</div>
                <div className="text-sm text-gray-600">System Health</div>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center">
                <ClockIcon className="h-6 w-6 text-yellow-600" />
              </div>
              <div>
                <div className="text-2xl font-bold text-gray-900">{analyticsData.performance.responseTime}ms</div>
                <div className="text-sm text-gray-600">Response Time</div>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <ChartBarIcon className="h-6 w-6 text-blue-600" />
              </div>
              <div>
                <div className="text-2xl font-bold text-gray-900">{analyticsData.performance.uptime}%</div>
                <div className="text-sm text-gray-600">Uptime</div>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center">
                <ExclamationTriangleIcon className="h-6 w-6 text-red-600" />
              </div>
              <div>
                <div className="text-2xl font-bold text-gray-900">{analyticsData.performance.errorRate}%</div>
                <div className="text-sm text-gray-600">Error Rate</div>
              </div>
            </div>
          </div>
        </div>
      )}

      {selectedView === 'business' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {Object.entries({
            'Tasa de Conversión': `${analyticsData.business.conversionRate}%`,
            'Tasa de Churn': `${analyticsData.business.churnRate}%`,
            'LTV': `$${analyticsData.business.ltv}`,
            'CAC': `$${analyticsData.business.cac}`,
            'MRR': `$${analyticsData.business.mrr.toLocaleString()}`,
            'ARR': `$${analyticsData.business.arr.toLocaleString()}`
          }).map(([label, value]) => (
            <div key={label} className="bg-white rounded-xl border border-gray-200 p-6">
              <div className="text-2xl font-bold text-gray-900 mb-1">{value}</div>
              <div className="text-sm text-gray-600">{label}</div>
            </div>
          ))}
        </div>
      )}

      {selectedView === 'predictions' && (
        <div className="space-y-6">
          <PredictiveInsights predictions={analyticsData.predictions} />
        </div>
      )}
    </div>
  );
};

export default AdvancedAnalyticsDashboard;