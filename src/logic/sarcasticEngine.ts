import type { WeatherResponse } from '../types/weather.js'; 

const remarks = {
    storm: [
        "The sky is throwing hands. Stay indoors. ⚡",
        "Thunder means go home. Immediately. ⛈️",
        "Lightning is active. You are not immune.",
        "If it's not urgent, it's not worth it today.",
        "Nature is loud. You should be inside. 🌩️"
    ],
    rain: [
        "It's raining. Act accordingly. ☔",
        "Umbrella recommended. Pride is optional.",
        "Everything outside is now inconvenient.",
        "This is a 'stay inside if you can' situation.",
        "You're going to get wet. Plan for it. 💧"
    ],
    very_hot: [
        "It's extremely hot. Move carefully. 🔥",
        "The sun is not your friend today.",
        "You're basically cooking. Hydrate. 🥵",
        "Outside is hostile. Stay in shade.",
        "This is not a fashion day. It's survival."
    ],
    hot: [
        "It's hot. Keep movement to a minimum. ☀️",
        "The air feels aggressive today.",
        "Hydrate before your body files a complaint. 🚰",
        "Shade is your best friend right now.",
        "Outside requires preparation. Not vibes."
    ],
    cold: [
        "It's cold. Dress like you respect yourself. 🧥",
        "Your body will complain. Listen to it.",
        "Layer up or regret it later. ❄️",
        "This is not a 'light outfit' kind of day.",
        "Cold air, bad decisions pending."
    ],
    windy: [
        "It's windy. Secure your belongings. 🌬️",
        "The air is moving with purpose today.",
        "Hold onto your hat—and your plans.",
        "Loose items are no longer yours.",
        "Step outside carefully. The wind has plans."
    ],
    humid: [
        "Humidity is high. The air feels heavy. 🌫️",
        "You're going to feel sticky. Accept it.",
        "Breathing feels like effort today.",
        "Your comfort has been revoked.",
        "Everything feels damp. Everything."
    ],
    perfect: [
        "Perfect weather. Don't waste it. 🌤️",
        "This is a rare good day. Use it.",
        "Go outside. Seriously.",
        "No complaints today. Just go out.",
        "Weather is good. Your excuse isn't."
    ],
    default: [
        "The weather is average. Proceed normally.",
        "Nothing special today. Just a day.",
        "Conditions are stable. So are expectations.",
        "It's fine. Not great, not terrible.",
        "Weather exists. That's the update."
    ]
};

export const generateSarcasticRemark = (data: Partial<WeatherResponse>): string => {
    let category: keyof typeof remarks = 'default';

    const desc = data.description?.toLowerCase() || '';
    const temp = data.temp ?? 0;
    const wind = data.windSpeed ?? 0;
    const humidity = data.humidity ?? 0;

    // Priority: Storm > Extreme Temp > Rain > Windy > Humid > Perfect > Default
    if (desc.includes('storm') || desc.includes('thunder')) {
        category = 'storm';
    } else if (temp > 35) {
        category = 'very_hot';
    } else if (temp < 18) {
        category = 'cold';
    } else if (desc.includes('rain') || desc.includes('drizzle')) {
        category = 'rain';
    } else if (temp > 30) {
        category = 'hot';
    } else if (wind > 25) {
        category = 'windy';
    } else if (humidity > 80) {
        category = 'humid';
    } else if (temp >= 20 && temp <= 27) {
        category = 'perfect';
    }

    const list = remarks[category];
    return list[Math.floor(Math.random() * list.length)]!;
};