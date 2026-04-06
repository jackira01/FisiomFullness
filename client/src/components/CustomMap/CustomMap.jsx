"use client";

import { usePathname } from "next/navigation";
import { Marker } from "react-leaflet";
import { Icon } from "leaflet";
import UsersUpdate from "./UsersUpdate";
import CustomControls from "./CustomControls";
import useGeolocation from "@/hooks/useGeolocation";
import MapWrapper from "./MapWrapper";

const COLOMBIA_CENTER = { lat: 4.5709, lng: -74.2973 };
const COLOMBIA_ZOOM = 6;
const DEFAULT_MARKER_ZOOM = 13;

const isValidMarkerCoordinates = (coordinates) => {
  if (!Array.isArray(coordinates) || coordinates.length !== 2) {
    return false;
  }

  const [longitude, latitude] = coordinates;

  return (
    typeof latitude === "number" &&
    typeof longitude === "number" &&
    Number.isFinite(latitude) &&
    Number.isFinite(longitude) &&
    latitude >= -90 &&
    latitude <= 90 &&
    longitude >= -180 &&
    longitude <= 180 &&
    !(latitude === 0 && longitude === 0)
  );
};

const isValidUserCoordinates = (coordinates) => {
  if (!Array.isArray(coordinates) || coordinates.length !== 2) {
    return false;
  }

  const [latitude, longitude] = coordinates;

  return (
    typeof latitude === "number" &&
    typeof longitude === "number" &&
    Number.isFinite(latitude) &&
    Number.isFinite(longitude) &&
    latitude >= -90 &&
    latitude <= 90 &&
    longitude >= -180 &&
    longitude <= 180 &&
    !(latitude === 0 && longitude === 0)
  );
};

const professionalIcon = new Icon({
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  iconRetinaUrl:
    "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});

const CustomMap = ({ markers, setMarkers, user }) => {
  const customIcon = new Icon({
    iconUrl: professionalIcon.options.iconUrl,
    iconRetinaUrl: professionalIcon.options.iconRetinaUrl,
    shadowUrl: professionalIcon.options.shadowUrl,
    iconSize: professionalIcon.options.iconSize,
    iconAnchor: professionalIcon.options.iconAnchor,
    popupAnchor: professionalIcon.options.popupAnchor,
    shadowSize: professionalIcon.options.shadowSize,
  });
  const userIcon = new Icon({
    iconUrl: "/pin_red.png",
    iconSize: [38, 38],
  });

  const location = useGeolocation();
  const pathname = usePathname();
  const validUserLocation = isValidUserCoordinates(location?.user)
    ? location.user
    : null;
  const validMarkers = (markers || []).filter((marker) =>
    isValidMarkerCoordinates(marker?.location?.coordinates)
  );

  const getMapView = () => {
    const firstMarkerWithLocation = validMarkers[0]?.location?.coordinates;

    if (isValidMarkerCoordinates(firstMarkerWithLocation)) {
      return {
        center: { lat: firstMarkerWithLocation[1], lng: firstMarkerWithLocation[0] },
        zoom: DEFAULT_MARKER_ZOOM,
      };
    }

    if (validUserLocation) {
      return {
        center: { lat: validUserLocation[0], lng: validUserLocation[1] },
        zoom: DEFAULT_MARKER_ZOOM,
      };
    }

    return {
      center: COLOMBIA_CENTER,
      zoom: COLOMBIA_ZOOM,
    };
  };

  const { center, zoom } = getMapView();

  if (!center || typeof center.lat !== "number" || typeof center.lng !== "number") {
    return null;
  }

  return (
    <MapWrapper center={center} zoom={zoom}>
      <CustomControls />
      {pathname === "/comunidad" && (
        <UsersUpdate
          markers={markers}
          setMarkers={setMarkers}
          toggle={false}
        />
      )}
      {validUserLocation ? (
        <Marker position={validUserLocation} icon={userIcon} />
      ) : null}
      {validMarkers.map((marker) => {
        const coords = marker?.location?.coordinates;
        return (
          <Marker
            key={marker._id}
            position={[coords[1], coords[0]]} // GeoJSON [lng, lat] -> Leaflet [lat, lng]
            icon={customIcon}
          />
        );
      })}
    </MapWrapper>
  );
};

export default CustomMap;
