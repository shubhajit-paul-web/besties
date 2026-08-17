export interface LeftSidebar {
	isLeftSidebarOpen: boolean;
	leftSidebarWidth: number;
	leftSidebarOpenWidth: number;
}

export interface MainContent {
	isLeftSidebarOpen: boolean;
	setIsLeftSidebarOpen: (state: boolean) => void;
	leftSidebarWidth: number;
	rightSidebarWidth: number;
	leftSidebarOpenWidth: number;
}
