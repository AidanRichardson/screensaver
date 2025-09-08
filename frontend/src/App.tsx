import { useEffect, useState } from "react";
import AddWidget from "./components/AddWidget";
import GridLayoutWrapper from "./components/GridLayoutWrapper";
import type { WidgetConfig } from "./types/widget";

const API_BASE = "/api/screens";

const defaultWidgets: WidgetConfig[] = [
  { id: "1", type: "clock", x: 0, y: 0, w: 4, h: 2, minH: 2 },
];

function App() {
  const [editing, setEditing] = useState(false);
  const [screens, setScreens] = useState<number[]>([1]);
  const [currentScreen, setCurrentScreen] = useState(1);
  const [widgets, setWidgets] = useState<WidgetConfig[]>();

  // Get availiable screens
  useEffect(() => {
    const fetchScreens = async () => {
      try {
        const res = await fetch(`${API_BASE}`);
        if (!res.ok) throw new Error("Failed to fetch screens");

        const data = await res.json();
        setScreens(data.screens);
      } catch (err) {
        console.error("Error fetching widgets:", err);
      }
    };

    fetchScreens();
  }, []);

  useEffect(() => {
    const fetchWidgets = async () => {
      try {
        const res = await fetch(`${API_BASE}/${currentScreen}`);
        if (!res.ok) throw new Error("Failed to fetch widgets");

        const data: WidgetConfig[] = await res.json();
        setWidgets(data.length > 0 ? data : undefined);
      } catch (err) {
        console.error("Error fetching widgets:", err);
      }
    };

    fetchWidgets();
  }, [currentScreen]);

  // Save user edit
  const handleEdit = async () => {
    if (editing) {
      try {
        const res = await fetch(`${API_BASE}/${currentScreen}`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(widgets),
        });
        if (!res.ok) throw new Error("Failed to save widgets");
      } catch (err) {
        console.error("Server error:", err);
      }
    }
    setEditing(!editing);
  };

  // Add a new screen
  const handleAddScreen = async () => {
    const nextId = screens.length > 0 ? Math.max(...screens) + 1 : 1;

    // Create new screen in database with default widgets
    try {
      const res = await fetch(`${API_BASE}/${nextId}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(defaultWidgets),
      });
      if (!res.ok) throw new Error("Failed to create screen");

      // Increase number of screens
      setScreens((prev) => [...prev, nextId]);
      setCurrentScreen(nextId);
      setWidgets(defaultWidgets);
    } catch (err) {
      console.error("Server error:", err);
    }
  };

  return (
    <>
      <div className="flex gap-2 my-4">
        {screens.map((screenId) => (
          <button
            key={screenId}
            onClick={() => setCurrentScreen(screenId)}
            className={`${
              currentScreen === screenId
                ? "bg-yellow-700"
                : "bg-yellow-500 hover:bg-yellow-700"
            } text-white font-bold py-2 px-4 rounded`}
          >
            Screen {screenId}
          </button>
        ))}

        <button
          onClick={handleAddScreen}
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
        >
          + Add Screen
        </button>
      </div>

      {!widgets ? (
        <div>Click add screen to get started</div>
      ) : (
        <>
          <button
            onClick={handleEdit}
            className={`${
              editing
                ? "bg-green-500 hover:bg-green-700"
                : "bg-red-500 hover:bg-red-700"
            } text-white font-bold py-2 px-4 rounded`}
          >
            {editing ? "Save" : "Edit"}
          </button>
          <AddWidget widgets={widgets} updateWidgets={setWidgets} />

          <div className="w-screen h-screen bg-gray-100 p-4">
            <GridLayoutWrapper
              widgets={widgets}
              onWidgetsChange={setWidgets}
              editing={editing}
            />
          </div>
        </>
      )}
    </>
  );
}

export default App;
