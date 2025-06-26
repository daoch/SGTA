import axiosInstance from "@/lib/axios/axios-instance";
import type { ExportConfig } from "../components/export-modal";
import { useAuthStore } from "@/features/auth/store/auth-store";
/**
 * Servicio para exportar reportes a Excel usando el backend
 * Este servicio genera archivos Excel con gráficos embebidos
 */
export class ExcelExportBackendService {
  
  /**
   * Exporta reportes a Excel con gráficos embebidos
   * @param ciclo - Ciclo académico (ej: "2025-1")
   * @param config - Configuración de exportación
   */
  static async exportToExcel(ciclo: string, config: ExportConfig): Promise<void> {
    try {
      const { idToken } = useAuthStore.getState();
      // Convertir la configuración al formato esperado por el backend
      const sections = Object.entries(config.sections)
        .filter(([_, v]) => v)
        .map(([k]) => k);

      const backendConfig = {
        sections,
        contentType: config.content,
        fileName: `Reporte_Coordinador_${ciclo}_${new Date().toISOString().split("T")[0]}.xlsx`,
      };

      const response = await axiosInstance.post(
        `/reports/export-excel?ciclo=${ciclo}`,
        backendConfig,
        {
          responseType: "blob", // Importante para archivos binarios
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${idToken}`,
          },
        }
      );

      // Crear blob y descargar
      const blob = new Blob([response.data], {
        type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
      });

      // Crear URL y descargar
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `Reporte_Coordinador_${ciclo}_${new Date().toISOString().split("T")[0]}.xlsx`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);

    } catch (error) {
      console.error("Error al exportar a Excel:", error);
      
      throw new Error("Error al generar el reporte Excel. Por favor, inténtalo de nuevo.");
    }
  }

  /**
   * Verifica si el backend está disponible para exportación con gráficos
   */
  static async checkBackendAvailability(): Promise<boolean> {
    try {
      // Hacer una petición simple para verificar que el endpoint existe
      await axiosInstance.options("/reports/export-excel");
      return true;
    } catch (error) {
      console.warn("Backend de exportación no disponible:", error);
      return false;
    }
  }
} 