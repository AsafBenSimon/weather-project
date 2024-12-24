import axios from "axios";
import { CityData, CityDataRecive } from "../../types/CityData";
import { CurrentConditionsData } from "../../types/CurrentConditions";

const apiKey = process.env.REACT_APP_API_KEY;

const baseUrl = "http://dataservice.accuweather.com/";
const searchVersion = "v1/";
const locationsUrl = `${baseUrl}locations/${searchVersion}cities/autocomplete?apikey=${apiKey}`;

const getCity = async (cityName: string, lang = "en-us", details = false) => {
  const city = await axios
    .get(
      `${baseUrl}/locations/v1/cities/search?apikey=${apiKey}&q=${cityName}&language=${lang}&details=${details}`
    )
    .then((response) => {
      const { Key, EnglishName } = response.data[0];
      return { Key, EnglishName };
    });
  console.log(city);
  // key , english name,
  return city;
};

const getCities = async (cityName: string): Promise<CityData[] | undefined> => {
  try {
    const response = await axios.get(`${locationsUrl}&q=${cityName}`);
    if (response.status === 200) {
      const citiesData: CityData[] = (response.data as CityDataRecive[]).map(
        (city) => {
          return {
            Key: city.Key,
            LocalizedName: city.LocalizedName,
            CountryId: city.Country.ID,
          };
        }
      );
      if (citiesData) {
        const firstTenCities = citiesData.slice(0, 10);
        return firstTenCities;
      }
    }
  } catch (error) {
    console.error("Error fetching cities:", error);
  }
};

const getCityCurrentConditions = async (
  cityKey: number
): Promise<CurrentConditionsData | undefined> => {
  try {
    const currentConditionsResponse = await axios.get(
      `${baseUrl}currentconditions/v1/${cityKey}?&apikey=${apiKey}`
    );
    if (currentConditionsResponse.status == 200) {
      const currentConditions =
        currentConditionsResponse.data as CurrentConditionsData;

      if (currentConditions) {
        return currentConditions;
      }
    }
  } catch (error) {
    console.log("error", error);
  }
};

export const weatherSerivce = {
  getCity,
  getCities,
  getCityCurrentConditions,
};
