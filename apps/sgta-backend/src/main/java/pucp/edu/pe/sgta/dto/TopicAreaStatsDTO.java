package pucp.edu.pe.sgta.dto;

public class TopicAreaStatsDTO {
    private String areaName;
    private int topicCount;

    public TopicAreaStatsDTO(String areaName, int topicCount) {
        this.areaName = areaName;
        this.topicCount = topicCount;
    }
    public String getAreaName() { return areaName; }
    public int getTopicCount() { return topicCount; }
}
