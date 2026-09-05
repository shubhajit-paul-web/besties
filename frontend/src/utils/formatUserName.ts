const formatUserName = (name: { first: string; last?: string } | undefined) => {
	if (!name) {
		return "Loading...";
	}

	return `${name.first} ${name?.last ?? ""}`.trim();
};

export default formatUserName;
