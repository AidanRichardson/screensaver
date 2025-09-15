import { useEffect, useState } from "react";
import GridLayoutWrapper from "./components/GridLayoutWrapper";
import ScreenSelection from "./components/ScreenSelection";
import WidgetModal from "./components/WidgetModal";
import type { WidgetConfig } from "./types/widget";

// If bg.mp4 is in src/assets:
import bgVideo from "./assets/bg.mp4";

const API_BASE = "/api/screens";

function App() {
  const [editing, setEditing] = useState(false);
  const [screenIds, setScreenIds] = useState<number[]>([]);
  const [currentScreen, setCurrentScreen] = useState<number>();
  const [widgets, setWidgets] = useState<WidgetConfig[]>();
  const [showWidgetModal, setShowWidgetModal] = useState(false);
  const [editingWidget, setEditingWidget] = useState<WidgetConfig>();
  const [isFullscreen, setIsFullscreen] = useState(false);

  useEffect(() => {
    if (!currentScreen) return;

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

  useEffect(() => {
    const fetchScreens = async () => {
      try {
        const res = await fetch(`${API_BASE}`);
        if (!res.ok) throw new Error("Failed to fetch screens");

        const data = await res.json();
        setScreenIds(data.screens);

        if (data.screens.length > 0) {
          setCurrentScreen(data.screens[0]); // ✅ set immediately
        }
      } catch (err) {
        console.error("Error fetching screens:", err);
      }
    };

    fetchScreens();
  }, []);

  useEffect(() => {
    const handleChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };
    document.addEventListener("fullscreenchange", handleChange);
    return () => document.removeEventListener("fullscreenchange", handleChange);
  }, []);

  const goFullscreen = () => {
    if (document.documentElement.requestFullscreen) {
      document.documentElement.requestFullscreen();
    }
  };

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
    <div className="relative w-screen h-screen overflow-hidden flex flex-col">
      {/* Edit and Fullscreen button */}
      {!editing && (
        <div className="fixed top-2 left-2 z-50 flex gap-2">
          {!isFullscreen && (
            <button
              onClick={goFullscreen}
              className="px-3 py-1 text-sm rounded bg-gray-700 hover:bg-gray-900 text-white shadow"
            >
              Fullscreen
            </button>
          )}
          {!isFullscreen && currentScreen !== undefined && (
            <button
              onClick={handleEdit}
              className="px-3 py-1 text-sm font-bold rounded bg-red-500 hover:bg-red-700 text-white shadow"
            >
              Edit
            </button>
          )}
        </div>
      )}

      {/* Background video */}
      <video
        autoPlay
        loop
        muted
        playsInline
        className="fixed inset-0 w-full h-full object-cover -z-10"
      >
        <source src={bgVideo} type="video/mp4" />
      </video>

      {/* Navigation bar (appears when editing) */}
      {editing && (
        <div className="w-full bg-gray-800 text-white shadow-md z-40">
          <div className="max-w-screen-xl mx-auto px-4 py-3 flex items-center gap-4">
            {/* Screen selector */}
            <ScreenSelection
              screens={screenIds}
              setScreens={setScreenIds}
              currentScreen={currentScreen}
              editing={editing}
              setWidgets={setWidgets}
              setCurrentScreen={setCurrentScreen}
            />

            <button
              onClick={() => setShowWidgetModal(true)}
              className="px-3 py-1 rounded bg-blue-500 hover:bg-blue-600 text-sm font-bold"
            >
              Add Widget
            </button>
            <button
              onClick={handleEdit}
              className="px-3 py-1 rounded bg-green-500 hover:bg-green-600 text-sm font-bold"
            >
              Save
            </button>
          </div>
        </div>
      )}

      <WidgetModal
        open={showWidgetModal || editingWidget !== undefined}
        onClose={() => {
          setEditingWidget(undefined);
          setShowWidgetModal(false);
        }}
        editingWidget={editingWidget}
        widgets={widgets || []}
        updateWidgets={setWidgets}
      />

      {/* Main content*/}
      <main className="flex-1">
        {widgets && (
          <GridLayoutWrapper
            setEditingWidget={setEditingWidget}
            widgets={widgets}
            onWidgetsChange={setWidgets}
            editing={editing}
          />
        )}
      </main>
    </div>
  );
}

export default App;
