import { Marker } from "react-map-gl/mapbox";
import { useGetAllRestaurants } from "~/api/queries";

interface Pin {
  longitude: number;
  latitude: number;
  color: string;
}

const samplePins: Pin[] = [
  {
    longitude: 144.9622548877161,
    latitude: -37.81421917899101,
    color: "red",
  },
  {
    longitude: 144.97,
    latitude: -37.81,
    color: "green",
  },
  {
    longitude: 144.95,
    latitude: -37.82,
    color: "yellow",
  },
];

export function MapPins() {
  const { data: restaurants } = useGetAllRestaurants();
  console.log("restaurants", restaurants);

  return (
    <>
      {restaurants?.map((restaurant, index) => (
        <Marker
          key={index}
          longitude={restaurant.coordinates?.lng ?? 0}
          latitude={restaurant.coordinates?.lat ?? 0}
          anchor="bottom"
          color="red"
        ></Marker>
      ))}
    </>
  );
}
