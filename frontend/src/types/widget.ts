export type WidgetType = "clock" | "weather" | "spotify";

export interface WidgetConfig {
  id: string;
  type: WidgetType;
  x: number;
  y: number;
  w: number;
  h: number;
  minH?: number;
}

export const availableWidgets: WidgetConfig[] = [
  { id: "1", type: "clock", x: 0, y: 0, w: 6, h: 4, minH: 2 },
  { id: "2", type: "weather", x: 0, y: 0, w: 4, h: 2, minH: 2 },
];
