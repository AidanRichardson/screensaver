import React, { useEffect, useState } from "react";
import type { WidgetCustomisation } from "../../types/widget";

const ClockWidget: React.FC<WidgetCustomisation> = ({ scale, colour }) => {
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
    <div
      className={`text-${colour} font-bold font-asimovian ${fontSize} select-none`}
    >
      {time.toLocaleTimeString()}
    </div>
  );
};

export default ClockWidget;
