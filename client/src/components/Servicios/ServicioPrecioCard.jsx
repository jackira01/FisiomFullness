'use client';
import { Button, Card, CardBody, Chip, Divider } from '@nextui-org/react';
import { capitalizeFirstLetter, startWhatsAppChat } from '@/utils/helpers';
import { FaCalendarCheck } from 'react-icons/fa6';

// ? Se esta trabajando con el numero de la empresa.
const REDIRECT_PHONE = 51901294627;

const ServicioPrecioCard = ({ professional, services }) => {
  return (
    <div className="flex flex-col gap-3">
      {services.length > 0 ? (
        services.map((service) => (
          <Card
            key={service._id}
            isHoverable
            radius="lg"
            shadow="sm"
            className="border border-transparent hover:border-[#2984AE]/30 transition-colors overflow-visible"
          >
            <CardBody className="p-4 lg:p-5">
              <div className="flex flex-col gap-3">
                {/* Title */}
                <h3 className="m-0 text-sm rounded-full bg-[#64efbce2] px-5 py-1.5 w-fit text-[#164a37e2] uppercase font-semibold tracking-wider">
                  {service.title}
                </h3>

                <div className="grid sm:grid-cols-[1fr,auto] gap-4 items-start">
                  {/* Description */}
                  <p className="text-sm text-default-700 leading-relaxed text-justify">
                    {service.description}
                  </p>

                  {/* Price + button column */}
                  <div className="flex flex-col items-center gap-3 sm:min-w-[140px]">
                    <div className="bg-[#EBF7FB] rounded-xl px-5 py-3 text-center w-full">
                      <span className="block text-xs text-default-500 uppercase tracking-wide mb-0.5">
                        Precio
                      </span>
                      <span className="text-2xl font-bold text-[#2984AE] font-sans">
                        {`S/. ${service.price}`}
                      </span>
                      {service.duration && (
                        <span className="block text-xs text-default-400 mt-0.5">
                          {service.duration} min
                        </span>
                      )}
                    </div>
                    <Button
                      color="primary"
                      radius="lg"
                      fullWidth
                      className="bg-[#2984AE] uppercase tracking-wide font-semibold text-xs"
                      startContent={<FaCalendarCheck size={15} />}
                      onPress={() =>
                        startWhatsAppChat(
                          REDIRECT_PHONE,
                          `Hola, me encuentro interesado/a en el servicio "${service.title
                          }" proporcionado por el/la profesional "${capitalizeFirstLetter(
                            professional?.name || ''
                          )}". Por lo tanto, me gustaría conocer los detalles necesarios para programar una cita. Quedo atento/a a su respuesta, saludos.`
                        )
                      }
                    >
                      Reservar cita
                    </Button>
                  </div>
                </div>
              </div>
            </CardBody>
          </Card>
        ))
      ) : (
        <Card radius="lg" shadow="sm" className="h-full">
          <CardBody className="vstack items-center justify-center gap-3 py-10">
            <p className="text-lg font-semibold text-secondary-500 text-center">
              Si estás interesado/a en el perfil del profesional haz click
              debajo 😉
            </p>
            <Button
              color="primary"
              radius="lg"
              className="bg-[#2984AE] uppercase tracking-wide max-w-[300px] font-semibold"
              onPress={() =>
                startWhatsAppChat(
                  REDIRECT_PHONE,
                  `Hola, desearía obtener mas información acerca de los servicios que ofrece el/la profesional "${capitalizeFirstLetter(
                    professional.name
                  )}". Quedo atento/a a su respuesta, saludos.`
                )
              }
            >
              Obtener más detalles
            </Button>
          </CardBody>
        </Card>
      )}
    </div>
  );
};

export default ServicioPrecioCard;
