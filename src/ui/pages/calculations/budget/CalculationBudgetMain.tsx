// src/ui/pages/calculations/budget/CalculationBudgetMain.tsx

import React, { useState, useRef, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import {
  CurrencyDollarIcon,
  DocumentTextIcon,
  ChartBarIcon,
  Cog6ToothIcon,
  ArrowTrendingUpIcon,
  PlusIcon,
  ClockIcon,
  SparklesIcon,
  BeakerIcon,
  DocumentDuplicateIcon,
  ArrowTopRightOnSquareIcon
} from "@heroicons/react/24/outline";

// Secciones principales mejoradas para presupuestos
const MAIN_SECTIONS = [
  {
    id: "generator",
    title: "Generador de Presupuestos",
    description: "Crea presupuestos profesionales desde cálculos técnicos",
    route: "/calculations/budget/generator",
    color: "from-emerald-500 to-emerald-600",
    bgColor: "bg-emerald-50",
    borderColor: "border-emerald-200",
    textColor: "text-emerald-700",
    icon: DocumentTextIcon,
    badge: "Crear",
    isMain: true,
  },
  {
    id: "templates",
    title: "Plantillas de Presupuesto",
    description: "Gestiona tus plantillas empresariales y personales",
    route: "/calculations/budget/templates",
    color: "from-blue-500 to-blue-600",
    bgColor: "bg-blue-50",
    borderColor: "border-blue-200",
    textColor: "text-blue-700",
    icon: DocumentDuplicateIcon,
    badge: "Gestionar",
    isMain: true,
  },
  {
    id: "comparison",
    title: "Comparación de Presupuestos",
    description: "Analiza diferencias entre versiones y alternativas",
    route: "/calculations/budget/comparison",
    color: "from-purple-500 to-purple-600",
    bgColor: "bg-purple-50",
    borderColor: "border-purple-200",
    textColor: "text-purple-700",
    icon: ChartBarIcon,
    badge: "Analizar",
    isMain: true,
  },
  {
    id: "history",
    title: "Historial de Presupuestos",
    description: "Revisa, edita y gestiona presupuestos anteriores",
    route: "/calculations/budget/history",
    color: "from-amber-500 to-amber-600",
    bgColor: "bg-amber-50",
    borderColor: "border-amber-200",
    textColor: "text-amber-700",
    icon: ClockIcon,
    badge: "Historial",
    isMain: false,
  },
  {
    id: "export",
    title: "Centro de Exportación",
    description: "Genera documentos profesionales con tu marca",
    route: "/calculations/budget/export",
    color: "from-indigo-500 to-indigo-600",
    bgColor: "bg-indigo-50",
    borderColor: "border-indigo-200",
    textColor: "text-indigo-700",
    icon: ArrowTopRightOnSquareIcon,
    badge: "Exportar",
    isMain: false,
  },
  {
    id: "settings",
    title: "Configuración",
    description: "Personaliza plantillas, marca y configuraciones regionales",
    route: "/calculations/budget/settings",
    color: "from-gray-500 to-gray-600",
    bgColor: "bg-gray-50",
    borderColor: "border-gray-200",
    textColor: "text-gray-700",
    icon: Cog6ToothIcon,
    badge: "Ajustes",
    isMain: false,
  },
];

// Estadísticas rápidas para presupuestos
const QUICK_STATS = [
  {
    label: "Presupuestos Este Mes",
    value: "47",
    change: "+23",
    icon: DocumentTextIcon,
    color: "from-emerald-500 to-emerald-600",
  },
  {
    label: "Plantillas Activas",
    value: "12",
    change: "+3",
    icon: DocumentDuplicateIcon,
    color: "from-blue-500 to-blue-600",
  },
  {
    label: "Exportaciones",
    value: "156",
    change: "+28",
    icon: ArrowTopRightOnSquareIcon,
    color: "from-purple-500 to-purple-600",
  },
  {
    label: "Ahorro de Tiempo",
    value: "18h",
    change: "+5h",
    icon: ClockIcon,
    color: "from-amber-500 to-amber-600",
  },
];

// Actividad reciente relacionada con presupuestos
const RECENT_ACTIVITY = [
  {
    id: 1,
    type: "budget_created",
    title: "Presupuesto Casa Familiar 180m²",
    user: "Arq. María González",
    time: "Hace 15 minutos",
    icon: DocumentTextIcon,
    color: "text-emerald-600",
    action: "Creó presupuesto desde",
    detail: "Cálculo de Materiales H21"
  },
  {
    id: 2,
    type: "template_used",
    title: "Plantilla Residencial Sierra",
    user: "Ing. Carlos Ruiz",
    time: "Hace 1 hora",
    icon: DocumentDuplicateIcon,
    color: "text-blue-600",
    action: "Aplicó plantilla para",
    detail: "Proyecto Villa Los Eucaliptos"
  },
  {
    id: 3,
    type: "export_generated",
    title: "Exportación PDF Completada",
    user: "Constructora ABC",
    time: "Hace 2 horas",
    icon: ArrowTopRightOnSquareIcon,
    color: "text-purple-600",
    action: "Generó documento para",
    detail: "Cliente: Inmobiliaria Torres"
  },
  {
    id: 4,
    type: "comparison_created",
    title: "Comparación de 3 Alternativas",
    user: "Arq. Ana Morales",
    time: "Hace 3 horas",
    icon: ChartBarIcon,
    color: "text-indigo-600",
    action: "Analizó diferencias en",
    detail: "Centro Comercial Norte"
  },
];

const CalculationBudgetMain: React.FC = () => {
  const navigate = useNavigate();
  const [selectedSection, setSelectedSection] = useState<string | null>(null);
  const [isDesktop, setIsDesktop] = useState(false);
  const [headerHeight, setHeaderHeight] = useState(0);
  const secondSectionRef = useRef<HTMLDivElement>(null);

  const handleSectionClick = (route: string, sectionId: string) => {
    setSelectedSection(sectionId);
    setTimeout(() => {
      navigate(route);
    }, 150);
  };

  const scrollToNextSection = () => {
    secondSectionRef.current?.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
  };

  // Detectar tamaño de pantalla y altura del header
  useEffect(() => {
    const checkScreenSize = () => {
      setIsDesktop(window.innerWidth >= 1024);
    };

    const header = document.querySelector("header");
    if (header) {
      setHeaderHeight(header.offsetHeight);
    }

    checkScreenSize();
    window.addEventListener("resize", checkScreenSize);
    return () => window.removeEventListener("resize", checkScreenSize);
  }, []);

  // Componente del header principal
  const renderHeader = () => (
    <div className="text-center mb-8 lg:mb-12">
      <div className="flex justify-center mb-6">
        <div className="relative">
          <div className="w-20 h-20 lg:w-24 lg:h-24 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-3xl flex items-center justify-center shadow-2xl">
            <CurrencyDollarIcon className="h-10 w-10 lg:h-12 lg:w-12 text-white" />
          </div>
          <div className="absolute -top-1 -right-1 w-6 h-6 bg-gradient-to-br from-amber-400 to-amber-500 rounded-full flex items-center justify-center">
            <SparklesIcon className="h-3 w-3 text-white" />
          </div>
        </div>
      </div>

      <h1 className="text-3xl lg:text-5xl font-bold text-gray-900 mb-4 lg:mb-6">
        Presupuestos
        <span className="block text-xl lg:text-3xl font-normal text-emerald-600 mt-2">
          Inteligentes
        </span>
      </h1>

      <p className="text-lg lg:text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
        Transforma tus cálculos técnicos en{" "}
        <span className="font-semibold text-emerald-600">presupuestos profesionales</span>{" "}
        con precisión, rapidez y presentación impecable para tus clientes
      </p>

      <div className="mt-6 lg:mt-8 flex flex-col sm:flex-row gap-4 justify-center">
        <button
          onClick={() => navigate("/calculations/budget/generator")}
          className="px-8 py-4 bg-gradient-to-r from-emerald-600 to-emerald-700 text-white font-semibold rounded-2xl hover:from-emerald-700 hover:to-emerald-800 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105"
        >
          <div className="flex items-center gap-3">
            <PlusIcon className="h-5 w-5" />
            Crear Presupuesto
          </div>
        </button>

        <Link
          to="/calculations"
          className="px-8 py-4 bg-white text-emerald-700 font-semibold rounded-2xl border-2 border-emerald-200 hover:border-emerald-300 hover:bg-emerald-50 transition-all duration-300"
        >
          <div className="flex items-center gap-3">
            <BeakerIcon className="h-5 w-5" />
            Hacer Cálculo Primero
          </div>
        </Link>
      </div>
    </div>
  );

  // Componente de estadísticas rápidas
  const renderQuickStats = () => (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6 mb-8 lg:mb-16">
      {QUICK_STATS.map((stat, index) => (
        <div
          key={index}
          className="bg-white rounded-2xl border border-gray-200 p-4 lg:p-6 hover:shadow-lg transition-all duration-300 hover:border-gray-300"
        >
          <div className="flex items-center gap-3 mb-3">
            <div className={`w-10 h-10 lg:w-12 lg:h-12 bg-gradient-to-br ${stat.color} rounded-xl flex items-center justify-center shadow-md`}>
              <stat.icon className="h-5 w-5 lg:h-6 lg:w-6 text-white" />
            </div>
          </div>

          <div className="space-y-1">
            <div className="text-2xl lg:text-3xl font-bold text-gray-900">
              {stat.value}
            </div>
            <div className="text-xs lg:text-sm font-medium text-gray-600">
              {stat.label}
            </div>
            <div className="text-xs text-emerald-600 font-medium">
              {stat.change} vs mes anterior
            </div>
          </div>
        </div>
      ))}
    </div>
  );

  // Componente de secciones principales
  const renderMainSections = () => (
    <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6 lg:gap-8 mb-8 lg:mb-0">
      {MAIN_SECTIONS.map((section) => (
        <div
          key={section.id}
          onClick={() => handleSectionClick(section.route, section.id)}
          className={`
            relative group cursor-pointer transition-all duration-300 transform hover:scale-105
            ${selectedSection === section.id ? "scale-105" : ""}
            ${section.isMain ? "lg:col-span-1" : "lg:col-span-1"}
          `}
        >
          <div className={`
            h-full bg-white rounded-3xl border-2 ${section.borderColor} p-6 lg:p-8
            group-hover:shadow-2xl group-hover:border-opacity-60 transition-all duration-300
            ${selectedSection === section.id ? "shadow-2xl border-opacity-60" : "shadow-lg"}
          `}>
            <div className="flex items-start justify-between mb-6">
              <div className={`
                w-14 h-14 lg:w-16 lg:h-16 bg-gradient-to-br ${section.color} rounded-2xl 
                flex items-center justify-center shadow-lg group-hover:shadow-xl transition-all duration-300
              `}>
                <section.icon className="h-7 w-7 lg:h-8 lg:w-8 text-white" />
              </div>

              <div className={`
                px-3 py-1 ${section.bgColor} ${section.textColor} text-xs font-semibold 
                rounded-full border ${section.borderColor}
              `}>
                {section.badge}
              </div>
            </div>

            <h3 className="text-xl lg:text-2xl font-bold text-gray-900 mb-3 group-hover:text-gray-800 transition-colors">
              {section.title}
            </h3>

            <p className="text-gray-600 leading-relaxed mb-6 group-hover:text-gray-700 transition-colors">
              {section.description}
            </p>

            <div className="flex items-center text-sm font-medium">
              <span className={`${section.textColor} group-hover:text-opacity-80 transition-all`}>
                Explorar {section.badge.toLowerCase()}
              </span>
              <ArrowTrendingUpIcon className={`h-4 w-4 ml-2 ${section.textColor} group-hover:translate-x-1 transition-transform`} />
            </div>
          </div>
        </div>
      ))}
    </div>
  );

  // Componente de actividad reciente
  const renderRecentActivity = () => (
    <div className="bg-white rounded-3xl border border-gray-200 p-6 lg:p-8 shadow-lg">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xl lg:text-2xl font-bold text-gray-900">
          Actividad Reciente
        </h3>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 bg-emerald-500 rounded-full animate-pulse"></div>
          <span className="text-sm text-gray-500">En vivo</span>
        </div>
      </div>

      <div className="space-y-4">
        {RECENT_ACTIVITY.map((activity) => (
          <div
            key={activity.id}
            className="flex items-start gap-4 p-4 hover:bg-gray-50 rounded-xl transition-colors"
          >
            <div
              className={`w-8 h-8 lg:w-10 lg:h-10 ${activity.color} bg-opacity-10 rounded-lg flex items-center justify-center`}
            >
              <activity.icon
                className={`h-4 w-4 lg:h-5 lg:w-5 ${activity.color}`}
              />
            </div>
            <div className="flex-1">
              <div className="font-medium text-gray-900 text-sm lg:text-base">
                {activity.title}
              </div>
              <div className="text-xs lg:text-sm text-gray-600">
                <span className="font-medium">{activity.user}</span> {activity.action}
                {activity.detail && (
                  <span className="text-emerald-600 font-medium"> {activity.detail}</span>
                )}
              </div>
              <div className="text-xs text-gray-500 mt-1">
                {activity.time}
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-4 lg:mt-6 text-center">
        <Link
          to="/calculations/budget/history"
          className="text-emerald-600 hover:text-emerald-700 font-medium text-sm hover:underline"
        >
          Ver todo el historial →
        </Link>
      </div>
    </div>
  );

  // Layout responsivo: Desktop con scroll snap, Mobile con scroll normal
  if (isDesktop) {
    // DESKTOP: Layout con scroll snap
    return (
      <div className="bg-gradient-to-br from-gray-50 to-emerald-50">
        {/* Contenedor con scroll snap SOLO en desktop */}
        <div
          className="desktop-snap-container"
          style={{
            height: `calc(100vh - ${headerHeight}px)`,
            overflowY: "auto",
            scrollSnapType: "y mandatory",
            scrollBehavior: "smooth",
          }}
        >
          {/* Primera sección */}
          <div
            className="flex flex-col justify-center items-center relative mx-auto px-4 sm:px-6 lg:px-8"
            style={{
              height: `calc(100vh - ${headerHeight}px)`,
              maxWidth: "80rem",
              scrollSnapAlign: "start",
            }}
          >
            <div className="flex flex-col justify-center items-center h-full">
              {renderHeader()}
              {renderQuickStats()}
            </div>

            {/* Flecha animada */}
            <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2">
              <button
                onClick={scrollToNextSection}
                className="p-3 bg-white/80 backdrop-blur-sm rounded-full shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-110 bounce-animation"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth="1.5"
                  stroke="currentColor"
                  className="size-6"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="m19.5 8.25-7.5 7.5-7.5-7.5"
                  />
                </svg>
              </button>
            </div>
          </div>

          {/* Segunda sección */}
          <div
            ref={secondSectionRef}
            className="flex justify-center items-center relative mx-auto px-4 sm:px-6 lg:px-8"
            style={{
              height: `calc(100vh - ${headerHeight}px)`,
              maxWidth: "90rem",
              scrollSnapAlign: "start",
            }}
          >
            <div className="flex justify-center m-auto w-full gap-8">
              <div className="flex-1 max-w-4xl">
                {renderMainSections()}
              </div>
              <div className="w-80 flex-shrink-0">
                {renderRecentActivity()}
              </div>
            </div>
          </div>
        </div>

        {/* CSS solo para desktop */}
        <style>{`
          @keyframes bounce {
            0%, 20%, 53%, 80%, 100% {
              transform: translate3d(0, 0, 0);
            }
            40%, 43% {
              transform: translate3d(0, -10px, 0);
            }
            70% {
              transform: translate3d(0, -5px, 0);
            }
            90% {
              transform: translate3d(0, -2px, 0);
            }
          }

          .bounce-animation {
            animation: bounce 2s infinite;
          }

          /* Prevenir scroll horizontal */
          body {
            overflow-x: hidden;
          }
        `}</style>
      </div>
    );
  }

  // MOBILE: Layout normal sin scroll snap
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-emerald-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Layout en columna para móvil */}
        <div className="space-y-8">
          {renderHeader()}
          {renderQuickStats()}
          <div className="grid grid-cols-1 gap-8">
            {renderMainSections()}
            {renderRecentActivity()}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CalculationBudgetMain;