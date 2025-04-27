'use client';

import { useState } from 'react';
import Sidebar from '@/components/layout/Sidebar';
import Header from '@/components/layout/Header'; // Importamos el nuevo componente Header

// Página de ejemplo para mostrar cómo usar el componente Sidebar y Header
export default function Layout({ children }: { children: React.ReactNode }) {
  // En una aplicación real, estos valores vendrían de tu sistema de autenticación
  const userInfo = {
    name: "María Rodríguez",
    roles: ['coordinador', 'asesor', 'estudiante'] as const, // Usuario con múltiples roles
    avatar: 'https://i.pravatar.cc/150?u=P009' // Opcional
  };

  const handleLogout = () => {
    // Implementar lógica de cierre de sesión
    console.log("Cerrando sesión...");
    // auth.signOut() o similar
  };

  return (
    <div className="flex min-h-screen bg-gray-50 dark:bg-gray-900">
      <Sidebar
        userRoles={[...userInfo.roles]}
        userName={userInfo.name}
        userAvatar={userInfo.avatar}
        onLogout={handleLogout}
      />
      
      <div className="flex-1 flex flex-col">
        {/* Agregamos el header en la parte superior */}
        <Header />
        
        {/* Contenido principal de la aplicación */}
        <main className="flex-1 p-6">
          <div className="max-w-7xl mx-auto">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}