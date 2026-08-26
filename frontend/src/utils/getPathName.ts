const getPathName = (pathname: string) => {
	// if (pathname === "/app" || pathname === "/app/") {
	// 	return "Home";
	// }

	let path = pathname.replace(/^\/app\/|\/$/g, "");
	path = path.replace("-", " ");

	if (path.startsWith("chat/")) {
		path = path.split("/")[0];
	}

	return path;
};

export default getPathName;
