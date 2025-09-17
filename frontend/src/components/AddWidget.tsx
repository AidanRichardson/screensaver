import React from "react";
import type { WidgetConfig } from "../types/widget";
import WidgetRenderer from "./WidgetRenderer";

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
    updateWidgets([
      ...widgets,
      {
        ...widgetDetails,
        x: 0,
        y: 0,
        customisation: {
          ...widgetDetails.customisation,
        },
      },
    ]);
    OnClose();
  };

  return (
    <>
      <div className="bg-gray-50 dark:bg-gray-800 rounded-xl p-4 shadow-sm hover:shadow-md transition cursor-pointer flex flex-col">
        {/* Preview */}
        <div className="mb-20">
          <div className="flex items-center justify-center h-20">
            <WidgetRenderer widget={widgetDetails} />
          </div>
        </div>

        <button
          onClick={onClick}
          className="mt-auto px-4 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700"
        >
          Add
        </button>
      </div>
    </>
  );
};

export default AddWidget;
