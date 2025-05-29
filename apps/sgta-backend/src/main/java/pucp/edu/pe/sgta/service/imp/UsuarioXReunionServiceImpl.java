package pucp.edu.pe.sgta.service.imp;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import pucp.edu.pe.sgta.dto.ReunionesXUsuariosDto;
import pucp.edu.pe.sgta.model.UsuarioXReunion;
import pucp.edu.pe.sgta.model.UsuarioXRol;
import pucp.edu.pe.sgta.repository.UsuarioXReunionRepository;
import pucp.edu.pe.sgta.repository.UsuarioXRolRepository;
import pucp.edu.pe.sgta.service.inter.UsuarioXReunionService;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class UsuarioXReunionServiceImpl implements UsuarioXReunionService {

    private final UsuarioXReunionRepository usuarioXReunionRepository;
    private final UsuarioXRolRepository usuarioXRolRepository;

    @Override
    public List<UsuarioXReunion> findAll() {
        return usuarioXReunionRepository.findByActivoTrue();
    }

    @Override
    public List<UsuarioXReunion> findByUsuarioId(Integer usuarioId) {
        return usuarioXReunionRepository.findByUsuarioIdAndActivoTrue(usuarioId);
    }

    @Override
    public List<UsuarioXReunion> findByReunionId(Integer reunionId) {
        return usuarioXReunionRepository.findByReunionIdAndActivoTrue(reunionId);
    }

    @Override
    public List<UsuarioXReunion> findByUsuarioIdOrderedByDate(Integer usuarioId) {
        return usuarioXReunionRepository.findByUsuarioIdAndActivoTrueOrderByReunionFechaHoraInicioDesc(usuarioId);
    }

    @Override
    public List<ReunionesXUsuariosDto> findReunionesByUser(Integer usuarioId) {
        List<UsuarioXReunion> reunionesUsuarios = usuarioXReunionRepository.findByUsuarioIdAndActivoTrue(usuarioId);
        List<Integer> reunionIds = reunionesUsuarios.stream()
                .map(usuarioReunion -> usuarioReunion.getReunion().getId())
                .distinct()
                .collect(Collectors.toList());
        List<UsuarioXReunion> reunionesAsesorAlumno = usuarioXReunionRepository.findByReunionIdIn(reunionIds);
        List<Integer> usuariosIds = reunionesAsesorAlumno.stream()
                .map(r -> r.getUsuario().getId())
                .distinct()
                .collect(Collectors.toList());
        List<UsuarioXRol> rolesXUsuarios = usuarioXRolRepository.findByUsuarioIdIn(usuariosIds);
    }

}