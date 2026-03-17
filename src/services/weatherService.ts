import axios from 'axios';
import type { WeatherResponse, VisualCrossingResponse } from '../types/weather.js';
import config from "../config/config.js"
import { generateSarcasticRemark } from '../logic/sarcasticEngine.js';

export class WeatherService {
    async getWeatherByCity(cityName: string): Promise<WeatherResponse> {
        try {
            const url = `https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline/${cityName}/today?key=${config.VISUAL_CROSSING_API_KEY}&unitGroup=metric&include=current`

            const { data }: { data: VisualCrossingResponse } = await axios.get(url);

            const baseData = {
                city: data.resolvedAddress,
                temp: data.currentConditions.temp,
                description: data.currentConditions.conditions ?? 'No description available',
                windSpeed: data.currentConditions.windspeed,
                humidity: data.currentConditions.humidity,
            }

            return {
                ...baseData,
                sarcasticRemark: generateSarcasticRemark(baseData)
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