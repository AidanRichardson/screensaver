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
}

const GridLayoutWrapper: React.FC<Props> = ({ widgets, onWidgetsChange }) => {
  const handleLayoutChange = (layout: Layout[]) => {
    const updated = widgets.map((widget) => {
      const l = layout.find((item) => item.i === widget.id);
      return l ? { ...widget, ...l } : widget;
    });
    onWidgetsChange(updated);
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
    <div className="w-screen h-screen bg-gray-100 p-4">
      <GridLayout
        className="layout"
        cols={14}
        rowHeight={30}
        width={1500}
        onLayoutChange={handleLayoutChange}
      >
        {widgets.map((widget) => (
          <div key={widget.id} data-grid={widget}>
            <WidgetFrame title={widget.type}>
              {renderWidget(widget)}
            </WidgetFrame>
          </div>
        ))}
      </GridLayout>
    </div>
  );
};

export default GridLayoutWrapper;
