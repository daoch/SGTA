package pucp.edu.pe.sgta.service.imp;

import java.util.Arrays;
import java.util.List;
import java.util.stream.Collectors;

import org.springframework.stereotype.Service;

import pucp.edu.pe.sgta.dto.AdvisorPerformanceDto;
import pucp.edu.pe.sgta.dto.TeacherCountDTO;
import pucp.edu.pe.sgta.dto.TopicAreaStatsDTO;
import pucp.edu.pe.sgta.repository.AdvisorDistributionRepository;
import pucp.edu.pe.sgta.repository.TopicAreaStatsRepository;
import pucp.edu.pe.sgta.service.inter.IReportService;

@Service
public class ReportingServiceImpl implements IReportService {
    
    private final TopicAreaStatsRepository topicAreaStatsRepository;
    private final AdvisorDistributionRepository advisorDistributionRepository;

    public ReportingServiceImpl(TopicAreaStatsRepository topicAreaStatsRepository,
                              AdvisorDistributionRepository advisorDistributionRepository) {
        this.topicAreaStatsRepository = topicAreaStatsRepository;
        this.advisorDistributionRepository = advisorDistributionRepository;
    }

    @Override
    public List<TopicAreaStatsDTO> getTopicAreaStatistics(Integer usuarioId, String cicloNombre) {
        // Ahora se usa la función que filtra por usuario y ciclo
        List<Object[]> results = topicAreaStatsRepository.getTopicAreaStatsByUserAndCiclo(usuarioId, cicloNombre);
        return results.stream()
            .map(result -> new TopicAreaStatsDTO(
                (String) result[0],  // area_name
                ((Number) result[1]).intValue()  // topic_count
            ))
            .collect(Collectors.toList());
    }

    @Override
    public List<TeacherCountDTO> getAdvisorDistribution(Integer usuarioId, String cicloNombre) {
        // Ahora se usa la función que filtra por usuario (coordinador) y ciclo
        List<Object[]> results = advisorDistributionRepository.getAdvisorDistributionByCoordinatorAndCiclo(usuarioId, cicloNombre);
        return results.stream()
            .map(result -> new TeacherCountDTO(
                (String) result[0],  // teacher_name
                ((Number) result[1]).intValue()  // advisor_count
            ))
            .collect(Collectors.toList());
    }

    @Override
    public List<TeacherCountDTO> getJurorDistribution() {
        // Ahora se usa la función que filtra por usuario (coordinador) y ciclo
        List<Object[]> results = advisorDistributionRepository.getJurorDistributionByCoordinatorAndCiclo(usuarioId, cicloNombre);
        return results.stream()
            .map(result -> new TeacherCountDTO(
                (String) result[0],  // teacher_name
                ((Number) result[1]).intValue()  // advisor_count
            ))
            .collect(Collectors.toList());
    }
    //TODO: Agregar metodos para comparativa de Asesor vs Jurado <-- Talves se pueda hacer con los datos mismos anteriores ya guardados.


    //TODO: Agregar desempeño de asesores por cantidad de tesis avanzadas (en progreso) y comparativa con tesistas totales
    @Override
    public List<AdvisorPerformanceDto> getAdvisorPerformance() {
        // TODO: reemplazar con lógica real (cálculo de porcentaje y conteo)
        return Arrays.asList(
            new AdvisorPerformanceDto("Dr. Rodríguez", "Ciencias de la Computación", 78.0, 8),
            new AdvisorPerformanceDto("Dra. Sánchez", "Inteligencia Artificial", 65.0, 6),
            new AdvisorPerformanceDto("Dr. García", "Desarrollo de Software", 72.0, 5),
            new AdvisorPerformanceDto("Dr. López", "Seguridad Informática", 45.0, 4),
            new AdvisorPerformanceDto("Dra. Martínez", "Bases de Datos", 68.0, 4),
            new AdvisorPerformanceDto("Dr. Pérez", "Redes y Comunicaciones", 55.0, 3),
            new AdvisorPerformanceDto("Dra. Gómez", "Computación Gráfica", 82.0, 2)
        );
    }

}
