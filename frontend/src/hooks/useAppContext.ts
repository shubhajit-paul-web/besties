import { useContext } from "react";
import Context from "../app/Context";

const useAppContext = () => {
	const context = useContext(Context);

	if (!context) {
		throw new Error("useAppContext must be used within ContextProvider");
	}

	return context;
};

export default useAppContext;
