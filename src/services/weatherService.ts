import axios from "axios";
import type {
  WeatherResponse,
  VisualCrossingResponse,
} from "../types/weather.js";
import config from "../config/config.js";
import { generateSarcasticRemark } from "../logic/sarcasticEngine.js";

export class WeatherService {
  private async getCityName(query: string): Promise<string> {
    const cleanQuery = query.trim();
    // Check if the query is coordinates (contains a comma)
    if (cleanQuery.includes(",")) {
      const [lat, lon] = cleanQuery.split(",").map((c) => c.trim());
      try {
        // Nominatim API call (OpenStreetMap)
        const url = `https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lon}&format=json&addressdetails=1`;
        const { data } = await axios.get(url, {
          headers: { "User-Agent": "HaloWeatherBot/1.0" }, // Nominatim requires a User-Agent
        });

        // Pick the most relevant name (city, town, or village)
        const city =
          data.address.city ||
          data.address.town ||
          data.address.village ||
          data.address.suburb ||
          data.address.county;

        // If a specific city isn't found, use the first part of the display name
        return city || data.display_name.split(",")[0];
      } catch (error) {
        console.error("Reverse Geocoding failed:", error);
        return cleanQuery; // Fallback to raw coords
      }
    }
    return cleanQuery;
  }

  async getWeatherByCity(cityName: string): Promise<WeatherResponse> {
    try {
      const resolvedName = await this.getCityName(cityName);

      const encodedName = encodeURIComponent(resolvedName);
      const url = `https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline/${encodedName}/today?key=${config.VISUAL_CROSSING_API_KEY}&unitGroup=metric&include=days,current`;

      const { data }: { data: VisualCrossingResponse } = await axios.get(url);

      if (!data.days || data.days.length === 0 || !data.currentConditions) {
        throw new Error("Location found, but no weather data available.");
      }
      
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
