import jwt from "jsonwebtoken";
import type { UserDocument } from "../../models/types/user.types.js";

export type AccessTokenPayload = jwt.JwtPayload &
    Pick<UserDocument, "username" | "email"> & {
        _id: string;
        name: {
            first: string;
            last: string | null;
        };
        avatar: string | null;
    };
