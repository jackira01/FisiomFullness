"use client";
import { useRouter } from "next/navigation";

const ProdRelacionados = ({ prods }) => {
  const router = useRouter();

  if (!prods?.length) return null;

  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
      <h3 className="text-sm font-bold text-gray-700 uppercase tracking-wide mb-4">
        Productos relacionados
      </h3>
      <div className="flex flex-col gap-3">
        {prods.slice(0, 5).map((prod) => (
          <div
            key={prod._id}
            onClick={() => router.push(`/productos/${prod._id}`)}
            className="flex gap-3 items-center rounded-xl border border-gray-100 hover:border-[#3DAADD] hover:shadow-sm cursor-pointer transition-all duration-200 overflow-hidden"
          >
            <div
              className="w-16 h-16 shrink-0 bg-cover bg-center"
              style={{ backgroundImage: `url(${prod.image})` }}
            />
            <div className="flex flex-col justify-center py-2 pr-3 gap-0.5 min-w-0">
              <span className="text-gray-800 font-semibold text-xs leading-snug line-clamp-2">
                {prod.name}
              </span>
              <span className="text-[#3DAADD] font-bold text-sm">
                ${prod.price?.toLocaleString('es-CO')}
                <span className="text-gray-400 font-normal text-[11px] ml-1">COP</span>
              </span>
            </div>
          </div>
        ))}
      </div>
      <button
        onClick={() => router.push("/productos")}
        className="mt-4 w-full text-xs font-semibold text-[#3DAADD] hover:text-[#2990c4] border border-[#3DAADD] hover:bg-[#3DAADD]/5 rounded-lg py-2 transition-all duration-200"
      >
        Ver todos los productos
      </button>
    </div>
  );
};

export default ProdRelacionados;
