import React, { useState } from "react";
import CompanyDataForm from "../components/StepForm/CompanyDataForm";
import DianForm from "./StepForm/DianForm";
import OperationModeForm from "./StepForm/OperationModeForm";
import { X } from "lucide-react"; // Importar ícono de cierre
import SetPruebas from "./StepForm/SetPruebas";
import AsociarPrefijo from "./StepForm/AsociarPrefijo";
import Numeraciones from "./StepForm/Numeraciones";
import TermCond from "./StepForm/TermCond";

const steps = [
  {
    id: 0,
    title: "Datos de tu empresa",
    subtitle: "Completa los datos de tu negocio para iniciar el proceso en la DIAN.",
    component: CompanyDataForm,
  },
  {
    id: 1,
    title: "Habilitación DIAN",
    subtitle: " Sigue los pasos de la guía para registrarte como facturador electrónico en la DIAN.",
    component: DianForm,
  },
  {
    id: 2,
    title: "Modos de Operación",
    subtitle: "Selecciona el modo de operación para tu facturación electrónica.",
    component: OperationModeForm,
  },
  {
    id: 3,
    title: "Set de pruebas",
    subtitle: "Trae el código generado por la DIAN y activa el inicio de tus pruebas.",
    component: SetPruebas,
  },
  {
    id: 4,
    title: "Asociar prefijo",
    subtitle: "Realiza los pasos de la guía para asociar tu resolución a FactuPrime.",
    component: AsociarPrefijo,
  },
  {
    id: 5,
    title: "Configuración de numeración",
    subtitle: "Agrega el número de tu numeración y consúltala para traer los datos de la DIAN.",
    component: Numeraciones,
  },
  {
    id: 6,
    title: "Términos y condiciones",
    subtitle: "Ingresa los datos del representante legal, acepta los términos y condiciones para usar nuestro certificado digital exigido por la DIAN, y finaliza tu habilitación.",
    component: TermCond,
  },
];

export default function MultiStepForm({ onClose }) {
  const [currentStep, setCurrentStep] = useState(0);
  const [formData, setFormData] = useState({
    personType: "natural",
    documentType: "NIT",
    documentNumber: "",
    firstName: "",
    middleName: "",
    lastName: "",
    taxResponsibility: "",
    nationality: "Nacional",
    municipality: "",
    email: "",
    dianResolution: "",
    resolutionDate: "",
    operationMode: "",
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleNext = (e) => {
    e.preventDefault();
    if (currentStep < steps.length - 1) {
      setCurrentStep((prev) => prev + 1);
    } else {
      console.log("Cerrando formulario en true...");
      localStorage.setItem("FormStep", "true"); // Guardar en localStorage al finalizar
      onClose(); // Cerrar el formulario
    }
  };

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep((prev) => prev - 1);
    }
  };

  const handleClose = () => {
    console.log("Cerrando formulario...");
    localStorage.setItem("FormStep", "false"); // Guardar en localStorage si se cierra sin finalizar
    onClose(); // Cerrar el formulario
  };

  const CurrentStepComponent = steps[currentStep].component;

  return (
    <div className="fixed inset-0 flex items-center justify-center overflow-auto h-screen z-50 bg-opacity-50 backdrop-blur-md">

      <div className="relative bg-white  p-8 rounded-lg shadow-lg max-w-3xl w-full">

        {/* Botón de cierre */}
        <button
          className="absolute top-4 cursor-pointer right-4 text-gray-500 hover:text-gray-700"
          onClick={handleClose}
        >
          <X size={24} />
        </button>

        {/* Progress Bar */}
        <div className="max-w-4xl mx-auto mb-8">
          <div className="flex items-center justify-between mb-4">
            {steps.map((step, index) => (
              <React.Fragment key={step.id}>
                <div className="flex flex-col items-center">
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center ${index === currentStep
                        ? "bg-teal-500 text-white"
                        : index < currentStep
                          ? "bg-teal-500 text-white"
                          : "bg-gray-200 text-gray-500"
                      }`}
                  >
                    {index + 1}
                  </div>
                  <span className="text-xs mt-2 text-center hidden md:block">{step.title}</span>
                </div>
                {index < steps.length - 1 && (
                  <div className={`flex-1 h-0.5 ${index < currentStep ? "bg-teal-500" : "bg-gray-200"}`} />
                )}
              </React.Fragment>
            ))}
          </div>
        </div>

        {/* Form Container */}
        <div className="text-sm text-gray-500 mb-4">Facturación electrónica</div>
        <h1 className="text-2xl font-semibold mb-2">{steps[currentStep].title}</h1>
        <p className="text-gray-600 mb-6">{steps[currentStep].subtitle}</p>

        <form onSubmit={handleNext}>
          {CurrentStepComponent && <CurrentStepComponent formData={formData} handleInputChange={handleInputChange} />}

          {/* Navigation Buttons */}
          <div className="flex justify-between mt-8">
            <button
              type="button"
              onClick={handleBack}
              className={`px-6 py-2 rounded-md transition-colors ${currentStep === 0
                  ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                  : "bg-gray-100 text-gray-600 cursor-pointer hover:bg-gray-200"
                }`}
              disabled={currentStep === 0}
            >
              Atrás
            </button>
            <button
              type="submit"
              className="px-6 cursor-pointer py-2 bg-teal-500 text-white rounded-md hover:bg-teal-600 transition-colors"
            >
              {currentStep === steps.length - 1 ? "Finalizar" : "Continuar"}
            </button>
          </div>
        </form>

      </div>
    </div>
  );
}
