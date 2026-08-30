import { createContext, type Dispatch, type SetStateAction } from "react";
import type { AccessTokenPayload, UserType } from "../types/user.types";

type ContextType = {
	user: UserType | null;
	setUser: Dispatch<SetStateAction<UserType | null>>;
	onlineFriends: AccessTokenPayload[];
	setOnlineFriends: Dispatch<SetStateAction<AccessTokenPayload[]>>;
};

const Context = createContext<ContextType | null>(null);

export default Context;
