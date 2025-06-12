package pucp.edu.pe.sgta.service.inter;

import java.util.List;

import org.springframework.http.ResponseEntity;

import pucp.edu.pe.sgta.dto.RelacionZoomMeetingSalasDTO;
import pucp.edu.pe.sgta.dto.UsuarioDto;
import pucp.edu.pe.sgta.model.ZoomAccessTokenResponse;
import pucp.edu.pe.sgta.model.ZoomMeetingResponse;

public interface ZoomService {
    ZoomMeetingResponse createMeeting(String correoUsuario, String nombreSala, String startTime, String endTime,
            Integer jornadaId);

    ZoomAccessTokenResponse generateAccessToken();

    List<RelacionZoomMeetingSalasDTO> crearMeetingsPorJornadaExposicion(Integer jornadaId, UsuarioDto coordinador);
}
