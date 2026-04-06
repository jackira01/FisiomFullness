import { useEffect } from "react";
import { MapContainer, Marker, TileLayer, useMap } from "react-leaflet";
import { Icon } from "leaflet";
import "leaflet/dist/leaflet.css";

// Corrige el ícono por defecto de Leaflet roto en Webpack/Next.js
const markerIcon = new Icon({
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  iconRetinaUrl:
    "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});

function RecenterMap({ position }) {
  const map = useMap();
  useEffect(() => {
    map.setView(position, map.getZoom());
  }, [position, map]);
  return null;
}

/**
 * @param {[number, number]} position - [latitude, longitude]
 * @param {(lat: number, lng: number) => void} onMarkerDrag - callback al soltar el marcador
 * @param {boolean} draggable - si el marcador puede ser arrastrado (default: false)
 */
const LocationMapLeaflet = ({ position, onMarkerDrag, draggable = false }) => {
  return (
    <MapContainer
      center={position}
      zoom={15}
      scrollWheelZoom
      className="w-full h-[320px] z-0"
    >
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution="&copy; OpenStreetMap contributors"
      />
      <RecenterMap position={position} />
      <Marker
        position={position}
        icon={markerIcon}
        draggable={draggable}
        eventHandlers={
          draggable
            ? {
              dragend: (e) => {
                const { lat, lng } = e.target.getLatLng();
                onMarkerDrag?.(lat, lng);
              },
            }
            : {}
        }
      />
    </MapContainer>
  );
};

export default LocationMapLeaflet;
