// src/types/CityData.ts
export interface CityDataReceive {
  Key: string; // The key returned by the API is a string
  LocalizedName: string; // City name
  Country: {
    ID: string; // Country code, e.g., "US", "AU"
  };
}

export interface CityData {
  Key: string; // Changed to string to match the API response
  LocalizedName: string;
  CountryId: string; // Country ID directly
}

// src/types/ForecastData.ts
export interface Temperature {
  Minimum: {
    Value: number;
    Unit: string; // e.g., "C" or "F"
  };
  Maximum: {
    Value: number;
    Unit: string;
  };
}

export interface WeatherForecast {
  Date: string; // ISO date string
  Day: {
    IconPhrase: string; // Description of the day's weather
    Icon: number; // Weather icon ID
  };
  Night: {
    IconPhrase: string; // Description of the night's weather
    Icon: number; // Weather icon ID
  };
  Temperature: Temperature;
}

// src/types/CurrentConditions.ts
export interface CurrentConditionsData {
  WeatherText: string; // Description of current weather, e.g., "Sunny"
  Temperature: {
    Metric: {
      Value: number; // Temperature value in Celsius
      Unit: string; // Unit, e.g., "C"
    };
    Imperial: {
      Value: number; // Temperature value in Fahrenheit
      Unit: string; // Unit, e.g., "F"
    };
  };
}
