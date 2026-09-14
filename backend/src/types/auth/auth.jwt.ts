import jwt from "jsonwebtoken";
import type { UserDocument } from "../../models/types/user.types.js";
import { Types } from "mongoose";

export type AccessTokenPayload = jwt.JwtPayload &
    Pick<UserDocument, "username" | "email"> & {
        _id: string | Types.ObjectId;
        name: {
            first: string;
            last: string | null;
        };
        avatar: string | null;
    };
