import { useState } from "react";
import { Marker, Popup } from "react-map-gl/mapbox";
import { useGetAllRestaurants, type Restaurant } from "~/api/queries";
import { StarRating } from "~/components/ui/star-rating";

export function MapPins() {
  const { data: restaurants } = useGetAllRestaurants();
  const [selected, setSelected] = useState<Restaurant | null>(null);

  return (
    <>
      {restaurants?.map((restaurant) => (
        <Marker
          key={restaurant.id}
          longitude={restaurant.coordinates?.lng ?? 0}
          latitude={restaurant.coordinates?.lat ?? 0}
          anchor="bottom"
          color="red"
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
          <div className="p-2 min-w-[150px]">
            <h3 className="font-medium text-sm mb-2">{selected.name}</h3>
            <p className="text-xs mb-2">{selected.address}</p>
            <StarRating value={selected.rating} size="sm" />
          </div>
        </Popup>
      )}
    </>
  );
}
