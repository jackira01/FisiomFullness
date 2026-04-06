"use client";
import Image from "next/image";

const paymentMethods = [
  {
    src: "https://http2.mlstatic.com/storage/logos-api-admin/a5f047d0-9be0-11ec-aad4-c3381f368aaf-m.svg",
    alt: "Visa",
  },
  {
    src: "https://http2.mlstatic.com/storage/logos-api-admin/ce454480-445f-11eb-bf78-3b1ee7bf744c-m.svg",
    alt: "Mastercard",
  },
  {
    src: "https://http2.mlstatic.com/storage/logos-api-admin/992bc350-f3be-11eb-826e-6db365b9e0dd-m.svg",
    alt: "PSE",
  },
  {
    src: "https://http2.mlstatic.com/storage/logos-api-admin/aa2b8f70-5c85-11ec-ae75-df2bef173be2-m.svg",
    alt: "Efecty",
  },
];

const MetodosDePago = () => {
  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
      <h3 className="text-sm font-bold text-gray-700 uppercase tracking-wide mb-4">
        Métodos de pago
      </h3>
      <div className="flex flex-wrap gap-3">
        {paymentMethods.map((method) => (
          <div
            key={method.alt}
            className="flex items-center justify-center w-12 h-9 bg-gray-50 border border-gray-200 rounded-lg p-1.5"
          >
            <Image
              width={36}
              height={24}
              src={method.src}
              alt={method.alt}
              className="object-contain w-full h-full"
            />
          </div>
        ))}
      </div>
      <p className="text-xs text-gray-400 mt-3">
        Pagos seguros y encriptados. Aceptamos las principales tarjetas y métodos locales.
      </p>
    </div>
  );
};

export default MetodosDePago;
