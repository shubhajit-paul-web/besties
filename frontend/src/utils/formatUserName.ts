const formatUserName = (name: { first: string; last?: string }) => {
	return `${name.first} ${name?.last ?? ""}`.trim();
};

export default formatUserName;
