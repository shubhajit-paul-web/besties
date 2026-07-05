import { NavLink, Outlet, useLocation } from "react-router-dom";
import Logo from "../shared/Logo";
import { Bookmark, ChartNoAxesCombined, House, Image, LogOut, MessageSquareMore, PanelLeftOpen, PanelRightOpen, Phone, Users, Video } from "lucide-react"
import Avatar from "../shared/Avatar";
import { useState } from "react";
import bestiesLogoImg from "../../assets/besties-logo.png"

const Layout = () => {
	const { pathname } = useLocation();
	const [isLeftSidebarOpen, setIsLeftSidebarOpen] = useState(true);

	const LEFT_SIDEBAR_WIDTH = 320;
	const RIGHT_SIDEBAR_WIDTH = 450;
	const LEFT_SIDEBAR_OPEN_WIDTH = 160;

	const sectionDimension = {
		width: isLeftSidebarOpen ?
			`calc(100% - ${LEFT_SIDEBAR_WIDTH + RIGHT_SIDEBAR_WIDTH}px)` :
			`calc(100% - ${LEFT_SIDEBAR_OPEN_WIDTH}px)`,
		marginLeft: isLeftSidebarOpen ? `${LEFT_SIDEBAR_WIDTH}px` : `${LEFT_SIDEBAR_OPEN_WIDTH}px`
	}

	const getNavLinkClass = ({ isActive }: { isActive: boolean }) => {
		return `${isActive && `font-bold ${isLeftSidebarOpen || "bg-slate-200/60"}`} flex items-center gap-3 cursor-pointer hover:bg-slate-200/60 px-4 py-3 rounded-lg transition-all`
	}

	const menus = [
		{
			href: "/app/home",
			label: "home",
			icon: House
		},
		{
			href: "/app/my-posts",
			label: "my posts",
			icon: Image
		},
		{
			href: "/app/friends",
			label: "friends",
			icon: Users
		},
		{
			href: "/app/saved",
			label: "saved",
			icon: Bookmark
		},
		{
			href: "/app/dashboard",
			label: "dashboard",
			icon: ChartNoAxesCombined
		}
	]

	const getPathName = () => {
		let path = pathname.replace("/app/", "")
		path = path.replace("-", " ")

		return path;
	}

	return (
		<div>
			{/* Left Sidebar */}
			<aside className={`h-full p-8 fixed top-0 left-0 transition-all overflow-x-hidden`} style={{
				width: isLeftSidebarOpen ? LEFT_SIDEBAR_WIDTH + "px" : LEFT_SIDEBAR_OPEN_WIDTH + "px"
			}}>
				<div className="h-full bg-slate-50 border-r border-r-slate-200 rounded-xl p-5">
					<div className="pl-2">
						{isLeftSidebarOpen ?
							<Logo /> :
							<img className="w-10 h-10 p-1" src={bestiesLogoImg} />
						}
					</div>

					<div className="pt-10 pb-10 flex flex-col justify-between h-full">
						{/* Menu */}
						<div className="space-y-1.5">
							{
								menus.map((item, index) => {
									const Icon = item.icon

									return (
										<NavLink
											className={getNavLinkClass}
											to={item.href}
											key={index}>
											<Icon size={21} />
											{isLeftSidebarOpen && <span className="capitalize">{item.label}</span>}
										</NavLink>
									)
								})
							}
						</div>

						{/* Avatar */}
						<div>
							<div className={`flex items-center pt-4 border-t border-t-slate-200 ${isLeftSidebarOpen ? "justify-between" : "justify-center"}`}>
								{
									isLeftSidebarOpen ?
										<>
											<Avatar image="/profile-img.jpeg" title="Shubhajit Paul" subtitle={<span className="opacity-70">Software Engineer</span>} />
											<LogOut size={18} />
										</> :
										<Avatar image="/profile-img.jpeg" />
								}
							</div>
						</div>
					</div>
				</div>
			</aside>

			{/* section */}
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

			{/* Right Sidebar */}
			<aside className={`w-[${RIGHT_SIDEBAR_WIDTH}px] h-screen p-8 fixed top-0 right-0`} style={{ width: RIGHT_SIDEBAR_WIDTH + "px" }}>
				<div className="h-full bg-slate-50 border-l border-slate-200 rounded-xl py-5">
					<div className="font-medium text-lg pb-4 px-5">My Friends</div>
					<div className="w-[90%] border-b border-b-slate-200 m-auto"></div>
					<div className=" mt-5 space-y-1 overflow-y-auto" style={{
						height: `calc(100% - 60px)`
					}}>
						{
							Array(20).fill(0).map(() => (
								<div className="flex justify-between items-center py-3 px-5 rounded-lg hover:bg-slate-200/50">
									<Avatar
										image="/profile-img.jpeg"
										title="Avinash Kumar"
										subtitle={
											<div className="flex items-center gap-1 mt-0.5">
												<div className="w-1.5 h-1.5 bg-green-500 rounded-full"></div>
												<span className="opacity-70">Online</span>
											</div>
										}
									/>

									{/* Actions */}
									<div className="flex items-center gap-2.5">
										<button className="cursor-pointer hover:border-blue-500 transition-all text-blue-600 bg-blue-100/80 border border-blue-200 rounded-full p-1.5" title="Chat">
											<MessageSquareMore size={15} />
										</button>
										<button className="cursor-pointer hover:border-green-500 transition-all text-green-600 bg-green-100/80 border border-green-300/50 rounded-full p-1.5" title="Audio Call">
											<Phone size={15} />
										</button>
										<button className="cursor-pointer hover:border-amber-500 transition-all text-amber-600 bg-amber-100/80 border border-amber-300/90 rounded-full p-1.5" title="Video Call">
											<Video size={15} />
										</button>
									</div>
								</div>
							))
						}
					</div>
				</div>
			</aside>
		</div>
	)
}

export default Layout