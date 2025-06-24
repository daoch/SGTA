package pucp.edu.pe.sgta.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import java.util.Map;

@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class TopicTrendDTO {
    private String areaName;
    private Integer year;
    private Integer topicCount;
    private Map<String, Integer> etapasFormativasCount;

    public TopicTrendDTO(String areaName, Integer year, Integer topicCount) {
        this.areaName = areaName;
        this.year = year;
        this.topicCount = topicCount;
    }
} 