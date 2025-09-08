import React, { useEffect, useState } from "react";

const ClockWidget: React.FC = () => {
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="text-9xl text-white font-bold font-asimovian">
      {time.toLocaleTimeString()}
    </div>
  );
};

export default ClockWidget;
