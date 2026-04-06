"use client";

import { useEffect, useState } from "react";
import { useAtom } from "jotai";
import SearchChips from "./SearchChips";
import SearchSpecialty from "./SearchSpecialty";
import SearchInput from "./SearchInput";
import SearchState from "./SearchState";
import SearchCity from "./SearchCity";
import { filtersAtom } from "../store/servicios";
import { getProfessionalFilters } from "@/services/professionals";
import {
  buildSpecialtyOptions,
  getCitiesForState,
  mapColombiaStates,
} from "@/utils/professionalFilters";

const SearchProfesional = () => {
  const [filters] = useAtom(filtersAtom);
  const [specialties, setSpecialties] = useState([]);
  const [states, setStates] = useState([]);

  useEffect(() => {
    const fetchFilterOptions = async () => {
      try {
        const data = await getProfessionalFilters();
        setSpecialties(buildSpecialtyOptions(data.specialties || []));
        setStates(mapColombiaStates());
      } catch (error) {
        console.error("Error fetching professional filters:", error);
      }
    };

    fetchFilterOptions();
  }, []);

  const cities = getCitiesForState(states, filters.state);

  return (
    <div className="w-full flex flex-col gap-2 bg-white border border-default-100 rounded-2xl shadow-sm px-5 py-4">
      <p className="text-xs font-semibold text-default-400 uppercase tracking-widest mb-1">Buscar profesionales</p>
      <div className="flex flex-col sm:flex-row sm:flex-wrap gap-3">
        <SearchInput />
        <SearchSpecialty specialties={specialties} />
        {/* key fuerza remount del Autocomplete cuando el valor se limpia externamente (chip) */}
        <SearchState key={filters.state || "state-empty"} states={states} />
        <SearchCity key={filters.city || "city-empty"} cities={cities} />
      </div>
      <SearchChips />
    </div>
  );
};

export default SearchProfesional;
