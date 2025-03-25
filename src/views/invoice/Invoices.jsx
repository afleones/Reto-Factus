"use client"

import { useState, useEffect } from "react"
import { Link } from "react-router-dom"
import Swal from 'sweetalert2'
import { useNavigate } from "react-router-dom"
import { Document, Page } from 'react-pdf'
import { pdfjs } from 'react-pdf'

import {
  ClockIcon,
  SearchIcon,
  ChevronDownIcon,
  SendIcon,
  FileTextIcon,
  DownloadIcon,
  EyeIcon,
  FileIcon,
  XIcon,
  CheckIcon,
  XmlIcon,
  PdfIcon
} from "./Icons"

// Configura el worker de PDF.js
pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.min.js`

// Componente para mostrar el modal con los detalles de la factura
function InvoiceDetailModal({ invoice, onClose }) {
  if (!invoice) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center border-b p-4">
          <h2 className="text-xl font-semibold">Detalles de Factura</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <XIcon className="w-6 h-6" />
          </button>
        </div>

        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            <div>
              <h3 className="font-medium text-gray-900 mb-2">Información General</h3>
              <div className="space-y-2">
                <p><span className="font-medium">Número:</span> {invoice.number}</p>
                <p><span className="font-medium">Referencia:</span> {invoice.reference_code || 'N/A'}</p>
                <p><span className="font-medium">Fecha creación:</span> {new Date(invoice.created_at).toLocaleString()}</p>
                <p><span className="font-medium">Estado:</span>
                  <span className={`ml-2 px-2 py-1 text-xs font-medium rounded-full ${invoice.status === 1 ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                    }`}>
                    {invoice.status === 1 ? 'Enviada' : 'Sin Enviar'}
                  </span>
                </p>
              </div>
            </div>

            <div>
              <h3 className="font-medium text-gray-900 mb-2">Información de Pago</h3>
              <div className="space-y-2">
                <p><span className="font-medium">Forma de pago:</span> {invoice.payment_form?.name || 'N/A'}</p>
                <p><span className="font-medium">Total:</span> {new Intl.NumberFormat('es-CO', {
                  style: 'currency',
                  currency: 'COP',
                  minimumFractionDigits: 0
                }).format(parseFloat(invoice.total))}</p>
              </div>
            </div>
          </div>

          <div className="mb-8">
            <h3 className="font-medium text-gray-900 mb-2">Cliente</h3>
            <div className="space-y-2">
              <p><span className="font-medium">Nombre:</span> {invoice.names || invoice.api_client_name || 'N/A'}</p>
              <p><span className="font-medium">Identificación:</span> {invoice.identification || 'N/A'}</p>
              <p><span className="font-medium">Email:</span> {invoice.email || 'N/A'}</p>
            </div>
          </div>

          {invoice.errors && invoice.errors.length > 0 && (
            <div className="mb-8">
              <h3 className="font-medium text-red-600 mb-2">Errores</h3>
              <ul className="list-disc pl-5 space-y-1">
                {invoice.errors.map((error, index) => (
                  <li key={index} className="text-red-600">{error}</li>
                ))}
              </ul>
            </div>
          )}
        </div>

        <div className="border-t p-4 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200"
          >
            Cerrar
          </button>
        </div>
      </div>
    </div>
  )
}

// Función para descargar archivos desde base64
const downloadFromBase64 = (base64Data, fileName, mimeType) => {
  const link = document.createElement('a')
  link.href = `data:${mimeType};base64,${base64Data}`
  link.download = fileName
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
}

// Función para obtener facturas
const fetchInvoices = async (page = 1, setInvoices, setPagination, setCounts) => {
  try {
    const token = localStorage.getItem('access_token');
    const response = await fetch(
      `${import.meta.env.VITE_APP_BASE_URL}/v1/bills?page=${page}`,
      {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      }
    );

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || 'Error al obtener facturas');
    }

    const invoices = data.data.data;
    const paginationData = data.data.pagination;

    // Calcular conteos (solo si es la primera página o si quieres mantener un total acumulado)
    if (page === 1) {
      const allInvoicesResponse = await fetch(
        `${import.meta.env.VITE_APP_BASE_URL}/v1/bills?all=true`,
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );
      
      const allInvoicesData = await allInvoicesResponse.json();
      
      if (allInvoicesResponse.ok) {
        const allInvoices = allInvoicesData.data.data || allInvoicesData.data;
        const sent = allInvoices.filter(i => i.status === 1).length;
        const pending = allInvoices.filter(i => i.status !== 1).length;
        
        setCounts({
          sent,
          pending,
          total: paginationData.total
        });
      }
    }

    setInvoices(invoices);
    setPagination(paginationData);

  } catch (error) {
    console.error('Error:', error);
    Swal.fire({
      title: 'Error',
      text: error.message || 'Error al cargar facturas',
      icon: 'error',
      confirmButtonColor: '#0d9488'
    });
  }
};

// Función para descargar PDF
const downloadPdf = async (number) => {
  try {
    const token = localStorage.getItem('access_token')
    const response = await fetch(`${import.meta.env.VITE_APP_BASE_URL}/v1/bills/download-pdf/${number}`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`
      }
    })

    const data = await response.json()

    if (!response.ok) {
      throw new Error(data.message || 'Error al descargar PDF')
    }

    downloadFromBase64(data.data.pdf_base_64_encoded, `${number}.pdf`, 'application/pdf')

    await Swal.fire({
      title: 'Descarga exitosa',
      text: 'El PDF se ha descargado correctamente',
      icon: 'success',
      confirmButtonText: 'Aceptar',
      confirmButtonColor: '#0d9488'
    })

  } catch (error) {
    console.error('Error:', error)
    await Swal.fire({
      title: 'Error',
      text: error.message || 'Ocurrió un error al descargar el PDF',
      icon: 'error',
      confirmButtonText: 'Entendido',
      confirmButtonColor: '#0d9488'
    })
  }
}

// Función para descargar XML
const downloadXml = async (number) => {
  try {
    const token = localStorage.getItem('access_token')
    const response = await fetch(`${import.meta.env.VITE_APP_BASE_URL}/v1/bills/download-xml/${number}`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`
      }
    })

    const data = await response.json()

    if (!response.ok) {
      throw new Error(data.message || 'Error al descargar XML')
    }

    downloadFromBase64(data.data.xml_base_64_encoded, `${number}.xml`, 'application/xml')

    await Swal.fire({
      title: 'Descarga exitosa',
      text: 'El XML se ha descargado correctamente',
      icon: 'success',
      confirmButtonText: 'Aceptar',
      confirmButtonColor: '#0d9488'
    })

  } catch (error) {
    console.error('Error:', error)
    await Swal.fire({
      title: 'Error',
      text: error.message || 'Ocurrió un error al descargar el XML',
      icon: 'error',
      confirmButtonText: 'Entendido',
      confirmButtonColor: '#0d9488'
    })
  }
}

// Función para ver detalles de factura
const fetchInvoiceDetail = async (number, setDetailInvoice) => {
  try {
    const token = localStorage.getItem('access_token')
    const response = await fetch(`${import.meta.env.VITE_APP_BASE_URL}/v1/bills/show/${number}`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`
      }
    })

    const data = await response.json()

    if (!response.ok) {
      throw new Error(data.message || 'Error al obtener detalles de factura')
    }

    setDetailInvoice(data.data)

  } catch (error) {
    console.error('Error:', error)
    await Swal.fire({
      title: 'Error',
      text: error.message || 'Ocurrió un error al obtener los detalles',
      icon: 'error',
      confirmButtonText: 'Entendido',
      confirmButtonColor: '#0d9488'
    })
  }
}

export default function Invoices() {
  const navigate = useNavigate()

  const [searchTerm, setSearchTerm] = useState("")
  const [selectedItems, setSelectedItems] = useState([])
  const [invoices, setInvoices] = useState([])
  const [pagination, setPagination] = useState({
    total: 0,
    per_page: 10,
    current_page: 1,
    last_page: 1
  })
  const [loading, setLoading] = useState(true)
  const [detailInvoice, setDetailInvoice] = useState(null)
  const [showDetailModal, setShowDetailModal] = useState(false)

  // Estados para el visor de PDF
  const [showPdfModal, setShowPdfModal] = useState(false)
  const [pdfBase64, setPdfBase64] = useState("")
  const [invoiceNumber, setInvoiceNumber] = useState("")
  const [error, setError] = useState("")

  const [counts, setCounts] = useState({
    sent: 0,
    pending: 0,
    total: 0
  })

  // Estado para el filtro seleccionado
const [filterBy, setFilterBy] = useState('all'); // 'all' buscará en todos los campos
const [allInvoices, setAllInvoices] = useState([]); // Almacena TODOS los registros
const [displayedInvoices, setDisplayedInvoices] = useState([]); // Datos a mostrar (paginados)



  useEffect(() => {
    fetchInvoices(
      pagination.current_page, 
      setInvoices, 
      setPagination,
      setCounts
    ).finally(() => setLoading(false))
  }, [pagination.current_page])

  const handlePageChange = (page) => {
    if (page >= 1 && page <= pagination.last_page) {
      setLoading(true)
      setPagination(prev => ({ ...prev, current_page: page }))
      
      const tableElement = document.getElementById('invoices-table')
      if (tableElement) {
        tableElement.scrollIntoView({ behavior: 'smooth' })
      }
    }
  }

  const formatCurrency = (value) => {
    return new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP',
      minimumFractionDigits: 0
    }).format(value)
  }

  const formatDate = (dateString) => {
    if (!dateString) return 'Fecha no disponible';
    
    // Convertir "24-03-2025 05:16:46 PM" a formato que Date pueda entender
    const [datePart, timePart, ampm] = dateString.split(' ');
    const [day, month, year] = datePart.split('-');
    const [hours, minutes, seconds] = timePart.split(':');
    
    // Convertir a formato ISO 8601
    const isoDate = `${year}-${month}-${day}T${ampm === 'PM' 
      ? String(Number(hours) + 12) 
      : hours}:${minutes}:${seconds}`;
    
    const date = new Date(isoDate);
    
    const options = {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    };
    
    return isNaN(date.getTime()) 
      ? 'Fecha inválida' 
      : date.toLocaleDateString('es-CO', options);
  };

// Función de filtrado mejorada
const filteredInvoices = invoices.filter(invoice => {
  const searchTermLower = searchTerm.toLowerCase();
  
  // Si no hay término de búsqueda, mostrar todos
  if (!searchTerm) return true;
  
  // Búsqueda según el campo seleccionado
  switch (filterBy) {
    case 'number':
      return invoice.number.toLowerCase().includes(searchTermLower);
    case 'client':
      return (
        (invoice.names && invoice.names.toLowerCase().includes(searchTermLower)) ||
        (invoice.api_client_name && invoice.api_client_name.toLowerCase().includes(searchTermLower))
      );
    case 'identification':
      return invoice.identification && invoice.identification.toLowerCase().includes(searchTermLower);
    case 'email':
      return invoice.email && invoice.email.toLowerCase().includes(searchTermLower);
    case 'reference':
      return invoice.reference_code && invoice.reference_code.toLowerCase().includes(searchTermLower);
    case 'date':
      return formatDate(invoice.created_at).toLowerCase().includes(searchTermLower);
    default: // 'all' - buscar en todos los campos
      return (
        invoice.number.toLowerCase().includes(searchTermLower) ||
        (invoice.names && invoice.names.toLowerCase().includes(searchTermLower)) ||
        (invoice.api_client_name && invoice.api_client_name.toLowerCase().includes(searchTermLower)) ||
        (invoice.identification && invoice.identification.toLowerCase().includes(searchTermLower)) ||
        (invoice.email && invoice.email.toLowerCase().includes(searchTermLower)) ||
        (invoice.reference_code && invoice.reference_code.toLowerCase().includes(searchTermLower)) ||
        formatDate(invoice.created_at).toLowerCase().includes(searchTermLower)
      );
  }
});

const verFacturaPDF = async (number) => {
  let timerInterval;
  
  try {
    // Mostrar SweetAlert de carga
    Swal.fire({
      title: 'Cargando factura',
      html: 'Por favor espere mientras se carga el documento...',
      timerProgressBar: true,
      didOpen: () => {
        Swal.showLoading();
        timerInterval = setInterval(() => {
          const content = Swal.getHtmlContainer();
          if (content) {
            const b = content.querySelector('b');
            if (b) {
              b.textContent = Swal.getTimerLeft();
            }
          }
        }, 100);
      },
      willClose: () => {
        clearInterval(timerInterval);
      }
    });

    setError("");
    const token = localStorage.getItem('access_token');
    const response = await fetch(
      `${import.meta.env.VITE_APP_BASE_URL}/v1/bills/download-pdf/${number}`,
      { headers: { Authorization: `Bearer ${token}` } }
    );

    const result = await response.json();
    
    if (!response.ok) throw new Error(result.message || "Error al obtener PDF");
    if (!result.data.pdf_base_64_encoded) throw new Error("PDF vacío");

    setPdfBase64(result.data.pdf_base_64_encoded);
    setInvoiceNumber(number);
    
    // Cerrar SweetAlert y mostrar modal
    Swal.close();
    setShowPdfModal(true);
    
  } catch (err) {
    console.error("Error:", err);
    setError(err.message || "No se pudo cargar el PDF");
    
    // Cerrar SweetAlert de carga y mostrar error
    Swal.fire({
      icon: 'error',
      title: 'Error',
      text: err.message || "Error al cargar PDF",
      confirmButtonColor: '#0d9488'
    });
    
  } finally {
    setLoading(false);
    clearInterval(timerInterval);
  }
};
  const closePdfModal = () => {
    setShowPdfModal(false)
    setPdfBase64("")
  }

  return (
    <div className="flex flex-col h-full">
      {/* Header y filtros */}
      <div className="mb-6 space-y-4">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold text-gray-800">Facturas de venta</h1>
          <div className="flex gap-2">
            <Link to="/invoices/invoice" className="px-4 py-2 text-white bg-teal-600 rounded-md hover:bg-teal-700">
              + Nueva factura
            </Link>
          </div>
        </div>
  
        <p className="text-gray-600">
          Crea y gestiona facturas detalladas para tus transacciones comerciales.
        </p>
      </div>
  
      {/* Status Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="bg-white p-4 rounded-lg shadow-sm">
          <div className="flex items-center gap-2 mb-2">
            <FileTextIcon className="w-5 h-5 text-gray-400" />
            <span className="text-sm text-gray-600">Sin emisión</span>
          </div>
          <span className="text-2xl font-semibold">{counts.pending}</span>
        </div>
  
        <div className="bg-white p-4 rounded-lg shadow-sm">
          <div className="flex items-center gap-2 mb-2">
            <SendIcon className="w-5 h-5 text-gray-400" />
            <span className="text-sm text-gray-600">enviadas</span>
          </div>
          <span className="text-2xl font-semibold">{counts.sent}</span>
        </div>
  
        <div className="bg-white p-4 rounded-lg shadow-sm">
          <div className="flex items-center gap-2 mb-2">
            <ClockIcon className="w-5 h-5 text-gray-400" />
            <span className="text-sm text-gray-600">Total Facturas</span>
          </div>
          <span className="text-2xl font-semibold">{counts.total}</span>
        </div>
      </div>
  
      {/* Search and Filter */}
      <div className="flex gap-4 mb-6">
  <div className="relative flex-1">
    <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
    <input
      type="text"
      placeholder="Buscar por número, cliente, identificación o referencia"
      className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500"
      value={searchTerm}
      onChange={(e) => setSearchTerm(e.target.value)}
    />
  </div>
  
  {/* Menú desplegable para seleccionar el tipo de filtro */}
  <div className="relative">
    <button 
      className="px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 flex items-center gap-2"
      onClick={() => document.getElementById('filter-dropdown').classList.toggle('hidden')}
    >
      Filtrar por
      <ChevronDownIcon className="w-4 h-4" />
    </button>
    
    {/* Menú desplegable */}
    <div 
      id="filter-dropdown" 
      className="hidden absolute right-0 mt-2 w-56 bg-white rounded-md shadow-lg z-10 border border-gray-200"
    >
      <div className="py-1">
        <button 
          onClick={() => {
            setFilterBy('all');
            document.getElementById('filter-dropdown').classList.add('hidden');
          }}
          className={`block w-full text-left px-4 py-2 text-sm ${filterBy === 'all' ? 'bg-teal-50 text-teal-700' : 'text-gray-700 hover:bg-gray-100'}`}
        >
          Todos los campos
        </button>
        <button 
          onClick={() => {
            setFilterBy('number');
            document.getElementById('filter-dropdown').classList.add('hidden');
          }}
          className={`block w-full text-left px-4 py-2 text-sm ${filterBy === 'number' ? 'bg-teal-50 text-teal-700' : 'text-gray-700 hover:bg-gray-100'}`}
        >
          Número de factura
        </button>
        <button 
          onClick={() => {
            setFilterBy('client');
            document.getElementById('filter-dropdown').classList.add('hidden');
          }}
          className={`block w-full text-left px-4 py-2 text-sm ${filterBy === 'client' ? 'bg-teal-50 text-teal-700' : 'text-gray-700 hover:bg-gray-100'}`}
        >
          Nombre del cliente
        </button>
        <button 
          onClick={() => {
            setFilterBy('identification');
            document.getElementById('filter-dropdown').classList.add('hidden');
          }}
          className={`block w-full text-left px-4 py-2 text-sm ${filterBy === 'identification' ? 'bg-teal-50 text-teal-700' : 'text-gray-700 hover:bg-gray-100'}`}
        >
          Documento/NIT
        </button>
        <button 
          onClick={() => {
            setFilterBy('email');
            document.getElementById('filter-dropdown').classList.add('hidden');
          }}
          className={`block w-full text-left px-4 py-2 text-sm ${filterBy === 'email' ? 'bg-teal-50 text-teal-700' : 'text-gray-700 hover:bg-gray-100'}`}
        >
          Correo electrónico
        </button>
        <button 
          onClick={() => {
            setFilterBy('reference');
            document.getElementById('filter-dropdown').classList.add('hidden');
          }}
          className={`block w-full text-left px-4 py-2 text-sm ${filterBy === 'reference' ? 'bg-teal-50 text-teal-700' : 'text-gray-700 hover:bg-gray-100'}`}
        >
          Referencia
        </button>
        <button 
          onClick={() => {
            setFilterBy('date');
            document.getElementById('filter-dropdown').classList.add('hidden');
          }}
          className={`block w-full text-left px-4 py-2 text-sm ${filterBy === 'date' ? 'bg-teal-50 text-teal-700' : 'text-gray-700 hover:bg-gray-100'}`}
        >
          Fecha de creación
        </button>
      </div>
    </div>
  </div>
</div>
  
      {/* Table Container */}
      <div className="flex-1 overflow-hidden">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 h-full flex flex-col">
          {loading ? (
            <div className="p-6 text-center flex-1 flex items-center justify-center">
              <p>Cargando facturas...</p>
            </div>
          ) : (
            <>
              <div className="overflow-x-auto flex-1">
                <table className="min-w-full divide-y divide-gray-200" id="invoices-table">
                  <thead className="bg-gray-50 sticky top-0">
                    <tr>
                      <th className="w-12 px-4 py-3">
                        <input
                          type="checkbox"
                          className="w-4 h-4 rounded border-gray-300"
                        />
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap">Número</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap">Cliente</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap">Creación</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap">Total</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap">Estado</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap">Acciones</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {filteredInvoices.length > 0 ? (
                      filteredInvoices.map((invoice) => (
                        <tr key={invoice.id} className="hover:bg-gray-50">
                          <td className="px-4 py-4 whitespace-nowrap">
                            <input
                              type="checkbox"
                              className="w-4 h-4 rounded border-gray-300"
                              checked={selectedItems.includes(invoice.id)}
                              onChange={(e) => {
                                if (e.target.checked) {
                                  setSelectedItems([...selectedItems, invoice.id])
                                } else {
                                  setSelectedItems(selectedItems.filter((id) => id !== invoice.id))
                                }
                              }}
                            />
                          </td>
                          <td className="px-4 py-4 whitespace-nowrap">
                            <div className="font-medium text-gray-900">{invoice.number}</div>
                            {invoice.reference_code && (
                              <div className="text-xs text-gray-500">Ref: {invoice.reference_code}</div>
                            )}
                          </td>
                          <td className="px-4 py-4">
                            <div className="font-medium text-gray-900">{invoice.names || invoice.api_client_name}</div>
                            {invoice.identification && (
                              <div className="text-xs text-gray-500">identification: {invoice.identification}</div>
                            )}
                            {invoice.email && (
                              <div className="text-xs text-gray-500">email: {invoice.email}</div>
                            )}
                          </td>
                          <td className="px-4 py-4 whitespace-nowrap text-gray-500">
                          {formatDate(invoice.created_at)}  {/* formatDate(invoice.created_at) */}
                          </td>
                          <td className="px-4 py-4 whitespace-nowrap text-gray-500">
                            {formatCurrency(parseFloat(invoice.total))}
                          </td>
                          <td className="px-4 py-4 whitespace-nowrap">
                            <span className={`px-2 py-1 text-xs font-medium rounded-full ${invoice.status === 1
                                ? 'text-green-700 bg-green-100'
                                : 'text-red-700 bg-red-100'
                              }`}>
                              {invoice.status === 1 ? 'Enviado' : 'Sin Enviar'}
                            </span>
                            {invoice.errors && invoice.errors.length > 0 && (
                              <div className="text-xs text-red-500 mt-1">Con errores</div>
                            )}
                          </td>
                          <td className="px-4 py-4 whitespace-nowrap text-right text-sm font-medium">
                            <div className="flex items-center justify-end space-x-2">
                              <button
                                onClick={() => downloadXml(invoice.number)}
                                className="text-gray-500 hover:text-teal-600 p-1 rounded-full hover:bg-gray-100"
                                title="Descargar XML"
                              >
                                <XmlIcon className="w-5 h-5" />
                              </button>
                              <button
                                onClick={() => downloadPdf(invoice.number)}
                                className="text-gray-500 hover:text-teal-600 p-1 rounded-full hover:bg-gray-100"
                                title="Descargar PDF"
                              >
                                <PdfIcon className="w-5 h-5" />
                              </button>
                              <button
                                onClick={() => verFacturaPDF(invoice.number)}
                                className="text-gray-500 hover:text-teal-600 p-1 rounded-full hover:bg-gray-100"
                                title="Ver factura"
                              >
                                <EyeIcon className="w-5 h-5" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan="7" className="px-6 py-4 text-center text-gray-500">
                          No se encontraron facturas
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
  
              {/* Pagination */}
              {pagination.total > 0 && (
                <div className="bg-white px-6 py-3 border-t border-gray-200">
                  <div className="flex-1 flex justify-between sm:hidden">
                    <button
                      onClick={() => handlePageChange(pagination.current_page - 1)}
                      disabled={pagination.current_page === 1}
                      className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
                    >
                      Anterior
                    </button>
                    <button
                      onClick={() => handlePageChange(pagination.current_page + 1)}
                      disabled={pagination.current_page === pagination.last_page}
                      className="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
                    >
                      Siguiente
                    </button>
                  </div>
                  <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
                    <div>
                      <p className="text-sm text-gray-700">
                        Mostrando <span className="font-medium">{pagination.from}</span> a <span className="font-medium">{pagination.to}</span> de{' '}
                        <span className="font-medium">{pagination.total}</span> resultados
                      </p>
                    </div>
                    <div>
                      <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
                        <button
                          onClick={() => handlePageChange(1)}
                          disabled={pagination.current_page === 1}
                          className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50"
                        >
                          <span className="sr-only">Primera</span>
                          &laquo;
                        </button>
                        <button
                          onClick={() => handlePageChange(pagination.current_page - 1)}
                          disabled={pagination.current_page === 1}
                          className="relative inline-flex items-center px-2 py-2 border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50"
                        >
                          <span className="sr-only">Anterior</span>
                          &lsaquo;
                        </button>
  
                        {Array.from({ length: Math.min(5, pagination.last_page) }, (_, i) => {
                          let pageNum
                          if (pagination.last_page <= 5) {
                            pageNum = i + 1
                          } else if (pagination.current_page <= 3) {
                            pageNum = i + 1
                          } else if (pagination.current_page >= pagination.last_page - 2) {
                            pageNum = pagination.last_page - 4 + i
                          } else {
                            pageNum = pagination.current_page - 2 + i
                          }
  
                          return (
                            <button
                              key={pageNum}
                              onClick={() => handlePageChange(pageNum)}
                              className={`relative inline-flex items-center px-4 py-2 border text-sm font-medium ${pagination.current_page === pageNum
                                  ? 'z-10 bg-teal-50 border-teal-500 text-teal-600'
                                  : 'bg-white border-gray-300 text-gray-500 hover:bg-gray-50'
                                }`}
                            >
                              {pageNum}
                            </button>
                          )
                        })}
  
                        <button
                          onClick={() => handlePageChange(pagination.current_page + 1)}
                          disabled={pagination.current_page === pagination.last_page}
                          className="relative inline-flex items-center px-2 py-2 border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50"
                        >
                          <span className="sr-only">Siguiente</span>
                          &rsaquo;
                        </button>
                        <button
                          onClick={() => handlePageChange(pagination.last_page)}
                          disabled={pagination.current_page === pagination.last_page}
                          className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50"
                        >
                          <span className="sr-only">Última</span>
                          &raquo;
                        </button>
                      </nav>
                    </div>
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </div>
      {/* PDF Modal */}
      {showPdfModal && (
        <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg w-full max-w-6xl h-[90vh] flex flex-col">
            <div className="flex justify-between items-center p-4 border-b">
              <h3 className="text-lg font-semibold">
                Factura: {invoiceNumber}
              </h3>
              <div className="flex space-x-2">
                <button
                  onClick={() => downloadPdf(invoiceNumber)}
                  className="flex items-center px-3 py-1 bg-gray-200 rounded hover:bg-gray-300"
                >
                  <DownloadIcon className="w-4 h-4 mr-1" />
                  Descargar
                </button>
                <button
                  onClick={closePdfModal}
                  className="text-gray-500 hover:text-gray-700 p-1 rounded-full hover:bg-gray-100"
                >
                  <XIcon className="w-6 h-6" />
                </button>
              </div>
            </div>
            <div className="flex-1 overflow-hidden">
              {error ? (
                <div className="flex flex-col items-center justify-center h-full p-4">
                  <p className="text-red-500 mb-4">{error}</p>
                  <button
                    onClick={() => downloadPdf(invoiceNumber)}
                    className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                  >
                    Descargar PDF
                  </button>
                </div>
              ) : (
                <iframe
                  src={`data:application/pdf;base64,${pdfBase64}#toolbar=0&navpanes=0`}
                  className="w-full h-full"
                  title={`Factura ${invoiceNumber}`}
                />
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}