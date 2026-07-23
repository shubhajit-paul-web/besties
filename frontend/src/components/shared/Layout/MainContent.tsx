import { PanelLeftOpen, PanelRightOpen } from "lucide-react";
import { Outlet, useLocation } from "react-router-dom";

interface MainContentInterface {
	isLeftSidebarOpen: boolean;
	setIsLeftSidebarOpen: (state: boolean) => void;
	leftSidebarWidth: number;
	rightSidebarWidth: number;
	leftSidebarOpenWidth: number;
}

const MainContent = ({ isLeftSidebarOpen, setIsLeftSidebarOpen, leftSidebarWidth, rightSidebarWidth, leftSidebarOpenWidth }: MainContentInterface) => {
	const { pathname } = useLocation();
	console.log(leftSidebarOpenWidth);

	const sectionDimension = {
		width: isLeftSidebarOpen ? `calc(100% - ${leftSidebarWidth + rightSidebarWidth}px)` : `calc(100% - ${leftSidebarOpenWidth + +rightSidebarWidth}px)`,
		marginLeft: isLeftSidebarOpen ? `${leftSidebarWidth}px` : `${leftSidebarOpenWidth}px`,
	};

	const getPathName = () => {
		if (pathname === "/app" || pathname === "/app/") {
			return "Home";
		}

		let path = pathname.replace("/app/", "");
		path = path.replace("-", " ");

		return path;
	};

	return (
		<section className="p-8 px-5 transition-all" style={sectionDimension}>
			<div className="w-full rounded-xl">
				<div className="flex items-center gap-4 pb-3 pt-1.5 border-b border-b-slate-200/70 mb-3">
					{/* Sidebar toggle button */}
					<button className="cursor-pointer bg-slate-200/60 hover:bg-slate-200 transition-all p-2.5 rounded-full" onClick={() => setIsLeftSidebarOpen(!isLeftSidebarOpen)}>
						{isLeftSidebarOpen ? <PanelRightOpen size={18} /> : <PanelLeftOpen size={18} />}
					</button>
					<div className="capitalize text-lg font-medium">{getPathName()}</div>
				</div>

				<Outlet />
			</div>
		</section>
	);
};

export default MainContent;
