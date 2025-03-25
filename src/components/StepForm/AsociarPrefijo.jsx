"use client"

import { useState } from "react"
import { ChevronDown, ChevronUp, AlertCircle } from "lucide-react"

export default function AsociarPrefijo() {
  const [guideType, setGuideType] = useState("video")
  const [isExpanded, setIsExpanded] = useState(false)

  return (
    <div className="h-[300px] overflow-auto bg-[#F8FAFC] p-6">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          
          <div className="mt-4 flex items-start gap-2 text-sm text-gray-600">
            <AlertCircle className="w-4 h-4 text-gray-400 mt-0.5 flex-shrink-0" />
            <p>
              Importante: si aún no cuentas con una resolución de factura electrónica, puedes{" "}
              <a href="#" className="text-teal-600 hover:underline">
                solicitar a nosotros
              </a>{" "}
              para realizar este paso.
            </p>
          </div>
        </div>

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

        {/* Content */}
        {guideType === "video" ? (
          <div className="aspect-video w-full bg-black rounded-lg overflow-hidden">
            <iframe
              width="100%"
              height="100%"
              src="about:blank" // Replace with actual YouTube embed URL
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              className="w-full h-full"
            ></iframe>
          </div>
        ) : (
          <div className="space-y-8">
            {/* Main Steps */}
            <div className="space-y-4">
              <div className="flex gap-3">
                <span className="text-sm text-gray-600">1.</span>
                <span className="text-sm text-gray-600">
                  Ingresa a la página de la DIAN por la opción{" "}
                  <a href="#" className="text-teal-600 hover:underline">
                    Facturando Electrónicamente
                  </a>
                </span>
              </div>

              <div className="flex gap-3">
                <span className="text-sm text-gray-600">2.</span>
                <span className="text-sm text-gray-600">
                  Elige tu tipo de usuario y digita tus datos de inicio de sesión. Revisa el correo que te envió la DIAN
                  y haz clic en "Ingresa aquí" para acceder a la plataforma.
                </span>
              </div>

              <div className="flex gap-3">
                <span className="text-sm text-gray-600">3.</span>
                <span className="text-sm text-gray-600">
                  Presiona el botón "Configuración" y luego "Rangos de numeración"
                </span>
              </div>

              <div className="flex gap-3">
                <span className="text-sm text-gray-600">4.</span>
                <span className="text-sm text-gray-600">
                  Selecciona como proveedor a "Soluciones Alegra S.A.S. Alegra"
                </span>
              </div>

              <div className="flex gap-3">
                <span className="text-sm text-gray-600">5.</span>
                <span className="text-sm text-gray-600">
                  En "Prefijo" elige la resolución que solicitaste previamente y presiona el botón "Agregar"
                </span>
              </div>

              <div className="flex gap-3">
                <span className="text-sm text-gray-600">6.</span>
                <span className="text-sm text-gray-600">
                  Haz clic en el botón "Aceptar" para confirmar la asociación y avanza al siguiente paso en Alegra.
                </span>
              </div>
            </div>

            {/* RUT Update Section */}
            <div className="border rounded-lg">
              <button
                onClick={() => setIsExpanded(!isExpanded)}
                className="w-full px-4 py-3 flex items-center justify-between text-left"
              >
                <span className="font-medium text-gray-900">Actualización del RUT</span>
                {isExpanded ? (
                  <ChevronUp className="w-5 h-5 text-gray-500" />
                ) : (
                  <ChevronDown className="w-5 h-5 text-gray-500" />
                )}
              </button>

              {isExpanded && (
                <div className="px-4 pb-4">
                  <p className="text-sm text-gray-600 mb-4">
                    Consiste en indicarle a la DIAN la fecha en que empezarás a emitir facturas y se ve para que tu RUT
                    se actualice con la responsabilidad de Facturador electrónico. Puedes seguir estos pasos:
                  </p>

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
                        Elige tu tipo de usuario y digita tus datos de inicio de sesión. Revisa el correo que te envió
                        la DIAN y haz clic en "Ingresa aquí" para acceder a la plataforma.
                      </span>
                    </div>

                    <div className="flex gap-3">
                      <span className="text-sm text-gray-600">3.</span>
                      <span className="text-sm text-gray-600">
                        Ingresa la fecha en la que deseas salir a producción y pulsa "Aceptar"
                      </span>
                    </div>

                    <div className="flex gap-3">
                      <span className="text-sm text-gray-600">4.</span>
                      <span className="text-sm text-gray-600">
                        Te aparecerá una notificación indicando que tu RUT se va a actualizar con la responsabilidad
                        52-Facturador Electrónico y podrás finalizar desde la opción "Aceptar".
                      </span>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

