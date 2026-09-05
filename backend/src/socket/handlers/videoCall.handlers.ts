import { Socket } from "socket.io";
import { AnswerPayload, ICECandidatePayload, OfferPayload } from "../types/socket.types.js";

const registerVideoCallHandlers = (socket: Socket) => {
    const user = socket.user;
    const sender = {
        _id: user._id,
        name: user.name,
        username: user.username,
        avatar: user.avatar,
    };

    socket.on("offer", (payload: OfferPayload) => {
        socket.to(`user:${payload.to}`).emit("offer", {
            from: sender,
            offer: payload.offer,
        });
    });

    socket.on("answer", (payload: AnswerPayload) => {
        socket.to(`user:${payload.to}`).emit("answer", {
            from: sender,
            answer: payload.answer,
        });
    });

    socket.on("ice-candidate", (payload: ICECandidatePayload) => {
        socket.to(`user:${payload.to}`).emit("ice-candidate", {
            from: sender,
            candidate: payload.candidate,
        });
    });
};

export default registerVideoCallHandlers;
