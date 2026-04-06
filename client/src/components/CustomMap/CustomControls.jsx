"use client";

import useGeolocation from "@/hooks/useGeolocation";
import { ZoomControl, useMap } from "react-leaflet";
import { useEffect, useRef } from "react";
import L from "leaflet";

// Creates a native Leaflet control to avoid react-leaflet-custom-control incompatibility with v4
const LocateControl = () => {
  const map = useMap();
  const location = useGeolocation();
  const locationRef = useRef(location);
  const controlRef = useRef(null);

  // Keep locationRef in sync so the click handler always has the latest value
  useEffect(() => {
    locationRef.current = location;
  }, [location]);

  useEffect(() => {
    if (!map) return;

    const container = L.DomUtil.create("div", "leaflet-bar leaflet-control");
    const btn = L.DomUtil.create("a", "", container);

    btn.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
      <circle cx="12" cy="12" r="3"/><path d="M12 2v3M12 19v3M2 12h3M19 12h3"/>
    </svg>`;
    btn.href = "#";
    btn.title = "Mi ubicación";
    btn.style.cssText =
      "width:30px;height:30px;display:flex;align-items:center;justify-content:center;cursor:pointer;";

    L.DomEvent.on(btn, "click", (e) => {
      L.DomEvent.preventDefault(e);
      const user = locationRef.current?.user;
      if (Array.isArray(user) && user.length === 2 && user[0] !== 0) {
        map.panTo(user);
      }
    });
    L.DomEvent.disableClickPropagation(container);

    const control = L.control({ position: "topleft" });
    control.onAdd = () => container;
    control.addTo(map);
    controlRef.current = control;

    return () => {
      controlRef.current?.remove();
      controlRef.current = null;
    };
  }, [map]);

  return null;
};

const CustomControls = () => {
  return (
    <>
      <ZoomControl position="topleft" />
      <LocateControl />
    </>
  );
};

export default CustomControls;

