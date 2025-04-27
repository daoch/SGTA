'use client';

import { useState } from 'react';
import { Bell } from 'lucide-react';

// Componente Header con menú de notificaciones
const Header = () => {
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  
  // Datos de ejemplo para las notificaciones
  const notifications = [
    {
      id: 1,
      title: 'Nueva tarea asignada',
      message: 'Se te ha asignado la tarea "Completar informe trimestral"',
      time: '10 min',
      read: false
    },
    {
      id: 2,
      title: 'Recordatorio de reunión',
      message: 'Reunión de equipo mañana a las 10:00 AM',
      time: '1 hora',
      read: false
    },
    {
      id: 3,
      title: 'Comentario en documento',
      message: 'María ha comentado en tu documento "Proyecto Fase 2"',
      time: '3 horas',
      read: true
    },
    {
      id: 4,
      title: 'Actualización del sistema',
      message: 'El sistema se actualizará esta noche a las 2:00 AM',
      time: '5 horas',
      read: true
    }
  ];

  const unreadCount = notifications.filter(n => !n.read).length;

  const toggleNotifications = () => {
    setIsNotificationsOpen(!isNotificationsOpen);
  };

  return (
    <header className="bg-white dark:bg-gray-800 shadow-sm h-16 flex items-center px-6">
      <div className="flex-1">
        {/* <h1 className="text-xl font-semibold text-gray-800 dark:text-white">Dashboard</h1> */}
      </div>
      
      <div className="flex items-center space-x-4">
        {/* Botón de notificaciones */}
        <div className="relative">
          <button 
            onClick={toggleNotifications}
            className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 focus:outline-none"
            aria-label="Notificaciones"
          >
            <Bell className="h-6 w-6 text-gray-600 dark:text-gray-300" />
            {unreadCount > 0 && (
              <span className="absolute top-0 right-0 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs">
                {unreadCount}
              </span>
            )}
          </button>
          
          {/* Menú desplegable de notificaciones */}
          {isNotificationsOpen && (
            <div className="absolute right-0 mt-2 w-80 bg-white dark:bg-gray-800 rounded-md shadow-lg py-1 z-50 border border-gray-200 dark:border-gray-700">
              <div className="px-4 py-2 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center">
                <h3 className="font-medium text-gray-800 dark:text-white">Notificaciones</h3>
                {unreadCount > 0 && (
                  <span className="text-sm text-blue-600 dark:text-blue-400 hover:underline cursor-pointer">
                    Marcar todas como leídas
                  </span>
                )}
              </div>
              
              <div className="max-h-96 overflow-y-auto">
                {notifications.length > 0 ? (
                  notifications.map(notification => (
                    <div 
                      key={notification.id} 
                      className={`px-4 py-3 hover:bg-gray-50 dark:hover:bg-gray-700 border-b border-gray-100 dark:border-gray-700 ${!notification.read ? 'bg-blue-50 dark:bg-blue-900/20' : ''}`}
                    >
                      <div className="flex justify-between">
                        <p className="font-medium text-sm text-gray-800 dark:text-white">{notification.title}</p>
                        <span className="text-xs text-gray-500 dark:text-gray-400">{notification.time}</span>
                      </div>
                      <p className="text-sm text-gray-600 dark:text-gray-300 mt-1">{notification.message}</p>
                    </div>
                  ))
                ) : (
                  <div className="px-4 py-6 text-center text-gray-500 dark:text-gray-400">
                    No tienes notificaciones
                  </div>
                )}
              </div>
              
              <div className="px-4 py-2 border-t border-gray-200 dark:border-gray-700 text-center">
                <button className="text-sm text-blue-600 dark:text-blue-400 hover:underline">
                  Ver todas las notificaciones
                </button>
              </div>
            </div>
          )}
        </div>
        
        {/* Otros elementos del header pueden ir aquí */}
        <div className="h-8 w-8 rounded-full bg-gray-200 dark:bg-gray-700"></div>
      </div>
    </header>
  );
};

export default Header;