import { widgetRegistry } from "../components/widgets";

export type WidgetScale = 1 | 2 | 3;

export interface WidgetCustomisation {
  scale: WidgetScale;
  colour: string;
}

export interface WidgetConfig {
  id: string;
  type: string;
  customisation: WidgetCustomisation;
  x: number;
  y: number;
  w?: number;
  h?: number;
  minH?: number;
}

export const availableWidgets = Object.entries(widgetRegistry).map(
  ([type, { defaultSize, defaultCustomisation }], idx) => ({
    id: String(idx + 1),
    type,
    customisation: defaultCustomisation,
    x: 0,
    y: 0,
    ...defaultSize,
  })
);
