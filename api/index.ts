import express from 'express';
import { Telegraf } from 'telegraf';
import { WeatherService } from '../src/services/weatherService';
import config from '../src/config/config';
import { escapeMarkdown } from '../src/utils/format';

const app = express();
const bot = new Telegraf(config.TELEGRAM_BOT_TOKEN);
const weatherService = new WeatherService();

bot.on('text', async (ctx) => {
    const city = ctx.message.text;
    
    try {
        const data = await weatherService.getWeatherByCity(city);
        
        const safeCity = escapeMarkdown(data.city);
        const safeTemp = escapeMarkdown(data.temp);
        const safeWind = escapeMarkdown(data.windSpeed);
        const safeStatus = escapeMarkdown(data.description);
        const safeVibe = escapeMarkdown(data.sarcasticRemark);

        const message = [
            `🌍 *Weather in ${safeCity}*`,
            `🌡 *Temp:* ${safeTemp}°C`,
            `🌬 *Wind:* ${safeWind} km/h`,
            `☁️ *Status:* ${safeStatus}`,
            ``,
            `_${safeVibe}_`
        ].join('\n');
        
        await ctx.replyWithMarkdownV2(message);
    } catch (err: any) {
        console.error("Telegram Error:", err.description || err.message);
        await ctx.reply("Wait, where is that? Even my satellites are confused.");
    }
});

app.use(express.json());

app.use(bot.webhookCallback('/api/index'));

export default app;
