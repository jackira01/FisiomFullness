'use client';
import { usePathname } from 'next/navigation';
import { Button } from '@nextui-org/react';
import NextLink from 'next/link';
import { FaUser, FaTag, FaBriefcase, FaCalendarCheck } from 'react-icons/fa';

const ServicioAsideBar = () => {
  const path = usePathname();
  const id = path.split('/')[2];

  const buttons = [
    {
      name: 'Perfil',
      href: `/servicios/${id}/perfil`,
      icon: <FaUser size={14} />,
    },
    {
      name: 'Precios',
      href: `/servicios/${id}/precios`,
      icon: <FaTag size={14} />,
    },
    {
      name: 'Experiencia',
      href: `/servicios/${id}/experiencia`,
      icon: <FaBriefcase size={14} />,
    },
    {
      name: 'Turno',
      href: `/servicios/${id}/turno`,
      icon: <FaCalendarCheck size={14} />,
    },
  ];

  return (
    <aside className="mt-2 grid grid-cols-2 grid-rows-2 rounded-xl overflow-hidden border border-default-200 shadow-sm lg:flex lg:flex-col lg:gap-2 lg:rounded-none lg:border-0 lg:shadow-none lg:overflow-visible">
      {buttons.map((button) => {
        const isActive = path === button.href;
        return (
          <Button
            key={button.href}
            as={NextLink}
            href={button.href}
            radius="none"
            className={[
              'font-semibold capitalize py-5 gap-2 justify-center text-sm',
              'lg:rounded-xl lg:border lg:justify-start lg:px-4',
              isActive
                ? 'bg-[#2984AE] text-white border-[#2984AE]'
                : 'bg-white text-default-600 border-default-200 hover:bg-primary-50 hover:text-[#2984AE]',
            ].join(' ')}
            startContent={button.icon}
          >
            {button.name}
          </Button>
        );
      })}
    </aside>
  );
};

export default ServicioAsideBar;
