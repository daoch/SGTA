package pucp.edu.pe.sgta.service.imp;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import pucp.edu.pe.sgta.dto.RevisionDocumentoDto;
import pucp.edu.pe.sgta.exception.DocumentoNotFoundException;
import pucp.edu.pe.sgta.mapper.RevisionDocumentoMapper;
import pucp.edu.pe.sgta.model.RevisionXDocumento;
import pucp.edu.pe.sgta.model.VersionXDocumento;
import pucp.edu.pe.sgta.repository.RevisionXDocumentoRepository;
import pucp.edu.pe.sgta.repository.VersionXDocumentoRepository;
import pucp.edu.pe.sgta.service.inter.RevisionXDocumentoService;

import java.time.OffsetDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class RevisionXDocumentoServiceImpl implements RevisionXDocumentoService {

    private final RevisionXDocumentoRepository repository;
    private final VersionXDocumentoRepository versionRepository;

    public RevisionXDocumentoServiceImpl(RevisionXDocumentoRepository repository,
                                         VersionXDocumentoRepository versionRepository) {
        this.repository = repository;
        this.versionRepository = versionRepository;
    }

    @Override
    @Transactional
    public RevisionDocumentoDto crearRevision(Integer versionDocumentoId, Integer usuarioId,
                                              java.time.LocalDate fechaRevision,
                                              String estadoRevision,
                                              String linkArchivoRevision) {
        VersionXDocumento version = versionRepository.findById(versionDocumentoId)
                .orElseThrow(() -> new DocumentoNotFoundException("Versión no encontrada: " + versionDocumentoId));

        RevisionXDocumento rev = new RevisionXDocumento();
        rev.setVersionDocumento(version);
        rev.setUsuarioId(usuarioId);
        rev.setFechaRevision(fechaRevision);
        rev.setEstadoRevision(estadoRevision);
        rev.setLinkArchivoRevision(linkArchivoRevision);
        rev.setActivo(true);
        rev.setFechaCreacion(OffsetDateTime.now());

        RevisionXDocumento guardado = repository.save(rev);
        return RevisionDocumentoMapper.toDto(guardado);
    }

    @Override
    public List<RevisionDocumentoDto> listarRevisionesPorVersion(Integer versionDocumentoId) {
        List<RevisionXDocumento> list = repository.findByVersionDocumentoId(versionDocumentoId);
        return list.stream()
                .map(RevisionDocumentoMapper::toDto)
                .collect(Collectors.toList());
    }
}
