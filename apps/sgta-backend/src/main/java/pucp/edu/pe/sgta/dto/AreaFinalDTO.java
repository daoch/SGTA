package pucp.edu.pe.sgta.dto;

import lombok.*;
import java.util.List;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class AreaFinalDTO {
    private String teacherName;
    private String areaName;
    private int advisorCount;
    private int jurorCount;
    private int totalCount;
    private List<String> etapasFormativas;
} 