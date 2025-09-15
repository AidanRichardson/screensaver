import React, { useState } from "react";
import type { WidgetConfig, WidgetScale } from "../types/widget";
import ClockWidget from "./widgets/ClockWidget";
import WeatherWidget from "./widgets/WeatherWidget";

interface Props {
  widget: WidgetConfig;
  widgets: WidgetConfig[];
  updateWidgets: (widgets: WidgetConfig[]) => void;
  OnClose: () => void;
}

const EditWidget: React.FC<Props> = ({
  widget,
  widgets,
  updateWidgets,
  OnClose,
}) => {
  const [scale, setScale] = useState<WidgetScale>(widget.customisation.scale);
  const [colour, setColour] = useState(widget.customisation.colour);

  const onClick = () => {
    const updatedWidget = {
      ...widget,
      customisation: {
        ...widget.customisation,
        scale,
        colour,
      },
    };

    const updatedWidgets = widgets.map((w) =>
      w.id === widget.id ? updatedWidget : w
    );

    updateWidgets(updatedWidgets);
    OnClose();
  };

  const handleDelete = () => {
    updateWidgets(widgets.filter((w) => w.id !== widget.id));
    OnClose();
  };

  const renderPreview = () => {
    switch (widget.type) {
      case "clock":
        return (
          <div className="flex items-center justify-center h-40">
            <ClockWidget {...widget.customisation} scale={2} colour={colour} />
          </div>
        );
      case "weather":
        return (
          <div className="flex items-center justify-center h-40">
            <WeatherWidget scale={2} />
          </div>
        );
      default:
        return (
          <div className="flex items-center justify-center h-40 text-gray-500">
            Preview not available
          </div>
        );
    }
  };

  return (
    <div className="flex flex-col md:flex-row gap-6">
      {/* Left: Options */}
      <div className="flex flex-col w-full md:w-1/2">
        {/* Scale selector */}
        <label className="text-sm font-medium text-gray-600 dark:text-gray-300 mb-1">
          Size
        </label>
        <select
          value={scale}
          onChange={(e) => setScale(Number(e.target.value) as WidgetScale)}
          className="mb-3 rounded-lg border-gray-300 dark:border-gray-700 dark:bg-gray-900 px-2 py-1 text-sm"
        >
          <option value={1}>Small</option>
          <option value={2}>Medium</option>
          <option value={3}>Large</option>
        </select>

        {/* Colour selector */}
        <label className="text-sm font-medium text-gray-600 dark:text-gray-300 mb-1">
          Colour
        </label>
        <select
          value={colour}
          onChange={(e) => setColour(e.target.value)}
          className="mb-4 rounded-lg border-gray-300 dark:border-gray-700 dark:bg-gray-900 px-2 py-1 text-sm"
        >
          <option value={"white"}>White</option>
          <option value={"black"}>Black</option>
        </select>

        {/* Buttons */}
        <div className="mt-auto flex gap-2">
          <button
            onClick={onClick}
            className="flex-1 px-4 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700"
          >
            Update
          </button>
          <button
            onClick={handleDelete}
            className="flex-1 px-4 py-2 rounded-lg bg-red-600 text-white hover:bg-red-700"
          >
            Delete
          </button>
        </div>
      </div>

      {/* Right: Preview */}
      <div className="flex w-full md:w-1/2 items-center justify-center border rounded-xl bg-gray-400 dark:bg-gray-900">
        {renderPreview()}
      </div>
    </div>
  );
};

export default EditWidget;
