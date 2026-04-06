import { colombiaStates } from "@/data/colombiaStates";

export const normalizeText = (value = "") =>
  String(value)
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .trim()
    .toLowerCase();

export const buildSpecialtyOptions = (specialties = []) => {
  const specialtyMap = new Map();

  specialties.forEach((specialty) => {
    const name =
      typeof specialty === "string"
        ? specialty.trim()
        : String(specialty?.name || "").trim();

    if (!name) return;

    specialtyMap.set(normalizeText(name), {
      id: name,
      name,
    });
  });

  return [...specialtyMap.values()].sort((left, right) =>
    left.name.localeCompare(right.name, "es")
  );
};

export const mapColombiaStates = () => {
  return colombiaStates
    .map((state) => ({
      id: state.name,
      name: state.name,
      country: state.country || "Colombia",
      cities: [...(state.cities || [])]
        .sort((left, right) => left.localeCompare(right, "es"))
        .map((city) => ({ id: city, name: city })),
    }))
    .sort((left, right) => left.name.localeCompare(right.name, "es"));
};

export const mapAvailableStates = (availableStates = []) => {
  const statesMap = new Map();

  availableStates.forEach((state) => {
    const stateName = String(state?.name || "").trim();
    if (!stateName) return;

    statesMap.set(normalizeText(stateName), {
      country: state?.country || "Colombia",
      cities: new Set((state?.cities || []).map((city) => normalizeText(city))),
    });
  });

  return colombiaStates
    .filter((state) => statesMap.has(normalizeText(state.name)))
    .map((state) => {
      const matchedState = statesMap.get(normalizeText(state.name));
      const cities = state.cities
        .filter((city) => matchedState.cities.has(normalizeText(city)))
        .sort((left, right) => left.localeCompare(right, "es"))
        .map((city) => ({ id: city, name: city }));

      return {
        id: state.name,
        name: state.name,
        country: matchedState.country,
        cities,
      };
    })
    .sort((left, right) => left.name.localeCompare(right.name, "es"));
};

export const getCitiesForState = (states = [], selectedState = "") => {
  const state = states.find(
    (item) => normalizeText(item.name) === normalizeText(selectedState)
  );

  return state?.cities || [];
};