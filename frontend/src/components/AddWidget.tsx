import React from "react";
import type { WidgetConfig } from "../types/widget";
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
  const onClick = () => {
    updateWidgets([...widgets, widgetDetails]);
    OnClose();
  };

  const renderPreview = (widget: WidgetConfig) => {
    switch (widget.type) {
      case "clock":
        return (
          <div className="flex items-center justify-center h-20">
            <ClockWidget />
          </div>
        );
      case "weather":
        return (
          <div className="flex items-center justify-center h-20">
            <WeatherWidget />
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
    <div
      key={widgetDetails.id}
      onClick={onClick}
      className="bg-gray-50 dark:bg-gray-800 rounded-xl p-4 shadow-sm hover:shadow-md transition cursor-pointer flex flex-col"
    >
      {/* Preview */}
      <div className="mb-3">{renderPreview(widgetDetails)}</div>

      {/* Name */}
      <p className="text-lg font-medium text-gray-700 dark:text-gray-200 mb-2">
        {widgetDetails.type.charAt(0).toUpperCase() +
          widgetDetails.type.slice(1)}
      </p>
    </div>
  );
};

export default AddWidget;
