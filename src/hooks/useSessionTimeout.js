// hooks/useSessionTimeout.js
import { useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';

const useSessionTimeout = () => {
  const navigate = useNavigate();

  const renewSession = useCallback(async () => {
    try {
      const refreshToken = localStorage.getItem('refresh_token');
      if (!refreshToken) throw new Error('No hay refresh token disponible');

      const formData = new FormData();
      formData.append('grant_type', 'refresh_token');
      formData.append('client_id', import.meta.env.VITE_APP_CLIENT_ID);
      formData.append('client_secret', import.meta.env.VITE_APP_CLIENT_SECRET);
      formData.append('refresh_token', refreshToken);

      const response = await fetch(`${import.meta.env.VITE_APP_BASE_URL}/oauth/token`, {
        method: 'POST',
        body: formData,
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error_description || 'Error al renovar sesión');
      }

      // Actualizar tokens
      localStorage.setItem('access_token', data.access_token);
      localStorage.setItem('refresh_token', data.refresh_token);
      localStorage.setItem('expires_in', data.expires_in);
      localStorage.setItem('token_timestamp', Math.floor(Date.now() / 1000));

      return true;
    } catch (error) {
      console.error('Error al renovar sesión:', error);
      return false;
    }
  }, []);

  const handleLogout = useCallback(() => {
    localStorage.clear();
    Swal.fire({
      title: 'Sesión expirada',
      text: 'Tu sesión ha caducado. Por favor inicia sesión nuevamente.',
      icon: 'warning',
      confirmButtonColor: '#0d9488',
    }).then(() => {
      navigate('/login');
    });
  }, [navigate]);

  const setupSessionTimers = useCallback((expiresIn) => {
    // Limpiar temporizadores existentes
    const timerData = localStorage.getItem('session_timers');
    if (timerData) {
      const { warningTimer, expirationTimer } = JSON.parse(timerData);
      clearTimeout(warningTimer);
      clearTimeout(expirationTimer);
    }

    // Configurar nuevo temporizador de advertencia
    const warningTime = (expiresIn - 60) * 1000;
    let warningTimer;
    
    if (warningTime > 0) {
      warningTimer = setTimeout(async () => {
        const { isConfirmed } = await Swal.fire({
          title: 'Sesión por expirar',
          text: 'Tu sesión expirará en 1 minuto. ¿Deseas extenderla?',
          icon: 'warning',
          showCancelButton: true,
          confirmButtonColor: '#0d9488',
          cancelButtonColor: '#d33',
          confirmButtonText: 'Extender sesión',
          cancelButtonText: 'Cerrar sesión',
          timer: 60000,
          timerProgressBar: true
        });

        if (isConfirmed) {
          const success = await renewSession();
          if (success) {
            await Swal.fire({
              title: 'Sesión renovada',
              text: 'Tu sesión ha sido extendida exitosamente',
              icon: 'success',
              confirmButtonColor: '#0d9488',
            });
          } else {
            handleLogout();
          }
        } else {
          handleLogout();
        }
      }, warningTime);
    }

    // Configurar temporizador de expiración
    const expirationTimer = setTimeout(() => {
      handleLogout();
    }, expiresIn * 1000);

    // Guardar referencias de temporizadores
    localStorage.setItem('session_timers', JSON.stringify({
      warningTimer,
      expirationTimer
    }));
  }, [renewSession, handleLogout]);

  // Verificación periódica
  useEffect(() => {
    const checkSession = () => {
      const expiresIn = localStorage.getItem('expires_in');
      const loginTime = localStorage.getItem('token_timestamp');
      
      if (!expiresIn || !loginTime) return;

      const currentTime = Math.floor(Date.now() / 1000);
      if (currentTime - parseInt(loginTime) > parseInt(expiresIn)) {
        handleLogout();
      }
    };

    const interval = setInterval(checkSession, 5000);
    return () => clearInterval(interval);
  }, [handleLogout]);

  return { setupSessionTimers, renewSession, handleLogout };
};

export default useSessionTimeout;