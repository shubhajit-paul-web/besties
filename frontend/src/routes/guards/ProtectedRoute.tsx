import { Navigate, Outlet } from "react-router-dom";
import { useEffect } from "react";
import useAppContext from "../../hooks/useAppContext";
import useCurrentUser from "../../hooks/useCurrentUser";

const ProtectedRoute = () => {
	const { setUser } = useAppContext();
	const { data, error, isLoading } = useCurrentUser();

	useEffect(() => {
		const user = data?.data?.user;

		if (user) setUser(user);
		else if (error) setUser(null);
	}, [data, error, setUser]);

	if (isLoading) {
		return null;
	}

	if (error) {
		return <Navigate to="/login" replace />;
	}

	return <Outlet />;
};

export default ProtectedRoute;
