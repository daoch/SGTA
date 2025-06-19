package pucp.edu.pe.sgta.service.imp;

import jakarta.persistence.EntityNotFoundException;
import org.springframework.context.ApplicationEventPublisher;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;
import pucp.edu.pe.sgta.dto.*;
import pucp.edu.pe.sgta.dto.calificacion.*;
import pucp.edu.pe.sgta.dto.coordinador.ExposicionCoordinadorDto;
import pucp.edu.pe.sgta.dto.etapas.EtapasFormativasDto;
import pucp.edu.pe.sgta.dto.exposiciones.EstadoControlExposicionRequest;
import pucp.edu.pe.sgta.dto.exposiciones.EstadoExposicionJuradoRequest;
import pucp.edu.pe.sgta.dto.exposiciones.ExposicionTemaMiembrosDto;
import pucp.edu.pe.sgta.dto.exposiciones.MiembroExposicionDto;
import pucp.edu.pe.sgta.dto.temas.DetalleTemaDto;
import pucp.edu.pe.sgta.dto.temas.EtapaFormativaTemaDto;
import pucp.edu.pe.sgta.dto.temas.ExposicionTemaDto;
import pucp.edu.pe.sgta.dto.temas.ParticipanteDto;
import pucp.edu.pe.sgta.event.EstadoControlExposicionActualizadoEvent;
import pucp.edu.pe.sgta.event.ExposicionCalificadaEvent;
import pucp.edu.pe.sgta.model.*;
import pucp.edu.pe.sgta.repository.*;
import pucp.edu.pe.sgta.service.inter.MiembroJuradoService;
import pucp.edu.pe.sgta.service.inter.UsuarioService;
import pucp.edu.pe.sgta.util.EstadoExposicion;
import pucp.edu.pe.sgta.dto.exposiciones.EstadoExposicionDto;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.Instant;
import java.time.OffsetDateTime;
import java.time.ZoneOffset;
import java.util.*;
import java.util.stream.Collectors;

@Service
public class MiembroJuradoServiceImpl implements MiembroJuradoService {

        private final UsuarioRepository usuarioRepository;
        private final UsuarioXTemaRepository usuarioXTemaRepository;
        private final RolRepository rolRepository;
        private final TemaRepository temaRepository;
        private final SubAreaConocimientoXTemaRepository subAreaConocimientoXTemaRepository;
        private final EtapaFormativaRepository etapaFormativaRepository;
        private final ExposicionXTemaRepository exposicionXTemaRepository;
        private final BloqueHorarioExposicionRepository bloqueHorarioExposicionRepository;
        private final ControlExposicionUsuarioTemaRepository controlExposicionUsuarioTemaRepository;
        private final ApplicationEventPublisher eventPublisher;
        private final CriterioExposicionRepository criterioExposicionRepository;
        private final RevisionCriterioExposicionRepository revisionCriterioExposicionRepository;
        private final ParametroConfiguracionRepository parametroConfiguracionRepository;
        private final CarreraXParametroConfiguracionRepository carreraXParametroConfiguracionRepository;
        private final UsuarioService usuarioService;
        private final UsuarioXRolRepository usuarioRolRepository;
        private final EtapaFormativaXCicloXTemaRepository etapaFormativaXCicloXTemaRepository;
        private final UsuarioXAreaConocimientoRepository usuarioXAreaConocimientoRepository;

        public MiembroJuradoServiceImpl(UsuarioRepository usuarioRepository,
                                        UsuarioXTemaRepository usuarioXTemaRepository,
                                        RolRepository rolRepository,
                                        TemaRepository temaRepository,
                                        SubAreaConocimientoXTemaRepository subAreaConocimientoXTemaRepository,
                                        EtapaFormativaRepository etapaFormativaRepository,
                                        ExposicionXTemaRepository exposicionXTemaRepository,
                                        BloqueHorarioExposicionRepository bloqueHorarioExposicionRepository,
                                        ControlExposicionUsuarioTemaRepository controlExposicionUsuarioTemaRepository,
                                        ApplicationEventPublisher eventPublisher,
                                        CriterioExposicionRepository criterioExposicionRepository,
                                        RevisionCriterioExposicionRepository revisionCriterioExposicionRepository,
                                        ParametroConfiguracionRepository parametroConfiguracionRepository,
                                        CarreraXParametroConfiguracionRepository carreraXParametroConfiguracionRepository,
                                        UsuarioService usuarioService, UsuarioXRolRepository usuarioRolRepository, EtapaFormativaXCicloXTemaRepository etapaFormativaXCicloXTemaRepository, UsuarioXAreaConocimientoRepository usuarioXAreaConocimientoRepository) {
                this.usuarioRepository = usuarioRepository;
                this.usuarioXTemaRepository = usuarioXTemaRepository;
                this.rolRepository = rolRepository;
                this.temaRepository = temaRepository;
                this.subAreaConocimientoXTemaRepository = subAreaConocimientoXTemaRepository;
                this.etapaFormativaRepository = etapaFormativaRepository;
                this.exposicionXTemaRepository = exposicionXTemaRepository;
                this.bloqueHorarioExposicionRepository = bloqueHorarioExposicionRepository;
                this.controlExposicionUsuarioTemaRepository = controlExposicionUsuarioTemaRepository;
                this.eventPublisher = eventPublisher;
                this.criterioExposicionRepository = criterioExposicionRepository;
                this.revisionCriterioExposicionRepository = revisionCriterioExposicionRepository;
                this.parametroConfiguracionRepository = parametroConfiguracionRepository;
                this.carreraXParametroConfiguracionRepository = carreraXParametroConfiguracionRepository;
                this.usuarioService = usuarioService;
            this.usuarioRolRepository = usuarioRolRepository;
            this.etapaFormativaXCicloXTemaRepository = etapaFormativaXCicloXTemaRepository;
            this.usuarioXAreaConocimientoRepository = usuarioXAreaConocimientoRepository;
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
                        OffsetDateTime fechaAsignacion = fechaAsignacionInstant
                                        .atOffset(OffsetDateTime.now().getOffset());

                        Usuario usuarioEncontrado = usuarioRepository.findById(((Number) row[0]).intValue())
                                        .orElse(null);

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
                        OffsetDateTime fechaAsignacion = fechaAsignacionInstant
                                        .atOffset(OffsetDateTime.now().getOffset());

                        Usuario usuarioEncontrado = usuarioRepository.findById(((Number) row[0]).intValue())
                                        .orElse(null);

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
                        OffsetDateTime fechaAsignacion = fechaAsignacionInstant
                                        .atOffset(OffsetDateTime.now().getOffset());

                        Usuario usuarioEncontrado = usuarioRepository.findById(((Number) row[0]).intValue())
                                        .orElse(null);

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

                // List<UsuarioXTema> juradoExistente =
                // usuarioXTemaRepository.findByUsuarioIdAndRolId(usuarioId, 2);
                // if (juradoExistente.isEmpty()) {
                // return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                // .body(Map.of("mensaje", "El usuario no tiene el rol de jurado"));
                // }

                Optional<Tema> temaOpt = temaRepository.findById(temaId);
                if (temaOpt.isEmpty()) {
                        return ResponseEntity.status(HttpStatus.NOT_FOUND)
                                        .body(Map.of("mensaje", "El tema no existe"));
                }

                // buscar si ya existe una asignacion para este usuario y tema
                Optional<UsuarioXTema> juradoExistenteOpt = usuarioXTemaRepository.findByUsuario_IdAndTema_Id(usuarioId,
                                temaId);
                if (juradoExistenteOpt.isPresent()) {
                        UsuarioXTema juradoExiste = juradoExistenteOpt.get();

                        // si el registro existe y esta inactivo, actualizamos el campo activo
                        if (!juradoExiste.getActivo()) {
                                juradoExiste.setActivo(true);
                                usuarioXTemaRepository.save(juradoExiste);
                                return ResponseEntity.ok(Map.of("mensaje", "Jurado reactivado correctamente"));
                        } else {
                                return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                                                .body(Map.of("mensaje",
                                                                "El jurado ya está asignado y activo para este tema"));
                        }
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

                // llamar al procedure de insertar revision criterio exposicion repository
                revisionCriterioExposicionRepository
                                .insertarRevisionCriterioExposicion(temaId, usuarioId);

                return ResponseEntity.ok(Map.of("mensaje", "Jurado asignado correctamente"));
        }

        @Override
        public List<MiembroJuradoXTemaDto> findByUsuarioIdAndActivoTrueAndRolId(Integer usuarioId) {

                List<UsuarioXTema> temasJurado = usuarioXTemaRepository.findByUsuarioIdAndActivoTrue(usuarioId);

                ParametroConfiguracion parametroConfiguracion = parametroConfiguracionRepository
                                .findByNombre("Cantidad Jurados")
                                .orElseThrow(() -> new RuntimeException("Parámetro no encontrado"));

                CarreraXParametroConfiguracion carreraXParametroConfiguracion = carreraXParametroConfiguracionRepository
                                .findFirstByParametroConfiguracionId(parametroConfiguracion.getId())
                                .orElseThrow(() -> new RuntimeException(
                                                "No se encontro carrera x parametro configuración"));

                int limite = Integer.parseInt(carreraXParametroConfiguracion.getValor()) - 1;
                return temasJurado.stream()
                                .filter(ut -> ut.getRol().getId().equals(2))
                                .filter(ut -> esEstadoTemaValido(ut.getTema().getEstadoTema()))
                                .filter(ut -> {
                                        long cantidadJurados = usuarioXTemaRepository
                                                        .findByTemaIdAndActivoTrue(ut.getTema().getId())
                                                        .stream()
                                                        .filter(rel -> rel.getRol().getId().equals(2)) // solo jurados
                                                        .count();
                                        return cantidadJurados < limite;
                                })
                                .map(ut -> {
                                        Tema tema = ut.getTema();

                                        List<EstudiantesDto> estudiantes = usuarioXTemaRepository
                                                        .findByTemaIdAndActivoTrue(tema.getId())
                                                        .stream()
                                                        .filter(rel -> rel.getUsuario().getTipoUsuario().getId()
                                                                        .equals(2))
                                                        .map(rel -> {
                                                                Usuario u = rel.getUsuario();
                                                                return EstudiantesDto.builder()
                                                                                .nombre(u.getNombres() + " "
                                                                                                + u.getPrimerApellido()
                                                                                                + " "
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
                                                                                .id_area_conocimiento(sub
                                                                                                .getAreaConocimiento()
                                                                                                .getId())
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

                                        List<EstudiantesDto> estudiantes = usuarioXTemaRepository
                                                        .findByTemaIdAndActivoTrue(tema.getId())
                                                        .stream()
                                                        .filter(rel -> rel.getUsuario().getTipoUsuario().getId()
                                                                        .equals(2))
                                                        .map(rel -> {
                                                                Usuario u = rel.getUsuario();
                                                                return EstudiantesDto.builder()
                                                                                .nombre(u.getNombres() + " "
                                                                                                + u.getPrimerApellido()
                                                                                                + " "
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
                                                                                .id_area_conocimiento(sub
                                                                                                .getAreaConocimiento()
                                                                                                .getId())
                                                                                .build();
                                                        }).toList();
                                        System.out.println(
                                                        "Tema ID: " + tema.getId() + ", Título: " + tema.getTitulo());

                                        // Rol del usuario
                                        String rolNombre = ut.getRol().getNombre();

                                        List<Object[]> resultadoFuncion = temaRepository
                                                        .obtenerCicloEtapaPorTema(tema.getId());

                                        CicloTesisDto cicloDto = null;
                                        EtapaFormativaTesisDto etapaDto = null;

                                        if (!resultadoFuncion.isEmpty()) {
                                                Object[] fila = resultadoFuncion.get(0);
                                                Integer cicloId = (Integer) fila[0];
                                                String cicloNombre = (String) fila[1];
                                                Integer etapaFormativaId = (Integer) fila[2];
                                                String etapaFormativaNombre = (String) fila[3];

                                                cicloDto = new CicloTesisDto(cicloId, cicloNombre);
                                                etapaDto = new EtapaFormativaTesisDto(etapaFormativaId,
                                                                etapaFormativaNombre);
                                        }

                                        // Estado del tema
                                        EstadoTema estado = tema.getEstadoTema();
                                        EstadoTemaDto estadoDto = estado != null
                                                        ? new EstadoTemaDto(estado.getId(), estado.getNombre())
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

                ParametroConfiguracion parametroConfiguracion = parametroConfiguracionRepository
                                .findByNombre("Cantidad Jurados")
                                .orElseThrow(() -> new RuntimeException("Parámetro no encontrado"));

                CarreraXParametroConfiguracion carreraXParametroConfiguracion = carreraXParametroConfiguracionRepository
                                .findFirstByParametroConfiguracionId(parametroConfiguracion.getId())
                                .orElseThrow(() -> new RuntimeException(
                                                "No se encontro carrera x parametro configuración"));

                Map<Integer, UsuarioXTema> relacionesJurado = usuarioXTemaRepository.findAll().stream()
                                .filter(ut -> ut.getActivo())
                                .filter(ut -> ut.getRol().getId().equals(4))
                                // .filter(ut -> !ut.getUsuario().getId().equals(usuarioId))
                                .filter(ut -> !temasDelUsuario.contains(ut.getTema().getId()))
                                .filter(ut -> esEstadoTemaValido(ut.getTema().getEstadoTema()))
                                .filter(ut -> usuarioXTemaRepository.obtenerJuradosPorTema(ut.getTema()
                                                .getId()) < Integer.parseInt(carreraXParametroConfiguracion.getValor()))
                                .collect(Collectors.toMap(
                                                ut -> ut.getTema().getId(), // clave: ID del tema
                                                ut -> ut,
                                                (existing, replacement) -> existing));

                return relacionesJurado.values().stream()
                                .map(ut -> {
                                        Tema tema = ut.getTema();

                                        List<EstudiantesDto> estudiantes = usuarioXTemaRepository
                                                        .findByTemaIdAndActivoTrue(tema.getId())
                                                        .stream()
                                                        .filter(rel -> rel.getUsuario().getTipoUsuario().getId()
                                                                        .equals(2))
                                                        .map(rel -> {
                                                                Usuario u = rel.getUsuario();
                                                                return EstudiantesDto.builder()
                                                                                .nombre(u.getNombres() + " "
                                                                                                + u.getPrimerApellido()
                                                                                                + " "
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
                                                                                .id_area_conocimiento(sub
                                                                                                .getAreaConocimiento()
                                                                                                .getId())
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
                                        .body(Map.of("mensaje",
                                                        "No existe una asignación activa entre este jurado y el tema"));
                }

                List<EstadoExposicion> estadosNoPermitidos = List.of(
                                EstadoExposicion.PROGRAMADA,
                                EstadoExposicion.CALIFICADA,
                                EstadoExposicion.COMPLETADA);

                boolean exposicionActiva = exposicionXTemaRepository.findByTemaIdAndActivoTrue(temaId).stream()
                                .anyMatch(ex -> estadosNoPermitidos.contains(ex.getEstadoExposicion()));

                int idExposicionActiva = exposicionXTemaRepository.findByTemaIdAndActivoTrue(temaId).stream()
                                .filter(ex -> estadosNoPermitidos.contains(ex.getEstadoExposicion()))
                                .mapToInt(ExposicionXTema::getId)
                                .findFirst()
                                .orElse(-1);

                if (exposicionActiva) {
                        List<ControlExposicionUsuarioTema> controlesActivos = controlExposicionUsuarioTemaRepository
                                        .findByExposicionXTema_IdAndActivoTrue(idExposicionActiva);
                        // recorremos los controles activos y revisamos el usuario tema id
                        for (ControlExposicionUsuarioTema control : controlesActivos) {
                                if (control.getUsuario().getId().equals(asignacionOpt.get().getId())) {
                                        return ResponseEntity.status(HttpStatus.NOT_FOUND)
                                                        .body(Map.of("mensaje",
                                                                        "No se puede eliminar porque el jurado tiene temas pendientes o en evaluación"));
                                }
                        }
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
                        List<ExposicionTemaDto> exposiciones = exposicionesRaw.stream()
                                        .map(exp -> {
                                                Integer exposicionTemaId = (Integer) exp[1];

                                                List<MiembroJuradoSimplificadoDTO> miembros = usuarioXTemaRepository
                                                                .obtenerMiembrosJuradoPorExposicionTema(
                                                                                exposicionTemaId);

                                                return new ExposicionTemaDto(
                                                                (Integer) exp[0],
                                                                (String) exp[2],
                                                                exp[3].toString(),
                                                                ((Instant) exp[4]).atOffset(ZoneOffset.UTC),
                                                                ((Instant) exp[5]).atOffset(ZoneOffset.UTC),
                                                                (String) exp[6],
                                                                miembros);
                                        })
                                        .collect(Collectors.toList());

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
                                        .body(Map.of("mensaje",
                                                        "No existen asignaciones activas para este miembro de jurado"));
                }

                // Verificar si alguno de los temas tiene estado 7 o 12
                boolean tieneTemasPendientes = asignaciones.stream()
                                .anyMatch(asignacion -> {
                                        Integer estadoId = asignacion.getTema().getEstadoTema().getId();
                                        return estadoId == 7 || estadoId == 12;
                                });

                if (tieneTemasPendientes) {
                        return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                                        .body(Map.of("mensaje",
                                                        "No se puede eliminar porque el jurado tiene temas pendientes o en evaluación"));
                }

                List<EstadoExposicion> estadosNoPermitidos = List.of(
                                EstadoExposicion.PROGRAMADA,
                                EstadoExposicion.CALIFICADA,
                                EstadoExposicion.COMPLETADA);
                for (UsuarioXTema asignacion : asignaciones) {
                        Integer temaId = asignacion.getTema().getId();

                        boolean exposicionActiva = exposicionXTemaRepository.findByTemaIdAndActivoTrue(temaId).stream()
                                        .anyMatch(ex -> estadosNoPermitidos.contains(ex.getEstadoExposicion()));

                        if (exposicionActiva) {
                                return ResponseEntity.status(HttpStatus.NOT_FOUND)
                                                .body(Map.of("mensaje",
                                                                "No se puede eliminar porque el jurado tiene temas pendientes o en evaluación"));
                        }
                }

                // Se desactiva todas las asignaciones si todos los estados son válidos
                for (UsuarioXTema asignacion : asignaciones) {
                        asignacion.setActivo(false);
                        asignacion.setFechaModificacion(OffsetDateTime.now());
                        usuarioXTemaRepository.save(asignacion);
                }

                return ResponseEntity.ok(
                                Map.of("mensaje", "Todas las asignaciones del miembro de jurado han sido eliminadas"));
        }

        @Override
        public List<ExposicionTemaMiembrosDto> listarExposicionXJuradoId(String juradoId) {
                UsuarioDto userDtoCognito = usuarioService.findByCognitoId(juradoId);

                Set<Integer> temasDelJurado = usuarioXTemaRepository.findAll().stream()
                                .filter(ut -> ut.getActivo())
                                .filter(ut -> ut.getUsuario().getId().equals(userDtoCognito.getId()))
                                .map(ut -> ut.getTema().getId())
                                .collect(Collectors.toSet());
                List<Tema> temas = temaRepository.findAllById(temasDelJurado);
                List<ExposicionTemaMiembrosDto> result = new ArrayList<>();

                for (Tema tema : temas) {
                        List<ExposicionXTema> exposiciones = exposicionXTemaRepository
                                        .findByTemaIdAndActivoTrue(tema.getId());
                        for (ExposicionXTema exposicionXTema : exposiciones) {
                                List<BloqueHorarioExposicion> bloques = bloqueHorarioExposicionRepository
                                                .findByExposicionXTemaIdAndActivoTrue(exposicionXTema.getId());
                                for (BloqueHorarioExposicion bloque : bloques) {
                                        OffsetDateTime datetimeInicio = bloque.getDatetimeInicio();
                                        OffsetDateTime datetimeFin = bloque.getDatetimeFin();

                                        OffsetDateTime fechaActual = OffsetDateTime.now(ZoneOffset.UTC);
                                        if (fechaActual.isAfter(datetimeFin)) {
                                                exposicionXTema.setEstadoExposicion(EstadoExposicion.COMPLETADA);
                                                exposicionXTemaRepository.save(exposicionXTema);
                                        }

                                        // Obtener sala desde el bloque -> jornadaExposicionXSala -> sala
                                        String salaNombre = "";
                                        if (bloque.getJornadaExposicionXSala() != null &&
                                                        bloque.getJornadaExposicionXSala()
                                                                        .getSalaExposicion() != null) {
                                                salaNombre = bloque.getJornadaExposicionXSala().getSalaExposicion()
                                                                .getNombre();
                                        }

                                        Exposicion exposicion = exposicionXTema.getExposicion();

                                        // Estado planificación
                                        String estado = exposicionXTema.getEstadoExposicion().toString();
                                        if (exposicionXTema.getEstadoExposicion() == EstadoExposicion.SIN_PROGRAMAR) {
                                                continue;
                                        }

                                        // Etapa formativa
                                        EtapaFormativa etapa = exposicion.getEtapaFormativaXCiclo().getEtapaFormativa();
                                        Integer idEtapaFormativa = etapa.getId();
                                        String nombreEtapaFormativa = etapa.getNombre();
                                        Integer idCiclo = exposicion.getEtapaFormativaXCiclo().getCiclo().getId();
                                        Integer anioCiclo = exposicion.getEtapaFormativaXCiclo().getCiclo().getAnio();
                                        String semestreCiclo = exposicion.getEtapaFormativaXCiclo().getCiclo()
                                                        .getSemestre();

                                        // Miembros
                                        List<UsuarioXTema> usuarioTemas = usuarioXTemaRepository
                                                        .findByTemaIdAndActivoTrue(tema.getId());
                                        List<MiembroExposicionDto> miembros = usuarioTemas.stream().map(ut -> {
                                                MiembroExposicionDto miembro = new MiembroExposicionDto();
                                                miembro.setId_persona(ut.getUsuario().getId());
                                                miembro.setNombre(ut.getUsuario().getNombres() + " "
                                                                + ut.getUsuario().getPrimerApellido() + " "
                                                                + ut.getUsuario().getSegundoApellido());
                                                miembro.setTipo(ut.getRol().getNombre());
                                                return miembro;
                                        }).toList();

                                        // Buscar el usuario x tema
                                        Optional<UsuarioXTema> usuarioXTemaOptional = usuarioXTemaRepository
                                                        .findByUsuarioIdAndActivoTrue(userDtoCognito.getId())
                                                        .stream()
                                                        .filter(u -> u.getTema().getId().equals(tema.getId()))
                                                        .findFirst();

                                        // Obtener estado
                                        Optional<ControlExposicionUsuarioTema> controlOptional = controlExposicionUsuarioTemaRepository
                                                        .findByExposicionXTema_IdAndUsuario_Id(exposicionXTema.getId(),
                                                                        usuarioXTemaOptional.get().getId());

                                        List<CriterioExposicion> criterios = criterioExposicionRepository
                                                        .findByExposicion_IdAndActivoTrue(exposicion.getId());

                                        boolean criteriosCalificados = criterios.stream()
                                                        .map(criterio -> revisionCriterioExposicionRepository
                                                                        .findByExposicionXTema_IdAndCriterioExposicion_IdAndUsuario_Id(
                                                                                        exposicionXTema.getId(),
                                                                                        criterio.getId(),
                                                                                        userDtoCognito.getId()))
                                                        .allMatch(opt -> opt.isPresent()
                                                                        && opt.get().getNota() != null);

                                        // Crear DTO
                                        ExposicionTemaMiembrosDto dto = new ExposicionTemaMiembrosDto();
                                        dto.setId_exposicion(exposicionXTema.getId());
                                        dto.setNombre_exposicion(exposicionXTema.getExposicion().getNombre());
                                        dto.setFechahora(datetimeInicio);
                                        dto.setSala(salaNombre);
                                        dto.setEstado(estado);
                                        dto.setId_etapa_formativa(idEtapaFormativa);
                                        dto.setNombre_etapa_formativa(nombreEtapaFormativa);
                                        dto.setTitulo(tema.getTitulo());
                                        dto.setCiclo_id(idCiclo);
                                        dto.setCiclo_anio(anioCiclo);
                                        dto.setCiclo_semestre(semestreCiclo);
                                        dto.setEnlace_grabacion(exposicionXTema.getLinkGrabacion());
                                        dto.setEnlace_sesion(exposicionXTema.getLinkExposicion());
                                        dto.setEstado_control(
                                                        controlOptional.map(
                                                                        ControlExposicionUsuarioTema::getEstadoExposicion)
                                                                        .orElse(null));
                                        dto.setMiembros(miembros);
                                        dto.setCriterios_calificados(criteriosCalificados);
                                        result.add(dto);
                                }

                        }

                }
                return result;
        }

        @Override
        public ResponseEntity<?> actualizarEstadoExposicionJurado(EstadoExposicionJuradoRequest request) {
                Map<String, Object> response = new HashMap<>();

                Optional<ExposicionXTema> optionalExposicionXTema = exposicionXTemaRepository
                                .findById(request.getExposicionTemaId());

                if (optionalExposicionXTema.isEmpty()) {
                        response.put("mensaje",
                                        "No se encontró la relacion exposición_x_tema con el ID: "
                                                        + request.getExposicionTemaId());
                        response.put("exito", false);
                        return ResponseEntity.status(HttpStatus.NOT_FOUND).body(response);
                }

                if (!optionalExposicionXTema.get().getActivo()) {
                        response.put("mensaje",
                                        "La relacion exposición_x_tema con el ID: " + request.getExposicionTemaId()
                                                        + " no esta habilitado");
                        response.put("exito", false);
                        return ResponseEntity.status(HttpStatus.NOT_FOUND).body(response);
                }

                ExposicionXTema exposicionXTema = optionalExposicionXTema.get();
                exposicionXTema.setEstadoExposicion(request.getEstadoExposicion());
                exposicionXTemaRepository.save(exposicionXTema);

                response.put("mensaje", "Se actualizó correctamente al estado: " + request.getEstadoExposicion());
                response.put("exito", true);
                return ResponseEntity.ok(response);
        }

        @Override
        public ResponseEntity<?> actualizarEstadoControlExposicion(EstadoControlExposicionRequest request,
                        String juradoId) {
                UsuarioDto userDtoCognito = usuarioService.findByCognitoId(juradoId);
                Map<String, Object> response = new HashMap<>();

                // Buscar la relación Exposición x Tema
                Optional<ExposicionXTema> optionalExposicionXTema = exposicionXTemaRepository
                                .findById(request.getExposicionTemaId());
                if (optionalExposicionXTema.isEmpty()) {
                        response.put("mensaje",
                                        "No se encontró la relación exposición_x_tema con el ID: "
                                                        + request.getExposicionTemaId());
                        response.put("exito", false);
                        return ResponseEntity.status(HttpStatus.NOT_FOUND).body(response);
                }

                // Obtener el tema ID desde la relación
                ExposicionXTema exposicionXTema = optionalExposicionXTema.get();
                Integer temaId = exposicionXTema.getTema().getId();
                Integer usuarioId = userDtoCognito.getId();

                // Buscar el usuario x tema
                Optional<UsuarioXTema> usuarioXTemaOptional = usuarioXTemaRepository
                                .findByUsuarioIdAndActivoTrue(usuarioId)
                                .stream()
                                .filter(u -> u.getTema().getId().equals(temaId))
                                .findFirst();

                if (usuarioXTemaOptional.isEmpty()) {
                        response.put("mensaje",
                                        "No se encontró un usuario_x_tema activo con el usuario ID: " + usuarioId
                                                        + " y tema ID: " + temaId);
                        response.put("exito", false);
                        return ResponseEntity.status(HttpStatus.NOT_FOUND).body(response);
                }

                Integer usuarioXTemaId = usuarioXTemaOptional.get().getId();

                // Buscar control_exposicion_usuario_tema
                Optional<ControlExposicionUsuarioTema> controlOptional = controlExposicionUsuarioTemaRepository
                                .findByExposicionXTema_IdAndUsuario_Id(request.getExposicionTemaId(), usuarioXTemaId);

                if (controlOptional.isEmpty()) {
                        response.put("mensaje",
                                        "No se encontró control_exposicion_usuario_tema con exposición ID: "
                                                        + request.getExposicionTemaId()
                                                        + " y usuario_x_tema ID: " + usuarioXTemaId);
                        response.put("exito", false);
                        return ResponseEntity.status(HttpStatus.NOT_FOUND).body(response);
                }

                // Actualizar estado
                ControlExposicionUsuarioTema control = controlOptional.get();
                control.setEstadoExposicion(request.getEstadoExposicionUsuario());
                controlExposicionUsuarioTemaRepository.save(control);

                System.out.println("Publicando evento EstadoControlExposicionActualizadoEvent...");
                eventPublisher.publishEvent(new EstadoControlExposicionActualizadoEvent(
                                request.getExposicionTemaId(), temaId));

                response.put("mensaje",
                                "Se actualizó correctamente al estado: " + request.getEstadoExposicionUsuario());
                response.put("exito", true);
                return ResponseEntity.ok(response);
        }

        @Override
        public List<EstadoExposicionDto> listarEstados() {
                return Arrays.stream(EstadoExposicion.values())
                                .map(e -> new EstadoExposicionDto(e.name(), beautify(e.name())))
                                .collect(Collectors.toList());
        }

        @Override
        public ResponseEntity<ExposicionCalificacionDto> listarExposicionCalificacion(
                        ExposicionCalificacionRequest exposicionCalificacionRequest, String juradoId) {
                UsuarioDto userDto = usuarioService.findByCognitoId(juradoId);
                ExposicionXTema exposicionXTema = exposicionXTemaRepository
                                .findById(exposicionCalificacionRequest.getExposicion_tema_id())
                                .orElseThrow(() -> new RuntimeException("No se encontró exposicion_x_tema con id: "
                                                + exposicionCalificacionRequest.getExposicion_tema_id()));

                // ExposicionXTema exposicionXTema = exposicionXTemaRepository
                // .findById(exposicionCalificacionRequest.getExposicion_tema_id())
                // .orElseThrow(() -> new RuntimeException("No se encontró exposicion_x_tema con
                // id: "
                // + exposicionCalificacionRequest.getExposicion_tema_id()));

                Integer id = exposicionCalificacionRequest.getExposicion_tema_id();
                Tema tema = exposicionXTema.getTema();
                Exposicion exposicion = exposicionXTema.getExposicion();
                String titulo = tema.getTitulo();
                String descripcion = tema.getResumen();

                // UsuarioXTema usuarioXTema = usuarioXTemaRepository
                // .findByUsuarioIdAndTemaIdAndRolId(userDto.getId(), tema.getId(), 2)
                // .orElseThrow(() -> new ResponseStatusException(
                // HttpStatus.NOT_FOUND,
                // "No se encontró una relación UsuarioXTema con los IDs proporcionados"));

                // OBTENEMOS LAS OBSERVACIONES FINALES DEL JURADO (rol 2 y rol 1)
                // DEBE BUSCAR EL USUARIO X TEMA SI ES ROL 1 O 2 (asesor o jurado)
                UsuarioXTema usuarioXTema = usuarioXTemaRepository
                                .findByUsuarioIdAndTemaIdAndRolIdIn(
                                                userDto.getId(), tema.getId(),
                                                List.of(1, 2))
                                .orElseThrow(() -> new ResponseStatusException(
                                                HttpStatus.NOT_FOUND,
                                                "No se encontró una relación UsuarioXTema con los IDs proporcionados y rol 1 o 2"));

                ControlExposicionUsuarioTema controlExposicion = controlExposicionUsuarioTemaRepository
                                .findByExposicionXTema_IdAndUsuario_Id(exposicionXTema.getId(), usuarioXTema.getId())
                                .orElseThrow(() -> new ResponseStatusException(
                                                HttpStatus.NOT_FOUND,
                                                "No se encontró controlExposicion con los IDs proporcionados"));

                List<UsuarioXTema> usuarioTemas = usuarioXTemaRepository
                                .findByTemaIdAndActivoTrue(tema.getId());

                List<EstudiantesCalificacionDto> estudiantes = usuarioTemas.stream()
                                .filter(u -> u.getRol().getId() == 4)
                                .map(u -> {
                                        EstudiantesCalificacionDto estudianteCalificacionDto = new EstudiantesCalificacionDto();
                                        estudianteCalificacionDto.setId(u.getUsuario().getId());
                                        estudianteCalificacionDto.setNombre(u.getUsuario().getNombres() + " "
                                                        + u.getUsuario().getPrimerApellido() + " "
                                                        + u.getUsuario().getSegundoApellido());
                                        return estudianteCalificacionDto;
                                }).toList();

                List<CriterioExposicion> criterios = criterioExposicionRepository
                                .findByExposicion_IdAndActivoTrue(exposicion.getId());

                List<CriteriosCalificacionDto> criteriosCalificacionDtos = criterios.stream()
                                .map(criterio -> {
                                        Optional<RevisionCriterioExposicion> revisionOpt = revisionCriterioExposicionRepository
                                                        .findByExposicionXTema_IdAndCriterioExposicion_IdAndUsuario_Id(
                                                                        exposicionCalificacionRequest
                                                                                        .getExposicion_tema_id(),
                                                                        criterio.getId(),
                                                                        userDto.getId());

                                        System.out.println(
                                                        "Buscando revisionCriterioExposicion para criterio: "
                                                                        + criterio.getId());
                                        System.out.println(
                                                        "ExposicionXTema ID: "
                                                                        + exposicionCalificacionRequest
                                                                                        .getExposicion_tema_id());
                                        System.out.println("Usuario ID: " + userDto.getId());

                                        if (revisionOpt.isEmpty()) {
                                                System.out.println(
                                                                "Revision not found for criterio: " + criterio.getId());
                                        }

                                        RevisionCriterioExposicion revision = revisionOpt.orElse(null);

                                        CriteriosCalificacionDto dto = new CriteriosCalificacionDto();
                                        dto.setId(revision != null ? revision.getId() : null);
                                        dto.setTitulo(criterio.getNombre());
                                        dto.setDescripcion(criterio.getDescripcion());
                                        dto.setCalificacion(revision != null ? revision.getNota() : null);
                                        dto.setNota_maxima(criterio.getNotaMaxima());
                                        dto.setObservacion(revision != null ? revision.getObservacion() : null);

                                        return dto;
                                })
                                .collect(Collectors.toList());

                String observacionesFinales = controlExposicion.getObservacionesFinalesExposicion();

                ExposicionCalificacionDto dtoFinal = new ExposicionCalificacionDto();
                dtoFinal.setId_exposicion(exposicion.getId());
                dtoFinal.setTitulo(titulo);
                dtoFinal.setDescripcion(descripcion);
                dtoFinal.setEstudiantes(estudiantes);
                dtoFinal.setCriterios(criteriosCalificacionDtos);
                dtoFinal.setObservaciones_finales(observacionesFinales);

                return ResponseEntity.ok(dtoFinal);
        }

        @Override
        public ResponseEntity<?> actualizarRevisionCriterios(RevisionCriteriosRequest request) {
                Map<String, Object> response = new HashMap<>();
                try {
                        for (RevisionCriterioUpdateRequest dto : request.getCriterios()) {
                                RevisionCriterioExposicion revision = revisionCriterioExposicionRepository
                                                .findById(dto.getId())
                                                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND,
                                                                "No se encontró el criterio de revisión con id: "
                                                                                + dto.getId()));

                                if (Boolean.TRUE.equals(revision.getActivo())) {
                                        revision.setNota(dto.getCalificacion());
                                        revision.setObservacion(dto.getObservacion());
                                        revision.setRevisado(true);
                                        revisionCriterioExposicionRepository.save(revision);
                                }

                                ExposicionXTema exposicionXTema = revision.getExposicionXTema();
                                Exposicion exposicion = exposicionXTema.getExposicion();

                                List<CriterioExposicion> criterios = criterioExposicionRepository
                                                .findByExposicion_IdAndActivoTrue(exposicion.getId());

                                boolean criteriosCalificados = criterios.stream()
                                                .allMatch(criterio -> revisionCriterioExposicionRepository
                                                                .findByExposicionXTema_IdAndCriterioExposicion_Id(
                                                                                exposicionXTema.getId(),
                                                                                criterio.getId())
                                                                .stream()
                                                                .anyMatch(revi -> revi.getNota() != null));

                                if (criteriosCalificados) {
                                        eventPublisher.publishEvent(new ExposicionCalificadaEvent(exposicionXTema));
                                }

                        }

                        response.put("mensaje", "Se actualizaron correctamente los criterios.");
                        response.put("exito", true);
                } catch (ResponseStatusException e) {
                        response.put("mensaje", e.getReason());
                        response.put("exito", false);
                } catch (Exception e) {
                        response.put("mensaje", "Ocurrió un error inesperado al actualizar los criterios.");
                        response.put("exito", false);
                }
                return ResponseEntity.ok(response);
        }

        @Override
        @Transactional
        public ResponseEntity<?> actualizarObservacionFinal(ExposicionObservacionRequest request) {
                Map<String, Object> response = new HashMap<>();

                try {
                        RevisionCriterioExposicion revisionCriterioExposicion = revisionCriterioExposicionRepository
                                        .findById(request.getId())
                                        .orElseThrow(() -> new ResponseStatusException(
                                                        HttpStatus.NOT_FOUND,
                                                        "No se encontró una revisionXcriterio con ese id"));

                        ExposicionXTema exposicionXTema = revisionCriterioExposicion.getExposicionXTema();
                        Integer usuarioId = revisionCriterioExposicion.getUsuario().getId();
                        Integer temaId = exposicionXTema.getTema().getId();

                        UsuarioXTema usuarioXTema = usuarioXTemaRepository.findByUsuario_IdAndTema_Id(usuarioId, temaId)
                                        .orElseThrow(() -> new ResponseStatusException(
                                                        HttpStatus.NOT_FOUND,
                                                        "No se encontró usuarioXTema con ese id"));

                        ControlExposicionUsuarioTema controlExposicionUsuarioTema = controlExposicionUsuarioTemaRepository
                                        .findByExposicionXTema_IdAndUsuario_Id(exposicionXTema.getId(),
                                                        usuarioXTema.getId())
                                        .orElseThrow(() -> new ResponseStatusException(
                                                        HttpStatus.NOT_FOUND,
                                                        "No se encontró controlExposicionUsuarioTema"));

                        controlExposicionUsuarioTema.setObservacionesFinalesExposicion(request.getObservacion_final());
                        controlExposicionUsuarioTemaRepository.save(controlExposicionUsuarioTema);
                        response.put("mensaje", "Se actualizo correctamente la observacion final");
                        response.put("exito", true);
                } catch (ResponseStatusException e) {
                        response.put("mensaje", e.getReason());
                        response.put("exito", false);
                } catch (Exception e) {
                        response.put("mensaje", "Ocurrió un error inesperado al actualizar la observacion final.");
                        response.put("exito", false);
                }

                return ResponseEntity.ok(response);
        }

        private String beautify(String enumName) {
                return enumName.replace("_", " ")
                                .toLowerCase()
                                .replaceFirst(String.valueOf(enumName.charAt(0)),
                                                String.valueOf(enumName.charAt(0)).toUpperCase());
        }

        @Override
        public ResponseEntity<List<ExposicionCalificacionJuradoDTO>> obtenerCalificacionExposicionJurado(
                        ExposicionCalificacionRequest exposicionCalificacionRequest) {

                List<ExposicionCalificacionJuradoDTO> exposicionesCalificacion = new ArrayList<>();

                // OBTENEMOS LOS MIEMBROS DE JURADOS ASOCIADOS A LA EXPOSICION X TEMA
                List<MiembroJuradoSimplificadoDTO> miembrosJurado = usuarioXTemaRepository
                                .obtenerMiembrosJuradoPorExposicionTema(exposicionCalificacionRequest
                                                .getExposicion_tema_id());

                // NOS SIRVE PARA OBTENER EL ID DE EXPOSICION
                ExposicionXTema exposicionXTema = exposicionXTemaRepository
                                .findById(exposicionCalificacionRequest.getExposicion_tema_id())
                                .orElseThrow(() -> new RuntimeException("No se encontró exposicion_x_tema con id: "
                                                + exposicionCalificacionRequest.getExposicion_tema_id()));

                // RECORREMOS LOS MIEMBROS DE JURADO
                for (MiembroJuradoSimplificadoDTO miembro : miembrosJurado) {

                        ExposicionCalificacionJuradoDTO juradoCalificacion = new ExposicionCalificacionJuradoDTO();

                        // REVISA EN LA TABLA CRITERIO EXPOSICION Y SI NO ESTA SU NOMBRE ENTONCES EL
                        // BOOLEAN CALIFICADO ES FALSE
                        List<CriterioExposicion> criterios = criterioExposicionRepository
                                        .findByExposicion_IdAndActivoTrue(exposicionXTema.getExposicion().getId());

                        // OBTENEMOS LOS CRITERIOS DE CALIFICACION PARA EL JURADO
                        List<CriteriosCalificacionDto> criteriosCalificacionDtos = criterios.stream()
                                        .map(criterio -> {
                                                Optional<RevisionCriterioExposicion> revisionOpt = revisionCriterioExposicionRepository
                                                                .findByExposicionXTema_IdAndCriterioExposicion_IdAndUsuario_Id(
                                                                                exposicionCalificacionRequest
                                                                                                .getExposicion_tema_id(),
                                                                                criterio.getId(),
                                                                                miembro.getId());

                                                RevisionCriterioExposicion revision = revisionOpt.orElse(null);

                                                // SI HAY CRITERIOS DE CALIFICACION, ENTONCES EL JURADO HA CALIFICADO
                                                if (revision != null && revision.getNota() == null) {
                                                        juradoCalificacion.setCalificado(false);
                                                } else if (revision != null && revision.getNota() != null) {
                                                        juradoCalificacion.setCalificado(true);
                                                } else {
                                                        juradoCalificacion.setCalificado(false);
                                                }

                                                CriteriosCalificacionDto dto = new CriteriosCalificacionDto();
                                                dto.setId(revision != null ? revision.getId() : null);
                                                dto.setTitulo(criterio.getNombre());
                                                dto.setDescripcion(criterio.getDescripcion());
                                                dto.setCalificacion(revision != null ? revision.getNota() : null);
                                                dto.setNota_maxima(criterio.getNotaMaxima());
                                                dto.setObservacion(revision != null ? revision.getObservacion() : null);

                                                return dto;
                                        })
                                        .collect(Collectors.toList());

                        // OBTENEMOS LAS OBSERVACIONES FINALES DEL JURADO (rol 2 y rol 1)
                        // DEBE BUSCAR EL USUARIO X TEMA SI ES ROL 1 O 2 (asesor o jurado)
                        UsuarioXTema usuarioXTema = usuarioXTemaRepository
                                        .findByUsuarioIdAndTemaIdAndRolIdIn(
                                                        miembro.getId(),
                                                        exposicionXTema.getTema().getId(),
                                                        List.of(1, 2))
                                        .orElseThrow(() -> new ResponseStatusException(
                                                        HttpStatus.NOT_FOUND,
                                                        "No se encontró una relación UsuarioXTema con los IDs proporcionados y rol 1 o 2"));

                        // OBTENEMOS LAS OBSERVACIONES FINALES DEL JURADO
                        ControlExposicionUsuarioTema controlExposicion = controlExposicionUsuarioTemaRepository
                                        .findByExposicionXTema_IdAndUsuario_Id(exposicionXTema.getId(),
                                                        usuarioXTema.getId())
                                        .orElseThrow(() -> new ResponseStatusException(
                                                        HttpStatus.NOT_FOUND,
                                                        "No se encontró controlExposicion con los IDs proporcionados"));

                        String observacionesFinales = controlExposicion.getObservacionesFinalesExposicion();

                        juradoCalificacion.setUsuario_id(miembro.getId());
                        juradoCalificacion.setNombres(miembro.getNombres() + " " + miembro.getPrimerApellido() + " "
                                        + miembro.getSegundoApellido());
                        juradoCalificacion.setCriterios(criteriosCalificacionDtos);
                        juradoCalificacion.setObservaciones_finales(observacionesFinales);
                        juradoCalificacion.setCalificacion_final(controlExposicion.getNotaRevision());
                        exposicionesCalificacion.add(juradoCalificacion);
                }

                return ResponseEntity.ok(exposicionesCalificacion);
        }

        @Override
        public ResponseEntity<?> actualizarNotaFinalExposicion(Integer exposicionId) {

                ExposicionCalificacionRequest request = new ExposicionCalificacionRequest();
                request.setExposicion_tema_id(exposicionId);
                List<ExposicionCalificacionJuradoDTO> calificaciones = obtenerCalificacionExposicionJurado(request)
                                .getBody();

                if (calificaciones == null || calificaciones.isEmpty()) {
                        return ResponseEntity.status(HttpStatus.NOT_FOUND)
                                        .body("No se encontraron calificaciones para la exposición con ID: "
                                                        + exposicionId);
                }

                ParametroConfiguracion parametroConfiguracion = parametroConfiguracionRepository
                                .findByNombre("Peso Asesor")
                                .orElseThrow(() -> new RuntimeException("Parámetro no encontrado"));

                CarreraXParametroConfiguracion carreraXParametroConfiguracion = carreraXParametroConfiguracionRepository
                                .findFirstByParametroConfiguracionId(parametroConfiguracion.getId())
                                .orElseThrow(() -> new RuntimeException(
                                                "No se encontro carrera x parametro configuración"));

                ExposicionXTema exposicionXTema = exposicionXTemaRepository
                                .findById(exposicionId)
                                .orElseThrow(() -> new RuntimeException("No se encontró exposicion_x_tema con id: "
                                                + exposicionId));

                int pesoAsesor = Integer.parseInt(carreraXParametroConfiguracion.getValor()) - 1;

                BigDecimal notaFinal = BigDecimal.ZERO;
                BigDecimal notaAsesor = null;
                List<BigDecimal> notasJurados = new ArrayList<>();

                for (ExposicionCalificacionJuradoDTO calificacion : calificaciones) {

                        UsuarioXTema usuarioXTema = usuarioXTemaRepository
                                        .findByUsuarioIdAndTemaIdAndRolIdIn(calificacion.getUsuario_id(),
                                                        exposicionXTema.getTema().getId(), List.of(1, 2))
                                        .orElseThrow(() -> new ResponseStatusException(
                                                        HttpStatus.NOT_FOUND,
                                                        "No se encontró una relación UsuarioXTema con los IDs proporcionados y rol 1 o 2"));

                        BigDecimal nota = calificacion.getCalificacion_final();

                        if (usuarioXTema.getRol().getId() == 1) { // nota del asesor
                                if (nota != null) {
                                        notaAsesor = nota;
                                }
                        } else if (usuarioXTema.getRol().getId() == 2) { // vamos agregando las notas del jurado
                                notasJurados.add(nota);
                        }
                }

                // filtramos solo las notas validas por el jurado
                List<BigDecimal> notasJuradosValidas = notasJurados.stream()
                                .filter(Objects::nonNull)
                                .collect(Collectors.toList());

                // obtenemos la cantidad de jurados que han calificado
                int juradosCalificados = notasJuradosValidas.size();

                // CASUISTICAS
                if (notaAsesor != null && juradosCalificados == 0) {
                        // si solo el asesor ha calificado entonces se toma la nota del asesor
                        notaFinal = notaAsesor;
                        exposicionXTema.setNotaFinal(notaFinal);
                        exposicionXTemaRepository.save(exposicionXTema);
                        return ResponseEntity.ok(notaFinal.setScale(2, RoundingMode.HALF_UP));
                }

                if (notaAsesor == null && juradosCalificados == 1) {
                        // si solo un jurado ha calificado y no hay nota del asesor, se toma la nota del
                        // jurado
                        notaFinal = notasJuradosValidas.get(0);
                        exposicionXTema.setNotaFinal(notaFinal);
                        exposicionXTemaRepository.save(exposicionXTema);
                        return ResponseEntity.ok(notaFinal.setScale(2, RoundingMode.HALF_UP));
                }

                // reemplazamos notas faltantes del jurado con el promedio
                BigDecimal promedioJurados = BigDecimal.ZERO;
                if (juradosCalificados > 0) {
                        promedioJurados = notasJuradosValidas.stream()
                                        .reduce(BigDecimal.ZERO, BigDecimal::add)
                                        .divide(BigDecimal.valueOf(juradosCalificados), 4, RoundingMode.HALF_UP);
                }

                List<BigDecimal> notasJuradosCompletas = new ArrayList<>();
                for (BigDecimal nota : notasJurados) {
                        notasJuradosCompletas.add(nota != null ? nota : promedioJurados);
                }

                int totalJurados = notasJuradosCompletas.size();

                // calculamos los pesos finales
                BigDecimal pesoAsesorFinal = notaAsesor != null
                                ? new BigDecimal(pesoAsesor).divide(BigDecimal.valueOf(100), 4, RoundingMode.HALF_UP)
                                : BigDecimal.ZERO;

                BigDecimal pesoJuradosFinal = BigDecimal.ONE.subtract(pesoAsesorFinal); // 1 - pesoAsesorFinal
                BigDecimal pesoPorJurado = totalJurados > 0
                                ? pesoJuradosFinal.divide(BigDecimal.valueOf(totalJurados), 4, RoundingMode.HALF_UP)
                                : BigDecimal.ZERO;

                // calculamos la nota final
                if (notaAsesor != null) {
                        notaFinal = notaFinal.add(notaAsesor.multiply(pesoAsesorFinal));
                }

                for (BigDecimal notaJurado : notasJuradosCompletas) {
                        notaFinal = notaFinal.add(notaJurado.multiply(pesoPorJurado));
                }

                // actualizamos la nota final en la BD
                exposicionXTema.setNotaFinal(notaFinal);
                exposicionXTemaRepository.save(exposicionXTema);

                return ResponseEntity.ok(notaFinal.setScale(2, RoundingMode.HALF_UP));
        }

        @Override
        public List<EtapasFormativasDto> obtenerEtapasFormativasPorUsuario(String usuarioId) {
                UsuarioDto userDto = usuarioService.findByCognitoId(usuarioId);

                Usuario usuario = usuarioRepository.findById(userDto.getId())
                        .orElseThrow(() -> new EntityNotFoundException("Usuario no encontrado"));

                boolean tieneRolValido = usuarioRolRepository
                        .findByUsuarioIdAndActivoTrue(userDto.getId())
                        .stream()
                        .anyMatch(ur -> ur.getRol().getId() == 1 || ur.getRol().getId() == 2);

                if (!tieneRolValido) {
                        throw new IllegalArgumentException("El usuario no tiene rol válido (1 o 2)");
                }

                List<UsuarioXTema> usuarioXTemaList = usuarioXTemaRepository
                        .findByUsuarioIdAndActivoTrue(userDto.getId());

                Set<Tema> temas = usuarioXTemaList.stream()
                        .map(UsuarioXTema::getTema)
                        .collect(Collectors.toSet());
                Set<EtapaFormativa> etapas = new HashSet<>();

                for (Tema tema : temas) {
                        List<EtapaFormativaXCicloXTema> efCicloXTemaList = etapaFormativaXCicloXTemaRepository
                                .findByTemaIdAndActivoTrue(tema.getId());

                        for (EtapaFormativaXCicloXTema efxt : efCicloXTemaList) {
                                EtapaFormativa etapa = efxt.getEtapaFormativaXCiclo().getEtapaFormativa();
                                if (etapa.getActivo()) {
                                        etapas.add(etapa);
                                }
                        }
                }
                return etapas.stream()
                        .map(etapa -> new EtapasFormativasDto(etapa.getId(), etapa.getNombre()))
                        .collect(Collectors.toList());
        }

        @Override
        public List<ExposicionCoordinadorDto> listarExposicionesPorCoordinador(String coordinadorId) {
                UsuarioDto userDto = usuarioService.findByCognitoId(coordinadorId);

                Usuario usuario = usuarioRepository.findById(userDto.getId())
                        .orElseThrow(() -> new EntityNotFoundException("Usuario no encontrado"));

                // 1. Obtener las áreas de conocimiento del coordinador
                List<UsuarioXAreaConocimiento> areasCoordinador = usuarioXAreaConocimientoRepository
                        .findByUsuario_IdAndActivoTrue(userDto.getId());

                Set<Integer> areaIds = areasCoordinador.stream()
                        .map(uac -> uac.getAreaConocimiento().getId())
                        .collect(Collectors.toSet());

                // 2. Obtener los temas relacionados con esas áreas (por subárea)
                List<SubAreaConocimientoXTema> relaciones = subAreaConocimientoXTemaRepository.findAll()
                        .stream()
                        .filter(SubAreaConocimientoXTema::getActivo)
                        .filter(sact -> areaIds.contains(
                                sact.getSubAreaConocimiento().getAreaConocimiento().getId()))
                        .collect(Collectors.toList());

                Set<Tema> temasFiltrados = relaciones.stream()
                        .map(SubAreaConocimientoXTema::getTema)
                        .collect(Collectors.toSet());

                // 3. Obtener exposiciones por tema
                List<ExposicionCoordinadorDto> resultado = new ArrayList<>();

                for (Tema tema : temasFiltrados){
                        List<ExposicionXTema> exposiciones = exposicionXTemaRepository.findByTemaIdAndActivoTrue(tema.getId());
                        for (ExposicionXTema exposicionXTema : exposiciones){
                                List<BloqueHorarioExposicion> bloques = bloqueHorarioExposicionRepository
                                        .findByExposicionXTemaIdAndActivoTrue(exposicionXTema.getId());

                                for (BloqueHorarioExposicion bloque : bloques){
                                        OffsetDateTime datetimeInicio = bloque.getDatetimeInicio();
                                        OffsetDateTime datetimeFin = bloque.getDatetimeFin();

                                        OffsetDateTime fechaActual = OffsetDateTime.now(ZoneOffset.UTC);
                                        if (fechaActual.isAfter(datetimeFin)) {
                                                exposicionXTema.setEstadoExposicion(EstadoExposicion.COMPLETADA);
                                                exposicionXTemaRepository.save(exposicionXTema);
                                        }

                                        String salaNombre = "";
                                        if (bloque.getJornadaExposicionXSala() != null &&
                                                bloque.getJornadaExposicionXSala()
                                                        .getSalaExposicion() != null) {
                                                salaNombre = bloque.getJornadaExposicionXSala().getSalaExposicion()
                                                        .getNombre();
                                        }

                                        Exposicion exposicion = exposicionXTema.getExposicion();

                                        // Etapa formativa
                                        EtapaFormativa etapa = exposicion.getEtapaFormativaXCiclo().getEtapaFormativa();
                                        Integer idEtapaFormativa = etapa.getId();
                                        String nombreEtapaFormativa = etapa.getNombre();
                                        Integer idCiclo = exposicion.getEtapaFormativaXCiclo().getCiclo().getId();
                                        Integer anioCiclo = exposicion.getEtapaFormativaXCiclo().getCiclo().getAnio();
                                        String semestreCiclo = exposicion.getEtapaFormativaXCiclo().getCiclo()
                                                .getSemestre();

                                        // Miembros
                                        List<UsuarioXTema> usuarioTemas = usuarioXTemaRepository
                                                .findByTemaIdAndActivoTrue(tema.getId());
                                        List<MiembroExposicionDto> miembros = usuarioTemas.stream().map(ut -> {
                                                MiembroExposicionDto miembro = new MiembroExposicionDto();
                                                miembro.setId_persona(ut.getUsuario().getId());
                                                miembro.setNombre(ut.getUsuario().getNombres() + " "
                                                        + ut.getUsuario().getPrimerApellido() + " "
                                                        + ut.getUsuario().getSegundoApellido());
                                                miembro.setTipo(ut.getRol().getNombre());
                                                return miembro;
                                        }).toList();

                                        // Buscar el usuario x tema
                                        Optional<UsuarioXTema> usuarioXTemaOptional = usuarioXTemaRepository
                                                .findByUsuarioIdAndActivoTrue(userDto.getId())
                                                .stream()
                                                .filter(u -> u.getTema().getId().equals(tema.getId()))
                                                .findFirst();

                                        // Obtener estado
                                        Optional<ControlExposicionUsuarioTema> controlOptional = controlExposicionUsuarioTemaRepository
                                                .findByExposicionXTema_IdAndUsuario_Id(exposicionXTema.getId(),
                                                        usuarioXTemaOptional.get().getId());

                                        // Crear DTO
                                        ExposicionCoordinadorDto dto = new ExposicionCoordinadorDto();
                                        dto.setId_exposicion(exposicionXTema.getId());
                                        dto.setNombre_exposicion(exposicion.getNombre());
                                        dto.setFechahora(datetimeInicio);
                                        dto.setSala(salaNombre);
                                        dto.setEstado(exposicionXTema.getEstadoExposicion().toString());
                                        dto.setId_etapa_formativa(idEtapaFormativa);
                                        dto.setNombre_etapa_formativa(nombreEtapaFormativa);
                                        dto.setTitulo(tema.getTitulo());
                                        dto.setCiclo_id(idCiclo);
                                        dto.setCiclo_anio(anioCiclo);
                                        dto.setCiclo_semestre(semestreCiclo);
                                        dto.setEstado_control(
                                                controlOptional.map(
                                                                ControlExposicionUsuarioTema::getEstadoExposicion)
                                                        .orElse(null));
                                        dto.setEnlace_grabacion(exposicionXTema.getLinkGrabacion());
                                        dto.setEnlace_sesion(exposicionXTema.getLinkExposicion());
                                        dto.setMiembros(miembros);

                                        resultado.add(dto);
                                }
                        }
                }
                return resultado;
        }

        @Override
        @Transactional
        public ResponseEntity<?> actualizarNotaRevisionFinal(ExposicionNotaRevisionRequest request) {
                Map<String, Object> response = new HashMap<>();

                try {
                        RevisionCriterioExposicion revisionCriterioExposicion = revisionCriterioExposicionRepository
                                .findById(request.getId())
                                .orElseThrow(() -> new ResponseStatusException(
                                        HttpStatus.NOT_FOUND,
                                        "No se encontró una revisionXcriterio con ese id"));

                        ExposicionXTema exposicionXTema = revisionCriterioExposicion.getExposicionXTema();
                        Integer usuarioId = revisionCriterioExposicion.getUsuario().getId();
                        Integer temaId = exposicionXTema.getTema().getId();

                        UsuarioXTema usuarioXTema = usuarioXTemaRepository.findByUsuario_IdAndTema_Id(usuarioId, temaId)
                                .orElseThrow(() -> new ResponseStatusException(
                                        HttpStatus.NOT_FOUND,
                                        "No se encontró usuarioXTema con ese id"));

                        ControlExposicionUsuarioTema controlExposicionUsuarioTema = controlExposicionUsuarioTemaRepository
                                .findByExposicionXTema_IdAndUsuario_Id(exposicionXTema.getId(),
                                        usuarioXTema.getId())
                                .orElseThrow(() -> new ResponseStatusException(
                                        HttpStatus.NOT_FOUND,
                                        "No se encontró controlExposicionUsuarioTema"));

                        controlExposicionUsuarioTema.setNotaRevision(request.getNota_revision());
                        controlExposicionUsuarioTemaRepository.save(controlExposicionUsuarioTema);
                        response.put("mensaje", "Se actualizo correctamente la nota revisión");
                        response.put("exito", true);
                } catch (ResponseStatusException e) {
                        response.put("mensaje", e.getReason());
                        response.put("exito", false);
                } catch (Exception e) {
                        response.put("mensaje", "Ocurrió un error inesperado al actualizar la observacion final.");
                        response.put("exito", false);
                }

                return ResponseEntity.ok(response);
        }
}
