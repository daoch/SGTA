package pucp.edu.pe.sgta.dto;

import lombok.*;
import java.util.List;
import java.util.Map;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class AreaFinalDTO {
    private String teacherName;
    private List<String> areasConocimiento; // Múltiples áreas donde trabaja el profesor
    private int advisorCount; // Total de temas como asesor
    private int jurorCount;   // Total de temas como jurado
    private int totalCount;   // Total combinado
    
    // Contadores detallados por etapa formativa
    private Map<String, Integer> etapasFormativasAsesorCount;  // {"Tesis 1": 3, "Tesis 2": 2}
    private Map<String, Integer> etapasFormativasJuradoCount;  // {"Tesis 1": 1, "Formulación": 2}
    
    // DEPRECATED: Mantenido por compatibilidad
    @Deprecated
    private String areaName; // Primera área (para compatibilidad)
    
    @Deprecated
    private List<String> etapasFormativas; // Lista simple (para compatibilidad)
} 