import axios from 'axios';
import type { WeatherResponse, VisualCrossingResponse } from '../types/weather.js';
import config from "../config/config.js"
import { generateSarcasticRemark } from '../logic/sarcasticEngine.js';

export class WeatherService {
    async getWeatherByCity(cityName: string): Promise<WeatherResponse> {
        try {
            const url = `https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline/${cityName}/today?key=${config.VISUAL_CROSSING_API_KEY}&unitGroup=metric&include=days`

            const { data }: { data: VisualCrossingResponse } = await axios.get(url);
            const today = data.days[0]!;


            const baseData = {
                city: data.resolvedAddress,
                temp: today.temp, // Average temp for the day
                tempMax: today.tempmax,
                tempMin: today.tempmin,
                description: today.conditions,
                windSpeed: today.windspeed,
                humidity: today.humidity,
            };

            const { message, stickerId } = generateSarcasticRemark(baseData);

            return {
                ...baseData,
                sarcasticRemark: message,
                stickerId
            };
        } catch (error: any) {
            if (error.response) {
                console.error("OpenWeather Error Detail:", error.response.data);
                console.error("Status Code:", error.response.status);
            } else {
                console.error("Request Error:", error.message);
            }
            throw new Error(`Weather Fetch Failed: ${error.response?.data?.message || error.message}`);
        }
    }
}