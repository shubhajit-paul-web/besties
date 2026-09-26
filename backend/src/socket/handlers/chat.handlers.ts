import type { Server, Socket } from "socket.io";
import type { MessageAck, MessagePayload } from "../types/socket.types.js";
import { sendMessageSchema } from "../validators/chat.validator.js";
import messageRepository from "../../repositories/message.repository.js";
import logger from "../../utils/logger.js";
import generateConversationKey from "../../utils/generateConversationKey.js";
import sendAck from "../utils/sendAck.js";
import storageService from "../../services/storage.service.js";

const registerChatHandlers = async (io: Server, socket: Socket) => {
    const currentUserId = String(socket.user._id);
    const roomId = `user:${currentUserId}`;

    // Each user has one private room for direct messages.
    await socket.join(roomId);

    socket.on("message", async (payload: MessagePayload, ack: MessageAck) => {
        // Check the message before saving it.
        const parsed = sendMessageSchema.safeParse(payload);

        if (!parsed.success) {
            return sendAck(ack, {
                success: false,
                message: parsed.error.issues[0]?.message ?? "Invalid input",
            });
        }

        const receiver = parsed.data.receiver;

        // Use one key for both sides of the same chat.
        const conversationKey = generateConversationKey(currentUserId, receiver);

        try {
            const message = await messageRepository.create({
                ...parsed.data,
                conversationKey,
                sender: currentUserId,
            });

            // If a file was sent, make it ready to download.
            if (message.file?.path) {
                message.file.path = await storageService
                    .downloadFile(message.file.path)
                    .catch(() => "");
            }

            // Send the message only to the other user.
            io.to(`user:${receiver}`).emit("message", message);

            return sendAck(ack, { success: true });
        } catch (err: unknown) {
            // Save enough detail to fix message problems later.
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
