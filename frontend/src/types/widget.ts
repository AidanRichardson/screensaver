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
