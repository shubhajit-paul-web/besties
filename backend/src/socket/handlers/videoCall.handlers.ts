import { Socket } from "socket.io";
import type {
    AnswerPayload,
    ICECandidatePayload,
    OfferPayload,
    VideoCallStateChangedPayload,
} from "../types/socket.types.js";

const registerVideoCallHandlers = (socket: Socket) => {
    const user = socket.user;
    const sender = {
        _id: user._id,
        name: user.name,
        username: user.username,
        avatar: user.avatar,
    };

    socket.on("call:video:offer", (payload: OfferPayload) => {
        socket.to(`user:${payload.to}`).emit("call:video:offer", {
            from: sender,
            offer: payload.offer,
        });
    });

    socket.on("call:video:answer", (payload: AnswerPayload) => {
        socket.to(`user:${payload.to}`).emit("call:video:answer", {
            from: sender,
            answer: payload.answer,
        });
    });

    socket.on("call:video:ice-candidate", (payload: ICECandidatePayload) => {
        socket.to(`user:${payload.to}`).emit("call:video:ice-candidate", {
            from: sender,
            candidate: payload.candidate,
        });
    });

    socket.on("call:video:cancel", ({ to }) => {
        socket.to(`user:${to}`).emit("call:video:cancel", {
            from: sender._id,
        });
    });

    socket.on("call:video:end", ({ to }) => {
        socket.to(`user:${to}`).emit("call:video:end", {
            from: sender._id,
        });
    });

    socket.on("call:video:media-state-changed", (payload: VideoCallStateChangedPayload) => {
        const { to, video, audio, screenShare } = payload;

        socket.to(`user:${to}`).emit("call:video:media-state-changed", {
            from: socket.user._id,
            video,
            audio,
            screenShare,
        });
    });
};

export default registerVideoCallHandlers;
