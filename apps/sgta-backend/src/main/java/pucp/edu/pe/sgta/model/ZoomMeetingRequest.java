package pucp.edu.pe.sgta.model;

import lombok.Data;

@Data
public class ZoomMeetingRequest {
    private String topic;
    private String startTime;
    private Integer duration;
    private String agenda;
    private String timezone = "UTC";
    private Boolean hostVideo = false;
    private Boolean participantVideo = false;
    private Boolean joinBeforeHost = true;
    private Boolean muteUponEntry = true;
    private String audio = "both";
    private Integer jbhTime = 5;
    private String accessToken;
    // private String password;
}
