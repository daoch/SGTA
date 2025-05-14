package pucp.edu.pe.sgta.service.inter;

import pucp.edu.pe.sgta.dto.AprobarSolicitudResponseDto;
import pucp.edu.pe.sgta.dto.RechazoSolicitudResponseDto;
import pucp.edu.pe.sgta.dto.SolicitudCambioAsesorDto;
import pucp.edu.pe.sgta.dto.SolicitudCeseDto;

public interface SolicitudService {
    SolicitudCeseDto findAllSolicitudesCese(int page, int size);
    RechazoSolicitudResponseDto rechazarSolicitud(Integer solicitudId, String response);
    AprobarSolicitudResponseDto aprobarSolicitud(Integer solicitudId, String response);
    SolicitudCambioAsesorDto findAllSolicitudesCambioAsesor(int page, int size);
}
