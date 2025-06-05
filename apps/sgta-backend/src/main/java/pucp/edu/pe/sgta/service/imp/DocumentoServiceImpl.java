package pucp.edu.pe.sgta.service.imp;

import jakarta.transaction.Transactional;
import org.springframework.stereotype.Service;
import pucp.edu.pe.sgta.dto.DocumentoConVersionDto;
import pucp.edu.pe.sgta.model.Documento;
import pucp.edu.pe.sgta.repository.DocumentoRepository;
import pucp.edu.pe.sgta.service.inter.DocumentoService;

import java.time.Instant;
import java.time.ZoneOffset;
import java.util.ArrayList;
import java.util.List;

@Service
public class DocumentoServiceImpl implements DocumentoService {
    private final DocumentoRepository documentoRepository;

    public DocumentoServiceImpl(DocumentoRepository documentoRepository) {
        this.documentoRepository = documentoRepository;
    }

    @Override
    public List<DocumentoConVersionDto> listarDocumentosPorEntregable(Integer entregableId) {
        List<Object[]> result = documentoRepository.listarDocumentosPorEntregable(entregableId);
        List<DocumentoConVersionDto> documentos = new ArrayList<>();

        for(Object[] row : result){
            DocumentoConVersionDto dto = new DocumentoConVersionDto();
            dto.setDocumentoId((Integer) row[0]);
            dto.setDocumentoNombre((String) row[1]);
            dto.setDocumentoFechaSubida(((Instant) row[2]).atOffset(ZoneOffset.UTC));
            dto.setDocumentoLinkArchivo((String) row[3]);
            dto.setEntregableTemaId((Integer) row[4]);
            documentos.add(dto);
        }
        return documentos;
    }

    @Transactional
    @Override
    public Integer create(Documento documento){
        documentoRepository.save(documento);
        return documento.getId();
    }

}
