'use client';
import { useState } from 'react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import { Button } from '@nextui-org/react';
import { CgAttachment } from 'react-icons/cg';
import { IoAlertCircleOutline } from 'react-icons/io5';

import {
  workWithUsSchema,
  initialValues,
} from '@/utils/validations/workWithUsSchema';
import { sendJobPostulation } from '@/services/mails';
import { formikZodValidator } from '@/utils/validations';
import toast from 'react-hot-toast';

const inputClass =
  'w-full px-4 py-2.5 bg-white text-gray-800 rounded-lg border border-gray-200 outline-none transition-colors focus:border-primary-500 focus:ring-2 focus:ring-primary-100 placeholder:text-gray-400';

const FieldError = ({ name }) => (
  <ErrorMessage name={name}>
    {(msg) => (
      <span className="flex items-center gap-1 text-sm text-danger-500 mt-0.5">
        <IoAlertCircleOutline className="shrink-0" />
        {msg}
      </span>
    )}
  </ErrorMessage>
);

const FormGroup = ({ label, hint, children }) => (
  <div className="flex flex-col gap-1.5">
    <label className="text-sm font-semibold text-gray-700">
      {label}
      {hint && <span className="ml-1 text-xs font-normal text-gray-400">{hint}</span>}
    </label>
    {children}
  </div>
);

const FileInput = ({ fileName, setFileName, setFieldValue }) => {
  const handleFileChange = (event) => {
    const file = event.currentTarget.files[0];
    if (file) {
      setFileName(file.name);
      setFieldValue('curriculum', file);
    }
  };

  return (
    <label className="flex items-center gap-0 rounded-lg border border-gray-200 bg-white overflow-hidden cursor-pointer transition-colors hover:border-primary-400 focus-within:border-primary-500 focus-within:ring-2 focus-within:ring-primary-100">
      <input
        type="text"
        value={fileName}
        readOnly
        placeholder="Selecciona un archivo PDF (máx. 1 MB)"
        className="flex-1 px-4 py-2.5 bg-transparent text-gray-700 outline-none placeholder:text-gray-400 text-sm cursor-pointer"
      />
      <span className="flex items-center gap-1.5 px-4 py-2.5 bg-primary-50 border-l border-gray-200 text-primary-600 text-sm font-medium whitespace-nowrap">
        <CgAttachment className="text-lg" />
        Adjuntar
      </span>
      <input
        type="file"
        accept=".pdf"
        onChange={handleFileChange}
        className="hidden"
      />
    </label>
  );
};

const TrabajaConNosotrosClient = () => {
  const [fileName, setFileName] = useState('');

  const handleSubmit = async (values, { resetForm }) => {
    try {
      const formData = new FormData();
      for (const name in values) {
        formData.append(name, values[name]);
      }
      await sendJobPostulation(formData);
      resetForm();
      setFileName('');
      toast.success('Solicitud enviada!');
    } catch (error) {
      toast.error('Oops! Vuelva a intentarlo mas tarde...');
    }
  };

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 md:p-10">
      <Formik
        initialValues={initialValues}
        validate={formikZodValidator(workWithUsSchema)}
        onSubmit={handleSubmit}
      >
        {({ errors, isSubmitting, setFieldValue }) => (
          <Form className="w-full grid md:grid-cols-2 gap-8 md:gap-x-12">
            {/* Columna izquierda */}
            <div className="flex flex-col gap-5">
              <div className="pb-2 border-b border-gray-100">
                <h2 className="text-base font-bold text-gray-800">Datos personales</h2>
              </div>

              <FormGroup label="Tipo de documento">
                <input
                  value="DNI"
                  readOnly
                  className={`${inputClass} bg-gray-50 text-gray-500 cursor-not-allowed`}
                />
              </FormGroup>

              <FormGroup label="Número de documento">
                <Field
                  name="dniNumber"
                  placeholder="12345678"
                  className={inputClass}
                />
                <FieldError name="dniNumber" />
              </FormGroup>

              <FormGroup label="Número de teléfono" hint="(sin espacios ni guiones)">
                <Field
                  name="phone"
                  placeholder="+5491122334455"
                  className={inputClass}
                />
                <FieldError name="phone" />
              </FormGroup>
            </div>

            {/* Columna derecha */}
            <div className="flex flex-col gap-5">
              <div className="pb-2 border-b border-gray-100">
                <h2 className="text-base font-bold text-gray-800">Información de contacto</h2>
              </div>

              <FormGroup label="Email">
                <Field
                  name="email"
                  type="email"
                  placeholder="ejemplo@correo.com"
                  className={inputClass}
                />
                <FieldError name="email" />
              </FormGroup>

              <FormGroup label="Curriculum Vitae">
                <FileInput
                  fileName={fileName}
                  setFileName={setFileName}
                  setFieldValue={setFieldValue}
                />
                {errors.curriculum && (
                  <span className="flex items-center gap-1 text-sm text-danger-500 mt-0.5">
                    <IoAlertCircleOutline className="shrink-0" />
                    {errors.curriculum}
                  </span>
                )}
              </FormGroup>

              <FormGroup label="Mensaje">
                <Field
                  name="message"
                  as="textarea"
                  placeholder="Contanos sobre vos, tu experiencia y por qué querés unirte al equipo..."
                  spellCheck={true}
                  rows={5}
                  className={`${inputClass} resize-none`}
                />
                <FieldError name="message" />
              </FormGroup>
            </div>

            {/* Submit */}
            <div className="md:col-span-2 flex flex-col sm:flex-row-reverse items-center gap-3 pt-2 border-t border-gray-100">
              <Button
                type="submit"
                isDisabled={Object.keys(errors).length > 0 || isSubmitting}
                isLoading={isSubmitting}
                className="w-full sm:w-auto px-10 py-3 bg-primary-600 hover:bg-primary-700 font-semibold text-white text-sm uppercase tracking-wider rounded-xl transition-colors disabled:opacity-50"
              >
                Enviar solicitud
              </Button>
              <p className="text-xs text-gray-400 text-center sm:text-left">
                Revisaremos tu solicitud y te contactaremos a la brevedad.
              </p>
            </div>
          </Form>
        )}
      </Formik>
    </div>
  );
};

export default TrabajaConNosotrosClient;
