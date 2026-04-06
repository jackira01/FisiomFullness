import { useState } from "react";
import { useFormikContext } from "formik";
import { Input, Divider, Select, SelectItem } from "@nextui-org/react";
import { Button } from "@nextui-org/react";
import Link from "next/link";
import { EyeFilledIcon } from "../CustomComponentForm/EyeFilledIcon";
import { EyeSlashFilledIcon } from "../CustomComponentForm/EyeSlashFilledIcon";
import { MdAttachMoney } from "react-icons/md";
import FileUpload from "./FileUpload";
import { LocationPickerField } from "./LocationPickerField";
import {
  specialtyList,
  genderList,
  countryList,
  indicativosTelefonicos,
} from "./listArray";
import { listInputsUserData } from "./listInputs";

export const InputsFormRegister = ({
  isProfessional,
  isUpdate,
  submitButtonMessage,
  listInputsValue,
  aceptoCondiciones,
  setAceptoCondiciones,
  recibirInformacion,
  setRecibirInformacion,
}) => {
  const {
    touched,
    values,
    errors,
    isSubmitting,
    handleChange,
    handleBlur,
    setFieldValue,
  } = useFormikContext();

  const [isVisible, setIsVisible] = useState(false);
  const [isVisibleConfirm, setIsVisibleConfirm] = useState(false);

  const toggleVisibility = () => setIsVisible((v) => !v);
  const toggleVisibilityConfirm = () => setIsVisibleConfirm((v) => !v);

  const inputClass = {
    inputWrapper: "!bg-[#F4F4F4] !border-1 border-transparent",
    label: "text-default-600 text-base",
    input: "text-base",
    errorMessage: "text-sm",
  };

  return (
    <div className="flex flex-col gap-6">

      {/* ── SECCIÓN: Datos principales ─────────────────────────── */}
      <div className="flex flex-col gap-2">
        <h3 className="text-sm font-semibold text-default-500 uppercase tracking-wide">
          Datos principales
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {listInputsUserData(errors, touched).map((inputValue, index) => (
            <Input
              key={index}
              {...inputValue}
              size="md"
              variant="bordered"
              radius="sm"
              value={values[inputValue.name]}
              onBlur={handleBlur}
              onChange={handleChange}
              classNames={inputClass}
              isClearable={isUpdate}
              onClear={isUpdate ? () => setFieldValue(inputValue.name, "") : undefined}
            />
          ))}

          {/* Género */}
          <Select
            name="gender"
            label="Género"
            variant="flat"
            selectedKeys={values.gender ? [values.gender] : []}
            isInvalid={!!errors.gender}
            errorMessage={errors.gender}
            onChange={handleChange}
            size="md"
            radius="sm"
            classNames={inputClass}
          >
            {genderList.map((g) => (
              <SelectItem key={g.value}>{g.label}</SelectItem>
            ))}
          </Select>

          {/* Teléfono */}
          <div className="grid grid-cols-[110px,1fr] gap-2">
            <Select
              name="phoneCode"
              label="Código"
              variant="flat"
              selectedKeys={values.phoneCode ? [values.phoneCode] : []}
              isInvalid={!!errors.phoneCode}
              errorMessage={errors.phoneCode}
              onChange={handleChange}
              size="md"
              radius="sm"
              classNames={inputClass}
            >
              {indicativosTelefonicos.map((ind) => (
                <SelectItem key={ind.value} value={ind.value}>
                  {ind.label}
                </SelectItem>
              ))}
            </Select>
            <Input
              name="phone"
              aria-label="Número de teléfono"
              type="text"
              variant="bordered"
              radius="sm"
              label="Número de teléfono"
              value={values.phone}
              isInvalid={!!(touched?.phone && errors.phone)}
              errorMessage={touched?.phone && errors.phone}
              onBlur={handleBlur}
              onChange={handleChange}
              classNames={inputClass}
            />
          </div>
        </div>
      </div>

      <Divider />

      {/* ── SECCIÓN: Información profesional (solo profesionales) ── */}
      {isProfessional && (
        <>
          <div className="flex flex-col gap-2">
            <h3 className="text-sm font-semibold text-default-500 uppercase tracking-wide">
              Información profesional
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <Select
                name="specialty"
                label="Especialidad"
                variant="flat"
                selectedKeys={values.specialty ? [values.specialty] : []}
                isInvalid={!!errors.specialty}
                errorMessage={errors.specialty}
                onChange={handleChange}
                size="md"
                radius="sm"
                classNames={inputClass}
              >
                {specialtyList.map((s) => (
                  <SelectItem key={s.value}>{s.label}</SelectItem>
                ))}
              </Select>

              <Input
                name="consultationPrice"
                aria-label="Precio de consulta"
                type="text"
                variant="bordered"
                radius="sm"
                size="md"
                label="Precio consulta"
                value={values.consultationPrice}
                isInvalid={!!(touched?.consultationPrice && errors.consultationPrice)}
                errorMessage={touched?.consultationPrice && errors.consultationPrice}
                onBlur={handleBlur}
                onChange={handleChange}
                classNames={inputClass}
                startContent={<MdAttachMoney size={22} className="text-secondary-400" />}
              />

              <Input
                name="license"
                aria-label="Número de colegiado"
                type="text"
                variant="bordered"
                radius="sm"
                label="Número de colegiado"
                value={values.license}
                isInvalid={!!(touched?.license && errors.license)}
                errorMessage={touched?.license && errors.license}
                onBlur={handleBlur}
                onChange={handleChange}
                size="md"
                classNames={inputClass}
              />
            </div>
          </div>

          <Divider />
        </>
      )}

      {/* ── SECCIÓN: Contraseña ──────────────────────────────────── */}
      <div className="flex flex-col gap-2">
        <h3 className="text-sm font-semibold text-default-500 uppercase tracking-wide">
          Contraseña
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <Input
            name="password"
            aria-label="Contraseña"
            autoComplete="new-password"
            variant="bordered"
            radius="sm"
            label="Contraseña"
            size="md"
            value={values.password}
            isInvalid={!!(touched.password && errors.password)}
            errorMessage={touched.password && errors.password}
            onBlur={handleBlur}
            onChange={handleChange}
            endContent={
              <button className="focus:outline-none" type="button" onClick={toggleVisibility}>
                {isVisible
                  ? <EyeSlashFilledIcon className="text-2xl text-default-400 pointer-events-none" />
                  : <EyeFilledIcon className="text-2xl text-default-400 pointer-events-none" />}
              </button>
            }
            type={isVisible ? "text" : "password"}
            classNames={inputClass}
          />
          <Input
            name="confirmPass"
            aria-label="Repita la contraseña"
            autoComplete="new-password"
            variant="bordered"
            radius="sm"
            label="Repita la contraseña"
            size="md"
            value={values.confirmPass}
            isInvalid={!!(touched.confirmPass && errors.confirmPass)}
            errorMessage={touched.confirmPass && errors.confirmPass}
            onBlur={handleBlur}
            onChange={handleChange}
            endContent={
              <button className="focus:outline-none" type="button" onClick={toggleVisibilityConfirm}>
                {isVisibleConfirm
                  ? <EyeSlashFilledIcon className="text-2xl text-default-400 pointer-events-none" />
                  : <EyeFilledIcon className="text-2xl text-default-400 pointer-events-none" />}
              </button>
            }
            type={isVisibleConfirm ? "text" : "password"}
            classNames={inputClass}
          />
        </div>
      </div>

      {/* ── SECCIÓN: Curriculum (solo profesionales en registro) ─── */}
      {isProfessional && !isUpdate && (
        <>
          <Divider />
          <div className="flex flex-col gap-2">
            <h3 className="text-sm font-semibold text-default-500 uppercase tracking-wide">
              Curriculum
            </h3>
            <FileUpload name="curriculum" />
          </div>
        </>
      )}

      {/* ── SECCIÓN: Ubicación (solo profesionales) ──────────────── */}
      {isProfessional && (
        <>
          <Divider />
          <div className="flex flex-col gap-3">
            <h3 className="text-sm font-semibold text-default-500 uppercase tracking-wide">
              Ubicación del consultorio
            </h3>

            {/* Checkbox: ¿tiene ubicación física? */}
            <label className="flex items-start gap-3 cursor-pointer">
              <input
                type="checkbox"
                className="mt-0.5 size-5 cursor-pointer accent-primary"
                checked={values.hasPhysicalLocation}
                onChange={(e) => {
                  setFieldValue("hasPhysicalLocation", e.target.checked);
                  if (!e.target.checked) {
                    setFieldValue("latitude", null);
                    setFieldValue("longitude", null);
                  }
                }}
              />
              <span className="text-sm text-default-600">
                <strong>Tengo ubicación física.</strong>{" "}
                Desactiva esta opción si solo realizas reuniones en línea.
              </span>
            </label>

            {/* Campos de dirección + mapa (solo si tiene ubicación física) */}
            {values.hasPhysicalLocation && (
              <div className="flex flex-col gap-3">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {/* País */}
                  <Select
                    name="country"
                    label="País"
                    variant="flat"
                    selectedKeys={values.country ? [values.country] : []}
                    isInvalid={!!(errors.country)}
                    errorMessage={errors.country}
                    onChange={handleChange}
                    size="md"
                    radius="sm"
                    classNames={inputClass}
                  >
                    {countryList.map((c) => (
                      <SelectItem key={c.value} value={c.value}>
                        {c.label}
                      </SelectItem>
                    ))}
                  </Select>

                  {/* Estado / Provincia */}
                  <Input
                    name="state"
                    aria-label="Estado/Provincia"
                    type="text"
                    variant="bordered"
                    radius="sm"
                    label="Estado / Provincia"
                    value={values.state}
                    isInvalid={!!(touched?.state && errors.state)}
                    errorMessage={touched?.state && errors.state}
                    onBlur={handleBlur}
                    onChange={handleChange}
                    classNames={inputClass}
                  />

                  {/* Ciudad */}
                  <Input
                    name="city"
                    aria-label="Ciudad"
                    type="text"
                    variant="bordered"
                    radius="sm"
                    label="Ciudad"
                    value={values.city}
                    isInvalid={!!(touched?.city && errors.city)}
                    errorMessage={touched?.city && errors.city}
                    onBlur={handleBlur}
                    onChange={handleChange}
                    classNames={inputClass}
                  />

                  {/* Calle */}
                  <Input
                    name="streetName"
                    aria-label="Calle"
                    type="text"
                    variant="bordered"
                    radius="sm"
                    label="Calle"
                    value={values.streetName}
                    isInvalid={!!(touched?.streetName && errors.streetName)}
                    errorMessage={touched?.streetName && errors.streetName}
                    onBlur={handleBlur}
                    onChange={handleChange}
                    classNames={inputClass}
                  />

                  {/* Número */}
                  <Input
                    name="streetNumber"
                    aria-label="Número de calle"
                    type="text"
                    variant="bordered"
                    radius="sm"
                    label="Número"
                    value={values.streetNumber}
                    isInvalid={!!(touched?.streetNumber && errors.streetNumber)}
                    errorMessage={touched?.streetNumber && errors.streetNumber}
                    onBlur={handleBlur}
                    onChange={handleChange}
                    classNames={inputClass}
                  />

                  {/* Datos adicionales */}
                  <Input
                    name="additionalInfo"
                    aria-label="Datos adicionales"
                    type="text"
                    variant="bordered"
                    radius="sm"
                    label="Datos adicionales"
                    placeholder="Centro comercial, local 51…"
                    value={values.additionalInfo}
                    isInvalid={!!(touched?.additionalInfo && errors.additionalInfo)}
                    errorMessage={touched?.additionalInfo && errors.additionalInfo}
                    onBlur={handleBlur}
                    onChange={handleChange}
                    classNames={inputClass}
                  />
                </div>

                {/* Mapa con botón de geocodificación */}
                <LocationPickerField />
              </div>
            )}
          </div>
        </>
      )}

      {/* ── Checkboxes de condiciones + ¿Ya registrado? ─────────── */}
      <Divider />
      <div className="flex flex-col gap-2">
        {setAceptoCondiciones && (
          <label className="text-[11px] flex gap-2">
            <input
              type="checkbox"
              checked={aceptoCondiciones}
              onChange={() => setAceptoCondiciones((v) => !v)}
              className="size-5 cursor-pointer"
            />
            <span>
              Acepto los{" "}
              <a className="text-primary font-semibold hover:underline cursor-pointer">
                términos y condiciones
              </a>{" "}
              del servicio de FISIOMFULNESS. Declaro haber leído y entiendo la
              política de privacidad
            </span>
          </label>
        )}
        {setRecibirInformacion && (
          <label className="text-[11px] flex gap-2">
            <input
              type="checkbox"
              checked={recibirInformacion}
              onChange={() => setRecibirInformacion((v) => !v)}
              className="size-5 cursor-pointer"
            />
            <span>
              Doy mi consentimiento y acepto recibir información sobre los{" "}
              <a className="text-primary font-semibold hover:underline cursor-pointer">
                servicios y novedades de FISIOMFULNESS
              </a>
            </span>
          </label>
        )}

        <div className="flex flex-row justify-between items-center mt-2 gap-4">
          <div className="flex items-center gap-3">
            <p className="text-sm text-default-500">¿Ya está registrado?</p>
            <Button
              className="bg-default-200 text-default-700 rounded-sm font-semibold text-sm"
              as={Link}
              href="/login"
              size="sm"
            >
              Ingresar
            </Button>
          </div>
          <Button
            className="bg-primary-500 text-white uppercase font-semibold rounded-sm"
            type="submit"
            isDisabled={Object.keys(errors).length > 0 || isSubmitting}
            isLoading={isSubmitting}
            size="md"
          >
            {submitButtonMessage}
          </Button>
        </div>
      </div>
    </div>
  );
};
