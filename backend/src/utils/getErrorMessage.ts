// Normalizes unknown thrown values into a safe, readable message.
function getErrorMessage(error: unknown): string {
    return error instanceof Error ? error.message : String(error);
}

export default getErrorMessage;
