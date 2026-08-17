import { Tooltip } from "antd";
import { PanelLeftOpen, PanelRightOpen } from "lucide-react";
import { Outlet, useLocation } from "react-router-dom";
import getPathName from "../../utils/getPathName";
import type { MainContent } from "../../types/sidebar.types";

const MainContent = ({ isLeftSidebarOpen, setIsLeftSidebarOpen, leftSidebarWidth, rightSidebarWidth, leftSidebarOpenWidth }: MainContent) => {
	const { pathname } = useLocation();

	const sectionDimension = {
		width: isLeftSidebarOpen ? `calc(100% - ${leftSidebarWidth + rightSidebarWidth}px)` : `calc(100% - ${leftSidebarOpenWidth + +rightSidebarWidth}px)`,
		marginLeft: isLeftSidebarOpen ? `${leftSidebarWidth}px` : `${leftSidebarOpenWidth}px`,
	};

	return (
		<section className="p-8 px-5 transition-all" style={sectionDimension}>
			<div className="w-full rounded-xl">
				<div className="flex items-center gap-4 pb-3 pt-1.5 border-b border-b-slate-200/70 mb-3">
					{/* Sidebar toggle button */}
					<Tooltip placement="bottom" title={isLeftSidebarOpen ? "Close Sidebar" : "Open Sidebar"} mouseLeaveDelay={0}>
						<button className="cursor-pointer bg-slate-200/60 hover:bg-slate-200 transition-all p-2.5 rounded-full" onClick={() => setIsLeftSidebarOpen(!isLeftSidebarOpen)}>
							{isLeftSidebarOpen ? <PanelRightOpen size={18} /> : <PanelLeftOpen size={18} />}
						</button>
					</Tooltip>

					<div className="capitalize text-lg font-medium">{getPathName(pathname)}</div>
				</div>

				<Outlet />
			</div>
		</section>
	);
};

export default MainContent;
