const formatUserName = (name: { first: string; last?: string } | undefined) => {
	if (!name) {
		return "Unknown";
	}

	return `${name.first} ${name?.last ?? ""}`.trim();
};

export default formatUserName;
