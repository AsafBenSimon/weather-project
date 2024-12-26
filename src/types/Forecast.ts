// types/Forecast.ts

export interface ForecastResponse {
  DailyForecasts: Array<{
    Date: string;
    Day: {
      IconPhrase: string;
      Icon: number;
    };
    Temperature: {
      Minimum: {
        Value: number;
      };
      Maximum: {
        Value: number;
      };
    };
  }>;
}
