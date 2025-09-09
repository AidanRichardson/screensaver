export type WidgetType = "clock" | "weather" | "spotify";
export type WidgetScale = 1 | 2 | 3;

export interface WidgetConfig {
  id: string;
  type: WidgetType;
  scale: WidgetScale;
  x: number;
  y: number;
  w?: number;
  h?: number;
  minH?: number;
}

export const baseWidgetSizes: Record<WidgetType, { w: number; h: number }> = {
  clock: { w: 2, h: 1 },
  weather: { w: 1, h: 2 },
  spotify: { w: 4, h: 2 },
};

export const availableWidgets: WidgetConfig[] = [
  { id: "1", type: "clock", scale: 1, x: 0, y: 0 },
  { id: "2", type: "weather", scale: 1, x: 0, y: 0 },
  { id: "3", type: "spotify", scale: 1, x: 0, y: 0 },
];
