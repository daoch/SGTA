package pucp.edu.pe.sgta.service.imp;

import java.util.HashMap;
import java.util.Map;

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
    @Value("${zoom.account.id}")
    private String accountId;

    @Value("${zoom.client.secret}")
    private String clientSecret;

    @Value("${zoom.client.id}")
    private String clientId;

    @Value("${zoom.access.url}")
    private String tokenUrl;

    @Value("${zoom.meeting.url}")
    private String meetingUrl;

    // aca vamos a poner las funciones
    @Override
    public ZoomMeetingResponse createMeeting(ZoomMeetingRequest request) {
        RestTemplate restTemplate = new RestTemplate();

        // PREPARAMOS EL HEADER
        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);
        headers.set("Authorization", "Bearer " + request.getAccessToken());

        // PREARAMOS EL BODY
        Map<String, Object> settings = new HashMap<>();
        settings.put("host_video", request.getHostVideo());
        settings.put("participant_video", request.getParticipantVideo());
        settings.put("mute_upon_entry", request.getMuteUponEntry());
        settings.put("audio", request.getAudio());

        Map<String, Object> body = new HashMap<>();
        body.put("topic", request.getTopic());
        body.put("type", 2);
        body.put("start_time", request.getStartTime());
        body.put("duration", request.getDuration());
        body.put("agenda", request.getAgenda());
        body.put("timezone", request.getTimezone());
        body.put("default_password", request.getDefaultPassword());
        body.put("join_before_host", request.getJoinBeforeHost());
        body.put("waiting_room", request.getWaitingRoom());

        // agregamos los settings al body
        body.put("settings", settings);

        HttpEntity<Map<String, Object>> entity = new HttpEntity<>(body, headers);

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
        String auth = clientId + ":" + clientSecret;
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
