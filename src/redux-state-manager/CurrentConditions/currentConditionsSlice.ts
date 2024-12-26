import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { RootState } from "../../app/store";
import { MeasurementUnits } from "../../Enums/Measurements";
import { CurrentConditionsDisplay } from "../../types/CurrentConditions";

// Fix the spelling error here: 'Temprature' should be 'Temperature'
export interface CurrentConditionsState {
  isMetricMeasurement: boolean;
  WeatherText: string;
  Temperature: {
    Imperial: number;
    Metric: number;
  };
  LocalObservationDateTime: string | undefined;
  WeatherIcon: number | undefined;
  status: "idle" | "loading" | "failed";
}

const initialState: CurrentConditionsState = {
  isMetricMeasurement: false,
  WeatherText: "",
  Temperature: {
    Imperial: 0,
    Metric: 0, // Update default temperature value if necessary
  },
  LocalObservationDateTime: undefined,
  WeatherIcon: undefined,
  status: "idle", // Set the initial status to "idle"
};

// Create async thunk to fetch weather data
export const fetchCurrentConditions = createAsyncThunk(
  "currentConditions/fetchCurrentConditions",
  async (cityKey: string) => {
    // You can replace this with an actual API call
    const response = await fetch(
      `http://dataservice.accuweather.com/currentconditions/v1/${cityKey}?apikey=your_api_key_here`
    );
    const data = await response.json();
    return data[0]; // Assuming the response has the data in an array format
  }
);

export const currentConditionsSlice = createSlice({
  name: "current-condition",
  initialState,
  reducers: {
    changeMeasurementUnit: (state) => {
      state.isMetricMeasurement = !state.isMetricMeasurement;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchCurrentConditions.pending, (state) => {
        state.status = "loading"; // Set loading state when the fetch is in progress
      })
      .addCase(fetchCurrentConditions.fulfilled, (state, action) => {
        state.status = "idle"; // Set idle state when the fetch is successful
        const data = action.payload;
        state.WeatherText = data.WeatherText;
        state.Temperature.Metric = data.Temperature.Metric.Value;
        state.Temperature.Imperial = data.Temperature.Imperial.Value;
        state.LocalObservationDateTime = data.LocalObservationDateTime;
        state.WeatherIcon = data.WeatherIcon;
      })
      .addCase(fetchCurrentConditions.rejected, (state) => {
        state.status = "failed"; // Set failed state if the fetch fails
      });
  },
});

export const { changeMeasurementUnit } = currentConditionsSlice.actions;

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

export default currentConditionsSlice.reducer;
