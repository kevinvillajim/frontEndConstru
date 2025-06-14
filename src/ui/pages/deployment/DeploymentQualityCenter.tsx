// src/ui/pages/deployment/DeploymentQualityCenter.tsx
import React, { useState, useEffect } from 'react';
import { 
  RocketLaunchIcon,
  ShieldCheckIcon,
  CogIcon,
  CheckCircleIcon,
  XCircleIcon,
  ExclamationTriangleIcon,
  ClockIcon,
  ServerIcon,
  CodeBracketIcon,
  BugAntIcon,
  DocumentTextIcon,
  PlayIcon,
  ArrowPathIcon,
  EyeIcon,
  ArrowDownTrayIcon,
  CpuChipIcon,
  DocumentCheckIcon,
  BeakerIcon,
  WrenchScrewdriverIcon,
} from '@heroicons/react/24/outline';
import { LoadingSpinner, Badge, ProgressBar, Alert } from '../shared/components/SharedComponents';

interface DeploymentEnvironment {
  id: string;
  name: string;
  type: 'development' | 'staging' | 'production' | 'testing';
  status: 'active' | 'inactive' | 'deploying' | 'error';
  url: string;
  version: string;
  lastDeployment: Date;
  uptime: number;
  health: {
    overall: 'healthy' | 'warning' | 'critical';
    score: number;
    checks: HealthCheck[];
  };
  infrastructure: {
    provider: 'aws' | 'google' | 'azure' | 'local';
    region: string;
    instances: number;
    cpu: number;
    memory: number;
    storage: number;
  };
  security: {
    ssl: boolean;
    waf: boolean;
    monitoring: boolean;
    backups: boolean;
    lastScan: Date;
    vulnerabilities: number;
  };
  configuration: EnvironmentConfig;
}

interface HealthCheck {
  id: string;
  name: string;
  type: 'api' | 'database' | 'external_service' | 'security' | 'performance';
  status: 'pass' | 'fail' | 'warning';
  message: string;
  lastCheck: Date;
  responseTime?: number;
  expectedValue?: string;
  actualValue?: string;
}

interface EnvironmentConfig {
  database: {
    host: string;
    port: number;
    ssl: boolean;
    poolSize: number;
  };
  cache: {
    enabled: boolean;
    provider: 'redis' | 'memory';
    ttl: number;
  };
  features: {
    [key: string]: boolean;
  };
  integrations: {
    [key: string]: {
      enabled: boolean;
      endpoint: string;
      timeout: number;
    };
  };
  limits: {
    requestRate: number;
    maxFileSize: number;
    sessionTimeout: number;
  };
}

interface DeploymentPipeline {
  id: string;
  name: string;
  status: 'idle' | 'running' | 'success' | 'failed' | 'cancelled';
  currentStage?: string;
  progress: number;
  startedAt?: Date;
  completedAt?: Date;
  duration?: number;
  stages: PipelineStage[];
  triggers: PipelineTrigger[];
  environment: string;
  version: string;
  changes: ChangeSet[];
}

interface PipelineStage {
  id: string;
  name: string;
  type: 'build' | 'test' | 'security' | 'deploy' | 'verify';
  status: 'pending' | 'running' | 'success' | 'failed' | 'skipped';
  duration?: number;
  logs: string[];
  dependencies: string[];
  parallelizable: boolean;
}

interface PipelineTrigger {
  id: string;
  type: 'manual' | 'push' | 'schedule' | 'webhook';
  enabled: boolean;
  configuration: any;
}

interface ChangeSet {
  id: string;
  type: 'feature' | 'bugfix' | 'hotfix' | 'security' | 'performance';
  title: string;
  description: string;
  author: string;
  impact: 'low' | 'medium' | 'high' | 'critical';
  tested: boolean;
  approved: boolean;
}

interface QualityMetrics {
  overall: {
    score: number;
    grade: 'A' | 'B' | 'C' | 'D' | 'F';
    trend: 'improving' | 'stable' | 'degrading';
  };
  codeQuality: {
    coverage: number;
    duplicates: number;
    complexity: number;
    maintainability: number;
    techDebt: number;
    violations: QualityViolation[];
  };
  testing: {
    unitTests: TestSuite;
    integrationTests: TestSuite;
    e2eTests: TestSuite;
    performanceTests: TestSuite;
    securityTests: TestSuite;
  };
  security: {
    vulnerabilities: SecurityVulnerability[];
    compliance: ComplianceCheck[];
    lastScan: Date;
    riskScore: number;
  };
  performance: {
    loadTime: number;
    throughput: number;
    errorRate: number;
    availability: number;
    scalability: number;
  };
}

interface TestSuite {
  name: string;
  total: number;
  passed: number;
  failed: number;
  skipped: number;
  coverage: number;
  duration: number;
  lastRun: Date;
}

interface QualityViolation {
  id: string;
  type: 'bug' | 'vulnerability' | 'code_smell' | 'duplication';
  severity: 'info' | 'minor' | 'major' | 'critical' | 'blocker';
  message: string;
  file: string;
  line: number;
  effort: number; // minutes to fix
  debt: number; // technical debt score
}

interface SecurityVulnerability {
  id: string;
  type: 'dependency' | 'code' | 'configuration' | 'infrastructure';
  severity: 'low' | 'medium' | 'high' | 'critical';
  title: string;
  description: string;
  cve?: string;
  component: string;
  version: string;
  fixVersion?: string;
  exploitable: boolean;
  patched: boolean;
}

interface ComplianceCheck {
  id: string;
  standard: 'GDPR' | 'SOC2' | 'ISO27001' | 'HIPAA' | 'PCI-DSS';
  requirement: string;
  status: 'compliant' | 'non_compliant' | 'partial' | 'not_applicable';
  evidence: string[];
  lastAudit: Date;
  nextAudit: Date;
}

interface DeploymentHistory {
  id: string;
  environment: string;
  version: string;
  deployedAt: Date;
  deployedBy: string;
  status: 'success' | 'failed' | 'rolled_back';
  duration: number;
  changes: number;
  rollbackPlan?: string;
}

// Custom Hook
const useDeploymentQuality = () => {
  const [environments, setEnvironments] = useState<DeploymentEnvironment[]>([]);
  const [pipelines, setPipelines] = useState<DeploymentPipeline[]>([]);
  const [qualityMetrics, setQualityMetrics] = useState<QualityMetrics | null>(null);
  const [deploymentHistory, setDeploymentHistory] = useState<DeploymentHistory[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedTab, setSelectedTab] = useState<'environments' | 'pipelines' | 'quality' | 'history'>('environments');

  const loadDeploymentData = async () => {
    setIsLoading(true);
    try {
      // Simulate API calls
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const mockEnvironments: DeploymentEnvironment[] = [
        {
          id: 'prod',
          name: 'Production',
          type: 'production',
          status: 'active',
          url: 'https://app.constru.ec',
          version: 'v2.1.4',
          lastDeployment: new Date(2024, 5, 20, 14, 30),
          uptime: 99.97,
          health: {
            overall: 'healthy',
            score: 96,
            checks: [
              {
                id: 'api-health',
                name: 'API Health',
                type: 'api',
                status: 'pass',
                message: 'All endpoints responding normally',
                lastCheck: new Date(Date.now() - 300000),
                responseTime: 145
              },
              {
                id: 'db-connection',
                name: 'Database Connection',
                type: 'database',
                status: 'pass',
                message: 'Database pool healthy',
                lastCheck: new Date(Date.now() - 300000),
                responseTime: 23
              },
              {
                id: 'external-apis',
                name: 'External APIs',
                type: 'external_service',
                status: 'warning',
                message: 'IPCO API showing increased latency',
                lastCheck: new Date(Date.now() - 300000),
                responseTime: 2340
              }
            ]
          },
          infrastructure: {
            provider: 'aws',
            region: 'us-east-1',
            instances: 3,
            cpu: 45,
            memory: 68,
            storage: 78
          },
          security: {
            ssl: true,
            waf: true,
            monitoring: true,
            backups: true,
            lastScan: new Date(2024, 5, 18),
            vulnerabilities: 2
          },
          configuration: {
            database: {
              host: 'prod-db.amazonaws.com',
              port: 5432,
              ssl: true,
              poolSize: 20
            },
            cache: {
              enabled: true,
              provider: 'redis',
              ttl: 3600
            },
            features: {
              'advanced_analytics': true,
              'mobile_app': true,
              'realtime_sync': true,
              'export_tools': true
            },
            integrations: {
              'ipco_pricing': {
                enabled: true,
                endpoint: 'https://api.ipco.org.ec',
                timeout: 5000
              },
              'sri_validation': {
                enabled: true,
                endpoint: 'https://api.sri.gob.ec',
                timeout: 10000
              }
            },
            limits: {
              requestRate: 1000,
              maxFileSize: 50,
              sessionTimeout: 7200
            }
          }
        },
        {
          id: 'staging',
          name: 'Staging',
          type: 'staging',
          status: 'deploying',
          url: 'https://staging.constru.ec',
          version: 'v2.2.0-rc1',
          lastDeployment: new Date(2024, 5, 22, 10, 15),
          uptime: 98.5,
          health: {
            overall: 'warning',
            score: 82,
            checks: [
              {
                id: 'api-health',
                name: 'API Health',
                type: 'api',
                status: 'pass',
                message: 'All endpoints responding',
                lastCheck: new Date(Date.now() - 300000),
                responseTime: 189
              },
              {
                id: 'db-connection',
                name: 'Database Connection',
                type: 'database',
                status: 'warning',
                message: 'Connection pool at 85% capacity',
                lastCheck: new Date(Date.now() - 300000)
              }
            ]
          },
          infrastructure: {
            provider: 'aws',
            region: 'us-east-1',
            instances: 2,
            cpu: 62,
            memory: 74,
            storage: 45
          },
          security: {
            ssl: true,
            waf: true,
            monitoring: true,
            backups: true,
            lastScan: new Date(2024, 5, 21),
            vulnerabilities: 0
          },
          configuration: {
            database: {
              host: 'staging-db.amazonaws.com',
              port: 5432,
              ssl: true,
              poolSize: 15
            },
            cache: {
              enabled: true,
              provider: 'redis',
              ttl: 1800
            },
            features: {
              'advanced_analytics': true,
              'mobile_app': true,
              'realtime_sync': true,
              'export_tools': true,
              'beta_features': true
            },
            integrations: {
              'ipco_pricing': {
                enabled: true,
                endpoint: 'https://api-staging.ipco.org.ec',
                timeout: 5000
              }
            },
            limits: {
              requestRate: 500,
              maxFileSize: 25,
              sessionTimeout: 3600
            }
          }
        },
        {
          id: 'dev',
          name: 'Development',
          type: 'development',
          status: 'active',
          url: 'https://dev.constru.ec',
          version: 'v2.2.0-dev',
          lastDeployment: new Date(2024, 5, 22, 16, 45),
          uptime: 95.2,
          health: {
            overall: 'healthy',
            score: 88,
            checks: [
              {
                id: 'api-health',
                name: 'API Health',
                type: 'api',
                status: 'pass',
                message: 'Development environment ready',
                lastCheck: new Date(Date.now() - 300000),
                responseTime: 234
              }
            ]
          },
          infrastructure: {
            provider: 'aws',
            region: 'us-east-1',
            instances: 1,
            cpu: 28,
            memory: 45,
            storage: 32
          },
          security: {
            ssl: true,
            waf: false,
            monitoring: true,
            backups: false,
            lastScan: new Date(2024, 5, 15),
            vulnerabilities: 5
          },
          configuration: {
            database: {
              host: 'dev-db.amazonaws.com',
              port: 5432,
              ssl: false,
              poolSize: 10
            },
            cache: {
              enabled: false,
              provider: 'memory',
              ttl: 300
            },
            features: {
              'advanced_analytics': true,
              'mobile_app': true,
              'realtime_sync': false,
              'export_tools': true,
              'beta_features': true,
              'experimental_features': true
            },
            integrations: {
              'ipco_pricing': {
                enabled: false,
                endpoint: 'https://mock-api.local',
                timeout: 1000
              }
            },
            limits: {
              requestRate: 100,
              maxFileSize: 10,
              sessionTimeout: 1800
            }
          }
        }
      ];

      const mockPipelines: DeploymentPipeline[] = [
        {
          id: 'pipeline-1',
          name: 'Production Deployment',
          status: 'success',
          progress: 100,
          startedAt: new Date(2024, 5, 20, 14, 0),
          completedAt: new Date(2024, 5, 20, 14, 30),
          duration: 1800,
          environment: 'production',
          version: 'v2.1.4',
          stages: [
            {
              id: 'build',
              name: 'Build',
              type: 'build',
              status: 'success',
              duration: 420,
              logs: ['Building application...', 'Build completed successfully'],
              dependencies: [],
              parallelizable: false
            },
            {
              id: 'test',
              name: 'Test Suite',
              type: 'test',
              status: 'success',
              duration: 780,
              logs: ['Running unit tests...', 'Running integration tests...', 'All tests passed'],
              dependencies: ['build'],
              parallelizable: true
            },
            {
              id: 'security',
              name: 'Security Scan',
              type: 'security',
              status: 'success',
              duration: 240,
              logs: ['Running security scan...', 'No vulnerabilities found'],
              dependencies: ['build'],
              parallelizable: true
            },
            {
              id: 'deploy',
              name: 'Deploy',
              type: 'deploy',
              status: 'success',
              duration: 180,
              logs: ['Deploying to production...', 'Deployment completed'],
              dependencies: ['test', 'security'],
              parallelizable: false
            },
            {
              id: 'verify',
              name: 'Verify',
              type: 'verify',
              status: 'success',
              duration: 180,
              logs: ['Running health checks...', 'All systems operational'],
              dependencies: ['deploy'],
              parallelizable: false
            }
          ],
          triggers: [
            {
              id: 'manual',
              type: 'manual',
              enabled: true,
              configuration: {}
            }
          ],
          changes: [
            {
              id: 'change-1',
              type: 'feature',
              title: 'Advanced Schedule Analytics',
              description: 'New analytics dashboard for project schedules',
              author: 'Dev Team',
              impact: 'medium',
              tested: true,
              approved: true
            },
            {
              id: 'change-2',
              type: 'bugfix',
              title: 'Fix calculation precision error',
              description: 'Fixed rounding error in structural calculations',
              author: 'Dev Team',
              impact: 'high',
              tested: true,
              approved: true
            }
          ]
        },
        {
          id: 'pipeline-2',
          name: 'Staging Deployment',
          status: 'running',
          currentStage: 'test',
          progress: 65,
          startedAt: new Date(Date.now() - 1200000),
          environment: 'staging',
          version: 'v2.2.0-rc1',
          stages: [
            {
              id: 'build',
              name: 'Build',
              type: 'build',
              status: 'success',
              duration: 380,
              logs: ['Building application...', 'Build completed'],
              dependencies: [],
              parallelizable: false
            },
            {
              id: 'test',
              name: 'Test Suite',
              type: 'test',
              status: 'running',
              logs: ['Running unit tests...', 'Running integration tests...'],
              dependencies: ['build'],
              parallelizable: true
            },
            {
              id: 'security',
              name: 'Security Scan',
              type: 'security',
              status: 'pending',
              logs: [],
              dependencies: ['build'],
              parallelizable: true
            }
          ],
          triggers: [
            {
              id: 'push',
              type: 'push',
              enabled: true,
              configuration: { branch: 'develop' }
            }
          ],
          changes: [
            {
              id: 'change-3',
              type: 'feature',
              title: 'Mobile offline capabilities',
              description: 'Enhanced offline mode for mobile app',
              author: 'Mobile Team',
              impact: 'high',
              tested: true,
              approved: true
            }
          ]
        }
      ];

      const mockQualityMetrics: QualityMetrics = {
        overall: {
          score: 87,
          grade: 'B',
          trend: 'improving'
        },
        codeQuality: {
          coverage: 78.5,
          duplicates: 3.2,
          complexity: 6.8,
          maintainability: 'A',
          techDebt: 2.1,
          violations: [
            {
              id: 'v1',
              type: 'bug',
              severity: 'major',
              message: 'Potential null pointer dereference',
              file: 'src/services/CalculationService.ts',
              line: 145,
              effort: 15,
              debt: 30
            },
            {
              id: 'v2',
              type: 'code_smell',
              severity: 'minor',
              message: 'Function complexity too high',
              file: 'src/components/BudgetForm.tsx',
              line: 89,
              effort: 45,
              debt: 60
            }
          ]
        },
        testing: {
          unitTests: {
            name: 'Unit Tests',
            total: 1247,
            passed: 1198,
            failed: 12,
            skipped: 37,
            coverage: 82.3,
            duration: 124,
            lastRun: new Date(Date.now() - 3600000)
          },
          integrationTests: {
            name: 'Integration Tests',
            total: 234,
            passed: 226,
            failed: 3,
            skipped: 5,
            coverage: 71.8,
            duration: 567,
            lastRun: new Date(Date.now() - 3600000)
          },
          e2eTests: {
            name: 'E2E Tests',
            total: 89,
            passed: 84,
            failed: 2,
            skipped: 3,
            coverage: 0,
            duration: 1234,
            lastRun: new Date(Date.now() - 7200000)
          },
          performanceTests: {
            name: 'Performance Tests',
            total: 45,
            passed: 42,
            failed: 1,
            skipped: 2,
            coverage: 0,
            duration: 2341,
            lastRun: new Date(Date.now() - 86400000)
          },
          securityTests: {
            name: 'Security Tests',
            total: 67,
            passed: 65,
            failed: 0,
            skipped: 2,
            coverage: 0,
            duration: 456,
            lastRun: new Date(Date.now() - 7200000)
          }
        },
        security: {
          vulnerabilities: [
            {
              id: 'sec-1',
              type: 'dependency',
              severity: 'medium',
              title: 'Outdated dependency with known vulnerability',
              description: 'Package @types/node has a known vulnerability',
              cve: 'CVE-2024-1234',
              component: '@types/node',
              version: '18.0.0',
              fixVersion: '18.2.1',
              exploitable: false,
              patched: false
            }
          ],
          compliance: [
            {
              id: 'gdpr-1',
              standard: 'GDPR',
              requirement: 'Data encryption at rest',
              status: 'compliant',
              evidence: ['Database encryption enabled', 'File storage encrypted'],
              lastAudit: new Date(2024, 4, 15),
              nextAudit: new Date(2024, 10, 15)
            }
          ],
          lastScan: new Date(2024, 5, 20),
          riskScore: 23
        },
        performance: {
          loadTime: 2.1,
          throughput: 1234,
          errorRate: 0.034,
          availability: 99.97,
          scalability: 8.5
        }
      };

      const mockHistory: DeploymentHistory[] = [
        {
          id: 'deploy-1',
          environment: 'production',
          version: 'v2.1.4',
          deployedAt: new Date(2024, 5, 20, 14, 30),
          deployedBy: 'DevOps Team',
          status: 'success',
          duration: 1800,
          changes: 12
        },
        {
          id: 'deploy-2',
          environment: 'staging',
          version: 'v2.1.3',
          deployedAt: new Date(2024, 5, 18, 16, 15),
          deployedBy: 'Auto Deploy',
          status: 'success',
          duration: 1200,
          changes: 8
        },
        {
          id: 'deploy-3',
          environment: 'production',
          version: 'v2.1.2',
          deployedAt: new Date(2024, 5, 15, 10, 0),
          deployedBy: 'DevOps Team',
          status: 'rolled_back',
          duration: 2400,
          changes: 15,
          rollbackPlan: 'Performance issues detected, rolled back to v2.1.1'
        }
      ];

      setEnvironments(mockEnvironments);
      setPipelines(mockPipelines);
      setQualityMetrics(mockQualityMetrics);
      setDeploymentHistory(mockHistory);
      
    } catch (error) {
      console.error('Error loading deployment data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const deployToEnvironment = async (environmentId: string, version: string) => {
    console.log(`Deploying ${version} to ${environmentId}`);
    // Simulate deployment
  };

  const runPipeline = async (pipelineId: string) => {
    console.log(`Running pipeline ${pipelineId}`);
    // Simulate pipeline execution
  };

  const rollbackDeployment = async (environmentId: string, targetVersion: string) => {
    console.log(`Rolling back ${environmentId} to ${targetVersion}`);
    // Simulate rollback
  };

  useEffect(() => {
    loadDeploymentData();
  }, []);

  return {
    environments,
    pipelines,
    qualityMetrics,
    deploymentHistory,
    isLoading,
    selectedTab,
    setSelectedTab,
    deployToEnvironment,
    runPipeline,
    rollbackDeployment,
    loadDeploymentData
  };
};

// Components
const EnvironmentCard: React.FC<{
  environment: DeploymentEnvironment;
  onDeploy: (envId: string, version: string) => void;
  onRollback: (envId: string, version: string) => void;
}> = ({ environment, onDeploy, onRollback }) => {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800 border-green-200';
      case 'deploying': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'error': return 'bg-red-100 text-red-800 border-red-200';
      case 'inactive': return 'bg-gray-100 text-gray-800 border-gray-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getHealthColor = (health: string) => {
    switch (health) {
      case 'healthy': return 'text-green-600';
      case 'warning': return 'text-yellow-600';
      case 'critical': return 'text-red-600';
      default: return 'text-gray-600';
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'production': return RocketLaunchIcon;
      case 'staging': return BeakerIcon;
      case 'development': return CodeBracketIcon;
      case 'testing': return DocumentCheckIcon;
      default: return ServerIcon;
    }
  };

  const TypeIcon = getTypeIcon(environment.type);

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-6">
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
            <TypeIcon className="h-6 w-6 text-blue-600" />
          </div>
          <div>
            <h3 className="font-semibold text-gray-900">{environment.name}</h3>
            <div className="flex items-center gap-2 mt-1">
              <Badge variant="outline" className={getStatusColor(environment.status)}>
                {environment.status}
              </Badge>
              <span className="text-sm text-gray-600">v{environment.version}</span>
            </div>
          </div>
        </div>
        
        <div className="text-right">
          <div className={`text-lg font-semibold ${getHealthColor(environment.health.overall)}`}>
            {environment.health.score}%
          </div>
          <div className="text-sm text-gray-600">Health Score</div>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4 text-sm mb-4">
        <div>
          <div className="text-gray-600">Uptime</div>
          <div className="font-medium">{environment.uptime}%</div>
        </div>
        <div>
          <div className="text-gray-600">Provider</div>
          <div className="font-medium capitalize">{environment.infrastructure.provider}</div>
        </div>
        <div>
          <div className="text-gray-600">Instances</div>
          <div className="font-medium">{environment.infrastructure.instances}</div>
        </div>
        <div>
          <div className="text-gray-600">Last Deploy</div>
          <div className="font-medium">{environment.lastDeployment.toLocaleDateString()}</div>
        </div>
      </div>

      <div className="mb-4">
        <div className="text-sm font-medium text-gray-700 mb-2">Health Checks</div>
        <div className="space-y-1">
          {environment.health.checks.slice(0, 3).map((check) => (
            <div key={check.id} className="flex items-center justify-between text-sm">
              <span className="text-gray-600">{check.name}</span>
              <div className="flex items-center gap-2">
                {check.status === 'pass' && (
                  <CheckCircleIcon className="h-4 w-4 text-green-600" />
                )}
                {check.status === 'warning' && (
                  <ExclamationTriangleIcon className="h-4 w-4 text-yellow-600" />
                )}
                {check.status === 'fail' && (
                  <XCircleIcon className="h-4 w-4 text-red-600" />
                )}
                {check.responseTime && (
                  <span className="text-xs text-gray-500">{check.responseTime}ms</span>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="flex items-center justify-between">
        <a
          href={environment.url}
          target="_blank"
          rel="noopener noreferrer"
          className="text-blue-600 hover:text-blue-700 text-sm font-medium"
        >
          {environment.url}
        </a>

        <div className="flex gap-2">
          {environment.type !== 'production' && (
            <button
              onClick={() => onDeploy(environment.id, 'latest')}
              className="flex items-center gap-1 px-3 py-1 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700 transition-colors"
            >
              <RocketLaunchIcon className="h-3 w-3" />
              Deploy
            </button>
          )}
          
          <button
            onClick={() => onRollback(environment.id, 'previous')}
            className="flex items-center gap-1 px-3 py-1 bg-gray-100 text-gray-700 text-sm rounded-lg hover:bg-gray-200 transition-colors"
          >
            <ArrowPathIcon className="h-3 w-3" />
            Rollback
          </button>
        </div>
      </div>
    </div>
  );
};

const PipelineCard: React.FC<{
  pipeline: DeploymentPipeline;
  onRun: (pipelineId: string) => void;
}> = ({ pipeline, onRun }) => {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'success': return 'text-green-600 bg-green-50';
      case 'running': return 'text-blue-600 bg-blue-50';
      case 'failed': return 'text-red-600 bg-red-50';
      case 'cancelled': return 'text-gray-600 bg-gray-50';
      default: return 'text-gray-600 bg-gray-50';
    }
  };

  const getStageIcon = (type: string) => {
    switch (type) {
      case 'build': return CogIcon;
      case 'test': return BeakerIcon;
      case 'security': return ShieldCheckIcon;
      case 'deploy': return RocketLaunchIcon;
      case 'verify': return CheckCircleIcon;
      default: return DocumentTextIcon;
    }
  };

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-6">
      <div className="flex items-start justify-between mb-4">
        <div>
          <h3 className="font-semibold text-gray-900">{pipeline.name}</h3>
          <div className="flex items-center gap-2 mt-1">
            <Badge variant="outline" className={getStatusColor(pipeline.status)}>
              {pipeline.status}
            </Badge>
            <span className="text-sm text-gray-600">{pipeline.environment}</span>
            <span className="text-sm text-gray-600">v{pipeline.version}</span>
          </div>
        </div>
        
        {pipeline.status === 'running' && (
          <div className="text-right">
            <div className="text-lg font-semibold text-blue-600">{pipeline.progress}%</div>
            <div className="text-sm text-gray-600">Progress</div>
          </div>
        )}
      </div>

      {pipeline.status === 'running' && (
        <div className="mb-4">
          <ProgressBar progress={pipeline.progress} color="blue" />
          <div className="text-sm text-gray-600 mt-1">
            Current: {pipeline.currentStage}
          </div>
        </div>
      )}

      <div className="mb-4">
        <div className="text-sm font-medium text-gray-700 mb-2">Stages</div>
        <div className="flex gap-2">
          {pipeline.stages.map((stage) => {
            const StageIcon = getStageIcon(stage.type);
            
            return (
              <div
                key={stage.id}
                className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm ${
                  stage.status === 'success' ? 'bg-green-100 text-green-800' :
                  stage.status === 'running' ? 'bg-blue-100 text-blue-800' :
                  stage.status === 'failed' ? 'bg-red-100 text-red-800' :
                  'bg-gray-100 text-gray-600'
                }`}
              >
                <StageIcon className="h-3 w-3" />
                {stage.name}
                {stage.duration && (
                  <span className="text-xs">({Math.round(stage.duration / 60)}m)</span>
                )}
              </div>
            );
          })}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4 text-sm mb-4">
        <div>
          <div className="text-gray-600">Changes</div>
          <div className="font-medium">{pipeline.changes.length}</div>
        </div>
        <div>
          <div className="text-gray-600">Duration</div>
          <div className="font-medium">
            {pipeline.duration ? `${Math.round(pipeline.duration / 60)}m` : 'N/A'}
          </div>
        </div>
      </div>

      <div className="flex items-center justify-between">
        <div className="text-sm text-gray-600">
          {pipeline.startedAt && (
            <span>Started: {pipeline.startedAt.toLocaleString()}</span>
          )}
        </div>

        <div className="flex gap-2">
          <button
            onClick={() => onRun(pipeline.id)}
            disabled={pipeline.status === 'running'}
            className="flex items-center gap-1 px-3 py-1 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            <PlayIcon className="h-3 w-3" />
            Run
          </button>
          
          <button className="flex items-center gap-1 px-3 py-1 bg-gray-100 text-gray-700 text-sm rounded-lg hover:bg-gray-200 transition-colors">
            <EyeIcon className="h-3 w-3" />
            Logs
          </button>
        </div>
      </div>
    </div>
  );
};

const QualityOverview: React.FC<{ metrics: QualityMetrics }> = ({ metrics }) => {
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

  return (
    <div className="space-y-6">
      {/* Overall Quality */}
      <div className={`rounded-2xl border-2 p-6 ${getGradeColor(metrics.overall.grade)} border-current`}>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-full bg-white/50 flex items-center justify-center">
              <ShieldCheckIcon className="h-8 w-8" />
            </div>
            <div>
              <h2 className="text-2xl font-bold">Grade {metrics.overall.grade}</h2>
              <p className="opacity-90">Overall Quality Score</p>
            </div>
          </div>
          
          <div className="text-right">
            <div className="text-4xl font-bold">{metrics.overall.score}</div>
            <div className="text-sm opacity-90">Quality Score</div>
          </div>
        </div>
      </div>

      {/* Quality Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
              <CheckCircleIcon className="h-5 w-5 text-green-600" />
            </div>
            <div>
              <h3 className="font-medium text-gray-900">Test Coverage</h3>
              <p className="text-sm text-gray-600">Code Coverage</p>
            </div>
          </div>
          
          <div className="text-2xl font-bold text-gray-900 mb-2">
            {metrics.codeQuality.coverage.toFixed(1)}%
          </div>
          <ProgressBar progress={metrics.codeQuality.coverage} color="green" />
        </div>

        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
              <CpuChipIcon className="h-5 w-5 text-blue-600" />
            </div>
            <div>
              <h3 className="font-medium text-gray-900">Complexity</h3>
              <p className="text-sm text-gray-600">Cyclomatic</p>
            </div>
          </div>
          
          <div className="text-2xl font-bold text-gray-900">
            {metrics.codeQuality.complexity.toFixed(1)}
          </div>
          <div className="text-sm text-gray-600">Avg per function</div>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center">
              <BugAntIcon className="h-5 w-5 text-red-600" />
            </div>
            <div>
              <h3 className="font-medium text-gray-900">Vulnerabilities</h3>
              <p className="text-sm text-gray-600">Security Issues</p>
            </div>
          </div>
          
          <div className="text-2xl font-bold text-gray-900">
            {metrics.security.vulnerabilities.length}
          </div>
          <div className="text-sm text-gray-600">Active issues</div>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 bg-yellow-100 rounded-lg flex items-center justify-center">
              <WrenchScrewdriverIcon className="h-5 w-5 text-yellow-600" />
            </div>
            <div>
              <h3 className="font-medium text-gray-900">Tech Debt</h3>
              <p className="text-sm text-gray-600">Maintenance</p>
            </div>
          </div>
          
          <div className="text-2xl font-bold text-gray-900">
            {metrics.codeQuality.techDebt.toFixed(1)}h
          </div>
          <div className="text-sm text-gray-600">Estimated effort</div>
        </div>
      </div>

      {/* Test Suites */}
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Test Suites</h3>
        <div className="space-y-4">
          {Object.values(metrics.testing).map((suite) => {
            const passRate = (suite.passed / suite.total) * 100;
            
            return (
              <div key={suite.name} className="flex items-center gap-4">
                <div className="w-32">
                  <div className="font-medium text-gray-900">{suite.name}</div>
                  <div className="text-sm text-gray-600">{suite.total} tests</div>
                </div>
                
                <div className="flex-1">
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-sm text-gray-600">Pass Rate</span>
                    <span className="text-sm font-medium">{passRate.toFixed(1)}%</span>
                  </div>
                  <ProgressBar 
                    progress={passRate} 
                    color={passRate >= 90 ? 'green' : passRate >= 70 ? 'yellow' : 'red'} 
                  />
                </div>
                
                <div className="flex gap-4 text-sm">
                  <span className="text-green-600">✓ {suite.passed}</span>
                  <span className="text-red-600">✗ {suite.failed}</span>
                  <span className="text-gray-600">⊘ {suite.skipped}</span>
                </div>
                
                <div className="text-sm text-gray-600">
                  {Math.round(suite.duration / 60)}m
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

// Main Component
const DeploymentQualityCenter: React.FC = () => {
  const {
    environments,
    pipelines,
    qualityMetrics,
    deploymentHistory,
    isLoading,
    selectedTab,
    setSelectedTab,
    deployToEnvironment,
    runPipeline,
    rollbackDeployment,
    loadDeploymentData
  } = useDeploymentQuality();

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
            Centro de Despliegue y Calidad
          </h1>
          <p className="text-gray-600 mt-1">
            Gestión de deployments, pipelines CI/CD y métricas de calidad
          </p>
        </div>
        
        <div className="flex gap-2">
          <button
            onClick={loadDeploymentData}
            className="flex items-center gap-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
          >
            <ArrowPathIcon className="h-4 w-4" />
            Actualizar
          </button>
          <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
            <ArrowDownTrayIcon className="h-4 w-4" />
            Exportar Reporte
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200 mb-6">
        <nav className="flex space-x-8">
          {[
            { id: 'environments', label: 'Entornos', icon: ServerIcon },
            { id: 'pipelines', label: 'Pipelines', icon: RocketLaunchIcon },
            { id: 'quality', label: 'Calidad', icon: ShieldCheckIcon },
            { id: 'history', label: 'Historial', icon: ClockIcon }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setSelectedTab(tab.id as any)}
              className={`flex items-center gap-2 py-4 px-1 border-b-2 font-medium text-sm ${
                selectedTab === tab.id
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
      {selectedTab === 'environments' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
          {environments.map((env) => (
            <EnvironmentCard
              key={env.id}
              environment={env}
              onDeploy={deployToEnvironment}
              onRollback={rollbackDeployment}
            />
          ))}
        </div>
      )}

      {selectedTab === 'pipelines' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {pipelines.map((pipeline) => (
            <PipelineCard
              key={pipeline.id}
              pipeline={pipeline}
              onRun={runPipeline}
            />
          ))}
        </div>
      )}

      {selectedTab === 'quality' && qualityMetrics && (
        <QualityOverview metrics={qualityMetrics} />
      )}

      {selectedTab === 'history' && (
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Historial de Deployments</h3>
          <div className="space-y-4">
            {deploymentHistory.map((deployment) => (
              <div key={deployment.id} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                <div className="flex items-center gap-4">
                  <div className={`w-3 h-3 rounded-full ${
                    deployment.status === 'success' ? 'bg-green-500' :
                    deployment.status === 'failed' ? 'bg-red-500' :
                    'bg-yellow-500'
                  }`} />
                  
                  <div>
                    <div className="font-medium text-gray-900">
                      {deployment.environment} - v{deployment.version}
                    </div>
                    <div className="text-sm text-gray-600">
                      {deployment.deployedAt.toLocaleString()} por {deployment.deployedBy}
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center gap-4 text-sm">
                  <div className="text-gray-600">
                    {Math.round(deployment.duration / 60)}m
                  </div>
                  <div className="text-gray-600">
                    {deployment.changes} cambios
                  </div>
                  <Badge variant={
                    deployment.status === 'success' ? 'success' :
                    deployment.status === 'failed' ? 'danger' : 'warning'
                  }>
                    {deployment.status}
                  </Badge>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default DeploymentQualityCenter;