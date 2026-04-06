import { ProductCard } from './ProductCard';

const ProductCardContainer = ({ productos }) => {
  return (
    <>
      {productos.length ? (
        <div className="w-full grid gap-6"
          style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))' }}
        >
          {productos?.map((prod) => (
            <ProductCard key={prod._id} prod={prod} />
          ))}
        </div>
      ) : (
        <div className="grow flex flex-col items-center justify-center py-20 gap-3 text-gray-400">
          <svg xmlns="http://www.w3.org/2000/svg" className="w-14 h-14 opacity-40" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 21l-4.35-4.35M17 11A6 6 0 1 1 5 11a6 6 0 0 1 12 0z" />
          </svg>
          <p className="text-lg font-medium">No se encontraron productos</p>
          <p className="text-sm">Intenta con otra categoría o término de búsqueda.</p>
        </div>
      )}
    </>
  );
};

export default ProductCardContainer;
