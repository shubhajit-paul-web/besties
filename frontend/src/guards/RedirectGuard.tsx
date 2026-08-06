import { Navigate, Outlet } from "react-router-dom";
import useCurrentUser from "../hooks/useCurrentUser";

const RedirectGuard = () => {
	const { data: user, error, isLoading } = useCurrentUser();

	if (isLoading) {
		return null;
	}

	if (error) {
		return <Outlet />;
	}

	if (user) {
		return <Navigate to="/app" />;
	}

	return <Outlet />;
};

export default RedirectGuard;
