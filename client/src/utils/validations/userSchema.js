import { z } from "zod";
import { isDateOnRange } from "../helpers";
import {
  cityRegex,
  nameRegex,
  numericRegex,
  phoneRegExp,
  streetNameRegex,
} from "../regExp";
import { zodStrRequired } from "./index";

const userInitialValues = {
  name: "",
  phone: "",
  email: "",
  birthDate: "",
  password: "",
  confirmPass: "",
  gender: "",
  streetName: "",
  streetNumber: "",
  floorAppartment: "", // ? Opcional
  additionalInfo: "", // ? Opcional - Datos informativos (no se pasa a API geocodificación)
  city: "",
  state: "", // ? Opcional
  country: "",
};

const genderList = ["Femenino", "Masculino", "Prefiero no responder"];
const acceptedYears = { min: 18, max: 100 };

const MAX_PICTURE_SIZE = 1024 * 1024 * 3; // ? 3MB

const userSchema = z
  .object({
    name: zodStrRequired()
      .regex(nameRegex, "Debe contener solo letras")
      .min(3, "Debe tener al menos 3 caracteres")
      .max(30, "No mas de 30 caracteres"),
    phone: z
      .string()
      .trim()
      .regex(phoneRegExp, "No es un teléfono valido")
      .optional()
      .or(z.literal("")),
    email: zodStrRequired().email("No es un email"),
    birthDate: z
      .string()
      .date("No es una fecha valida")
      .refine(
        (value) => isDateOnRange(value, acceptedYears.min, acceptedYears.max),
        `Debes tener mas de ${acceptedYears.min} y menos de ${acceptedYears.max} años`
      ),
    gender: z.enum(genderList, { message: "Seleccione un genero" }),
    password: zodStrRequired()
      .min(8, "La contraseña debe tener al menos 8 caracteres")
      .max(50, "No mas de 50 caracteres"),
    confirmPass: zodStrRequired(),
    streetName: z
      .string()
      .trim()
      .max(50, "No más de 50 caracteres")
      .regex(streetNameRegex, "Solo letras y números (Min: 2 caracteres)")
      .optional()
      .or(z.literal("")),
    streetNumber: z
      .string()
      .trim()
      .max(8, "No puede tener mas de 8 dígitos")
      .regex(numericRegex, "Debe ser numérico")
      .optional()
      .or(z.literal("")),
    floorAppartment: z
      .string()
      .max(5, "No puede tener mas de 5 dígitos")
      .regex(numericRegex, "Debe ser numérico")
      .optional()
      .or(z.literal("")),
    additionalInfo: z
      .string()
      .trim()
      .max(100, "No puede tener mas de 100 caracteres")
      .optional()
      .or(z.literal("")),
    city: z
      .string()
      .trim()
      .max(50, "No puede contener mas de 50 caracteres")
      .regex(cityRegex, "Solo puede contener letras y espacios")
      .optional()
      .or(z.literal("")),
    state: z
      .string()
      .min(2, "Debe tener al menos 2 caracteres")
      .max(50, "No puede contener mas de 50 caracteres")
      .regex(nameRegex, "Solo puede contener letras")
      .optional()
      .or(z.literal("")),
    country: z
      .string()
      .trim()
      .max(50, "No mas de 50 caracteres")
      .regex(nameRegex, "Solo puede contener letras")
      .optional()
      .or(z.literal("")),
    interests: z
      .array(z.string())
      .max(5, "No puede elegir mas de 5 intereses")
      .optional()
      .or(z.literal([])),
    image: z
      .instanceof(File)
      .refine((value) => value.type.startsWith("image/"))
      .refine(
        (value) => value && value.size <= MAX_PICTURE_SIZE,
        "Tamaño de imagen máxima: 3MB"
      )
      .optional(),
  })
  .refine((data) => data.password === data.confirmPass, {
    message: "Las contraseñas no coinciden",
    path: ["confirmPass"],
  });

export { userInitialValues, userSchema };
