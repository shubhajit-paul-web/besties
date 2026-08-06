import useSWR from "swr";
import fetcher from "../utils/fetcher";

const useCurrentUser = () => {
	return useSWR("/users/me", fetcher, {
		shouldRetryOnError: false,
		revalidateOnFocus: false,
	});
};

export default useCurrentUser;
