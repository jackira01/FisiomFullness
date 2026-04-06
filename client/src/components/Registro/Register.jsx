"use client";

import { CustomLogo } from "@/features/ui";
import { Button, Card, CardBody, Radio, RadioGroup } from "@nextui-org/react";
import Link from "next/link";
import { useState } from "react";
import { RegisterProfessional } from "./RegisterProfesional";
import { RegisterUser } from "./RegisterUsuario";

export const Register = () => {
  const [selected, setSelected] = useState("usuario");
  const [aceptoCondiciones, setAceptoCondiciones] = useState(false);
  const [recibirInformacion, setRecibirInformacion] = useState(false);

  const conditionsAccepted = aceptoCondiciones && recibirInformacion;

  return (
    <Card className="w-full max-w-[860px] overflow-hidden p-6 min-[480px]:p-10 rounded-sm">
      <CardBody className="flex flex-col w-full gap-6 overflow-hidden">
        {/* Cabecera: logo + selector de tipo */}
        <div className="flex flex-col items-center gap-4">
          <Link href="/">
            <CustomLogo width={200} color="dark" />
          </Link>
          <RadioGroup
            className="font-semibold"
            label="Registrarse como:"
            orientation="horizontal"
            value={selected}
            onValueChange={setSelected}
          >
            <Radio className="text-base font-normal" value="usuario">
              Usuario
            </Radio>
            <Radio className="text-base font-normal" value="profesional">
              Profesional
            </Radio>
          </RadioGroup>
        </div>

        {/* Formulario */}
        {selected === "usuario" ? (
          <RegisterUser
            conditionsAccepted={conditionsAccepted}
            aceptoCondiciones={aceptoCondiciones}
            setAceptoCondiciones={setAceptoCondiciones}
            recibirInformacion={recibirInformacion}
            setRecibirInformacion={setRecibirInformacion}
          />
        ) : (
          <RegisterProfessional
            conditionsAccepted={conditionsAccepted}
            aceptoCondiciones={aceptoCondiciones}
            setAceptoCondiciones={setAceptoCondiciones}
            recibirInformacion={recibirInformacion}
            setRecibirInformacion={setRecibirInformacion}
          />
        )}
      </CardBody>
    </Card>
  );
};
