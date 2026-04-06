"use client";

import { useAtom } from "jotai";
import { Autocomplete, AutocompleteItem } from "@nextui-org/react";
import { CiLocationOn } from "react-icons/ci";
import { filtersAtom } from "../store/servicios";

export default function SearchCity({ cities }) {
  const [filters, setFilters] = useAtom(filtersAtom);

  const onSelectionChange = (value) => {
    const newCity = value ? String(value) : "";
    setFilters((currentFilters) => {
      if (currentFilters.city === newCity) return currentFilters;
      return {
        ...currentFilters,
        city: newCity,
        page: 1,
      };
    });
  };

  return (
    <Autocomplete
      label="Ciudad"
      placeholder="Ciudad"
      className="w-full sm:max-w-sm"
      defaultItems={cities}
      listboxProps={{
        color: "primary",
      }}
      selectedKey={filters.city || null}
      onSelectionChange={onSelectionChange}
      isDisabled={!filters.state}
    >
      {(item) => (
        <AutocompleteItem key={item.id} textValue={item.name}>
          <div className="flex items-center gap-2">
            <CiLocationOn className="text-primary-300" />
            <span>{item.name}</span>
          </div>
        </AutocompleteItem>
      )}
    </Autocomplete>
  );
}