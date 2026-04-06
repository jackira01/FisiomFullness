"use client";
import { useRouter } from "next/navigation";
import { Form, Formik } from "formik";
import { InputsFormRegister } from "./InputsForms";
import { axiosRegisterProfessionalForm } from "@/services/users";
import { formikZodValidator } from "@/utils/validations";
import {
  professionalInitialValues,
  professionalSchema,
} from "@/utils/validations/professionalSchema";
import { listInputsUser } from "./listInputs";
import toast from "react-hot-toast";

export function RegisterProfessional({
  conditionsAccepted,
  aceptoCondiciones,
  setAceptoCondiciones,
  recibirInformacion,
  setRecibirInformacion,
}) {
  const router = useRouter();

  const handleSubmitRegister = async (values, { resetForm }) => {
    if (!conditionsAccepted) {
      toast.error("Por favor acepte los términos y condiciones");
      return;
    }

    try {
      // Preparar payload JSON (no incluir curriculum ya que no se procesa en el backend)
      const payload = {
        ...values,
      };

      // Remover el curriculum del payload (es un File y no se procesa)
      delete payload.curriculum;

      // Esperar a que el registro se complete
      await axiosRegisterProfessionalForm(payload);

      // Si llegamos aquí, el registro fue exitoso
      resetForm();

      // Esperar un poco para que el toast de éxito se muestre antes de redirigir
      setTimeout(() => {
        router.push("/login");
      }, 1500);
    } catch (error) {
      console.error("Error en registro profesional:", error);
    }
  };

  return (
    <Formik
      onSubmit={handleSubmitRegister}
      initialValues={professionalInitialValues}
      validate={formikZodValidator(professionalSchema)}
    >
      <Form className="flex flex-col gap-2 w-full">
        <InputsFormRegister
          isProfessional={true}
          submitButtonMessage={"Crear perfil"}
          listInputsValue={listInputsUser}
          aceptoCondiciones={aceptoCondiciones}
          setAceptoCondiciones={setAceptoCondiciones}
          recibirInformacion={recibirInformacion}
          setRecibirInformacion={setRecibirInformacion}
        />
      </Form>
    </Formik>
  );
}
