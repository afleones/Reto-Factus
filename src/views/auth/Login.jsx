import React, { useState } from 'react';
import { useNavigate } from "react-router-dom";
import Swal from 'sweetalert2';
import useSessionTimeout from '../../hooks/useSessionTimeout';
import factusLogo from '../../assets/img/factus.png'; // Sube 2 niveles desde auth/ hasta src/

export default function Login() {
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { setupSessionTimers } = useSessionTimeout(); // Usamos la función del hook

  const [user, setUser] = useState({ 
    email: '', 
    password: '',
    grant_type: 'password'
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUser(prevState => ({ ...prevState, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
  
    try {
      const formData = new FormData();
      formData.append('username', user.email);
      formData.append('password', user.password);
      formData.append('grant_type', 'password');
      formData.append('client_id', import.meta.env.VITE_APP_CLIENT_ID);
      formData.append('client_secret', import.meta.env.VITE_APP_CLIENT_SECRET);
  
      const response = await fetch(`${import.meta.env.VITE_APP_BASE_URL}/oauth/token`, {
        method: 'POST',
        body: formData,
      });
  
      const data = await response.json();
  
      if (!response.ok) {
        throw new Error(data.error_description || 'Error al iniciar sesión');
      }
  
      // Almacenar tokens y tiempo de expiración
      localStorage.setItem('access_token', data.access_token);
      localStorage.setItem('refresh_token', data.refresh_token);
      localStorage.setItem('expires_in', data.expires_in);
      localStorage.setItem('token_timestamp', Math.floor(Date.now() / 1000));
      
      // Configurar temporizadores usando el hook
      setupSessionTimers(data.expires_in);
  
      // Redirigir a /invoices
      navigate("/invoices", { replace: true });
  
    } catch (err) {
      setError(err.message || 'Credenciales incorrectas');
      Swal.fire({
        title: 'Error',
        text: err.message || 'Credenciales incorrectas',
        icon: 'error',
        confirmButtonColor: '#0d9488',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-200 flex">
      {/* Right Section - Login Form */}
      <div className="w-full flex items-center justify-center p-8">
        <div className="w-full max-w-md p-8 space-y-6 bg-white rounded-lg shadow">
          <div className="text-center mb-8">
            <div className="flex justify-center mb-8">
            <img 
      src={factusLogo} 
      alt="Logo Factus" 
      className="h-10 w-auto"
    />
            </div>
            <h1 className="text-2xl font-semibold">Ingresa a tu cuenta</h1>
            <p className="text-gray-500 mt-2">Sigue ganando tiempo y tranquilidad</p>
          </div>

          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative">
              {error}
            </div>
          )}

          <form className="space-y-4" onSubmit={handleSubmit}>
            <div>
              <label htmlFor="email" className="block text-sm text-gray-600 mb-1">
                Correo electrónico
              </label>
              <input
                onChange={handleChange}
                id="email"
                type="email"
                name="email"
                placeholder="Indica tu correo electrónico"
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                required
              />
            </div>

            <div>
              <div className="flex justify-between items-center mb-1">
                <label htmlFor="password" className="block text-sm text-gray-600">
                  Contraseña
                </label>
                <a href="#" className="text-sm text-teal-600 hover:text-teal-500">
                  ¿Olvidaste tu contraseña?
                </a>
              </div>
              <div className="relative">
                <input
                  onChange={handleChange}
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Escribe tu contraseña"
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500"
                >
                  {showPassword ? (
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                      />
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                      />
                    </svg>
                  ) : (
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21"
                      />
                    </svg>
                  )}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-2 px-4 bg-teal-500 hover:bg-teal-600 text-white font-semibold rounded-md transition duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Ingresando...' : 'Ingresar'}
            </button>

            <div className="relative my-6">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-200"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white text-gray-500">o</span>
              </div>
            </div>
          </form>

          <div className="text-center text-sm text-gray-500 mt-4">
            Ingresa con las mismas credenciales a todos los productos de FactuPrime
          </div>
        </div>
      </div>
    </div>
  )
}