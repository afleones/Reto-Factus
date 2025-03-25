import { X, FileText, CheckCircle, Package, Users } from "lucide-react"
import {
    XmlIcon,
    PdfIcon
} from "../views/invoice/Icons";
import { Link } from 'react-router-dom';

function StepItem({ icon, title, action, status }) {
    return (
        <div className="text-center">
            <div className="flex justify-center mb-2">{icon}</div>
            <h3 className="text-sm font-medium mb-1">{title}</h3>
            {action && <button className="text-teal-500 text-sm hover:underline">{action}</button>}
            {status && <span className="text-teal-500 text-sm">{status}</span>}
        </div>
    )
}

export function WelcomeCard() {
    return (
        <div className="bg-white/25 shadow-md shadow-[rgba(31,38,135,0.37)] backdrop-blur-md border border-white/20 rounded-xl p-6 mb-8">
            <div className="flex justify-between items-start mb-4">
                <div className="text-center">
                    <h2 className="text-xl font-semibold mb-2">Te damos la bienvenida al reto Factus,</h2>
                    <p className="text-gray-600">Para comenzar te recomendamos estos pasos</p>
                </div>
            </div>

            <div className="grid grid-cols-5 gap-4">
            <Link to="/invoices/invoice">
  <StepItem 
    icon={<FileText className="w-8 h-8" />} 
    title="Ve a Facturación electrónica" 
    action="Comenzar"
  />
</Link>
                <StepItem
                    icon={<CheckCircle className="w-8 h-8 text-teal-500" />}
                    title="Crea tu primera factura"
                />
                <StepItem
                    icon={<PdfIcon className="w-8 h-8 text-teal-500" />}
                    title="Visualiza el pdf de tu factura"
                />
                <StepItem icon={<XmlIcon className="w-8 h-8" />} title="Descarga el xml" />
                <StepItem icon={<PdfIcon className="w-8 h-8" />} title="Descarga el pdf" />
            </div>
        </div>
    )
}

