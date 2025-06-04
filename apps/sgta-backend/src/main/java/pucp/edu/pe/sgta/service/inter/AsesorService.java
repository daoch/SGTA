package pucp.edu.pe.sgta.service.inter;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import pucp.edu.pe.sgta.dto.asesores.AsesorTemaActivoDto;
import pucp.edu.pe.sgta.dto.asesores.AsesorDisponibleDto;
import pucp.edu.pe.sgta.dto.asesores.InvitacionAsesoriaDto;

import java.util.List;

public interface AsesorService {
    List<AsesorTemaActivoDto> findTemasActivosByAsesorCognitoSub(String asesorCognitoSub);

    Page<AsesorDisponibleDto> buscarAsesoresDisponibles(
            String coordinadorCognitoSub, // Para determinar las carreras del coordinador
            String searchTerm,
            List<Integer> areaConocimientoIds,
            Pageable pageable
    );

    Page<InvitacionAsesoriaDto> findInvitacionesAsesoriaPendientesByAsesor(String asesorCognitoSub, Pageable pageable);

    void rechazarInvitacionDeAsesoria(Integer solicitudOriginalId, String asesorCognitoSub, String motivoRechazo);

    void aceptarInvitacionDeAsesoria(Integer solicitudOriginalId, String asesorCognitoSub);
}