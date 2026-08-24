import { Server } from "socket.io";
import type { Server as HTTPServer } from "node:http";
import corsConfig from "../config/cors.js";
import authenticateSocket from "./middleware/auth.socket.js";
import registerPresenceHandlers from "./handlers/presence.handlers.js";
import registerChatHandlers from "./handlers/chat.handlers.js";

const initializeSocket = (httpServer: HTTPServer) => {
    const io = new Server(httpServer, {
        cors: corsConfig,
    });

    // Authentication middleware
    authenticateSocket(io);

    // Register event handlers on "connection" event
    io.on("connection", async (socket) => {
        await registerPresenceHandlers(io, socket);
        await registerChatHandlers(io, socket);
    });

    return io;
};

export default initializeSocket;
