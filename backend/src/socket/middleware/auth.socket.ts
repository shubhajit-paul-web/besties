import type { Server } from "socket.io";
import * as cookie from "cookie";
import verifyAccessToken from "../../utils/verifyAccessToken.js";

const authenticateSocket = (io: Server) => {
    io.use((socket, next) => {
        try {
            const rawCookie = socket.handshake.headers.cookie || "";
            const { accessToken } = cookie.parseCookie(rawCookie);

            if (!accessToken) {
                throw new Error("Unauthorize");
            }

            const decoded = verifyAccessToken(accessToken);

            socket.user = decoded;
            next();
        } catch {
            next(new Error("Unauthorize"));
        }
    });
};

export default authenticateSocket;
