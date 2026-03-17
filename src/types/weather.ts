export interface WeatherResponse {
    city: string;
    temp: number;
    description: string;
    windSpeed: number;
    humidity: number;
    sarcasticRemark: string;
}

export interface VisualCrossingResponse {
    resolvedAddress: string;
    currentConditions: {
        temp: number;
        conditions: string;
        windspeed: number;
        humidity: number;
    }
}