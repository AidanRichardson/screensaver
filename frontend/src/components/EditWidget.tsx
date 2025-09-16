import React, { useRef, useState } from "react";
import type { WidgetConfig } from "../types/widget";
import WidgetRenderer from "./WidgetRenderer";

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
  const [scale, setScale] = useState(widget.customisation.scale);
  const [colour, setColour] = useState(widget.customisation.colour);
  const [location, setLocation] = useState(widget.customisation.location);
  const [showPlayingDetails, setShowPlayingDetails] = useState(
    widget.customisation.showPlayingDetails
  );

  // keep a ref for the input field (uncontrolled)
  const locationRef = useRef<HTMLInputElement>(null);

  const onClick = () => {
    const updatedWidget = {
      ...widget,
      customisation: {
        ...widget.customisation,
        scale,
        colour,
        location,
        showPlayingDetails,
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
          onChange={(e) => setScale(Number(e.target.value))}
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

        {widget.type === "weather" && (
          <>
            <label className="text-sm font-medium text-gray-600 dark:text-gray-300 mb-1">
              Location
            </label>
            <input
              defaultValue={location}
              ref={locationRef}
              onBlur={() => setLocation(locationRef.current?.value ?? location)}
              className="mb-4 rounded-lg border-gray-300 dark:border-gray-700 dark:bg-gray-900 px-2 py-1 text-sm"
              type="text"
            />
          </>
        )}

        {widget.type === "spotify" && (
          <div className="mb-4 flex items-center gap-3">
            <label
              htmlFor="show-details"
              className="text-sm font-medium text-gray-600 dark:text-gray-300"
            >
              Show Details
            </label>
            <button
              type="button"
              id="show-details"
              role="switch"
              aria-checked={showPlayingDetails}
              onClick={() => setShowPlayingDetails(!showPlayingDetails)}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                showPlayingDetails
                  ? "bg-blue-600"
                  : "bg-gray-300 dark:bg-gray-700"
              }`}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                  showPlayingDetails ? "translate-x-6" : "translate-x-1"
                }`}
              />
            </button>
          </div>
        )}

        {/* Buttons */}
        <div className="flex gap-2">
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
        <WidgetRenderer
          widget={{
            ...widget,
            customisation: {
              ...widget.customisation,
              colour: colour,
              scale: 1,
              location: location,
              showPlayingDetails: showPlayingDetails,
            },
          }}
        />
      </div>
    </div>
  );
};

export default EditWidget;
