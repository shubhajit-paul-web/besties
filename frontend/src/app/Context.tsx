import { createContext, type Dispatch, type SetStateAction } from "react";
import type { UserType } from "../types/user.types";

interface ContextType {
	user: UserType | null;
	setUser: Dispatch<SetStateAction<UserType | null>>;
}

const Context = createContext<ContextType | null>(null);

export default Context;
