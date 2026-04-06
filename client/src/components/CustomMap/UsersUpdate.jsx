import axios from "axios";
import { apiEndpoints } from "../../api_endpoints";
import { useEffect } from "react";
import { useAtom } from "jotai";
import { filtersAtom } from "../Comunidad/store/comunidad";
import useGeolocation from "@/hooks/useGeolocation";
import { useMap, useMapEvents } from "react-leaflet";

const UsersUpdate = ({ markers, setMarkers, toggle }) => {
  const map = useMap();
  const locations = useGeolocation();
  const [filters] = useAtom(filtersAtom);

  const updateMapUsers = (abortController) => {
    try {
      axios
        .get(apiEndpoints.users, {
          signal: abortController.signal,
          params: {
            search: encodeURIComponent(filters.search),
            interests: filters.interestsId.join(","),
            bbox: map.getBounds().toBBoxString(),
          },
          withCredentials: true,
        })
        .then(({ data }) => {
          setMarkers((prev) => {
            const usersMap = new Map([...prev].map((item) => [item._id, item]));
            data.users.forEach((user) => {
              if (!usersMap.has(user._id)) {
                usersMap.set(user._id, user);
              }
            });
            return Array.from(usersMap.values());
          });
        })
        .catch((err) => {
          if (err.name === "CanceledError") return;
          console.error("Error fetching users:", err);
        });
    } catch (err) {
      console.error("Error in updateMapUsers:", err);
    }
  };

  useEffect(() => {
    const abortController = new AbortController();
    // Only fetch if map is initialized and has bounds
    if (map && map.getBounds) {
      updateMapUsers(abortController);
    }
    return () => abortController.abort();
  }, [toggle, map]);

  useMapEvents({
    moveend: () => {
      const abortController = new AbortController();
      updateMapUsers(abortController);
      return () => abortController.abort();
    },
  });

  return null;
};

export default UsersUpdate;
