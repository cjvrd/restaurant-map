import { Map, GeolocateControl } from "react-map-gl/mapbox";
import "mapbox-gl/dist/mapbox-gl.css";

const accessToken = import.meta.env.VITE_MAPBOX_ACCESS_TOKEN;

export default function MapView() {
  return (
    <Map
      mapboxAccessToken={accessToken}
      initialViewState={{
        longitude: 144.9622548877161,
        latitude: -37.81421917899101,
        zoom: 11,
      }}
      style={{ width: "100%", height: "800px" }}
      mapStyle="mapbox://styles/mapbox/streets-v12"
      reuseMaps={true}
      attributionControl={false}
    >
      <GeolocateControl
        position="top-right"
        trackUserLocation={true}
        showUserHeading={true}
      />
    </Map>
  );
}
