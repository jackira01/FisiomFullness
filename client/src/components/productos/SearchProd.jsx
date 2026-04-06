'use client';
import axios from 'axios';
import { useEffect, useState } from 'react';
import { apiEndpoints } from '@/api_endpoints';

export const SearchProd = ({ filter, setFilter, setPage }) => {
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    const abortController = new AbortController();

    axios
      .get(apiEndpoints.categories, { signal: abortController.signal })
      .then(({ data }) => {
        setCategories(
          data.categories.toSorted((a, b) => a.name.localeCompare(b.name))
        );
      })
      .catch((err) => {
        if (err.name === 'CanceledError') return;
        throw err;
      });

    return () => abortController.abort();
  }, []);

  const handleOnChange = (e) => {
    setPage(1);
    setFilter({ ...filter, [e.target.id]: e.target.value });
  };

  return (
    <div className="w-full">
      {/* Header de sección */}
      <div className="mb-6">
        <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900">Tienda</h1>
        <p className="text-gray-500 text-sm mt-1">
          Encuentra implementos y suplementos para tu recuperación y bienestar.
        </p>
      </div>

      {/* Barra de filtros */}
      <div className="flex flex-col sm:flex-row gap-3">
        {/* Buscador */}
        <div className="relative flex-1 max-w-sm">
          <svg
            className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-4.35-4.35M17 11A6 6 0 1 1 5 11a6 6 0 0 1 12 0z" />
          </svg>
          <input
            id="name"
            type="search"
            value={filter.name}
            onChange={handleOnChange}
            placeholder="Buscar artículo..."
            className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-gray-200 bg-white shadow-sm text-sm outline-none focus:border-[#3DAADD] focus:ring-2 focus:ring-[#3DAADD]/20 transition-all"
          />
        </div>

        {/* Select de categoría */}
        <select
          id="categoryId"
          value={filter.categoryId}
          onChange={handleOnChange}
          className="py-2.5 px-4 rounded-xl border border-gray-200 bg-white shadow-sm text-sm outline-none focus:border-[#3DAADD] focus:ring-2 focus:ring-[#3DAADD]/20 cursor-pointer transition-all text-gray-700"
        >
          <option value="">Todas las categorías</option>
          {categories?.map((category) => (
            <option key={category._id} value={category._id}>
              {category.name}
            </option>
          ))}
        </select>

        {/* Indicador de filtro activo */}
        {(filter.name || filter.categoryId) && (
          <button
            onClick={() => { setPage(1); setFilter({ categoryId: '', name: '' }); }}
            className="flex items-center gap-1.5 py-2.5 px-4 rounded-xl border border-red-200 bg-red-50 text-red-500 text-sm font-medium hover:bg-red-100 transition-colors"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
            Limpiar filtros
          </button>
        )}
      </div>
    </div>
  );
};

