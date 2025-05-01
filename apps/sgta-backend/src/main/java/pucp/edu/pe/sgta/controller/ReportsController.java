package pucp.edu.pe.sgta.controller;

import java.util.List;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

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
    public List<TopicAreaStatsDTO> fetchTopicAreaStats() {
        return reportingService.getTopicAreaStatistics();
    }

    /** RF2a: distribución de asesores por docente */
    @GetMapping("/advisors-distribution")
    public List<TeacherCountDTO> fetchAdvisorDistribution() {
        return reportingService.getAdvisorDistribution();
    }

    /** RF2b: distribución de jurados por docente */
    @GetMapping("/jurors-distribution")
    public List<TeacherCountDTO> fetchJurorDistribution() {
        return reportingService.getJurorDistribution();
    }
}