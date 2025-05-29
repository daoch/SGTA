package pucp.edu.pe.sgta.service.imp;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import pucp.edu.pe.sgta.dto.ReunionesXUsuariosDto;
import pucp.edu.pe.sgta.mapper.UsuarioMapper;
import pucp.edu.pe.sgta.model.UsuarioXReunion;
import pucp.edu.pe.sgta.model.UsuarioXRol;
import pucp.edu.pe.sgta.repository.UsuarioXReunionRepository;
import pucp.edu.pe.sgta.repository.UsuarioXRolRepository;
import pucp.edu.pe.sgta.service.inter.UsuarioXReunionService;

import java.util.ArrayList;
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
    public List<ReunionesXUsuariosDto> findReunionesAlumnoAsesor() {
        List<UsuarioXReunion> reunionesUsuarios = usuarioXReunionRepository.findByActivoTrue();

        List<Integer> reunionIds = reunionesUsuarios.stream()
                .map(usuarioReunion -> usuarioReunion.getReunion().getId())
                .distinct()
                .collect(Collectors.toList());

        List<ReunionesXUsuariosDto> reunionesXUsuariosDtos = new ArrayList<>();

        for (Integer reunionId : reunionIds) {
            List<UsuarioXReunion> reunionesAsesorAlumno = usuarioXReunionRepository.findByReunionIdAndActivoTrue(reunionId);

            List<Integer> usuariosIds = reunionesAsesorAlumno.stream()
                    .map(r -> r.getUsuario().getId())
                    .distinct()
                    .collect(Collectors.toList());

            List<UsuarioXRol> rolesXUsuarios = usuarioXRolRepository.findByUsuarioIdIn(usuariosIds);
            ReunionesXUsuariosDto dto = new ReunionesXUsuariosDto();

            for (UsuarioXReunion reunion : reunionesAsesorAlumno) {
                for (UsuarioXRol role : rolesXUsuarios) {
                    if (reunion.getUsuario().getId().equals(role.getUsuario().getId())) {
                        if (role.getRol().getNombre().equals("Asesor")) {
                            dto.setAsesor(UsuarioMapper.toDto(role.getUsuario()));
                        }
                        if (role.getRol().getNombre().equals("Tesista")) {
                            dto.setAlumno(UsuarioMapper.toDto(role.getUsuario()));
                        }
                        if (role.getRol().getNombre().equals("Coasesor")) {
                            dto.setCoasesor(UsuarioMapper.toDto(role.getUsuario()));
                        }
                    }
                }
                dto.setEstado(reunion.getEstadoDetalle());
                reunionesXUsuariosDtos.add(dto);
            }
        }
        return reunionesXUsuariosDtos;
    }
}