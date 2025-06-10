package pucp.edu.pe.sgta.service.inter;

import pucp.edu.pe.sgta.model.ZoomAccessTokenResponse;
import pucp.edu.pe.sgta.model.ZoomMeetingRequest;
import pucp.edu.pe.sgta.model.ZoomMeetingResponse;

public interface ZoomService {
    ZoomMeetingResponse createMeeting(ZoomMeetingRequest request);

    ZoomAccessTokenResponse generateAccessToken();
}
