export interface WeatherResponse {
    city: string;
    temp: number; // Current Temperature
    tempMax: number; // Daily High
    tempMin: number; // Daily Low
    description: string; // Current Condition
    windSpeed: number; // Current Wind Speed
    humidity: number; // Current Humidity
    sarcasticRemark: string;
    stickerId?: string | null;
}

export interface VisualCrossingResponse {
    resolvedAddress: string;
    days: Array<{
        tempmax: number;
        tempmin: number;
        temp: number;
        conditions: string;
        windspeed: number;
        humidity: number;
    }>;

    currentConditions: {
        temp: number;
        conditions: string;
        windspeed: number;
        humidity: number;
    };
}