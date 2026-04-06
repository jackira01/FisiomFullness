"use client";

import { useAtom } from "jotai";
import { Autocomplete, AutocompleteItem } from "@nextui-org/react";
import { FaLocationDot } from "react-icons/fa6";
import { filtersAtom } from "../store/servicios";

export default function SearchState({ states }) {
  const [filters, setFilters] = useAtom(filtersAtom);

  const onSelectionChange = (value) => {
    const newState = value ? String(value) : "";
    setFilters((currentFilters) => {
      // Si el valor no cambió evitamos un ciclo infinito de re-renders
      if (currentFilters.state === newState) return currentFilters;
      return {
        ...currentFilters,
        state: newState,
        city: "",
        country: newState ? currentFilters.country || "" : "",
        page: 1,
      };
    });
  };

  return (
    <Autocomplete
      label="Departamento"
      placeholder="Departamento"
      className="w-full sm:max-w-sm"
      defaultItems={states}
      listboxProps={{
        color: "primary",
      }}
      selectedKey={filters.state || null}
      onSelectionChange={onSelectionChange}
    >
      {(item) => (
        <AutocompleteItem key={item.id} textValue={item.name}>
          <div className="flex items-center gap-2">
            <FaLocationDot className="text-primary-300" />
            <span>{item.name}</span>
          </div>
        </AutocompleteItem>
      )}
    </Autocomplete>
  );
}