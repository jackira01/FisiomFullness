'use client';
import { Card, CardBody, Chip } from '@nextui-org/react';
import { format, parse } from 'date-fns';
import { es } from 'date-fns/locale';

// ? Example -> Mes:2 Año:2024 => Feb. 2024
const formatExperienceDates = (experience) => {
  const startDate = parse(
    `${experience.startDateYear}-${experience.startDateMonth}`,
    'yyyy-M',
    new Date()
  );
  const startFormatted = format(startDate, 'MMM. yyyy', { locale: es });

  if (experience.current) {
    return `${startFormatted} - Presente`;
  }

  const endDate = parse(
    `${experience.endDateYear}-${experience.endDateMonth}`,
    'yyyy-M',
    new Date()
  );
  const endFormatted = format(endDate, 'MMM. yyyy', { locale: es });

  return `${startFormatted} - ${endFormatted}`;
};

const ServicioExperienciaCard = ({ experience = [] }) => {
  return (
    <div className="flex flex-col">
      {experience.length > 0 ? (
        <div className="relative pl-6">
          {/* Vertical timeline line */}
          <div className="absolute left-[9px] top-3 bottom-3 w-0.5 bg-default-200" />

          {experience.map((exp, index) => (
            <div key={exp._id} className="relative mb-5 last:mb-0">
              {/* Timeline dot */}
              <div className="absolute -left-6 top-3 w-3 h-3 rounded-full bg-[#2984AE] ring-2 ring-white shadow-sm" />

              <Card
                isHoverable
                radius="lg"
                shadow="sm"
                className="border border-transparent hover:border-[#2984AE]/30 transition-colors"
              >
                <CardBody className="p-4 lg:p-5 gap-2">
                  <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-1">
                    <h3 className="m-0 text-base font-semibold tracking-wide text-default-800">
                      {exp.title}
                    </h3>
                    <span className="text-nowrap text-xs text-default-500 italic bg-default-100 rounded-full px-3 py-1 self-start">
                      {formatExperienceDates(exp)}
                    </span>
                  </div>
                  <Chip
                    size="sm"
                    variant="flat"
                    className="bg-[#64efbce2] px-3 w-fit"
                    classNames={{
                      content:
                        'text-[#164a37e2] uppercase font-semibold tracking-wider',
                    }}
                  >
                    {exp.company}
                  </Chip>
                  {exp.description && (
                    <p className="text-sm text-default-600 leading-relaxed mt-1">
                      {exp.description}
                    </p>
                  )}
                </CardBody>
              </Card>
            </div>
          ))}
        </div>
      ) : (
        <Card radius="lg" shadow="sm" className="h-full">
          <CardBody className="py-10">
            <p className="m-auto text-center text-lg font-semibold tracking-wide text-secondary-400">
              Este profesional no ha cargado su experiencia
            </p>
          </CardBody>
        </Card>
      )}
    </div>
  );
};

export default ServicioExperienciaCard;
