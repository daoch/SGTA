package pucp.edu.pe.sgta.model;

import lombok.Data;

@Data
public class ZoomMeetingResponse {
    private String join_url; // URL for participants to join the meeting
    private String start_url; // This URL should only be used by the host of the meeting.
    private Integer type; // 2 scheduled meeting
    private String start_time;
    private String timezone;
    private String topic;
    private String alternative_hosts;
}