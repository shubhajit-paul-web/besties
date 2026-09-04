const getPathName = (pathname: string) => {
	// if (pathname === "/app" || pathname === "/app/") {
	// 	return "Home";
	// }

	const path = pathname
		.replace(/^\/app\/?/, "")
		.replace(/\/$/, "")
		.replace(/-/g, " ");

	const [segment] = path.split("/");

	return ["chat", "audio call", "video call"].includes(segment) ? segment : path;
};

export default getPathName;
