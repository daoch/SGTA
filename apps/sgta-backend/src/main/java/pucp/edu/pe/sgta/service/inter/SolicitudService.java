package pucp.edu.pe.sgta.service.inter;

import pucp.edu.pe.sgta.dto.AprobarSolicitudCambioAsesorResponseDto;
import pucp.edu.pe.sgta.dto.AprobarSolicitudResponseDto;
import pucp.edu.pe.sgta.dto.DetalleSolicitudCeseDto;
import pucp.edu.pe.sgta.dto.RechazoSolicitudCambioAsesorResponseDto;
import pucp.edu.pe.sgta.dto.RechazoSolicitudResponseDto;
import pucp.edu.pe.sgta.dto.SolicitudCambioAsesorDto;
import pucp.edu.pe.sgta.dto.SolicitudCeseDto;
import pucp.edu.pe.sgta.dto.asesores.SolicitudCeseDetalleDto;
import pucp.edu.pe.sgta.dto.asesores.DetalleSolicitudCambioAsesorDto;
import pucp.edu.pe.sgta.dto.asesores.SolicitudCambioAsesorResumenDto;
import pucp.edu.pe.sgta.dto.temas.SolicitudTemaDto;
import pucp.edu.pe.sgta.model.Tema;

import java.util.List;

public interface SolicitudService {
    public DetalleSolicitudCeseDto getDetalleSolicitudCese(Integer solicitudId);
    SolicitudCambioAsesorDto findAllSolicitudesCambioAsesor(int page, int size);
    RechazoSolicitudCambioAsesorResponseDto rechazarSolicitudCambioAsesor(Integer solicitudId, String response);
    AprobarSolicitudCambioAsesorResponseDto aprobarSolicitudCambioAsesor(Integer solicitudId, String response);
    void crearSolicitudAprobacionTema(Tema tema);
    SolicitudTemaDto findAllSolicitudesByTema(Integer temaId, int page, int size);
    void atenderSolicitudTemaInscrito(SolicitudTemaDto solicitudAtendida);
    public SolicitudCeseDto findAllSolicitudesCeseByCoordinatorCognitoSub(String coordinatorCognitoSub, int page, int size, String status);
    void rejectSolicitudCese(Integer solicitudId, String responseText, String coordinatorCognitoSub);
    SolicitudCeseDetalleDto findSolicitudCeseDetailsById(Integer solicitudId, String coordinatorCognitoSub);
    pucp.edu.pe.sgta.dto.asesores.SolicitudCambioAsesorDto registrarSolicitudCambioAsesor(pucp.edu.pe.sgta.dto.asesores.SolicitudCambioAsesorDto solicitud);
    List<SolicitudCambioAsesorResumenDto> listarResumenSolicitudCambioAsesorUsuario(Integer idUsuario, String rolSolicitud);
    DetalleSolicitudCambioAsesorDto listarDetalleSolicitudCambioAsesorUsuario(Integer idSolicitud);
    void aprobarRechazarSolicitudCambioAsesor(Integer idSolicitud, Integer idUsuario, String rolSolictud, boolean aprobar);
}
