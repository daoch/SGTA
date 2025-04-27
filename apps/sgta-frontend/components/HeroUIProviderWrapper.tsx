'use client'
import React, { ReactNode } from 'react';
import { HeroUIProvider } from '@heroui/react'; // Asegúrate de importar desde el paquete correcto

interface HeroUIProviderWrapperProps {
  children: ReactNode;
}

/**
 * Componente que encapsula el HeroUIProvider para la configuración global
 * de HeroUI en toda la aplicación.
 */
const HeroUIProviderWrapper: React.FC<HeroUIProviderWrapperProps> = ({ children }) => {
  return (
    <HeroUIProvider>
      {children}
    </HeroUIProvider>
  );
};

export default HeroUIProviderWrapper;