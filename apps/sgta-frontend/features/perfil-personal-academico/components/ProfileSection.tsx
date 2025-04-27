// src/features/academic-staff-profile/components/ProfileSection.tsx
import React from 'react';
import { Card, CardHeader, CardBody } from '@heroui/react'; // Asumiendo Card de HeroUI

interface ProfileSectionProps {
  title: string;
  icon?: React.ElementType; // Icono opcional para el título
  children: React.ReactNode;
  className?: string; // Clases adicionales para el Card
}

const ProfileSection: React.FC<ProfileSectionProps> = ({ title, icon: Icon, children, className }) => {
  return (
    <Card className={`shadow-sm border ${className}`}>
      <CardHeader className="border-b pb-2">
        <h2 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
          {Icon && <Icon size={18} className="text-primary" />} 
          {title}
        </h2>
      </CardHeader>
      <CardBody className="p-4 md:p-5 text-sm text-gray-700">
        {children}
      </CardBody>
    </Card>
  );
};
export default ProfileSection;