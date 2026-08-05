import { Bookmark, ChartNoAxesCombined, House, Image, LogOut, UserRound, Users } from "lucide-react";
import Avatar from "../Avatar";
import Logo from "../Logo";
import bestiesLogoImg from "../../../assets/besties-logo.png";
import { NavLink, useNavigate } from "react-router-dom";
import useAppContext from "../../../hooks/useAppContext";
import { authApi } from "../../../lib/axios";

interface SidebarInterface {
	isLeftSidebarOpen: boolean;
	leftSidebarWidth: number;
	leftSidebarOpenWidth: number;
}

const LeftSidebar = ({ isLeftSidebarOpen, leftSidebarWidth, leftSidebarOpenWidth }: SidebarInterface) => {
	const navigate = useNavigate();
	const { user } = useAppContext();
	const userFullName = user?.name.first + " " + (user?.name.last ? user?.name.last : "");
	const menus = [
		{
			href: "/app",
			label: "home",
			icon: House,
		},
		{
			href: "/app/my-posts",
			label: "my posts",
			icon: Image,
		},
		{
			href: "/app/friends",
			label: "friends",
			icon: Users,
		},
		{
			href: "/app/saved",
			label: "saved",
			icon: Bookmark,
		},
		{
			href: "/app/dashboard",
			label: "dashboard",
			icon: ChartNoAxesCombined,
		},
		{
			href: "/app/profile",
			label: "profile",
			icon: UserRound,
		},
	];

	const logout = async () => {
		try {
			await authApi.post("/auth/logout");
			navigate("/login");
		} catch {
			navigate("/login");
		}
	};

	const getNavLinkClass = ({ isActive }: { isActive: boolean }) => {
		return `${isActive && `font-bold ${isLeftSidebarOpen || "bg-slate-200/60"}`} flex items-center gap-3 cursor-pointer hover:bg-slate-200/60 px-4 py-3 rounded-lg transition-all`;
	};

	return (
		<aside
			className={`h-full p-8 fixed top-0 left-0 transition-all overflow-x-hidden`}
			style={{
				width: isLeftSidebarOpen ? leftSidebarWidth + "px" : leftSidebarOpenWidth + "px",
			}}>
			<div className="h-full bg-slate-50 border-r border-r-slate-200 rounded-xl p-5">
				<div className="pl-2">{isLeftSidebarOpen ? <Logo /> : <img className="w-10 h-10 p-1" src={bestiesLogoImg} />}</div>

				<div className="pt-10 pb-10 flex flex-col justify-between h-full">
					{/* Menu */}
					<div className="space-y-1.5">
						{menus.map((item, index) => {
							const Icon = item.icon;

							return (
								<NavLink className={getNavLinkClass} to={item.href} key={index} title={isLeftSidebarOpen ? "" : item.label[0].toUpperCase() + item.label.slice(1)}>
									<Icon size={21} />
									{isLeftSidebarOpen && <span className="capitalize">{item.label}</span>}
								</NavLink>
							);
						})}
					</div>

					{/* Avatar */}
					<div>
						<div className={`flex items-center pt-4 border-t border-t-slate-200 ${isLeftSidebarOpen ? "justify-between" : "justify-center"}`}>
							{isLeftSidebarOpen ? (
								<>
									<Avatar image="/profile-img.jpeg" title={userFullName} subtitle={<span className="opacity-70">Software Engineer</span>} />

									{/* Logout button */}
									<div onClick={logout} className="hover:text-red-500 cursor-pointer">
										<LogOut size={18} />
									</div>
								</>
							) : (
								<Avatar image="/profile-img.jpeg" />
							)}
						</div>
					</div>
				</div>
			</div>
		</aside>
	);
};

export default LeftSidebar;
