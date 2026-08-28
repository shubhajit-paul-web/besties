const createConversationKey = (currentUserId: string, friendId: string) => {
	return [currentUserId, friendId].sort().join(":");
};

export default createConversationKey;
