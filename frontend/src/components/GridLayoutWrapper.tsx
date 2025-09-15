import React from "react";
import GridLayout, { Layout, WidthProvider } from "react-grid-layout";
import "react-grid-layout/css/styles.css";
import { FaEdit } from "react-icons/fa";
import { type WidgetConfig } from "../types/widget";
import WidgetFrame from "./WidgetFrame";
import WidgetRenderer from "./WidgetRenderer";
import { widgetRegistry } from "./widgets";

const ResponsiveGridLayout = WidthProvider(GridLayout);

interface Props {
  widgets: WidgetConfig[];
  onWidgetsChange: (widgets: WidgetConfig[]) => void;
  setEditingWidget: (setEditingWidget: WidgetConfig) => void;
  editing: boolean;
}

const GridLayoutWrapper: React.FC<Props> = ({
  widgets,
  onWidgetsChange,
  setEditingWidget,
  editing,
}) => {
  const handleLayoutChange = (layout: Layout[]) => {
    const updated = widgets.map((widget) => {
      const l = layout.find((item) => item.i === widget.id);
      return l ? { ...widget, ...l } : widget;
    });
    onWidgetsChange(updated);
  };

  return (
    <div className="w-full h-full">
      <ResponsiveGridLayout
        className="layout"
        cols={14}
        rowHeight={30}
        onLayoutChange={handleLayoutChange}
        isDraggable={editing}
        isResizable={false}
        draggableCancel=".no-drag"
        autoSize={true}
        compactType={null}
      >
        {widgets.map((widget) => {
          const base = widgetRegistry[widget.type].defaultSize;
          const scale = widget.customisation.scale ?? 1;

          const w = base.w * scale;
          const h = base.h * scale;

          return (
            <div
              key={widget.id}
              data-grid={{ ...widget, w, h, static: !editing }}
            >
              <div className="relative group w-full h-full">
                {editing && (
                  <button
                    type="button"
                    onClick={() => setEditingWidget(widget)}
                    className="no-drag absolute top-2 right-2 z-10 bg-red-500 hover:bg-red-600 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition"
                  >
                    <FaEdit />
                  </button>
                )}
                <WidgetFrame editing={editing}>
                  <WidgetRenderer widget={widget} />
                </WidgetFrame>
              </div>
            </div>
          );
        })}
      </ResponsiveGridLayout>
    </div>
  );
};

export default GridLayoutWrapper;
