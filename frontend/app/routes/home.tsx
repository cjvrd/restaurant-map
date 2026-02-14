import { useState } from "react";
import { Button } from "~/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "~/components/ui/dialog";
import MapView from "./map";
import RestaurantsList from "./restaurants";
import { AddRestaurantForm } from "./add-restaurant";

export default function Home() {
  const [view, setView] = useState<"map" | "list">("map");
  const [modalOpen, setModalOpen] = useState(false);

  return (
    <div className="relative flex flex-col h-[calc(100vh-4rem)]">
      <div className="absolute top-3 left-1/2 -translate-x-1/2 z-10">
        <div className="relative inline-flex rounded-md border bg-white shadow p-1">
          <div
            className="absolute top-1 bottom-1 w-[calc(50%-4px)] bg-primary rounded transition-transform duration-300 ease-in-out"
            style={{ transform: view === "map" ? "translateX(0)" : "translateX(100%)" }}
          />
          <button
            onClick={() => setView("map")}
            className={`relative z-10 px-4 py-1 text-sm font-medium rounded transition-colors duration-300 ${
              view === "map" ? "text-primary-foreground" : "text-muted-foreground"
            }`}
          >
            Map
          </button>
          <button
            onClick={() => setView("list")}
            className={`relative z-10 px-4 py-1 text-sm font-medium rounded transition-colors duration-300 ${
              view === "list" ? "text-primary-foreground" : "text-muted-foreground"
            }`}
          >
            List
          </button>
        </div>
      </div>

      <div className="flex-1 overflow-auto">
        {view === "map" ? (
          <MapView />
        ) : (
          <div className="pt-14">
            <RestaurantsList />
            <div className="flex justify-center px-4">
              <Button size="lg" onClick={() => setModalOpen(true)}>
                + Add Restaurant
              </Button>
            </div>
          </div>
        )}
      </div>

      <Dialog open={modalOpen} onOpenChange={setModalOpen}>
        <DialogContent className="max-h-[85vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Add a New Restaurant</DialogTitle>
          </DialogHeader>
          <AddRestaurantForm onSuccess={() => setModalOpen(false)} />
        </DialogContent>
      </Dialog>
    </div>
  );
}
