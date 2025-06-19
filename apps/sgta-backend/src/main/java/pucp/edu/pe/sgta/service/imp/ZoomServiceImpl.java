package pucp.edu.pe.sgta.service.imp;

import java.sql.Timestamp;
import java.time.Duration;
import java.time.LocalDateTime;
import java.time.ZoneId;
import java.time.format.DateTimeFormatter;
import java.util.HashMap;
import java.util.List;
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

import pucp.edu.pe.sgta.dto.JornadaExposicionXSalaExposicionListadoDTO;
import pucp.edu.pe.sgta.dto.RelacionZoomMeetingSalasDTO;
import pucp.edu.pe.sgta.dto.SalaExposicionJornadaDTO;
import pucp.edu.pe.sgta.dto.UsuarioDto;
import pucp.edu.pe.sgta.model.BloqueHorarioExposicion;
import pucp.edu.pe.sgta.model.ExposicionXTema;
import pucp.edu.pe.sgta.model.JornadaExposicionXSalaExposicion;
import pucp.edu.pe.sgta.model.ZoomAccessTokenResponse;
import pucp.edu.pe.sgta.model.ZoomMeetingResponse;
import pucp.edu.pe.sgta.repository.BloqueHorarioExposicionRepository;
import pucp.edu.pe.sgta.repository.ExposicionXTemaRepository;
import pucp.edu.pe.sgta.repository.JornadaExposicionXSalaExposicionRepository;
import pucp.edu.pe.sgta.service.inter.JornadaExposicionXSalaExposicionService;
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

        private final JornadaExposicionXSalaExposicionService jornadaExposicionXSalaExposicionService;

        private final JornadaExposicionXSalaExposicionRepository jornadaExposicionXSalaExposicionRepository;

        private final BloqueHorarioExposicionRepository bloqueHorarioExposicionRepository;

        private final ExposicionXTemaRepository exposicionXTemaRepository;

        public ZoomServiceImpl(JornadaExposicionXSalaExposicionService jornadaExposicionXSalaExposicionService,
                        JornadaExposicionXSalaExposicionRepository jornadaExposicionXSalaExposicionRepository,
                        BloqueHorarioExposicionRepository bloqueHorarioExposicionRepository,
                        ExposicionXTemaRepository exposicionXTemaRepository) {
                this.exposicionXTemaRepository = exposicionXTemaRepository;
                this.bloqueHorarioExposicionRepository = bloqueHorarioExposicionRepository;
                this.jornadaExposicionXSalaExposicionRepository = jornadaExposicionXSalaExposicionRepository;
                this.jornadaExposicionXSalaExposicionService = jornadaExposicionXSalaExposicionService;
        }

        // CREAR UN MEETING INDIVIDUAL
        @Override
        public ZoomMeetingResponse createMeeting(String correoUsuario, String nombreSala, String startTime,
                        String endTime, Integer jornadaId) {
                RestTemplate restTemplate = new RestTemplate();

                ZoomAccessTokenResponse request = this.generateAccessToken();

                // PREPARAMOS EL HEADER
                HttpHeaders headers = new HttpHeaders();
                headers.setContentType(MediaType.APPLICATION_JSON);
                headers.set("Authorization", "Bearer " + request.getAccess_token());

                // PREARAMOS EL BODY
                Map<String, Object> settings = new HashMap<>();
                settings.put("host_video", false);
                settings.put("participant_video", false);
                settings.put("mute_upon_entry", true);
                settings.put("audio", "both");
                // settings.put("alternative_hosts", correoUsuario); // el anfitrion alternativo
                // es el coordinador el problema es que maria no esta registrada como usuario en
                // zoom

                // if (alternativeHosts != null && !alternativeHosts.isEmpty()) {
                // settings.put("alternative_hosts", String.join(";", alternativeHosts));
                // }

                Map<String, Object> body = new HashMap<>();
                body.put("topic",
                                "Exposiciones definidas para la sala: " + nombreSala + " para la Jornada " + jornadaId
                                                + ": "
                                                + startTime + " - "
                                                + endTime);
                body.put("type", 2); // 2 significa que es una reunion programada

                String startTimeISO = Timestamp.valueOf(startTime).toInstant().toString();
                body.put("start_time", startTimeISO);

                // calculamos la duracion
                // String cleanedStartTime = startTime.split("\\.")[0];
                // String cleanedEndTime = endTime.split("\\.")[0];
                // DateTimeFormatter formatter = DateTimeFormatter.ofPattern("yyyy-MM-dd
                // HH:mm:ss");
                // LocalDateTime startDateTime = LocalDateTime.parse(cleanedStartTime,
                // formatter);
                // LocalDateTime endDateTime = LocalDateTime.parse(cleanedEndTime, formatter);
                // Duration duration = Duration.between(startDateTime, endDateTime);
                // int durationMinutes = (int) duration.toMinutes();
                body.put("duration", 8 * 60);

                body.put("timezone", "America/Lima"); // zona horaria de Lima
                body.put("join_before_host", false); // los participantes no pueden unirse antes que el anfitrion
                body.put("waiting_room", true); // sala de espera habilitada

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

        // OBTENEMOS TODAS LAS REUNIONES POR SALA POR JORNADA
        @Override
        public List<RelacionZoomMeetingSalasDTO> crearMeetingsPorJornadaExposicion(Integer exposicionId,
                        UsuarioDto coordinador) {

                List<JornadaExposicionXSalaExposicionListadoDTO> jornadas = jornadaExposicionXSalaExposicionService
                                .listarJornadasExposicionSalas(exposicionId);

                System.out.println("El correo del coordinador es: " + coordinador.getCorreoElectronico());

                List<RelacionZoomMeetingSalasDTO> reuniones = new java.util.ArrayList<>();

                if (!jornadas.isEmpty()) {
                        for (JornadaExposicionXSalaExposicionListadoDTO jornada : jornadas) {
                                for (SalaExposicionJornadaDTO sala : jornada.getSalasExposicion()) {

                                        // obtenemos el id de exposicion por sala
                                        JornadaExposicionXSalaExposicion jornadaExpoSala = jornadaExposicionXSalaExposicionRepository
                                                        .findJornadaExposicionXSalaExposicionByJornadaExposicionIdAndSalaExposicionIdAndActivoTrue(
                                                                        jornada.getJornadaExposicionId(), sala.getId());

                                        List<BloqueHorarioExposicion> bloquesHorarioExposicion = bloqueHorarioExposicionRepository
                                                        .findByJornadaExposicionXSalaIdAndExposicionXTemaIsNotNull(
                                                                        jornadaExpoSala.getId());

                                        if (!bloquesHorarioExposicion.isEmpty()) {

                                                // agregamos el correo del coordinador a la lista de alternative hosts
                                                // alternativeHosts.add(coordinador.getCorreoElectronico());

                                                // creamos una reunion por cada sala de exposicion
                                                ZoomMeetingResponse meeting = createMeeting(
                                                                coordinador.getCorreoElectronico(),
                                                                sala.getNombre(),
                                                                jornada.getDatetimeInicio().toString(),
                                                                jornada.getDatetimeFin().toString(),
                                                                jornada.getJornadaExposicionId());

                                                RelacionZoomMeetingSalasDTO reunion = new RelacionZoomMeetingSalasDTO(
                                                                jornada.getJornadaExposicionId(),
                                                                sala.getId(),
                                                                sala.getNombre(),
                                                                jornada.getDatetimeInicio().toInstant()
                                                                                .atZone(ZoneId.of("America/Lima"))
                                                                                .toOffsetDateTime(),

                                                                jornada.getDatetimeFin().toInstant()
                                                                                .atZone(ZoneId.of("America/Lima"))
                                                                                .toOffsetDateTime(),
                                                                meeting);
                                                reuniones.add(reunion);

                                                // actualizamos todas las exposiciones con sus reuniones de Zoom
                                                for (BloqueHorarioExposicion bloque : bloquesHorarioExposicion) {

                                                        ExposicionXTema exposicionXTema = exposicionXTemaRepository
                                                                        .findByIdAndActivoTrue(bloque
                                                                                        .getExposicionXTema().getId());

                                                        exposicionXTema.setLinkExposicion(meeting.getJoin_url());
                                                        exposicionXTemaRepository.save(exposicionXTema);
                                                }
                                        }
                                }
                        }
                }

                return reuniones;
        }
}
