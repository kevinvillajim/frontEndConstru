import {lazy} from "react";
import type { RouteObject } from "react-router";

const MainLayout = lazy(() => import("../pages/layouts/MainLayout"));
const HomePage = lazy(() => import("../pages/HomePage"));
const NotFoundPage = lazy(() => import("../pages/NotFoundPage"));
const LoginPage = lazy(() => import("../pages/auth/LoginPage"));
const RegisterPage = lazy(() => import("../pages/auth/RegisterPage"));
const ForgotPasswordPage = lazy(() => import("../pages/auth/ForgotPasswordPage"));
const ResetPasswordPage = lazy(() => import("../pages/auth/ResetPasswordPage"));
const EmailVerificationPage = lazy(() => import("../pages/auth/EmailVerificationPage"));
const ChangePasswordPage = lazy(() => import("../pages/auth/ChangePasswordPage"));
const ProfilePage = lazy(() => import("../pages/profile/ProfilePage"));
const PersonalInfoPage = lazy(() => import("../pages/profile/PersonalInfoPage"));
const SecurityPage = lazy(() => import("../pages/profile/SecurityPage"));
const SubscriptionPage = lazy(() => import("../pages/profile/SubscriptionPage"));
const PreferencesPage = lazy(() => import("../pages/profile/PreferencesPage"));
const NotificationsPage = lazy(() => import("../pages/profile/NotificationsPage"));
const ProfessionalInfoPage = lazy(() => import("../pages/profile/ProfessionalInfoPage"));
const RecommendationsPage = lazy(
	() => import("../pages/profile/RecommendationsPage")
);
const MainNotificationsPage = lazy(
	() => import("../pages/NotificationsPage")
);
const TwoFactorAuthPage = lazy(() => import("../pages/auth/TwoFactorAuthPage"));
const CreateProjectPage = lazy(() => import("../pages/projects/CreateProjectPage"));
const EditProjectPage = lazy(() => import("../pages/projects/EditProjectPage"));
const ProjectDetailsPage = lazy(() => import("../pages/projects/ProjectDetailsPage"));
const ProjectsPage = lazy(() => import("../pages/projects/ProjectsPage"));
const ProjectDashboardPage = lazy(
	() => import("../pages/projects/ProjectDashboardPage")
);
const Dashboard = lazy(() => import("../pages/Dashboard"));
const SettingsOverviewPage = lazy(() => import("../pages/profile/SettingsOverviewPage"));const appRoutes: RouteObject[] = [
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
