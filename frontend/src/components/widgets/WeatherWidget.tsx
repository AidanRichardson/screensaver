import React, { useEffect, useState } from "react";
import "weather-icons/css/weather-icons.css";
import type { WidgetCustomisation } from "../../types/widget";

const WeatherWidget: React.FC<WidgetCustomisation> = ({
  scale,
  colour,
  location,
}) => {
  const [temp, setTemp] = useState<number | null>(null);
  const [weatherCode, setWeatherCode] = useState<number | null>(null);
  const [isDay, setIsDay] = useState<boolean | null>(null);

  scale = scale * 3;

  useEffect(() => {
    const fetchWeather = async () => {
      try {
        const geoRes = await fetch(
          `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(
            location
          )}`
        );
        if (!geoRes.ok) throw new Error("Failed to fetch geocode");
        const geoData = await geoRes.json();
        if (!geoData.length) throw new Error("Location not found");

        const { lat, lon } = geoData[0];

        const res = await fetch(
          `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current_weather=true`
        );
        if (!res.ok) throw new Error("Failed to fetch weather");
        const data = await res.json();

        setTemp(Math.round(data.current_weather.temperature));
        setWeatherCode(data.current_weather.weathercode);
        setIsDay(data.current_weather.is_day === 1);
      } catch (err) {
        console.error("Weather API error:", err);
      }
    };

    fetchWeather();
  }, [location]);

  const getWeatherIconClass = (code: number | null) => {
    if (code === null) return "wi-na";
    if ([0].includes(code)) return isDay ? "wi-day-sunny" : "wi-night-clear"; // Clear sky
    if ([1, 2, 3].includes(code)) return "wi-cloudy"; // Mainly clear, partly cloudy, overcast
    if ([45, 48].includes(code)) return "wi-fog"; // Fog and depositing rime fog
    if ([51, 53, 55].includes(code)) return "wi-sprinkle"; // Drizzle
    if ([56, 57].includes(code)) return "wi-rain-mix"; // Freezing drizzle
    if ([61, 63, 65].includes(code)) return "wi-rain"; // Rain
    if ([66, 67].includes(code)) return "wi-rain-mix"; // Freezing rain
    if ([71, 73, 75, 85, 86].includes(code)) return "wi-snow"; // Snow or snow showers
    if ([77].includes(code)) return "wi-snow-wind"; // Snow grains
    if ([80, 81, 82].includes(code)) return "wi-showers"; // Rain showers
    if ([95, 96, 99].includes(code)) return "wi-thunderstorm"; // Thunderstorm

    return "wi-na"; // fallback
  };

  return (
    <div
      style={{ color: colour }}
      className="flex flex-col items-center leading-none"
    >
      {temp !== null ? (
        <>
          <i
            className={`wi ${getWeatherIconClass(weatherCode)}`}
            style={{
              fontSize: `${scale * 1.6}em`,
              lineHeight: 1.2,
              display: "block",
            }}
          ></i>
          <p
            className="m-0 p-0 font-bold"
            style={{ fontSize: `${scale}em`, lineHeight: 1.1 }}
          >
            {temp}°C
          </p>
          <p
            className="m-0 p-0"
            style={{ fontSize: `${scale * 0.4}em`, lineHeight: 1 }}
          >
            {location}
          </p>
        </>
      ) : (
        <p className="m-0 p-0">Loading...</p>
      )}
    </div>
  );
};

export default WeatherWidget;
