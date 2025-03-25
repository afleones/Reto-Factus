import React from 'react';
import { Header } from '../Header';
import { Sidebar } from '../Sidebar';
import useSessionTimeout from '../../hooks/useSessionTimeout';

const Layout = ({ children }) => {
  // Usar el hook de timeout de sesión
  useSessionTimeout();

  return (
    <div className="min-h-screen flex bg-gray-100">
      {/* Sidebar fijo */}
      <div className="fixed inset-y-0 left-0 z-10 w-64">
        <Sidebar/>
      </div>
      
      {/* Contenido principal con espacio para el sidebar */}
      <div className="flex-1 ml-64 min-w-0">
        <div className="sticky top-0 z-10 bg-white shadow-sm">
          <Header />
        </div>
        
        {/* Área de contenido con scroll y padding */}
        <main className="p-6 overflow-auto">
          {children}
        </main>
      </div>
    </div>
  );
};

export default Layout;