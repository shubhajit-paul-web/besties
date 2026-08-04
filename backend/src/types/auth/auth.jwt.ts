import jwt from "jsonwebtoken";

export type AccessTokenPayload = jwt.JwtPayload & {
    _id: string;
    username: string;
    email: string;
    avatar: string | null;
    name: {
        first: string;
        last: string | null;
    };
};
