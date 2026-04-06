import { useEffect } from "react";
import { useSession } from "next-auth/react";
import { atom, useAtom } from "jotai";

const isValidCoordinates = (coordinates) => {
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

const locationAtom = atom({
    user: null,
});

const useGeolocation = () => {
    const { data: session } = useSession();
    const [location, setLocation] = useAtom(locationAtom);

    const onSuccess = (position) => {
        const nextCoordinates = [
            position.coords.latitude,
            position.coords.longitude,
        ];

        setLocation((prev) => ({
            ...prev,
            user: isValidCoordinates(nextCoordinates) ? nextCoordinates : null,
        }));
    };

    const onError = () => {
        const sessionCoordinates = session?.user?.coordinates;

        setLocation((prev) => ({
            ...prev,
            user: isValidCoordinates(sessionCoordinates) ? sessionCoordinates : null,
        }));
    };

    useEffect(() => {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(onSuccess, onError);
        } else {
            onError();
        }
    }, [session]);

    return location;
};
export default useGeolocation