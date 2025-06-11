package pucp.edu.pe.sgta.controller;

import java.util.List;
import jakarta.servlet.http.HttpServletRequest;          // ← IMPORT Jakarta
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
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
import java.util.NoSuchElementException;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.http.HttpStatus;

import pucp.edu.pe.sgta.service.inter.IReportService;
import pucp.edu.pe.sgta.service.inter.JwtService;

@RestController
@RequestMapping("/reports")
public class ReportsController {

    private final IReportService reportingService;

    private final JwtService      jwtService;

    @Autowired
    public ReportsController(IReportService reportingService, JwtService jwtService) {
        this.reportingService = reportingService;
        this.jwtService       = jwtService;
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
    public ResponseEntity<List<EntregableEstudianteDto>> getEntregablesAlumnoSeleccionado(
            @PathVariable Integer idUsuario) {
        System.out.println(" Entró al método con ID explícito: " + idUsuario);
        try {
            List<EntregableEstudianteDto> entregables = reportingService.getEntregablesEstudianteById(idUsuario);
            return ResponseEntity.ok(entregables);
        } catch (NoSuchElementException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(null);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(null);
        }
    }



    /** RF9: entregables con criterios de un tesista */
    @GetMapping("/entregables-criterios")
    public ResponseEntity<List<EntregableCriteriosDetalleDto>> getEntregablesConCriterios(
            HttpServletRequest request) {
        String sub = jwtService.extractSubFromRequest(request);
        List<EntregableCriteriosDetalleDto> list =
                reportingService.getEntregablesConCriterios(sub);
        return ResponseEntity.ok(list);
    }
}
