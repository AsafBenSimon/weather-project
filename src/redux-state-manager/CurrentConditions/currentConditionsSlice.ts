import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { RootState } from "../../app/store";
import { MeasurementUnits } from "../../Enums/Measurements";

// Define the Forecast structure
export interface ForecastDay {
  date: string;
  temperature: {
    metric: number;
    imperial: number;
  };
}

export interface CurrentConditionsState {
  isMetricMeasurement: boolean;
  WeatherText: string;
  Temperature: {
    Imperial: number;
    Metric: number;
  };
  LocalObservationDateTime: string | undefined;
  WeatherIcon: number | undefined;
  forecast: ForecastDay[];
  status: "idle" | "loading" | "failed";
  selectedCityKey: string | undefined;
}

const initialState: CurrentConditionsState = {
  isMetricMeasurement: true, // Default to metric
  WeatherText: "",
  Temperature: {
    Imperial: 0,
    Metric: 0,
  },
  LocalObservationDateTime: undefined,
  WeatherIcon: undefined,
  forecast: [],
  status: "idle",
  selectedCityKey: undefined, // Initialize it as undefined or a default value
};

const API_KEY =
  process.env.REACT_APP_ACCUWEATHER_API_KEY ||
  "krV1LedrWlI4U83mJ6fvNuOfYkFkqAfx"; // Use env variable for security

// Helper function to handle API errors
const handleApiError = (error: unknown) => {
  if (error instanceof Error) {
    throw new Error(error.message);
  } else {
    throw new Error("An unknown error occurred");
  }
};

// Fetch current conditions
export const fetchCurrentConditions = createAsyncThunk(
  "currentConditions/fetchCurrentConditions",
  async (cityKey: string) => {
    try {
      const response = await fetch(
        `http://dataservice.accuweather.com/currentconditions/v1/${cityKey}?apikey=${API_KEY}`
      );
      if (!response.ok) {
        throw new Error("Failed to fetch current conditions");
      }
      const data = await response.json();
      return data[0]; // Assuming the response is an array with a single object
    } catch (error) {
      handleApiError(error);
    }
  }
);

// Fetch 5-day forecast
export const fetchForecast = createAsyncThunk(
  "currentConditions/fetchForecast",
  async (cityKey: string) => {
    try {
      const response = await fetch(
        `http://dataservice.accuweather.com/forecasts/v1/daily/5day/${cityKey}?apikey=${API_KEY}`
      );
      if (!response.ok) {
        throw new Error("Failed to fetch forecast data");
      }
      const data = await response.json();
      return data.DailyForecasts.map((forecast: any) => ({
        date: forecast.Date,
        temperature: {
          metric: forecast.Temperature.Minimum.Value,
          imperial: forecast.Temperature.Maximum.Value,
        },
      }));
    } catch (error) {
      handleApiError(error);
    }
  }
);

export const currentConditionsSlice = createSlice({
  name: "current-condition",
  initialState,
  reducers: {
    changeMeasurementUnit: (state) => {
      state.isMetricMeasurement = !state.isMetricMeasurement;
    },
    setSelectedCityKey: (state, action: PayloadAction<string>) => {
      state.selectedCityKey = action.payload; // Set the selected city key
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchCurrentConditions.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchCurrentConditions.fulfilled, (state, action) => {
        state.status = "idle";
        const data = action.payload;
        state.WeatherText = data.WeatherText;
        state.Temperature.Metric = data.Temperature.Metric.Value;
        state.Temperature.Imperial = data.Temperature.Imperial.Value;
        state.LocalObservationDateTime = data.LocalObservationDateTime;
        state.WeatherIcon = data.WeatherIcon;
      })
      .addCase(fetchCurrentConditions.rejected, (state, action) => {
        state.status = "failed";
        console.error(
          "Error fetching current conditions:",
          action.error.message
        );
      })
      .addCase(fetchForecast.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchForecast.fulfilled, (state, action) => {
        state.status = "idle";
        state.forecast = action.payload; // Update forecast with fetched data
      })
      .addCase(fetchForecast.rejected, (state, action) => {
        state.status = "failed";
        console.error("Error fetching forecast data:", action.error.message);
      });
  },
});

export const { changeMeasurementUnit, setSelectedCityKey } =
  currentConditionsSlice.actions;

// Selectors
export const selectIsMetric = (state: RootState) =>
  state.currentConditions.isMetricMeasurement;

export const selectMeasurementIcon = (isMetricMeasurement: boolean) =>
  isMetricMeasurement ? MeasurementUnits.Metric : MeasurementUnits.Imperial;

export const selectTemperature = (state: RootState) =>
  state.currentConditions.isMetricMeasurement
    ? state.currentConditions.Temperature.Metric
    : state.currentConditions.Temperature.Imperial;

export const selectWeatherText = (state: RootState) =>
  state.currentConditions.WeatherText;

export const selectWeatherIcon = (state: RootState) =>
  state.currentConditions.WeatherIcon;

export const selectLocalObservationDateTime = (state: RootState) =>
  state.currentConditions.LocalObservationDateTime;

export const selectFirstDayForecast = (state: RootState) => {
  const firstDay = state.currentConditions.forecast[0];
  if (!firstDay) return null;
  return {
    date: firstDay.date,
    temperature: state.currentConditions.isMetricMeasurement
      ? firstDay.temperature.metric
      : firstDay.temperature.imperial,
    unit: state.currentConditions.isMetricMeasurement ? "°C" : "°F",
  };
};

export const selectSelectedCityKey = (state: RootState) =>
  state.currentConditions.selectedCityKey;

export default currentConditionsSlice.reducer;
