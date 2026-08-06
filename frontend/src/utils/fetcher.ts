import { HttpInterceptor } from "../lib/axios";

const fetcher = async (endpoint: string) => {
	const response = await HttpInterceptor.get(endpoint);
	return response.data;
};

export default fetcher;
