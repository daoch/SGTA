package pucp.edu.pe.sgta.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.util.List;
import java.util.Map;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class AdvisorPerformanceDto {
    private String advisorName;
    private String areaName;
    private Double performancePercentage;
    private Integer totalStudents;
    private Map<String, Integer> etapasFormativasCount;

    public AdvisorPerformanceDto(String advisorName, String areaName, Double performancePercentage, Integer totalStudents) {
        this.advisorName = advisorName;
        this.areaName = areaName;
        this.performancePercentage = performancePercentage;
        this.totalStudents = totalStudents;
    }
}
