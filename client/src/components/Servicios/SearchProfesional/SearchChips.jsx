"use client";
import { Chip } from "@nextui-org/react";
import { useAtom } from "jotai";
import { filtersAtom } from "../store/servicios";

export default function SearchChips() {
  const [filters, setFilters] = useAtom(filtersAtom);

  return (
    <div className="flex gap-1 px-5">
      {filters.state ?
        (<Chip
          size="md"
          radius="sm"
          color="warning"
          onClose={() =>
            setFilters((currentFilters) => ({
              ...currentFilters,
              state: "",
              city: "",
              country: "",
              page: 1,
            }))
          }
        >
          {filters.state}
        </Chip>) : null
      }
      {filters.city ?
        (<Chip
          size="md"
          radius="sm"
          color="success"
          onClose={() =>
            setFilters((currentFilters) => ({
              ...currentFilters,
              city: "",
              page: 1,
            }))
          }
        >
          {filters.city}
        </Chip>) : null
      }
      {filters.search.map((chip, index) => (
        chip ?
          (<Chip
            key={index}
            size="md"
            radius="sm"
            color="primary"
            onClose={() =>
              setFilters((currentFilters) => ({
                ...currentFilters,
                search: currentFilters.search.filter((c) => c !== chip),
                page: 1,
              }))
            }
          >
            {chip}
          </Chip>) : null
      ))}
    </div>
  );
}
