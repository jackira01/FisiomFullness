"use client";
import { useRouter } from "next/navigation";
import { userInitialValues, userSchema } from "@/utils/validations/userSchema";
import { axiosRegisterUserForm } from "@/services/users";
import { formikZodValidator } from "@/utils/validations";
import { Form, Formik } from "formik";
import { InputsFormRegister } from "./InputsForms";
import { listInputsUser } from "./listInputs";
import { removeObjFalsyValues } from "@/utils/helpers";
import toast from "react-hot-toast";

export const RegisterUser = ({
  conditionsAccepted,
  aceptoCondiciones,
  setAceptoCondiciones,
  recibirInformacion,
  setRecibirInformacion,
}) => {
  const router = useRouter();

  const handleSubmit = async (values, { resetForm }) => {
    if (!conditionsAccepted) {
      toast.error("Por favor acepte los términos y condiciones");
      return;
    }

    values = removeObjFalsyValues(values);

    try {
      await axiosRegisterUserForm(values);
      resetForm();
      setTimeout(() => { router.push("/login"); }, 1500);
    } catch (error) {
      console.error("Error en registro:", error);
    }
  };

  return (
    <Formik
      onSubmit={handleSubmit}
      initialValues={userInitialValues}
      validate={formikZodValidator(userSchema)}
    >
      <Form className="flex flex-col gap-2 w-full">
        <InputsFormRegister
          isProfessional={false}
          submitButtonMessage={"Registrarse"}
          listInputsValue={listInputsUser}
          aceptoCondiciones={aceptoCondiciones}
          setAceptoCondiciones={setAceptoCondiciones}
          recibirInformacion={recibirInformacion}
          setRecibirInformacion={setRecibirInformacion}
        />
      </Form>
    </Formik>
  );
};
