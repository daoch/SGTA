package pucp.edu.pe.sgta.service.inter;

import java.util.List;
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

/**
 * Interfaz para servicios de reportes.
 */
public interface IReportService {

    /**
     * Estadísticas de temas por área para un coordinador.
     * @param cognitoSub el sub (ID) del usuario en Cognito
     * @param cicloNombre nombre del ciclo
     */
    List<TopicAreaStatsDTO> getTopicAreaStatistics(String cognitoSub, String cicloNombre);

    /**
     * Distribución de asesores para un coordinador.
     */
    List<TeacherCountDTO> getAdvisorDistribution(String cognitoSub, String cicloNombre);

    /**
     * Distribución de jurados para un coordinador.
     */
    List<TeacherCountDTO> getJurorDistribution(String cognitoSub, String cicloNombre);

    /**
     * Estadísticas finales de áreas para un coordinador.
     */
    List<AreaFinalDTO> getAreaFinal(String cognitoSub, String cicloNombre);

    /**
     * Desempeño de asesores para un coordinador.
     */
    List<AdvisorPerformanceDto> getAdvisorPerformance(String cognitoSub, String cicloNombre);

    /**
     * Tendencias de temas por año para un coordinador.
     */
    List<TopicTrendDTO> getTopicTrendsByYear(String cognitoSub);

    /**
     * Tesistas asignados por asesor.
     */
    List<TesistasPorAsesorDTO> getTesistasPorAsesor(String cognitoSub);

    /**
     * Detalle completo de un tesista.
     */
    DetalleTesistaDTO getDetalleTesista(Integer tesistaId);

    /**
     * Hitos del cronograma de un tesista.
     */
    List<HitoCronogramaDTO> getHitosCronogramaTesista(Integer tesistaId);

    /**
     * Historial de reuniones de un tesista.
     */
    List<HistorialReunionDTO> getHistorialReuniones(Integer tesistaId);

    /**
     * Entregables de un estudiante (tesista).
     * @param cognitoSub el sub (ID) del usuario en Cognito
     */

    List<EntregableEstudianteDto> getEntregablesEstudiante(String usuarioId);
    List<EntregableEstudianteDto> getEntregablesEstudianteById(int usuarioId);


    /**
     * Entregables con criterios de un estudiante.
     */
    List<EntregableCriteriosDetalleDto> getEntregablesConCriterios(Integer idUsuario);

}

