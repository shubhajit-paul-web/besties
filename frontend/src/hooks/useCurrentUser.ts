import useSWR from "swr";
import fetcher from "../utils/fetcher";
import type { UserType } from "@/types/user.types";

const useCurrentUser = () => {
	const SWRResponse = useSWR("/users/me", fetcher, {
		shouldRetryOnError: false,
		revalidateOnFocus: false,
	});

	const response = {
		...SWRResponse,
		user: SWRResponse.data?.data?.user as UserType | undefined,
	};

	return response;
};

export default useCurrentUser;
