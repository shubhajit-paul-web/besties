import type { SendEmailOptions } from "../types/email/email.service.js";
import transporter from "../config/email.js";
import config from "../config/environment.js";
import ApiError from "../utils/apiError.js";
import { StatusCodes } from "http-status-codes";
import getErrorMessage from "../utils/getErrorMessage.js";

const sendEmail = async (options: SendEmailOptions) => {
    try {
        await transporter.sendMail({
            from: config.SMTP.FROM,
            ...options,
        });
    } catch (err) {
        throw new ApiError(StatusCodes.INTERNAL_SERVER_ERROR, "Failed to send email", false, {
            details: getErrorMessage(err),
        });
    }
};

export default {
    sendEmail,
};
