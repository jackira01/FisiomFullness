"use client";
import { useRef, useState, useEffect } from "react";
import { FaWhatsapp } from "react-icons/fa";

export default function WhatsAppPopup() {
  const datoNombre = useRef(null);
  const datoMensaje = useRef(null);
  const popupRef = useRef(null);
  const [showPopup, setShowPopup] = useState(false);
  const [isClosing, setIsClosing] = useState(false);
  const [nombre, setNombre] = useState("");
  const [mensaje, setMensaje] = useState("");

  function enviar() {
    const url = `https://api.whatsapp.com/send?phone=+51901294627&text=*Nombre:*%20${encodeURIComponent(
      nombre,
    )}%0A*Descripción:*%20${encodeURIComponent(mensaje)}`;
    window.open(url, "_blank");
  }

  useEffect(() => {
    function handleClickOutside(event) {
      if (popupRef.current && !popupRef.current.contains(event.target)) {
        closePopup();
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  function closePopup() {
    setIsClosing(true);
    setTimeout(() => {
      setShowPopup(false);
      setIsClosing(false);
    }, 300);
  }

  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => setShowPopup(!showPopup)}
        className={`fixed bottom-4 right-4 p-3 rounded-full text-white focus:outline-none transition-transform transform ${
          showPopup
            ? "bg-green-600 scale-110 shadow-2xl"
            : "bg-green-500 hover:bg-green-600 hover:scale-110 shadow-lg"
        }`}
      >
        <FaWhatsapp size={32} />
      </button>

      {showPopup && (
        <div
          ref={popupRef}
          className={`fixed bottom-16 right-6 bg-white border border-gray-300 rounded-lg shadow-lg p-3 md:p-4 w-64 md:w-72 z-50 ${
            isClosing ? "animate-fade-out-down" : "animate-fade-in-up"
          }`}
        >
          <h2 className="text-sm md:text-md font-semibold text-gray-800 mb-2 md:mb-3 text-center">
            Chatea con un profesional de la salud
          </h2>
          <form
            onSubmit={(e) => e.preventDefault()}
            className="space-y-3 md:space-y-4"
          >
            <div className="relative">
              <label
                htmlFor="datoNombre"
                className="block text-xs md:text-sm font-medium text-gray-600 mb-1"
              >
                Nombre
              </label>
              <input
                id="datoNombre"
                type="text"
                ref={datoNombre}
                value={nombre}
                onChange={(e) => setNombre(e.target.value)}
                style={{ borderWidth: "1.6px" }}
                className="w-full px-2 md:px-3 py-1.5 md:py-2 border border-gray-300 rounded-md bg-white text-gray-700 hover:border-gray-400 focus:border-[#218BB5] focus:outline-none focus:shadow-sm transition-colors"
                placeholder="Ingresa tu nombre"
              />
            </div>
            <div className="relative">
              <label
                htmlFor="datoMensaje"
                className="block text-xs md:text-sm font-medium text-gray-600 mb-1"
              >
                Diagnóstico
              </label>
              <textarea
                id="datoMensaje"
                type="text"
                ref={datoMensaje}
                value={mensaje}
                onChange={(e) => setMensaje(e.target.value)}
                style={{ borderWidth: "1.6px" }}
                className="w-full px-2 md:px-3 py-1.5 md:py-2 border border-gray-300 rounded-md bg-white text-gray-700 hover:border-gray-400 focus:outline-none focus:border-[#218BB5] focus:shadow-sm transition-colors resize-none"
                placeholder="Describe tu dolor"
                rows="3"
              />
            </div>
            <button
              onClick={enviar}
              type="button"
              disabled={!nombre || !mensaje}
              className={`w-full py-1.5 md:py-2 rounded-lg font-bold transition-colors ${
                nombre && mensaje
                  ? "bg-green-500 text-white hover:bg-green-600"
                  : "bg-[#C8E6C9] text-white"
              }`}
            >
              Enviar
            </button>
            <button
              onClick={() =>
                window.open(
                  "https://call.whatsapp.com/voice/yuqikAAqBElwyUwfHevLwH",
                  "_blank",
                )
              }
              type="button"
              className="block md:hidden w-full bg-blue-500 text-white py-1.5 md:py-2 rounded-lg hover:bg-blue-600 transition-colors"
            >
              Llamar a un fisioterapeuta
            </button>
          </form>
        </div>
      )}
    </div>
  );
}
