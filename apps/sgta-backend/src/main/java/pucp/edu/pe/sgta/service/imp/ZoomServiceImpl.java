package pucp.edu.pe.sgta.service.imp;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpMethod;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.util.LinkedMultiValueMap;
import org.springframework.util.MultiValueMap;
import org.springframework.web.client.RestTemplate;

import pucp.edu.pe.sgta.model.ZoomAccessTokenResponse;
import pucp.edu.pe.sgta.model.ZoomMeetingRequest;
import pucp.edu.pe.sgta.model.ZoomMeetingResponse;
import pucp.edu.pe.sgta.service.inter.ZoomService;

@Service
public class ZoomServiceImpl implements ZoomService {

    // estos son todos los valores que necesitamos y se encuetran en el .env
    @Value("${ZOOM_ACCOUNT_ID}")
    private String accountId;

    @Value("${ZOOM_CLIENT_SECRET}")
    private String clientSecret;

    @Value("${ZOOM_POST_ACCESS_TOKEN_URL}")
    private String tokenUrl;

    @Value("${ZOOM_MEETING_CREATION_URL}")
    private String meetingUrl;

    private String accessToken;

    // aca vamos a poner las funciones
    @Override
    public ZoomMeetingResponse createMeeting(ZoomMeetingRequest request) {
        RestTemplate restTemplate = new RestTemplate();

        // PREPARAMOS EL HEADER
        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);
        headers.set("Authorization", "Bearer " + request.getAccessToken());

        // PREARAMOS EL BODY
        MultiValueMap<String, Object> body = new LinkedMultiValueMap<>();
        body.add("topic", request.getTopic());
        body.add("type", 2); // usamos 2 para reuniones programadas
        body.add("start_time", request.getStartTime());
        body.add("duration", request.getDuration());
        body.add("agenda", request.getAgenda());
        body.add("timezone", request.getTimezone());

        MultiValueMap<String, Object> settings = new LinkedMultiValueMap<>();
        settings.add("host_video", request.getHostVideo());
        settings.add("participant_video", request.getParticipantVideo());
        settings.add("join_before_host", request.getJoinBeforeHost());
        settings.add("mute_upon_entry", request.getMuteUponEntry());
        settings.add("audio", request.getAudio());
        settings.add("jbh_time", request.getJbhTime());

        body.add("settings", settings);

        HttpEntity<MultiValueMap<String, Object>> entity = new HttpEntity<>(body, headers);

        // TEMRINAMOS EL POST REQUEST
        ResponseEntity<ZoomMeetingResponse> response = restTemplate.exchange(
                meetingUrl, HttpMethod.POST, entity, ZoomMeetingResponse.class);

        // RETORNAMOS LOS DETALLES DE LA REUNION
        return response.getBody();
    }

    @Override
    public ZoomAccessTokenResponse generateAccessToken() {
        RestTemplate restTemplate = new RestTemplate();

        // PREPARAMOS EL HEADER CONTENT TYPE
        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_FORM_URLENCODED);

        // PREPARAMOS EL HEADER DE AUTHOZIRZATION
        String auth = accountId + ":" + clientSecret;
        String basicAuth = "Basic " + new String(java.util.Base64.getEncoder().encode(auth.getBytes()));
        headers.set("Authorization", basicAuth);

        // PREPARAMOS EL BODY
        MultiValueMap<String, String> body = new LinkedMultiValueMap<>();
        body.add("grant_type", "account_credentials");
        body.add("account_id", accountId);

        HttpEntity<MultiValueMap<String, String>> entity = new HttpEntity<>(body, headers);

        // TEMRINAMOS EL POST REQUEST
        ResponseEntity<ZoomAccessTokenResponse> response = restTemplate.exchange(
                tokenUrl, HttpMethod.POST, entity, ZoomAccessTokenResponse.class);

        // RETORNAMOS EL TOKEN DE ACCESO
        return response.getBody();
    }
}
