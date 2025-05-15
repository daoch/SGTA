package pucp.edu.pe.sgta.service.imp;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import pucp.edu.pe.sgta.dto.VersionDocumentoDto;
import pucp.edu.pe.sgta.exception.DocumentoNotFoundException;
import pucp.edu.pe.sgta.mapper.VersionDocumentoMapper;
import pucp.edu.pe.sgta.model.Documento;
import pucp.edu.pe.sgta.model.VersionXDocumento;
import pucp.edu.pe.sgta.repository.DocumentoRepository;
import pucp.edu.pe.sgta.repository.VersionXDocumentoRepository;
import pucp.edu.pe.sgta.service.inter.VersionXDocumentoService;

import java.time.OffsetDateTime;

@Service
public class VersionXDocumentoServiceImpl implements VersionXDocumentoService {

    private final VersionXDocumentoRepository repository;
    private final DocumentoRepository documentoRepository;

    public VersionXDocumentoServiceImpl(VersionXDocumentoRepository repository,
                                        DocumentoRepository documentoRepository) {
        this.repository = repository;
        this.documentoRepository = documentoRepository;
    }

    @Override
    @Transactional
    public VersionDocumentoDto crearVersion(Integer documentoId, String linkArchivoSubido) {
        Documento doc = documentoRepository.findById(documentoId)
                .orElseThrow(() -> new DocumentoNotFoundException("Documento no encontrado: " + documentoId));

        int nextVersion = 0;

        VersionXDocumento ver = new VersionXDocumento();
        ver.setDocumento(doc);
        ver.setFechaUltimaSubida(OffsetDateTime.now());
        ver.setNumeroVersion(nextVersion);
        ver.setLinkArchivoSubido(linkArchivoSubido);
        ver.setActivo(true);
        ver.setFechaCreacion(OffsetDateTime.now());

        VersionXDocumento guardado = repository.save(ver);
        return VersionDocumentoMapper.toDto(guardado);
    }
}