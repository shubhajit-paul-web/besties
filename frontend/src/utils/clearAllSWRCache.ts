import { mutate } from "swr";

const clearAllSWRCache = async () => {
	return mutate(() => true, undefined, { revalidate: false });
};

export default clearAllSWRCache;
