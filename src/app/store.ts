import { configureStore, ThunkAction, Action } from "@reduxjs/toolkit";
import counterReducer from "../redux-state-manager/counter/counterSlice";
import currentConditionsReducer from "../redux-state-manager/CurrentConditions/currentConditionsSlice";

export const store = configureStore({
  reducer: {
    counter: counterReducer,
    currentConditions: currentConditionsReducer,
  },
});

export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>;
export type AppThunk<ReturnType = void> = ThunkAction<
  ReturnType,
  RootState,
  unknown,
  Action<string>
>;
