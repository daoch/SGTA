package pucp.edu.pe.sgta.service.inter;

import pucp.edu.pe.sgta.dto.VersionDocumentoDto;
import pucp.edu.pe.sgta.model.VersionXDocumento;

public interface VersionXDocumentoService {
    VersionDocumentoDto crearVersion(Integer documentoId, String linkArchivoSubido);
    void create(VersionXDocumento versionXDocumento);
}