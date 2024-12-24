import { CityDataRecive } from "./../../types/CityData";
// A mock function to mimic making an async request for data
export function fetchTemperature() {
  return new Promise<CityDataRecive>((resolve) =>
    setTimeout(() => resolve({ data }), 500)
  );
}
