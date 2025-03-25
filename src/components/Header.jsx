import { useState } from "react";
import { Bell, HelpCircle, Search, X } from "lucide-react";
import { useNavigate } from 'react-router-dom';

export function Header() {
    // Dentro de tu componente
    const navigate = useNavigate();
    const [isOpen, setIsOpen] = useState(false);

    const handleLogout = () => {
        // Limpiar todos los almacenamientos
        localStorage.clear();
        sessionStorage.clear();
        
        // Eliminar cookies
        document.cookie.split(";").forEach(cookie => {
          const [name] = cookie.split("=");
          document.cookie = `${name.trim()}=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/`;
        });
      
        // Cerrar modal (si aplica)
        setIsOpen && setIsOpen(false);
        
        // Redireccionar
        navigate("/auth", { replace: true });
      };

    return (
        <>
            <header className="h-16 bg-white border-b px-4 flex items-center justify-between">
                <div className="flex items-center gap-4 flex-1">
                    <div className="relative flex-1 max-w-md">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                        <input
                            type="text"
                            placeholder="Buscar..."
                            className="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                        />
                    </div>
                </div>
                <div className="flex items-center gap-4">
                    <button className="p-2 hover:bg-gray-100 rounded-lg">
                        <HelpCircle size={20} className="text-gray-600" />
                    </button>
                    <button className="p-2 hover:bg-gray-100 rounded-lg">
                        <Bell size={20} className="text-gray-600" />
                    </button>
                    {/* Avatar con onClick para abrir modal */}
                    <div
                        className="w-8 h-8 bg-teal-500 rounded-full cursor-pointer"
                        onClick={() => setIsOpen(true)}
                    ></div>
                </div>
            </header>

            {/* Modal con cierre al hacer clic fuera */}
            {isOpen && (
                <div 
                    className="absolute inset-0 z-50 flex justify-end items-start"
                    onClick={() => setIsOpen(false)} // Cierra al hacer clic fuera
                >
                    <div 
                        className="mt-14 mr-4 bg-white p-4 rounded-lg shadow-lg w-80 border"
                        onClick={(e) => e.stopPropagation()} // Evita que se cierre al hacer clic dentro
                    >
                       
                        <div className="mt-4">
                            <p className="text-gray-700 font-medium">sandbox@factus.com.co</p>
                            <p className="text-sm text-gray-500">Identificación: 901724254-1</p>
                        </div>
                        <div className="mt-4 space-y-2">
                            <button  onClick={handleLogout} className="w-full cursor-pointer text-left px-4 py-2 hover:bg-red-100 text-red-600 rounded-lg">Cerrar sesión</button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}


