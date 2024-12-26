import { MeasurementUnits } from "../Enums/Measurements";
import { Temperature } from "./Temperature";

export interface CurrentConditionsData {
  LocalObservationDateTime: any;
  Temperature: any;
  WeatherIcon: any;
  WeatherText: string;
  Temprature: Temperature;
}

export interface CurrentConditionsDisplay extends CurrentConditionsData {
  isMetricMeasurement: boolean;
}
