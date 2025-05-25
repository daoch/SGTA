package pucp.edu.pe.sgta.service.inter;

import pucp.edu.pe.sgta.dto.VersionDocumentoDto;

public interface VersionXDocumentoService {

	VersionDocumentoDto crearVersion(Integer documentoId, String linkArchivoSubido);

}