import { useState } from "react";
import MainContent from "../shared/Layout/MainContent";
import RightSidebar from "../shared/Layout/RightSidebar";
import LeftSidebar from "../shared/Layout/LeftSidebar";

const Layout = () => {
	const [isLeftSidebarOpen, setIsLeftSidebarOpen] = useState(true);

	const LEFT_SIDEBAR_WIDTH = 320;
	const RIGHT_SIDEBAR_WIDTH = 450;
	const LEFT_SIDEBAR_OPEN_WIDTH = 160;

	return (
		<div>
			{/* Left Sidebar - Menu */}
			<LeftSidebar
				isLeftSidebarOpen={isLeftSidebarOpen}
				leftSidebarWidth={LEFT_SIDEBAR_WIDTH}
				leftSidebarOpenWidth={LEFT_SIDEBAR_OPEN_WIDTH}
			/>

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
		</div>
	)
}

export default Layout