'use client';
import {
  Card,
  CardBody,
  CardFooter,
  Image,
  Chip,
  Button,
  Divider,
  Snippet,
} from '@nextui-org/react';
import { FaUserDoctor, FaWhatsapp } from 'react-icons/fa6';
import { CiMail } from 'react-icons/ci';
import { IoIosCall } from 'react-icons/io';
import dynamic from 'next/dynamic';
import { startWhatsAppChat } from '@/utils/helpers';

// ? Se esta trabajando con el numero de la empresa.
const REDIRECT_PHONE = 51901294627;

const StarRatings = dynamic(() => import('react-star-ratings'), {
  ssr: false,
});
const ProfileMap = dynamic(() => import('./ProfileMap'), {
  ssr: false,
});

const hashToIndex = (str = '', max = 100) => {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = (hash * 31 + str.charCodeAt(i)) >>> 0;
  }
  return hash % max;
};

const getAvatarUrl = (id) => {
  const index = hashToIndex(id);
  const gender = index % 2 === 0 ? 'men' : 'women';
  const num = Math.floor(index / 2);
  return `https://randomuser.me/api/portraits/${gender}/${num}.jpg`;
};

const getProfileImage = (image, id) => {
  if (image && image.startsWith('http')) return image;
  return getAvatarUrl(id);
};

const ServicioProfesionalCard = ({ professional }) => {
  const profileImage = getProfileImage(professional.image, professional._id);
  const hasRating = professional?.rating?.average > 0;

  return (
    <div className="!w-full grid gap-4 xl:items-stretch xl:grid-cols-[62%,auto] xl:gap-6">
      {/* Main card */}
      <Card shadow="sm" radius="lg" fullWidth className="overflow-hidden">
        {/* Gradient header with photo and name */}
        <div className="bg-gradient-to-br from-[#155e8a] via-[#1e7aad] to-[#2984AE] px-6 pt-6 pb-8 flex items-center gap-5">
          <div className="shrink-0">
            <Image
              alt={professional.name}
              src={profileImage}
              className="size-20 sm:size-24 object-cover object-top rounded-full ring-4 ring-white/25"
              removeWrapper
            />
          </div>
          <div className="flex flex-col gap-1">
            <h2 className="m-0 text-white uppercase font-bold tracking-wide text-lg sm:text-xl leading-tight">
              {`Dr/a. ${professional.name}`}
            </h2>
            {hasRating ? (
              <div className="flex items-center gap-2">
                <StarRatings
                  rating={professional.rating.average}
                  starRatedColor="#facc15"
                  starEmptyColor="rgba(255,255,255,0.35)"
                  numberOfStars={5}
                  starDimension="18px"
                  starSpacing="1px"
                  name="professional-rating"
                />
                <span className="text-white/80 text-sm font-sans">
                  ({professional.rating.count})
                </span>
              </div>
            ) : (
              <span className="text-white/60 text-sm italic">
                Sin valoraciones aún
              </span>
            )}
          </div>
        </div>

        <CardBody className="px-6 py-5 flex flex-col gap-4 -mt-3">
          {/* Specialties */}
          {professional?.specialties?.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {professional.specialties.map((specialty) => (
                <Chip
                  key={specialty._id}
                  variant="flat"
                  size="sm"
                  startContent={
                    <FaUserDoctor className="text-[#164a37e2] ml-1" />
                  }
                  className="bg-[#acf5da] px-3 gap-1"
                  classNames={{ content: 'text-[#164a37e2] tracking-wider' }}
                >
                  {specialty.name}
                </Chip>
              ))}
            </div>
          )}

          {/* Description */}
          <p
            className={`text-sm leading-relaxed ${!professional.description
                ? 'text-secondary-400 italic'
                : 'text-default-700'
              }`}
          >
            {professional.description ||
              'Profesional verificado de Fisiomfulness.'}
          </p>

          <Divider />

          {/* Contact info */}
          <div className="grid sm:grid-cols-2 gap-2">
            <Snippet
              symbol={<CiMail size={22} className="text-[#2984AE]" />}
              color="primary"
              variant="flat"
              radius="lg"
              fullWidth
              tooltipProps={{
                color: 'secondary',
                content: 'Copiar correo electrónico',
                delay: 200,
              }}
              className="bg-primary-50"
              classNames={{ pre: 'flex items-center gap-2' }}
            >
              <span className="text-default-700 text-sm font-sans truncate">
                {professional.email}
              </span>
            </Snippet>
            <Snippet
              symbol={<IoIosCall size={22} className="text-[#2984AE]" />}
              color="primary"
              variant="flat"
              radius="lg"
              fullWidth
              tooltipProps={{
                color: 'secondary',
                content: 'Copiar teléfono',
                delay: 200,
              }}
              className="bg-primary-50"
              classNames={{ pre: 'flex items-center gap-2' }}
            >
              <span className="text-default-700 text-sm font-sans">
                {professional.phone}
              </span>
            </Snippet>
          </div>
        </CardBody>

        <CardFooter className="px-6 pb-5 pt-0">
          <Button
            fullWidth
            radius="lg"
            className="bg-[#25D366] hover:bg-[#1da851] text-white font-semibold tracking-wide uppercase"
            startContent={<FaWhatsapp size={20} />}
            onPress={() =>
              startWhatsAppChat(
                REDIRECT_PHONE,
                `Hola, me gustaría obtener más información sobre el/la profesional "${professional.name}" y sus servicios disponibles. Quedo atento/a a su respuesta, saludos.`
              )
            }
          >
            Consultar por WhatsApp
          </Button>
        </CardFooter>
      </Card>

      {/* Map panel */}
      <div className="hidden sm:block rounded-xl overflow-hidden h-[280px] xl:h-auto min-h-[280px] shadow-sm">
        <ProfileMap center={professional.coordinates} zoom={13} />
      </div>
    </div>
  );
};

export default ServicioProfesionalCard;
