import { Socket } from "socket.io";

type OfferPayload = {
    to: string;
    offer: object;
};

const registerVideoCallHandlers = (socket: Socket) => {
    socket.on("offer", (payload: OfferPayload) => {
        const sender = socket.user;

        socket.to(`user:${payload.to}`).emit("offer", {
            from: {
                _id: sender._id,
                name: sender.name,
                username: sender.username,
                avatar: sender.avatar,
            },
            offer: payload.offer,
        });
    });
};

export default registerVideoCallHandlers;
