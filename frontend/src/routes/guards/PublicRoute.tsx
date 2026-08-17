import { Navigate, Outlet } from "react-router-dom";
import useCurrentUser from "../../hooks/useCurrentUser";

const PublicRoute = () => {
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

export default PublicRoute;
