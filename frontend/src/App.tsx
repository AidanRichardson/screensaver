import { useEffect, useState } from "react";
import GridLayoutWrapper from "./components/GridLayoutWrapper";
import ScreenSelection from "./components/ScreenSelection";
import WidgetModal from "./components/WidgetModal";
import type { WidgetConfig } from "./types/widget";

const API_BASE = "/api/screens";

function App() {
  const [editing, setEditing] = useState(false);
  const [currentScreen, setCurrentScreen] = useState(1);
  const [widgets, setWidgets] = useState<WidgetConfig[]>();
  const [showWidgetModal, setShowWidgetModal] = useState(false);

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

  return (
    <>
      <ScreenSelection
        currentScreen={currentScreen}
        editing={editing}
        setWidgets={setWidgets}
        setCurrentScreen={setCurrentScreen}
      />

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

        {editing ? (
          <button
            onClick={() => setShowWidgetModal(true)}
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded ml-2"
          >
            Add Widget
          </button>
        ) : null}

        <WidgetModal
          open={showWidgetModal}
          onClose={() => setShowWidgetModal(false)}
          widgets={widgets || []}
          updateWidgets={setWidgets}
        />

        <div className="w-screen h-screen bg-gray-100 p-4">
          {!widgets ? (
            <div></div>
          ) : (
            <GridLayoutWrapper
              widgets={widgets}
              onWidgetsChange={setWidgets}
              editing={editing}
            />
          )}
        </div>
      </>
    </>
  );
}

export default App;
