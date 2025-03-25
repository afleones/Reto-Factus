"use client"

import { useState } from "react"

export default function Numeraciones() {
  const [formNumber, setFormNumber] = useState("")
  const [showModal, setShowModal] = useState(false)
  const [selectedNumbering, setSelectedNumbering] = useState(null)

  const mockDianData = [
    {
      prefix: "LTCH",
      fromNumber: "1",
      toNumber: "100",
      validFrom: "2023-01-27",
      validTo: "2027-01-27",
    },
  ]

  const handleConsult = (e) => {
    e.preventDefault()
    if (formNumber.trim()) {
      setShowModal(true)
    }
  }

  const handleSelect = (numbering) => {
    setSelectedNumbering(numbering)
    setShowModal(false)
  }

  return (
    <div className="h-[300px] overflow-auto bg-gray-50 p-6">
      {/* Header */}
     

      {/* Main Form */}
      {!selectedNumbering ? (
        <div className="bg-white rounded-lg shadow-sm p-6 max-w-2xl">
          <form onSubmit={handleConsult}>
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Número de formulario <span className="text-red-500">*</span>
              </label>
              <div className="flex gap-4">
                <input
                  type="text"
                  value={formNumber}
                  onChange={(e) => setFormNumber(e.target.value)}
                  className="flex-1 rounded-md border border-gray-300 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-teal-500"
                  placeholder="18764087804091"
                />
                <button
                  type="submit"
                  className="px-4 py-2 bg-teal-600 text-white rounded-md hover:bg-teal-700 transition-colors"
                >
                  Consultar
                </button>
              </div>
              <div className="mt-2">
                <img
                  src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/1-oKkKX0BTSP4VU67nDthZN8ES2TkJhl.png"
                  alt="Ejemplo de número de formulario"
                  className="max-w-[200px]"
                />
                <p className="text-sm text-gray-500 mt-1">Número de formulario</p>
              </div>
            </div>
          </form>
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow-sm p-6 max-w-2xl">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Prefijo de la numeración <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={selectedNumbering.prefix}
                disabled
                className="w-full rounded-md border border-gray-300 px-4 py-2 bg-gray-50"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Vigencia desde <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={selectedNumbering.validFrom}
                disabled
                className="w-full rounded-md border border-gray-300 px-4 py-2 bg-gray-50"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Vigencia hasta <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={selectedNumbering.validTo}
                disabled
                className="w-full rounded-md border border-gray-300 px-4 py-2 bg-gray-50"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Próxima factura electrónica <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                defaultValue="1"
                className="w-full rounded-md border border-gray-300 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-teal-500"
              />
            </div>
          </div>
        </div>
      )}

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg max-w-2xl w-full">
            <div className="p-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-lg font-semibold">Tus numeraciones en la DIAN</h2>
                <button onClick={() => setShowModal(false)} className="text-gray-400 hover:text-gray-500">
                  ×
                </button>
              </div>
              <p className="text-sm text-gray-600 mb-4">
                Selecciona la numeración que vas a usar para emitir facturas electrónicas en Alegra.
              </p>
              <div className="overflow-x-auto">
                <table className="min-w-full">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left py-3 px-4 text-xs font-medium text-gray-500 uppercase">Prefijo</th>
                      <th className="text-left py-3 px-4 text-xs font-medium text-gray-500 uppercase">
                        Desde el número
                      </th>
                      <th className="text-left py-3 px-4 text-xs font-medium text-gray-500 uppercase">
                        Hasta el número
                      </th>
                      <th className="text-left py-3 px-4 text-xs font-medium text-gray-500 uppercase">
                        Vigencia desde
                      </th>
                      <th className="text-left py-3 px-4 text-xs font-medium text-gray-500 uppercase">
                        Vigencia hasta
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {mockDianData.map((numbering, index) => (
                      <tr
                        key={index}
                        className="hover:bg-gray-50 cursor-pointer"
                        onClick={() => handleSelect(numbering)}
                      >
                        <td className="py-3 px-4">{numbering.prefix}</td>
                        <td className="py-3 px-4">{numbering.fromNumber}</td>
                        <td className="py-3 px-4">{numbering.toNumber}</td>
                        <td className="py-3 px-4">{numbering.validFrom}</td>
                        <td className="py-3 px-4">{numbering.validTo}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <div className="flex justify-end gap-4 mt-6">
                <button
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50"
                >
                  Cancelar
                </button>
                <button
                  onClick={() => handleSelect(mockDianData[0])}
                  className="px-4 py-2 bg-teal-600 text-white rounded-md hover:bg-teal-700"
                >
                  Seleccionar
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

