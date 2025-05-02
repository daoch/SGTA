package pucp.edu.pe.sgta.service.imp;

import java.util.Arrays;
import java.util.List;
import java.util.stream.Collectors;

import org.springframework.stereotype.Service;

import pucp.edu.pe.sgta.dto.TeacherCountDTO;
import pucp.edu.pe.sgta.dto.TopicAreaStatsDTO;
import pucp.edu.pe.sgta.repository.TopicAreaStatsRepository;
import pucp.edu.pe.sgta.service.inter.IReportService;

@Service
public class ReportingServiceImpl implements IReportService {
    
    private final TopicAreaStatsRepository topicAreaStatsRepository;

    public ReportingServiceImpl(TopicAreaStatsRepository topicAreaStatsRepository) {
        this.topicAreaStatsRepository = topicAreaStatsRepository;
    }

    @Override
    public List<TopicAreaStatsDTO> getTopicAreaStatistics(Integer usuarioId) {
        List<Object[]> results = topicAreaStatsRepository.getTopicAreaStatsByUser(usuarioId);
        return results.stream()
            .map(result -> new TopicAreaStatsDTO(
                (String) result[0],  // area_name
                ((Number) result[1]).intValue()  // topic_count
            ))
            .collect(Collectors.toList());
    }

    @Override
    public List<TeacherCountDTO> getAdvisorDistribution() {
        // TODO: reemplazar hard-code por lógica real
        return Arrays.asList(
            new TeacherCountDTO("Dr. Rodríguez", 8),
            new TeacherCountDTO("Dra. Sánchez", 6),
            new TeacherCountDTO("Dr. García", 5),
            new TeacherCountDTO("Dr. López", 4),
            new TeacherCountDTO("Dra. Martínez", 4),
            new TeacherCountDTO("Dr. Pérez", 3),
            new TeacherCountDTO("Dra. Gómez", 2)
        );
    }

    @Override
    public List<TeacherCountDTO> getJurorDistribution() {
        // TODO: reemplazar hard-code por lógica real
        return Arrays.asList(
            new TeacherCountDTO("Dr. Rodríguez", 5),
            new TeacherCountDTO("Dra. Sánchez", 4),
            new TeacherCountDTO("Dr. García", 4),
            new TeacherCountDTO("Dra. Gómez", 3)
        );
    }
}
