"use client"

import { useState } from "react"
import { CheckCircle2, AlertCircle, Info } from "lucide-react"

export default function SetPruebas() {
  const [testCode, setTestCode] = useState("")
  const [error, setError] = useState(false)
  const [isValidating, setIsValidating] = useState(false)
  const [currentStep, setCurrentStep] = useState(0)

  const validationSteps = ["Comprobando tus datos", "Preparando el envío", "Enviando documentos de prueba"]

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!testCode.trim()) {
      setError(true)
      return
    }
    setError(false)
    setIsValidating(true)

    // Simulate validation steps
    let step = 0
    const interval = setInterval(() => {
      if (step < validationSteps.length) {
        setCurrentStep(step)
        step++
      } else {
        clearInterval(interval)
      }
    }, 1500)
  }

  return (
    <div className="overflow-auto bg-[#F8FAFC] p-6">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
       

        {!isValidating ? (
          <>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm text-gray-600 mb-1">
                  Código TestSetId <span className="text-red-500">*</span>
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={testCode}
                    onChange={(e) => setTestCode(e.target.value)}
                    className={`flex-1 px-3 py-2 border ${
                      error ? "border-red-500" : "border-gray-200"
                    } rounded-md focus:outline-none focus:ring-1 focus:ring-teal-500`}
                    placeholder="3eaa48bb-9cd4-49f5-98b1-41cdeb59873f"
                  />
                  <button
                    type="submit"
                    className="px-4 py-2 text-teal-600 bg-white border border-gray-200 rounded-md hover:bg-gray-50"
                  >
                    Iniciar prueba
                  </button>
                </div>
                {error && (
                  <p className="mt-1 text-sm text-red-500 flex items-center gap-1">
                    <AlertCircle className="w-4 h-4" />
                    El código es requerido para iniciar el proceso de validación
                  </p>
                )}
              </div>
            </form>

            <div className="mt-4">
              <a href="#" className="text-sm text-teal-600 hover:underline flex items-center gap-1">
                <Info className="w-4 h-4" />
                ¿Estás buscando tu código? Aprende a encontrarlo
              </a>
            </div>
          </>
        ) : (
          <div className="space-y-6">
            <div className="space-y-3">
              {validationSteps.map((step, index) => (
                <div
                  key={step}
                  className={`flex items-center gap-2 ${index <= currentStep ? "text-gray-900" : "text-gray-400"}`}
                >
                  {index <= currentStep && <CheckCircle2 className="w-5 h-5 text-teal-600" />}
                  <span className="text-sm">{step}</span>
                </div>
              ))}
            </div>

            {currentStep === validationSteps.length - 1 && (
              <div className="bg-blue-50 border-l-4 border-blue-400 p-4 rounded">
                <div className="flex items-start gap-3">
                  <Info className="w-5 h-5 text-blue-400 mt-0.5" />
                  <div>
                    <p className="text-sm font-medium text-gray-900">¡Las pruebas están corriendo! 🎉</p>
                    <p className="text-sm text-gray-600 mt-1">
                      Pueden tardar hasta 7 minutos, evita recargar la página para que no se reinicie el envío.
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        
      </div>
    </div>
  )
}

