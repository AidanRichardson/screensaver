import React from "react";
import type { WidgetConfig } from "../types/widget";

interface Props {
  widgets: WidgetConfig[];
  updateWidgets: (widgets: WidgetConfig[]) => void;
}

const WidgetFrame: React.FC<Props> = ({ widgets, updateWidgets }) => {
  const onClick = () => {
    const widget: WidgetConfig = {
      id: String(Date.now()),
      type: "weather",
      x: 0,
      y: 0,
      w: 4,
      h: 2,
      minH: 2,
    };
    updateWidgets([...widgets, widget]);
  };

  return (
    <button
      onClick={onClick}
      className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
    >
      Button
    </button>
  );
};

export default WidgetFrame;
