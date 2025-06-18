package pucp.edu.pe.sgta.service.inter;

import pucp.edu.pe.sgta.dto.AprobarSolicitudCambioAsesorResponseDto;
import pucp.edu.pe.sgta.dto.AprobarSolicitudResponseDto;
import pucp.edu.pe.sgta.dto.DetalleSolicitudCeseDto;
import pucp.edu.pe.sgta.dto.RechazoSolicitudCambioAsesorResponseDto;
import pucp.edu.pe.sgta.dto.RechazoSolicitudResponseDto;
import pucp.edu.pe.sgta.dto.SolicitudCambioAsesorDto;
import pucp.edu.pe.sgta.dto.SolicitudCeseDto;
import pucp.edu.pe.sgta.dto.asesores.DetalleSolicitudCambioAsesorDto;
import pucp.edu.pe.sgta.dto.asesores.SolicitudCambioAsesorResumenDto;
import pucp.edu.pe.sgta.dto.asesores.SolicitudCeseAsesoriaResumenDto;
import pucp.edu.pe.sgta.dto.temas.SolicitudTemaDto;
import pucp.edu.pe.sgta.model.Tema;

import java.util.List;

public interface SolicitudService {
    SolicitudCeseDto findAllSolicitudesCese(int coordinatorId, int page, int size);
    DetalleSolicitudCeseDto getDetalleSolicitudCese(Integer solicitudId);
    RechazoSolicitudResponseDto rechazarSolicitud(Integer solicitudId, String response);
    AprobarSolicitudResponseDto aprobarSolicitud(Integer solicitudId, String response);
    SolicitudCambioAsesorDto findAllSolicitudesCambioAsesor(int page, int size);
    RechazoSolicitudCambioAsesorResponseDto rechazarSolicitudCambioAsesor(Integer solicitudId, String response);
    AprobarSolicitudCambioAsesorResponseDto aprobarSolicitudCambioAsesor(Integer solicitudId, String response);
    void crearSolicitudAprobacionTema(Tema tema);
    SolicitudTemaDto findAllSolicitudesByTema(Integer temaId, int page, int size);
    void atenderSolicitudTemaInscrito(SolicitudTemaDto solicitudAtendida, String usuarioId);
    pucp.edu.pe.sgta.dto.asesores.SolicitudCambioAsesorDto registrarSolicitudCambioAsesor(pucp.edu.pe.sgta.dto.asesores.SolicitudCambioAsesorDto solicitud);
    List<SolicitudCambioAsesorResumenDto> listarResumenSolicitudCambioAsesorUsuario(Integer idUsuario, String rolSolicitud);
    DetalleSolicitudCambioAsesorDto listarDetalleSolicitudCambioAsesorUsuario(Integer idSolicitud);
    void aprobarRechazarSolicitudCambioAsesorAsesor(Integer idSolicitud, String idCognito, String comentario, boolean aprobar);
    void aprobarRechazarSolicitudCambioAsesorCoordinador(Integer idSolicitud, String idCognito, String comentario, boolean aprobar);
    // Solicitud Cese Asesoria
    pucp.edu.pe.sgta.dto.asesores.SolicitudCeseAsesoriaDto registrarSolicitudCeseAsesoria(pucp.edu.pe.sgta.dto.asesores.SolicitudCeseAsesoriaDto solicitud);
    List<pucp.edu.pe.sgta.dto.asesores.SolicitudCeseAsesoriaResumenDto> listarResumenSolicitudCeseAsesoriaUsuario(Integer idUsuario, String rolSolicitud);
    pucp.edu.pe.sgta.dto.asesores.DetalleSolicitudCeseAsesoriaDto listarDetalleSolicitudCeseAsesoriaUsuario(Integer idSolicitud);
    void aprobarRechazarSolicitudCeseAsesoria(Integer idSolicitud, Integer idUsuario, String rolSolicitud, boolean aprobar);
    List<SolicitudCambioAsesorResumenDto> listarResumenSolicitudCambioAsesorCoordinador(String idCognito);
}
