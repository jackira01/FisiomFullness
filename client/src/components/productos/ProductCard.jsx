'use client';
import { useRouter } from 'next/navigation';

export const ProductCard = ({ prod }) => {
  const router = useRouter();

  const handleOnClick = (id) => {
    router.push(`/productos/${id}`);
  };

  const formattedPrice = prod.price?.toLocaleString('es-CO');

  return (
    <article
      onClick={() => handleOnClick(prod._id)}
      className="group flex flex-col bg-white rounded-2xl overflow-hidden shadow-md hover:shadow-xl transition-shadow duration-300 cursor-pointer border border-gray-100"
    >
      {/* Imagen */}
      <div className="relative w-full aspect-[4/3] overflow-hidden bg-gray-50">
        <img
          src={prod.image}
          alt={prod.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />
        {prod.stock <= 5 && prod.stock > 0 && (
          <span className="absolute top-2 right-2 bg-amber-400 text-white text-[11px] font-bold px-2 py-0.5 rounded-full">
            ¡Últimas unidades!
          </span>
        )}
        {prod.stock === 0 && (
          <span className="absolute top-2 right-2 bg-red-500 text-white text-[11px] font-bold px-2 py-0.5 rounded-full">
            Agotado
          </span>
        )}
      </div>

      {/* Contenido */}
      <div className="flex flex-col flex-1 p-4 gap-2">
        {prod.category?.name && (
          <span className="text-[11px] font-semibold uppercase tracking-wider text-[#3DAADD]">
            {prod.category.name}
          </span>
        )}
        <h3 className="font-bold text-gray-900 text-sm leading-snug line-clamp-2 min-h-[2.5rem]">
          {prod.name}
        </h3>
        <p className="text-gray-500 text-xs line-clamp-2 flex-1">
          {prod.description}
        </p>

        <div className="flex items-center justify-between mt-3 pt-3 border-t border-gray-100">
          <span className="text-lg font-extrabold text-gray-900">
            ${formattedPrice}
            <span className="text-xs font-normal text-gray-400 ml-1">COP</span>
          </span>
          <button
            onClick={(e) => { e.stopPropagation(); handleOnClick(prod._id); }}
            className="bg-[#3DAADD] hover:bg-[#2990c4] active:scale-95 text-white text-xs font-semibold px-4 py-2 rounded-lg transition-all duration-200"
          >
            Ver detalle
          </button>
        </div>
      </div>
    </article>
  );
};

export default ProductCard;
