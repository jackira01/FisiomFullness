"use client";

import dynamic from "next/dynamic";
import { useRef, useState } from "react";
import { useFormikContext } from "formik";
import axios from "axios";
import { BASE_URL } from "@/utils/api";
import { Button } from "@nextui-org/react";
import { MdEditLocation, MdSaveAlt, MdMyLocation } from "react-icons/md";

const LocationMapLeaflet = dynamic(() => import("./LocationMapLeaflet"), {
  ssr: false,
  loading: () => (
    <div className="w-full h-[320px] bg-gray-100 animate-pulse rounded-sm flex items-center justify-center text-gray-400 text-sm">
      Cargando mapa…
    </div>
  ),
});

const STATUS = { IDLE: "idle", LOADING: "loading", SUCCESS: "success", ERROR: "error" };

/**
 * Sección de ubicación del consultorio para el registro de profesionales.
 * - El botón "Ubicar en el mapa" se activa solo cuando país, estado y ciudad están completos.
 * - El mapa aparece solo después de geocodificar.
 * - El marcador solo es arrastrable en modo "edición" (botón Modificar/Guardar).
 */
export const LocationPickerField = () => {
  const { values, errors, touched, setFieldValue, setFieldTouched, setValues } =
    useFormikContext();

  const [geocodeStatus, setGeocodeStatus] = useState(STATUS.IDLE);
  const [statusMessage, setStatusMessage] = useState("");
  const [mapPosition, setMapPosition] = useState(null); // [lat, lng] confirmado y guardado
  const [pendingPosition, setPendingPosition] = useState(null); // posición en edición (drag)
  const [isEditing, setIsEditing] = useState(false);
  const lastQueryRef = useRef("");

  const canGeocode =
    values.country?.trim().length >= 2 &&
    values.state?.trim().length >= 2 &&
    values.city?.trim().length >= 2;

  const handleGeocode = async () => {
    const city = values.city.trim();
    const state = values.state.trim();
    const country = values.country.trim();
    const query = [city, state, country].join("|");

    if (query === lastQueryRef.current && mapPosition) return;

    setGeocodeStatus(STATUS.LOADING);
    setStatusMessage("");

    try {
      const { data } = await axios.get(`${BASE_URL}/users/geocode`, {
        params: { city, state, country },
      });

      lastQueryRef.current = query;
      const pos = [data.latitude, data.longitude];
      setMapPosition(pos);
      setPendingPosition(pos);
      // Actualización atómica de ambos campos para evitar validaciones intermedias con valores obsoletos
      setValues((prev) => ({
        ...prev,
        latitude: data.latitude,
        longitude: data.longitude,
      }));
      setFieldTouched("latitude", true, false);
      setFieldTouched("longitude", true, false);
      setGeocodeStatus(STATUS.SUCCESS);
      setStatusMessage(data.formattedAddress);
    } catch (err) {
      lastQueryRef.current = "";
      setGeocodeStatus(STATUS.ERROR);
      setStatusMessage(
        err.response?.data?.message ||
        "No se encontró la ubicación. Verifica País, Estado y Ciudad."
      );
    }
  };

  const handleStartEdit = () => {
    setPendingPosition(mapPosition);
    setIsEditing(true);
  };

  const handleSaveEdit = () => {
    if (pendingPosition) {
      setMapPosition(pendingPosition);
      setFieldValue("latitude", pendingPosition[0]);
      setFieldValue("longitude", pendingPosition[1]);
    }
    setIsEditing(false);
  };

  const handleMarkerDrag = (lat, lng) => {
    setPendingPosition([lat, lng]);
  };

  const locationError =
    (touched.latitude || touched.longitude) &&
    (errors.latitude || errors.longitude);

  const displayPosition = isEditing ? pendingPosition : mapPosition;

  return (
    <div className="flex flex-col gap-3 w-full">

      {/* Botón de geocodificación */}
      <div className="flex items-center gap-3 flex-wrap">
        <Button
          type="button"
          size="sm"
          isDisabled={!canGeocode || geocodeStatus === STATUS.LOADING}
          isLoading={geocodeStatus === STATUS.LOADING}
          onPress={handleGeocode}
          className="bg-secondary-500 text-white font-semibold rounded-sm flex items-center gap-1"
          startContent={geocodeStatus !== STATUS.LOADING ? <MdMyLocation size={18} /> : null}
        >
          {mapPosition ? "Volver a ubicar" : "Ubicar en el mapa"}
        </Button>

        {!canGeocode && geocodeStatus === STATUS.IDLE && (
          <span className="text-xs text-gray-400">
            Completa País, Estado/Provincia y Ciudad para habilitar
          </span>
        )}
      </div>

      {/* Mensaje de estado */}
      {geocodeStatus === STATUS.SUCCESS && (
        <p className="text-sm text-green-600 flex items-center gap-1">
          <span>✓</span>
          <span>{statusMessage}</span>
        </p>
      )}
      {geocodeStatus === STATUS.ERROR && (
        <p className="text-sm text-red-500">✗ {statusMessage}</p>
      )}

      {/* Mapa */}
      {displayPosition ? (
        <div className="flex flex-col gap-2">
          <div className="rounded-sm overflow-hidden border border-gray-200">
            <LocationMapLeaflet
              position={displayPosition}
              onMarkerDrag={handleMarkerDrag}
              draggable={isEditing}
            />
          </div>

          {/* Coordenadas */}
          <p className="text-xs text-gray-400">
            {isEditing ? (
              <span className="text-blue-500 font-medium">
                ✎ Arrastra el marcador para ajustar la posición exacta
              </span>
            ) : (
              <>
                Lat: {Number(values.latitude).toFixed(6)}, Lng:{" "}
                {Number(values.longitude).toFixed(6)}
              </>
            )}
          </p>

          {/* Botón Modificar / Guardar ubicación */}
          {isEditing ? (
            <Button
              type="button"
              size="sm"
              onPress={handleSaveEdit}
              className="self-start bg-green-600 text-white font-semibold rounded-sm"
              startContent={<MdSaveAlt size={18} />}
            >
              Guardar ubicación
            </Button>
          ) : (
            <Button
              type="button"
              size="sm"
              onPress={handleStartEdit}
              className="self-start bg-gray-700 text-white font-semibold rounded-sm"
              startContent={<MdEditLocation size={18} />}
            >
              Modificar ubicación
            </Button>
          )}
        </div>
      ) : (
        <div className="w-full h-[180px] bg-gray-50 border border-dashed border-gray-300 rounded-sm flex flex-col items-center justify-center gap-2 text-gray-400 text-sm">
          <span className="text-3xl select-none">📍</span>
          <span>El mapa aparecerá al dar clic en "Ubicar en el mapa"</span>
        </div>
      )}

      {/* Error de validación Formik */}
      {locationError && (
        <p className="text-sm text-red-500">
          {errors.latitude || errors.longitude}
        </p>
      )}
    </div>
  );
};
