import type { Server, Socket } from "socket.io";
import type { MessageAck, MessagePayload } from "../types/socket.types.js";
import { sendMessageSchema } from "../validators/chat.validator.js";
import messageRepository from "../../repositories/message.repository.js";
import logger from "../../utils/logger.js";
import generateConversationKey from "../../utils/generateConversationKey.js";
import sendAck from "../utils/sendAck.js";

const registerChatHandlers = async (io: Server, socket: Socket) => {
    const currentUserId = String(socket.user._id);
    const roomId = `user:${currentUserId}`;

    // Join user's private room for direct messages
    await socket.join(roomId);

    socket.on("message", async (payload: MessagePayload, ack: MessageAck) => {
        const parsed = sendMessageSchema.safeParse(payload);

        if (!parsed.success) {
            return sendAck(ack, {
                success: false,
                message: parsed.error.issues[0]?.message ?? "Invalid input",
            });
        }

        const receiver = parsed.data.receiver;

        // Same key regardless of who sends the message
        const conversationKey = generateConversationKey(currentUserId, receiver);

        try {
            const message = await messageRepository.create({
                ...parsed.data,
                conversationKey,
                sender: currentUserId,
            });

            io.to(`user:${receiver}`).emit("message", message);

            return sendAck(ack, { success: true });
        } catch (err: unknown) {
            // Keep enough context to trace failed messages in production
            logger.error(
                `Failed to send message: sender=${currentUserId}, receiver=${receiver}, conversation=${conversationKey}`,
                err,
            );

            return sendAck(ack, {
                success: false,
                message: "Faild to send message",
            });
        }
    });
};

export default registerChatHandlers;
