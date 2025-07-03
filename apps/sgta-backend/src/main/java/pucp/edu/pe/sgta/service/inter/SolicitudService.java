package pucp.edu.pe.sgta.service.inter;

import pucp.edu.pe.sgta.dto.SolicitudCeseDto;
import pucp.edu.pe.sgta.dto.asesores.*;
import pucp.edu.pe.sgta.dto.temas.SolicitudTemaDto;
import pucp.edu.pe.sgta.model.Tema;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.util.List;

public interface SolicitudService {
    void crearSolicitudAprobacionTema(Tema tema);
    SolicitudTemaDto findAllSolicitudesByTema(Integer temaId, int page, int size);
    void atenderSolicitudTemaInscrito(SolicitudTemaDto solicitudAtendida, String usuarioId);
    pucp.edu.pe.sgta.dto.asesores.SolicitudCambioAsesorDto registrarSolicitudCambioAsesor(pucp.edu.pe.sgta.dto.asesores.SolicitudCambioAsesorDto solicitud, String cognitoId);
    List<SolicitudCambioAsesorResumenDto> listarResumenSolicitudCambioAsesorUsuario(Integer idUsuario, String rolSolicitud);
    DetalleSolicitudCambioAsesorDto listarDetalleSolicitudCambioAsesorUsuario(Integer idSolicitud);
    void aprobarRechazarSolicitudCambioAsesorAsesor(Integer idSolicitud, String idCognito, String comentario, String rol, boolean aprobar);
    void aprobarRechazarSolicitudCambioAsesorCoordinador(Integer idSolicitud, String idCognito, String comentario, boolean aprobar);
    public SolicitudCeseDto findAllSolicitudesCeseByCoordinatorCognitoSub(String coordinatorCognitoSub, int page, int size, String status);
    void rejectSolicitudCese(Integer solicitudId, String responseText, String coordinatorCognitoSub);
    SolicitudCeseDetalleDto findSolicitudCeseDetailsById(Integer solicitudId, String coordinatorCognitoSub);
        Page<ReasignacionPendienteDto> findReasignacionesPendientes(
                String coordinadorCognitoSub,
                String searchTerm, // Puede ser null o vacío
                Pageable pageable
        );
    List<SolicitudCambioAsesorResumenDto> listarResumenSolicitudCambioAsesorCoordinador(String idCognito);

    RegistroCeseTemaDto registrarSolicitudCeseTema(RegistroCeseTemaDto registroDto, String cognitoId);

    List<SolicitudCeseTemaResumenDto> listarResumenSolicitudCeseTemaUsuario(String cognitoId, List<String> roles);

    DetalleSolicitudCeseTema listarDetalleSolicitudCeseTema(Integer idSolicitud);
}
