package pucp.edu.pe.sgta.service.inter;

import java.util.List;

import pucp.edu.pe.sgta.dto.AdvisorPerformanceDto;
import pucp.edu.pe.sgta.dto.AreaFinalDTO;
import pucp.edu.pe.sgta.dto.TeacherCountDTO;
import pucp.edu.pe.sgta.dto.TopicAreaStatsDTO;
import pucp.edu.pe.sgta.dto.TopicTrendDTO;

public interface IReportService {

	/** RF1: estadísticas de temas por área */
	List<TopicAreaStatsDTO> getTopicAreaStatistics(Integer usuarioId, String cicloNombre);

	/** RF2a: distribución de asesores por docente */
	List<TeacherCountDTO> getAdvisorDistribution(Integer usuarioId, String cicloNombre);

	/** RF2b: distribución de jurados por docente */
	List<TeacherCountDTO> getJurorDistribution(Integer usuarioId, String cicloNombre);

	/** RF2c: rendimiento por área de conocimiento */
	List<AreaFinalDTO> getAreaFinal(Integer usuarioId, String cicloNombre);

	/** RF1b: tendencias de temas por año */
	List<TopicTrendDTO> getTopicTrendsByYear(Integer usuarioId);

	/** RF3: desempeño de asesores */
	List<AdvisorPerformanceDto> getAdvisorPerformance(Integer usuarioId, String cicloNombre);

}
