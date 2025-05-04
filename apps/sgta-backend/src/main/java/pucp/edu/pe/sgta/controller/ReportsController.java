package pucp.edu.pe.sgta.controller;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import pucp.edu.pe.sgta.dto.AdvisorPerformanceDto;
import pucp.edu.pe.sgta.dto.AreaFinalDTO;
import pucp.edu.pe.sgta.dto.TeacherCountDTO;
import pucp.edu.pe.sgta.dto.TopicAreaStatsDTO;
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

    /**
     * RF2B: Endpoint para desempeño de asesores.
     */
    @GetMapping("/advisors/performance")
    public List<AdvisorPerformanceDto> getAdvisorPerformance() {
        return reportingService.getAdvisorPerformance();
    }

}