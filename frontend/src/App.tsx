import { useEffect, useState } from "react";
import AddWidget from "./components/AddWidget";
import GridLayoutWrapper from "./components/GridLayoutWrapper";
import type { WidgetConfig } from "./types/widget";

const LOCAL_STORAGE_KEY = "widgets";

const defaultWidgets: WidgetConfig[] = [
  { id: "1", type: "clock", x: 0, y: 0, w: 4, h: 2, minH: 2 },
];

function App() {
  const [widgets, setWidgets] = useState<WidgetConfig[]>(() => {
    const saved = localStorage.getItem(LOCAL_STORAGE_KEY);
    return saved ? JSON.parse(saved) : defaultWidgets;
  });

  useEffect(() => {
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(widgets));
  }, [widgets]);

  return (
    <>
      <AddWidget widgets={widgets} updateWidgets={setWidgets}></AddWidget>
      <div className="w-screen h-screen bg-gray-100 p-4">
        <GridLayoutWrapper widgets={widgets} onWidgetsChange={setWidgets} />
      </div>
    </>
  );
}

export default App;
