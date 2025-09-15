import React, { useEffect, useState } from "react";
import type { WidgetCustomisation } from "../../types/widget";

const ClockWidget: React.FC<WidgetCustomisation> = ({ scale, colour }) => {
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div
      className="font-bold font-asimovian select-none"
      style={{ color: colour, fontSize: `${scale}em` }}
    >
      {time.toLocaleTimeString()}
    </div>
  );
};

export default ClockWidget;
