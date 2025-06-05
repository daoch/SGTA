package pucp.edu.pe.sgta.service.inter;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import pucp.edu.pe.sgta.dto.asesores.ReasignacionPendienteDto;
import pucp.edu.pe.sgta.dto.asesores.SolicitudActualizadaDto;

public interface CoordinadorSolicitudService {
    // ... (otros métodos como el de listar solicitudes para el coordinador) ...
    SolicitudActualizadaDto aprobarSolicitudCese(Integer solicitudId, String comentarioAprobacion, String coordinadorCognitoSub);
    //SolicitudActualizadaDto rechazarSolicitudCese(Integer solicitudId, String motivoRechazo, String coordinadorCognitoSub); // Si lo pones aquí

    Page<ReasignacionPendienteDto> findReasignacionesPendientes(
            String coordinadorCognitoSub,
            String searchTerm, // Puede ser null o vacío
            Pageable pageable
    );
}