package pucp.edu.pe.sgta.controller;

import java.util.List;
import jakarta.servlet.http.HttpServletRequest;          // ← IMPORT Jakarta
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ContentDisposition;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import pucp.edu.pe.sgta.dto.AdvisorPerformanceDto;
import pucp.edu.pe.sgta.dto.AreaFinalDTO;
import pucp.edu.pe.sgta.dto.DetalleTesistaDTO;
import pucp.edu.pe.sgta.dto.HistorialReunionDTO;
import pucp.edu.pe.sgta.dto.HitoCronogramaDTO;
import pucp.edu.pe.sgta.dto.TeacherCountDTO;
import pucp.edu.pe.sgta.dto.TopicAreaStatsDTO;
import pucp.edu.pe.sgta.dto.TopicTrendDTO;
import pucp.edu.pe.sgta.dto.TesistasPorAsesorDTO;
import pucp.edu.pe.sgta.dto.EntregableEstudianteDto;
import pucp.edu.pe.sgta.dto.EntregableCriteriosDetalleDto;
import pucp.edu.pe.sgta.dto.ExcelExportConfigDto;
import java.util.NoSuchElementException;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.http.HttpStatus;

import pucp.edu.pe.sgta.service.inter.IReportService;
import pucp.edu.pe.sgta.service.inter.IExcelExportService;
import pucp.edu.pe.sgta.service.inter.JwtService;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import java.util.Map;
import java.io.ByteArrayOutputStream;
import java.io.IOException;


@RestController
@RequestMapping("/reports")
public class ReportsController {

    private final IReportService reportingService;
    private final IExcelExportService excelExportService;
    private final JwtService      jwtService;
    private static final Logger logger = LoggerFactory.getLogger(ReportsController.class);

    @Autowired
    public ReportsController(IReportService reportingService, IExcelExportService excelExportService, JwtService jwtService) {
        this.reportingService = reportingService;
        this.excelExportService = excelExportService;
        this.jwtService       = jwtService;
    }

    /**
     * Endpoint para exportar reportes a Excel con gráficos embebidos
     */
    @PostMapping("/export-excel")
    public ResponseEntity<byte[]> exportExcelReport(
            @RequestParam String ciclo,
            @RequestBody ExcelExportConfigDto config,
            HttpServletRequest request) {
        
        try {
            String cognitoSub = jwtService.extractSubFromRequest(request);
            

            ByteArrayOutputStream excelFile;
            if ("tables".equals(config.getContentType())) {
                excelFile = excelExportService.generateExcelWithTables(config, cognitoSub, ciclo);
            } else {
                excelFile = excelExportService.generateExcelWithCharts(config, cognitoSub, ciclo);
            }
            
            // Configurar headers para descarga
            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_OCTET_STREAM);
            headers.setContentDisposition(ContentDisposition
                    .attachment()
                    .filename("Reporte_Coordinador_" + ciclo + "_" + java.time.LocalDate.now() + ".xlsx")
                    .build());
            
            logger.info("Reporte Excel generado exitosamente para usuario: {}, ciclo: {}", cognitoSub, ciclo);
            
            return ResponseEntity.ok()
                    .headers(headers)
                    .body(excelFile.toByteArray());
                    
        } catch (IOException e) {
            logger.error("Error al generar reporte Excel para ciclo: " + ciclo, e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        } catch (Exception e) {
            logger.error("Error inesperado al generar reporte Excel", e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    /** RF1: estadísticas de temas por área para un coordinador */
    @GetMapping("/topics-areas")
    public List<TopicAreaStatsDTO> fetchTopicAreaStats(
            @RequestParam String ciclo,
            HttpServletRequest request) {
        String sub = jwtService.extractSubFromRequest(request);
        return reportingService.getTopicAreaStatistics(sub, ciclo);
    }

    /** RF1b: tendencias de temas por año para un coordinador */
    @GetMapping("/topics-trends")
    public List<TopicTrendDTO> fetchTopicTrendsByYear(HttpServletRequest request) {
        String sub = jwtService.extractSubFromRequest(request);
        return reportingService.getTopicTrendsByYear(sub);
    }

    /** RF2a: distribución de asesores por coordinador */
    @GetMapping("/advisors-distribution")
    public List<TeacherCountDTO> fetchAdvisorDistribution(
            @RequestParam String ciclo,
            HttpServletRequest request) {
        String sub = jwtService.extractSubFromRequest(request);
        return reportingService.getAdvisorDistribution(sub, ciclo);
    }

    /** RF2b: distribución de jurados por coordinador */
    @GetMapping("/jurors-distribution")
    public List<TeacherCountDTO> fetchJurorDistribution(
            @RequestParam String ciclo,
            HttpServletRequest request) {
        String sub = jwtService.extractSubFromRequest(request);
        return reportingService.getJurorDistribution(sub, ciclo);
    }

    /** RF2c: estadísticas finales de áreas */
    @GetMapping("/area-final")
    public ResponseEntity<List<AreaFinalDTO>> getAreaFinal(
            @RequestParam String ciclo,
            HttpServletRequest request) {
        String sub = jwtService.extractSubFromRequest(request);
        return ResponseEntity.ok(reportingService.getAreaFinal(sub, ciclo));
    }

    /** RF3: desempeño de asesores */
    @GetMapping("/advisors/performance")
    public List<AdvisorPerformanceDto> getAdvisorPerformance(
            @RequestParam String ciclo,
            HttpServletRequest request) {
        String sub = jwtService.extractSubFromRequest(request);
        return reportingService.getAdvisorPerformance(sub, ciclo);
    }

    
    /** RF4: lista de tesistas por asesor */
    @GetMapping("/advisors/tesistas")
    public ResponseEntity<List<TesistasPorAsesorDTO>> getTesistasPorAsesor(
            HttpServletRequest request) {
        String sub = jwtService.extractSubFromRequest(request);
        return ResponseEntity.ok(reportingService.getTesistasPorAsesor(sub));
    }


    /** RF5: Endpoint para obtener detalle completo de un tesista */
    @GetMapping("/tesistas/detalle")
    public ResponseEntity<DetalleTesistaDTO> getDetalleTesista(@RequestParam Integer tesistaId) {
        DetalleTesistaDTO detalle = reportingService.getDetalleTesista(tesistaId);
        return ResponseEntity.ok(detalle);
    }

    /** RF6: Endpoint para listar hitos del cronograma de un tesista */
    @GetMapping("/tesistas/cronograma")
    public ResponseEntity<List<HitoCronogramaDTO>> getHitosCronogramaTesista(@RequestParam Integer tesistaId) {
        List<HitoCronogramaDTO> hitos = reportingService.getHitosCronogramaTesista(tesistaId);
        return ResponseEntity.ok(hitos);
    }

    /** RF7: Endpoint para listar historial de reuniones de un tesista */
    @GetMapping("/tesistas/reuniones")
    public ResponseEntity<List<HistorialReunionDTO>> getHistorialReuniones(@RequestParam Integer tesistaId) {
        List<HistorialReunionDTO> historial = reportingService.getHistorialReuniones(tesistaId);
        return ResponseEntity.ok(historial);
    }

    /*
    @GetMapping("/entregables")
    public ResponseEntity<List<EntregableEstudianteDto>> getEntregablesEstudiante(
            HttpServletRequest request) {
        String sub = jwtService.extractSubFromRequest(request);
        List<EntregableEstudianteDto> list =
                reportingService.getEntregablesEstudiante(sub);
        return ResponseEntity.ok(list);
    }
    */

   @GetMapping("/entregables")
    public ResponseEntity<List<EntregableEstudianteDto>> getEntregablesEstudiante(HttpServletRequest request) {
        System.out.println(" Entró al método con Cognito ID (sin parámetro)");

        try {
            String idUsuario = jwtService.extractSubFromRequest(request);
            List<EntregableEstudianteDto> entregables = reportingService.getEntregablesEstudiante(idUsuario);
            return ResponseEntity.ok(entregables);
        } catch (NoSuchElementException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(null);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(null);
        }
    }

    @GetMapping("/entregables/{idUsuario}")
    public ResponseEntity<?> getEntregablesAlumnoSeleccionado(@PathVariable Integer idUsuario) {
        logger.info("▶ Entró al método getEntregablesAlumnoSeleccionado con ID explícito: {}", idUsuario);
        try {
        List<EntregableEstudianteDto> entregables =
            reportingService.getEntregablesEstudianteById(idUsuario);
        logger.info("   ✔ Entregables encontrados: {}", entregables.size());
        return ResponseEntity.ok(entregables);

        } catch (NoSuchElementException e) {
        logger.warn("   ⚠ Usuario {} sin tema asignado: {}", idUsuario, e.getMessage());
        return ResponseEntity.status(HttpStatus.NOT_FOUND)
                            .body(Map.of("error", "Usuario sin tema asignado"));

        } catch (Exception e) {
        // **Este log imprimirá la traza completa en tu consola**
        logger.error("   💥 Error inesperado obteniendo entregables para usuario {}: ", idUsuario, e);
        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                            .body(Map.of("error", e.getMessage()));
        }
    }



    /** RF9: entregables con criterios de un tesista*/
    @GetMapping("/entregables-criterios")
    public ResponseEntity<List<EntregableCriteriosDetalleDto>> getEntregablesConCriterios(
           HttpServletRequest request) {
        String idUsuario = jwtService.extractSubFromRequest(request);
        List<EntregableCriteriosDetalleDto> list =
            reportingService.getEntregablesConCriterios(idUsuario);
        return ResponseEntity.ok(list);

    }

    /** RF10: Obtener estado de revisión de entregable */
    @GetMapping("/entregables/estado-revision")
    public ResponseEntity<?> getEstadoRevisionPorEntregableXTema(@RequestParam Integer entregableXTemaId) {
        try {
            return ResponseEntity.ok(reportingService.getEstadoRevisionPorEntregable(entregableXTemaId));
        } catch (NoSuchElementException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                                .body(Map.of("error", "No se encontró revisión para este entregable"));
        } catch (Exception e) {
            logger.error("Error al obtener estado de revisión:", e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                                .body(Map.of("error", "Error interno del servidor"));
        }
    }

}
