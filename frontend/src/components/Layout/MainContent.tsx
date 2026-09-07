import { Tooltip } from "antd";
import { PanelLeftOpen, PanelRightOpen } from "lucide-react";
import { Outlet, useLocation } from "react-router-dom";
import type { CSSProperties } from "react";
import getPathName from "../../utils/getPathName";
import type { MainContentProps } from "../../types/sidebar.types";
import ActiveSessionHeader from "./ActiveSessionHeader";

const MainContent = ({ isLeftSidebarOpen, setIsLeftSidebarOpen, leftSidebarWidth, rightSidebarWidth, leftSidebarOpenWidth }: MainContentProps) => {
	const { pathname } = useLocation();
	const isSessionPage = ["chat", "audio call", "video call"].includes(getPathName(pathname));

	const desktopSectionDimension = {
		"--desktop-width": isLeftSidebarOpen ? `calc(100% - ${leftSidebarWidth + rightSidebarWidth}px)` : `calc(100% - ${leftSidebarOpenWidth + rightSidebarWidth}px)`,
		"--desktop-margin": isLeftSidebarOpen ? `${leftSidebarWidth}px` : `${leftSidebarOpenWidth}px`,
	};

	return (
		<section
			className="w-full px-4 pb-24 pt-5 transition-all sm:px-5 md:px-6 xl:ml-(--desktop-margin) xl:w-(--desktop-width) xl:p-8 xl:px-5 xl:pb-8"
			style={desktopSectionDimension as CSSProperties}>
			<div className="w-full rounded-xl">
				{isSessionPage ? (
					<ActiveSessionHeader isLeftSidebarOpen={isLeftSidebarOpen} setIsLeftSidebarOpen={setIsLeftSidebarOpen} />
				) : (
					<div className="mb-3 flex items-center gap-4 border-b border-b-slate-200/70 pb-3 pt-1.5">
						{/* Sidebar toggle button */}
						<Tooltip placement="bottom" title={isLeftSidebarOpen ? "Close Sidebar" : "Open Sidebar"} mouseLeaveDelay={0}>
							<button
								className="hidden xl:inline-flex cursor-pointer bg-slate-200/60 hover:bg-slate-200 transition-all p-2.5 rounded-full"
								onClick={() => setIsLeftSidebarOpen(!isLeftSidebarOpen)}>
								{isLeftSidebarOpen ? <PanelRightOpen size={18} /> : <PanelLeftOpen size={18} />}
							</button>
						</Tooltip>

						<div className="capitalize text-lg font-medium">{getPathName(pathname)}</div>
					</div>
				)}

				<Outlet />
			</div>
		</section>
	);
};

export default MainContent;
