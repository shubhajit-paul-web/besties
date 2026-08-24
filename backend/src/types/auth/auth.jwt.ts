import jwt from "jsonwebtoken";
import type { UserDocument } from "../../models/types/user.types.js";

export type AccessTokenPayload = jwt.JwtPayload &
    Pick<UserDocument, "_id" | "username" | "email"> & {
        name: {
            first: string;
            last: string | null;
        };
        avatar: string | null;
    };
