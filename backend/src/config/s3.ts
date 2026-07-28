import { S3Client } from "@aws-sdk/client-s3";
import config from "./environment.js";

const s3 = new S3Client({
    region: config.AWS.REGION,
    endpoint: `https://s3-${config.AWS.REGION}.amazonaws.com`,
    credentials: {
        accessKeyId: config.AWS.ACCESS_KEY_ID!,
        secretAccessKey: config.AWS.SECRET_ACCESS_KEY!,
    },
});

export default s3;
