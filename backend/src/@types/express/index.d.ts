import type { AccessTokenPayload } from "../../types/auth/auth.jwt.ts";
import type { RefreshAuthType } from "../../types/auth/auth.request.ts";

declare global {
    namespace Express {
        interface Request {
            user?: AccessTokenPayload;
            refreshAuth?: RefreshAuthType;
        }
    }
}

export {};
