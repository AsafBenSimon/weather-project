import React, { useEffect, useState } from "react";
import "./CardLine.css";
import Card from "../Card"; // Assuming you have a Card component to display each forecast
import { CityData } from "../../../types/CityData";
import { weatherService } from "../../services/weatherService";

type Forecast = {
  date: string;
  day: string;
  temps: string;
  icon: number;
};

function CitySearchWithForecast() {
  const [cityData, setCityData] = useState<CityData | null>(null);
  const [forecastData, setForecastData] = useState<Forecast[]>([]);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [suggestedCities, setSuggestedCities] = useState<CityData[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  // Handle search input change
  const handleSearchChange = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const query = event.target.value;
    setSearchQuery(query);

    if (query.length > 0) {
      try {
        const cities = await weatherService.getCities(query);
        setSuggestedCities(cities || []);
      } catch (err) {
        console.error("Error fetching city suggestions", err);
      }
    } else {
      setSuggestedCities([]);
    }
  };

  // Handle city selection
  const handleCitySelect = async (city: CityData) => {
    setCityData(city);
    setSearchQuery(city.LocalizedName);

    // Fetch forecast data
    if (city.Key) {
      fetchForecast(city.Key.toString());
    }

    setSuggestedCities([]);
  };

  const fetchForecast = async (cityKey: string) => {
    try {
      setLoading(true);
      const data = await weatherService.getForecast(cityKey);

      if (data && data.DailyForecasts) {
        const formattedData = data.DailyForecasts.map((forecast: any) => ({
          date: forecast.Date.split("T")[0],
          day: forecast.Day.IconPhrase,
          temps: `${forecast.Temperature.Maximum.Value}°C / ${forecast.Temperature.Minimum.Value}°C`,
          icon: forecast.Day.Icon,
        }));
        setForecastData(formattedData);
        setError(null);
      } else {
        setError("Failed to fetch forecast data.");
      }
    } catch (err) {
      setError("An error occurred while fetching forecast data.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="CitySearchWithForecast">
      {/* Search Bar */}
      <form onSubmit={(e) => e.preventDefault()}>
        <input
          type="text"
          value={searchQuery}
          onChange={handleSearchChange}
          placeholder="Search for a city"
        />
      </form>

      {/* Suggested Cities */}
      {suggestedCities.length > 0 && (
        <ul className="suggestions-list">
          {suggestedCities.map((city) => (
            <li key={city.Key} onClick={() => handleCitySelect(city)}>
              {city.LocalizedName}, {city.CountryId}
            </li>
          ))}
        </ul>
      )}

      {/* Forecast Results */}
      <div className="CardLine-Container">
        {loading && <p>Loading forecast...</p>}
        {error && <p>{error}</p>}
        {forecastData.length > 0
          ? forecastData.map((forecast, index) => (
              <Card
                key={index}
                data={{
                  date: forecast.date,
                  day: forecast.day,
                  temps: forecast.temps,
                  icon: forecast.icon,
                }}
              />
            ))
          : !loading && (
              <p>No forecast data available. Or didnt pick a city yet.</p>
            )}
      </div>
    </div>
  );
}

export default CitySearchWithForecast;
