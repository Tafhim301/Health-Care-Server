import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.join(process.cwd(), '.env') });

export default {
    node_env: process.env.NODE_ENV,
    port: process.env.PORT,
    database_url: process.env.DATABASE_URL,
    bcrypt_salt_round : Number(process.env.BCRYPT_SALT_ROUND),
    cloudinary : {
        api_secret : process.env.CLOUDINARY_API_SECRET,
        api_key : process.env.CLOUDINARY_API_KEY,
        cloud_name : process.env.CLOUDINARY_CLOUD_NAME,

    },
    openrouter_api_key : process.env.OPENROUTER_API_KEY
}