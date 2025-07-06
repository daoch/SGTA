package pucp.edu.pe.sgta.service.inter;

import pucp.edu.pe.sgta.dto.ExcelExportConfigDto;
import java.io.ByteArrayOutputStream;

/**
 * Interfaz para el servicio de exportación de Excel
 */
public interface IExcelExportService {
    
    /**
     * Genera un archivo Excel con datos y gráficos embebidos
     * 
     * @param config Configuración de la exportación
     * @return ByteArrayOutputStream con el contenido del archivo Excel
     * @throws Exception Si ocurre un error durante la generación
     */
    ByteArrayOutputStream generateExcelWithCharts(ExcelExportConfigDto config, String cognitoSub, String ciclo) throws Exception;
    
    /**
     * Genera un archivo Excel solo con datos tabulares
     * 
     * @param config Configuración de la exportación
     * @return ByteArrayOutputStream con el contenido del archivo Excel
     * @throws Exception Si ocurre un error durante la generación
     */
    ByteArrayOutputStream generateExcelWithTables(ExcelExportConfigDto config, String cognitoSub, String ciclo) throws Exception;
} 