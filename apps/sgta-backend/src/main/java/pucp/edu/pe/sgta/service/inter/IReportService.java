package pucp.edu.pe.sgta.service.inter;

import java.util.List;

import pucp.edu.pe.sgta.dto.TeacherCountDTO;
import pucp.edu.pe.sgta.dto.TopicAreaStatsDTO;

public interface IReportService {
    /** RF1: estadísticas de temas por área */
    List<TopicAreaStatsDTO> getTopicAreaStatistics();
    /** RF2a: distribución de asesores por docente */
    List<TeacherCountDTO> getAdvisorDistribution();
    /** RF2b: distribución de jurados por docente */
    List<TeacherCountDTO> getJurorDistribution();

}
