import React, { useEffect, useState } from "react";
import "./MainCard.css";
import { useAppDispatch, useAppSelector } from "../../../app/hooks";
import {
  changeMeasurementUnit,
  selectIsMetric,
  selectMeasurementIcon,
  selectFirstDayForecast,
  fetchForecast,
  selectWeatherText,
  selectWeatherIcon,
  selectLocalObservationDateTime,
  selectSelectedCityKey,
  setSelectedCityKey,
} from "../../../redux-state-manager/CurrentConditions/currentConditionsSlice";

const MainCard: React.FC = () => {
  const dispatch = useAppDispatch();

  // States for managing user input
  const [cityInput, setCityInput] = useState<string>("");

  // Get the selected city key and first day forecast from the Redux store
  const selectedCityKey = useAppSelector(selectSelectedCityKey);
  const firstDayForecast = useAppSelector(selectFirstDayForecast);
  const isMetricMeasurement = useAppSelector(selectIsMetric);

  // Get the weather data from Redux store
  const weatherText = useAppSelector(selectWeatherText);
  const weatherIcon = useAppSelector(selectWeatherIcon);
  const observationDate = useAppSelector(selectLocalObservationDateTime);

  // Select the temperature unit icon based on the measurement system
  const buttonTemperatureIcon = useAppSelector(() =>
    selectMeasurementIcon(isMetricMeasurement)
  );

  // Debugging: Log the selected city key and forecast data
  console.log("Selected City Key:", selectedCityKey);
  console.log("First Day Forecast:", firstDayForecast);

  // Fetch the city key from AccuWeather API based on city name
  const fetchCityKey = async (cityName: string) => {
    try {
      const response = await fetch(
        `https://api.accuweather.com/locations/v1/cities/search?apikey=YOUR_API_KEY&q=${cityName}`
      );
      const data = await response.json();
      const cityKey = data[0]?.Key; // Assuming the first result is the correct one
      return cityKey;
    } catch (error) {
      console.error("Error fetching city key:", error);
      return null;
    }
  };

  // Set city key when the component first mounts or if the city is changed
  useEffect(() => {
    if (!selectedCityKey && cityInput) {
      const setCityKey = async () => {
        const cityKey = await fetchCityKey(cityInput);
        if (cityKey) {
          dispatch(setSelectedCityKey(cityKey)); // Set the city key in the Redux store
        }
      };
      setCityKey();
    }
  }, [dispatch, selectedCityKey, cityInput]);

  // Fetch the forecast whenever the selected city key changes
  useEffect(() => {
    if (selectedCityKey) {
      console.log("Fetching forecast for city key:", selectedCityKey);
      dispatch(fetchForecast(selectedCityKey));
    }
  }, [dispatch, selectedCityKey]);

  // Toggle the temperature unit between metric and imperial
  const toggleTemperatureUnit = () => {
    dispatch(changeMeasurementUnit());
  };

  // Get the weather icon if available
  const weatherIconUrl = weatherIcon
    ? `https://developer.accuweather.com/sites/default/files/${String(
        weatherIcon
      ).padStart(2, "0")}-s.png`
    : null;

  // Handle city input change
  const handleCityInputChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setCityInput(event.target.value);
  };

  // Handle city selection on form submit
  const handleCitySelect = (event: React.FormEvent) => {
    event.preventDefault();
    if (cityInput) {
      const setCityKey = async () => {
        const cityKey = await fetchCityKey(cityInput);
        if (cityKey) {
          dispatch(setSelectedCityKey(cityKey)); // Set the city key in the Redux store
        }
      };
      setCityKey();
    }
  };

  // Conditionally render the card based on city input and forecast data
  if (!cityInput || !selectedCityKey || !firstDayForecast) {
    return null; // Return nothing if the city input is empty or if no forecast is available
  }

  return (
    <div className="MainCard-Container">
      <div className="MainCard">
        {/* City Selection */}
        <div className="City-Selection">
          <form onSubmit={handleCitySelect}>
            <input
              type="text"
              placeholder="Enter city name"
              value={cityInput}
              onChange={handleCityInputChange}
            />
            <button type="submit">Get Weather</button>
          </form>
        </div>

        <div className="Temperature-Changer">
          <button
            className="Temperature-Button"
            onClick={toggleTemperatureUnit}
          >
            {buttonTemperatureIcon}
          </button>
        </div>

        {/* Current Weather Section */}
        <div className="Current-Weather">
          <h1>Current Weather</h1>
          <div>
            <p>{weatherText}</p>
            <p>
              {weatherText && firstDayForecast?.temperature}{" "}
              {firstDayForecast?.unit}
            </p>
            <p>{observationDate}</p>
            {weatherIconUrl && <img src={weatherIconUrl} alt="Weather Icon" />}
          </div>
        </div>

        {/* 5-Day Forecast Section */}
        <div className="Forecast-Section">
          <h2>5-Day Forecast</h2>
          {firstDayForecast ? (
            <div>
              <p>{firstDayForecast.date}</p>
              <p>
                {firstDayForecast.temperature} {firstDayForecast.unit}
              </p>
            </div>
          ) : (
            <div>Loading...</div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MainCard;
