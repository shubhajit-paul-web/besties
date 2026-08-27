import type { Server, Socket } from "socket.io";
import type { MessageAck, MessagePayload } from "../types/socket.types.js";
import messageRepository from "../../repositories/message.repository.js";
import logger from "../../utils/logger.js";

const registerChatHandlers = async (io: Server, socket: Socket) => {
    const currentUserId = String(socket.user._id);
    const roomId = `user:${currentUserId}`;

    // Join user's private room for direct messages
    await socket.join(roomId);

    socket.on("message", async (payload: MessagePayload, ack: MessageAck) => {
        const { receiver, content } = payload;

        // Same key regardless of who sends the message
        const conversationKey = [currentUserId, receiver].sort().join(":");

        try {
            const message = await messageRepository.create({
                conversationKey,
                sender: currentUserId,
                receiver,
                content,
            });

            io.to(`user:${receiver}`).emit("message", message);

            if (typeof ack === "function") {
                ack({ success: true });
            }
        } catch (err: unknown) {
            // Keep enough context to trace failed messages in production
            logger.error(
                `Failed to send message: sender=${currentUserId}, receiver=${receiver}, conversation=${conversationKey}`,
                err,
            );

            if (typeof ack === "function") {
                ack({
                    success: false,
                    message: "Faild to send message",
                });
            }
        }
    });
};

export default registerChatHandlers;
