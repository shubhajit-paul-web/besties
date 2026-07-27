import type { AccessTokenPayload } from "../../types/auth/auth.jwt.ts";

declare global {
    namespace Express {
        interface Request {
            user?: AccessTokenPayload;
        }
    }
}

export {};
