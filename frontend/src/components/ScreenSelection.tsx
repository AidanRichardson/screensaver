import React, { useEffect, useState } from "react";
import type { WidgetConfig } from "../types/widget";

interface Props {
  currentScreen: number;
  editing: boolean;
  setWidgets: (widgets: WidgetConfig[]) => void;
  setCurrentScreen: (screens: number) => void;
}
const API_BASE = "/api/screens";

const ScreenSelection: React.FC<Props> = ({
  currentScreen,
  editing,
  setWidgets,
  setCurrentScreen,
}) => {
  const [screens, setScreens] = useState<number[]>([1]);

  // Fetch available screens
  useEffect(() => {
    const fetchScreens = async () => {
      try {
        const res = await fetch(`${API_BASE}`);
        if (!res.ok) throw new Error("Failed to fetch screens");

        const data = await res.json();
        setScreens(data.screens);
      } catch (err) {
        console.error("Error fetching screens:", err);
      }
    };

    fetchScreens();
  }, []);

  // Add a new screen
  const handleAddScreen = async () => {
    const nextId = screens.length > 0 ? Math.max(...screens) + 1 : 1;

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

  return (
    <div
      className={`${
        editing ? "flex" : "hidden"
      } flex-row flex-wrap items-center gap-3 my-4`}
    >
      <div className="flex flex-row flex-wrap items-center gap-2 dark:bg-gray-800 p-2 rounded-xl shadow-sm">
        {screens.map((screenId) => (
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
            Screen {screenId}
          </button>
        ))}

        <button
          onClick={handleAddScreen}
          className="px-4 py-2 rounded-full font-medium bg-blue-500 text-white hover:bg-blue-600 transition-colors duration-200 shadow-md"
        >
          + Add Screen
        </button>
      </div>
    </div>
  );
};

export default ScreenSelection;
