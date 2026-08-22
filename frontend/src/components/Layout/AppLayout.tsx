import { lazy, useState } from "react";
import { Navigate, useLocation } from "react-router-dom";
import MainContent from "./MainContent";
import RightSidebar from "./Sidebar/Right/Sidebar";
import LeftSidebar from "./Sidebar/Left/Sidebar";
const BottomNavigation = lazy(() => import("./Sidebar/mobile/BottomNavigation"));

const AppLayout = () => {
	const { pathname } = useLocation();
	const [isLeftSidebarOpen, setIsLeftSidebarOpen] = useState(true);

	if (pathname === "/app" || pathname === "/app/") {
		return <Navigate to="/app/home" />;
	}

	const LEFT_SIDEBAR_WIDTH = 320;
	const RIGHT_SIDEBAR_WIDTH = 480;
	const LEFT_SIDEBAR_OPEN_WIDTH = 160;

	return (
		<div className="min-h-screen">
			{/* Left Sidebar - Menu */}
			<LeftSidebar isLeftSidebarOpen={isLeftSidebarOpen} leftSidebarWidth={LEFT_SIDEBAR_WIDTH} leftSidebarOpenWidth={LEFT_SIDEBAR_OPEN_WIDTH} />

			{/* Main Content */}
			<MainContent
				isLeftSidebarOpen={isLeftSidebarOpen}
				setIsLeftSidebarOpen={(state) => setIsLeftSidebarOpen(state)}
				leftSidebarWidth={LEFT_SIDEBAR_WIDTH}
				leftSidebarOpenWidth={LEFT_SIDEBAR_OPEN_WIDTH}
				rightSidebarWidth={RIGHT_SIDEBAR_WIDTH}
			/>

			{/* Right Sidebar - My friends */}
			<RightSidebar rightSidebarWidth={RIGHT_SIDEBAR_WIDTH} />

			{/* Bottom Navigation for Mobile */}
			<BottomNavigation />
		</div>
	);
};

export default AppLayout;
