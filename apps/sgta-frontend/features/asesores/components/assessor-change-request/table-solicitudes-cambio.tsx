import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Calendar, Eye } from "lucide-react";
import Link from "next/link";
import { SolicitudCambioAsesorResumen } from "../../types/cambio-asesor/entidades";

interface Props {
  solicitudes: SolicitudCambioAsesorResumen[];
  formatFecha: (fecha: string | Date) => string;
  getEstadoBadge: (estado: string) => React.ReactNode;
  rutaDetalle: string;
}

export default function TablaSolicitudesCambioAsesor({
  solicitudes,
  formatFecha,
  getEstadoBadge,
  rutaDetalle,
}: Readonly<Props>) {
  console.log("en componente", rutaDetalle);

  return (
    <div className="rounded-lg border border-gray-200 overflow-hidden">
      <Table className="w-full">
        <TableHeader>
          <TableRow className="bg-gray-50">
            <TableHead className="font-semibold text-gray-900">
              Solicitud
            </TableHead>
            <TableHead className="font-semibold text-gray-900">
              Alumno
            </TableHead>
            <TableHead className="font-semibold text-gray-900">Tema</TableHead>
            <TableHead className="font-semibold text-gray-900">
              Asesor Actual
            </TableHead>
            <TableHead className="font-semibold text-gray-900">
              Nuevo asesor
            </TableHead>
            <TableHead className="font-semibold text-gray-900">
              Estado
            </TableHead>
            <TableHead className="font-semibold text-gray-900">
              Acciones
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {solicitudes.map((solicitud) => (
            <TableRow key={solicitud.solicitudId} className="hover:bg-gray-50">
              <TableCell>
                <div className="space-y-1">
                  <div className="font-medium text-gray-900">
                    #{solicitud.solicitudId}
                  </div>
                  <div className="flex items-center text-xs text-gray-500">
                    <Calendar className="w-3 h-3 mr-1" />
                    {formatFecha(solicitud.fechaEnvio)}
                  </div>
                </div>
              </TableCell>
              <TableCell>
                <div className="space-y-1">
                  <div className="font-medium text-gray-900">
                    {solicitud.nombreSolicitante}
                  </div>
                  <div className="text-sm text-gray-500">
                    {solicitud.correoSolicitante}
                  </div>
                </div>
              </TableCell>
              <TableCell>
                <div className="max-w-xs">
                  <div
                    className="font-medium text-gray-900 truncate"
                    title={solicitud.temaTitulo}
                  >
                    {solicitud.temaTitulo}
                  </div>
                </div>
              </TableCell>
              <TableCell>
                <div className="font-medium text-gray-900">
                  {solicitud.nombreAsesorActual}
                </div>
              </TableCell>
              <TableCell>
                <div className="font-medium text-gray-900">
                  {solicitud.nombreAsesorNuevo}
                </div>
              </TableCell>
              <TableCell>{getEstadoBadge(solicitud.estadoGlobal)}</TableCell>
              <TableCell>
                <Link href={`${rutaDetalle}${solicitud.solicitudId}`} passHref>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-8 w-8 p-0 cursor-pointer"
                  >
                    <Eye className="h-4 w-4" />
                  </Button>
                </Link>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
