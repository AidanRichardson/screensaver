import React from "react";
import type { WidgetConfig } from "../types/widget";
import { widgetRegistry } from "./widgets";

const WidgetRenderer: React.FC<{ widget: WidgetConfig }> = ({ widget }) => {
  const entry = widgetRegistry[widget.type];
  if (!entry) return <div>Unknown widget: {widget.type}</div>;

  const { Component } = entry;
  return <Component {...widget.customisation} />;
};

export default WidgetRenderer;
