import nodemailer from "nodemailer";
import config from "./environment.js";

const SMTP = config.SMTP;

const transporter = nodemailer.createTransport({
    host: SMTP.HOST,
    port: SMTP.PORT,
    secure: SMTP.SECURE === "false" ? false : true,
    auth: {
        user: SMTP.USER,
        pass: SMTP.PASSWORD,
    },
});

export default transporter;
