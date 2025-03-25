"use client"

import { useState } from "react"

export default function TermCond() {
  const [formData, setFormData] = useState({
    fullName: "",
    documentType: "",
    taxId: "",
    niitId: "",
    email: "",
    acceptTerms: false,
  })

  // PDF content as base64 string
  const defaultPdfContent = `
    %PDF-1.4
    1 0 obj
    <<
      /Type /Catalog
      /Pages 2 0 R
    >>
    endobj
    2 0 obj
    <<
      /Type /Pages
      /Kids [3 0 R]
      /Count 1
    >>
    endobj
    3 0 obj
    <<
      /Type /Page
      /Parent 2 0 R
      /Resources <<
        /Font <<
          /F1 4 0 R
        >>
      >>
      /MediaBox [0 0 612 792]
      /Contents 5 0 R
    >>
    endobj
    4 0 obj
    <<
      /Type /Font
      /Subtype /Type1
      /BaseFont /Helvetica
    >>
    endobj
    5 0 obj
    << /Length 68 >>
    stream
      BT
        /F1 24 Tf
        50 700 Td
        (Términos y Condiciones) Tj
      ET
    endstream
    endobj
    xref
    0 6
    0000000000 65535 f
    0000000009 00000 n
    0000000058 00000 n
    0000000115 00000 n
    0000000254 00000 n
    0000000332 00000 n
    trailer
    <<
      /Size 6
      /Root 1 0 R
    >>
    startxref
    452
    %%EOF
  `

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }))
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    console.log("Form data:", formData)
  }

  return (
    <div className="h-[300px] overflow-auto bg-gray-50 p-6">
    
      

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* PDF Viewer */}
        <div className="bg-white rounded-lg shadow-sm p-4 h-[600px]">
          <object
            data={`data:application/pdf;base64,${btoa(defaultPdfContent)}`}
            type="application/pdf"
            className="w-full h-full"
          >
            <div className="flex flex-col items-center justify-center h-full bg-gray-100 rounded-lg p-6 text-center">
              <div className="mb-4">
                <svg className="w-16 h-16 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                  />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Términos y Condiciones</h3>
              <div className="space-y-4 text-gray-600">
                <p>1. Objeto del Contrato</p>
                <p>2. Obligaciones de las Partes</p>
                <p>3. Vigencia y Terminación</p>
                <p>4. Confidencialidad</p>
                <p>5. Protección de Datos</p>
                <p>6. Legislación Aplicable</p>
              </div>
            </div>
          </object>
        </div>

        {/* Form */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Nombre completo <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="fullName"
                value={formData.fullName}
                onChange={handleInputChange}
                className="w-full rounded-md border border-gray-300 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-teal-500"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Tipo de documento <span className="text-red-500">*</span>
              </label>
              <select
                name="documentType"
                value={formData.documentType}
                onChange={handleInputChange}
                className="w-full rounded-md border border-gray-300 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-teal-500"
                required
              >
                <option value="">Seleccione un tipo de documento</option>
                <option value="cc">Cédula de Ciudadanía</option>
                <option value="ce">Cédula de Extranjería</option>
                <option value="passport">Pasaporte</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Número de identificación tributaria <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="taxId"
                value={formData.taxId}
                onChange={handleInputChange}
                className="w-full rounded-md border border-gray-300 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-teal-500"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Número de identificación NIIT <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="niitId"
                value={formData.niitId}
                onChange={handleInputChange}
                className="w-full rounded-md border border-gray-300 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-teal-500"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Correo electrónico <span className="text-red-500">*</span>
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                className="w-full rounded-md border border-gray-300 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-teal-500"
                required
              />
            </div>

            <div className="flex items-start gap-3">
              <input
                type="checkbox"
                id="acceptTerms"
                name="acceptTerms"
                checked={formData.acceptTerms}
                onChange={handleInputChange}
                className="mt-1 h-4 w-4 rounded border-gray-300 text-teal-600 focus:ring-teal-500"
                required
              />
              <label htmlFor="acceptTerms" className="text-sm text-gray-600">
                Acepto los términos y condiciones del contrato para el uso del certificado digital.
              </label>
            </div>

            
          </form>
        </div>
      </div>
    </div>
  )
}

