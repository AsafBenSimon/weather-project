import "../components/CitySearch";
import "../components/CitySearch.css";
import { useEffect, useState } from "react";
import { weatherSerivce } from "../services/weatherService";
import { CityData } from "../../types/CityData";
import { CurrentConditionsData } from "../../types/CurrentConditions";

interface ShowFirstCity {
  CountryId: string;
  LocalizedName: string;
}

const initialCity: ShowFirstCity = {
  CountryId: "",
  LocalizedName: "", // Default city
};

function CitySearch() {
  const apiKey = process.env.REACT_APP_API_KEY;

  const [cityData, setCityData] = useState<CityData | null>(null);
  const [cityName, setCityName] = useState<string>("");
  const [filteredCities, setFilteredCities] = useState<CityData[]>([]);
  const [currentConditions, setCurrentConditions] = useState<
    CurrentConditionsData | undefined
  >();

  useEffect(() => {
    fetchCities();
  }, [cityName]);

  useEffect(() => {
    handleCitySelect({
      LocalizedName: "Tel Aviv",
      Key: 0,
      CountryId: "IL",
    });
  }, []);

  const fetchCities = async () => {
    setFilteredCities((await weatherSerivce.getCities(cityName)) || []);
  };

  const handleSearch = async () => {
    const currentConditions = await weatherSerivce.getCityCurrentConditions(
      cityData?.Key ?? 0
    );
    setCurrentConditions(currentConditions);
  };

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    setCityName(value);

    // Filter the original list of cities based on input value
    const filtered: CityData[] = filteredCities.filter((city) =>
      city.LocalizedName.toLowerCase().includes(value.toLowerCase())
    );

    if (filtered.length == 1) {
      setCityData({
        Key: filtered[0].Key,
        LocalizedName: filtered[0].LocalizedName,
        CountryId: filtered[0].CountryId,
      });
    }

    filtered.pop();

    setFilteredCities(filtered);
  };

  const handleCitySelect = (selectedCity: CityData) => {
    setCityName(selectedCity.LocalizedName);
    setCityData({
      LocalizedName: selectedCity.LocalizedName,
      Key: selectedCity.Key,
      CountryId: selectedCity.CountryId,
    });
    setFilteredCities([]);
    // Optionally perform search or other logic here
  };

  return (
    <div className="CitySearch-parent">
      <div className="CitySearch">
        <input
          className="enter-city-name-input"
          type="text"
          name="city"
          id="city"
          placeholder="Enter city Name"
          value={cityName}
          onChange={handleChange}
        />
        <button onClick={handleSearch}>Search</button>
        {/* Dropdown menu for suggestions */}
        {filteredCities.length > 0 && (
          <div className="suggestions">
            {filteredCities.map((city) => (
              <div
                key={city.Key}
                className="suggestion"
                onClick={() => handleCitySelect(city)}
              >
                {city.LocalizedName}
              </div>
            ))}
          </div>
        )}

        <button className="SaveButton" type="button">
          Save
        </button>
        <div className="Location-button-Container">
          <button className="MyLocationButton" type="button">
            My Location
          </button>
        </div>

        <div>
          <h2 className="CityName">
            {cityData?.CountryId}, {cityData?.LocalizedName}
          </h2>
        </div>
      </div>
    </div>
  );
}

export default CitySearch;
