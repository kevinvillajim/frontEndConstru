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

const appRoutes: RouteObject[] = [
	//Public Routes
	{
		path: "/",
		element: <MainLayout />,
		children: [
			{
				index: true,
				element: (
					
						<HomePage />
					
				),
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
			 	element: (
			 			<ForgotPasswordPage />
			 	),
			 },
			 {
			 	path: "reset-password",
			 	element: (
			 			<ResetPasswordPage />
			 	),
			},
			 {
			 	path: "verify-email/:token",
			 	element: (
			 			<EmailVerificationPage />
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
