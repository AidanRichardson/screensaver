import React from "react";
import { availableWidgets, type WidgetConfig } from "../types/widget";
import AddWidget from "./AddWidget";

interface WidgetModalProps {
  open: boolean;
  onClose: () => void;
  widgets: WidgetConfig[];
  updateWidgets: (widgets: WidgetConfig[]) => void;
}

const WidgetModal: React.FC<WidgetModalProps> = ({
  open,
  onClose,
  widgets,
  updateWidgets,
}) => {
  if (!open) return null;

  const activeWidgetIds = new Set(
    widgets.map((w) => {
      return w.id;
    })
  );

  // Filter out widgets that are already active
  const unusedWidgets = availableWidgets.filter(
    (widget) => !activeWidgetIds.has(widget.id)
  );

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-xl w-full max-w-3xl p-6 relative animate-fadeIn">
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
        >
          ✖
        </button>

        <h2 className="text-2xl font-semibold mb-6 text-gray-800 dark:text-gray-100">
          Add a Widget
        </h2>
        {unusedWidgets.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {unusedWidgets.map((widget, index) => (
              <AddWidget
                key={index}
                widgetDetails={widget}
                widgets={widgets}
                updateWidgets={updateWidgets}
                OnClose={onClose}
              ></AddWidget>
            ))}
          </div>
        ) : (
          <p className="text-gray-500 dark:text-gray-400">
            All available widgets are already in use.
          </p>
        )}

        <div className="flex justify-end mt-6">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-lg bg-gray-200 hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

export default WidgetModal;
