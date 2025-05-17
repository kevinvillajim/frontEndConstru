// src/ui/pages/profile/ProfilePage.tsx
import {useState, useEffect} from "react";
import {Outlet, useNavigate, useLocation} from "react-router-dom";
import {
	UserCircleIcon,
	KeyIcon,
	CogIcon,
	BellIcon,
	BuildingOfficeIcon,
	CreditCardIcon,
} from "@heroicons/react/24/outline";
import { useAuth } from "../../context/AuthContext";
import {UserProfileProvider} from "../../context/UserProfileContext";

const ProfilePage = () => {
	const {user} = useAuth();
	const navigate = useNavigate();
	const location = useLocation();
	const [activeTab, setActiveTab] = useState("personal");

	// Set the active tab based on the current path
	useEffect(() => {
		const path = location.pathname.split("/").pop() || "personal";
		setActiveTab(path);
	}, [location]);

	// Navigate to the selected tab
	const handleTabChange = (tab: string) => {
		navigate(`/profile/${tab}`);
	};

	const tabs = [
		{
			id: "personal",
			name: "Información Personal",
			icon: UserCircleIcon,
		},
		{
			id: "security",
			name: "Seguridad",
			icon: KeyIcon,
		},
		{
			id: "subscription",
			name: "Suscripción",
			icon: CreditCardIcon,
		},
		{
			id: "preferences",
			name: "Preferencias",
			icon: CogIcon,
		},
		{
			id: "notifications",
			name: "Notificaciones",
			icon: BellIcon,
		},
		{
			id: "professional",
			name: "Información Profesional",
			icon: BuildingOfficeIcon,
		},
	];

	if (!user) {
		return (
			<div className="min-h-[70vh] flex items-center justify-center">
				<div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-600"></div>
			</div>
		);
	}

	return (
		<div className="container mx-auto px-4 py-8">
			<div className="flex flex-col md:flex-row gap-8">
				{/* Profile Sidebar */}
				<div className="md:w-1/4">
					<div className="bg-white dark:bg-gray-800 rounded-xl shadow-md overflow-hidden">
						{/* Profile Header */}
						<div className="p-6 text-center border-b border-gray-200 dark:border-gray-700">
							<div className="relative inline-block mb-4">
								{user.profilePicture ? (
									<img
										src={user.profilePicture}
										alt={`${user.firstName} ${user.lastName}`}
										className="w-24 h-24 rounded-full object-cover mx-auto"
										onError={(e) => {
											e.currentTarget.src = `https://ui-avatars.com/api/?name=${user.firstName}+${user.lastName}&background=0D8ABC&color=fff`;
										}}
									/>
								) : (
									<div className="w-24 h-24 rounded-full bg-primary-100 dark:bg-primary-900 flex items-center justify-center text-primary-700 dark:text-primary-300 text-3xl font-bold mx-auto">
										{user.firstName.charAt(0)}
										{user.lastName.charAt(0)}
									</div>
								)}
								<button className="absolute bottom-0 right-0 bg-secondary-500 hover:bg-secondary-600 text-gray-900 rounded-full p-1.5 shadow-md transition-transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-secondary-300">
									<svg
										xmlns="http://www.w3.org/2000/svg"
										className="h-4 w-4"
										viewBox="0 0 20 20"
										fill="currentColor"
									>
										<path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
									</svg>
								</button>
							</div>
							<h2 className="text-xl font-bold text-gray-900 dark:text-white">
								{user.firstName} {user.lastName}
							</h2>
							<p className="text-gray-600 dark:text-gray-400 mt-1">
								{user.email}
							</p>
							<div className="mt-2 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-primary-100 dark:bg-primary-900 text-primary-800 dark:text-primary-300">
								{user.professionalType === "architect"
									? "Arquitecto"
									: user.professionalType === "civil_engineer"
										? "Ingeniero Civil"
										: user.professionalType === "constructor"
											? "Constructor"
											: user.professionalType === "contractor"
												? "Contratista"
												: user.professionalType === "electrician"
													? "Electricista"
													: user.professionalType === "plumber"
														? "Plomero"
														: user.professionalType === "designer"
															? "Diseñador"
															: "Profesional"}
							</div>
						</div>

						{/* Navigation Tabs */}
						<nav className="p-4">
							<ul className="space-y-2">
								{tabs.map((tab) => (
									<li key={tab.id}>
										<button
											onClick={() => handleTabChange(tab.id)}
											className={`w-full flex items-center px-4 py-3 rounded-lg text-left transition-all duration-300 ${
												activeTab === tab.id
													? "bg-primary-50 dark:bg-primary-900/30 text-primary-700 dark:text-primary-300"
													: "text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700"
											}`}
										>
											<tab.icon className="h-5 w-5 mr-3" />
											<span>{tab.name}</span>
											{activeTab === tab.id && (
												<span className="ml-auto w-1.5 h-1.5 rounded-full bg-secondary-500"></span>
											)}
										</button>
									</li>
								))}
							</ul>
						</nav>
					</div>
				</div>

				{/* Main Content Area */}
				<div className="md:w-3/4">
					<div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6">
						<UserProfileProvider>
							<Outlet />
						</UserProfileProvider>
					</div>
				</div>
			</div>
		</div>
	);
};

export default ProfilePage;
