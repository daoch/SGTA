package pucp.edu.pe.sgta.service.inter;

import pucp.edu.pe.sgta.dto.RechazoSolicitudResponseDto;
import pucp.edu.pe.sgta.dto.SolicitudCeseDto;

public interface SolicitudService {
    SolicitudCeseDto findAllSolicitudesCese(int page, int size);
    RechazoSolicitudResponseDto rechazarSolicitud(Integer solicitudId, String response);
}
