export type LeftSidebarProps = {
	isLeftSidebarOpen: boolean;
	leftSidebarWidth: number;
	leftSidebarOpenWidth: number;
};

export type MainContentProps = {
	isLeftSidebarOpen: boolean;
	setIsLeftSidebarOpen: (state: boolean) => void;
	leftSidebarWidth: number;
	rightSidebarWidth: number;
	leftSidebarOpenWidth: number;
};
