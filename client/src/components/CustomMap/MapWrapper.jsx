"use client";

import { MapContainer, TileLayer } from "react-leaflet";
import "leaflet/dist/leaflet.css";

/**
 * MapWrapper: Asegura que MapContainer siempre está presente
 * para que los child components puedan usar Leaflet hooks de forma segura.
 */
const MapWrapper = ({ center, zoom = 15, children }) => {
  // Validate center has proper structure
  if (!center || typeof center.lat !== "number" || typeof center.lng !== "number") {
    console.warn("Invalid center provided to MapWrapper:", center);
    return null; // Don't render if center is invalid
  }

  return (
    <MapContainer
      center={[center.lat, center.lng]}
      zoom={zoom}
      zoomControl={false}
      scrollWheelZoom={true}
      className="w-full h-full z-0"
    >
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution="https://www.openstreetmap.org/copyright contributors"
      />
      {children}
    </MapContainer>
  );
};

export default MapWrapper;
