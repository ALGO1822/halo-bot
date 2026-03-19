import axios from "axios";
import type {
  WeatherResponse,
  VisualCrossingResponse,
} from "../types/weather.js";
import config from "../config/config.js";
import { generateSarcasticRemark } from "../logic/sarcasticEngine.js";

export class WeatherService {
  async getWeatherByCity(cityName: string): Promise<WeatherResponse> {
    try {
      const url = `https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline/${cityName}/today?key=${config.VISUAL_CROSSING_API_KEY}&unitGroup=metric&include=days,current`;

      const { data }: { data: VisualCrossingResponse } = await axios.get(url);
      const todayForecast = data.days[0]!;
      const current = data.currentConditions;

      const currentData = {
        temp: current.temp,
        description: current.conditions,
        windSpeed: current.windspeed,
        humidity: current.humidity,
      };

      const dailyExtremes = {
        tempMax: todayForecast.tempmax,
        tempMin: todayForecast.tempmin,
      };

      const dailyVibe = generateSarcasticRemark({
        ...currentData,
        ...dailyExtremes,
      });
      const currentSticker = generateSarcasticRemark(currentData).stickerId;

      return {
        city: data.resolvedAddress,
        ...currentData,
        ...dailyExtremes,
        sarcasticRemark: dailyVibe.message,
        stickerId: currentSticker,
      };
    } catch (error: any) {
      if (error.response) {
        console.error("OpenWeather Error Detail:", error.response.data);
        console.error("Status Code:", error.response.status);
      } else {
        console.error("Request Error:", error.message);
      }
      throw new Error(
        `Weather Fetch Failed: ${error.response?.data?.message || error.message}`,
      );
    }
  }
}
