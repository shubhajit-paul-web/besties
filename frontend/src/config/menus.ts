import { Bookmark, ChartNoAxesCombined, House, Image, UserRound, Users } from "lucide-react";

const menus = [
	{
		href: "/app/home",
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

export default menus;
