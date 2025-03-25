import {
    Home,
    FileText,
    DollarSign,
    CreditCard,
    Users,
    Package,
    BanknoteIcon as Bank,
    BookOpen,
    PieChart,
    Settings,
    Store,
    ChevronDown
} from "lucide-react"
import { Link, useLocation } from "react-router-dom"
import { useState } from "react"

function SidebarItem({ icon, text, to, subItems }) {
    const location = useLocation()
    const isActive = location.pathname === to
    const [isOpen, setIsOpen] = useState(false)

    return (
        <li>
            {subItems ? (
                <div className="cursor-pointer">
                    <button
                        onClick={() => setIsOpen(!isOpen)}
                        className={`flex items-center justify-between w-full px-4 py-2 rounded-lg ${isActive ? "bg-teal-50 text-teal-600" : "hover:bg-gray-100"}`}
                    >
                        <div className="flex items-center gap-2">
                            {icon}
                            <span>{text}</span>
                        </div>
                        <ChevronDown size={16} className={`${isOpen ? "rotate-180" : ""} transition-transform`} />
                    </button>
                    {isOpen && (
                        <ul className="pl-8 space-y-1 mt-1">
                            {subItems.map((subItem, index) => (
                                <li key={index}>
                                    <Link to={subItem.to} className="flex items-center gap-2 px-4 py-2 rounded-lg hover:bg-gray-100">
                                        {subItem.icon}
                                        <span className="text-[14px] whitespace-nowrap">{subItem.text}</span>
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    )}
                </div>
            ) : (
                <Link
                    to={to}
                    className={`flex items-center gap-2 px-4 py-2 rounded-lg cursor-pointer ${isActive ? "bg-teal-50 text-teal-600" : "hover:bg-gray-100"
                        }`}
                >
                    {icon}
                    <span>{text}</span>
                </Link>
            )}
        </li>
    )
}

export function Sidebar() {
    return (
        <div className="w-64 h-screen bg-white border-r p-4">
            <div className="mb-8">
                <h1 className="text-2xl flex justify-center font-bold text-teal-600">FactuPrime</h1>
            </div>
            <nav>
                <ul className="space-y-2">
                    <SidebarItem icon={<Home size={20} />} text="Inicio" to="/" />
                
                    <SidebarItem icon={<FileText size={16} />} text= "Facturación" to= "/invoices" />
                </ul>
            </nav>
        </div>
    )
}
