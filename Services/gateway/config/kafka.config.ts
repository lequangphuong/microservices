import { registerAs } from "@nestjs/config";

export const CONFIG_KAFKA = 'KAFKA_GATEWAY';
export default registerAs(CONFIG_KAFKA, () => ({
    brokers: [process.env.BROKERS_ID]
}))
