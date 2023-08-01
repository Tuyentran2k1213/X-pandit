const dotenv = require('dotenv');

dotenv.config();

export const awsServices = {
    region: process.env.MY_AWS_REGION,
    accessKeyId: process.env.MY_AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.MY_AWS_SECRET_ACCESS_KEY,
    imageBucketName: process.env.MY_AWS_IMAGE_BUCKET_NAME,
}

export const database = {
    dbClusterPassword: process.env.DB_CLUSTER_PASSWORD,
    dbAccessPassWord: process.env.DB_ACCESS_PASSWORD,
    dbAuthPassWord: process.env.DB_AUTH_PASSWORD,
    dbAddress: process.env.DB_ADDRESS_URL,
}

export const jsonWebToken = {
    secretQuestion: process.env.JWT_SECRET_KEY,
    expiresTime: process.env.EXPIRES_TIME,
}