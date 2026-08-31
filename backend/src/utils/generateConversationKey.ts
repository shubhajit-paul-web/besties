const generateConversationKey = (user1: string, user2: string) => {
    return [user1, user2].sort().join(":");
};

export default generateConversationKey;
