import React from "react";

const WeatherWidget: React.FC = () => {
  return (
    <div>
      <p className="text-lg">🌤️ 21°C</p>
      <p className="text-sm text-gray-500">London</p>
    </div>
  );
};

export default WeatherWidget;
