import React, { useEffect, useState } from "react";
import type { WidgetCustomisation } from "../../types/widget";

const ClockWidget: React.FC<WidgetCustomisation> = ({
  scale,
  colour,
  showSeconds,
  clockFont,
}) => {
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const timeString = time.toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
    second: showSeconds ? "2-digit" : undefined,
  });

  return (
    <div
      className="font-bold select-none"
      style={{
        color: colour,
        fontFamily: clockFont,
        fontSize: `${scale * 3.5}em`,
      }}
    >
      {timeString}
    </div>
  );
};

export default ClockWidget;
