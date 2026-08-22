import { lazy } from "react";
import { LogOut } from "lucide-react";
import bestiesLogoImg from "@/assets/images/besties-logo.png";
import { NavLink } from "react-router-dom";
import { Popconfirm, Tooltip } from "antd";
import Logo from "@/components/ui/Logo";
import Avatar from "@/components/ui/Avatar";
import type { LeftSidebarProps } from "@/types/sidebar.types";
import useCurrentUser from "@/hooks/useCurrentUser";
import formatUserName from "@/utils/formatUserName";
import useLogoutUser from "@/hooks/useLogoutUser";
import menus from "@/config/menus";
const ErrorMessage = lazy(() => import("@/components/ui/ErrorMessage"));

const LeftSidebar = ({ isLeftSidebarOpen, leftSidebarWidth, leftSidebarOpenWidth }: LeftSidebarProps) => {
	const { isLoading, error, user } = useCurrentUser();
	const { handleLogout } = useLogoutUser();

	if (isLoading) {
		return null;
	}

	if (error || !user) {
		return <ErrorMessage />;
	}

	const getNavLinkClass = ({ isActive }: { isActive: boolean }) => {
		return `${isActive && `font-bold ${isLeftSidebarOpen || "bg-slate-200/60"}`} flex items-center gap-3 cursor-pointer hover:bg-slate-200/60 px-4 py-3 rounded-lg transition-all`;
	};

	return (
		<aside
			className={`hidden xl:block h-full p-8 fixed top-0 left-0 transition-all overflow-x-hidden`}
			style={{
				width: isLeftSidebarOpen ? leftSidebarWidth + "px" : leftSidebarOpenWidth + "px",
			}}>
			<div className="h-full bg-slate-50 border-r border-r-slate-200 rounded-xl p-5">
				<div className="pl-2">{isLeftSidebarOpen ? <Logo /> : <img className="w-10 h-10 p-1" src={bestiesLogoImg} />}</div>

				<div className="pt-10 pb-10 flex flex-col justify-between h-full">
					{/* Menu */}
					<div className="space-y-1.5">
						{menus.map((item) => {
							const Icon = item.icon;

							if (isLeftSidebarOpen) {
								return (
									<NavLink className={getNavLinkClass} to={item.href} key={item.href}>
										<Icon size={21} />
										<span className="capitalize">{item.label}</span>
									</NavLink>
								);
							}

							return (
								<Tooltip placement="right" title={item.label[0].toUpperCase() + item.label.slice(1)} key={item.href}>
									<NavLink className={getNavLinkClass} to={item.href}>
										<Icon size={21} />
									</NavLink>
								</Tooltip>
							);
						})}
					</div>

					{/* Avatar */}
					<div>
						<div className={`flex items-center pt-4 border-t border-t-slate-200 ${isLeftSidebarOpen ? "justify-between" : "justify-center"}`}>
							{isLeftSidebarOpen ? (
								<>
									<Avatar image={user?.avatar || "/profile-img.jpeg"} title={formatUserName(user.name)} subtitle={<span className="opacity-70">Software Engineer</span>} />

									{/* Logout button */}
									<Popconfirm title="Are you sure you want to logout?" onConfirm={handleLogout}>
										<Tooltip title="Logout">
											<button type="button" className="hover:text-red-500 cursor-pointer">
												<LogOut size={18} />
											</button>
										</Tooltip>
									</Popconfirm>
								</>
							) : (
								<Avatar image={user?.avatar || "/profile-img.jpeg"} />
							)}
						</div>
					</div>
				</div>
			</div>
		</aside>
	);
};

export default LeftSidebar;
