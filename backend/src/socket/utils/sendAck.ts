import { MessageAck } from "../types/socket.types.js";

const sendAck = <T = unknown>(
    ack: MessageAck<T> | undefined,
    response: Parameters<MessageAck<T>>[0],
) => {
    if (typeof ack === "function") {
        ack(response);
    }
};

export default sendAck;
