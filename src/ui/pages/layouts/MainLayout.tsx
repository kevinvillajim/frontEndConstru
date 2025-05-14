import {Suspense} from "react";
import {Outlet} from "react-router-dom";
import Header from "../../components/layout/Header";
import Footer from "../../components/layout/Footer";

const MainLayout = () => {
	return (
		<div className="flex flex-col min-h-screen">
			<Header />
			<main className="flex-grow">
				<Suspense
					fallback={
						<div className="flex justify-center items-center h-64">
							<div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-500"></div>
						</div>
					}
				>
					<Outlet />
				</Suspense>
			</main>
			<Footer />
		</div>
	);
};

export default MainLayout;
