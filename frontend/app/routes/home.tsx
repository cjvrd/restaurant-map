import { useState } from "react";
import MapView from "./map";
import RestaurantsList from "./restaurants";

export default function Home() {
  const [view, setView] = useState<"map" | "list">("map");

  return (
    <div className="relative flex flex-col h-[calc(100vh-4rem)]">
      <div className="absolute top-3 left-1/2 -translate-x-1/2 z-10">
        <div className="relative inline-flex rounded-md border bg-white shadow p-1">
          <div
            className="absolute top-1 bottom-1 w-[calc(50%-4px)] bg-primary rounded transition-transform duration-300 ease-in-out"
            style={{
              transform: view === "map" ? "translateX(0)" : "translateX(100%)",
            }}
          />
          <button
            onClick={() => setView("map")}
            className={`relative z-10 px-4 py-1 text-sm font-medium rounded transition-colors duration-300 cursor-pointer ${
              view === "map"
                ? "text-primary-foreground"
                : "text-muted-foreground"
            }`}
          >
            Map
          </button>
          <button
            onClick={() => setView("list")}
            className={`relative z-10 px-4 py-1 text-sm font-medium rounded transition-colors duration-300 cursor-pointer ${
              view === "list"
                ? "text-primary-foreground"
                : "text-muted-foreground"
            }`}
          >
            List
          </button>
        </div>
      </div>

      <div className="flex-1 overflow-auto bg-gray-50">
        {view === "map" ? (
          <MapView />
        ) : (
          <div className="pt-14">
            <RestaurantsList />
          </div>
        )}
      </div>
    </div>
  );
}
