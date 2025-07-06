package pucp.edu.pe.sgta.dto;

import java.util.List;
import java.util.Map;

public class TopicAreaStatsDTO {
    private String areaName;
    private int topicCount; // Total general
    private Map<String, Integer> etapasFormativasCount; // Mapa simple: "Tesis 1" -> 10, "Tesis 2" -> 8

    public TopicAreaStatsDTO(String areaName, int topicCount) {
        this.areaName = areaName;
        this.topicCount = topicCount;
    }

    public TopicAreaStatsDTO(String areaName, int topicCount, Map<String, Integer> etapasFormativasCount) {
        this.areaName = areaName;
        this.topicCount = topicCount;
        this.etapasFormativasCount = etapasFormativasCount;
    }

    public String getAreaName() { return areaName; }
    public int getTopicCount() { return topicCount; }
    public Map<String, Integer> getEtapasFormativasCount() { return etapasFormativasCount; }
    
    public void setAreaName(String areaName) { this.areaName = areaName; }
    public void setTopicCount(int topicCount) { this.topicCount = topicCount; }
    public void setEtapasFormativasCount(Map<String, Integer> etapasFormativasCount) { this.etapasFormativasCount = etapasFormativasCount; }
}
