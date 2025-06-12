import {lazy} from "react";
import type {RouteObject} from "react-router";

const MainLayout = lazy(() => import("../pages/layouts/MainLayout"));
const HomePage = lazy(() => import("../pages/HomePage"));
const NotFoundPage = lazy(() => import("../pages/NotFoundPage"));
const LoginPage = lazy(() => import("../pages/auth/LoginPage"));
const RegisterPage = lazy(() => import("../pages/auth/RegisterPage"));
const ForgotPasswordPage = lazy(
	() => import("../pages/auth/ForgotPasswordPage")
);
const ResetPasswordPage = lazy(() => import("../pages/auth/ResetPasswordPage"));
const EmailVerificationPage = lazy(
	() => import("../pages/auth/EmailVerificationPage")
);
const ChangePasswordPage = lazy(
	() => import("../pages/auth/ChangePasswordPage")
);
const ProfilePage = lazy(() => import("../pages/profile/ProfilePage"));
const PersonalInfoPage = lazy(
	() => import("../pages/profile/PersonalInfoPage")
);
const SecurityPage = lazy(() => import("../pages/profile/SecurityPage"));
const SubscriptionPage = lazy(
	() => import("../pages/profile/SubscriptionPage")
);
const PreferencesPage = lazy(() => import("../pages/profile/PreferencesPage"));
const NotificationsPage = lazy(
	() => import("../pages/profile/NotificationsPage")
);
const ProfessionalInfoPage = lazy(
	() => import("../pages/profile/ProfessionalInfoPage")
);
const RecommendationsPage = lazy(
	() => import("../pages/profile/RecommendationsPage")
);
const MainNotificationsPage = lazy(() => import("../pages/NotificationsPage"));
const TwoFactorAuthPage = lazy(() => import("../pages/auth/TwoFactorAuthPage"));
const CreateProjectPage = lazy(
	() => import("../pages/projects/CreateProjectPage")
);
const EditProjectPage = lazy(() => import("../pages/projects/EditProjectPage"));
const ProjectDetailsPage = lazy(
	() => import("../pages/projects/ProjectDetailsPage")
);
const ProjectsPage = lazy(() => import("../pages/projects/ProjectsPage"));
const ProjectDashboardPage = lazy(
	() => import("../pages/projects/ProjectDashboardPage")
);
const Dashboard = lazy(() => import("../pages/Dashboard"));
const SettingsOverviewPage = lazy(
	() => import("../pages/profile/SettingsOverviewPage")
);
const ProjectTemplatesPage = lazy(
	() => import("../pages/projects/templates/ProjectTemplatesPage")
);
const MyTemplates = lazy(
	() => import("../pages/calculations/templates/MyTemplates")
);
const SuggestTemplateChange = lazy(
	() => import("../pages/calculations/templates/SuggestTemplateChange")
);

const TemplateEditor = lazy(
	() => import("../pages/calculations/templates/TemplateEditor")
);

const CalculationsHub = lazy(
	() => import("../pages/calculations/core/CalculationsHub")
);
const CalculationsRouter = lazy(
	() => import("../pages/calculations/core/CalculationsRouter")
);
// Catalog Components
const CatalogMain = lazy(
	() => import("../pages/calculations/catalog/CatalogMain")
);
const CalculationInterface = lazy(
	() => import("../pages/calculations/catalog/CalculationInterface")
);
// Comparison Components
const CalculationComparison = lazy(
	() => import("../pages/calculations/comparison/CalculationComparison")
);
const SavedCalculations = lazy(
	() => import("../pages/calculations/comparison/SavedCalculations")
);
// Collaboration Components
const CollaborationHub = lazy(
	() => import("../pages/calculations/collaboration/CollaborationHub")
);
const CollaborationWorkspace = lazy(
	() => import("../pages/calculations/collaboration/CollaborationWorkspace")
);
const TrendingCalculations = lazy(
	() => import("../pages/calculations/collaboration/TrendingCalculations")
);
const ProposedVoting = lazy(
	() => import("../pages/calculations/collaboration/ProposedVoting")
);

// Settings
const CalculationsSettings = lazy(
	() => import("../pages/calculations/CalculationsSettings")
);

// Calculation Materials
const MaterialCalculationsRouter = lazy(()=>import("../pages/calculations/materials/MaterialCalculationsRouter"));

// Calculation Budget
const CalculationBudgetRouter = lazy(()=>import("../pages/calculations/budget/CalculationBudgetRouter"));

const appRoutes: RouteObject[] = [
	//Public Routes
	{
		path: "/",
		element: <MainLayout />,
		children: [
			{
				index: true,
				element: <HomePage />,
			},

			//Auth Routes
			{
				path: "login",
				element: (
					// <AuthRoute>
					<LoginPage />
					//</AuthRoute>
				),
			},
			{
				path: "register",
				element: (
					//<AuthRoute>
					<RegisterPage />
					//</AuthRoute>
				),
			},
			{
				path: "forgot-password",
				element: <ForgotPasswordPage />,
			},
			{
				path: "reset-password/:token",
				element: <ResetPasswordPage />,
			},
			{
				path: "verify-email/:token",
				element: <EmailVerificationPage />,
			},
			{
				path: "profile/change-password",
				element: (
					// <ProtectedRoute>
					<ChangePasswordPage />
					//</ProtectedRoute>
				),
			},
			{
				path: "/profile",
				element: (
					//<ProtectedRoute>
					<ProfilePage />
					//</ProtectedRoute>
				),
				children: [
					{
						index: true,
						element: <PersonalInfoPage />,
					},
					{
						path: "personal",
						element: <PersonalInfoPage />,
					},
					{
						path: "security",
						element: <SecurityPage />,
					},
					{
						path: "subscription",
						element: <SubscriptionPage />,
					},
					{
						path: "preferences",
						element: <PreferencesPage />,
					},
					{
						path: "notifications",
						element: <NotificationsPage />,
					},
					{
						path: "professional",
						element: <ProfessionalInfoPage />,
					},
					{
						path: "recommendations", // Added new route
						element: <RecommendationsPage />,
					},
				],
			},
			{
				path: "notifications",
				element: (
					// <ProtectedRoute>
					<MainNotificationsPage />
					//</ProtectedRoute>
				),
			},
			{
				path: "/projects",
				children: [
					{
						index: true,
						// <ProtectedRoute>
						element: <ProjectsPage />, // <ProtectedRoute>
					},
					{
						path: "my-projects",
						element: <ProjectsPage />,
					},
					{
						path: "create-new",
						element: <CreateProjectPage />,
					},
					{
						path: "edit/:id",
						element: <EditProjectPage />,
					},
					{
						path: "details/:id",
						element: <ProjectDetailsPage />,
					},
					{
						path: "dashboard/:projectId",
						element: <ProjectDashboardPage />,
					},
					{
						path: "templates",
						element: <ProjectTemplatesPage />,
					},
				],
			},
			{
				path: "/calculations",
				children: [
					// Main Hub - Entry point with 4 main sections
					{
						index: true,
						element: <CalculationsHub />,
					},

					// Alternative router (if needed for testing)
					{
						path: "router",
						element: <CalculationsRouter />,
					},

					// ==============================================
					// CATALOG SECTION - Public verified templates
					// ==============================================
					{
						path: "catalog",
						children: [
							{
								index: true,
								element: <CatalogMain />,
							},
							{
								// Ruta dinámica que captura el templateId
								path: "template/:templateId",
								element: <CalculationInterface />,
							},
							{
								// Rutas adicionales para diferentes tipos de acceso
								path: ":templateId",
								element: <CalculationInterface />,
							},
						],
					},

					// ==============================================
					// TEMPLATES SECTION - Personal templates
					// ==============================================
					{
						path: "templates",
						children: [
							{
								index: true,
								element: <MyTemplates />, // Página principal de mis plantillas
							},
							{
								path: "my-templates", // Ruta alternativa
								element: <MyTemplates />,
							},
							{
								path: "new", // Crear nueva plantilla
								element: <TemplateEditor />,
							},
							{
								path: "edit/:templateId", // Editar plantilla existente
								element: <TemplateEditor />,
							},
							{
								path: ":templateId/suggest-change", // Sugerir cambios a plantilla
								element: <SuggestTemplateChange />,
							},
							{
								path: "editor/:id?", // Ruta legacy - mantener por compatibilidad
								element: <TemplateEditor />,
							},
						],
					},

					// ==============================================
					// COMPARISON SECTION - Compare calculations
					// ==============================================
					{
						path: "comparison",
						children: [
							{
								index: true,
								element: <CalculationComparison />,
							},
							{
								path: "saved",
								element: <SavedCalculations />,
							},
						],
					},

					// ==============================================
					// COLLABORATION SECTION - Team & Community
					// ==============================================
					{
						path: "collaboration",
						children: [
							{
								index: true,
								element: <CollaborationHub />,
							},
							{
								path: "workspace/:workspaceId?",
								element: <CollaborationWorkspace />,
							},
							{
								path: "trending",
								element: <TrendingCalculations />,
							},
							{
								path: "voting",
								element: <ProposedVoting />,
							},
						],
					},

					// ==============================================
					// SETTINGS SECTION - Separated from main nav
					// ==============================================
					{
						path: "settings",
						element: <CalculationsSettings />,
					},

					// ==============================================
					// ADMIN ROUTES (Keep if needed for admin users)
					// ==============================================
					// {
					// 	path: "admin/dashboard",
					// 	element: <CalculationsDashboard />,
					// },
					{
						path: "materials/*",
						element: <MaterialCalculationsRouter />, // ← USAR ROUTER DIRECTAMENTE
					},
					{
						path: "budget/*",
						element: <CalculationBudgetRouter />, // ← USAR ROUTER DIRECTAMENTE
					},
				],
			},
			{
				path: "dashboard",
				element: (
					// <ProtectedRoute>
					<Dashboard />
					//</ProtectedRoute>
				),
			},
			{
				path: "account/settings",
				element: (
					// <ProtectedRoute>
					<SettingsOverviewPage />
					//</ProtectedRoute>
				),
			},
			{
				path: "/profile/2fa-setup",
				element: (
					//<ProtectedRoute>
					<TwoFactorAuthPage />
					//</ProtectedRoute>
				),
			},
		],
	},

	// {
	// 	path: "/seller",
	// 	element: (
	// 		// <SellerRoute>
	// 		<SellerLayout />
	// 		// </SellerRoute>
	// 	),
	// 	children: [
	// 		{
	// 			index: true,
	// 			element: <SellerDashboard />,
	// 		},
	// 		{
	// 			path: "dashboard",
	// 			element: <SellerDashboard />,
	// 		},
	// 	],
	// },

	// // Admin Dashboard Routes
	// {
	// 	path: "/admin",
	// 	element: (
	// 		// <AdminRoute>
	// 		<AdminLayout />
	// 		// </AdminRoute>
	// 	),
	// 	children: [
	// 		{
	// 			index: true,
	// 			element: <AdminDashboard />,
	// 		},
	// 	],
	// },

	// 404 Not Found
	{
		path: "*",
		element: <NotFoundPage />,
	},
];

export default appRoutes;
