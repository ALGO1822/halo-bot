export interface WeatherResponse {
    city: string;
    temp: number;
    tempMax: number;
    tempMin: number;
    description: string;
    windSpeed: number;
    humidity: number;
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
}