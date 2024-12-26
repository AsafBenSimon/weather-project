import axios from "axios";
import { CityData, WeatherForecast } from "../../types/CityData";
import { CurrentConditionsData } from "../../types/CurrentConditions";

const API_KEY = "krV1LedrWlI4U83mJ6fvNuOfYkFkqAfx";

export const weatherService = {
  // Fetch city suggestions
  getCities: async (query: string): Promise<CityData[]> => {
    const response = await axios.get(
      `https://dataservice.accuweather.com/locations/v1/cities/autocomplete`,
      {
        params: {
          apikey: API_KEY,
          q: query,
        },
      }
    );
    return response.data;
  },

  // Fetch current conditions for a city
  getCityCurrentConditions: async (
    cityKey: string
  ): Promise<CurrentConditionsData> => {
    const response = await axios.get(
      `https://dataservice.accuweather.com/currentconditions/v1/${cityKey}`,
      {
        params: {
          apikey: API_KEY,
        },
      }
    );
    return response.data[0];
  },

  // Fetch 5-day weather forecast for a city
  getForecast: async (
    cityKey: string
  ): Promise<{ DailyForecasts: WeatherForecast[] }> => {
    const response = await axios.get(
      `https://dataservice.accuweather.com/forecasts/v1/daily/5day/${cityKey}`,
      {
        params: {
          apikey: API_KEY,
          metric: true,
        },
      }
    );
    return response.data;
  },
};
