// src/ui/pages/calculations/shared/types/budget.types.ts

export interface BudgetTemplate {
    id: string;
    name: string;
    description: string;
    projectType: ProjectType;
    scope: BudgetTemplateScope;
    geographicalZone: GeographicalZone;
    isVerified: boolean;
    isActive: boolean;
    wasteFactors: WasteFactors;
    laborRates: LaborRates;
    indirectCosts: IndirectCosts;
    professionalFees: ProfessionalFees;
    version: number;
    createdBy: string;
    createdAt: string;
    updatedAt: string;
    usageCount: number;
    rating: number;
    tags: string[];
  }
  
  export interface CalculationBudget {
    id: string;
    name: string;
    description?: string;
    projectId?: string;
    budgetType: BudgetType;
    status: BudgetStatus;
    calculationResultId?: string;
    budgetTemplateId?: string;
    lineItems: BudgetLineItem[];
    summary: BudgetSummary;
    configuration: BudgetConfiguration;
    versions: BudgetVersion[];
    createdBy: string;
    createdAt: string;
    updatedAt: string;
    exportSettings?: ExportSettings;
    customization?: BudgetCustomization;
  }
  
  export interface BudgetLineItem {
    id: string;
    category: string;
    subcategory?: string;
    materialId?: string;
    description: string;
    unit: string;
    quantity: number;
    unitPrice: number;
    wastePercentage: number;
    subtotal: number;
    laborCost?: number;
    totalCost: number;
    notes?: string;
    necReference?: string;
    isCustom: boolean;
    source: 'calculation' | 'template' | 'manual';
  }
  
  export interface BudgetSummary {
    materialsTotal: number;
    laborTotal: number;
    indirectCostsTotal: number;
    professionalFeesTotal: number;
    contingencyTotal: number;
    taxTotal: number;
    subtotal: number;
    grandTotal: number;
    currency: string;
    exchangeRate?: number;
  }
  
  export interface BudgetConfiguration {
    includeLabor: boolean;
    includeProfessionalFees: boolean;
    includeIndirectCosts: boolean;
    contingencyPercentage: number;
    taxPercentage: number;
    geographicalZone: GeographicalZone;
    currency: string;
    exchangeRate?: number;
    customMaterials: CustomMaterial[];
    customLaborCosts: CustomLaborCost[];
  }
  
  export interface WasteFactors {
    general: number;
    concrete: number;
    steel: number;
    masonry: number;
    electrical: number;
    plumbing: number;
    finishes: number;
    [key: string]: number;
  }
  
  export interface LaborRates {
    architect: number;
    civilEngineer: number;
    masterBuilder: number;
    electrician: number;
    plumber: number;
    painter: number;
    helper: number;
    [key: string]: number;
  }
  
  export interface IndirectCosts {
    equipment: number;
    transportation: number;
    administration: number;
    permits: number;
    utilities: number;
    insurance: number;
    [key: string]: number;
  }
  
  export interface ProfessionalFees {
    designPercentage: number;
    supervisionPercentage: number;
    managementPercentage: number;
    consultingHourlyRate: number;
    minimumFee: number;
    complexityMultiplier: number;
  }
  
  export interface CustomMaterial {
    materialId?: string;
    description: string;
    unit: string;
    quantity: number;
    unitPrice: number;
    category?: string;
  }
  
  export interface CustomLaborCost {
    type: string;
    description: string;
    quantity: number;
    rate: number;
    unit: string;
  }
  
  export interface BudgetVersion {
    id: string;
    version: number;
    name: string;
    description?: string;
    changes: VersionChange[];
    summary: BudgetSummary;
    createdAt: string;
    createdBy: string;
  }
  
  export interface VersionChange {
    type: 'addition' | 'modification' | 'deletion';
    category: string;
    field: string;
    oldValue?: any;
    newValue?: any;
    reason?: string;
  }
  
  export interface ExportSettings {
    format: ExportFormat;
    branding: BrandingSettings;
    clientInfo: ClientInfo;
    documentSettings: DocumentSettings;
    delivery: DeliverySettings;
  }
  
  export interface BrandingSettings {
    companyName: string;
    companyLogo?: string;
    professionalName: string;
    professionalTitle: string;
    professionalRegistration?: string;
    contactInfo: ContactInfo;
    colors: BrandColors;
  }
  
  export interface ContactInfo {
    phone: string;
    email: string;
    address: string;
    website?: string;
  }
  
  export interface BrandColors {
    primary: string;
    secondary: string;
    accent: string;
  }
  
  export interface ClientInfo {
    name: string;
    company?: string;
    address?: string;
    phone?: string;
    email?: string;
    ruc?: string;
  }
  
  export interface DocumentSettings {
    includeCalculationDetails: boolean;
    includeMaterialSpecs: boolean;
    includeNECReferences: boolean;
    showPriceBreakdown: boolean;
    showLaborDetails: boolean;
    includeTermsAndConditions: boolean;
    includeValidityPeriod: boolean;
    validityDays: number;
    language: 'es' | 'en';
    currency: string;
  }
  
  export interface DeliverySettings {
    sendByEmail: boolean;
    recipientEmails: string[];
    emailSubject?: string;
    emailMessage?: string;
    generateDownloadLink: boolean;
  }
  
  export interface BudgetCustomization {
    headerText?: string;
    footerText?: string;
    customSections: CustomSection[];
    categoryOrder: string[];
    hiddenCategories: string[];
    customFormulas: CustomFormula[];
  }
  
  export interface CustomSection {
    id: string;
    title: string;
    content: string;
    position: number;
    visible: boolean;
  }
  
  export interface CustomFormula {
    field: string;
    formula: string;
    description: string;
  }
  
  export interface BudgetComparison {
    id: string;
    name: string;
    budgets: string[]; // Array de budget IDs
    type: ComparisonType;
    analysis: ComparisonAnalysis;
    recommendations: string[];
    createdAt: string;
    createdBy: string;
  }
  
  export interface ComparisonAnalysis {
    costDifferences: CostDifference[];
    materialVariations: MaterialVariation[];
    laborVariations: LaborVariation[];
    totalVariance: number;
    significantChanges: SignificantChange[];
  }
  
  export interface CostDifference {
    category: string;
    differences: { budgetId: string; value: number; percentage: number }[];
  }
  
  export interface MaterialVariation {
    materialId: string;
    description: string;
    variations: { budgetId: string; quantity: number; cost: number }[];
  }
  
  export interface LaborVariation {
    type: string;
    variations: { budgetId: string; hours: number; cost: number }[];
  }
  
  export interface SignificantChange {
    type: 'cost_increase' | 'cost_decrease' | 'quantity_change' | 'new_item' | 'removed_item';
    category: string;
    description: string;
    impact: number;
    recommendation?: string;
  }
  
  // Enums
  export enum ProjectType {
    RESIDENTIAL_SINGLE = 'RESIDENTIAL_SINGLE',
    RESIDENTIAL_MULTI = 'RESIDENTIAL_MULTI',
    COMMERCIAL_SMALL = 'COMMERCIAL_SMALL',
    COMMERCIAL_LARGE = 'COMMERCIAL_LARGE',
    INDUSTRIAL = 'INDUSTRIAL',
    INFRASTRUCTURE = 'INFRASTRUCTURE',
    RENOVATION = 'RENOVATION',
    SPECIALIZED = 'SPECIALIZED'
  }
  
  export enum BudgetTemplateScope {
    SYSTEM = 'SYSTEM',
    COMPANY = 'COMPANY',
    PERSONAL = 'PERSONAL',
    SHARED = 'SHARED'
  }
  
  export enum GeographicalZone {
    QUITO = 'QUITO',
    GUAYAQUIL = 'GUAYAQUIL',
    CUENCA = 'CUENCA',
    COSTA = 'COSTA',
    SIERRA = 'SIERRA',
    ORIENTE = 'ORIENTE',
    INSULAR = 'INSULAR'
  }
  
  export enum BudgetType {
    MATERIALS_ONLY = 'materials_only',
    COMPLETE_PROJECT = 'complete_project',
    LABOR_MATERIALS = 'labor_materials',
    PROFESSIONAL_ESTIMATE = 'professional_estimate'
  }
  
  export enum BudgetStatus {
    DRAFT = 'draft',
    REVIEW = 'review',
    APPROVED = 'approved',
    REVISED = 'revised',
    FINAL = 'final',
    ARCHIVED = 'archived'
  }
  
  export enum ExportFormat {
    PDF = 'PDF',
    EXCEL = 'EXCEL',
    WORD = 'WORD',
    HTML = 'HTML'
  }
  
  export enum ComparisonType {
    VERSION_COMPARISON = 'version_comparison',
    TEMPLATE_COMPARISON = 'template_comparison',
    PROJECT_COMPARISON = 'project_comparison'
  }
  
  // Request/Response types
  export interface CreateBudgetRequest {
    name: string;
    description?: string;
    projectId?: string;
    budgetType: BudgetType;
    calculationResultId?: string;
    budgetTemplateId?: string;
    configuration: Partial<BudgetConfiguration>;
  }
  
  export interface UpdateBudgetRequest {
    name?: string;
    description?: string;
    configuration?: Partial<BudgetConfiguration>;
    customization?: Partial<BudgetCustomization>;
    exportSettings?: Partial<ExportSettings>;
  }
  
  export interface GenerateBudgetDocumentRequest {
    format: ExportFormat;
    branding?: Partial<BrandingSettings>;
    clientInfo?: Partial<ClientInfo>;
    documentSettings?: Partial<DocumentSettings>;
    delivery?: Partial<DeliverySettings>;
  }
  
  export interface BudgetFilters {
    projectId?: string;
    status?: BudgetStatus;
    budgetType?: BudgetType;
    dateFrom?: string;
    dateTo?: string;
    searchTerm?: string;
  }
  
  export interface BudgetTemplateFilters {
    projectType?: ProjectType;
    geographicalZone?: GeographicalZone;
    scope?: BudgetTemplateScope;
    verified?: boolean;
    searchTerm?: string;
  }
  
  // API Response types
  export interface BudgetListResponse {
    budgets: CalculationBudget[];
    pagination: {
      page: number;
      limit: number;
      total: number;
      pages: number;
    };
  }
  
  export interface BudgetTemplateListResponse {
    templates: BudgetTemplate[];
    pagination: {
      page: number;
      limit: number;
      total: number;
      pages: number;
    };
  }
  
  export interface BudgetRecommendationResponse {
    templates: BudgetTemplate[];
    reasons: string[];
    confidence: number;
  }
  
  // Component Props types
  export interface BudgetGeneratorProps {
    calculationResultId?: string;
    projectId?: string;
    onBudgetCreated?: (budget: CalculationBudget) => void;
  }
  
  export interface BudgetTemplateSourceProps {
    templates: BudgetTemplate[];
    selectedTemplate?: BudgetTemplate;
    onTemplateSelect: (template: BudgetTemplate) => void;
    loading?: boolean;
    filters?: BudgetTemplateFilters;
    onFiltersChange?: (filters: BudgetTemplateFilters) => void;
  }
  
  export interface BudgetLineItemEditorProps {
    lineItem: BudgetLineItem;
    onUpdate: (lineItem: BudgetLineItem) => void;
    onDelete: (id: string) => void;
    readonly?: boolean;
  }
  
  export interface BudgetExportOptionsProps {
    budget: CalculationBudget;
    onExport: (request: GenerateBudgetDocumentRequest) => void;
    loading?: boolean;
  }