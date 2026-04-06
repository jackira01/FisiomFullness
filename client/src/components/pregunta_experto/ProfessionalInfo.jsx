import { Image } from '@nextui-org/react';
import { CustomButton } from '@/features/ui';
import Link from 'next/link';

const ProfessionalInfo = ({ professional }) => {
  const fullName = `${professional.firstname ?? ''} ${professional.lastname ?? ''}`.trim();
  const displayName = fullName || professional.name || 'Profesional';

  return (
    <div className="shrink-0 flex sm:flex-col items-center gap-3 sm:gap-2 bg-primary-50 border border-primary-100 rounded-xl px-3 py-3 sm:w-[120px]">
      <Image
        src={professional.image}
        alt={`Dr. ${displayName} foto`}
        className="rounded-full size-14 object-cover shrink-0"
        fallbackSrc="/imgPerfil.png"
      />
      <div className="flex flex-col gap-1.5 min-w-0 sm:items-center sm:text-center w-full">
        <p className="text-xs font-bold text-secondary-800 capitalize truncate w-full">
          {'Dr. ' + displayName}
        </p>
        <CustomButton
          as={Link}
          target="_blank"
          href={`/servicios/${professional._id}/perfil`}
          size="sm"
          className="h-7 min-w-0 w-full text-xs rounded-md font-medium px-2 bg-primary-500 text-white"
        >
          Ver perfil
        </CustomButton>
        <CustomButton
          as={Link}
          target="_blank"
          href={`/servicios/${professional._id}/turno`}
          size="sm"
          className="h-7 min-w-0 w-full text-xs rounded-md font-medium px-2 bg-white border border-primary-300 text-primary-700"
        >
          Agendar cita
        </CustomButton>
      </div>
    </div>
  );
};

export default ProfessionalInfo;
