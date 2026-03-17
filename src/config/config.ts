import dotenv from "dotenv";

dotenv.config();

interface Config {
    TELEGRAM_BOT_TOKEN: string;
    VISUAL_CROSSING_API_KEY: string;
}

const config: Config = {
    TELEGRAM_BOT_TOKEN: process.env.TELEGRAM_BOT_TOKEN || "",
    VISUAL_CROSSING_API_KEY: process.env.VISUAL_CROSSING_API_KEY || "",
}

export default config;