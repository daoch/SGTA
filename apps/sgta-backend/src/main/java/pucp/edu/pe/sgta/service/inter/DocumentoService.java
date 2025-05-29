package pucp.edu.pe.sgta.service.inter;

import pucp.edu.pe.sgta.dto.DocumentoConVersionDto;
import pucp.edu.pe.sgta.model.Documento;

import java.util.List;

public interface DocumentoService {
    List<DocumentoConVersionDto> listarDocumentosPorEntregable(Integer entregableId);
    Integer create(Documento documento);
}
