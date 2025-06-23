package pucp.edu.pe.sgta.service.inter;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import pucp.edu.pe.sgta.dto.asesores.SolicitudActualizadaDto;
import pucp.edu.pe.sgta.model.Solicitud;
import pucp.edu.pe.sgta.dto.asesores.MiSolicitudCeseItemDto;

public interface SolicitudCoordinadorService {
    Solicitud crearSolicitudCese(String asesorCognitoSub, Integer temaId, String motivo);
    SolicitudActualizadaDto aprobarSolicitudCese(Integer solicitudId, String comentarioAprobacion, String coordinadorCognitoSub);
    Page<MiSolicitudCeseItemDto> findSolicitudesCeseByAsesor(String asesorCognitoSub,
                                                         String searchTerm,
                                                         Pageable pageable);
}