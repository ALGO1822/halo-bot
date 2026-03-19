import type { WeatherResponse } from '../types/weather.js'; 

const stickers = {
    hot: "CAACAgIAAxkBAAEQx3Npu6P2N943bzV2nsMiAQcR7hRn0QACagADlp-MDtZxZqMXQH8DOgQ", 
    very_hot: "CAACAgIAAxkBAAEQx2dpu6HQqhpy6nY7FNK42naSAAFXwkgAAg8AA8A2TxMF6NSF8tQOnzoE",
    rain: "CAACAgIAAxkBAAEQx2tpu6KD8UTyk_v17AdnGo2rVcgRSwACMgADJHFiGhrwA6rSATbpOgQ",
    storm: "CAACAgIAAxkBAAEQx2tpu6KD8UTyk_v17AdnGo2rVcgRSwACMgADJHFiGhrwA6rSATbpOgQ",
    windy: "CAACAgIAAxkBAAEQx3Fpu6NWcTLHR2Yz8gXSYfPYQDQAAQcAAiIJAAIYQu4IsJEOZWcMR6A6BA",
    perfect: "CAACAgIAAxkBAAEQx4tpu6zjZFlXFAJew7BJAi9d80GLVQACJQADO2AkFIJXwKgdRCEtOgQ",
    cold: "CAACAgIAAxkBAAEQx3Fpu6NWcTLHR2Yz8gXSYfPYQDQAAQcAAiIJAAIYQu4IsJEOZWcMR6A6BA",
    humid: "CAACAgIAAxkBAAEQx3Npu6P2N943bzV2nsMiAQcR7hRn0QACagADlp-MDtZxZqMXQH8DOgQ",
    default: "CAACAgIAAxkBAAEQx4Jpu6tbuNohiYdJpczs-W9OpoYBVwACbwAD9wLID-kz_ZsHgo4yOgQ"
};

const remarks = {
    storm: [
        "The sky will be throwing hands later. Stay indoors. ⚡",
        "Lightning is going to be active. You won't be immune.",
        "If it's not urgent, it won't be worth it today.",
        "Nature is going to be loud. You'll want to be inside. 🌩️"
    ],
    rain: [
        "It's going to rain. Act accordingly. ☔",
        "An umbrella will be recommended. Pride will be optional.",
        "Everything outside is about to become inconvenient.",
        "This is going to be a 'stay inside if you can' situation.",
        "You're going to get wet. Plan for it. 💧"
    ],
    very_hot: [
        "It's going to be extremely hot. Move carefully. 🔥",
        "The sun won't be your friend today.",
        "You'll basically be cooking later. Hydrate. 🥵",
        "Outside will be hostile. Stay in the shade.",
        "This won't be a fashion day. It'll be survival."
    ],
    hot: [
        "It's going to be hot. Keep movement to a minimum. ☀️",
        "The air will feel aggressive today.",
        "Hydrate before your body files a complaint later. 🚰",
        "Shade is going to be your best friend today.",
        "Outside will require preparation. Not vibes."
    ],
    cold: [
        "It's going to be cold. Dress like you respect yourself. 🧥",
        "Your body will complain later. Listen to it.",
        "Layer up or you'll regret it later. ❄️",
        "This won't be a 'light outfit' kind of day.",
        "Cold air incoming; bad decisions pending."
    ],
    windy: [
        "It will be windy. Secure your belongings. 🌬️",
        "The air is going to move with purpose today.",
        "Hold onto your hat—and your plans.",
        "Loose items won't be yours for much longer.",
        "Step outside carefully; the wind is going to have plans."
    ],
    humid: [
        "Humidity will be high. The air is going to feel heavy. 🌫️",
        "You're going to feel sticky. Accept it.",
        "Breathing will feel like effort today.",
        "Your comfort is about to be revoked.",
        "Everything is going to feel damp. Everything."
    ],
    perfect: [
        "It's going to be perfect weather. Don't waste it. 🌤️",
        "This will be a rare good day. Use it.",
        "You'll want to go outside. Seriously.",
        "There will be no complaints today. Just go out.",
        "The weather will be good. Your excuse won't be."
    ],
    default: [
        "The weather will be average. Proceed normally.",
        "Nothing special happening today. Just a day.",
        "Conditions will stay stable. So will expectations.",
        "It's going to be fine. Not great, not terrible.",
        "Weather will exist. That's the update."
    ]
};

export const generateSarcasticRemark = (data: Partial<WeatherResponse>): { message: string; stickerId: string | null } => {
    let category: keyof typeof remarks = 'default';

    const desc = data.description?.toLowerCase() || '';
    const temp = data.temp ?? 0;
    const wind = data.windSpeed ?? 0;
    const humidity = data.humidity ?? 0;

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
    const message = list[Math.floor(Math.random() * list.length)]!;

    return {
        message,
        stickerId: stickers[category] || null
    };
};