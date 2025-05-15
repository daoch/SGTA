package pucp.edu.pe.sgta.service.imp;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import pucp.edu.pe.sgta.dto.UsuarioDocumentoDto;
import pucp.edu.pe.sgta.exception.DocumentoNotFoundException;
import pucp.edu.pe.sgta.mapper.UsuarioDocumentoMapper;
import pucp.edu.pe.sgta.model.Documento;
import pucp.edu.pe.sgta.model.Usuario;
import pucp.edu.pe.sgta.model.UsuarioXDocumento;
import pucp.edu.pe.sgta.repository.DocumentoRepository;
import pucp.edu.pe.sgta.repository.UsuarioRepository;
import pucp.edu.pe.sgta.repository.UsuarioXDocumentoRepository;
import pucp.edu.pe.sgta.service.inter.UsuarioXDocumentoService;

import java.time.ZonedDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class UsuarioXDocumentoServiceImpl implements UsuarioXDocumentoService {

    private final UsuarioXDocumentoRepository repository;
    private final UsuarioRepository usuarioRepository;
    private final DocumentoRepository documentoRepository;

    public UsuarioXDocumentoServiceImpl(UsuarioXDocumentoRepository repository,
                                        UsuarioRepository usuarioRepository,
                                        DocumentoRepository documentoRepository) {
        this.repository = repository;
        this.usuarioRepository = usuarioRepository;
        this.documentoRepository = documentoRepository;
    }

    @Override
    @Transactional
    public UsuarioDocumentoDto asignarDocumentoAUsuario(Integer usuarioId, Integer documentoId, String permiso) {
        Usuario usuario = usuarioRepository.findById(usuarioId)
                .orElseThrow(() -> new DocumentoNotFoundException("Usuario no encontrado: " + usuarioId));
        Documento documento = documentoRepository.findById(documentoId)
                .orElseThrow(() -> new DocumentoNotFoundException("Documento no encontrado: " + documentoId));

        UsuarioXDocumento uxd = new UsuarioXDocumento();
        uxd.setUsuario(usuario);
        uxd.setDocumento(documento);
        uxd.setPermiso(permiso);
        uxd.setActivo(true);
        uxd.setFechaCreacion(ZonedDateTime.now());

        UsuarioXDocumento guardado = repository.save(uxd);
        return UsuarioDocumentoMapper.toDto(guardado);
    }

    @Override
    public List<UsuarioDocumentoDto> listarDocumentosPorUsuario(Integer usuarioId) {
        List<UsuarioXDocumento> list = repository.findByUsuarioId(usuarioId);
        return list.stream()
                .map(UsuarioDocumentoMapper::toDto)
                .collect(Collectors.toList());
    }

    @Override
    public List<UsuarioDocumentoDto> listarUsuariosPorDocumento(Integer documentoId) {
        List<UsuarioXDocumento> list = repository.findByDocumentoId(documentoId);
        return list.stream()
                .map(UsuarioDocumentoMapper::toDto)
                .collect(Collectors.toList());
    }
}