"use client"

import { useState } from "react"

export default function OperationModeForm() {
  const [guideType, setGuideType] = useState("video")

  return (
    <div className="h-[300px] overflow-auto bg-[#F8FAFC] p-6">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
     

        {/* Guide Type Selection */}
        <div className="flex gap-4 mb-8">
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="radio"
              name="guideType"
              value="video"
              checked={guideType === "video"}
              onChange={(e) => setGuideType(e.target.value)}
              className="w-4 h-4 text-teal-600 border-gray-300 focus:ring-teal-500"
            />
            <span className="text-sm text-gray-700">Guía en video</span>
          </label>
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="radio"
              name="guideType"
              value="text"
              checked={guideType === "text"}
              onChange={(e) => setGuideType(e.target.value)}
              className="w-4 h-4 text-teal-600 border-gray-300 focus:ring-teal-500"
            />
            <span className="text-sm text-gray-700">Guía en texto</span>
          </label>
        </div>

        {/* Content Section */}
        <div className="mb-8">
          {guideType === "video" ? (
            <div className="aspect-video bg-black rounded-lg w-full"></div>
          ) : (
            <div className="space-y-4">
              <div className="flex gap-3">
                <span className="text-sm text-gray-600">1.</span>
                <span className="text-sm text-gray-600">
                  Ingresa a la DIAN por la opción{" "}
                  <a href="#" className="text-teal-600 hover:underline">
                    "Habilitación"
                  </a>
                </span>
              </div>

              <div className="flex gap-3">
                <span className="text-sm text-gray-600">2.</span>
                <span className="text-sm text-gray-600">
                  Elige tu tipo de usuario y sigue los datos de inicio de sesión. Revisa el correo que te envió la DIAN
                  y haz clic en{" "}
                  <a href="#" className="text-teal-600 hover:underline">
                    "Ingresa aquí"
                  </a>{" "}
                  para acceder a la plataforma.
                </span>
              </div>

              <div className="flex gap-3">
                <span className="text-sm text-gray-600">3.</span>
                <span className="text-sm text-gray-600">
                  En el menú, elige "Registro y habilitación". Haz clic en{" "}
                  <a href="#" className="text-teal-600 hover:underline">
                    "Documentos electrónicos"
                  </a>{" "}
                  y sigue el cursor para la recepción de documentos. Aquí podrás ver el uso configurado para buzón en
                  Alegra.
                </span>
              </div>

              <div className="flex gap-3">
                <span className="text-sm text-gray-600">4.</span>
                <span className="text-sm text-gray-600">
                  Haz clic en "Generación el modo de operación" y selecciona "Software de un proveedor tecnológico".
                </span>
              </div>

              <div className="flex gap-3">
                <span className="text-sm text-gray-600">5.</span>
                <span className="text-sm text-gray-600">
                  Haz clic en "Registrar" y luego en "Aceptar" para confirmar el registro como facturador.
                </span>
              </div>
            </div>
          )}
        </div>

       
      </div>
    </div>
  )
}


