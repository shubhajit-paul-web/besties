import type { Server, Socket } from "socket.io";
import presenceService from "../services/presence.service.js";

const registerPresenceHandlers = async (io: Server, socket: Socket) => {
    const { user } = socket;
    const userId = String(user._id);

    presenceService.setOnline(user);

    await presenceService.emitOnlineFriends(io, userId);

    socket.on("disconnect", async () => {
        presenceService.setOffline(userId);

        await presenceService.emitOnlineFriends(io, userId);
    });
};

export default registerPresenceHandlers;
