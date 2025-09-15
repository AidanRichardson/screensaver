import React from "react";

const WeatherWidget: React.FC<{ scale: number }> = ({ scale }) => {
  return (
    <div
      className={`text-white font-bold font-asimovian`}
      style={{ fontSize: `${scale}em` }}
    >
      <p>🌤️</p>
      <p>21°C</p>
    </div>
  );
};

export default WeatherWidget;
