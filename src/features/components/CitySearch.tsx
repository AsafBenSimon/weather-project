import React, { useEffect, useState } from "react";
import { CityData } from "../../types/CityData";
import { CurrentConditionsData } from "../../types/CurrentConditions";
import { weatherService } from "../services/weatherService";

function CitySearch() {
  const [cityData, setCityData] = useState<CityData | null>(null);
  const [currentConditions, setCurrentConditions] = useState<
    CurrentConditionsData | undefined
  >(undefined);
  const [forecastData, setForecastData] = useState<any[]>([]);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [suggestedCities, setSuggestedCities] = useState<CityData[]>([]); // Store suggested cities

  // Handle search input change
  const handleSearchChange = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const query = event.target.value;
    setSearchQuery(query);

    // Fetch top cities as user types
    if (query.length > 0) {
      const cities = await weatherService.getCities(query);
      setSuggestedCities(cities || []);
    } else {
      setSuggestedCities([]); // Clear suggestions if search is empty
    }
  };

  // Handle city selection
  const handleCitySelect = async (city: CityData) => {
    setCityData(city); // Set the selected city
    setSearchQuery(city.LocalizedName); // Update search bar with the selected city's name

    // Fetch current weather and forecast for the selected city
    if (city.Key) {
      fetchCurrentWeather(city.Key.toString());
      fetchForecast(city.Key.toString());
    }

    setSuggestedCities([]); // Clear the suggestions after a city is selected
  };

  useEffect(() => {
    if (cityData?.Key) {
      fetchCurrentWeather(cityData.Key.toString());
      fetchForecast(cityData.Key.toString());
    }
  }, [cityData]);

  const fetchCurrentWeather = async (cityKey: string) => {
    try {
      const weather = await weatherService.getCityCurrentConditions(cityKey);
      setCurrentConditions(weather);
    } catch (error) {
      console.error("Error fetching current weather", error);
    }
  };

  const fetchForecast = async (cityKey: string) => {
    try {
      const forecast = await weatherService.getForecast(cityKey);
      setForecastData(forecast.DailyForecasts || []);
    } catch (error) {
      console.error("Error fetching forecast", error);
    }
  };

  return (
    <div className="CitySearch">
      {/* Search Bar */}
      <form onSubmit={(e) => e.preventDefault()}>
        <input
          type="text"
          value={searchQuery}
          onChange={handleSearchChange}
          placeholder="Search for a city"
        />
      </form>

      {/* City Suggestions */}
      {suggestedCities.length > 0 && (
        <ul className="suggestions-list">
          {suggestedCities.map((city) => (
            <li key={city.Key} onClick={() => handleCitySelect(city)}>
              {city.LocalizedName}, {city.CountryId}
            </li>
          ))}
        </ul>
      )}

      {/* City Info */}
      {cityData && (
        <div className="city-info">
          <h2>{cityData.LocalizedName}</h2>
          {currentConditions && (
            <div className="current-weather">
              <p>{currentConditions.WeatherText}</p>
              <p>{`${currentConditions.Temperature.Metric.Value}°C`}</p>
            </div>
          )}
          <div className="forecast">
            {forecastData.length > 0 &&
              forecastData.map((forecast, index) => (
                <div key={index}>
                  <h3>{forecast.Date}</h3>
                  <p>{forecast.Day.IconPhrase}</p>
                  <p>{`${forecast.Temperature.Minimum.Value}°C / ${forecast.Temperature.Maximum.Value}°C`}</p>
                </div>
              ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default CitySearch;
