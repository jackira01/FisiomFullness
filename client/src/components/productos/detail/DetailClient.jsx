'use client';

import GalleryDetail from './GalleryDetail';
import { useState } from 'react';
import { useDisclosure } from '@nextui-org/react';
import ModalDetail from './Modal';

const DetailClient = ({ prod }) => {
  const [selected, setSelected] = useState('0');
  const [cantidad, setCantidad] = useState(1);
  const { isOpen, onOpen, onOpenChange } = useDisclosure();

  const formattedPrice = prod.price?.toLocaleString('es-CO');
  const currentImage = prod?.gallery?.length
    ? prod.gallery[selected]
    : prod?.image || '';

  return (
    <section className="flex-1 min-w-0 px-4 sm:px-6 lg:px-8 py-8">
      <div className="max-w-3xl mx-auto flex flex-col gap-6">

        {/* Nombre y precio */}
        <div className="flex flex-col gap-2">
          {prod?.category?.name && (
            <span className="text-xs font-semibold uppercase tracking-widest text-[#3DAADD]">
              {prod.category.name}
            </span>
          )}
          <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 leading-tight">
            {prod?.name}
          </h1>
          <div className="flex items-baseline gap-2 mt-1">
            <span className="text-3xl font-black text-gray-900">
              ${formattedPrice}
            </span>
            <span className="text-sm text-gray-400 font-medium">COP</span>
          </div>
          {prod.stock > 0 ? (
            <span className="text-xs text-emerald-600 font-semibold">
              ✓ {prod.stock} unidades disponibles
            </span>
          ) : (
            <span className="text-xs text-red-500 font-semibold">Agotado</span>
          )}
        </div>

        {/* Imagen principal + galería */}
        <div className="flex gap-3">
          <div className="flex-1 rounded-2xl overflow-hidden bg-gray-50 border border-gray-100">
            <img
              src={currentImage}
              alt={prod?.name}
              className="w-full h-[280px] sm:h-[380px] lg:h-[440px] object-cover"
            />
          </div>
          <GalleryDetail
            setSelected={setSelected}
            selected={selected}
            images={prod?.gallery?.length ? prod.gallery : [prod?.image]}
          />
        </div>

        {/* Descripción */}
        <div className="bg-gray-50 rounded-xl p-5 border border-gray-100">
          <h2 className="text-sm font-bold text-gray-700 uppercase tracking-wide mb-2">
            Descripción
          </h2>
          <p className="text-gray-600 text-sm leading-relaxed">
            {prod.description}
          </p>
        </div>

        {/* Cantidad + CTA */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 pt-2">
          {/* Counter */}
          <div className="flex items-center gap-0 rounded-xl overflow-hidden border border-gray-200 shadow-sm">
            <button
              onClick={() => cantidad > 1 && setCantidad((e) => e - 1)}
              disabled={cantidad <= 1}
              className="w-10 h-11 flex items-center justify-center text-lg font-bold text-gray-600 hover:bg-gray-100 disabled:opacity-30 transition-colors"
            >
              −
            </button>
            <span className="w-12 h-11 flex items-center justify-center text-base font-semibold text-gray-900 border-x border-gray-200 select-none">
              {cantidad}
            </span>
            <button
              onClick={() => cantidad < prod.stock && setCantidad((e) => e + 1)}
              disabled={cantidad >= prod.stock}
              className="w-10 h-11 flex items-center justify-center text-lg font-bold text-gray-600 hover:bg-gray-100 disabled:opacity-30 transition-colors"
            >
              +
            </button>
          </div>

          {/* Botón principal */}
          <button
            onClick={onOpen}
            disabled={prod.stock === 0}
            className="flex-1 sm:flex-none h-11 px-8 bg-[#3DAADD] hover:bg-[#2990c4] active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold rounded-xl transition-all duration-200 shadow-md hover:shadow-[#3DAADD]/40 hover:shadow-lg"
          >
            Agregar al carrito
          </button>
        </div>

      </div>
      <ModalDetail isOpen={isOpen} onOpenChange={onOpenChange} />
    </section>
  );
};

export default DetailClient;
