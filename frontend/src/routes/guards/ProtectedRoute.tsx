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
	}, [data, setUser]);

	if (isLoading) {
		return null;
	}

	if (error) {
		setUser(null);

		return <Navigate to="/login" replace />;
	}

	return <Outlet />;
};

export default ProtectedRoute;
