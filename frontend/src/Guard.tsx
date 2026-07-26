import { Navigate, Outlet } from "react-router-dom";
import HttpInterceptor from "./lib/HttpInterceptor";
import { useEffect, useState } from "react";
import useAppContext from "./hooks/useAppContext";

const Guard = () => {
	const { user, setUser } = useAppContext();
	const [loading, setLoading] = useState(true);

	const fetchCurrentUser = async () => {
		try {
			const res = await HttpInterceptor.get("/users/me");

			if (res.status === 200) {
				setUser(res.data?.data?.user);
			}
		} catch (err) {
			console.error(err);
		} finally {
			setLoading(false);
		}
	};

	useEffect(() => {
		fetchCurrentUser();
	});

	console.log("user", user);

	if (loading) {
		return null;
	}

	return <div>{user ? <Outlet /> : <Navigate to="/login" />}</div>;
};

export default Guard;
