package pucp.edu.pe.sgta.model;

import lombok.Data;

@Data
public class ZoomMeetingRequest {
    private String topic;
    private String startTime;
    private Integer duration;
    private String agenda;
    private String timezone;
    private Boolean hostVideo;
    private Boolean participantVideo;
    private Boolean muteUponEntry;
    private String audio;
    private Boolean waitingRoom;
    private String accessToken;
    private Boolean defaultPassword;
    private Boolean joinBeforeHost;
}
