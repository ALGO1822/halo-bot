import dotenv from 'dotenv';
import { WeatherService } from './services/weatherService';

dotenv.config();

const weather = new WeatherService();

weather.getWeatherByCity('Ikere')
  .then(data => console.log('Weather Data Fetched:', data))
  .catch(err => console.error(err.message));