import React, { useEffect, useState } from "react";

const ClockWidget: React.FC<{ scale: number }> = ({ scale }) => {
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const fontSize = {
    1: "text-3xl",
    2: "text-6xl",
    3: "text-9xl",
  }[scale];

  return (
    <div className={`text-white font-bold font-asimovian ${fontSize}`}>
      {time.toLocaleTimeString()}
    </div>
  );
};

export default ClockWidget;
