export interface LeftSidebarProps {
	isLeftSidebarOpen: boolean;
	leftSidebarWidth: number;
	leftSidebarOpenWidth: number;
}

export interface MainContentProps {
	isLeftSidebarOpen: boolean;
	setIsLeftSidebarOpen: (state: boolean) => void;
	leftSidebarWidth: number;
	rightSidebarWidth: number;
	leftSidebarOpenWidth: number;
}
