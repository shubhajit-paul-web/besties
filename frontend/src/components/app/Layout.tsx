import { NavLink } from "react-router-dom";
import Logo from "../shared/Logo";
import { Bookmark, House, Image, LogOut, Users } from "lucide-react"
import Avatar from "../shared/Avatar";

const Layout = () => {
	const LEFT_SIDEBAR_WIDTH = 350;
	const RIGHT_SIDEBAR_WIDTH = 400;
	const postsSectionDimension = {
		width: `calc(100% - ${LEFT_SIDEBAR_WIDTH + RIGHT_SIDEBAR_WIDTH}px)`,
		marginLeft: `${LEFT_SIDEBAR_WIDTH}px`
	}
	const getNavLinkClass = ({ isActive }: { isActive: boolean }) => {
		return `${isActive && "font-medium"} flex items-center gap-3 cursor-pointer hover:bg-white px-4 py-3 rounded-lg transition-all`
	}

	const menus = [
		{
			href: "/app",
			label: "dashboard",
			icon: House
		},
		{
			href: "/posts",
			label: "my posts",
			icon: Image
		},
		{
			href: "/friends",
			label: "friends",
			icon: Users
		},
		{
			href: "/saved",
			label: "saved",
			icon: Bookmark
		}
	]

	return (
		<div>
			{/* Left Sidebar */}
			<aside className={`h-full p-8 fixed top-0 left-0`} style={{ width: LEFT_SIDEBAR_WIDTH + "px" }}>
				<div className="h-full bg-slate-100 border-r border-slate-200 rounded-xl p-5">
					<div className="pl-2">
						<Logo />
					</div>

					<div className="pt-10 pb-10 flex flex-col justify-between h-full">
						<div className="space-y-1.5">
							{
								menus.map((item, index) => {
									const Icon = item.icon

									return (
										<NavLink
											className={getNavLinkClass}
											to={item.href} key={index}>
											<Icon size={21} />
											<span className="capitalize">{item.label}</span>
										</NavLink>
									)
								})
							}
						</div>

						<div className="flex items-center justify-between pt-4 border-t border-t-slate-200">
							<Avatar />
							<LogOut size={18} />
						</div>
					</div>
				</div>
			</aside>

			{/* Posts Section */}
			<section className="min-h-screen p-8" style={postsSectionDimension}>
				<div className="bg-slate-100 w-full min-h-screen rounded-xl"></div>
			</section>

			{/* Right Sidebar */}
			<aside className={`w-[${RIGHT_SIDEBAR_WIDTH}px] h-screen p-8 fixed top-0 right-0`} style={{ width: RIGHT_SIDEBAR_WIDTH + "px" }}>
				<div className="h-full bg-slate-100 border-l border-slate-200 rounded-xl"></div>
			</aside>
		</div>
	)
}

export default Layout