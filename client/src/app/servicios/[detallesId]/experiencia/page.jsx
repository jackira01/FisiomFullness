import ServicioExperienciaCard from '@/components/Servicios/ServicioExperienciaCard';
import { getProfessionalDetail } from '@/services/professionals';

export const dynamic = 'force-dynamic';

const ServicioExperiencia = async ({ params }) => {
  const profesionalId = params.detallesId;
  const { professional } = await getProfessionalDetail(profesionalId);

  return (
    <section className="w-full flex flex-col my-2 gap-4 grow lg:max-h-[800px] overflow-y-auto ">
      <ServicioExperienciaCard experience={professional?.experience ?? []} />
    </section>
  );
};

export default ServicioExperiencia;
