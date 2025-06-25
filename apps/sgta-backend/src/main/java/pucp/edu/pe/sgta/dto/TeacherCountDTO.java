package pucp.edu.pe.sgta.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import java.util.List;
import java.util.Map;

@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class TeacherCountDTO {
    private String teacherName;
    private String areaName;
    private int    count;
    private Map<String, Integer> etapasFormativasCount; // Contadores por etapa formativa

    public TeacherCountDTO(String teacherName, String areaName, int count) {
        this.teacherName = teacherName;
        this.areaName = areaName;
        this.count = count;
    }
}