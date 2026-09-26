import { Socket } from "socket.io";
import type {
    AnswerPayload,
    ICECandidatePayload,
    OfferPayload,
    VideoCallStateChangedPayload,
} from "../types/socket.types.js";

const registerVideoCallHandlers = (socket: Socket) => {
    const user = socket.user;

    // Keep only the basic user info needed for the call.
    const sender = {
        _id: user._id,
        name: user.name,
        username: user.username,
        avatar: user.avatar,
    };

    // Someone starts a video call. Send the offer to the target user.
    socket.on("call:video:offer", (payload: OfferPayload) => {
        socket.to(`user:${payload.to}`).emit("call:video:offer", {
            from: sender,
            offer: payload.offer,
        });
    });

    // The other user answers the call with their media details.
    socket.on("call:video:answer", (payload: AnswerPayload) => {
        socket.to(`user:${payload.to}`).emit("call:video:answer", {
            from: sender,
            answer: payload.answer,
        });
    });

    // Share ICE candidates so peer connection can finish setup.
    socket.on("call:video:ice-candidate", (payload: ICECandidatePayload) => {
        socket.to(`user:${payload.to}`).emit("call:video:ice-candidate", {
            from: sender,
            candidate: payload.candidate,
        });
    });

    // Cancel the call if the caller ends it early.
    socket.on("call:video:cancel", ({ to }) => {
        socket.to(`user:${to}`).emit("call:video:cancel", {
            from: sender._id,
        });
    });

    // End the call for the other user.
    socket.on("call:video:end", ({ to }) => {
        socket.to(`user:${to}`).emit("call:video:end", {
            from: sender._id,
        });
    });

    // Tell the other user if camera, mic, or screen share changed state.
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
