import express from "express";
import { Telegraf, Markup } from "telegraf";
import { WeatherService } from "../src/services/weatherService.js";
import config from "../src/config/config.js";
import { escapeMarkdown } from "../src/utils/format.js";

const app = express();
const bot = new Telegraf(config.TELEGRAM_BOT_TOKEN);
const weatherService = new WeatherService();

// Root route for sanity check
app.get("/", (req, res) =>
  res.send(
    "✅ Sarcastic Bot is ALIVE! (Send a POST request via Telegram to talk)",
  ),
);

// Start command with the location button
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
    ]).resize().oneTime() // resize makes the button smaller; oneTime hides it after use
  );
});

// 1. Text handler for manual city inputs
bot.on("text", async (ctx) => {
  const city = ctx.message.text;
  await handleWeatherRequest(ctx, city);
});

// 2. Location handler for GPS coordinates
bot.on("location", async (ctx) => {
  const { latitude, longitude } = ctx.message.location;
  const locationQuery = `${latitude},${longitude}`; // API handles "lat,lon" strings
  await handleWeatherRequest(ctx, locationQuery);
});

async function handleWeatherRequest(ctx: any, query: string) {
  try {
    const data = await weatherService.getWeatherByCity(query);

    const safeCity = escapeMarkdown(data.city); // This will be the resolved address
    const safeTemp = escapeMarkdown(data.temp);
    const safeTempMax = escapeMarkdown(data.tempMax);
    const safeTempMin = escapeMarkdown(data.tempMin);
    const safeWind = escapeMarkdown(data.windSpeed);
    const safeStatus = escapeMarkdown(data.description);
    const safeHumidity = escapeMarkdown(data.humidity);
    const safeVibe = escapeMarkdown(data.sarcasticRemark);

    // Send the sticker first if one exists
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
    await ctx.reply("Wait, where is that? Even my satellites are confused.");
  }
}

app.use(express.json());

// Webhook setup for Vercel
app.post("/api/index", bot.webhookCallback("/api/index"));

app.get("/api/index", (req, res) => res.send("✅ Webhook route is reachable!"));

export default app;