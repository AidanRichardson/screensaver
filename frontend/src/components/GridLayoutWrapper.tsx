import React from "react";
import GridLayout, { Layout } from "react-grid-layout";
import "react-grid-layout/css/styles.css";
import type { WidgetConfig } from "../types/widget";
import WidgetFrame from "./WidgetFrame";
import ClockWidget from "./widgets/ClockWidget";
import WeatherWidget from "./widgets/WeatherWidget";

interface Props {
  widgets: WidgetConfig[];
  onWidgetsChange: (widgets: WidgetConfig[]) => void;
  editing: boolean;
}

const GridLayoutWrapper: React.FC<Props> = ({
  widgets,
  onWidgetsChange,
  editing,
}) => {
  const handleLayoutChange = (layout: Layout[]) => {
    const updated = widgets.map((widget) => {
      const l = layout.find((item) => item.i === widget.id);
      return l ? { ...widget, ...l } : widget;
    });
    onWidgetsChange(updated);
  };

  const handleDelete = (id: string) => {
    onWidgetsChange(widgets.filter((w) => w.id !== id));
  };

  const renderWidget = (widget: WidgetConfig) => {
    switch (widget.type) {
      case "clock":
        return <ClockWidget />;
      case "weather":
        return <WeatherWidget />;
      default:
        return <div>Unknown widget</div>;
    }
  };

  return (
    <div className="w-screen h-screen">
      <GridLayout
        className="layout"
        cols={14}
        rowHeight={30}
        width={1500}
        onLayoutChange={handleLayoutChange}
        isDraggable={editing}
        isResizable={editing}
        draggableCancel=".no-drag"
      >
        {widgets.map((widget) => (
          <div key={widget.id} data-grid={{ ...widget, static: !editing }}>
            <div className="relative group w-full h-full">
              {editing && (
                <button
                  type="button"
                  onMouseDown={(e) => e.stopPropagation()}
                  onTouchStart={(e) => e.stopPropagation()}
                  onClick={(e) => {
                    e.stopPropagation();
                    handleDelete(widget.id);
                  }}
                  className="no-drag absolute top-2 right-2 z-10 bg-red-500 hover:bg-red-600 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition"
                >
                  ✖
                </button>
              )}

              <WidgetFrame editing={editing}>
                {renderWidget(widget)}
              </WidgetFrame>
            </div>
          </div>
        ))}
      </GridLayout>
    </div>
  );
};

export default GridLayoutWrapper;
