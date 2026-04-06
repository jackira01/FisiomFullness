// @ts-check
"use client";
import { useEffect, useState } from "react";
import { useAtom } from "jotai";
import { filtersAtom } from "../components/Servicios/store/servicios";
import { BiSolidWebcam, BiSolidHome } from "react-icons/bi";
import { FaBriefcaseMedical, FaLocationDot } from "react-icons/fa6";
import { Autocomplete, AutocompleteItem } from "@nextui-org/react";
import { Tabs, Tab } from "@nextui-org/tabs";
import { CustomButton } from "@/features/ui";
import { useRouter } from "next/navigation";
import { getProfessionalFilters } from "@/services/professionals";
import {
  buildSpecialtyOptions,
  getCitiesForState,
  mapColombiaStates,
} from "@/utils/professionalFilters";

/**
 * @typedef {{id: string; name: string}} SelectOption
 * @typedef {{search: string[], specialtyId: string, state: string, city: string, country: string, page: number}} Filter
 */

/**
 * @typedef {{id: string; name: string, country?: string, cities?: SelectOption[]}} LocationOption
 */

/**
 * @description Componente reutilizable solo para HomeClient
 * @param {{
 *   name?: string;
 *   label: string;
 *   placeholder: string;
 *   items: SelectOption[] | LocationOption[];
 *   itemsStartContent: keyof JSX.IntrinsicElements | import("react-icons").IconType;
 *   onSelectionChange?: ((key: React.Key | null) => void) | undefined
 *   selectedKeys?: string[];
 *   selectedKey?: string;
 *   className?: string;
 * }} props
 *
 * @returns {React.ReactNode}
 */
const CustomSelect = ({
  name,
  label,
  placeholder,
  items,
  itemsStartContent,
  onSelectionChange,
  ...props
}) => {
  const DynamicTag = itemsStartContent;

  return (
    <Autocomplete
      label={label}
      labelPlacement="outside"
      placeholder={placeholder}
      className="w-full sm:max-w-sm"
      defaultItems={items}
      listboxProps={{
        color: "primary",
      }}
      allowsCustomValue={true}
      onSelectionChange={onSelectionChange}
      {...props}
    >
      {(item) => (
        <AutocompleteItem key={item.id || item.name} textValue={item.name}>
          <div className="flex items-center gap-2">
            <DynamicTag alt={item.name} className="text-primary-300" />
            <span>{item.name}</span>
          </div>
        </AutocompleteItem>
      )}
    </Autocomplete>
  );
};

const useProfessionalFilterOptions = () => {
  const [filterOptions, setFilterOptions] = useState({
    specialties: [],
    states: [],
  });

  useEffect(() => {
    const fetchFilterOptions = async () => {
      try {
        const data = await getProfessionalFilters();
        setFilterOptions({
          specialties: buildSpecialtyOptions(data.specialties || []),
          states: mapColombiaStates(),
        });
      } catch (error) {
        console.error("Error fetching professional filter options:", error);
      }
    };

    fetchFilterOptions();
  }, []);

  return filterOptions;
};

const CitaDomiciliaria = () => {
  const { specialties, states } = useProfessionalFilterOptions();
  const [filters, setFilters] = useAtom(filtersAtom);
  const [localSpecialtyId, setLocalSpecialtyId] = useState(
    /** @type {string} */ filters.specialtyId,
  );
  const [localState, setLocalState] = useState(/** @type {string} */ filters.state);
  const [localCity, setLocalCity] = useState(/** @type {string} */ filters.city);
  const router = useRouter();
  const cities = getCitiesForState(states, localState);

  const handleClick = () => {
    setFilters((prev) => ({
      ...prev,
      state: localState,
      city: localCity,
      country: localState ? "Colombia" : "",
      specialtyId: localSpecialtyId,
      page: 1,
    }));
    router.push(`/servicios`);
  };

  return (
    <form className="flex sm:flex-row flex-col gap-4">
      <CustomSelect
        label="Especialidad"
        placeholder="Seleccione una especialidad"
        items={specialties}
        selectedKey={localSpecialtyId}
        onSelectionChange={(value) => {
          if (value) {
            setLocalSpecialtyId(String(value));
          } else {
            setLocalSpecialtyId("");
          }
        }}
        itemsStartContent={FaBriefcaseMedical}
      />

      <CustomSelect
        label="Departamento"
        placeholder="Seleccione un departamento"
        items={states}
        selectedKey={localState}
        itemsStartContent={FaLocationDot}
        onSelectionChange={(value) => {
          if (value) {
            setLocalState(String(value));
            setLocalCity("");
          } else {
            setLocalState("");
            setLocalCity("");
          }
        }}
      />

      <CustomSelect
        label="Ciudad"
        placeholder="Seleccione una ciudad"
        items={cities}
        selectedKey={localCity}
        itemsStartContent={FaLocationDot}
        onSelectionChange={(value) => {
          if (value) {
            setLocalCity(String(value));
          } else {
            setLocalCity("");
          }
        }}
        isDisabled={!localState}
      />

      <CustomButton
        onClick={handleClick}
        isDisabled={!localSpecialtyId && !localState && !localCity}
        className="rounded-xl sm:self-end self-start px-12 shrink-0"
      >
        Buscar
      </CustomButton>
    </form>
  );
};

const CitaOnline = () => {
  const { specialties } = useProfessionalFilterOptions();
  const [filters, setFilters] = useAtom(filtersAtom);
  const [localSpecialtyId, setLocalSpecialtyId] = useState(filters.specialtyId);
  const router = useRouter();

  const handleClick = () => {
    setFilters((filters) => ({
      ...filters,
      specialtyId: localSpecialtyId,
      state: "",
      city: "",
      country: "",
      page: 1,
    }));
    router.push(`/servicios`);
  };

  return (
    <form className="flex sm:flex-row flex-col gap-4 sm:justify-center">
      <CustomSelect
        label="Especialidad"
        placeholder="Seleccione una especialidad"
        items={specialties}
        selectedKey={localSpecialtyId}
        onSelectionChange={(value) => {
          if (value) {
            setLocalSpecialtyId(String(value));
          } else {
            setLocalSpecialtyId("");
          }
        }}
        itemsStartContent={FaBriefcaseMedical}
        className="sm:mr-auto"
      />

      <CustomButton
        onClick={handleClick}
        isDisabled={!localSpecialtyId}
        className="rounded-xl sm:self-end self-start px-12 shrink-0"
      >
        Buscar
      </CustomButton>
    </form>
  );
};

export default function HomeClient() {
  /** @typedef {import('react-aria-components').Key} Key */

  // NOTE: https://github.com/microsoft/TypeScript/issues/27387
  const [selected, setSelected] = useState(
    /** @type {Key} */("citaDomiciliaria"),
  );

  return (
    <Tabs
      fullWidth
      color="primary"
      aria-label="Tabs-form"
      disableAnimation
      selectedKey={selected}
      onSelectionChange={setSelected}
    >
      <Tab
        key="citaDomiciliaria"
        title={
          <div className="flex items-center space-x-2">
            <BiSolidHome />
            <span>Cita Domiciliaria</span>
          </div>
        }
      >
        <CitaDomiciliaria />
      </Tab>
      <Tab
        key="citaOnline"
        title={
          <div className="flex items-center space-x-2">
            <BiSolidWebcam />
            <span>Cita Online</span>
          </div>
        }
      >
        <CitaOnline />
      </Tab>
    </Tabs>
  );
}
