package pucp.edu.pe.sgta.service.imp;

import java.util.Arrays;
import java.util.List;

import org.springframework.stereotype.Service;

import pucp.edu.pe.sgta.dto.TeacherCountDTO;
import pucp.edu.pe.sgta.dto.TopicAreaStatsDTO;
import pucp.edu.pe.sgta.service.inter.IReportService;

@Service
public class ReportingServiceImpl implements IReportService {
    
    @Override
    public List<TopicAreaStatsDTO> getTopicAreaStatistics() {
        // TODO: reemplazar este hard-code por llamada al repositorio real
        return Arrays.asList(
            new TopicAreaStatsDTO("Inteligencia Artificial", 15),
            new TopicAreaStatsDTO("Desarrollo Web", 12),
            new TopicAreaStatsDTO("Seguridad Informática", 8),
            new TopicAreaStatsDTO("Bases de Datos", 7),
            new TopicAreaStatsDTO("Redes", 5),
            new TopicAreaStatsDTO("Computación Gráfica", 4),
            new TopicAreaStatsDTO("Sistemas Embebidos", 3)
        );
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
