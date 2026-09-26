import fetcher from "@/utils/fetcher";
import useSWR from "swr";

const useFeed = () => {
	return useSWR("/posts/feed", fetcher);
};

export default useFeed;
