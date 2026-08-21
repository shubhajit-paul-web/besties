import "socket.io";
import type { AccessTokenPayload } from "../../types/auth/auth.jwt.ts";

declare module "socket.io" {
    interface Socket {
        user: AccessTokenPayload;
    }
}
