"use client"

import { useState } from "react"
import { InfoIcon, ChevronDownIcon } from "./Icons"

export default function CompanyDataForm() {
  const [formData, setFormData] = useState({
    tipoPersona: "natural", // 'juridica' or 'natural'
    numeroIdentificacion: "",
    nombres: "",
    segundoNombre: "",
    apellidos: "",
    tipoNacionalidad: "nacional", // 'nacional' or 'extranjero'
    municipio: "",
    correo: "",
    responsabilidadTributaria: "",
  })

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  return (
    <div className=" overflow-auto h-72 bg-[#F8FAFC] p-6">
      <div className="max-w-md mx-auto">
       

        <form className="space-y-4">
          {/* Tipo de Persona */}
          <div className="flex gap-6">
            <label className="flex items-center gap-2">
              <input
                type="radio"
                name="tipoPersona"
                value="juridica"
                checked={formData.tipoPersona === "juridica"}
                onChange={handleInputChange}
                className="w-4 h-4 text-teal-600 border-gray-300 focus:ring-teal-500"
              />
              <span className="text-sm text-gray-700">Persona jurídica</span>
            </label>
            <label className="flex items-center gap-2">
              <input
                type="radio"
                name="tipoPersona"
                value="natural"
                checked={formData.tipoPersona === "natural"}
                onChange={handleInputChange}
                className="w-4 h-4 text-teal-600 border-gray-300 focus:ring-teal-500"
              />
              <span className="text-sm text-gray-700">Persona natural</span>
            </label>
          </div>

          {/* Número de identificación */}
          <div>
            <div className="flex items-center gap-1 mb-1">
              <label className="text-xs text-gray-500">Número de identificación</label>
              <InfoIcon className="h-3.5 w-3.5 text-gray-400" />
            </div>
            <input
              type="text"
              name="numeroIdentificacion"
              value={formData.numeroIdentificacion}
              onChange={handleInputChange}
              placeholder="1234567898"
              className="w-full px-3 py-2 bg-white border border-gray-200 rounded-md focus:outline-none focus:ring-1 focus:ring-teal-500"
            />
          </div>

          {/* Nombres */}
          <div className="grid grid-cols-3 gap-4">
            <div className="col-span-1">
              <label className="block text-xs text-gray-500 mb-1">Nombres</label>
              <input
                type="text"
                name="nombres"
                value={formData.nombres}
                onChange={handleInputChange}
                placeholder="LEONEL"
                className="w-full px-3 py-2 bg-white border border-gray-200 rounded-md focus:outline-none focus:ring-1 focus:ring-teal-500"
              />
            </div>
            <div className="col-span-1">
              <label className="block text-xs text-gray-500 mb-1">Segundo nombre</label>
              <input
                type="text"
                name="segundoNombre"
                value={formData.segundoNombre}
                onChange={handleInputChange}
                placeholder="PALACIO"
                className="w-full px-3 py-2 bg-white border border-gray-200 rounded-md focus:outline-none focus:ring-1 focus:ring-teal-500"
              />
            </div>
            <div className="col-span-1">
              <label className="block text-xs text-gray-500 mb-1">Apellidos</label>
              <input
                type="text"
                name="apellidos"
                value={formData.apellidos}
                onChange={handleInputChange}
                placeholder="ANDRES FELIPE"
                className="w-full px-3 py-2 bg-white border border-gray-200 rounded-md focus:outline-none focus:ring-1 focus:ring-teal-500"
              />
            </div>
          </div>

          {/* Tipo de persona según nacionalidad */}
          <div>
            <label className="block text-xs text-gray-500 mb-1">Tipo de persona según nacionalidad</label>
            <div className="relative">
              <select
                name="tipoNacionalidad"
                value={formData.tipoNacionalidad}
                onChange={handleInputChange}
                className="w-full px-3 py-2 bg-white border border-gray-200 rounded-md appearance-none focus:outline-none focus:ring-1 focus:ring-teal-500"
              >
                <option value="nacional">Nacional</option>
                <option value="extranjero">Extranjeros</option>
              </select>
              <ChevronDownIcon className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" />
            </div>
          </div>

          {/* Responsabilidad tributaria */}
          <div>
            <label className="block text-xs text-gray-500 mb-1">Responsabilidad tributaria</label>
            <div className="relative">
              <select
                name="responsabilidadTributaria"
                value={formData.responsabilidadTributaria}
                onChange={handleInputChange}
                className="w-full px-3 py-2 bg-white border border-gray-200 rounded-md appearance-none focus:outline-none focus:ring-1 focus:ring-teal-500"
              >
                <option value="">No responsable de IVA</option>
                <option value="responsableIVA">Responsable de IVA</option>
                <option value="noResponsableIVA">No responsable de IVA</option>
                <option value="regimensimplificado">Régimen simplificado</option>
              </select>
              <ChevronDownIcon className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" />
            </div>
          </div>

          {/* Municipio / Departamento */}
          <div>
            <label className="block text-xs text-gray-500 mb-1">Municipio / Departamento</label>
            <div className="relative">
              <select
                name="municipio"
                value={formData.municipio}
                onChange={handleInputChange}
                className="w-full px-3 py-2 bg-white border border-gray-200 rounded-md appearance-none focus:outline-none focus:ring-1 focus:ring-teal-500"
              >
                <option value="barranquilla">Barranquilla / Atlántico</option>
              </select>
              <ChevronDownIcon className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" />
            </div>
          </div>

          {/* Correo */}
          <div>
            <label className="block text-xs text-gray-500 mb-1">Correo</label>
            <input
              type="email"
              name="correo"
              value={formData.correo}
              onChange={handleInputChange}
              placeholder="correo@ejemplo.com"
              className="w-full px-3 py-2 bg-white border border-gray-200 rounded-md focus:outline-none focus:ring-1 focus:ring-teal-500"
            />
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full bg-teal-600 text-white py-2 px-4 rounded-md hover:bg-teal-700 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-offset-2 mt-6"
          >
            Continuar
          </button>
        </form>
      </div>
    </div>
  )
}







/*export default function CompanyForm({ formData, handleInputChange }) {
    return (
        <div className="space-y-6">
       
            <div className="flex gap-4">
                <label
                    className={`flex items-center gap-2 px-4 py-2 rounded-md cursor-pointer ${formData.personType === "juridica" ? "bg-teal-50 border-2 border-teal-500" : "border-2 border-gray-200"
                        }`}
                >
                    <input
                        type="radio"
                        name="personType"
                        value="juridica"
                        checked={formData.personType === "juridica"}
                        onChange={handleInputChange}
                        className="hidden"
                    />
                    <div
                        className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${formData.personType === "juridica" ? "border-teal-500" : "border-gray-300"
                            }`}
                    >
                        {formData.personType === "juridica" && <div className="w-2 h-2 rounded-full bg-teal-500" />}
                    </div>
                    <span>Persona jurídica</span>
                </label>
                <label
                    className={`flex items-center gap-2 px-4 py-2 rounded-md cursor-pointer ${formData.personType === "natural" ? "bg-teal-50 border-2 border-teal-500" : "border-2 border-gray-200"
                        }`}
                >
                    <input
                        type="radio"
                        name="personType"
                        value="natural"
                        checked={formData.personType === "natural"}
                        onChange={handleInputChange}
                        className="hidden"
                    />
                    <div
                        className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${formData.personType === "natural" ? "border-teal-500" : "border-gray-300"
                            }`}
                    >
                        {formData.personType === "natural" && <div className="w-2 h-2 rounded-full bg-teal-500" />}
                    </div>
                    <span>Persona natural</span>
                </label>
            </div>

           
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                        Tipo de documento <span className="text-red-500">*</span>
                    </label>
                    <select
                        name="documentType"
                        value={formData.documentType}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500"
                    >
                        <option value="NIT">NIT - Número de Identificación Tributaria</option>
                        <option value="CC">CC - Cédula de Ciudadanía</option>
                    </select>
                </div>
            
            </div>
        </div>
    )
}*/

