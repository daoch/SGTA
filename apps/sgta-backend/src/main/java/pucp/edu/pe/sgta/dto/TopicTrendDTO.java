package pucp.edu.pe.sgta.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class TopicTrendDTO {
    private String areaName;
    private Integer year;
    private Integer topicCount;
    private List<String> etapasFormativas;

    public TopicTrendDTO(String areaName, Integer year, Integer topicCount) {
        this.areaName = areaName;
        this.year = year;
        this.topicCount = topicCount;
    }
} 