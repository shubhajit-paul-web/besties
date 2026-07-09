const formatCount = (count: number) => {
	if (count < 1000) return count.toString();

	if (count < 1_000_000) {
		const value = count / 1000;
		return `${Number.isInteger(value) ? value : value.toFixed(1).replace(/\.0$/, "")}K`;
	}

	if (count < 1_000_000_000) {
		const value = count / 1_000_000;
		return `${Number.isInteger(value) ? value : value.toFixed(1).replace(/\.0$/, "")}M`;
	}

	const value = count / 1_000_000_000;
	return `${Number.isInteger(value) ? value : value.toFixed(1).replace(/\.0$/, "")}B`;
};

export default formatCount;
