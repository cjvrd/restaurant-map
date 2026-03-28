import { useState } from "react";
import { Marker, Popup } from "react-map-gl/mapbox";
import { MapPin, Phone, Globe, X, Plus } from "lucide-react";
import { useGetAllRestaurants, type Restaurant } from "~/api/queries";
import { useUpdateRestaurant } from "~/api/mutations";
import { StarRating } from "~/components/ui/star-rating";
import { Button } from "~/components/ui/button";

export function MapPins() {
  const { data: restaurants } = useGetAllRestaurants();
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const selected = restaurants?.find((r) => r.id === selectedId) ?? null;
  const setSelected = (r: Restaurant | null) => setSelectedId(r?.id ?? null);
  const updateRestaurant = useUpdateRestaurant();

  return (
    <>
      {restaurants?.map((restaurant) => (
        <Marker
          key={restaurant.id}
          longitude={restaurant.coordinates?.lng ?? 0}
          latitude={restaurant.coordinates?.lat ?? 0}
          anchor="bottom"
          color={restaurant.visit === "VISITED" ? "red" : "#fcba03"}
          onClick={(e) => {
            if (selected?.id === restaurant.id) {
              setSelected(null);
              return;
            }
            e.originalEvent.stopPropagation();
            setSelected(restaurant);
          }}
        />
      ))}

      {selected && (
        <Popup
          longitude={selected.coordinates?.lng ?? 0}
          latitude={selected.coordinates?.lat ?? 0}
          anchor="bottom"
          onClose={() => setSelected(null)}
          offset={50}
          closeButton={false}
        >
          <div className="pt-1 px-1 min-w-[220px] max-w-[280px] relative">
            <button
              onClick={() => setSelected(null)}
              className="absolute top-1.5 right-1.5 text-gray-400 hover:text-gray-600 cursor-pointer"
            >
              <X className="w-3.5 h-3.5" />
            </button>
            <h3 className="font-semibold text-sm pr-5">{selected.name}</h3>
            {(selected.address || selected.phone || selected.website) && (
              <div className="mt-1.5 space-y-1">
                {selected.address && (
                  <div className="flex items-start gap-1.5 text-xs text-gray-600">
                    <MapPin className="w-3.5 h-3.5 shrink-0 mt-0.5" />
                    <a
                      href={`https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(selected.address)}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="hover:underline"
                    >
                      {selected.address}
                    </a>
                  </div>
                )}
                {selected.phone && (
                  <div className="flex items-center gap-1.5 text-xs text-gray-600">
                    <Phone className="w-3.5 h-3.5 shrink-0" />
                    <a
                      href={`tel:${selected.phone}`}
                      className="hover:underline"
                    >
                      {selected.phone}
                    </a>
                  </div>
                )}
                {selected.website && (
                  <div className="flex items-center gap-1.5 text-xs text-gray-600">
                    <Globe className="w-3.5 h-3.5 shrink-0" />
                    <a
                      href={
                        selected.website.match(/^https?:\/\//)
                          ? selected.website
                          : `https://${selected.website}`
                      }
                      target="_blank"
                      rel="noopener noreferrer"
                      className="hover:underline truncate"
                    >
                      {selected.website}
                    </a>
                  </div>
                )}
              </div>
            )}
            {(selected.rating || selected.review) && (
              <div className="mt-2 pt-3 border-t border-gray-200">
                {selected.rating && (
                  <StarRating value={selected.rating} size="sm" />
                )}
                {selected.review && (
                  <p className="text-xs text-gray-600 mt-1 line-clamp-2">
                    {selected.review}
                  </p>
                )}
              </div>
            )}
            {selected.visit === "VISIT" ? (
              <div className="mt-2 pt-3 border-t border-gray-200">
                <Button
                  size="sm"
                  variant="outline"
                  className="w-full text-xs h-7"
                  disabled={updateRestaurant.isPending}
                  onClick={() => {
                    updateRestaurant.mutate(
                      { id: selected.id, visit: null },
                    );
                  }}
                >
                  <X className="size-4 mr-1" />
                  Remove from Visit List
                </Button>
              </div>
            ) : !selected.visit && (
              <div className="mt-2 pt-3 border-t border-gray-200">
                <Button
                  size="sm"
                  className="w-full text-xs h-7"
                  disabled={updateRestaurant.isPending}
                  onClick={() => {
                    updateRestaurant.mutate(
                      { id: selected.id, visit: "VISIT" },
                    );
                  }}
                >
                  <Plus className="size-4 mr-1" />
                  Want to Visit
                </Button>
              </div>
            )}
          </div>
        </Popup>
      )}
    </>
  );
}
