import React, { useEffect, useState } from "react";
import "./CardLine.css"; // Your styles for the CardLine component
import Card from "../Card"; // Assuming you have a Card component to display each forecast

type Forecast = {
  date: string;
  day: string;
  temps: string;
  icon: number; // Keep it as a number
};

function CardLine() {
  const [forecastData, setForecastData] = useState<Forecast[]>([]); // State to hold forecast data
  const [loading, setLoading] = useState<boolean>(true); // To handle loading state
  const [error, setError] = useState<string | null>(null); // To handle error state

  useEffect(() => {
    // Fetch 5-day forecast data
    const fetchForecast = async () => {
      try {
        const cityKey = "215854"; // Replace with the valid city key (example city key)
        const apiKey = process.env.REACT_APP_API_KEY; // Your API key from .env file
        setLoading(true); // Set loading to true when fetching starts

        // Fetch 5-day forecast data
        const response = await fetch(
          `http://dataservice.accuweather.com/forecasts/v1/daily/5day/${cityKey}?apikey=${apiKey}&metric=true`
        );
        const data = await response.json();

        if (data) {
          // Format the forecast data
          const formattedData = data.DailyForecasts.map((forecast: any) => ({
            date: forecast.Date.split("T")[0], // Extract date from timestamp
            day: forecast.Day.IconPhrase, // Weather description (e.g., "Sunny")
            temps: `${forecast.Temperature.Maximum.Value}°C / ${forecast.Temperature.Minimum.Value}°C`, // Max/Min temperature
            icon: forecast.Day.Icon, // Icon code (still a number)
          }));

          setForecastData(formattedData); // Set state with the fetched and formatted data
        } else {
          setError("Failed to fetch forecast data.");
        }
      } catch (err) {
        setError("An error occurred while fetching data.");
        console.error(err); // Log the error for debugging
      } finally {
        setLoading(false); // Set loading to false once data is fetched or error occurs
      }
    };

    fetchForecast();
  }, []); // Empty dependency array ensures this runs only once when the component mounts

  if (loading) {
    return <p>Loading forecast...</p>; // Show loading message while data is being fetched
  }

  if (error) {
    return <p>{error}</p>; // Show error message if there's an issue with the API request
  }

  return (
    <div className="CardLine-Container">
      {forecastData.length > 0 ? (
        forecastData.map((forecast, index) => (
          <Card
            key={index}
            data={{
              date: forecast.date,
              day: forecast.day,
              temps: forecast.temps,
              icon: forecast.icon, // Pass the icon code (number) here
            }}
          />
        ))
      ) : (
        <p>No forecast data available.</p>
      )}
    </div>
  );
}

export default CardLine;
