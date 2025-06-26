package pucp.edu.pe.sgta.service.imp;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import pucp.edu.pe.sgta.dto.ReunionesXUsuariosDto;
import pucp.edu.pe.sgta.dto.UsuarioNombresDTO;
import pucp.edu.pe.sgta.mapper.UsuarioMapper;
import pucp.edu.pe.sgta.model.UsuarioXReunion;
import pucp.edu.pe.sgta.model.UsuarioXRol;
import pucp.edu.pe.sgta.model.Usuario;
import pucp.edu.pe.sgta.repository.UsuarioRepository;
import pucp.edu.pe.sgta.repository.UsuarioXReunionRepository;
import pucp.edu.pe.sgta.repository.UsuarioXRolRepository;
import pucp.edu.pe.sgta.service.inter.UsuarioXReunionService;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class UsuarioXReunionServiceImpl implements UsuarioXReunionService {

    private final UsuarioXReunionRepository usuarioXReunionRepository;
    private final UsuarioXRolRepository usuarioXRolRepository;
    private final UsuarioRepository usuarioRepository;
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
    public List<UsuarioNombresDTO> getAsesoresxAlumno(String idAlumno) {
        Optional<Usuario> usuario = usuarioRepository.findByIdCognito(idAlumno);
        if (usuario.isEmpty()) {
            throw new RuntimeException("Usuario no encontrado con ID Cognito: " + idAlumno);
        }
        Usuario user = usuario.get();
        List<Object[]> result = usuarioXReunionRepository.getAsesoresXAlumno(user.getId());
        List<UsuarioNombresDTO> asesores= new ArrayList<>();
        for (Object[] row : result) {
            UsuarioNombresDTO dto = new UsuarioNombresDTO ();
            dto.setId((Integer) row[0]);
            dto.setNombres((String) row[1]);
            dto.setPrimerApellido((String) row[2]);
            dto.setSegundoApellido((String) row[3]);
            asesores.add(dto);
        }
        return asesores;
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
                dto.setEstado(Boolean.TRUE.equals(reunion.getActivo()) ? "Activo" : "Finalizado");
                reunionesXUsuariosDtos.add(dto);
            }
        }
        return reunionesXUsuariosDtos;
    }

    @Override
    @Transactional
    public UsuarioXReunion save(UsuarioXReunion usuarioXReunion) {
        return usuarioXReunionRepository.save(usuarioXReunion);
    }

    @Override
    @Transactional
    public UsuarioXReunion update(Integer id, UsuarioXReunion usuarioXReunionActualizado) throws Exception {
        UsuarioXReunion existente = usuarioXReunionRepository.findByIdAndActivoTrue(id)
                .orElseThrow(() -> new Exception("UsuarioXReunion no encontrada con ID: " + id));

        existente.setEstadoAsistencia(usuarioXReunionActualizado.getEstadoAsistencia());
        existente.setEstadoDetalle(usuarioXReunionActualizado.getEstadoDetalle());

        return usuarioXReunionRepository.save(existente);
    }

    @Override
    @Transactional
    public void delete(Integer id) throws Exception {
        UsuarioXReunion usuarioXReunion = usuarioXReunionRepository.findByIdAndActivoTrue(id)
                .orElseThrow(() -> new Exception("UsuarioXReunion no encontrada con ID: " + id));
        usuarioXReunion.setActivo(false);
        usuarioXReunionRepository.save(usuarioXReunion);
    }

    @Override
    public Optional<UsuarioXReunion> findByReunionIdAndUsuarioId(Integer reunionId, String id) {
        Optional<Usuario> usuario = usuarioRepository.findByIdCognito(id);
        if (usuario.isEmpty()) {
            throw new RuntimeException("Usuario no encontrado con ID Cognito: " + id);
        }

        Usuario user = usuario.get();
        Integer usuarioId = user.getId();
        return usuarioXReunionRepository.findByReunionIdAndUsuarioIdAndActivoTrue(reunionId, usuarioId);
    }

    //Agregado
    @Override
    public Optional<UsuarioXReunion> findById(Integer id) {
        return usuarioXReunionRepository.findByIdAndActivoTrue(id);
    }

}