import React from 'react';
import { Badge, Button } from '@heroui/react';
import { Calendar } from 'lucide-react';

interface DashboardHeaderProps {
  userName: string;
  currentCycle: string | number;
}

const DashboardHeader: React.FC<DashboardHeaderProps> = ({ userName, currentCycle }) => {
  const today = new Date().toLocaleDateString('es-ES', { day: 'numeric', month: 'short', year: 'numeric' });
  return (
    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6">
      <div>
        <h1 className="text-2xl md:text-3xl font-bold text-gray-900">Panel de Control</h1>
        <p className="text-muted-foreground">Bienvenido/a de vuelta, {userName}.</p>
      </div>
      <div className="flex items-center gap-2 mt-3 sm:mt-0">
        <Badge variant="flat" color="secondary"> {/* Usar colores/variantes HeroUI */}
          Ciclo Actual: {currentCycle}
        </Badge>
        <Button variant="bordered" size="sm" startContent={<Calendar size={16} />}>
          {today}
        </Button>
      </div>
    </div>
  );
};
export default DashboardHeader;