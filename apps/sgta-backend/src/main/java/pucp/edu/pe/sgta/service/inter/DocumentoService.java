package pucp.edu.pe.sgta.service.inter;

import org.springframework.http.ResponseEntity;
import org.springframework.web.multipart.MultipartFile;
import pucp.edu.pe.sgta.dto.DocumentoConVersionDto;
import pucp.edu.pe.sgta.model.Documento;

import java.util.List;

public interface DocumentoService {
    List<DocumentoConVersionDto> listarDocumentosPorEntregable(Integer entregableXTemaId);
    Integer create(Documento documento);
    void borrarDocumento(Integer documentoId);
    public ResponseEntity<String> subirDocumentos(
        Integer entregableXTemaId,
        MultipartFile[] archivos,
        String ciclo,
        String curso,
        String codigoAlumno,
        Integer temaId
    );
}
