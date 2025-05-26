package pucp.edu.pe.sgta.controller;

import java.util.List;

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
import pucp.edu.pe.sgta.service.inter.IReportService;

@RestController
@RequestMapping("/api/v1/reports")
public class ReportsController {

    private final IReportService reportingService;

    public ReportsController(IReportService reportingService) {
        this.reportingService = reportingService;
    }

    /** RF1: estadísticas y tendencias de temas y áreas */
    @GetMapping("/topics-areas")
    public List<TopicAreaStatsDTO> fetchTopicAreaStats(@RequestParam Integer usuarioId,@RequestParam String ciclo) {
        return reportingService.getTopicAreaStatistics(usuarioId,ciclo);
    }

    /** RF1b: tendencias de temas por año */
    @GetMapping("/topics-trends")
    public List<TopicTrendDTO> fetchTopicTrendsByYear(@RequestParam Integer usuarioId) {
        return reportingService.getTopicTrendsByYear(usuarioId);
    }

    /** RF2a: distribución de asesores por docente */
    @GetMapping("/advisors-distribution")
    public List<TeacherCountDTO> fetchAdvisorDistribution(@RequestParam Integer usuarioId,@RequestParam String ciclo) {
        return reportingService.getAdvisorDistribution(usuarioId,ciclo);
    }

    /** RF2b: distribución de jurados por docente */
    @GetMapping("/jurors-distribution")
    public List<TeacherCountDTO> fetchJurorDistribution(@RequestParam Integer usuarioId,@RequestParam String ciclo) {
        return reportingService.getJurorDistribution(usuarioId,ciclo);
    }
    
    @GetMapping("/area-final")
    public ResponseEntity<List<AreaFinalDTO>> getAreaFinal(@RequestParam Integer usuarioId, @RequestParam String ciclo) {
        return ResponseEntity.ok(reportingService.getAreaFinal(usuarioId, ciclo));
    }

    /** RF3: Endpoint para desempeño de asesores */
    @GetMapping("/advisors/performance")
    public List<AdvisorPerformanceDto> getAdvisorPerformance(@RequestParam Integer usuarioId, @RequestParam String ciclo) {
        return reportingService.getAdvisorPerformance(usuarioId, ciclo);
    }

    /** RF4: Endpoint para listar tesistas por asesor */
    @GetMapping("/advisors/tesistas")
    public ResponseEntity<List<TesistasPorAsesorDTO>> getTesistasPorAsesor(@RequestParam Integer asesorId) {
        return ResponseEntity.ok(reportingService.getTesistasPorAsesor(asesorId));
    }

    /** RF5: Endpoint para obtener detalle completo de un tesista */
    @GetMapping("/tesistas/detalle")
    public ResponseEntity<DetalleTesistaDTO> getDetalleTesista(@RequestParam Integer tesistaId) {
        DetalleTesistaDTO detalle = reportingService.getDetalleTesista(tesistaId);
        if (detalle == null) {
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok(detalle);
    }

    /** RF6: Endpoint para listar hitos del cronograma de un tesista */
    @GetMapping("/tesistas/cronograma")
    public ResponseEntity<List<HitoCronogramaDTO>> getHitosCronogramaTesista(@RequestParam Integer tesistaId) {
        List<HitoCronogramaDTO> hitos = reportingService.getHitosCronogramaTesista(tesistaId);
        if (hitos.isEmpty()) {
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok(hitos);
    }

    /** RF7: Endpoint para listar historial de reuniones de un tesista */
    @GetMapping("/tesistas/reuniones")
    public ResponseEntity<List<HistorialReunionDTO>> getHistorialReuniones(@RequestParam Integer tesistaId) {
        List<HistorialReunionDTO> historial = reportingService.getHistorialReuniones(tesistaId);
        if (historial.isEmpty()) {
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok(historial);
    }
}