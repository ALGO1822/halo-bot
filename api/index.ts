import express from 'express';
import { Telegraf } from 'telegraf';
import { WeatherService } from '../src/services/weatherService.js';
import config from '../src/config/config.js';
import { escapeMarkdown } from '../src/utils/format.js';

const app = express();
const bot = new Telegraf(config.TELEGRAM_BOT_TOKEN);
const weatherService = new WeatherService();

app.get('/', (req, res) => res.send('✅ Sarcastic Bot is ALIVE! (Send a POST request via Telegram to talk)'));

bot.start((ctx) => {
    const firstName = ctx.from.first_name || "User";
    const welcomeMessage = 
        `👋 <b>Welcome to the Sarcastic Weather Bot, ${firstName}!</b>\n\n` +
        `I provide real-time weather updates with a side of unnecessary sass.\n\n` +
        `📌 <b>How to use:</b>\n` +
        `Just send me the name of any city (e.g., <i>Ikere</i> or <i>Lagos</i>) and I'll give you a vibe check.\n\n` +
        `<i>Try not to get offended by my satellites.</i>`;

    return ctx.replyWithHTML(welcomeMessage);
});

bot.on('text', async (ctx) => {
    const city = ctx.message.text;
    
    try {
        const data = await weatherService.getWeatherByCity(city);
        
        const safeCity = escapeMarkdown(data.city);
        const safeTemp = escapeMarkdown(data.temp);
        const safeWind = escapeMarkdown(data.windSpeed);
        const safeStatus = escapeMarkdown(data.description);
        const safeHumidity = escapeMarkdown(data.humidity);
        const safeVibe = escapeMarkdown(data.sarcasticRemark);

        const message = [
            `🌍 *Weather in ${safeCity}*`,
            `🌡 *Temp:* ${safeTemp}°C`,
            `🌬 *Wind:* ${safeWind} km/h`,
            `💧 *Humidity:* ${safeHumidity}%`,
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

app.post('/api/index', bot.webhookCallback('/api/index'));

app.get('/api/index', (req, res) => res.send('✅ Webhook route is reachable!'));

export default app;
