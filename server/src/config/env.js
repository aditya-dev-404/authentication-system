import dotenv from 'dotenv'
dotenv.config();

export const ENV = {
    PORT : process.env.PORT,
    MONGO_URI : process.env.MONGO_URI,
    SECRET_KEY : process.env.SECRET_KEY,
    NODE_ENV : process.env.NODE_ENV,
    SMTP_USER:process.env.SMTP_USER,
    SMTP_PASS:process.env.SMTP_PASS,
    SENDER_EMAIL:process.env.SENDER_EMAIL
}