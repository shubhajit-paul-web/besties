import { PanelLeftOpen, PanelRightOpen } from "lucide-react"
import { Outlet, useLocation } from "react-router-dom"

interface MainContentInterface {
	isLeftSidebarOpen: boolean
	setIsLeftSidebarOpen: (state: boolean) => void
	leftSidebarWidth: number
	rightSidebarWidth: number
	leftSidebarOpenWidth: number
}

const MainContent = ({
	isLeftSidebarOpen,
	setIsLeftSidebarOpen,
	leftSidebarWidth,
	rightSidebarWidth,
	leftSidebarOpenWidth }: MainContentInterface) => {
	const { pathname } = useLocation();

	const sectionDimension = {
		width: isLeftSidebarOpen ?
			`calc(100% - ${leftSidebarWidth + rightSidebarWidth}px)` :
			`calc(100% - ${leftSidebarOpenWidth}px)`,
		marginLeft: isLeftSidebarOpen ? `${leftSidebarWidth}px` : `${leftSidebarOpenWidth}px`
	}

	const getPathName = () => {
		let path = pathname.replace("/app/", "")
		path = path.replace("-", " ")

		return path;
	}

	return (
		<section className="min-h-screen p-8 transition-all" style={sectionDimension}>
			<div className="w-full min-h-screen rounded-xl">
				<div className="flex items-center gap-4 py-3 border-b border-b-slate-200/70 mb-3">
					{/* Sidebar toggle button */}
					<button className="cursor-pointer bg-slate-200/60 hover:bg-slate-200 transition-all p-2.5 rounded-full" onClick={() => setIsLeftSidebarOpen(!isLeftSidebarOpen)}>
						{isLeftSidebarOpen ?
							<PanelRightOpen size={18} />
							: <PanelLeftOpen size={18} />
						}
					</button>
					<div className="capitalize text-lg font-medium">
						{getPathName()}
					</div>
				</div>

				<Outlet />
			</div>
		</section>
	)
}

export default MainContent