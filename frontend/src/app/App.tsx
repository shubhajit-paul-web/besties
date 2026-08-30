import { useState } from "react";
import type { AccessTokenPayload, UserType } from "../types/user.types";
import Router from "../routes/routes";
import Context from "./Context";

const App = () => {
	const [user, setUser] = useState<UserType | null>(null);
	const [onlineFriends, setOnlineFriends] = useState<AccessTokenPayload[]>([]);

	return (
		<Context.Provider value={{ user, setUser, onlineFriends, setOnlineFriends }}>
			<Router />
		</Context.Provider>
	);
};

export default App;
