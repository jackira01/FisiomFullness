"use client";

import { useState, useEffect, useRef } from "react";
import { useAtom } from "jotai";
import { filtersAtom } from "./store/servicios";
import useGeolocation from "@/hooks/useGeolocation";
import ServicioMainContainer from "./ServicioMainContainer";
import SearchProfesional from "./SearchProfesional/SearchProfesional";
import dynamic from "next/dynamic";
import { getProfessionals } from "@/services/professionals";
import { useInView } from "framer-motion";
import Loader from "../Loader";

const CustomMap = dynamic(() => import("@/components/CustomMap/CustomMap"), {
  loading: () => <p>loading...</p>,
  ssr: false,
});

const ServicioMain = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { amount: 1 });

  const [loading, setLoading] = useState(true);
  const [professionals, setProfessionals] = useState([]);
  const [totalPages, setTotalPages] = useState(1);
  const [filters, setFilters] = useAtom(filtersAtom);

  const location = useGeolocation();
  // Serializar las coordenadas para evitar re-renders por nueva referencia de objeto
  const locationKey = Array.isArray(location.user) && location.user.some(Boolean)
    ? location.user.join(',')
    : '';

  useEffect(() => {
    const abortController = new AbortController();
    setLoading(true);

    const fetchProfessionals = async () => {
      try {
        const data = await getProfessionals({
          search: filters.search.join(","),
          state: filters.state,
          city: filters.city,
          country: filters.country,
          specialtyId: filters.specialtyId,
          position: locationKey,
          page: filters.page,
        });

        if (filters.page === 1) {
          setProfessionals(data.users || []);
        } else {
          setProfessionals((prev) => {
            const professionalsMap = new Map(
              [...prev].map((item) => [item._id, item])
            );
            (data.users || []).forEach((professional) => {
              if (!professionalsMap.has(professional._id)) {
                professionalsMap.set(professional._id, professional);
              }
            });
            return Array.from(professionalsMap.values());
          });
        }
        setTotalPages(data.totalPages || 1);
      } catch (error) {
        if (error.name === "CanceledError") return;
        console.error('Error fetching professionals:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchProfessionals();
    return () => abortController.abort();
  }, [filters, locationKey]);

  useEffect(() => {
    isInView &&
      filters.page < totalPages &&
      setFilters((prev) => ({ ...prev, page: prev.page + 1 }));
  }, [isInView, filters.page, totalPages, setFilters]);

  return (
    <main
      id="main"
      className="vstack px-auto mx-auto max-w-8xl w-full flex flex-col py-6 gap-5"
    >
      <SearchProfesional />
      <div className="grid lg:grid-cols-2 gap-4">
        <div className="flex flex-col gap-2 size-full h-[80vh] overflow-y-auto overflow-x-hidden pr-1">
          {(professionals.length || !loading) && (
            <ServicioMainContainer profesionales={professionals} />
          )}
          <div ref={ref} className="h-full min-h-1">
            {loading && <Loader />}
          </div>
        </div>

        <div className="min-h-[80vh] w-full rounded-2xl overflow-hidden border border-default-100 shadow-sm">
          <CustomMap markers={professionals} setMarkers={setProfessionals} />
        </div>
      </div>
    </main>
  );
};

export default ServicioMain;
