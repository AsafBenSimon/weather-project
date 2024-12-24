import { CurrentConditionsData } from "./../../types/CurrentConditions";
import { MeasurementUnits } from "./../../Enums/Measurements";
import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { RootState, AppThunk } from "../../app/store";
import { CurrentConditionsDisplay } from "../../types/CurrentConditions";

export interface CounterState {
  value: number;
  status: "idle" | "loading" | "failed";
}

const initialState: CurrentConditionsDisplay = {
  isMetricMeasurement: false,
  WeatherText: "",
  Temprature: {
    Imperial: 0,
    Metric: -242,
  },
};

export const currentConditionsSlice = createSlice({
  name: "current-condition",
  initialState,
  reducers: {
    changeMeasurementUnit: (state) => {
      state.isMetricMeasurement = !state.isMetricMeasurement;
    },
    // incrementByAmount: (state, action: PayloadAction<number>) => {
    //   state.value += action.payload;
    // },
  },
});

export const { changeMeasurementUnit } = currentConditionsSlice.actions;

// The function below is called a selector and allows us to select a value from
// the state. Selectors can also be defined inline where they're used instead of
// in the slice file. For example: `useSelector((state: RootState) => state.counter.value)`
export const selectCount = (state: RootState) => state.counter.value;

export const selectIsMetric = (state: RootState) =>
  state.currentConditions.isMetricMeasurement;

export const selectMeasurementIcon = (isMetricMeasurement: Boolean) =>
  isMetricMeasurement ? MeasurementUnits.Metric : MeasurementUnits.Imperial;

export const selectTemperature = (state: RootState) =>
  state.currentConditions.isMetricMeasurement
    ? state.currentConditions.Temprature.Metric
    : state.currentConditions.Temprature.Imperial;

// We can also write thunks by hand, which may contain both sync and async logic.
// Here's an example of conditionally dispatching actions based on current state.
// export const incrementIfOdd =
//   (amount: number): AppThunk =>
//   (dispatch, getState) => {
//     const currentValue = selectCount(getState());
//     if (currentValue % 2 === 1) {
//       dispatch(incrementByAmount(amount));
//     }
//   };

export default currentConditionsSlice.reducer;
