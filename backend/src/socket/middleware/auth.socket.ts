import type { Server } from "socket.io";
import * as cookie from "cookie";
import verifyAccessToken from "../../utils/verifyAccessToken.js";

const authenticateSocket = (io: Server) => {
    io.use((socket, next) => {
        try {
            const rawCookie = socket.handshake.headers.cookie || "";
            const { accessToken } = cookie.parseCookie(rawCookie);

            if (!accessToken) {
                return next(new Error("Unauthorize"));
            }

            const user = verifyAccessToken(accessToken);

            if (!user) {
                return next(new Error("Invalid access token"));
            }

            socket.user = user;
            next();
        } catch {
            next(new Error("Unauthorize"));
        }
    });
};

export default authenticateSocket;
