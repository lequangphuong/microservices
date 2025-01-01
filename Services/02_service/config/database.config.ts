import { registerAs } from "@nestjs/config";

export const CONFIG_DATABASE = 'database';
export default registerAs(CONFIG_DATABASE, () => ({
    users: {
        dbName: process.env.DATABASE_NAME,
        uri: process.env.DATABASE_URI,
    }
}))
