package pucp.edu.pe.sgta.service.inter;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import pucp.edu.pe.sgta.model.Solicitud;

public interface SolicitudCoordinadorService {
    Solicitud crearSolicitudCese(String asesorCognitoSub, Integer temaId, String motivo);
}