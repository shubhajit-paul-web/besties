import menus from "@/config/menus";
import { NavLink } from "react-router-dom";

const BottomNavigation = () => {
	return (
		<nav className="xl:hidden fixed inset-x-0 bottom-0 z-50 border-t border-slate-200 bg-white/95 px-3 py-2 backdrop-blur supports-backdrop-filter:bg-white/80">
			<ul className="mx-auto flex max-w-md items-center justify-between">
				{menus.map((item) => {
					const Icon = item.icon;

					return (
						<li key={item.href}>
							<NavLink
								to={item.href}
								aria-label={item.label}
								className={({ isActive }) =>
									`grid h-11 w-11 place-items-center rounded-full transition-all ${isActive ? "bg-blue-500 text-white shadow-sm" : "text-slate-600 hover:bg-slate-100"}`
								}>
								<Icon size={20} />
								<span className="sr-only">{item.label}</span>
							</NavLink>
						</li>
					);
				})}
			</ul>
		</nav>
	);
};

export default BottomNavigation;
