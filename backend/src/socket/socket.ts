import { Server } from "socket.io";
import type { Server as HTTPServer } from "node:http";
import corsConfig from "../config/cors.js";
import authenticateSocket from "./middleware/auth.socket.js";
import registerPresenceHandlers from "./handlers/presence.handlers.js";

const initializeSocket = (httpServer: HTTPServer) => {
    const io = new Server(httpServer, {
        cors: corsConfig,
    });

    // Authentication middleware
    authenticateSocket(io);

    // Register event handlers
    io.on("connection", (socket) => {
        registerPresenceHandlers(socket, io);
    });

    return io;
};

export default initializeSocket;
