import express from "express";
import { Telegraf, Markup } from "telegraf";
import { WeatherService } from "../src/services/weatherService.js";
import config from "../src/config/config.js";
import { escapeMarkdown } from "../src/utils/format.js";

const app = express();
const bot = new Telegraf(config.TELEGRAM_BOT_TOKEN);
const weatherService = new WeatherService();

app.get("/", (req, res) =>
  res.send(
    "✅ Sarcastic Bot is ALIVE! (Send a POST request via Telegram to talk)",
  ),
);

bot.start((ctx) => {
  const firstName = ctx.from.username || "there";

  const welcomeMessage =
    `Hey ${firstName}.\n\n` +
    `Step outside blindly if you want.\n` +
    `Or send a city and be prepared.\n\n` +
    `Your choice.`;

  return ctx.reply(
    welcomeMessage,
    Markup.keyboard([
      [Markup.button.locationRequest("📍 Send My Location")],
    ]).resize().oneTime()
  );
});

bot.on("location", async (ctx) => {
  const { latitude, longitude } = ctx.message.location;
  const locationQuery = `${latitude},${longitude}`

  try {
    const data = await weatherService.getWeatherByCity(locationQuery);

    const safeCity = escapeMarkdown(data.city);
    const safeTemp = escapeMarkdown(data.temp);
    const safeTempMax = escapeMarkdown(data.tempMax);
    const safeTempMin = escapeMarkdown(data.tempMin);
    const safeWind = escapeMarkdown(data.windSpeed);
    const safeStatus = escapeMarkdown(data.description);
    const safeHumidity = escapeMarkdown(data.humidity);
    const safeVibe = escapeMarkdown(data.sarcasticRemark);

    if (data.stickerId) {
        await ctx.replyWithSticker(data.stickerId);
    }

    const message = [
      `🌍 *Weather in ${safeCity}*`,
      `🌡 *Avg Temp:* ${safeTemp}°C`,
      `📈 *High:* ${safeTempMax}°C`,
      `📉 *Low:* ${safeTempMin}°C`,
      `🌬 *Wind:* ${safeWind} km/h`,
      `💧 *Humidity:* ${safeHumidity}%`,
      `☁️ *Status:* ${safeStatus}`,
      ``,
      `_${safeVibe}_`,
    ].join("\n");

    await ctx.replyWithMarkdownV2(message);
  } catch (err: any) {
    console.error("Telegram Error:", err.description || err.message);
    await ctx.reply("Wait, where is that?");
  }
});

app.use(express.json());

app.post("/api/index", bot.webhookCallback("/api/index"));

app.get("/api/index", (req, res) => res.send("✅ Webhook route is reachable!"));

export default app;
