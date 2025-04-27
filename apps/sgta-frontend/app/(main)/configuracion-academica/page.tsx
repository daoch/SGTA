'use client'
import React from 'react';
import Link from 'next/link';
import { 
  Calendar, 
  ClipboardList, 
  CalendarCheck, 
  CheckCheck, 
  Tags, 
  SlidersHorizontal, 
  ArrowRight, 
  Info
} from 'lucide-react';
import { Card, CardHeader, CardBody, Button, Tooltip } from "@heroui/react";

// Componente para las tarjetas de navegación
interface HubNavigationCardProps {
  title: string;
  description: string;
  icon: React.ReactNode;
  href: string;
  accentColor: string;
}

const HubNavigationCard: React.FC<HubNavigationCardProps> = ({ 
  title, 
  description, 
  icon, 
  href,
  accentColor
}) => {
  const bgColorClass = `bg-${accentColor}-50`;
  const textColorClass = `text-${accentColor}-600`;
  const borderColorClass = `border-${accentColor}-100`;
  const hoverBgColorClass = `group-hover:bg-${accentColor}-100`;
  const ringColorClass = `ring-${accentColor}-200`;

  return (
    <Card className="border border-gray-200 rounded-xl shadow-sm hover:shadow-md transition-all duration-300 h-full group overflow-hidden">
      <div className={`absolute top-0 left-0 w-1.5 h-full ${bgColorClass} group-hover:w-2 transition-all duration-300`}></div>
      <CardHeader className="flex items-start gap-4 pb-2 pt-5 px-5">
        <div className={`p-3 rounded-full ${bgColorClass} ${textColorClass} ring-1 ${ringColorClass} ${hoverBgColorClass} transition-colors duration-300`}>
          {icon}
        </div>
        <div>
          <h3 className="text-xl font-semibold text-gray-900">{title}</h3>
        </div>
      </CardHeader>
      <CardBody className="px-5 pb-5 pt-0">
        <p className="text-sm text-gray-600 mb-4 min-h-[3rem]">
          {description}
        </p>
        <Link href={href} className="block">
          <Button 
            color="primary" 
            variant="flat" 
            className="w-full justify-between font-medium"
            endContent={<ArrowRight size={18} />}
          >
            Gestionar
          </Button>
        </Link>
      </CardBody>
    </Card>
  );
};

const ConfiguracionAcademicaPage = () => {
  // Datos para las tarjetas de navegación
  const navigationCards = [
    {
      title: "Cronograma por Curso y Ciclo",
      description: "Defina la estructura de hitos y entregables para los cursos PFC 1 y PFC 2. Publique el cronograma para hacerlo oficial en cada ciclo académico.",
      icon: <ClipboardList size={24} />,
      href: "/configuracion-academica/cronograma",
      accentColor: "indigo"
    },
    {
      title: "Fechas Clave por Ciclo",
      description: "Establezca las fechas límite específicas para los hitos clave (inscripción, entregas, defensas) del proceso PFC en cada ciclo académico activo o próximo.",
      icon: <CalendarCheck size={24} />,
      href: "/configuracion-academica/fechas-ciclo",
      accentColor: "blue"
    },
    {
      title: "Flujos de Aprobación",
      description: "Defina qué roles (Comité, Coordinador) deben aprobar la inscripción o modificación de temas, según el tipo de propuesta, carrera u otros criterios.",
      icon: <CheckCheck size={24} />,
      href: "/configuracion-academica/flujos-aprobacion",
      accentColor: "green"
    },
    {
      title: "Áreas Temáticas",
      description: "Administre el catálogo de áreas temáticas de la especialidad. Cree, edite o elimine áreas utilizadas para clasificar temas y asesores.",
      icon: <Tags size={24} />,
      href: "/configuracion-academica/areas-tematicas",
      accentColor: "amber"
    },
    {
      title: "Parámetros del Proceso PFC",
      description: "Ajuste parámetros específicos del proceso: umbral de ciclos para reactivación, límites de carga de asesoría, configuración de notificaciones, etc.",
      icon: <SlidersHorizontal size={24} />,
      href: "/configuracion-academica/parametros-proceso",
      accentColor: "purple"
    }
  ];

  return (
    <div className="bg-gray-50 min-h-screen">
      <div className="container mx-auto py-8 px-4 sm:px-6 lg:px-8 max-w-7xl">
        {/* Header */}
        <div className="mb-8">
          <div className="flex flex-col sm:flex-row items-start justify-between gap-4 mb-6">
            <div>
              <h1 className="text-3xl font-bold tracking-tight text-gray-900 mb-2">
                Configuración Académica
              </h1>
              <p className="text-gray-500 max-w-3xl">
                Configure los parámetros académicos que definen el proceso de Proyecto Final de Carrera (PFC) para su especialidad.
              </p>
            </div>
            <Tooltip content="Las configuraciones realizadas aquí afectan a todos los estudiantes y profesores del proceso PFC">
              <Button isIconOnly variant="light" className="text-blue-600 flex-shrink-0">
                <Info className="h-5 w-5" />
              </Button>
            </Tooltip>
          </div>
          
          {/* Tarjeta informativa */}
          <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 mb-6">
            <div className="flex items-start gap-3">
              <div className="p-2 rounded-full bg-blue-100 text-blue-600">
                <Info size={20} />
              </div>
              <div>
                <h3 className="text-sm font-semibold text-blue-800 mb-1">Importante sobre la Configuración Académica</h3>
                <p className="text-sm text-blue-700">
                  Todas las configuraciones que realice en esta sección requieren ser completadas antes del inicio de cada ciclo académico. 
                  Algunas modificaciones pueden impactar en procesos en curso, por lo que se recomienda revisar cuidadosamente antes de aplicar cambios.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Grid de tarjetas de navegación */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {navigationCards.map((card, index) => (
            <HubNavigationCard
              key={index}
              title={card.title}
              description={card.description}
              icon={card.icon}
              href={card.href}
              accentColor={card.accentColor}
            />
          ))}
        </div>

        {/* Footer informativo */}
        <div className="mt-8 bg-white rounded-xl shadow-sm border border-gray-200 p-5">
          <h3 className="text-lg font-semibold text-gray-800 mb-3">Acerca de la Configuración Académica</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-600">
            <div className="space-y-2">
              <p className="flex items-start gap-2">
                <ClipboardList className="h-5 w-5 text-indigo-500 flex-shrink-0 mt-0.5" />
                <span>Los <strong>Cronogramas</strong> definen la estructura de entregables y evaluaciones para PFC 1 y PFC 2.</span>
              </p>
              <p className="flex items-start gap-2">
                <CalendarCheck className="h-5 w-5 text-blue-500 flex-shrink-0 mt-0.5" />
                <span>Las <strong>Fechas Clave</strong> establecen los plazos precisos para cada ciclo académico activo.</span>
              </p>
            </div>
            <div className="space-y-2">
              <p className="flex items-start gap-2">
                <CheckCheck className="h-5 w-5 text-green-500 flex-shrink-0 mt-0.5" />
                <span>Los <strong>Flujos de Aprobación</strong> determinan cómo se validan y aprueban las solicitudes de los tesistas.</span>
              </p>
              <p className="flex items-start gap-2">
                <Tags className="h-5 w-5 text-amber-500 flex-shrink-0 mt-0.5" />
                <span>Las <strong>Áreas Temáticas</strong> organizan las especialidades y expertises de la facultad.</span>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ConfiguracionAcademicaPage;