import config from "./environment.js";
import AuthApiDoc from "../swagger/auth.swagger.js";

const SwaggerConfig = {
    openapi: "3.0.0",

    info: {
        title: "Besties official APIs",
        description: "All the private and public APIs are listed here",
        version: "1.0.0",
        contact: {
            name: "Shubhajit Paul",
            email: "shubhajitbusinessid@gmail.com",
        },
    },

    servers: [{ url: config.SERVER_URL }],

    ...AuthApiDoc,
};

export default SwaggerConfig;
