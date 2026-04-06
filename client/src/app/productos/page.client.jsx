'use client';

import { useState, useEffect } from 'react';
import { SearchProd } from '@/components/productos/SearchProd';
import ProductCardContainer from '@/components/productos/ProductCardContainer';
import Paginate from '@/components/Paginate/Paginate';
import CatalogMaintenanceMessage from '@/components/productos/CatalogMaintenanceMessage';
import { apiEndpoints } from '@/api_endpoints';
import axios from 'axios';

const ProductosPageClient = () => {
  const [productos, setProductos] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [filter, setFilter] = useState({
    categoryId: '',
    name: '',
  });

  // Leer variable de entorno para controlar visibilidad del catálogo
  const catalogEnabled = process.env.NEXT_PUBLIC_CATALOG_ENABLED === 'true';

  useEffect(() => {
    // Solo hacer la petición si el catálogo está habilitado
    if (!catalogEnabled) return;

    const abortController = new AbortController();
    axios
      .get(apiEndpoints.products, {
        signal: abortController.signal,
        params: {
          categoryId: filter.categoryId,
          search: filter.name,
          page: page,
        },
      })
      .then(({ data }) => {
        setProductos(data.products);
        setTotalPages(data.totalPages);
      })
      .catch((err) => {
        if (err.name === 'CanceledError') return;
        throw err;
      });
    return () => abortController.abort();
  }, [filter, page, catalogEnabled]);

  // Si el catálogo está deshabilitado, mostrar mensaje de mantenimiento
  if (!catalogEnabled) {
    return (
      <main className="vstack px-auto mx-auto max-w-8xl w-full items-center gap-6 my-5">
        <CatalogMaintenanceMessage />
      </main>
    );
  }

  // Si el catálogo está habilitado, mostrar la lista de productos
  return (
    <main className="vstack px-auto mx-auto max-w-8xl w-full gap-8 py-8">
      <SearchProd filter={filter} setFilter={setFilter} setPage={setPage} />
      <ProductCardContainer productos={productos} />
      <Paginate page={page} total={totalPages} setPage={setPage} />
    </main>
  );
};

export default ProductosPageClient;
