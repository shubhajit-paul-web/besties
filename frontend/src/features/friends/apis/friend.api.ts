import { HttpInterceptor } from "@/lib/axios";

export const acceptFriendRequestApi = async (friendshipId: string) => {
	return HttpInterceptor.patch(`/friends/requests/${friendshipId}/accept`);
};

export const rejectFriendRequestApi = async (friendshipId: string) => {
	return HttpInterceptor.patch(`/friends/requests/${friendshipId}/reject`);
};

export const removeFriendApi = async (friendshipId: string) => {
	return HttpInterceptor.delete(`/friends/${friendshipId}`);
};
