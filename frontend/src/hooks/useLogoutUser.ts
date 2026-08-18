import { logoutUserApi } from "@/apis/auth.api";
import clearAllSWRCache from "@/utils/clearAllSWRCache";
import { useNavigate } from "react-router-dom";

const useLogoutUser = () => {
	const navigate = useNavigate();

	const handleLogout = async () => {
		try {
			await logoutUserApi();
		} catch {
			// empty because we don't it
		} finally {
			await clearAllSWRCache();

			navigate("/login", { replace: true });
		}
	};

	return { handleLogout };
};

export default useLogoutUser;
