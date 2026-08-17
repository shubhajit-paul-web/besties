import { useState } from "react";
import type { UserType } from "../types/user.types";
import Router from "../routes/routes";
import Context from "./Context";

const App = () => {
	const [user, setUser] = useState<UserType | null>(null);

	return (
		<Context.Provider value={{ user, setUser }}>
			<Router />
		</Context.Provider>
	);
};

export default App;
