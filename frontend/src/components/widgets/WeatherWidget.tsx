import React from "react";

const WeatherWidget: React.FC<{ scale: number }> = ({ scale }) => {
  const fontSize = {
    1: "text-3xl",
    2: "text-6xl",
    3: "text-9xl",
  }[scale];
  return (
    <div className={`text-white font-bold font-asimovian ${fontSize}`}>
      <p>🌤️</p>
      <p>21°C</p>
    </div>
  );
};

export default WeatherWidget;
