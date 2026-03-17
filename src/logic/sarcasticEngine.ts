import type { WeatherResponse } from '../types/weather';

const remarks = {
    hot: [
        "It's over 30°C. You're basically a human suya at this point. 🥵",
        "Even your laptop is sweating. Give it a rest before it melts. 💻🔥",
        "It's so hot I'm surprised your code hasn't caught fire yet."
    ],
    rain: [
        "It's raining. Perfect time to stay in and fix those bugs you've been avoiding. 🌧️",
        "The sky is crying because of your last commit message. ☔",
        "Rainy vibes. Hope you've pushed your code before NEPA takes the light. 🔌"
    ],
    windy: [
        "Wind speed is high! Hold onto your laptop or your local branches might literally blow away. 🌬️",
        "It's breezy. Good for cooling your laptop, bad for your hair."
    ],
    perfect: [
        "The weather is actually... nice? This is suspicious. Go back to your IDE. 🧐",
        "22-25°C. The universe is giving you a break. Use it to refactor your code."
    ],
    default: [
        "The weather is mid. Just like your variable naming conventions. 🤖",
        "Not hot, not raining. Just... existing. Like a server with 99.9% uptime."
    ]
};

export const generateSarcasticRemark = (data: Partial<WeatherResponse>): string => {
    let category: keyof typeof remarks = 'default';

    if (data.description?.toLowerCase().includes('rain')) category = 'rain';
    else if ((data.temp ?? 0) > 30) category = 'hot';
    else if ((data.windSpeed ?? 0) > 15) category = 'windy';
    else if ((data.temp ?? 0) >= 20 && (data.temp ?? 0) <= 26) category = 'perfect';

    const list = remarks[category];
    return list[Math.floor(Math.random() * list.length)]!;
};