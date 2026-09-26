import { MessageAck } from "../types/socket.types.js";

/**
 * Sends a response back to the caller when an ack callback is available.
 *
 * @param ack - The callback to run, if one was provided by the client.
 * @param response - The data to send back through that callback.
 */
const sendAck = <T = unknown>(
    ack: MessageAck<T> | undefined,
    response: Parameters<MessageAck<T>>[0],
) => {
    if (typeof ack === "function") {
        ack(response);
    }
};

export default sendAck;
