import { Server } from "socket.io";
import type { Server as HTTPServer } from "node:http";
import config from "../config/environment.js";

const initializeSocket = (httpServer: HTTPServer) => {
    const io = new Server(httpServer, {
        cors: {
            origin: config.ALLOWED_ORIGIN,
            credentials: true,
        },
    });

    return io;
};

export default initializeSocket;
