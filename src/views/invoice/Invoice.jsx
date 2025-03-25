"use client"

import { useState, useEffect } from "react"
import { PlusIcon, X } from "lucide-react"
import Swal from 'sweetalert2'
import { useNavigate } from "react-router-dom"


export default function Invoice() {
  const navigate = useNavigate()
  // Estados para la factura
  const [items, setItems] = useState([])
  const [total, setTotal] = useState(0)
  const [totalDiscount, setTotalDiscount] = useState(0)
  const [subtotal, setSubtotal] = useState(0)
  const [taxes, setTaxes] = useState(0)
  const [image, setImage] = useState(null)
  const [signature, setSignature] = useState(null)
  const [invoiceNumber, setInvoiceNumber] = useState("Cargando...")
  const [loading, setLoading] = useState(true)
  const [paymentTerm, setPaymentTerm] = useState("1")
  const [departments, setDepartments] = useState([])
  const [municipalities, setMunicipalities] = useState([])
  const [selectedDepartment, setSelectedDepartment] = useState("")
  const [loadingMunicipalities, setLoadingMunicipalities] = useState(false)
  const [measurementUnits, setMeasurementUnits] = useState([])

  // Obtener fecha actual y calcular fecha de vencimiento
  const currentDate = new Date().toISOString().split('T')[0]
  const [dueDate, setDueDate] = useState(currentDate)

  // Datos del formulario
  const [formData, setFormData] = useState({
    numbering_range_id: 8,
    reference_code: "",
    observation: "",
    payment_form: "1",
    payment_method_code: "10",
    payment_due_date: currentDate,
    billing_period: {
      start_date: currentDate,
      start_time: "00:00:00",
      end_date: dueDate,
      end_time: "23:59:59"
    },
    customer: {
      identification: "",
      dv: "",
      company: "",
      trade_name: "",
      names: "",
      address: "",
      email: "",
      phone: "",
      legal_organization_id: "2",
      tribute_id: "21",
      identification_document_id: "3",
      municipality_id: ""
    }
  })

  // Obtener unidades de medida
  useEffect(() => {
    const fetchMeasurementUnits = async () => {
      try {
        const token = localStorage.getItem('access_token')
        const response = await fetch(`${import.meta.env.VITE_APP_BASE_URL}/v1/measurement-units`, {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        })

        if (!response.ok) throw new Error('Error al obtener unidades de medida')

        const data = await response.json()
        setMeasurementUnits(data.data)
      } catch (error) {
        console.error('Error al obtener unidades de medida:', error)
      }
    }

    fetchMeasurementUnits()
  }, [])

  // Obtener departamentos al cargar el componente
  useEffect(() => {
    const fetchDepartments = async () => {
      try {
        const token = localStorage.getItem('access_token')
        const response = await fetch(`${import.meta.env.VITE_APP_BASE_URL}/v1/municipalities`, {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        })

        if (!response.ok) throw new Error('Error al obtener departamentos')

        const data = await response.json()

        // Extraer departamentos únicos
        const departmentsSet = new Set(data.data.map(m => m.department))
        const uniqueDepartments = Array.from(departmentsSet).map(department => ({
          name: department,
          municipalities: data.data.filter(m => m.department === department)
        }))

        setDepartments(uniqueDepartments)
      } catch (error) {
        console.error('Error al obtener departamentos:', error)
      }
    }

    fetchDepartments()
  }, [])

  // Obtener municipios cuando se selecciona un departamento
  useEffect(() => {
    if (selectedDepartment) {
      setLoadingMunicipalities(true)
      const department = departments.find(d => d.name === selectedDepartment)
      if (department) {
        setMunicipalities(department.municipalities)
      }
      setLoadingMunicipalities(false)
    } else {
      setMunicipalities([])
    }
  }, [selectedDepartment, departments])

  // Calcular fecha de vencimiento cuando cambia el plazo
  useEffect(() => {
    const calculateDates = () => {
      const startDate = new Date()
      const endDate = new Date(startDate)
      endDate.setMonth(endDate.getMonth() + parseInt(paymentTerm))

      const newDueDate = endDate.toISOString().split('T')[0]

      setDueDate(newDueDate)
      setFormData(prev => ({
        ...prev,
        payment_due_date: newDueDate,
        billing_period: {
          ...prev.billing_period,
          start_date: startDate.toISOString().split('T')[0],
          end_date: newDueDate
        }
      }))
    }

    calculateDates()
  }, [paymentTerm])

  // Obtener número de facturación
  useEffect(() => {
    const fetchInvoiceNumber = async () => {
      try {
        const token = localStorage.getItem('access_token')
        const response = await fetch(`${import.meta.env.VITE_APP_BASE_URL}/v1/numbering-ranges/8`, {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        })

        if (!response.ok) throw new Error('Error al obtener número')

        const data = await response.json()
        const nextNumber = data.data.current + 1
        setInvoiceNumber(`${data.data.prefix}${nextNumber}`)
        setFormData(prev => ({
          ...prev,
          reference_code: `${data.data.prefix}${nextNumber}`
        }))
      } catch (error) {
        console.error('Error:', error)
        setInvoiceNumber("LTCH-2")
      } finally {
        setLoading(false)
      }
    }

    fetchInvoiceNumber()
  }, [])

  // Calcular totales cuando cambian los items
  useEffect(() => {
    calculateTotals()
  }, [items])

  // Función para calcular totales
  const calculateTotals = () => {
    let newSubtotal = 0
    let newTaxes = 0
    let newTotalDiscount = 0

    items.forEach(item => {
      const price = Number(item.price) || 0
      const quantity = Number(item.quantity) || 0
      const discount = Number(item.discount) || 0
      const taxRate = item.tax === 19 ? 0.19 : 0

      const itemSubtotalBeforeDiscount = price * quantity
      const itemDiscountAmount = itemSubtotalBeforeDiscount * (discount / 100)
      const itemSubtotalAfterDiscount = itemSubtotalBeforeDiscount - itemDiscountAmount
      const itemTax = itemSubtotalAfterDiscount * taxRate

      newSubtotal += itemSubtotalAfterDiscount
      newTaxes += itemTax
      newTotalDiscount += itemDiscountAmount
    })

    setSubtotal(Number(newSubtotal.toFixed(2)))
    setTaxes(Number(newTaxes.toFixed(2)))
    setTotalDiscount(Number(newTotalDiscount.toFixed(2)))
    setTotal(Number((newSubtotal + newTaxes).toFixed(2)))
  }

  // Manejar cambios en items
  const handleItemChange = (index, field, value) => {
    const newItems = [...items]
    newItems[index][field] = value
    setItems(newItems)
  }

  // Añadir nuevo item
  const addItem = () => {
    setItems([
      ...items,
      {
        reference: "",
        price: 0,
        discount: 0,
        tax: 0,
        description: "",
        quantity: 1,
        total: 0,
        unit_measure_id: measurementUnits.length > 0 ? measurementUnits[0].id : 70
      }
    ])
  }

  // Eliminar item
  const removeItem = (index) => {
    const newItems = [...items]
    newItems.splice(index, 1)
    setItems(newItems)
  }

  // Manejar cambios en cliente
  const handleCustomerChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      customer: {
        ...prev.customer,
        [name]: value
      }
    }))
  }

  // Manejar cambio de departamento
  const handleDepartmentChange = (e) => {
    const department = e.target.value
    setSelectedDepartment(department)
    // Resetear municipio cuando cambia el departamento
    setFormData(prev => ({
      ...prev,
      customer: {
        ...prev.customer,
        municipality_id: ""
      }
    }))
  }

  // Manejar cambio de municipio
  const handleMunicipalityChange = (e) => {
    const municipalityId = e.target.value
    setFormData(prev => ({
      ...prev,
      customer: {
        ...prev.customer,
        municipality_id: municipalityId
      }
    }))
  }

  // Construir JSON para la API
  const buildInvoiceJson = () => {
    return {
      ...formData,
      items: items.map(item => ({
        code_reference: item.reference,
        name: item.description,
        quantity: Number(item.quantity),
        discount_rate: Number(item.discount),
        price: Number(item.price),
        tax_rate: item.tax === 19 ? "19.00" : "0.00",
        unit_measure_id: Number(item.unit_measure_id),
        standard_code_id: 1,
        is_excluded: 0,
        tribute_id: 1,
        withholding_taxes: []
      }))
    }
  }

  const submitInvoice = async () => {
    const invoiceData = buildInvoiceJson()

    try {
      const token = localStorage.getItem('access_token')
      const response = await fetch(`${import.meta.env.VITE_APP_BASE_URL}/v1/bills/validate`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(invoiceData)
      })

      const data = await response.json()

      if (!response.ok) {
        if (data.data?.errors) {
          let errorMessage = '<div class="text-left">'
          for (const [field, errors] of Object.entries(data.data.errors)) {
            errorMessage += `<p class="font-semibold">${field}:</p><ul class="list-disc pl-5">`
            errors.forEach(error => {
              errorMessage += `<li>${error}</li>`
            })
            errorMessage += '</ul>'
          }
          errorMessage += '</div>'

          await Swal.fire({
            title: data.message || 'Error de validación',
            html: errorMessage,
            icon: 'error',
            confirmButtonText: 'Entendido',
            confirmButtonColor: '#0d9488',
            scrollbarPadding: false
          })
        } else {
          await Swal.fire({
            title: 'Error',
            text: data.message || 'Ocurrió un error al guardar la factura',
            icon: 'error',
            confirmButtonText: 'Entendido',
            confirmButtonColor: '#0d9488'
          })
        }
        return
      }
      
      await Swal.fire({
        title: '¡Factura creada!',
        text: 'Serás redirigido a la lista de facturas en 3 segundos...',
        icon: 'success',
        confirmButtonText: 'Aceptar',
        confirmButtonColor: '#0d9488',
        timer: 3000,
        timerProgressBar: true,
        willClose: () => {
          navigate('/invoices')
        }
      })

      setTimeout(() => {
        navigate('/invoices')
      }, 3000)

    } catch (error) {
      console.error('Error:', error)
      await Swal.fire({
        title: 'Error',
        text: 'Ocurrió un error inesperado al procesar la factura',
        icon: 'error',
        confirmButtonText: 'Entendido',
        confirmButtonColor: '#0d9488'
      })
    }
  }

  // Manejar imágenes
  const handleImageChange = (e) => {
    const file = e.target.files[0]
    if (file) setImage(URL.createObjectURL(file))
  }

  const handleSignatureChange = (e) => {
    const file = e.target.files[0]
    if (file) setSignature(URL.createObjectURL(file))
  }

  // Renderizado del componente
  return (
    <div className="mx-auto overflow-y-auto h-[700px] p-6 bg-white">
      {/* Header Section */}
      <div className="space-y-4 mb-8">
        <div className="flex justify-between items-center">
          <h1 className="text-xl font-semibold">Nueva factura de venta electrónica</h1>
        </div>
      </div>

      {/* Company Info */}
      <div className="flex justify-between items-start mb-8">
        <div>
          <label htmlFor="file-upload" className="w-52 h-32 border-2 border-dashed border-gray-300 flex items-center justify-center cursor-pointer overflow-hidden rounded-lg">
            {image ? (
              <img src={image} alt="Logo" className="w-full h-full object-cover" />
            ) : (
              <span className="text-gray-500">Utilizar mi logo</span>
            )}
          </label>
          <input
            id="file-upload"
            type="file"
            accept="image/*"
            className="hidden"
            onChange={handleImageChange}
          />
        </div>

        <div className="flex-1 px-8">
          <div className="text-center">
            <h2 className="text-lg font-semibold">FACTUS S.A.S.</h2>
            <p className="text-gray-600">NIT: 901724254-1</p>
            <p className="text-gray-600">FACTUSFACTURACION@GMAIL.COM</p>
          </div>
        </div>

        <div className="w-48">
          <div className="flex items-center gap-2 mb-2">
            <span className="font-semibold">No.</span>
            <span className="text-blue-600">{invoiceNumber}</span>
          </div>
          <div className="mb-2">
            <label className="block text-sm text-gray-600 mb-1">Fecha *</label>
            <input
              type="date"
              className="w-full border rounded px-3 py-2 bg-gray-100"
              value={currentDate}
              disabled
            />
          </div>
          <div>
            <label className="block text-sm text-gray-600 mb-1">Vencimiento *</label>
            <input
              type="date"
              className="w-full border rounded px-3 py-2 bg-gray-100 mb-2"
              value={dueDate}
              disabled
            />
            <label className="block text-sm text-gray-600 mb-1">Seleccione Plazo</label>
            <select
              className="w-full border rounded px-3 py-2"
              value={paymentTerm}
              onChange={(e) => setPaymentTerm(e.target.value)}
            >
              <option value="1">1 mes</option>
              <option value="2">2 meses</option>
              <option value="3">3 meses</option>
            </select>
          </div>
        </div>
      </div>

      {/* Client Info */}
      <div className="grid grid-cols-2 gap-6 mb-8">
        <div className="space-y-4">
          <div>
            <label className="block text-sm text-gray-600 mb-1">Cliente *</label>
            <input
              type="text"
              name="names"
              className="w-full border rounded px-3 py-2"
              placeholder="Nombre completo"
              value={formData.customer.names}
              onChange={handleCustomerChange}
            />
          </div>
          <div>
            <label className="block text-sm text-gray-600 mb-1">Identificación *</label>
            <input
              type="text"
              name="identification"
              className="w-full border rounded px-3 py-2"
              value={formData.customer.identification}
              onChange={handleCustomerChange}
            />
          </div>
          <div>
            <label className="block text-sm text-gray-600 mb-1">Dirección</label>
            <input
              type="text"
              name="address"
              className="w-full border rounded px-3 py-2"
              value={formData.customer.address}
              onChange={handleCustomerChange}
            />
          </div>

          <div>
            <label className="block text-sm text-gray-600 mb-1">País</label>
            <input
              type="text"
              className="w-full border rounded px-3 py-2 bg-gray-100"
              value="Colombia"
              disabled
            />
          </div>

          <div>
            <label className="block text-sm text-gray-600 mb-1">Departamento *</label>
            <select
              className="w-full border rounded px-3 py-2"
              value={selectedDepartment}
              onChange={handleDepartmentChange}
              required
            >
              <option value="">Seleccione un departamento</option>
              {departments.map((dept, index) => (
                <option key={index} value={dept.name}>
                  {dept.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm text-gray-600 mb-1">Municipio/Ciudad *</label>
            <select
              className="w-full border rounded px-3 py-2"
              value={formData.customer.municipality_id}
              onChange={handleMunicipalityChange}
              disabled={!selectedDepartment || loadingMunicipalities}
              required
            >
              <option value="">Seleccione un municipio</option>
              {municipalities.map((mun) => (
                <option key={mun.id} value={mun.id}>
                  {mun.name}
                </option>
              ))}
            </select>
            {loadingMunicipalities && (
              <p className="text-xs text-gray-500 mt-1">Cargando municipios...</p>
            )}
          </div>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-sm text-gray-600 mb-1">Teléfono</label>
            <input
              type="text"
              name="phone"
              className="w-full border rounded px-3 py-2"
              value={formData.customer.phone}
              onChange={handleCustomerChange}
            />
          </div>
          <div>
            <label className="block text-sm text-gray-600 mb-1">Email</label>
            <input
              type="email"
              name="email"
              className="w-full border rounded px-3 py-2"
              value={formData.customer.email}
              onChange={handleCustomerChange}
            />
          </div>
          <div>
            <label className="block text-sm text-gray-600 mb-1">Forma de pago *</label>
            <select
              className="w-full border rounded px-3 py-2"
              value={formData.payment_form}
              onChange={(e) => setFormData(prev => ({ ...prev, payment_form: e.target.value }))}
            >
              <option value="1">Contado</option>
              <option value="2">Crédito</option>
            </select>
          </div>
          <div>
            <label className="block text-sm text-gray-600 mb-1">Medio de pago *</label>
            <select
              className="w-full border rounded px-3 py-2"
              value={formData.payment_method_code}
              onChange={(e) => setFormData(prev => ({ ...prev, payment_method_code: e.target.value }))}
            >
              <option value="10">Efectivo</option>
              <option value="20">Tarjeta débito</option>
              <option value="21">Tarjeta crédito</option>
              <option value="30">Transferencia</option>
            </select>
          </div>
        </div>
      </div>

      {/* Items Table */}
      <div className="mb-8">
        <table className="w-full mb-4">
          <thead>
            <tr className="border-b">
              <th className="text-left py-2">Ítem</th>
              <th className="text-left py-2">Producto</th>
              <th className="text-left py-2">Unidad</th>
              <th className="text-left py-2">Precio</th>
              <th className="text-left py-2">Desc. %</th>
              <th className="text-left py-2">Impuesto</th>
              <th className="text-left py-2">Descripción</th>
              <th className="text-left py-2">Cantidad</th>
              <th className="text-left py-2">Total</th>
              <th className="text-left py-2"></th>
            </tr>
          </thead>
          <tbody>
            {items.map((item, index) => (
              <tr key={index} className="border-b">
                <td className="py-2">{index + 1}</td>
                <td className="py-2">
                  <input
                    type="text"
                    className="border rounded px-2 py-1 w-full"
                    value={item.reference}
                    onChange={(e) => handleItemChange(index, 'reference', e.target.value)}
                  />
                </td>
                <td className="py-2">
                  <select
                    className="border rounded px-2 py-1 w-full"
                    value={item.unit_measure_id}
                    onChange={(e) => handleItemChange(index, 'unit_measure_id', e.target.value)}
                  >
                    {measurementUnits.map(unit => (
                      <option key={unit.id} value={unit.id}>
                        {unit.name}
                      </option>
                    ))}
                  </select>
                </td>
                <td className="py-2">
                  <input
                    type="number"
                    className="border rounded px-2 py-1 w-full"
                    value={item.price}
                    onChange={(e) => handleItemChange(index, 'price', e.target.value)}
                    min="0"
                    step="0.01"
                  />
                </td>
                <td className="py-2">
                  <input
                    type="number"
                    className="border rounded px-2 py-1 w-full"
                    value={item.discount}
                    onChange={(e) => handleItemChange(index, 'discount', e.target.value)}
                    min="0"
                    max="100"
                  />
                </td>
                <td className="py-2">
                  <select
                    className="border rounded px-2 py-1 w-full"
                    value={item.tax}
                    onChange={(e) => handleItemChange(index, 'tax', parseInt(e.target.value))}
                  >
                    <option value={0}>0%</option>
                    <option value={19}>19%</option>
                  </select>
                </td>
                <td className="py-2">
                  <input
                    type="text"
                    className="border rounded px-2 py-1 w-full"
                    value={item.description}
                    onChange={(e) => handleItemChange(index, 'description', e.target.value)}
                  />
                </td>
                <td className="py-2">
                  <input
                    type="number"
                    className="border rounded px-2 py-1 w-full"
                    value={item.quantity}
                    onChange={(e) => handleItemChange(index, 'quantity', e.target.value)}
                    min="1"
                  />
                </td>
                <td className="py-2">
                  ${((item.price * item.quantity * (1 - item.discount / 100)) * (1 + (item.tax === 19 ? 0.19 : 0)).toFixed(2))}
                </td>
                <td className="py-2">
                  <button onClick={() => removeItem(index)} className="text-red-500 hover:text-red-700">
                    <X className="w-4 h-4" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <button
          onClick={addItem}
          className="flex items-center gap-2 text-green-500 hover:text-green-600"
        >
          <PlusIcon className="w-4 h-4" />
          <span>Agregar ítem</span>
        </button>
      </div>

      {/* Totals */}
      <div className="flex justify-end mb-8">
        <div className="w-64 space-y-2">
          <div className="flex justify-between">
            <span>Subtotal Antes de Descuento</span>
            <span>${(subtotal + totalDiscount).toFixed(2)}</span>
          </div>
          <div className="flex justify-between text-red-500">
            <span>Descuentos</span>
            <span>-${totalDiscount.toFixed(2)}</span>
          </div>
          <div className="flex justify-between">
            <span>Subtotal</span>
            <span>${subtotal.toFixed(2)}</span>
          </div>
          <div className="flex justify-between">
            <span>Impuestos</span>
            <span>${taxes.toFixed(2)}</span>
          </div>
          <div className="flex justify-between font-semibold border-t pt-2">
            <span>Total</span>
            <span>${total.toFixed(2)}</span>
          </div>
        </div>
      </div>

      {/* Signature and Terms */}
      <div className="grid grid-cols-2 gap-8 mb-8">
        <div>
          <label htmlFor="signature-upload" className="border-2 border-dashed border-gray-300 h-32 flex items-center justify-center cursor-pointer overflow-hidden rounded-lg">
            {signature ? (
              <img src={signature} alt="Firma" className="w-full h-full object-contain" />
            ) : (
              <span className="text-gray-500">Utilizar mi firma</span>
            )}
          </label>
          <input
            id="signature-upload"
            type="file"
            accept="image/*"
            className="hidden"
            onChange={handleSignatureChange}
          />
        </div>
        <div className="space-y-2">
          <h3 className="font-semibold">Observaciones</h3>
          <textarea
            className="w-full border rounded px-3 py-2 h-32"
            placeholder="Observaciones..."
            value={formData.observation}
            onChange={(e) => setFormData(prev => ({ ...prev, observation: e.target.value }))}
          />
        </div>
      </div>

      {/* Submit Button */}
      <div className="flex justify-end">
        <button
          onClick={submitInvoice}
          className="px-6 py-2 bg-teal-600 text-white rounded-md hover:bg-teal-700 disabled:opacity-50"
          disabled={loading || items.length === 0}
        >
          {loading ? "Cargando..." : "Guardar Factura"}
        </button>
      </div>
    </div>
  )
}