import { convertToUserTimezone } from "./timeFormat"

export const filterAppointments = (appointments) => {
    // Verifica que appointments sea un array, de lo contrario, usa un array vacío
    const filter = (Array.isArray(appointments) ? appointments : []).map((appointment) => ({
        ...appointment,
        start: convertToUserTimezone(appointment.start),
        end: convertToUserTimezone(appointment.end)
    }));
    return filter;
};
