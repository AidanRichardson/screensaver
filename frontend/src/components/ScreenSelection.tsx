import React from "react";
import type { WidgetConfig } from "../types/widget";

interface Props {
  screens: number[];
  setScreens: (screens: number[]) => void;
  currentScreen: number | undefined;
  editing: boolean;
  setWidgets: (widgets: WidgetConfig[]) => void;
  setCurrentScreen: (screens: number) => void;
}
const API_BASE = "/api/screens";

const ScreenSelection: React.FC<Props> = ({
  screens,
  setScreens,
  currentScreen,
  editing,
  setWidgets,
  setCurrentScreen,
}) => {
  // Add a new screen (id = timestamp)
  const handleAddScreen = async () => {
    const nextId = Date.now();

    try {
      const res = await fetch(`${API_BASE}/${nextId}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify([]),
      });
      if (!res.ok) throw new Error("Failed to create screen");

      setScreens((prev) => [...prev, nextId]);
      setCurrentScreen(nextId);
      setWidgets([]);
    } catch (err) {
      console.error("Server error:", err);
    }
  };

  const deleteScreen = async () => {
    if (editing && currentScreen !== undefined) {
      try {
        const res = await fetch(`${API_BASE}/${currentScreen}`, {
          method: "DELETE",
          headers: { "Content-Type": "application/json" },
        });
        if (!res.ok) throw new Error("Failed to delete screen");

        setScreens((prevScreens) => {
          const updated = prevScreens.filter((s) => s !== currentScreen);

          if (updated.length === 0) {
            setCurrentScreen(Date.now());
          } else {
            const sorted = [...updated].sort((a, b) => a - b);
            const next = sorted.find((s) => s > currentScreen) ?? sorted[0];
            setCurrentScreen(next);
          }

          return updated;
        });
      } catch (err) {
        console.error("Server error:", err);
      }
    }
  };

  return (
    <div
      className={`${
        editing ? "flex" : "hidden"
      } flex-row flex-wrap items-center gap-3 my-4`}
    >
      <div className="flex flex-row flex-wrap items-center gap-2 dark:bg-gray-800 p-2 rounded-xl shadow-sm">
        {screens.map((screenId, index) => (
          <button
            key={screenId}
            onClick={() => setCurrentScreen(screenId)}
            className={`px-4 py-2 rounded-full font-medium transition-colors duration-200 shadow-sm
              ${
                currentScreen === screenId
                  ? "bg-yellow-500 text-white shadow-md"
                  : "bg-white text-gray-700 hover:bg-yellow-100 dark:bg-gray-700 dark:text-gray-200 dark:hover:bg-gray-600"
              }`}
          >
            Screen {index + 1}
          </button>
        ))}

        <button
          onClick={handleAddScreen}
          className="px-4 py-2 rounded-full font-medium bg-blue-500 text-white hover:bg-blue-600 transition-colors duration-200 shadow-md"
        >
          + Add Screen
        </button>
        <button
          onClick={deleteScreen}
          className="px-4 py-2 rounded-full font-medium bg-red-500 text-white hover:bg-red-600 transition-colors duration-200 shadow-md"
        >
          - Delete Screen
        </button>
      </div>
    </div>
  );
};

export default ScreenSelection;
