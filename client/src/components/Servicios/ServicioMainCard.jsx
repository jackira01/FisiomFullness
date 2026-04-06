"use client";
import { FaUserDoctor } from "react-icons/fa6";
import { CiLocationOn } from "react-icons/ci";
import { RiMoneyDollarCircleLine } from "react-icons/ri";
import { MdVerified } from "react-icons/md";
import NextLink from "next/link";
import { Card, CardBody, CardFooter, Chip, Avatar, Link, Button, Divider } from "@nextui-org/react";

// Fix de StarRatings
import dynamic from "next/dynamic";
const StarRatings = dynamic(() => import("react-star-ratings"), {
  ssr: false,
});

// Genera un número determinista 0-99 a partir de un string (ID de MongoDB)
const hashToIndex = (str = '', max = 100) => {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = (hash * 31 + str.charCodeAt(i)) >>> 0;
  }
  return hash % max;
};

// Foto de persona real única y consistente por profesional (randomuser.me)
const getAvatarUrl = (id) => {
  const index = hashToIndex(id);
  // Alterna entre hombres y mujeres según paridad del índice
  const gender = index % 2 === 0 ? 'men' : 'women';
  const num = Math.floor(index / 2); // 0-49 dentro de cada género
  return `https://randomuser.me/api/portraits/${gender}/${num}.jpg`;
};

const FALLBACK_IMAGE = '/doctor-ejemplo.png';

const ServicioMainCard = ({ profesional }) => {
  const {
    _id,
    name = '',
    image = '',
    specialties = [],
    rating = { average: 0 },
    address = {},
    consultationPrice = '-',
  } = profesional || {};

  // Si la imagen es la por defecto, una ruta local o no existe, generamos un avatar único por ID
  const isDefaultOrMissing =
    !image ||
    !image.trim() ||
    image === FALLBACK_IMAGE ||
    image === '/imgPerfil.png' ||
    !image.startsWith('http');
  const avatarSrc = isDefaultOrMissing ? getAvatarUrl(_id) : image;

  const cityInfo = address?.city
    ? `${address.city}${address.state ? ', ' + address.state : ''}${address.country ? ', ' + address.country : ''}`
    : 'A consultar';

  const avgRating = rating?.average || 0;

  return (
    <Card
      shadow="sm"
      className="w-full border border-default-100 bg-white hover:shadow-md transition-shadow duration-200 overflow-hidden rounded-xl"
    >
      <CardBody className="p-0">
        {/* Franja superior decorativa */}
        <div className="h-1.5 w-full bg-gradient-to-r from-[#2984AE] via-[#56c4ed] to-[#2984AE]" />

        <div className="flex flex-col sm:flex-row gap-4 p-4 sm:p-5">
          {/* Avatar + rating */}
          <div className="flex sm:flex-col items-center sm:items-center gap-3 sm:gap-2 shrink-0">
            <Avatar
              src={avatarSrc}
              fallback={<FaUserDoctor className="text-[#2984AE] text-3xl" />}
              className="w-20 h-20 sm:w-24 sm:h-24 ring-2 ring-[#2984AE]/30 ring-offset-2"
              imgProps={{ loading: 'lazy' }}
            />
            {avgRating > 0 && (
              <div className="flex flex-col items-center gap-0.5">
                <StarRatings
                  rating={avgRating}
                  starRatedColor="#ffb829"
                  numberOfStars={5}
                  starDimension="13px"
                  starSpacing="1px"
                  name={`rating-${_id}`}
                />
                <span className="text-xs text-default-500">{avgRating.toFixed(1)}</span>
              </div>
            )}
          </div>

          {/* Info principal */}
          <div className="flex flex-col gap-2 flex-1 min-w-0">
            <div className="flex items-start justify-between gap-2">
              <h2 className="font-bold text-[#003953] text-sm sm:text-base uppercase leading-tight line-clamp-2 m-0">
                Dr./Dra. {name}
              </h2>
              <MdVerified className="text-[#2984AE] shrink-0 mt-0.5" size={18} title="Profesional verificado" />
            </div>

            {Array.isArray(specialties) && specialties.length > 0 && (
              <div className="flex flex-wrap gap-1">
                {specialties.slice(0, 3).map((specialty) => (
                  <Chip
                    key={specialty._id}
                    size="sm"
                    radius="full"
                    startContent={<FaUserDoctor className="text-[#164a37]" size={10} />}
                    className="bg-[#d4f5e9] text-[#164a37] font-medium text-xs px-2"
                  >
                    {specialty.name}
                  </Chip>
                ))}
                {specialties.length > 3 && (
                  <Chip size="sm" radius="full" className="bg-default-100 text-default-500 text-xs">
                    +{specialties.length - 3}
                  </Chip>
                )}
              </div>
            )}

            <Divider className="my-1" />

            <div className="flex flex-col gap-1.5">
              <div className="flex items-center gap-2">
                <CiLocationOn className="text-[#2984AE] shrink-0" size={18} />
                <p className="text-sm text-default-600 line-clamp-1">{cityInfo}</p>
              </div>
              <div className="flex items-center gap-2">
                <RiMoneyDollarCircleLine className="text-[#2984AE] shrink-0" size={18} />
                <p className="text-sm text-default-600">
                  Consulta: <span className="font-semibold text-default-800">$ {consultationPrice}</span>
                </p>
              </div>
            </div>
          </div>
        </div>
      </CardBody>

      <CardFooter className="pt-0 px-4 pb-4 flex gap-2 justify-end">
        <Button
          as={NextLink}
          href={`./servicios/${_id}/perfil`}
          variant="flat"
          size="sm"
          radius="full"
          className="text-[#2984AE] bg-[#e8f5fb] hover:bg-[#d0ecf8] font-semibold px-5"
        >
          Ver perfil
        </Button>
        <Button
          as={NextLink}
          href={`./servicios/${_id}/turno`}
          size="sm"
          radius="full"
          className="bg-[#2984AE] text-white font-semibold px-5 hover:bg-[#1f6b8e]"
        >
          Agendar turno
        </Button>
      </CardFooter>
    </Card>
  );
};

export default ServicioMainCard;
