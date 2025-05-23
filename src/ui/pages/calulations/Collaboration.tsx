import React, { useState, useEffect } from "react";
import {
  HandThumbUpIcon,
  UserGroupIcon,
  PlusIcon,
  GlobeAmericasIcon,
  MapPinIcon,
  ArrowDownIcon,
  ChevronRightIcon,
  BookmarkIcon,
  ArrowTrendingUpIcon,
  FunnelIcon,
  MagnifyingGlassIcon,
  EyeIcon,
  ShareIcon,
  ChatBubbleLeftRightIcon,
  XMarkIcon,
  CheckIcon,
  ClockIcon,
  UserIcon,
  AcademicCapIcon,
  TrophyIcon,
  FireIcon,
  BoltIcon,
  ShieldCheckIcon,
  DocumentTextIcon,
  HeartIcon,
  ArrowUpIcon,
} from "@heroicons/react/24/outline";
import {
  StarIcon as StarSolidIcon,
  HandThumbUpIcon as HandThumbUpSolidIcon,
  HeartIcon as HeartSolidIcon,
  TrophyIcon as TrophySolidIcon,
} from "@heroicons/react/24/solid";

// Interfaces mejoradas
interface TrendingTemplate {
  id: string;
  name: string;
  description: string;
  type: string;
  category: string;
  usageCount: number;
  globalUsageCount: number;
  averageRating: number;
  ratingCount: number;
  country: string;
  countryRank: number;
  globalRank: number;
  createdByName: string;
  createdById: string;
  tags: string[];
  growthRate: number;
  isVerified: boolean;
  isFeatured: boolean;
  createdAt: string;
  lastUsed: string;
  complexity: "basic" | "intermediate" | "advanced";
  targetProfessions: string[];
  normativeCompliance: string[];
}

interface VotingProposal {
  id: string;
  title: string;
  description: string;
  type: "improvement" | "new_formula" | "fix" | "normative_update";
  targetTemplateId?: string;
  targetTemplateName?: string;
  votesCount: number;
  upVotes: number;
  downVotes: number;
  userVote?: "up" | "down" | null;
  status: "active" | "approved" | "rejected" | "implemented";
  countryRanking: number;
  globalRanking: number;
  createdByName: string;
  createdById: string;
  createdAt: string;
  lastActivityAt: string;
  country: string;
  normativeReference?: string;
  supportingDocuments?: string[];
  commentsCount: number;
  priority: "low" | "medium" | "high" | "critical";
  estimatedImplementationTime?: string;
}

interface TeamTemplate {
  id: string;
  name: string;
  description: string;
  createdByName: string;
  createdById: string;
  usageCount: number;
  teamUsageCount: number;
  sharedWithTeam: boolean;
  isPublic: boolean;
  tags: string[];
  category: string;
  updatedAt: string;
  permissions: {
    canEdit: string[];
    canView: string[];
    canShare: string[];
  };
  status: "draft" | "active" | "archived";
  version: string;
}

interface FilterState {
  searchTerm: string;
  category: string;
  country: string;
  profession: string;
  sortBy: string;
  complexity: string;
  verified: boolean;
}

interface User {
  id: string;
  name: string;
  country: string;
  profession: string;
}

const Collaboration: React.FC = () => {
  const [activeTab, setActiveTab] = useState("trending");
  const [viewMode, setViewMode] = useState<"country" | "global">("country");
  const [trendingTemplates, setTrendingTemplates] = useState<TrendingTemplate[]>([]);
  const [votingProposals, setVotingProposals] = useState<VotingProposal[]>([]);
  const [teamTemplates, setTeamTemplates] = useState<TeamTemplate[]>([]);
  const [loading, setLoading] = useState(false);
  const [currentUser] = useState<User>({
    id: "current-user",
    name: "Usuario Actual",
    country: "Ecuador",
    profession: "Ingeniero Civil"
  });

  // Estados de filtros
  const [filters, setFilters] = useState<FilterState>({
    searchTerm: "",
    category: "",
    country: "",
    profession: "",
    sortBy: "usage",
    complexity: "",
    verified: false,
  });

  // Estados de UI
  const [showFilters, setShowFilters] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState<TrendingTemplate | null>(null);
  const [showTemplateModal, setShowTemplateModal] = useState(false);
  const [showShareTeamModal, setShowShareTeamModal] = useState(false);

  const tabs = [
    {
      id: "trending",
      name: "Tendencias Globales",
      icon: ArrowTrendingUpIcon,
      color: "text-green-600",
      badge: trendingTemplates.length,
    },
    {
      id: "voting",
      name: "Votaciones Comunitarias",
      icon: HandThumbUpIcon,
      color: "text-blue-600",
      badge: votingProposals.filter(p => p.status === "active").length,
    },
    {
      id: "team",
      name: "Colaboración Empresarial",
      icon: UserGroupIcon,
      color: "text-purple-600",
      badge: teamTemplates.length,
    },
  ];

  const categories = [
    { id: "structural", name: "🏗️ Estructural", color: "bg-blue-100 text-blue-700" },
    { id: "electrical", name: "⚡ Eléctrico", color: "bg-yellow-100 text-yellow-700" },
    { id: "architectural", name: "🏛️ Arquitectónico", color: "bg-purple-100 text-purple-700" },
    { id: "hydraulic", name: "🚰 Hidráulico", color: "bg-cyan-100 text-cyan-700" },
    { id: "mechanical", name: "⚙️ Mecánico", color: "bg-gray-100 text-gray-700" },
    { id: "environmental", name: "🌱 Ambiental", color: "bg-green-100 text-green-700" },
  ];

  const countries = [
    "Ecuador", "Colombia", "Perú", "Venezuela", "Bolivia", "Chile", "Argentina", "Brasil", "México"
  ];

  const professions = [
    "Ingeniero Civil", "Arquitecto", "Ingeniero Estructural", "Ingeniero Eléctrico", 
    "Ingeniero Mecánico", "Maestro de Obra", "Contratista", "Supervisor de Obra"
  ];

  useEffect(() => {
    fetchData();
  }, [activeTab, viewMode, filters]);

  const fetchData = async () => {
    setLoading(true);
    try {
      switch (activeTab) {
        case "trending":
          await fetchTrendingTemplates();
          break;
        case "voting":
          await fetchVotingProposals();
          break;
        case "team":
          await fetchTeamTemplates();
          break;
      }
    } finally {
      setLoading(false);
    }
  };

  const fetchTrendingTemplates = async () => {
    // Simulación de datos mejorados
    const mockData: TrendingTemplate[] = [
      {
        id: "1",
        name: "Cálculo Sísmico NEC-SE-DS Actualizado 2024",
        description: "Cálculo de fuerzas sísmicas según normativa ecuatoriana actualizada, incluyye factores de zona, suelo y uso",
        type: "seismic_calculation",
        category: "structural",
        usageCount: 1247,
        globalUsageCount: 3451,
        averageRating: 4.8,
        ratingCount: 189,
        country: "Ecuador",
        countryRank: 1,
        globalRank: 3,
        createdByName: "Ing. María Vásquez",
        createdById: "user-123",
        tags: ["sísmico", "nec-se-ds", "estructural", "ecuador"],
        growthRate: 45.2,
        isVerified: true,
        isFeatured: true,
        createdAt: "2024-01-15T10:00:00Z",
        lastUsed: "2024-03-20T14:30:00Z",
        complexity: "advanced",
        targetProfessions: ["Ingeniero Civil", "Ingeniero Estructural"],
        normativeCompliance: ["NEC-SE-DS", "ACI-318"],
      },
      {
        id: "2",
        name: "Demanda Eléctrica Residencial con Paneles Solares",
        description: "Cálculo completo de demanda eléctrica considerando sistemas fotovoltaicos y almacenamiento",
        type: "electrical_calculation",
        category: "electrical",
        usageCount: 892,
        globalUsageCount: 2156,
        averageRating: 4.6,
        ratingCount: 134,
        country: "Colombia",
        countryRank: 2,
        globalRank: 7,
        createdByName: "Ing. Carlos Mendoza",
        createdById: "user-456",
        tags: ["eléctrico", "solar", "residencial", "renovable"],
        growthRate: 32.1,
        isVerified: true,
        isFeatured: false,
        createdAt: "2024-02-10T09:15:00Z",
        lastUsed: "2024-03-19T11:45:00Z",
        complexity: "intermediate",
        targetProfessions: ["Ingeniero Eléctrico"],
        normativeCompliance: ["NTC-2050", "IEEE-1547"],
      },
      {
        id: "3",
        name: "Cálculo de Zapatas con Método Terzaghi Actualizado",
        description: "Diseño de cimentaciones superficiales con análisis de capacidade portante y asentamientos",
        type: "foundation_calculation",
        category: "structural",
        usageCount: 756,
        globalUsageCount: 1890,
        averageRating: 4.4,
        ratingCount: 98,
        country: "Perú",
        countryRank: 1,
        globalRank: 12,
        createdByName: "Ing. Ana Torres",
        createdById: "user-789",
        tags: ["zapatas", "cimentación", "terzaghi", "suelos"],
        growthRate: 28.7,
        isVerified: false,
        isFeatured: true,
        createdAt: "2024-01-28T16:20:00Z",
        lastUsed: "2024-03-18T13:10:00Z",
        complexity: "intermediate",
        targetProfessions: ["Ingeniero Civil", "Ingeniero Geotécnico"],
        normativeCompliance: ["E.050", "ACI-318"],
      }
    ];
    
    setTrendingTemplates(mockData);
  };

  const fetchVotingProposals = async () => {
    const mockData: VotingProposal[] = [
      {
        id: "1",
        title: "Actualización Factor de Suelo S3 para Costa Ecuatoriana",
        description: "Propuesta para actualizar el factor de amplificación sísmica S3 basado en nuevos estudios geotécnicos de la costa ecuatoriana, especialmente para suelos blandos saturados",
        type: "normative_update",
        targetTemplateId: "template-123",
        targetTemplateName: "Cálculo Sísmico NEC-SE-DS",
        votesCount: 156,
        upVotes: 134,
        downVotes: 22,
        userVote: null,
        status: "active",
        countryRanking: 1,
        globalRanking: 8,
        createdByName: "Dr. Roberto Silva",
        createdById: "user-expert-1",
        createdAt: "2024-03-10T10:00:00Z",
        lastActivityAt: "2024-03-20T15:30:00Z",
        country: "Ecuador",
        normativeReference: "NEC-SE-DS Sección 2.4",
        supportingDocuments: ["estudio_geotecnico_costa_2024.pdf"],
        commentsCount: 23,
        priority: "high",
        estimatedImplementationTime: "3-6 meses"
      },
      {
        id: "2",
        title: "Nueva Fórmula para Vientos Huracanados en Zona Costera",
        description: "Desarrollo de fórmula específica para cálculo de cargas de viento en estructuras costeras considerando vientos huracanados y efectos de turbulencia marina",
        type: "new_formula",
        votesCount: 203,
        upVotes: 187,
        downVotes: 16,
        userVote: "up",
        status: "active",
        countryRanking: 1,
        globalRanking: 3,
        createdByName: "Ing. Ana Delgado",
        createdById: "user-expert-2",
        createdAt: "2024-03-05T14:30:00Z",
        lastActivityAt: "2024-03-20T12:15:00Z",
        country: "Colombia",
        normativeReference: "NSR-10 Título B.6",
        commentsCount: 41,
        priority: "critical",
        estimatedImplementationTime: "6-12 meses"
      },
      {
        id: "3",
        title: "Corrección en Cálculo de Momento por Sismo",
        description: "Se detectó un error en el cálculo del momento por sismo en estructuras irregulares. La fórmula actual no considera adecuadamente el factor de irregularidad Ia",
        type: "fix",
        targetTemplateId: "template-456",
        targetTemplateName: "Análisis Sísmico Estático",
        votesCount: 89,
        upVotes: 76,
        downVotes: 13,
        userVote: null,
        status: "active",
        countryRanking: 3,
        globalRanking: 15,
        createdByName: "Ing. Luis Herrera",
        createdById: "user-expert-3",
        createdAt: "2024-03-12T09:45:00Z",
        lastActivityAt: "2024-03-19T16:20:00Z",
        country: "Ecuador",
        normativeReference: "NEC-SE-DS Sección 3.2",
        commentsCount: 17,
        priority: "medium",
        estimatedImplementationTime: "1-3 meses"
      }
    ];
    
    setVotingProposals(mockData);
  };

  const fetchTeamTemplates = async () => {
    const mockData: TeamTemplate[] = [
      {
        id: "1",
        name: "Estándar Corporativo - Zapatas Aisladas",
        description: "Plantilla estándar de la empresa para diseño de zapatas aisladas, incluye verificaciones internas de calidad y factores de seguridad corporativos",
        createdByName: "Ing. Luis Herrera",
        createdById: "user-team-1",
        usageCount: 145,
        teamUsageCount: 89,
        sharedWithTeam: true,
        isPublic: false,
        tags: ["corporativo", "zapatas", "estándar", "qa"],
        category: "structural",
        updatedAt: "2024-03-18T09:15:00Z",
        permissions: {
          canEdit: ["admin", "engineer-senior"],
          canView: ["all"],
          canShare: ["admin"]
        },
        status: "active",
        version: "v2.1"
      },
      {
        id: "2",
        name: "Protocolo Instalaciones Eléctricas Edificios",
        description: "Procedimiento estandarizado para cálculo e instalación de sistemas eléctricos en edificaciones comerciales y residenciales",
        createdByName: "Ing. Carmen López",
        createdById: "user-team-2",
        usageCount: 67,
        teamUsageCount: 45,
        sharedWithTeam: true,
        isPublic: false,
        tags: ["protocolo", "eléctrico", "edificios", "instalación"],
        category: "electrical",
        updatedAt: "2024-03-15T14:30:00Z",
        permissions: {
          canEdit: ["admin", "electrical-team"],
          canView: ["all"],
          canShare: ["admin", "project-manager"]
        },
        status: "active",
        version: "v1.3"
      }
    ];
    
    setTeamTemplates(mockData);
  };

  const handleAddToMyTemplates = async (templateId: string) => {
    try {
      // Simulación de API call
      console.log("Agregando plantilla", templateId);
      // Actualizar el contador de uso
      setTrendingTemplates(prev => 
        prev.map(t => 
          t.id === templateId 
            ? { ...t, usageCount: t.usageCount + 1, globalUsageCount: t.globalUsageCount + 1 }
            : t
        )
      );
      // Mostrar notificación de éxito
      alert("Plantilla agregada a tus plantillas personales");
    } catch (error) {
      console.error("Error adding template:", error);
    }
  };

  const handleVote = async (proposalId: string, voteType: "up" | "down") => {
    try {
      setVotingProposals(prev =>
        prev.map(p => {
          if (p.id === proposalId) {
            const newUpVotes = voteType === "up" ? p.upVotes + 1 : p.upVotes;
            const newDownVotes = voteType === "down" ? p.downVotes + 1 : p.downVotes;
            return {
              ...p,
              upVotes: newUpVotes,
              downVotes: newDownVotes,
              votesCount: newUpVotes + newDownVotes,
              userVote: voteType
            };
          }
          return p;
        })
      );
    } catch (error) {
      console.error("Error voting:", error);
    }
  };

  const filteredTemplates = trendingTemplates.filter(template => {
    if (filters.searchTerm && !template.name.toLowerCase().includes(filters.searchTerm.toLowerCase()) && 
        !template.description.toLowerCase().includes(filters.searchTerm.toLowerCase())) {
      return false;
    }
    if (filters.category && template.category !== filters.category) return false;
    if (filters.country && template.country !== filters.country) return false;
    if (filters.complexity && template.complexity !== filters.complexity) return false;
    if (filters.verified && !template.isVerified) return false;
    return true;
  });

  const sortedTemplates = [...filteredTemplates].sort((a, b) => {
    switch (filters.sortBy) {
      case "usage":
        return viewMode === "global" ? b.globalUsageCount - a.globalUsageCount : b.usageCount - a.usageCount;
      case "rating":
        return b.averageRating - a.averageRating;
      case "recent":
        return new Date(b.lastUsed).getTime() - new Date(a.lastUsed).getTime();
      case "growth":
        return b.growthRate - a.growthRate;
      default:
        return 0;
    }
  });

  const filteredProposals = votingProposals.filter(proposal => {
    if (filters.searchTerm && !proposal.title.toLowerCase().includes(filters.searchTerm.toLowerCase())) {
      return false;
    }
    return true;
  });

  const renderTrendingTab = () => (
    <div className="space-y-6">
      {/* Header y controles */}
      <div className="bg-white rounded-2xl border border-gray-200 p-6">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 mb-6">
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              🔥 Cálculos Más Populares
            </h2>
            <p className="text-gray-600">
              Descubre las plantillas más utilizadas por la comunidad de profesionales
            </p>
          </div>
          
          <div className="flex items-center gap-3">
            <button
              onClick={() => setViewMode(viewMode === "country" ? "global" : "country")}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl border-2 transition-all duration-200 ${
                viewMode === "global"
                  ? "bg-blue-50 border-blue-200 text-blue-700"
                  : "bg-green-50 border-green-200 text-green-700"
              }`}
            >
              {viewMode === "global" ? (
                <>
                  <GlobeAmericasIcon className="h-5 w-5" />
                  <span className="font-medium">Ranking Global</span>
                </>
              ) : (
                <>
                  <MapPinIcon className="h-5 w-5" />
                  <span className="font-medium">Ranking {currentUser.country}</span>
                </>
              )}
            </button>
            
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center gap-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-xl transition-colors"
            >
              <FunnelIcon className="h-5 w-5" />
              <span>Filtros</span>
            </button>
          </div>
        </div>

        {/* Filtros expandibles */}
        {showFilters && (
          <div className="border-t border-gray-200 pt-6 space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Buscar
                </label>
                <div className="relative">
                  <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Buscar plantillas..."
                    value={filters.searchTerm}
                    onChange={(e) => setFilters(prev => ({ ...prev, searchTerm: e.target.value }))}
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Categoría
                </label>
                <select
                  value={filters.category}
                  onChange={(e) => setFilters(prev => ({ ...prev, category: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                >
                  <option value="">Todas las categorías</option>
                  {categories.map(cat => (
                    <option key={cat.id} value={cat.id}>{cat.name}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Complejidad
                </label>
                <select
                  value={filters.complexity}
                  onChange={(e) => setFilters(prev => ({ ...prev, complexity: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                >
                  <option value="">Todas</option>
                  <option value="basic">🟢 Básico</option>
                  <option value="intermediate">🟡 Intermedio</option>
                  <option value="advanced">🔴 Avanzado</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Ordenar por
                </label>
                <select
                  value={filters.sortBy}
                  onChange={(e) => setFilters(prev => ({ ...prev, sortBy: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                >
                  <option value="usage">Más utilizados</option>
                  <option value="rating">Mejor calificados</option>
                  <option value="recent">Recientemente usados</option>
                  <option value="growth">Mayor crecimiento</option>
                </select>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={filters.verified}
                  onChange={(e) => setFilters(prev => ({ ...prev, verified: e.target.checked }))}
                  className="h-4 w-4 text-primary-600 rounded"
                />
                <span className="flex items-center gap-1 text-sm text-gray-700">
                  <ShieldCheckIcon className="h-4 w-4 text-green-600" />
                  Solo verificados
                </span>
              </label>
            </div>
          </div>
        )}
      </div>

      {/* Grid de templates */}
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
        {sortedTemplates.map((template, index) => {
          const rankPosition = viewMode === "global" ? template.globalRank : template.countryRank;
          const usageCount = viewMode === "global" ? template.globalUsageCount : template.usageCount;
          const category = categories.find(c => c.id === template.category);
          
          return (
            <div
              key={template.id}
              className="bg-white rounded-2xl shadow-sm border border-gray-100 hover:shadow-xl hover:border-primary-200 transition-all duration-300 p-6 cursor-pointer group"
              onClick={() => {
                setSelectedTemplate(template);
                setShowTemplateModal(true);
              }}
            >
              {/* Header con ranking y badges */}
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-white font-bold text-sm ${
                    rankPosition <= 3 ? 'bg-gradient-to-r from-yellow-400 to-orange-500' :
                    rankPosition <= 10 ? 'bg-gradient-to-r from-primary-500 to-secondary-500' :
                    'bg-gradient-to-r from-gray-400 to-gray-600'
                  }`}>
                    #{rankPosition}
                  </div>
                  
                  <div className="flex flex-col gap-1">
                    <div className="flex items-center gap-2">
                      {template.isVerified && (
                        <ShieldCheckIcon className="h-4 w-4 text-green-600" />
                      )}
                      {template.isFeatured && (
                        <StarSolidIcon className="h-4 w-4 text-yellow-400" />
                      )}
                      {template.growthRate > 40 && (
                        <FireIcon className="h-4 w-4 text-red-500" />
                      )}
                    </div>
                    
                    <div className="flex items-center gap-2 text-xs">
                      <span className={`px-2 py-1 rounded-full font-medium ${
                        template.complexity === 'basic' ? 'bg-green-100 text-green-700' :
                        template.complexity === 'intermediate' ? 'bg-yellow-100 text-yellow-700' :
                        'bg-red-100 text-red-700'
                      }`}>
                        {template.complexity === 'basic' ? '🟢 Básico' :
                         template.complexity === 'intermediate' ? '🟡 Intermedio' : '🔴 Avanzado'}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="text-right">
                  <div className="flex items-center gap-1 text-yellow-400 mb-1">
                    <StarSolidIcon className="h-4 w-4" />
                    <span className="text-sm font-medium text-gray-900">
                      {template.averageRating}
                    </span>
                    <span className="text-xs text-gray-500">
                      ({template.ratingCount})
                    </span>
                  </div>
                  <div className="flex items-center gap-1 text-green-600">
                    <ArrowTrendingUpIcon className="h-3 w-3" />
                    <span className="text-xs font-medium">
                      +{template.growthRate}%
                    </span>
                  </div>
                </div>
              </div>

              {/* Contenido principal */}
              <div className="mb-4">
                <h3 className="font-semibold text-gray-900 mb-2 line-clamp-2 group-hover:text-primary-600 transition-colors">
                  {template.name}
                </h3>
                <p className="text-gray-600 text-sm mb-3 line-clamp-3">
                  {template.description}
                </p>

                {/* Categoría y país */}
                <div className="flex items-center justify-between mb-3">
                  {category && (
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${category.color}`}>
                      {category.name}
                    </span>
                  )}
                  <span className="text-xs text-gray-500 flex items-center gap-1">
                    <MapPinIcon className="h-3 w-3" />
                    {template.country}
                  </span>
                </div>

                {/* Métricas */}
                <div className="flex items-center justify-between text-sm text-gray-600 mb-4">
                  <div className="flex items-center gap-4">
                    <span className="flex items-center gap-1">
                      <EyeIcon className="h-4 w-4" />
                      {usageCount.toLocaleString()}
                    </span>
                    <span className="flex items-center gap-1">
                      <UserIcon className="h-4 w-4" />
                      {template.createdByName}
                    </span>
                  </div>
                </div>

                {/* Tags */}
                <div className="flex flex-wrap gap-1 mb-4">
                  {template.tags.slice(0, 3).map((tag, tagIndex) => (
                    <span
                      key={tagIndex}
                      className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-md"
                    >
                      #{tag}
                    </span>
                  ))}
                  {template.tags.length > 3 && (
                    <span className="px-2 py-1 bg-gray-100 text-gray-500 text-xs rounded-md">
                      +{template.tags.length - 3}
                    </span>
                  )}
                </div>

                {/* Normativas */}
                {template.normativeCompliance.length > 0 && (
                  <div className="mb-4">
                    <div className="text-xs text-gray-500 mb-1">Normativas:</div>
                    <div className="flex flex-wrap gap-1">
                      {template.normativeCompliance.slice(0, 2).map((norm, normIndex) => (
                        <span
                          key={normIndex}
                          className="px-2 py-1 bg-blue-50 text-blue-600 text-xs rounded-md font-medium"
                        >
                          {norm}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Botón de acción */}
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleAddToMyTemplates(template.id);
                }}
                className="w-full bg-gradient-to-r from-primary-600 to-secondary-500 hover:from-primary-700 hover:to-secondary-600 text-white py-3 px-4 rounded-xl transition-all duration-200 flex items-center justify-center gap-2 font-medium group-hover:shadow-lg"
              >
                <BookmarkIcon className="h-4 w-4" />
                Agregar a Mis Plantillas
              </button>
            </div>
          );
        })}
      </div>

      {/* Empty state */}
      {sortedTemplates.length === 0 && (
        <div className="text-center py-16 bg-white rounded-2xl border border-gray-200">
          <DocumentTextIcon className="h-16 w-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            No se encontraron plantillas
          </h3>
          <p className="text-gray-600 mb-6">
            Intenta ajustar los filtros de búsqueda.
          </p>
          <button
            onClick={() => setFilters({
              searchTerm: "",
              category: "",
              country: "",
              profession: "",
              sortBy: "usage",
              complexity: "",
              verified: false,
            })}
            className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
          >
            Limpiar Filtros
          </button>
        </div>
      )}
    </div>
  );

  const renderVotingTab = () => (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-2xl border border-gray-200 p-6">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 mb-4">
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              🗳️ Votaciones Comunitarias
            </h2>
            <p className="text-gray-600">
              Participa en la mejora de cálculos técnicos votando por propuestas de la comunidad
            </p>
          </div>
          
          <div className="flex items-center gap-3">
            <button
              onClick={() => setViewMode(viewMode === "country" ? "global" : "country")}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl border-2 transition-all duration-200 ${
                viewMode === "global"
                  ? "bg-blue-50 border-blue-200 text-blue-700"
                  : "bg-green-50 border-green-200 text-green-700"
              }`}
            >
              {viewMode === "global" ? (
                <>
                  <GlobeAmericasIcon className="h-5 w-5" />
                  <span className="font-medium">Vista Global</span>
                </>
              ) : (
                <>
                  <MapPinIcon className="h-5 w-5" />
                  <span className="font-medium">Vista {currentUser.country}</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Filtro de búsqueda */}
        <div className="relative">
          <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <input
            type="text"
            placeholder="Buscar propuestas..."
            value={filters.searchTerm}
            onChange={(e) => setFilters(prev => ({ ...prev, searchTerm: e.target.value }))}
            className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
          />
        </div>
      </div>

      {/* Lista de propuestas */}
      <div className="space-y-4">
        {filteredProposals.map((proposal) => {
          const ranking = viewMode === "global" ? proposal.globalRanking : proposal.countryRanking;
          const approvalRate = (proposal.upVotes / proposal.votesCount * 100).toFixed(1);
          
          return (
            <div
              key={proposal.id}
              className="bg-white rounded-2xl shadow-sm border border-gray-100 hover:shadow-lg transition-all duration-300 p-6"
            >
              <div className="flex items-start gap-6">
                {/* Ranking y votos */}
                <div className="flex flex-col items-center gap-2">
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-white font-bold ${
                    ranking <= 3 ? 'bg-gradient-to-r from-yellow-400 to-orange-500' :
                    ranking <= 10 ? 'bg-gradient-to-r from-primary-500 to-secondary-500' :
                    'bg-gradient-to-r from-gray-400 to-gray-600'
                  }`}>
                    #{ranking}
                  </div>
                  
                  <div className="text-center">
                    <div className="text-sm font-bold text-gray-900">
                      {proposal.votesCount}
                    </div>
                    <div className="text-xs text-gray-500">votos</div>
                  </div>
                  
                  <div className="text-center">
                    <div className="text-sm font-medium text-green-600">
                      {approvalRate}%
                    </div>
                    <div className="text-xs text-gray-500">aprobación</div>
                  </div>
                </div>

                {/* Contenido principal */}
                <div className="flex-1">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <h3 className="font-semibold text-gray-900 text-lg">
                          {proposal.title}
                        </h3>
                        
                        {/* Badges */}
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          proposal.type === "improvement" ? "bg-blue-100 text-blue-700" :
                          proposal.type === "new_formula" ? "bg-green-100 text-green-700" :
                          proposal.type === "fix" ? "bg-red-100 text-red-700" :
                          "bg-purple-100 text-purple-700"
                        }`}>
                          {proposal.type === "improvement" ? "🔧 Mejora" :
                           proposal.type === "new_formula" ? "✨ Nueva Fórmula" :
                           proposal.type === "fix" ? "🐛 Corrección" : "📋 Actualización Normativa"}
                        </span>
                        
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          proposal.priority === "critical" ? "bg-red-100 text-red-700" :
                          proposal.priority === "high" ? "bg-orange-100 text-orange-700" :
                          proposal.priority === "medium" ? "bg-yellow-100 text-yellow-700" :
                          "bg-gray-100 text-gray-700"
                        }`}>
                          {proposal.priority === "critical" ? "🚨 Crítico" :
                           proposal.priority === "high" ? "⚠️ Alto" :
                           proposal.priority === "medium" ? "⚡ Medio" : "📝 Bajo"}
                        </span>
                      </div>
                      
                      <p className="text-gray-600 text-sm mb-4 leading-relaxed">
                        {proposal.description}
                      </p>
                      
                      {/* Información adicional */}
                      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 text-xs text-gray-500 mb-4">
                        <div>
                          <span className="font-medium">Propuesto por:</span>
                          <br />
                          {proposal.createdByName}
                        </div>
                        <div>
                          <span className="font-medium">País:</span>
                          <br />
                          {proposal.country}
                        </div>
                        <div>
                          <span className="font-medium">Implementación:</span>
                          <br />
                          {proposal.estimatedImplementationTime}
                        </div>
                        <div>
                          <span className="font-medium">Comentarios:</span>
                          <br />
                          {proposal.commentsCount}
                        </div>
                      </div>

                      {/* Target template y normativa */}
                      {(proposal.targetTemplateName || proposal.normativeReference) && (
                        <div className="flex flex-wrap gap-2 mb-4">
                          {proposal.targetTemplateName && (
                            <span className="px-3 py-1 bg-blue-50 text-blue-600 text-xs rounded-full">
                              📊 {proposal.targetTemplateName}
                            </span>
                          )}
                          {proposal.normativeReference && (
                            <span className="px-3 py-1 bg-purple-50 text-purple-600 text-xs rounded-full">
                              📖 {proposal.normativeReference}
                            </span>
                          )}
                        </div>
                      )}

                      {/* Controles de votación */}
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <button
                            onClick={() => handleVote(proposal.id, "up")}
                            className={`flex items-center gap-2 px-4 py-2 rounded-xl transition-all duration-200 ${
                              proposal.userVote === "up"
                                ? "bg-green-100 text-green-700 border-2 border-green-200"
                                : "bg-gray-100 hover:bg-green-50 text-gray-600 hover:text-green-600 border-2 border-transparent"
                            }`}
                          >
                            {proposal.userVote === "up" ? (
                              <HandThumbUpSolidIcon className="h-4 w-4" />
                            ) : (
                              <HandThumbUpIcon className="h-4 w-4" />
                            )}
                            <span className="font-medium">
                              {proposal.upVotes}
                            </span>
                          </button>

                          <button
                            onClick={() => handleVote(proposal.id, "down")}
                            className={`flex items-center gap-2 px-4 py-2 rounded-xl transition-all duration-200 ${
                              proposal.userVote === "down"
                                ? "bg-red-100 text-red-700 border-2 border-red-200"
                                : "bg-gray-100 hover:bg-red-50 text-gray-600 hover:text-red-600 border-2 border-transparent"
                            }`}
                          >
                            <ArrowDownIcon className="h-4 w-4" />
                            <span className="font-medium">
                              {proposal.downVotes}
                            </span>
                          </button>
                        </div>

                        <div className="flex items-center gap-3">
                          <button className="flex items-center gap-2 text-gray-600 hover:text-primary-600 transition-colors">
                            <ChatBubbleLeftRightIcon className="h-4 w-4" />
                            <span className="text-sm">Comentar</span>
                          </button>
                          
                          <button className="text-primary-600 hover:text-primary-700 text-sm font-medium flex items-center gap-1">
                            Ver Detalles
                            <ChevronRightIcon className="h-4 w-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Empty state */}
      {filteredProposals.length === 0 && (
        <div className="text-center py-16 bg-white rounded-2xl border border-gray-200">
          <HandThumbUpIcon className="h-16 w-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            No hay propuestas activas
          </h3>
          <p className="text-gray-600 mb-6">
            Sé el primero en proponer una mejora a la comunidad.
          </p>
          <button className="px-6 py-3 bg-primary-600 text-white rounded-xl hover:bg-primary-700 transition-colors font-medium">
            Proponer Mejora
          </button>
        </div>
      )}
    </div>
  );

  const renderTeamTab = () => (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-2xl border border-gray-200 p-6">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              👥 Colaboración Empresarial
            </h2>
            <p className="text-gray-600">
              Comparte y colabora con plantillas de cálculo específicas de tu empresa
            </p>
          </div>
          <button
            onClick={() => setShowShareTeamModal(true)}
            className="px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-500 hover:from-purple-700 hover:to-pink-600 text-white rounded-xl transition-all duration-200 flex items-center gap-2 font-medium shadow-lg"
          >
            <PlusIcon className="h-5 w-5" />
            Compartir Nueva Plantilla
          </button>
        </div>
      </div>

      {/* Plantillas del equipo */}
      {teamTemplates.length > 0 ? (
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
          {teamTemplates.map((template) => {
            const category = categories.find(c => c.id === template.category);
            
            return (
              <div
                key={template.id}
                className="bg-white rounded-2xl shadow-sm border border-gray-100 hover:shadow-xl hover:border-purple-200 transition-all duration-300 p-6 group"
              >
                {/* Header */}
                <div className="flex items-start justify-between mb-4">
                  <div className="w-14 h-14 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl flex items-center justify-center shadow-lg">
                    <UserGroupIcon className="h-7 w-7 text-white" />
                  </div>
                  
                  <div className="flex flex-col gap-2">
                    <span className="px-3 py-1 bg-purple-100 text-purple-700 text-xs rounded-full font-medium">
                      🏢 Corporativo
                    </span>
                    <span className={`px-3 py-1 text-xs rounded-full font-medium ${
                      template.status === "active" ? "bg-green-100 text-green-700" :
                      template.status === "draft" ? "bg-yellow-100 text-yellow-700" :
                      "bg-gray-100 text-gray-700"
                    }`}>
                      {template.status === "active" ? "✅ Activo" :
                       template.status === "draft" ? "📝 Borrador" : "📁 Archivado"}
                    </span>
                  </div>
                </div>

                {/* Contenido */}
                <div className="mb-4">
                  <h3 className="font-semibold text-gray-900 mb-2 line-clamp-2 group-hover:text-purple-600 transition-colors">
                    {template.name}
                  </h3>
                  <p className="text-gray-600 text-sm mb-3 line-clamp-3">
                    {template.description}
                  </p>

                  {/* Categoría y versión */}
                  <div className="flex items-center justify-between mb-3">
                    {category && (
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${category.color}`}>
                        {category.name}
                      </span>
                    )}
                    <span className="text-xs text-gray-500 font-mono">
                      {template.version}
                    </span>
                  </div>

                  {/* Métricas */}
                  <div className="grid grid-cols-2 gap-4 text-sm text-gray-600 mb-4">
                    <div>
                      <span className="block text-xs text-gray-500">Uso Empresa</span>
                      <span className="font-medium">{template.teamUsageCount}</span>
                    </div>
                    <div>
                      <span className="block text-xs text-gray-500">Uso Total</span>
                      <span className="font-medium">{template.usageCount}</span>
                    </div>
                  </div>

                  {/* Metadata */}
                  <div className="text-xs text-gray-500 mb-4">
                    <div>Creado por: <span className="font-medium">{template.createdByName}</span></div>
                    <div>Actualizado: {new Date(template.updatedAt).toLocaleDateString("es-EC")}</div>
                  </div>

                  {/* Tags */}
                  <div className="flex flex-wrap gap-1 mb-4">
                    {template.tags.slice(0, 3).map((tag, index) => (
                      <span
                        key={index}
                        className="px-2 py-1 bg-purple-50 text-purple-600 text-xs rounded-md"
                      >
                        #{tag}
                      </span>
                    ))}
                    {template.tags.length > 3 && (
                      <span className="px-2 py-1 bg-gray-100 text-gray-500 text-xs rounded-md">
                        +{template.tags.length - 3}
                      </span>
                    )}
                  </div>

                  {/* Permisos */}
                  <div className="text-xs text-gray-500 mb-4">
                    <div className="flex items-center gap-2">
                      <span>Permisos:</span>
                      <span className="flex items-center gap-1">
                        <EyeIcon className="h-3 w-3" />
                        {template.permissions.canView.length}
                      </span>
                      <span className="flex items-center gap-1">
                        <DocumentTextIcon className="h-3 w-3" />
                        {template.permissions.canEdit.length}
                      </span>
                      <span className="flex items-center gap-1">
                        <ShareIcon className="h-3 w-3" />
                        {template.permissions.canShare.length}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Botones de acción */}
                <div className="flex gap-2">
                  <button className="flex-1 bg-gradient-to-r from-purple-600 to-pink-500 hover:from-purple-700 hover:to-pink-600 text-white py-2 px-4 rounded-xl transition-all duration-200 font-medium text-sm">
                    Usar Plantilla
                  </button>
                  <button className="px-3 py-2 bg-gray-100 hover:bg-gray-200 text-gray-600 rounded-xl transition-colors">
                    <ShareIcon className="h-4 w-4" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="text-center py-16 bg-white rounded-2xl border border-gray-200">
          <div className="w-24 h-24 bg-gradient-to-r from-purple-100 to-pink-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <UserGroupIcon className="h-12 w-12 text-purple-500" />
          </div>
          <h3 className="text-xl font-medium text-gray-900 mb-3">
            No hay plantillas del equipo
          </h3>
          <p className="text-gray-600 mb-8 max-w-md mx-auto">
            Comparte tus plantillas de cálculo con tu equipo para comenzar a colaborar 
            y estandarizar los procesos de tu empresa.
          </p>
          <button
            onClick={() => setShowShareTeamModal(true)}
            className="bg-gradient-to-r from-purple-600 to-pink-500 hover:from-purple-700 hover:to-pink-600 text-white px-8 py-3 rounded-xl transition-all duration-200 font-medium shadow-lg"
          >
            Compartir Primera Plantilla
          </button>
        </div>
      )}
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-primary-600 via-secondary-500 to-accent-400 border-b border-gray-200">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center text-white">
            <h1 className="text-4xl font-bold tracking-tight mb-3">
              🤝 Centro de Colaboración CONSTRU
            </h1>
            <p className="text-xl opacity-90 max-w-3xl mx-auto leading-relaxed">
              Únete a la comunidad global de profesionales de la construcción. 
              Descubre, vota y colabora en la evolución de cálculos técnicos.
            </p>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Navegación por tabs */}
        <div className="bg-white rounded-2xl border border-gray-200 p-2 mb-8 shadow-sm">
          <nav className="flex space-x-2">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex-1 flex items-center justify-center gap-3 px-6 py-4 rounded-xl font-medium transition-all duration-200 relative ${
                  activeTab === tab.id
                    ? "bg-gradient-to-r from-primary-100 to-secondary-100 text-primary-700 shadow-sm"
                    : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
                }`}
              >
                <tab.icon className={`h-5 w-5 ${activeTab === tab.id ? tab.color : ""}`} />
                <span className="hidden sm:block">{tab.name}</span>
                {tab.badge > 0 && (
                  <span
                    className={`px-2 py-1 text-xs font-bold rounded-full ${
                      activeTab === tab.id
                        ? "bg-primary-200 text-primary-800"
                        : "bg-gray-200 text-gray-600"
                    }`}
                  >
                    {tab.badge}
                  </span>
                )}
              </button>
            ))}
          </nav>
        </div>

        {/* Contenido de tabs */}
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <div className="text-center">
              <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-primary-600 mx-auto mb-4"></div>
              <p className="text-gray-600">Cargando contenido...</p>
            </div>
          </div>
        ) : (
          <div>
            {activeTab === "trending" && renderTrendingTab()}
            {activeTab === "voting" && renderVotingTab()}
            {activeTab === "team" && renderTeamTab()}
          </div>
        )}
      </div>

      {/* Modal de detalles de plantilla */}
      {showTemplateModal && selectedTemplate && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden">
            <div className="border-b border-gray-200 p-6">
              <div className="flex items-center justify-between">
                <h3 className="text-2xl font-bold text-gray-900">
                  Detalles de la Plantilla
                </h3>
                <button
                  onClick={() => setShowTemplateModal(false)}
                  className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                >
                  <XMarkIcon className="h-6 w-6 text-gray-500" />
                </button>
              </div>
            </div>

            <div className="p-6 overflow-y-auto max-h-[calc(90vh-140px)]">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Información principal */}
                <div className="lg:col-span-2 space-y-6">
                  <div>
                    <h4 className="text-xl font-semibold text-gray-900 mb-3">
                      {selectedTemplate.name}
                    </h4>
                    <p className="text-gray-600 leading-relaxed">
                      {selectedTemplate.description}
                    </p>
                  </div>

                  <div>
                    <h5 className="font-medium text-gray-900 mb-2">Profesiones Objetivo</h5>
                    <div className="flex flex-wrap gap-2">
                      {selectedTemplate.targetProfessions.map((prof, index) => (
                        <span key={index} className="px-3 py-1 bg-blue-100 text-blue-700 text-sm rounded-full">
                          {prof}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div>
                    <h5 className="font-medium text-gray-900 mb-2">Normativas Aplicables</h5>
                    <div className="flex flex-wrap gap-2">
                      {selectedTemplate.normativeCompliance.map((norm, index) => (
                        <span key={index} className="px-3 py-1 bg-purple-100 text-purple-700 text-sm rounded-full">
                          📖 {norm}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div>
                    <h5 className="font-medium text-gray-900 mb-2">Etiquetas</h5>
                    <div className="flex flex-wrap gap-2">
                      {selectedTemplate.tags.map((tag, index) => (
                        <span key={index} className="px-3 py-1 bg-gray-100 text-gray-700 text-sm rounded-full">
                          #{tag}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Estadísticas */}
                <div className="space-y-4">
                  <div className="bg-gray-50 rounded-xl p-4">
                    <h5 className="font-medium text-gray-900 mb-3">Estadísticas</h5>
                    <div className="space-y-3">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Uso Global:</span>
                        <span className="font-medium">{selectedTemplate.globalUsageCount.toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Uso País:</span>
                        <span className="font-medium">{selectedTemplate.usageCount.toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Calificación:</span>
                        <span className="flex items-center gap-1">
                          <StarSolidIcon className="h-4 w-4 text-yellow-400" />
                          <span className="font-medium">{selectedTemplate.averageRating}</span>
                          <span className="text-gray-500">({selectedTemplate.ratingCount})</span>
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Crecimiento:</span>
                        <span className="font-medium text-green-600">+{selectedTemplate.growthRate}%</span>
                      </div>
                    </div>
                  </div>

                  <div className="bg-gray-50 rounded-xl p-4">
                    <h5 className="font-medium text-gray-900 mb-3">Información</h5>
                    <div className="space-y-2 text-sm text-gray-600">
                      <div>
                        <span className="font-medium">Creado por:</span><br />
                        {selectedTemplate.createdByName}
                      </div>
                      <div>
                        <span className="font-medium">País:</span><br />
                        {selectedTemplate.country}
                      </div>
                      <div>
                        <span className="font-medium">Complejidad:</span><br />
                        <span className={`px-2 py-1 rounded-full text-xs ${
                          selectedTemplate.complexity === 'basic' ? 'bg-green-100 text-green-700' :
                          selectedTemplate.complexity === 'intermediate' ? 'bg-yellow-100 text-yellow-700' :
                          'bg-red-100 text-red-700'
                        }`}>
                          {selectedTemplate.complexity === 'basic' ? '🟢 Básico' :
                           selectedTemplate.complexity === 'intermediate' ? '🟡 Intermedio' : '🔴 Avanzado'}
                        </span>
                      </div>
                      <div>
                        <span className="font-medium">Creado:</span><br />
                        {new Date(selectedTemplate.createdAt).toLocaleDateString("es-EC")}
                      </div>
                      <div>
                        <span className="font-medium">Último uso:</span><br />
                        {new Date(selectedTemplate.lastUsed).toLocaleDateString("es-EC")}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="border-t border-gray-200 p-6 flex justify-end gap-3">
              <button
                onClick={() => setShowTemplateModal(false)}
                className="px-6 py-2 border border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 transition-colors"
              >
                Cerrar
              </button>
              <button
                onClick={() => {
                  handleAddToMyTemplates(selectedTemplate.id);
                  setShowTemplateModal(false);
                }}
                className="px-6 py-2 bg-gradient-to-r from-primary-600 to-secondary-500 text-white rounded-xl hover:from-primary-700 hover:to-secondary-600 transition-colors flex items-center gap-2"
              >
                <BookmarkIcon className="h-4 w-4" />
                Agregar a Mis Plantillas
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal para compartir plantilla de equipo */}
      {showShareTeamModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl">
            <div className="border-b border-gray-200 p-6">
              <div className="flex items-center justify-between">
                <h3 className="text-xl font-semibold text-gray-900">
                  Compartir Plantilla con el Equipo
                </h3>
                <button
                  onClick={() => setShowShareTeamModal(false)}
                  className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                >
                  <XMarkIcon className="h-5 w-5 text-gray-500" />
                </button>
              </div>
            </div>

            <div className="p-6">
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Seleccionar Plantilla Personal
                  </label>
                  <select className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500">
                    <option>Cálculo de Zapatas Corridas</option>
                    <option>Análisis de Cargas Verticales</option>
                    <option>Diseño de Vigas Principales</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Nombre para el Equipo
                  </label>
                  <input
                    type="text"
                    placeholder="Estándar Corporativo - Zapatas..."
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Descripción Interna
                  </label>
                  <textarea
                    rows={3}
                    placeholder="Describe cómo debe usarse esta plantilla en la empresa..."
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Permisos de Uso
                  </label>
                  <div className="space-y-2">
                    <label className="flex items-center">
                      <input type="checkbox" className="h-4 w-4 text-primary-600" defaultChecked />
                      <span className="ml-3 text-sm text-gray-700">Permitir visualización a todo el equipo</span>
                    </label>
                    <label className="flex items-center">
                      <input type="checkbox" className="h-4 w-4 text-primary-600" />
                      <span className="ml-3 text-sm text-gray-700">Permitir edición a ingenieros senior</span>
                    </label>
                    <label className="flex items-center">
                      <input type="checkbox" className="h-4 w-4 text-primary-600" />
                      <span className="ml-3 text-sm text-gray-700">Permitir compartir externamente</span>
                    </label>
                  </div>
                </div>
              </div>
            </div>

            <div className="border-t border-gray-200 p-6 flex justify-end gap-3">
              <button
                onClick={() => setShowShareTeamModal(false)}
                className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Cancelar
              </button>
              <button className="px-6 py-2 bg-gradient-to-r from-purple-600 to-pink-500 text-white rounded-lg hover:from-purple-700 hover:to-pink-600 transition-colors">
                Compartir con Equipo
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Estilos adicionales */}
      <style>{`
        .line-clamp-2 {
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
        
        .line-clamp-3 {
          display: -webkit-box;
          -webkit-line-clamp: 3;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
      `}</style>
    </div>
  );
};

export default Collaboration;