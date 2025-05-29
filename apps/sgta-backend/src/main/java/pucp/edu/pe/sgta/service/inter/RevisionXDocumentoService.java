package pucp.edu.pe.sgta.service.inter;

import pucp.edu.pe.sgta.dto.RevisionDocumentoDto;
import java.util.List;
import java.time.LocalDate;

public interface RevisionXDocumentoService {
    RevisionDocumentoDto crearRevision(Integer versionDocumentoId, Integer usuarioId,
                                       LocalDate fechaRevision, String estadoRevision,
                                       String linkArchivoRevision);
    List<RevisionDocumentoDto> listarRevisionesPorVersion(Integer versionDocumentoId);
}