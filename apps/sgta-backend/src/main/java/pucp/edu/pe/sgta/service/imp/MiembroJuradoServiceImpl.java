package pucp.edu.pe.sgta.service.imp;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import pucp.edu.pe.sgta.dto.*;
import pucp.edu.pe.sgta.dto.temas.DetalleTemaDto;
import pucp.edu.pe.sgta.dto.temas.EtapaFormativaTemaDto;
import pucp.edu.pe.sgta.dto.temas.ExposicionTemaDto;
import pucp.edu.pe.sgta.dto.temas.ParticipanteDto;
import pucp.edu.pe.sgta.model.*;
import pucp.edu.pe.sgta.repository.*;
import pucp.edu.pe.sgta.service.inter.MiembroJuradoService;

import java.sql.Timestamp;
import java.time.Instant;
import java.time.OffsetDateTime;
import java.time.ZoneOffset;
import java.util.*;
import java.util.stream.Collectors;

@Service
public class MiembroJuradoServiceImpl implements MiembroJuradoService {

    private final UsuarioRepository usuarioRepository;
    private final UsuarioXTemaRepository usuarioXTemaRepository;
    private final EstadoTemaRepository estadoTemaRepository;
    private final RolRepository rolRepository;
    private final TemaRepository temaRepository;
    private final SubAreaConocimientoXTemaRepository subAreaConocimientoXTemaRepository;
    private final EtapaFormativaRepository etapaFormativaRepository;

    public MiembroJuradoServiceImpl(UsuarioRepository usuarioRepository, UsuarioXTemaRepository usuarioXTemaRepository,
            EstadoTemaRepository estadoTemaRepository, RolRepository rolRepository, TemaRepository temaRepository,
            SubAreaConocimientoXTemaRepository subAreaConocimientoXTemaRepository,
            EtapaFormativaRepository etapaFormativaRepository) {
        this.usuarioRepository = usuarioRepository;
        this.usuarioXTemaRepository = usuarioXTemaRepository;
        this.estadoTemaRepository = estadoTemaRepository;
        this.rolRepository = rolRepository;
        this.temaRepository = temaRepository;
        this.subAreaConocimientoXTemaRepository = subAreaConocimientoXTemaRepository;
        this.etapaFormativaRepository = etapaFormativaRepository;
    }

    @Override
    public List<MiembroJuradoDto> obtenerUsuarioTemaInfo() {

        List<Object[]> rows = usuarioRepository.findUsuarioTemaInfo();
        List<MiembroJuradoDto> resultList = new ArrayList<>();

        for (Object[] row : rows) {
            // Obtener las especialidades para este usuario
            List<String> especialidades = this.findAreaConocimientoByUsuarioId(((Number) row[0]).intValue())
                    .stream()
                    .map(obj -> (String) obj[1])
                    .collect(Collectors.toList());

            Instant fechaAsignacionInstant = (Instant) row[9];
            OffsetDateTime fechaAsignacion = fechaAsignacionInstant.atOffset(OffsetDateTime.now().getOffset());

            Usuario usuarioEncontrado = usuarioRepository.findById(((Number) row[0]).intValue()).orElse(null);

            MiembroJuradoDto dto = new MiembroJuradoDto(
                    ((Number) row[0]).intValue(), // usuario_id
                    (String) row[1], // codigo_pucp
                    (String) row[2], // nombres
                    (String) row[3], // primer_apellido
                    (String) row[4], // segundo_apellido
                    (String) row[5], // correo_electronico
                    (String) row[6], // nivel_estudios
                    ((Number) row[7]).intValue(), // cantidad_temas_asignados
                    usuarioEncontrado.getTipoDedicacion().getIniciales(),
                    (boolean) row[8],
                    fechaAsignacion, // fecha_asignacion convertida a OffsetDateTime
                    especialidades);
            resultList.add(dto);
        }

        return resultList;
    }

    @Override
    public List<Object[]> findAreaConocimientoByUsuarioId(Integer usuarioId) {
        return usuarioRepository.findAreaConocimientoByUsuarioId(usuarioId);
    }

    @Override
    public List<MiembroJuradoDto> obtenerUsuariosPorEstado(Boolean activoParam) {
        List<Object[]> rows = usuarioRepository.obtenerUsuariosPorEstado(activoParam);
        List<MiembroJuradoDto> resultList = new ArrayList<>();

        for (Object[] row : rows) {
            // Obtener las especialidades para este usuario
            List<String> especialidades = this.findAreaConocimientoByUsuarioId(((Number) row[0]).intValue())
                    .stream()
                    .map(obj -> (String) obj[1])
                    .collect(Collectors.toList());

            Instant fechaAsignacionInstant = (Instant) row[9];
            OffsetDateTime fechaAsignacion = fechaAsignacionInstant.atOffset(OffsetDateTime.now().getOffset());

            Usuario usuarioEncontrado = usuarioRepository.findById(((Number) row[0]).intValue()).orElse(null);

            MiembroJuradoDto dto = new MiembroJuradoDto(
                    ((Number) row[0]).intValue(), // usuario_id
                    (String) row[1], // codigo_pucp
                    (String) row[2], // nombres
                    (String) row[3], // primer_apellido
                    (String) row[4], // segundo_apellido
                    (String) row[5], // correo_electronico
                    (String) row[6], // nivel_estudios
                    ((Number) row[7]).intValue(), // cantidad_temas_asignados
                    usuarioEncontrado.getTipoDedicacion().getIniciales(),
                    (boolean) row[8],
                    fechaAsignacion, // fecha_asignacion convertida a OffsetDateTime
                    especialidades);
            resultList.add(dto);
        }

        return resultList;

    }

    @Override
    public List<MiembroJuradoDto> obtenerUsuariosPorAreaConocimiento(Integer areaConocimientoId) {
        List<Object[]> rows = usuarioRepository.obtenerUsuariosPorAreaConocimiento(areaConocimientoId);
        List<MiembroJuradoDto> resultList = new ArrayList<>();
        for (Object[] row : rows) {
            // Obtener las especialidades para este usuario
            List<String> especialidades = this.findAreaConocimientoByUsuarioId(((Number) row[0]).intValue())
                    .stream()
                    .map(obj -> (String) obj[1])
                    .collect(Collectors.toList());

            Instant fechaAsignacionInstant = (Instant) row[9];
            OffsetDateTime fechaAsignacion = fechaAsignacionInstant.atOffset(OffsetDateTime.now().getOffset());

            Usuario usuarioEncontrado = usuarioRepository.findById(((Number) row[0]).intValue()).orElse(null);

            MiembroJuradoDto dto = new MiembroJuradoDto(
                    ((Number) row[0]).intValue(), // usuario_id
                    (String) row[1], // codigo_pucp
                    (String) row[2], // nombres
                    (String) row[3], // primer_apellido
                    (String) row[4], // segundo_apellido
                    (String) row[5], // correo_electronico
                    (String) row[6], // nivel_estudios
                    ((Number) row[7]).intValue(), // cantidad_temas_asignados
                    usuarioEncontrado.getTipoDedicacion().getIniciales(),
                    (boolean) row[8],
                    fechaAsignacion, // fecha_asignacion convertida a OffsetDateTime
                    especialidades);
            resultList.add(dto);
        }

        return resultList;
    }

    @Override
    @Transactional
    public Optional<Map<String, Object>> deleteUserJurado(Integer usuarioId) {
        Optional<Usuario> usuarioOpt = usuarioRepository.findById(usuarioId);
        if (usuarioOpt.isPresent()) {
            Usuario usuario = usuarioOpt.get();

            List<UsuarioXTema> usuarioTemas = usuarioXTemaRepository.findByUsuarioIdAndRolId(usuarioId, 2);
            boolean eliminarUsuario = true;

            for (UsuarioXTema usuarioTema : usuarioTemas) {
                Integer estadoTemaId = usuarioTema.getTema().getEstadoTema().getId();
                if (estadoTemaId != 7 && estadoTemaId != 12) {
                    eliminarUsuario = false;
                    break;
                }
            }

            Map<String, Object> userInfo = new HashMap<>();
            userInfo.put("nombre", usuario.getNombres());
            userInfo.put("apellido", usuario.getPrimerApellido() + " " + usuario.getSegundoApellido());
            userInfo.put("codigo", usuario.getCodigoPucp());
            userInfo.put("correo", usuario.getCorreoElectronico());
            userInfo.put("eliminado", eliminarUsuario);

            if (eliminarUsuario) {
                usuario.setActivo(false);
                usuarioRepository.save(usuario);
            }

            return Optional.of(userInfo);
        }
        return Optional.empty();
    }

    @Override
    public List<JuradoXAreaConocimientoDto> findAreaConocimientoByUser(Integer usuarioId) {
        List<Object[]> rows = usuarioRepository.obtenerAreasConocimientoJurado(usuarioId);

        List<JuradoAreaDto> juradoAreaDtos = new ArrayList<>();
        for (Object[] row : rows) {
            Integer areaId = (Integer) row[1];
            String areaNombre = (String) row[2];
            JuradoAreaDto areaDto = JuradoAreaDto.builder()
                    .id(areaId)
                    .nombre(areaNombre)
                    .build();
            juradoAreaDtos.add(areaDto);
        }
        JuradoXAreaConocimientoDto result = JuradoXAreaConocimientoDto.builder()
                .juradoAreaDtos(juradoAreaDtos)
                .build();

        return List.of(result);
    }

    @Override
    public ResponseEntity<?> asignarJuradoATema(AsignarJuradoRequest request) {
        Integer usuarioId = request.getUsuarioId();
        Integer temaId = request.getTemaId();

        Optional<Usuario> usuarioOpt = usuarioRepository.findById(usuarioId);
        if (usuarioOpt.isEmpty()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(Map.of("mensaje", "El jurado no existe"));
        }
        Rol rol = rolRepository.findById(2)
                .orElseThrow(() -> new RuntimeException("Rol jurado no encontrado"));

        List<UsuarioXTema> juradoExistente = usuarioXTemaRepository.findByUsuarioIdAndRolId(usuarioId, 2);
        if (juradoExistente.isEmpty()) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(Map.of("mensaje", "El usuario no tiene el rol de jurado"));
        }

        Optional<Tema> temaOpt = temaRepository.findById(temaId);
        if (temaOpt.isEmpty()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(Map.of("mensaje", "El tema no existe"));
        }

        UsuarioXTema asignacion = new UsuarioXTema();
        asignacion.setUsuario(usuarioOpt.get());
        asignacion.setTema(temaOpt.get());
        asignacion.setRol(rol);
        asignacion.setAsignado(true);
        asignacion.setRechazado(false);
        asignacion.setActivo(true);
        asignacion.setFechaCreacion(OffsetDateTime.now());
        asignacion.setFechaModificacion(OffsetDateTime.now());

        usuarioXTemaRepository.save(asignacion);

        return ResponseEntity.ok(Map.of("mensaje", "Jurado asignado correctamente"));
    }

    @Override
    public List<MiembroJuradoXTemaDto> findByUsuarioIdAndActivoTrueAndRolId(Integer usuarioId) {
        List<UsuarioXTema> temasJurado = usuarioXTemaRepository.findByUsuarioIdAndActivoTrue(usuarioId);

        return temasJurado.stream()
                .filter(ut -> ut.getRol().getId().equals(2))
                .filter(ut -> esEstadoTemaValido(ut.getTema().getEstadoTema()))
                .filter(tema -> usuarioXTemaRepository.countByTemaIdAndActivoTrue(tema.getId()) < 3)
                .map(ut -> {
                    Tema tema = ut.getTema();

                    List<EstudiantesDto> estudiantes = usuarioXTemaRepository.findByTemaIdAndActivoTrue(tema.getId())
                            .stream()
                            .filter(rel -> rel.getUsuario().getTipoUsuario().getId().equals(2))
                            .map(rel -> {
                                Usuario u = rel.getUsuario();
                                return EstudiantesDto.builder()
                                        .nombre(u.getNombres() + " " + u.getPrimerApellido() + " "
                                                + u.getSegundoApellido())
                                        .codigo(u.getCodigoPucp())
                                        .build();
                            }).toList();

                    List<SubAreasConocimientoDto> subAreas = subAreaConocimientoXTemaRepository
                            .findByTemaIdAndActivoTrue(tema.getId()).stream()
                            .map(sac -> {
                                SubAreaConocimiento sub = sac.getSubAreaConocimiento();
                                return SubAreasConocimientoDto.builder()
                                        .id(sub.getId())
                                        .nombre(sub.getNombre())
                                        .id_area_conocimiento(sub.getAreaConocimiento().getId())
                                        .build();
                            }).toList();

                    return MiembroJuradoXTemaDto.builder()
                            .id(tema.getId())
                            .titulo(tema.getTitulo())
                            .codigo(tema.getCodigo())
                            .estudiantes(estudiantes)
                            .sub_areas_conocimiento(subAreas)
                            .build();
                })
                .toList();
    }

    @Override
    public List<MiembroJuradoXTemaTesisDto> findTemaTesisByUsuario(Integer usuarioId) {

        List<UsuarioXTema> temasJurado = usuarioXTemaRepository.findByUsuarioIdAndActivoTrue(usuarioId);

        return temasJurado.stream()
                .filter(ut -> ut.getRol().getId().equals(2))
                .filter(ut -> esEstadoTemaValido(ut.getTema().getEstadoTema()))
                .filter(tema -> usuarioXTemaRepository.countByTemaIdAndActivoTrue(tema.getId()) < 3)
                .map(ut -> {
                    Tema tema = ut.getTema();

                    List<EstudiantesDto> estudiantes = usuarioXTemaRepository.findByTemaIdAndActivoTrue(tema.getId())
                            .stream()
                            .filter(rel -> rel.getUsuario().getTipoUsuario().getId().equals(2))
                            .map(rel -> {
                                Usuario u = rel.getUsuario();
                                return EstudiantesDto.builder()
                                        .nombre(u.getNombres() + " " + u.getPrimerApellido() + " "
                                                + u.getSegundoApellido())
                                        .codigo(u.getCodigoPucp())
                                        .build();
                            }).toList();

                    List<SubAreasConocimientoDto> subAreas = subAreaConocimientoXTemaRepository
                            .findByTemaIdAndActivoTrue(tema.getId()).stream()
                            .map(sac -> {
                                SubAreaConocimiento sub = sac.getSubAreaConocimiento();
                                return SubAreasConocimientoDto.builder()
                                        .id(sub.getId())
                                        .nombre(sub.getNombre())
                                        .id_area_conocimiento(sub.getAreaConocimiento().getId())
                                        .build();
                            }).toList();
                    System.out.println("Tema ID: " + tema.getId() + ", Título: " + tema.getTitulo());

                    // Rol del usuario
                    String rolNombre = ut.getRol().getNombre();

                    List<Object[]> resultadoFuncion = temaRepository.obtenerCicloEtapaPorTema(tema.getId());

                    CicloTesisDto cicloDto = null;
                    EtapaFormativaTesisDto etapaDto = null;

                    if (!resultadoFuncion.isEmpty()) {
                        Object[] fila = resultadoFuncion.get(0);
                        Integer cicloId = (Integer) fila[0];
                        String cicloNombre = (String) fila[1];
                        Integer etapaFormativaId = (Integer) fila[2];
                        String etapaFormativaNombre = (String) fila[3];

                        cicloDto = new CicloTesisDto(cicloId, cicloNombre);
                        etapaDto = new EtapaFormativaTesisDto(etapaFormativaId, etapaFormativaNombre);
                    }

                    // Estado del tema
                    EstadoTema estado = tema.getEstadoTema();
                    EstadoTemaDto estadoDto = estado != null ? new EstadoTemaDto(estado.getId(), estado.getNombre())
                            : null;

                    return new MiembroJuradoXTemaTesisDto(
                            tema.getId(),
                            tema.getTitulo(),
                            tema.getCodigo(),
                            tema.getResumen(),
                            rolNombre,
                            estudiantes,
                            subAreas,
                            etapaDto,
                            cicloDto,
                            estadoDto);
                })
                .toList();
    }

    @Override
    public List<MiembroJuradoXTemaDto> findTemasDeOtrosJurados(Integer usuarioId) {
        Set<Integer> temasDelUsuario = usuarioXTemaRepository.findAll().stream()
                .filter(ut -> ut.getActivo())
                .filter(ut -> ut.getUsuario().getId().equals(usuarioId))
                .map(ut -> ut.getTema().getId())
                .collect(Collectors.toSet());

        Map<Integer, UsuarioXTema> relacionesJurado = usuarioXTemaRepository.findAll().stream()
                .filter(ut -> ut.getActivo())
                .filter(ut -> ut.getRol().getId().equals(4))
                // .filter(ut -> !ut.getUsuario().getId().equals(usuarioId))
                .filter(ut -> !temasDelUsuario.contains(ut.getTema().getId()))
                .filter(ut -> esEstadoTemaValido(ut.getTema().getEstadoTema()))
                .filter(ut -> usuarioXTemaRepository.obtenerJuradosPorTema(ut.getTema().getId()) < 3)
                .collect(Collectors.toMap(
                        ut -> ut.getTema().getId(), // clave: ID del tema
                        ut -> ut,
                        (existing, replacement) -> existing));

        return relacionesJurado.values().stream()
                .map(ut -> {
                    Tema tema = ut.getTema();

                    List<EstudiantesDto> estudiantes = usuarioXTemaRepository.findByTemaIdAndActivoTrue(tema.getId())
                            .stream()
                            .filter(rel -> rel.getUsuario().getTipoUsuario().getId().equals(2))
                            .map(rel -> {
                                Usuario u = rel.getUsuario();
                                return EstudiantesDto.builder()
                                        .nombre(u.getNombres() + " " + u.getPrimerApellido() + " "
                                                + u.getSegundoApellido())
                                        .codigo(u.getCodigoPucp())
                                        .build();
                            }).toList();

                    List<SubAreasConocimientoDto> subAreas = subAreaConocimientoXTemaRepository
                            .findByTemaIdAndActivoTrue(tema.getId()).stream()
                            .map(sac -> {
                                SubAreaConocimiento sub = sac.getSubAreaConocimiento();
                                return SubAreasConocimientoDto.builder()
                                        .id(sub.getId())
                                        .nombre(sub.getNombre())
                                        .id_area_conocimiento(sub.getAreaConocimiento().getId())
                                        .build();
                            }).toList();

                    return MiembroJuradoXTemaDto.builder()
                            .id(tema.getId())
                            .titulo(tema.getTitulo())
                            .codigo(tema.getCodigo())
                            .estudiantes(estudiantes)
                            .sub_areas_conocimiento(subAreas)
                            .build();
                })
                .toList();
    }

    @Override
    public ResponseEntity<?> desasignarJuradoDeTema(AsignarJuradoRequest request) {
        Integer usuarioId = request.getUsuarioId();
        Integer temaId = request.getTemaId();

        Optional<UsuarioXTema> asignacionOpt = usuarioXTemaRepository
                .findByUsuarioIdAndTemaIdAndRolIdAndActivoTrue(usuarioId, temaId, 2);

        if (asignacionOpt.isEmpty()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(Map.of("mensaje", "No existe una asignación activa entre este jurado y el tema"));
        }

        UsuarioXTema asignacion = asignacionOpt.get();
        asignacion.setActivo(false);
        asignacion.setFechaModificacion(OffsetDateTime.now());

        usuarioXTemaRepository.save(asignacion);

        return ResponseEntity.ok(Map.of("mensaje", "Asignación eliminada correctamente"));
    }

    @Override
    public DetalleTemaDto obtenerDetalleTema(Integer temaId) {
        List<UsuarioXTema> usuariosXTema = usuarioXTemaRepository.findByTemaIdAndActivoTrue(temaId);
        List<ParticipanteDto> estudiantes = new ArrayList<>();
        List<ParticipanteDto> asesores = new ArrayList<>();
        List<ParticipanteDto> jurados = new ArrayList<>();

        for (UsuarioXTema ut : usuariosXTema) {
            Integer rolId = ut.getRol().getId();
            String nombre = ut.getUsuario().getNombres() + " " + ut.getUsuario().getPrimerApellido() + " "
                    + ut.getUsuario().getSegundoApellido();
            Integer id = ut.getUsuario().getId();

            if (rolId == 4) {
                estudiantes.add(new ParticipanteDto(id, nombre, "Estudiante"));
            } else if (rolId == 1) {
                asesores.add(new ParticipanteDto(id, nombre, "Asesor"));
            } else if (rolId == 5) {
                asesores.add(new ParticipanteDto(id, nombre, "Coasesor"));
            } else if (rolId == 2) {
                jurados.add(new ParticipanteDto(id, nombre, "Miembro de Jurado"));
            }
        }

        List<Object[]> etapasRaw = etapaFormativaRepository.obtenerEtapasFormativasPorTemaSimple(temaId);
        List<EtapaFormativaTemaDto> etapas = new ArrayList<>();

        for (Object[] etapa : etapasRaw) {
            Integer etapaId = (Integer) etapa[0];
            String nombreEtapa = (String) etapa[1];

            List<Object[]> exposicionesRaw = etapaFormativaRepository
                    .obtenerExposicionesPorEtapaFormativaPorTemaId(etapaId, temaId);
            List<ExposicionTemaDto> exposiciones = exposicionesRaw.stream().map(exp -> new ExposicionTemaDto(
                    (Integer) exp[0],
                    (String) exp[1],
                    exp[2].toString(),
                    ((Instant) exp[3]).atOffset(ZoneOffset.UTC),
                    ((Instant) exp[4]).atOffset(ZoneOffset.UTC),
                    (String) exp[5])).collect(Collectors.toList());

            etapas.add(new EtapaFormativaTemaDto(etapaId, nombreEtapa, exposiciones));
        }
        return new DetalleTemaDto(estudiantes, asesores, jurados, etapas);
    }

    private boolean esEstadoTemaValido(EstadoTema estadoTema) {
        List<Integer> estadosInvalidos = List.of(7, 9, 12);
        return !estadosInvalidos.contains(estadoTema.getId());
    }

    @Override
    public ResponseEntity<?> desasignarJuradoDeTemaTodos(Integer usuarioId) {

        List<UsuarioXTema> asignaciones = usuarioXTemaRepository.findByUsuarioIdAndRolId(usuarioId, 2);
        if (asignaciones.isEmpty()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(Map.of("mensaje", "No existen asignaciones activas para este miembro de jurado"));
        }

        for (UsuarioXTema asignacion : asignaciones) {
            asignacion.setActivo(false);
            asignacion.setFechaModificacion(OffsetDateTime.now());
            usuarioXTemaRepository.save(asignacion);
        }

        return ResponseEntity.ok(Map.of("mensaje", "Todas las asignaciones del miembro de jurado han sido eliminadas"));
    }
}
