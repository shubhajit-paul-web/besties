const getPathName = (pathname: string) => {
	if (pathname === "/app" || pathname === "/app/") {
		return "Home";
	}

	let path = pathname.replace(/^\/app\/|\/$/g, "");
	path = path.replace("-", " ");

	return path;
};

export default getPathName;
