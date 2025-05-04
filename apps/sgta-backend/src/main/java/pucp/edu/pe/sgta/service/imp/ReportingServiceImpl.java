package pucp.edu.pe.sgta.service.imp;

import java.util.Arrays;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;
import java.util.Comparator;
import java.util.HashMap;

import org.springframework.stereotype.Service;

import pucp.edu.pe.sgta.dto.AdvisorPerformanceDto;
import pucp.edu.pe.sgta.dto.AreaFinalDTO;
import pucp.edu.pe.sgta.dto.TeacherCountDTO;
import pucp.edu.pe.sgta.dto.TopicAreaStatsDTO;
import pucp.edu.pe.sgta.repository.AdvisorDistributionRepository;
import pucp.edu.pe.sgta.repository.JurorDistributionRepository;
import pucp.edu.pe.sgta.repository.TopicAreaStatsRepository;
import pucp.edu.pe.sgta.service.inter.IReportService;

@Service
public class ReportingServiceImpl implements IReportService {
    
    private final TopicAreaStatsRepository topicAreaStatsRepository;
    private final AdvisorDistributionRepository advisorDistributionRepository;
    private final JurorDistributionRepository jurorDistributionRepository;

    public ReportingServiceImpl(TopicAreaStatsRepository topicAreaStatsRepository,
                              AdvisorDistributionRepository advisorDistributionRepository, JurorDistributionRepository jurorDistributionRepository) {
        this.topicAreaStatsRepository = topicAreaStatsRepository;
        this.advisorDistributionRepository = advisorDistributionRepository;
        this.jurorDistributionRepository = jurorDistributionRepository;
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
        List<Object[]> resultsA = advisorDistributionRepository.getAdvisorDistributionByCoordinatorAndCiclo(usuarioId, cicloNombre);
        return resultsA.stream()
            .map(result -> new TeacherCountDTO(
                (String) result[0],  // teacher_name
                ((Number) result[1]).intValue()  // advisor_count
            ))
            .collect(Collectors.toList());
    }

    @Override
    public List<TeacherCountDTO> getJurorDistribution(Integer usuarioId, String cicloNombre) {
        // Ahora se usa la función que filtra por usuario (coordinador) y ciclo
        List<Object[]> resultsJ = jurorDistributionRepository.getJurorDistributionByCoordinatorAndCiclo(usuarioId, cicloNombre);
        return resultsJ.stream()
            .map(result -> new TeacherCountDTO(
                (String) result[0],  // teacher_name
                ((Number) result[1]).intValue()  // advisor_count
            ))
            .collect(Collectors.toList());
    }
    //TODO: Agregar metodos para comparativa de Asesor vs Jurado <-- Talves se pueda hacer con los datos mismos anteriores ya guardados.

    @Override
    public List<AreaFinalDTO> getAreaFinal(Integer usuarioId, String cicloNombre) {
        if (usuarioId == null || cicloNombre == null || cicloNombre.trim().isEmpty()) {
            throw new IllegalArgumentException("El ID de usuario y el ciclo son requeridos");
        }

        // Obtener datos usando los métodos existentes
        List<TeacherCountDTO> advisors = getAdvisorDistribution(usuarioId, cicloNombre);
        List<TeacherCountDTO> jurors = getJurorDistribution(usuarioId, cicloNombre);

        // Mapa para mantener el registro de todos los profesores y sus asignaciones
        Map<String, AreaFinalDTO.AreaFinalDTOBuilder> teacherMap = new HashMap<>();

        // Procesar asesores
        processTeachers(advisors, teacherMap, true);

        // Procesar jurados
        processTeachers(jurors, teacherMap, false);

        // Calcular totales y construir DTOs finales
        return teacherMap.values().stream()
            .map(builder -> {
                AreaFinalDTO dto = builder.build();
                int total = dto.getAdvisorCount() + dto.getJurorCount();
                
                return AreaFinalDTO.builder()
                    .teacherName(dto.getTeacherName())
                    .areaName(dto.getAreaName())
                    .advisorCount(dto.getAdvisorCount())
                    .jurorCount(dto.getJurorCount())
                    .totalCount(total)
                    .build();
            })
            .sorted(Comparator.comparing(AreaFinalDTO::getAreaName)
                    .thenComparing(AreaFinalDTO::getTeacherName))
            .collect(Collectors.toList());
    }

    private void processTeachers(List<TeacherCountDTO> teachers, 
                               Map<String, AreaFinalDTO.AreaFinalDTOBuilder> teacherMap,
                               boolean isAdvisor) {
        for (TeacherCountDTO teacher : teachers) {
            try {
                String[] parts = teacher.getTeacherName().split(",");
                if (parts.length < 2) {
                    System.err.println("Formato de nombre inválido: " + teacher.getTeacherName());
                    continue;
                }
                
                String teacherName = parts[0].trim();
                String areaName = parts[1].trim();
                if (areaName.isEmpty()) {
                    System.err.println("Área vacía para profesor: " + teacherName);
                    continue;
                }

                // Clave única para identificar al profesor en su área
                String key = teacherName + "|" + areaName;

                // Si el profesor no existe en el mapa, crear un nuevo registro
                teacherMap.computeIfAbsent(key, k -> AreaFinalDTO.builder()
                        .teacherName(teacherName)
                        .areaName(areaName)
                        .advisorCount(0)
                        .jurorCount(0)
                        .totalCount(0));

                // Actualizar el contador correspondiente
                AreaFinalDTO.AreaFinalDTOBuilder builder = teacherMap.get(key);
                if (isAdvisor) {
                    builder.advisorCount(teacher.getCount());
                } else {
                    builder.jurorCount(teacher.getCount());
                }
            } catch (Exception e) {
                System.err.println("Error procesando profesor: " + teacher.getTeacherName() + 
                                 ". Error: " + e.getMessage());
            }
        }
    }

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
