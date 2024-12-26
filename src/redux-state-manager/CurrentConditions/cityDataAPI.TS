import { CityDataReceive } from "../../types/CityData";

// A mock function to mimic making an async request for data
export function fetchTemperature() {
  // Define mock data with Key as a number
  const mockData: CityDataReceive = {
    Key: "", // Key should be a number, not a string
    LocalizedName: "",
    Country: {
      ID: "",
    },
  };

  return new Promise<CityDataReceive>(
    (resolve) => setTimeout(() => resolve(mockData), 500) // Return the mockData
  );
}
