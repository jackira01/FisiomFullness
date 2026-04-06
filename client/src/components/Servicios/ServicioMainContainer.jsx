import ServicioMainCard from './ServicioMainCard';

const ServicioMainContainer = ({ profesionales }) => {
  return (
    <div className="w-full flex flex-col gap-3 px-1 sm:px-2">
      {profesionales.length ? (
        profesionales?.map((profesional) => (
          <ServicioMainCard key={profesional._id} profesional={profesional} />
        ))
      ) : (
        <div className="flex flex-col items-center justify-center py-16 text-default-400 gap-2">
          <p className="font-semibold text-base">Sin resultados</p>
          <p className="text-sm">No se encontraron profesionales con los filtros seleccionados.</p>
        </div>
      )}
    </div>
  );
};

export default ServicioMainContainer;
