import type { Server, Socket } from "socket.io";
import presenceService from "../services/presence.service.js";

const registerPresenceHandlers = async (io: Server, socket: Socket) => {
    const { user } = socket;
    const userId = String(user._id);

    // Mark this user as online when they connect.
    presenceService.setOnline(user);

    // Tell their friends the current online status.
    await presenceService.emitOnlineFriends(io, userId);

    socket.on("disconnect", async () => {
        // When the socket closes, mark the user offline and refresh friends list.
        presenceService.setOffline(userId);

        await presenceService.emitOnlineFriends(io, userId);
    });
};

export default registerPresenceHandlers;
