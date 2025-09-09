import React, { useState } from "react";
import type { WidgetConfig, WidgetScale } from "../types/widget";
import ClockWidget from "./widgets/ClockWidget";
import WeatherWidget from "./widgets/WeatherWidget";

interface Props {
  widgetDetails: WidgetConfig;
  widgets: WidgetConfig[];
  updateWidgets: (widgets: WidgetConfig[]) => void;
  OnClose: () => void;
}

const AddWidget: React.FC<Props> = ({
  widgetDetails,
  widgets,
  updateWidgets,
  OnClose,
}) => {
  const [scale, setScale] = useState<WidgetScale>(1);

  const onClick = () => {
    updateWidgets([...widgets, { ...widgetDetails, x: 0, y: 0, scale }]);
    OnClose();
  };

  const renderPreview = () => {
    switch (widgetDetails.type) {
      case "clock":
        return (
          <div className="flex items-center justify-center h-20">
            <ClockWidget scale={1} />
          </div>
        );
      case "weather":
        return (
          <div className="flex items-center justify-center h-20">
            <WeatherWidget scale={1} />
          </div>
        );
      default:
        return (
          <div className="flex items-center justify-center h-20 text-gray-500">
            Preview not available
          </div>
        );
    }
  };

  return (
    <div className="bg-gray-50 dark:bg-gray-800 rounded-xl p-4 shadow-sm hover:shadow-md transition cursor-pointer flex flex-col">
      {/* Preview */}
      <div className="mb-3">{renderPreview()}</div>

      {/* Name */}
      <p className="text-lg font-medium text-gray-700 dark:text-gray-200 mb-2">
        {widgetDetails.type.charAt(0).toUpperCase() +
          widgetDetails.type.slice(1)}
      </p>

      {/* Scale selector */}
      <select
        value={scale}
        onChange={(e) => setScale(Number(e.target.value) as WidgetScale)}
        className="mb-3 rounded-lg border-gray-300 dark:border-gray-700 dark:bg-gray-900 px-2 py-1 text-sm"
      >
        <option value={1}>Small</option>
        <option value={2}>Medium</option>
        <option value={3}>Large</option>
      </select>

      <button
        onClick={onClick}
        className="mt-auto px-4 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700"
      >
        Add
      </button>
    </div>
  );
};

export default AddWidget;
