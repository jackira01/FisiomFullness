"use client";
import { useAtom } from "jotai";
import { filtersAtom } from "../store/servicios";
import { AiFillHome } from "react-icons/ai";
import { FaBriefcaseMedical } from "react-icons/fa6";
import { Autocomplete, AutocompleteItem } from "@nextui-org/react";

export default function SearchSpecialty({ specialties }) {
  const [filters, setFilters] = useAtom(filtersAtom);

  const onSelectionChange = (value) => {
    setFilters((currentFilters) => ({
      ...currentFilters,
      specialtyId: value ? String(value) : "",
      page: 1,
    }));
  };

  return (
    <Autocomplete
      startsWidth={<AiFillHome />}
      label="Seleccione:"
      placeholder="Especialidad"
      className="w-full sm:max-w-sm"
      defaultItems={specialties}
      listboxProps={{
        color: "primary",
      }}
      selectedKey={filters.specialtyId || null}
      onSelectionChange={onSelectionChange}
    >
      {(item) => (
        <AutocompleteItem key={item.id} textValue={item.name}>
          <div className="flex items-center gap-2">
            <FaBriefcaseMedical alt={item.name} className="text-primary-300" />
            <span>{item.name}</span>
          </div>
        </AutocompleteItem>
      )}
    </Autocomplete>
  );
}
