import { FaTools, FaBoxOpen } from 'react-icons/fa';

const CatalogMaintenanceMessage = () => {
  return (
    <div className="flex items-center justify-center min-h-[60vh] px-4">
      <div className="max-w-2xl w-full bg-gradient-to-br from-blue-50 to-indigo-100 rounded-2xl shadow-xl p-8 md:p-12 text-center">
        <div className="flex justify-center mb-6">
          <div className="relative">
            <div className="absolute inset-0 bg-blue-400 rounded-full blur-xl opacity-50 animate-pulse"></div>
            <div className="relative bg-white rounded-full p-6 shadow-lg">
              <FaTools className="text-5xl text-blue-600" />
            </div>
          </div>
        </div>
        
        <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">
          Actualización de Inventario
        </h2>
        
        <div className="flex justify-center mb-6">
          <FaBoxOpen className="text-6xl text-blue-500 opacity-70" />
        </div>
        
        <p className="text-lg md:text-xl text-gray-700 mb-4 leading-relaxed">
          Estamos actualizando nuestro catálogo de productos para ofrecerte 
          la mejor experiencia de compra.
        </p>
        
        <p className="text-base md:text-lg text-gray-600 mb-8">
          Pronto habilitaremos nuevamente nuestra lista de productos con 
          información actualizada y nuevas opciones para ti.
        </p>
        
        <div className="bg-white rounded-lg p-4 shadow-inner">
          <p className="text-sm text-gray-500 font-medium">
            ⏱️ Tiempo estimado: Próximamente
          </p>
        </div>
        
        <div className="mt-8 flex justify-center gap-2">
          <div className="w-3 h-3 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '0s' }}></div>
          <div className="w-3 h-3 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
          <div className="w-3 h-3 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '0.4s' }}></div>
        </div>
      </div>
    </div>
  );
};

export default CatalogMaintenanceMessage;
