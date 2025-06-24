package pucp.edu.pe.sgta.service.imp;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.*;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import pucp.edu.pe.sgta.dto.*;
import org.springframework.web.server.ResponseStatusException;
import pucp.edu.pe.sgta.dto.asesores.*;
import jakarta.persistence.Query;
import org.apache.poi.ss.usermodel.*;
import org.apache.poi.xssf.usermodel.XSSFWorkbook;
import org.springframework.web.multipart.MultipartFile;
import jakarta.persistence.EntityManager;
import jakarta.persistence.PersistenceContext;
import pucp.edu.pe.sgta.mapper.InfoAreaConocimientoMapper;
import pucp.edu.pe.sgta.mapper.InfoSubAreaConocimientoMapper;
import pucp.edu.pe.sgta.mapper.PerfilAsesorMapper;
import pucp.edu.pe.sgta.mapper.UsuarioMapper;
import pucp.edu.pe.sgta.model.*;
import pucp.edu.pe.sgta.repository.*;
import pucp.edu.pe.sgta.service.inter.CognitoService;
import pucp.edu.pe.sgta.service.inter.UsuarioService;
import pucp.edu.pe.sgta.util.RolEnum;
import pucp.edu.pe.sgta.util.TipoUsuarioEnum;
import pucp.edu.pe.sgta.util.Utils;

import java.io.IOException;
import java.io.BufferedReader;
import java.io.InputStream;
import java.io.InputStreamReader;
import java.util.*;
import java.sql.Timestamp;
import java.time.Instant;
import java.time.OffsetDateTime;
import java.time.ZoneOffset;
import java.util.logging.Logger;
import java.util.stream.Collectors;

@Service
public class UsuarioServiceImpl implements UsuarioService {

    private final UsuarioRepository usuarioRepository;
    private final UsuarioXSubAreaConocimientoRepository usuarioXSubAreaConocimientoRepository;
    private final SubAreaConocimientoRepository subAreaConocimientoRepository;
    private final AreaConocimientoRepository areaConocimientoRepository;
    private final UsuarioXAreaConocimientoRepository usuarioXAreaConocimientoRepository;
    private final CarreraRepository carreraRepository;
    private final UsuarioXTemaRepository usuarioXTemaRepository;
    private final TipoUsuarioRepository tipoUsuarioRepository;
    private final CognitoService cognitoService;
    private final Logger logger = Logger.getLogger(TemaServiceImpl.class.getName());

    @Autowired
    private RolRepository rolRepository;

    @PersistenceContext
    private EntityManager em;
    @Autowired
    private UsuarioXRolRepository usuarioXRolRepository;
    @Autowired
    private UsuarioXCarreraRepository usuarioXCarreraRepository;
    @Autowired
    private TipoDedicacionRepository tipoDedicacionRepository;
    @Autowired
    private EnlaceUsuarioServiceImpl enlaceUsuarioServiceImpl;

    public UsuarioServiceImpl(UsuarioRepository usuarioRepository,
                              UsuarioXSubAreaConocimientoRepository usuarioXSubAreaConocimientoRepository,
                              SubAreaConocimientoRepository subAreaConocimientoRepository,
                              AreaConocimientoRepository areaConocimientoRepository,
                              UsuarioXAreaConocimientoRepository usuarioXAreaConocimientoRepository, CarreraRepository carreraRepository,
                              UsuarioXTemaRepository usuarioXTemaRepository, TipoUsuarioRepository tipoUsuarioRepository,
                              CognitoService cognitoService) {
        this.usuarioRepository = usuarioRepository;
        this.usuarioXSubAreaConocimientoRepository = usuarioXSubAreaConocimientoRepository;
        this.subAreaConocimientoRepository = subAreaConocimientoRepository;
        this.areaConocimientoRepository = areaConocimientoRepository;
        this.usuarioXAreaConocimientoRepository = usuarioXAreaConocimientoRepository;
        this.carreraRepository = carreraRepository;
        this.usuarioXTemaRepository = usuarioXTemaRepository;
        this.tipoUsuarioRepository = tipoUsuarioRepository;
        this.cognitoService = cognitoService;
    }

    @Override
    @Transactional
    public void createUsuario(UsuarioRegistroDto dto) {
        Optional<TipoUsuario> tipoUsuarioOpt = buscarTipoUsuarioPorNombre(dto.getTipoUsuarioNombre());
        if (tipoUsuarioOpt.isEmpty()) {
            throw new IllegalArgumentException("Tipo de usuario no válido: " + dto.getTipoUsuarioNombre());
        }
        TipoUsuario tipoUsuario = tipoUsuarioOpt.get();
        //armando al usario:
        Usuario usuario = new Usuario();
        usuario.setTipoUsuario(tipoUsuario);
        usuario.setCodigoPucp(dto.getCodigoPucp());
        usuario.setNombres(dto.getNombres());
        usuario.setPrimerApellido(dto.getPrimerApellido());
        usuario.setSegundoApellido(dto.getSegundoApellido());
        usuario.setCorreoElectronico(dto.getCorreoElectronico());
        usuario.setContrasena("Temp"); // no se usa igual xdd
        usuario.setActivo(true);
        if ("profesor".equalsIgnoreCase(tipoUsuario.getNombre()) && dto.getTipoDedicacionId() != null) {
            TipoDedicacion dedicacion = tipoDedicacionRepository.findById(dto.getTipoDedicacionId())
                    .orElseThrow(() -> new IllegalArgumentException("Tipo de dedicación no válido"));
            usuario.setTipoDedicacion(dedicacion);
        }
        String nombreCompleto = dto.getNombres() + " " + dto.getPrimerApellido() + " " + dto.getSegundoApellido();
        try {
            //asgnando grupos de cognito
            List<String> gruposCognito = new ArrayList<>();
            if ("profesor".equalsIgnoreCase(tipoUsuario.getNombre())) {
                if (dto.getCarreras() != null) {
                    for (UsuarioRegistroDto.CarreraAsignadaDto carreraDto : dto.getCarreras()) {
                        if (Boolean.TRUE.equals(carreraDto.getEsCoordinador())) {
                            gruposCognito.add("coordinador");
                            break; // solo puede ser coordi de una carrera
                        }
                    }
                }
                if (dto.getRolesIds() != null) {
                    for (Integer idRol : dto.getRolesIds()) {
                        Optional<Rol> rolOpt = rolRepository.findById(idRol);
                        rolOpt.ifPresent(rol -> gruposCognito.add(rol.getNombre().toLowerCase()));
                    }
                }
            } else {
                gruposCognito.add(tipoUsuario.getNombre().toLowerCase());
            }
            // registro en cgnito, primer grupo como base
            String grupoPrincipal = gruposCognito.isEmpty() ? tipoUsuario.getNombre().toLowerCase() : gruposCognito.get(0);
            String idCognito = cognitoService.registrarUsuarioEnCognito(dto.getCorreoElectronico(), nombreCompleto, grupoPrincipal);
            usuario.setIdCognito(idCognito);
            // registrar en bd
            usuarioRepository.save(usuario);
            // guardar usuario_carreras
            if (dto.getCarreras() != null) {
                for (UsuarioRegistroDto.CarreraAsignadaDto carreraDto : dto.getCarreras()) {
                    Carrera carrera = carreraRepository.findById(carreraDto.getCarreraId())
                            .orElseThrow(() -> new IllegalArgumentException("Carrera no válida con ID: " + carreraDto.getCarreraId()));
                    UsuarioXCarrera relacion = new UsuarioXCarrera();
                    relacion.setUsuario(usuario);
                    relacion.setCarrera(carrera);
                    relacion.setActivo(true);
                    relacion.setEsCoordinador(Boolean.TRUE.equals(carreraDto.getEsCoordinador()));
                    usuarioXCarreraRepository.save(relacion);
                    if ("profesor".equalsIgnoreCase(tipoUsuario.getNombre()) && Boolean.TRUE.equals(carreraDto.getEsCoordinador()) && !"coordinador".equals(grupoPrincipal)) {
                        cognitoService.agregarUsuarioAGrupo(idCognito, "coordinador");
                    }
                }
            }
            // guardar usuario_rol y grupos adicionales en cognito si es profesor
            if ("profesor".equalsIgnoreCase(tipoUsuario.getNombre()) && dto.getRolesIds() != null) {
                for (Integer idRol : dto.getRolesIds()) {
                    Optional<Rol> rolOpt = rolRepository.findById(idRol);
                    if (rolOpt.isPresent()) {
                        Rol rol = rolOpt.get();
                        UsuarioXRol ur = new UsuarioXRol();
                        ur.setUsuario(usuario);
                        ur.setRol(rol);
                        ur.setActivo(true);
                        usuarioXRolRepository.save(ur);
                        // el grupo principal ya se registró, asignar demás gru0os de cognito
                        if (!rol.getNombre().equalsIgnoreCase(grupoPrincipal)) {
                            cognitoService.agregarUsuarioAGrupo(idCognito, rol.getNombre().toLowerCase());
                        }
                    }
                }
            }
        } catch (Exception e) {
            throw new RuntimeException("Error al registrar el usuario: " + e.getMessage(), e);
        }
    }

    @Override
    public UsuarioDto findUsuarioById(Integer id) {
        Usuario usuario = usuarioRepository.findById(id).orElse(null);
        if (usuario != null) {
            return UsuarioMapper.toDto(usuario);
        }
        return null;
    }

    @Override
    public Integer getIdByCorreo(String correoUsuario) {
        Usuario usuario = usuarioRepository.findByCorreoElectronico(correoUsuario).orElse(null);
        if (usuario != null) {
            return usuario.getId();
        }
        throw new NoSuchElementException("Usuario no encontrado con correo: " + correoUsuario);
    }

    @Override
    public List<UsuarioDto> findAllUsuarios() {

        return usuarioRepository.findAll()
                .stream()
                .map(UsuarioMapper::toDto)
                .collect(Collectors.toList());

    }

    @Override
    public List<UserDto> findAllUsers() {
        List<Usuario> usuarios = usuarioRepository.findAll();
        List<UserDto> userDtos = new ArrayList<>();

        for (Usuario usuario : usuarios) {
            // Obtener roles activos del usuario
            List<UsuarioXRol> roles = usuarioXRolRepository.findByUsuarioId(usuario.getId());
            List<String> rolesNombres = roles.stream()
                    .filter(UsuarioXRol::getActivo)
                    .map(ur -> ur.getRol().getNombre())
                    .toList();

            UserDto dto = UserDto.builder()
                    .id(usuario.getId())
                    .tipoUsuario(TipoUsuarioDto.builder()
                            .id(usuario.getTipoUsuario().getId())
                            .nombre(usuario.getTipoUsuario().getNombre())
                            .build())
                    .codigoPucp(usuario.getCodigoPucp())
                    .nombres(usuario.getNombres())
                    .primerApellido(usuario.getPrimerApellido())
                    .segundoApellido(usuario.getSegundoApellido())
                    .correoElectronico(usuario.getCorreoElectronico())
                    .roles(rolesNombres)
                    .build();

            userDtos.add(dto);
        }
        return userDtos;
    }

    @Override
    public List<UserDto> findAllUsers(String usuarioId) {
        // Obtener el usuario coordinador por idCognito
        Usuario coordinador = usuarioRepository.findByIdCognito(usuarioId)
                .orElseThrow(() -> new NoSuchElementException("Coordinador no encontrado con idCognito: " + usuarioId));

        // Obtener la carrera principal del coordinador
        UsuarioXCarrera carreraPrincipal = usuarioXCarreraRepository.getCarreraPrincipalCoordinador(coordinador.getId());
        if (carreraPrincipal == null) {
            throw new NoSuchElementException("No se encontró carrera principal para el coordinador");
        }
        Integer carreraId = carreraPrincipal.getCarrera().getId();

        // Buscar usuarios activos en esa carrera
        List<UsuarioXCarrera> usuariosCarrera = usuarioXCarreraRepository.findByCarreraIdAndActivoTrue(carreraId);

        List<UserDto> userDtos = new ArrayList<>();
        for (UsuarioXCarrera uc : usuariosCarrera) {
            Usuario usuario = uc.getUsuario();
            // Obtener roles activos del usuario
            List<UsuarioXRol> roles = usuarioXRolRepository.findByUsuarioId(usuario.getId());
            List<String> rolesNombres = roles.stream()
                    .filter(UsuarioXRol::getActivo)
                    .map(ur -> ur.getRol().getNombre())
                    .toList();

            UserDto dto = UserDto.builder()
                    .id(usuario.getId())
                    .tipoUsuario(TipoUsuarioDto.builder()
                            .id(usuario.getTipoUsuario().getId())
                            .nombre(usuario.getTipoUsuario().getNombre())
                            .build())
                    .codigoPucp(usuario.getCodigoPucp())
                    .nombres(usuario.getNombres())
                    .primerApellido(usuario.getPrimerApellido())
                    .segundoApellido(usuario.getSegundoApellido())
                    .correoElectronico(usuario.getCorreoElectronico())
                    .roles(rolesNombres)
                    .build();

            userDtos.add(dto);
        }
        return userDtos;
    }

    @Override
    @Transactional
    public void updateUsuario(Integer id, UsuarioRegistroDto dto) {
        Usuario usuario = usuarioRepository.findById(id)
                .orElseThrow(() -> new NoSuchElementException("Usuario no encontrado con ID: " + id));
        // info actual
        String tipoActual = usuario.getTipoUsuario().getNombre().toLowerCase();
        String correoAnterior = usuario.getCorreoElectronico();
        String nombreAnterior = usuario.getNombres() + " " + usuario.getPrimerApellido() + " " + usuario.getSegundoApellido();
        // dato a actualizars
        String tipoNuevo = dto.getTipoUsuarioNombre().toLowerCase();
        String correoNuevo = dto.getCorreoElectronico();
        String nombreNuevo = dto.getNombres() + " " + dto.getPrimerApellido() + " " + dto.getSegundoApellido();
        boolean tipoCambio = !tipoActual.equalsIgnoreCase(tipoNuevo);
        boolean correoCambio = !correoAnterior.equalsIgnoreCase(correoNuevo);
        boolean nombreCambio = !nombreAnterior.equalsIgnoreCase(nombreNuevo);
        // armando usuario para actualizar
        usuario.setCodigoPucp(dto.getCodigoPucp());
        usuario.setNombres(dto.getNombres());
        usuario.setPrimerApellido(dto.getPrimerApellido());
        usuario.setSegundoApellido(dto.getSegundoApellido());
        usuario.setCorreoElectronico(dto.getCorreoElectronico());
        usuario.setFechaModificacion(OffsetDateTime.now());
        // actualizar tipo de usuario si cambió/ limpiar de relaciones y grupos
        if (tipoCambio) {
            TipoUsuario nuevoTipo = buscarTipoUsuarioPorNombre(dto.getTipoUsuarioNombre())
                    .orElseThrow(() -> new IllegalArgumentException("Tipo de usuario no válido: " + dto.getTipoUsuarioNombre()));
            usuario.setTipoUsuario(nuevoTipo);
            if ("profesor".equalsIgnoreCase(tipoActual)) {
                limpiarRelacionesYGruposSegunTipo(usuario, tipoActual);
            } else if (usuario.getIdCognito() != null) {
                cognitoService.eliminarUsuarioDeGrupo(usuario.getIdCognito(), tipoActual);
            }
        }
        // congito y BD: roles y coordinador en caso de q sea profe
        if (tipoNuevo.equals("profesor")) {
            if (dto.getTipoDedicacionId() != null) {
                tipoDedicacionRepository.findById(dto.getTipoDedicacionId())
                        .ifPresent(usuario::setTipoDedicacion);
            }
            procesarRolesYCoordinador(usuario, dto);
        } else {
            usuario.setTipoDedicacion(null);
            // cambiar grupo principal en caso de alumno o admin
            if (usuario.getIdCognito() != null && tipoCambio) {
                cognitoService.agregarUsuarioAGrupo(usuario.getIdCognito(), tipoNuevo);
                cognitoService.eliminarUsuarioDeGrupo(usuario.getIdCognito(), tipoActual);
            }
            procesarCarrerasParaNoProfesores(usuario, dto);
        }
        //datos de conigot
        if (usuario.getIdCognito() != null && (correoCambio || nombreCambio)) {
            cognitoService.actualizarAtributosEnCognito(
                    usuario.getIdCognito(),
                    correoCambio ? correoNuevo : null,
                    nombreCambio ? nombreNuevo : null
            );
        }
        usuarioRepository.save(usuario);
    }

    private void procesarCarrerasParaNoProfesores(Usuario usuario, UsuarioRegistroDto dto) {
        Integer userId = usuario.getId();
        List<UsuarioXCarrera> relacionesAnteriores = usuarioXCarreraRepository.findByUsuarioId(userId);
        Map<Integer, UsuarioXCarrera> mapaRelaciones = relacionesAnteriores.stream()
                .collect(Collectors.toMap(rel -> rel.getCarrera().getId(), rel -> rel));
        Set<Integer> nuevasCarrerasIds = dto.getCarreras() != null
                ? dto.getCarreras().stream()
                .map(UsuarioRegistroDto.CarreraAsignadaDto::getCarreraId)
                .collect(Collectors.toSet())
                : Collections.emptySet();
        //desactivar solo las que ya no están
        for (Map.Entry<Integer, UsuarioXCarrera> entry : mapaRelaciones.entrySet()) {
            Integer carreraId = entry.getKey();
            UsuarioXCarrera relacion = entry.getValue();
            if (relacion.getActivo() && !nuevasCarrerasIds.contains(carreraId)) {
                relacion.setActivo(false);
                usuarioXCarreraRepository.save(relacion);
            }
        }
        //insertar nuevas o reactivar inactivas
        if (dto.getCarreras() != null) {
            for (UsuarioRegistroDto.CarreraAsignadaDto carreraDto : dto.getCarreras()) {
                Integer carreraId = carreraDto.getCarreraId();
                UsuarioXCarrera existente = mapaRelaciones.get(carreraId);
                if (existente != null) {
                    if (!existente.getActivo()) {
                        existente.setActivo(true);
                        usuarioXCarreraRepository.save(existente);
                    }
                } else {
                    Carrera carrera = carreraRepository.findById(carreraId)
                            .orElseThrow(() -> new IllegalArgumentException("Carrera no válida con ID: " + carreraId));
                    UsuarioXCarrera nuevaRelacion = new UsuarioXCarrera();
                    nuevaRelacion.setUsuario(usuario);
                    nuevaRelacion.setCarrera(carrera);
                    nuevaRelacion.setActivo(true);
                    nuevaRelacion.setEsCoordinador(false); // esto porque solo es para profesores, no alumnos ni admin
                    usuarioXCarreraRepository.save(nuevaRelacion);
                }
            }
        }
    }

    private void limpiarRelacionesYGruposSegunTipo(Usuario usuario, String tipoAnterior) {
        String idCognito = usuario.getIdCognito();
        Integer userId = usuario.getId();
        //los roles son mutualmente excluyentes, por eso se limpian
        List<UsuarioXRol> roles = usuarioXRolRepository.findByUsuarioId(userId);
        for (UsuarioXRol ur : roles) {
            if (ur.getActivo()) {
                ur.setActivo(false);
                usuarioXRolRepository.save(ur);
            }
            if (idCognito != null) {
                cognitoService.eliminarUsuarioDeGrupo(idCognito, ur.getRol().getNombre().toLowerCase());
            }
        }
        //no puede ser coordinador
        if ("profesor".equalsIgnoreCase(tipoAnterior)) {
            List<UsuarioXCarrera> carreras = usuarioXCarreraRepository.findByUsuarioId(userId);
            for (UsuarioXCarrera uc : carreras) {
                if (Boolean.TRUE.equals(uc.getEsCoordinador())) {
                    uc.setEsCoordinador(false);
                    usuarioXCarreraRepository.save(uc);
                    if (idCognito != null) {
                        cognitoService.eliminarUsuarioDeGrupo(idCognito, "coordinador");
                    }
                }
            }
        }
        //remover del grupo
        if (!"profesor".equalsIgnoreCase(tipoAnterior) && idCognito != null) {
            cognitoService.eliminarUsuarioDeGrupo(idCognito, tipoAnterior.toLowerCase());
        }
    }

    private void procesarRolesYCoordinador(Usuario usuario, UsuarioRegistroDto dto) {
        Integer userId = usuario.getId();
        String idCognito = usuario.getIdCognito();
        List<UsuarioXCarrera> relacionesCarrera = usuarioXCarreraRepository.findByUsuarioId(userId);
        List<UsuarioXRol> relacionesRol = usuarioXRolRepository.findByUsuarioId(userId);
        List<UsuarioRegistroDto.CarreraAsignadaDto> carrerasDto = dto.getCarreras() != null
                ? dto.getCarreras() : Collections.emptyList();
        Map<Integer, Boolean> mapaCarrerasEsCoord = carrerasDto.stream()
                .collect(Collectors.toMap(
                        UsuarioRegistroDto.CarreraAsignadaDto::getCarreraId,
                        c -> Boolean.TRUE.equals(c.getEsCoordinador()))
                );
        Set<Integer> nuevasCarrerasIds = mapaCarrerasEsCoord.keySet();
        Set<Integer> nuevosRolesIds = dto.getRolesIds() != null
                ? new HashSet<>(dto.getRolesIds()) : Collections.emptySet();
        boolean debeEstarEnCoordinador = false;
        //actualizar relaciones carrera
        for (UsuarioXCarrera uc : relacionesCarrera) {
            Integer carreraId = uc.getCarrera().getId();
            boolean sigue = nuevasCarrerasIds.contains(carreraId);
            if (sigue) {
                boolean actualizado = false;
                Boolean nuevoEsCoord = mapaCarrerasEsCoord.getOrDefault(carreraId, false);
                if (!uc.getActivo()) {
                    uc.setActivo(true);
                    actualizado = true;
                }
                if (!Objects.equals(uc.getEsCoordinador(), nuevoEsCoord)) {
                    uc.setEsCoordinador(nuevoEsCoord);
                    actualizado = true;
                }
                if (nuevoEsCoord) {
                    debeEstarEnCoordinador = true;
                }
                if (actualizado) {
                    usuarioXCarreraRepository.save(uc);
                }
            } else if (uc.getActivo()) {
                uc.setActivo(false);
                if (Boolean.TRUE.equals(uc.getEsCoordinador())) {
                    uc.setEsCoordinador(false);
                }
                usuarioXCarreraRepository.save(uc);
            }
        }
        //agregar relaciones carrera
        for (Map.Entry<Integer, Boolean> entry : mapaCarrerasEsCoord.entrySet()) {
            Integer carreraId = entry.getKey();
            boolean esCoord = entry.getValue();
            boolean yaExiste = relacionesCarrera.stream()
                    .anyMatch(uc -> uc.getCarrera().getId().equals(carreraId));
            if (!yaExiste) {
                Carrera carrera = carreraRepository.findById(carreraId)
                        .orElseThrow(() -> new IllegalArgumentException("Carrera no válida con ID: " + carreraId));
                UsuarioXCarrera nuevaRelacion = new UsuarioXCarrera();
                nuevaRelacion.setUsuario(usuario);
                nuevaRelacion.setCarrera(carrera);
                nuevaRelacion.setActivo(true);
                nuevaRelacion.setEsCoordinador(esCoord);
                usuarioXCarreraRepository.save(nuevaRelacion);
                if (esCoord) {
                    debeEstarEnCoordinador = true;
                }
            }
        }
        //actualizar roles: activar/desactivar
        for (UsuarioXRol ur : relacionesRol) {
            Integer rolId = ur.getRol().getId();
            boolean sigue = nuevosRolesIds.contains(rolId);
            if (sigue && !ur.getActivo()) {
                ur.setActivo(true);
                usuarioXRolRepository.save(ur);
            } else if (!sigue && ur.getActivo()) {
                ur.setActivo(false);
                usuarioXRolRepository.save(ur);
            }
        }
        //nuevos roles a agregar
        for (Integer idRolNuevo : nuevosRolesIds) {
            boolean yaExiste = relacionesRol.stream()
                    .anyMatch(ur -> ur.getRol().getId().equals(idRolNuevo));
            if (!yaExiste) {
                Rol rol = rolRepository.findById(idRolNuevo)
                        .orElseThrow(() -> new IllegalArgumentException("Rol no válido con ID: " + idRolNuevo));
                UsuarioXRol nuevaRelacionRol = new UsuarioXRol();
                nuevaRelacionRol.setUsuario(usuario);
                nuevaRelacionRol.setRol(rol);
                nuevaRelacionRol.setActivo(true);
                usuarioXRolRepository.save(nuevaRelacionRol);
            }
        }
        relacionesRol = usuarioXRolRepository.findByUsuarioId(userId);
        //sync con cognito
        if (idCognito != null) {
            Set<String> nombresRolesActivos = relacionesRol.stream()
                    .filter(UsuarioXRol::getActivo)
                    .map(ur -> ur.getRol().getNombre().toLowerCase())
                    .collect(Collectors.toSet());
            Set<String> nombresRolesTotales = relacionesRol.stream()
                    .map(ur -> ur.getRol().getNombre().toLowerCase())
                    .collect(Collectors.toSet());
            for (String nombreGrupo : nombresRolesTotales) {
                if (nombresRolesActivos.contains(nombreGrupo)) {
                    cognitoService.agregarUsuarioAGrupo(idCognito, nombreGrupo);
                } else {
                    cognitoService.eliminarUsuarioDeGrupo(idCognito, nombreGrupo);
                }
            }
            if (debeEstarEnCoordinador) {
                cognitoService.agregarUsuarioAGrupo(idCognito, "coordinador");
            } else {
                cognitoService.eliminarUsuarioDeGrupo(idCognito, "coordinador");
            }
        }
    }

    @Override
    @Transactional
    public void deleteUsuario(Integer id) {
        Usuario usuario = usuarioRepository.findById(id)
                .orElseThrow(() -> new NoSuchElementException("Usuario no encontrado con ID: " + id));
        usuario.setActivo(false);
        usuario.setFechaModificacion(OffsetDateTime.now());
        usuarioRepository.save(usuario);
        String idCognito = usuario.getIdCognito();
        String tipoUsuario = usuario.getTipoUsuario().getNombre().toLowerCase();
        //desactivar carreras
        List<UsuarioXCarrera> carreras = usuarioXCarreraRepository.findByUsuarioIdAndActivoTrue(id);
        boolean tuvoCoordinacion = false;
        for (UsuarioXCarrera uc : carreras) {
            if (Boolean.TRUE.equals(uc.getEsCoordinador())) {
                tuvoCoordinacion = true;
                uc.setEsCoordinador(false);
            }
            uc.setActivo(false);
            usuarioXCarreraRepository.save(uc);
        }
        //desactivar roles
        List<UsuarioXRol> roles = usuarioXRolRepository.findByUsuarioIdAndActivoTrue(id);
        for (UsuarioXRol ur : roles) {
            ur.setActivo(false);
            usuarioXRolRepository.save(ur);
        }
        //sync con cognito
        if (idCognito != null) {
            //quitar grupo por tipo
            if (tipoUsuario.equals("alumno") || tipoUsuario.equals("administrador")) {
                cognitoService.eliminarUsuarioDeGrupo(idCognito, tipoUsuario);
            }
            //quitar grupos por roles
            for (UsuarioXRol ur : roles) {
                String grupoRol = ur.getRol().getNombre().toLowerCase();
                cognitoService.eliminarUsuarioDeGrupo(idCognito, grupoRol);
            }
            // eliminar del grupo coordinador
            if (tuvoCoordinacion) {
                cognitoService.eliminarUsuarioDeGrupo(idCognito, "coordinador");
            }
        }
    }

    @Override
    @Transactional
    public void reactivarUsuario(Integer id) {
        Usuario usuario = usuarioRepository.findById(id)
                .orElseThrow(() -> new NoSuchElementException("Usuario no encontrado con ID: " + id));
        usuario.setActivo(true);
        usuario.setFechaModificacion(OffsetDateTime.now());
        // reactivar grupo cognito si no es profe
        if (usuario.getIdCognito() != null) {
            String tipo = usuario.getTipoUsuario().getNombre().toLowerCase();
            if (!tipo.equals("profesor")) {
                cognitoService.agregarUsuarioAGrupo(usuario.getIdCognito(), tipo);
            }
        }
        usuarioRepository.save(usuario);
    }

    @Override
    public PerfilAsesorDto getPerfilAsesor(Integer id) {
        // Primero los datos básicos de la entidad
        PerfilAsesorDto tmp;
        Usuario usuario = usuarioRepository.findById(id).orElse(null);
        if (usuario == null) {
            throw new RuntimeException("Usuario no encontrado con ID: " + id);
        }
        tmp = PerfilAsesorMapper.toDto(usuario);
        // Encontramos el nombre de la carrera del Asesor
        List<String> carreras = new ArrayList<>();
        List<Object[]> resultadoQuery = carreraRepository.listarCarrerasPorIdUsusario(id);
        for (Object[] o : resultadoQuery) {
            carreras.add((String) o[3]);
        }

        tmp.setEspecialidad(String.join(" - ", carreras));
        // Luego la consulta de las áreas de conocimiento
        List<InfoAreaConocimientoDto> areas;
        List<Integer> idAreas = usuarioXAreaConocimientoRepository.findAllByUsuario_IdAndActivoIsTrue(id).stream()
                .map(UsuarioXAreaConocimiento::getAreaConocimiento)
                .map(AreaConocimiento::getId)
                .toList();
        areas = areaConocimientoRepository.findAllByIdIn(idAreas)
                .stream()
                .map(InfoAreaConocimientoMapper::toDto)
                .toList();
        // Luego la consulta de las subareas de conocimiento
        List<InfoSubAreaConocimientoDto> subareas;
        List<Integer> idSubareas = usuarioXSubAreaConocimientoRepository.findAllByUsuario_IdAndActivoIsTrue(id).stream()
                .map(UsuarioXSubAreaConocimiento::getSubAreaConocimiento)
                .map(SubAreaConocimiento::getId)
                .toList();
        subareas = subAreaConocimientoRepository.findAllByIdIn(idSubareas)
                .stream()
                .map(InfoSubAreaConocimientoMapper::toDto)
                .toList();

        tmp.setAreasTematicas(areas);
        tmp.setTemasIntereses(subareas);
        // TODO: El numero máximo de estudiantes
        // TODO: La cantidad de alumnos por asesor
        Integer cantTesistas;
        List<Object[]> tesistas = usuarioXTemaRepository.listarNumeroTesistasAsesor(id);// ASEGURADO sale 1 sola fila
        cantTesistas = (Integer) tesistas.get(0)[0];
        tmp.setTesistasActuales(cantTesistas);

        return tmp;
    }

    @Override
    public void updatePerfilAsesor(PerfilAsesorDto perfilAsesorDto) {
        Usuario user = usuarioRepository.findById(perfilAsesorDto.getId()).orElse(null);
        if (user == null) {
            throw new RuntimeException("Usuario no encontrado con ID: " + perfilAsesorDto.getId());
        }
        user.setEnlaceLinkedin(perfilAsesorDto.getLinkedin());
        user.setEnlaceRepositorio(perfilAsesorDto.getRepositorio());
        user.setCorreoElectronico(perfilAsesorDto.getEmail());
        user.setBiografia(perfilAsesorDto.getBiografia());

        usuarioRepository.save(user);
        // Revision areas temáticas
        List<Integer> areasRegistradas = usuarioXAreaConocimientoRepository
                .findAllByUsuario_IdAndActivoIsTrue(user.getId())
                .stream()
                .map(UsuarioXAreaConocimiento::getAreaConocimiento)
                .map(AreaConocimiento::getId)
                .toList();
        List<Integer> areasActualizadas = perfilAsesorDto.getAreasTematicas()
                .stream()
                .map(InfoAreaConocimientoDto::getIdArea)
                .toList();
        // Id's que no estan registrados (Todos los que entraron - los que ya estaban=
        List<Integer> idNuevos = new ArrayList<>(areasActualizadas);
        idNuevos.removeAll(areasRegistradas);
        usuarioXAreaConocimientoRepository.asignarUsuarioAreas(user.getId(),
                Utils.convertIntegerListToString(idNuevos));
        // Id's que ya no estan en registrados (Todos los que habian - los que entraron)
        List<Integer> idEliminados = new ArrayList<>(areasRegistradas);
        idEliminados.removeAll(areasActualizadas);
        usuarioXAreaConocimientoRepository.desactivarUsuarioAreas(user.getId(),
                Utils.convertIntegerListToString(idEliminados));

        // Revision sub areas tematicas
        List<Integer> subAreasRegistradas = usuarioXSubAreaConocimientoRepository
                .findAllByUsuario_IdAndActivoIsTrue(user.getId())
                .stream()
                .map(UsuarioXSubAreaConocimiento::getSubAreaConocimiento)
                .map(SubAreaConocimiento::getId)
                .toList();
        List<Integer> subAreasActualizadas = perfilAsesorDto.getTemasIntereses()
                .stream()
                .map(InfoSubAreaConocimientoDto::getIdTema)
                .toList();
        // Id's que no estan registrados (Todos los que entraron - los que ya estaban=
        idNuevos = new ArrayList<>(subAreasActualizadas);
        idNuevos.removeAll(subAreasRegistradas);
        usuarioXSubAreaConocimientoRepository.asignarUsuarioSubAreas(user.getId(),
                Utils.convertIntegerListToString(idNuevos));
        // Id's que ya no estan en registrados (Todos los que habian - los que entraron)
        idEliminados = new ArrayList<>(subAreasRegistradas);
        idEliminados.removeAll(subAreasActualizadas);
        usuarioXSubAreaConocimientoRepository.desactivarUsuarioSubAreas(user.getId(),
                Utils.convertIntegerListToString(idEliminados));
    }

    @Override
    public List<UsuarioDto> findUsuariosByRolAndCarrera(String tipoUsuario, Integer carreraId, String cadenaBusqueda) {
        String sql = """
                SELECT *
                FROM obtener_usuarios_por_tipo_carrera_y_busqueda(:tipo, :carrera, :cadena)
                """;

        @SuppressWarnings("unchecked")
        List<Object[]> rows = em.createNativeQuery(sql)
                .setParameter("tipo", tipoUsuario)
                .setParameter("carrera", carreraId)
                .setParameter("cadena", cadenaBusqueda)
                .getResultList();

        List<UsuarioDto> lista = new ArrayList<>();
        for (Object[] r : rows) {
            // 0..20 según la firma de la función
            // 16 = u_fecha_creacion, 17 = u_fecha_modificacion
            // convierte de Instant o Timestamp a OffsetDateTime
            Instant rawCreacion = (r[16] instanceof Instant
                    ? (Instant) r[16]
                    : ((Timestamp) r[16]).toInstant());
            OffsetDateTime fechaCreacion = rawCreacion.atOffset(ZoneOffset.UTC);

            OffsetDateTime fechaModificacion = null;
            if (r[17] != null) {
                Instant rawMod = (r[17] instanceof Instant
                        ? (Instant) r[17]
                        : ((Timestamp) r[17]).toInstant());
                fechaModificacion = rawMod.atOffset(ZoneOffset.UTC);
            }

            UsuarioDto u = UsuarioDto.builder()
                    .id((Integer) r[0])
                    .tipoUsuario(
                            TipoUsuarioDto.builder()
                                    .id((Integer) r[1])
                                    .nombre((String) r[18])
                                    .activo(true)
                                    .build())
                    .codigoPucp((String) r[2])
                    .nombres((String) r[3])
                    .primerApellido((String) r[4])
                    .segundoApellido((String) r[5])
                    .correoElectronico((String) r[6])
                    .nivelEstudios((String) r[7])
                    .contrasena((String) r[8])
                    .biografia((String) r[9])
                    .enlaceLinkedin((String) r[10])
                    .enlaceRepositorio((String) r[11])
                    .disponibilidad((String) r[12])
                    .tipoDisponibilidad((String) r[13])
                    //.tipoDedicacion((Integer) r[14])
                    .activo((Boolean) r[15])
                    .fechaCreacion(fechaCreacion)
                    .fechaModificacion(fechaModificacion)
                    .asignado((Boolean) r[19])
                    .build();

            lista.add(u);
        }

        return lista;
    }

    // Implementaciones para las historias de usuario HU01-HU05

    /**
     * HU01: Asigna el rol de Asesor a un usuario que debe ser profesor
     * REFACTORIZADO: Ahora también agrega al usuario al grupo de Cognito 'asesor'.
     */
    @Override
    @Transactional
    public void assignAdvisorRoleToUser(Integer userId) {
        // 1. Buscar usuario activo y validar que sea Profesor
        Usuario user = usuarioRepository.findById(userId)
                .orElseThrow(() -> new NoSuchElementException("Usuario no encontrado: " + userId));

        if (!user.getActivo()) {
            throw new IllegalArgumentException("El usuario está inactivo");
        }

        TipoUsuario tipoUsuario = user.getTipoUsuario();
        if (tipoUsuario == null || !"Profesor".equalsIgnoreCase(tipoUsuario.getNombre())) {
            throw new IllegalArgumentException("Solo los usuarios de tipo Profesor pueden ser asignados como Asesores");
        }

        // 2. Obtener rol Asesor
        String rolNombre = RolEnum.Asesor.name();
        Rol advisorRole = rolRepository.findByNombre(rolNombre)
                .orElseThrow(() -> new NoSuchElementException("Rol '" + rolNombre + "' no configurado en el sistema"));

        // 3. Verificar si ya tiene el rol activo asignado (consulta nativa)
        String countSql = "SELECT COUNT(*) FROM usuario_rol WHERE usuario_id = :usuarioId AND rol_id = :rolId AND activo = true";
        Number count = (Number) em.createNativeQuery(countSql)
                .setParameter("usuarioId", userId)
                .setParameter("rolId", advisorRole.getId())
                .getSingleResult();

        if (count.intValue() == 0) {
            // 4. Insertar nuevo rol activo en la BD
            String insertSql = "INSERT INTO usuario_rol (usuario_id, rol_id, activo, fecha_creacion, fecha_modificacion) " +
                    "VALUES (:usuarioId, :rolId, true, NOW(), NOW())";
            em.createNativeQuery(insertSql)
                    .setParameter("usuarioId", userId)
                    .setParameter("rolId", advisorRole.getId())
                    .executeUpdate();

            // 5. Agregar usuario al grupo de Cognito
            if (user.getIdCognito() != null && !user.getIdCognito().isBlank()) {
                try {
                    cognitoService.agregarUsuarioAGrupo(user.getIdCognito(), rolNombre.toLowerCase());
                    System.out.println("Usuario agregado al grupo de Cognito '" + rolNombre.toLowerCase() + "'.");
                } catch (Exception e) {
                    throw new RuntimeException("Error al agregar usuario al grupo de Cognito: " + e.getMessage(), e);
                }
            }
            System.out.println("Rol de Asesor asignado exitosamente al usuario ID: " + userId);
        } else {
            System.out.println("El usuario ID: " + userId + " ya tiene el rol de Asesor activo. No se realizó ninguna acción.");
        }
    }

    /**
     * HU02: Quita el rol de Asesor a un usuario
     * REFACTORIZADO: Ahora también elimina al usuario del grupo de Cognito 'asesor'.
     */
    @Override
    @Transactional
    public void removeAdvisorRoleFromUser(Integer userId) {
        Usuario user = usuarioRepository.findById(userId)
                .orElseThrow(() -> new NoSuchElementException("Usuario no encontrado: " + userId));

        String rolNombre = RolEnum.Asesor.name();
        Rol advisorRole = rolRepository.findByNombre(rolNombre)
                .orElseThrow(() -> new NoSuchElementException("Rol '" + rolNombre + "' no configurado en el sistema"));

        String countSql = "SELECT COUNT(*) FROM usuario_rol WHERE usuario_id = :usuarioId AND rol_id = :rolId AND activo = true";
        Number count = (Number) em.createNativeQuery(countSql)
                .setParameter("usuarioId", userId)
                .setParameter("rolId", advisorRole.getId())
                .getSingleResult();

        if (count.intValue() > 0) {
            // 1. Desactivar rol en la BD
            String updateSql = "UPDATE usuario_rol SET activo = false, fecha_modificacion = NOW() WHERE usuario_id = :usuarioId AND rol_id = :rolId AND activo = true";
            em.createNativeQuery(updateSql)
                    .setParameter("usuarioId", userId)
                    .setParameter("rolId", advisorRole.getId())
                    .executeUpdate();

            // 2. Eliminar usuario del grupo de Cognito
            if (user.getIdCognito() != null && !user.getIdCognito().isBlank()) {
                try {
                    cognitoService.eliminarUsuarioDeGrupo(user.getIdCognito(), rolNombre.toLowerCase());
                    System.out.println("Usuario eliminado del grupo de Cognito '" + rolNombre.toLowerCase() + "'.");
                } catch (Exception e) {
                    throw new RuntimeException("Error al eliminar usuario del grupo de Cognito: " + e.getMessage(), e);
                }
            }
            System.out.println("Rol de Asesor quitado exitosamente al usuario ID: " + userId);
        } else {
            throw new IllegalArgumentException("El usuario no tiene el rol de Asesor asignado");
        }
    }

    /**
     * HU03: Asigna el rol de Jurado a un usuario que debe ser profesor
     * REFACTORIZADO: Ahora también agrega al usuario al grupo de Cognito 'jurado'.
     */
    @Override
    @Transactional
    public void assignJuryRoleToUser(Integer userId) {
        // 1. Buscar usuario y validar
        Usuario user = usuarioRepository.findById(userId)
                .orElseThrow(() -> new NoSuchElementException("Usuario no encontrado: " + userId));
        if (!user.getActivo()) {
            throw new IllegalArgumentException("El usuario está inactivo");
        }
        TipoUsuario tipoUsuario = user.getTipoUsuario();
        if (tipoUsuario == null || !"Profesor".equalsIgnoreCase(tipoUsuario.getNombre())) {
            throw new IllegalArgumentException("Solo los usuarios de tipo Profesor pueden ser asignados como Jurados");
        }

        // 2. Obtener rol Jurado
        String rolNombre = RolEnum.Jurado.name();
        Rol juryRole = rolRepository.findByNombre(rolNombre)
                .orElseThrow(() -> new NoSuchElementException("Rol '" + rolNombre + "' no configurado en el sistema"));

        // 3. Verificar si ya tiene el rol activo
        String countSql = "SELECT COUNT(*) FROM usuario_rol WHERE usuario_id = :usuarioId AND rol_id = :rolId AND activo = true";
        Number count = (Number) em.createNativeQuery(countSql)
                .setParameter("usuarioId", userId)
                .setParameter("rolId", juryRole.getId())
                .getSingleResult();

        if (count.intValue() == 0) {
            // 4. Insertar el rol en la BD
            String insertSql = "INSERT INTO usuario_rol (usuario_id, rol_id, activo, fecha_creacion, fecha_modificacion) " +
                    "VALUES (:usuarioId, :rolId, true, NOW(), NOW())";
            em.createNativeQuery(insertSql)
                    .setParameter("usuarioId", userId)
                    .setParameter("rolId", juryRole.getId())
                    .executeUpdate();

            // 5. Agregar usuario al grupo de Cognito
            if (user.getIdCognito() != null && !user.getIdCognito().isBlank()) {
                try {
                    cognitoService.agregarUsuarioAGrupo(user.getIdCognito(), rolNombre.toLowerCase());
                    System.out.println("Usuario agregado al grupo de Cognito '" + rolNombre.toLowerCase() + "'.");
                } catch (Exception e) {
                    throw new RuntimeException("Error al agregar usuario al grupo de Cognito: " + e.getMessage(), e);
                }
            }
            System.out.println("Rol de Jurado asignado exitosamente al usuario ID: " + userId);
        } else {
            System.out.println("El usuario ID: " + userId + " ya tiene el rol de Jurado activo. No se realizó ninguna acción.");
        }
    }

    /**
     * HU04: Quita el rol de Jurado a un usuario
     * REFACTORIZADO: Ahora también elimina al usuario del grupo de Cognito 'jurado'.
     */
    @Override
    @Transactional
    public void removeJuryRoleFromUser(Integer userId) {
        // 1. Buscar usuario
        Usuario user = usuarioRepository.findById(userId)
                .orElseThrow(() -> new NoSuchElementException("Usuario no encontrado: " + userId));

        // 2. Obtener rol Jurado
        String rolNombre = RolEnum.Jurado.name();
        Rol juryRole = rolRepository.findByNombre(rolNombre)
                .orElseThrow(() -> new NoSuchElementException("Rol '" + rolNombre + "' no configurado en el sistema"));

        // 3. Verificar si tiene el rol activo
        String countSql = "SELECT COUNT(*) FROM usuario_rol WHERE usuario_id = :usuarioId AND rol_id = :rolId AND activo = true";
        Number count = (Number) em.createNativeQuery(countSql)
                .setParameter("usuarioId", userId)
                .setParameter("rolId", juryRole.getId())
                .getSingleResult();

        if (count.intValue() > 0) {
            // 4. Desactivar el rol en la BD
            String updateSql = "UPDATE usuario_rol SET activo = false, fecha_modificacion = NOW() WHERE usuario_id = :usuarioId AND rol_id = :rolId AND activo = true";
            em.createNativeQuery(updateSql)
                    .setParameter("usuarioId", userId)
                    .setParameter("rolId", juryRole.getId())
                    .executeUpdate();

            // 5. Eliminar usuario del grupo de Cognito
            if (user.getIdCognito() != null && !user.getIdCognito().isBlank()) {
                try {
                    cognitoService.eliminarUsuarioDeGrupo(user.getIdCognito(), rolNombre.toLowerCase());
                    System.out.println("Usuario eliminado del grupo de Cognito '" + rolNombre.toLowerCase() + "'.");
                } catch (Exception e) {
                    throw new RuntimeException("Error al eliminar usuario del grupo de Cognito: " + e.getMessage(), e);
                }
            }
            System.out.println("Rol de Jurado quitado exitosamente al usuario ID: " + userId);
        } else {
            throw new IllegalArgumentException("El usuario no tiene el rol de Jurado asignado");
        }
    }

    /**
     * HU05: Obtiene la lista de profesores con sus roles asignados.
     * REFACTORIZADO: Ahora filtra los profesores para mostrar solo aquellos
     * que pertenecen a la misma Unidad Académica que el usuario que realiza la consulta.
     * 
     * @param rolNombre       Nombre del rol para filtrar (e.g., "Asesor", "Todos").
     * @param terminoBusqueda Término para buscar en nombre, correo o código.
     * @param idCognito       ID de Cognito del usuario que realiza la petición para determinar su unidad académica.
     * @return Lista de profesores filtrados.
     */
    @Override
    @Transactional(readOnly = true)
    public List<UsuarioConRolDto> getProfessorsWithRoles(String rolNombre, String terminoBusqueda, String idCognito) {
        // 1. Validar que idCognito no sea nulo o vacío
        if (idCognito == null || idCognito.trim().isEmpty()) {
            throw new IllegalArgumentException("El idCognito del solicitante es requerido para filtrar por unidad académica.");
        }

        StringBuilder sql = new StringBuilder();
        sql.append("""
            SELECT
                u.usuario_id,
                u.nombres,
                u.primer_apellido,
                u.segundo_apellido,
                u.correo_electronico,
                u.codigo_pucp,
                string_agg(DISTINCT r.nombre, ',') AS roles_names,
                -- >>> CAMBIO: Conteo separado para roles de Asesor/Co-Asesor y Jurado
                COUNT(DISTINCT CASE WHEN ut.rol_id IN (1, 5) THEN ut.tema_id END) AS tesis_asesor_count,
                COUNT(DISTINCT CASE WHEN ut.rol_id = 2 THEN ut.tema_id END) AS tesis_jurado_count,
                tu.tipo_usuario_id,
                tu.nombre AS tipo_usuario_nombre
            FROM
                usuario u
            JOIN
                tipo_usuario tu ON u.tipo_usuario_id = tu.tipo_usuario_id
            -- >>> CAMBIO: JOIN para acceder a la carrera y unidad académica del profesor
            JOIN
                usuario_carrera uc ON u.usuario_id = uc.usuario_id AND uc.activo = true
            JOIN
                carrera c ON uc.carrera_id = c.carrera_id
            LEFT JOIN
                usuario_rol ur ON u.usuario_id = ur.usuario_id AND ur.activo = true
            LEFT JOIN
                rol r ON ur.rol_id = r.rol_id AND r.activo = true
            LEFT JOIN
                usuario_tema ut ON u.usuario_id = ut.usuario_id AND ut.activo = true
            WHERE
                u.activo = true
                AND LOWER(tu.nombre) = 'profesor'
                -- >>> CAMBIO: Filtro por unidad académica del solicitante
                AND c.unidad_academica_id = (
                    SELECT c_solicitante.unidad_academica_id
                    FROM usuario u_solicitante
                    JOIN usuario_carrera uc_solicitante ON u_solicitante.usuario_id = uc_solicitante.usuario_id
                    JOIN carrera c_solicitante ON uc_solicitante.carrera_id = c_solicitante.carrera_id
                    WHERE u_solicitante.id_cognito = :idCognito
                    LIMIT 1
                )
        """);

        List<Object> params = new ArrayList<>();
        
        if (rolNombre != null && !rolNombre.equalsIgnoreCase("Todos")) {
            sql.append(" AND r.nombre = ?").append(params.size() + 1);
            params.add(rolNombre);
        }

        if (terminoBusqueda != null && !terminoBusqueda.trim().isEmpty()) {
            sql.append("""
                AND (
                    u.nombres ILIKE ?%d
                    OR u.primer_apellido ILIKE ?%d
                    OR u.segundo_apellido ILIKE ?%d
                    OR u.correo_electronico ILIKE ?%d
                    OR u.codigo_pucp ILIKE ?%d
                )
                """.formatted(
                params.size() + 1,
                params.size() + 2,
                params.size() + 3,
                params.size() + 4,
                params.size() + 5));

            String searchTerm = "%" + terminoBusqueda.trim() + "%";
            for (int i = 0; i < 5; i++) {
                params.add(searchTerm);
            }
        }

        sql.append("""
            GROUP BY
                u.usuario_id, c.unidad_academica_id, u.nombres, u.primer_apellido, u.segundo_apellido,
                u.correo_electronico, u.codigo_pucp, tu.tipo_usuario_id, tu.nombre
            ORDER BY
                u.primer_apellido, u.segundo_apellido, u.nombres
        """);

        // 2. Crear la consulta y establecer parámetros
        Query query = em.createNativeQuery(sql.toString());
        
        // Establecer el parámetro :idCognito
        query.setParameter("idCognito", idCognito);

        // Establecer los parámetros dinámicos (?1, ?2, ...)
        for (int i = 0; i < params.size(); i++) {
            query.setParameter(i + 1, params.get(i));
        }

        @SuppressWarnings("unchecked")
        List<Object[]> results = query.getResultList();

        // 3. Mapear los resultados (el mapeo no cambia)
        return results.stream()
            .map(row -> {
                // >>> CAMBIO: Los índices se desplazan por la nueva columna en el SELECT
                TipoUsuarioDto tipoUsuarioDto = TipoUsuarioDto.builder()
                        .id((Integer) row[9])
                        .nombre((String) row[10])
                        .activo(true)
                        .build();

                UsuarioDto usuarioBase = UsuarioDto.builder()
                        .id((Integer) row[0])
                        .nombres((String) row[1])
                        .primerApellido((String) row[2])
                        .segundoApellido((String) row[3])
                        .correoElectronico((String) row[4])
                        .codigoPucp((String) row[5])
                        .tipoUsuario(tipoUsuarioDto)
                        .activo(true)
                        .build();

                // >>> CAMBIO: Mapear a los nuevos campos del DTO
                return UsuarioConRolDto.builder()
                        .usuario(usuarioBase)
                        .rolesConcat((String) row[6])
                        .tesisAsesorCount(((Number) row[7]).intValue())
                        .tesisJuradoCount(((Number) row[8]).intValue())
                        .build();
            })
            .collect(Collectors.toList());
    }

    @Override
    public void procesarArchivoUsuarios(MultipartFile archivo, UsuarioRegistroDto datosExtra) throws Exception {
        String nombre = archivo.getOriginalFilename();

        if (nombre == null)
            throw new Exception("Archivo sin nombre");

        if (nombre.endsWith(".csv")) {
            procesarCSV(archivo, datosExtra);
            logger.warning("Procesando archivo CSV: " + nombre);
        } else if (nombre.endsWith(".xlsx")) {
            procesarExcel(archivo, datosExtra);
        } else {
            throw new Exception("Formato de archivo no soportado. Solo se acepta .csv o .xlsx");
        }
    }

    private void procesarCSV(MultipartFile archivo, UsuarioRegistroDto datosExtra) throws Exception {
        //obtener TipoUsuario
        Optional<TipoUsuario> tipoUsuarioOpt = buscarTipoUsuarioPorNombre(datosExtra.getTipoUsuarioNombre());
        if (tipoUsuarioOpt.isEmpty()) {
            throw new IllegalArgumentException("Tipo de usuario no válido: " + datosExtra.getTipoUsuarioNombre());
        }
        TipoUsuario tipoUsuario = tipoUsuarioOpt.get();
        //cargar Carrera/s
        Map<Integer, Carrera> carrerasMap = new HashMap<>();
        if (datosExtra.getCarreras() != null && !datosExtra.getCarreras().isEmpty()) {
            for (UsuarioRegistroDto.CarreraAsignadaDto carreraDto : datosExtra.getCarreras()) {
                Carrera carrera = carreraRepository.findById(carreraDto.getCarreraId())
                        .orElseThrow(() -> new IllegalArgumentException("Carrera no válida con ID: " + carreraDto.getCarreraId()));
                carrerasMap.put(carrera.getId(), carrera);
            }
        }
        // roles en caso de profesor
        Map<Integer, Rol> rolesMap = new HashMap<>();
        if (datosExtra.getRolesIds() != null) {
            for (Integer id : datosExtra.getRolesIds()) {
                rolRepository.findById(id).ifPresent(rol -> rolesMap.put(id, rol));
            }
        }
        try (BufferedReader reader = new BufferedReader(new InputStreamReader(archivo.getInputStream()))) {
            String linea;
            boolean primeraLinea = true;
            int fila = 1;
            while ((linea = reader.readLine()) != null) {
                fila++;
                if (primeraLinea) {
                    primeraLinea = false;
                    continue;
                }
                String[] campos = linea.split(",");
                if (campos.length < 5) {
                    System.err.printf("Fila %d con datos insuficientes.\n", fila);
                    continue;
                }
                String nombres = campos[0].trim();
                String primerApellido = campos[1].trim();
                String segundoApellido = campos[2].trim();
                String correo = campos[3].trim();
                String codigoPUCP = campos[4].trim();
                String inicialesDedicacion = campos.length >= 6 ? campos[5].trim() : null; //solo profe
                String nombreCompleto = nombres + " " + primerApellido + " " + segundoApellido;
                try {
                    // grupos de Cognito0
                    List<String> gruposCognito = new ArrayList<>();
                    boolean esCoordinador = false;
                    if ("profesor".equalsIgnoreCase(tipoUsuario.getNombre())) {
                        for (UsuarioRegistroDto.CarreraAsignadaDto carreraDto : datosExtra.getCarreras()) {
                            if (Boolean.TRUE.equals(carreraDto.getEsCoordinador())) {
                                esCoordinador = true;
                                gruposCognito.add("coordinador");
                                break;
                            }
                        }
                        for (Rol rol : rolesMap.values()) {
                            gruposCognito.add(rol.getNombre().toLowerCase());
                        }
                    } else {
                        gruposCognito.add(tipoUsuario.getNombre().toLowerCase());
                    }
                    // registrar en Cognito y obtener el sub/id, lo mismo
                    String grupoPrincipal = gruposCognito.isEmpty() ? tipoUsuario.getNombre().toLowerCase() : gruposCognito.get(0);
                    String idCognito = cognitoService.registrarUsuarioEnCognito(correo, nombreCompleto, grupoPrincipal);

                    // armar Usuario y guardlo en bd
                    Usuario usuario = new Usuario();
                    usuario.setTipoUsuario(tipoUsuario);
                    usuario.setCodigoPucp(codigoPUCP);
                    usuario.setNombres(nombres);
                    usuario.setPrimerApellido(primerApellido);
                    usuario.setSegundoApellido(segundoApellido);
                    usuario.setCorreoElectronico(correo);
                    usuario.setContrasena("Temp");
                    usuario.setIdCognito(idCognito);
                    usuario.setActivo(true);
                    usuario.setFechaCreacion(OffsetDateTime.now());
                    usuario.setFechaModificacion(OffsetDateTime.now());
                    //tipo de dedicación si es profesor, iniciales
                    if ("profesor".equalsIgnoreCase(tipoUsuario.getNombre()) && inicialesDedicacion != null && !inicialesDedicacion.isEmpty()) {
                        Optional<TipoDedicacion> dedicacionOpt = tipoDedicacionRepository.findByInicialesIgnoreCase(inicialesDedicacion);
                        if (dedicacionOpt.isEmpty()) {
                            System.err.printf("Fila %d: Tipo de dedicación '%s' no válido\n", fila, inicialesDedicacion);
                            continue;
                        }
                        usuario.setTipoDedicacion(dedicacionOpt.get());
                    }
                    usuarioRepository.save(usuario);

                    // guardar relción con carreras
                    if (datosExtra.getCarreras() != null && !datosExtra.getCarreras().isEmpty()) {
                        for (UsuarioRegistroDto.CarreraAsignadaDto carreraDto : datosExtra.getCarreras()) {
                            Carrera carrera = carrerasMap.get(carreraDto.getCarreraId());
                            UsuarioXCarrera relacion = new UsuarioXCarrera();
                            relacion.setUsuario(usuario);
                            relacion.setCarrera(carrera);
                            relacion.setActivo(true);
                            relacion.setEsCoordinador(Boolean.TRUE.equals(carreraDto.getEsCoordinador()));
                            usuarioXCarreraRepository.save(relacion);
                        }
                    }
                    // en caso de profesor, guardar roles y grupos extra en Cognito
                    if ("profesor".equalsIgnoreCase(tipoUsuario.getNombre())) {
                        for (Rol rol : rolesMap.values()) {
                            UsuarioXRol ur = new UsuarioXRol();
                            ur.setUsuario(usuario);
                            ur.setRol(rol);
                            ur.setActivo(true);
                            usuarioXRolRepository.save(ur);

                            if (!rol.getNombre().equalsIgnoreCase(grupoPrincipal)) {
                                cognitoService.agregarUsuarioAGrupo(idCognito, rol.getNombre().toLowerCase());
                            }
                        }
                        if (esCoordinador && !grupoPrincipal.equals("coordinador")) {
                            cognitoService.agregarUsuarioAGrupo(idCognito, "coordinador");
                        }
                    }
                    System.out.printf("Fila %d: usuario '%s' creado exitosamente.\n", fila, correo);
                } catch (Exception e) {
                    System.err.printf("Fila %d: error al registrar usuario '%s': %s\n", fila, correo, e.getMessage());
                }
            }
        } catch (IOException e) {
            System.err.println("Error general al leer el CSV: " + e.getMessage());
        }
    }

    private void procesarExcel(MultipartFile archivo, UsuarioRegistroDto datosExtra) throws Exception {
        // obtener TipoUsuario
        Optional<TipoUsuario> tipoUsuarioOpt = buscarTipoUsuarioPorNombre(datosExtra.getTipoUsuarioNombre());
        if (tipoUsuarioOpt.isEmpty()) {
            throw new IllegalArgumentException("Tipo de usuario no válido: " + datosExtra.getTipoUsuarioNombre());
        }
        TipoUsuario tipoUsuario = tipoUsuarioOpt.get();
        //obtener carreras
        Map<Integer, Carrera> carrerasMap = new HashMap<>();
        if (datosExtra.getCarreras() != null && !datosExtra.getCarreras().isEmpty()) {
            for (UsuarioRegistroDto.CarreraAsignadaDto carreraDto : datosExtra.getCarreras()) {
                Carrera carrera = carreraRepository.findById(carreraDto.getCarreraId())
                        .orElseThrow(() -> new IllegalArgumentException("Carrera no válida con ID: " + carreraDto.getCarreraId()));
                carrerasMap.put(carrera.getId(), carrera);
            }
        }
        // cargar roles desde IDs
        Map<Integer, Rol> rolesMap = new HashMap<>();
        if (datosExtra.getRolesIds() != null) {
            for (Integer id : datosExtra.getRolesIds()) {
                rolRepository.findById(id).ifPresent(rol -> rolesMap.put(id, rol));
            }
        }
        try (InputStream is = archivo.getInputStream(); Workbook workbook = new XSSFWorkbook(is)) {
            Sheet hoja = workbook.getSheetAt(0);
            for (int filaIndex = 1; filaIndex <= hoja.getLastRowNum(); filaIndex++) {
                Row fila = hoja.getRow(filaIndex);
                if (fila == null) {
                    System.err.printf("Fila %d vacía, omitida.\n", filaIndex + 1);
                    continue;
                }
                String nombres = getCellValue(fila.getCell(0));
                String primerApellido = getCellValue(fila.getCell(1));
                String segundoApellido = getCellValue(fila.getCell(2));
                String correo = getCellValue(fila.getCell(3));
                String codigoPUCP = getCellValue(fila.getCell(4));
                String inicialesDedicacion = getCellValue(fila.getCell(5)); // solo para profesor
                if (nombres.isBlank() || primerApellido.isBlank() || segundoApellido.isBlank() || correo.isBlank() || codigoPUCP.isBlank()) {
                    System.err.printf("Fila %d no procesada: campos incompletos.\n", filaIndex + 1);
                    continue;
                }
                String nombreCompleto = nombres + " " + primerApellido + " " + segundoApellido;
                try {
                    // grupos de Cognito
                    List<String> gruposCognito = new ArrayList<>();
                    boolean esCoordinador = false;
                    if ("profesor".equalsIgnoreCase(tipoUsuario.getNombre())) {
                        for (UsuarioRegistroDto.CarreraAsignadaDto carreraDto : datosExtra.getCarreras()) {
                            if (Boolean.TRUE.equals(carreraDto.getEsCoordinador())) {
                                esCoordinador = true;
                                gruposCognito.add("coordinador");
                                break; // coordi solo de una carrera
                            }
                        }
                        for (Rol rol : rolesMap.values()) {
                            gruposCognito.add(rol.getNombre().toLowerCase());
                        }
                    } else {
                        gruposCognito.add(tipoUsuario.getNombre().toLowerCase());
                    }
                    // Cognito
                    String grupoPrincipal = gruposCognito.isEmpty() ? tipoUsuario.getNombre().toLowerCase() : gruposCognito.get(0);
                    String idCognito = cognitoService.registrarUsuarioEnCognito(correo, nombreCompleto, grupoPrincipal);
                    // armar usuario y guardarlo en bd
                    Usuario usuario = new Usuario();
                    usuario.setTipoUsuario(tipoUsuario);
                    usuario.setCodigoPucp(codigoPUCP);
                    usuario.setNombres(nombres);
                    usuario.setPrimerApellido(primerApellido);
                    usuario.setSegundoApellido(segundoApellido);
                    usuario.setCorreoElectronico(correo);
                    usuario.setContrasena("Temp");
                    usuario.setIdCognito(idCognito);
                    usuario.setActivo(true);
                    usuario.setFechaCreacion(OffsetDateTime.now());
                    usuario.setFechaModificacion(OffsetDateTime.now());
                    // tipo de dedicación si es profesor, iniciales
                    if ("profesor".equalsIgnoreCase(tipoUsuario.getNombre()) && inicialesDedicacion != null && !inicialesDedicacion.isBlank()) {
                        tipoDedicacionRepository.findByInicialesIgnoreCase(inicialesDedicacion)
                                .ifPresent(usuario::setTipoDedicacion);
                    }
                    usuarioRepository.save(usuario);
                    // guardar relción con carrera
                    if (datosExtra.getCarreras() != null && !datosExtra.getCarreras().isEmpty()) {
                        for (UsuarioRegistroDto.CarreraAsignadaDto carreraDto : datosExtra.getCarreras()) {
                            Carrera carrera = carrerasMap.get(carreraDto.getCarreraId());
                            UsuarioXCarrera relacion = new UsuarioXCarrera();
                            relacion.setUsuario(usuario);
                            relacion.setCarrera(carrera);
                            relacion.setActivo(true);
                            relacion.setEsCoordinador(Boolean.TRUE.equals(carreraDto.getEsCoordinador()));
                            usuarioXCarreraRepository.save(relacion);
                            if (Boolean.TRUE.equals(carreraDto.getEsCoordinador()) && !"coordinador".equals(grupoPrincipal)) {
                                cognitoService.agregarUsuarioAGrupo(idCognito, "coordinador");
                            }
                        }
                    }
                    // para profesor, registrar roles y grupos extra en Cognito
                    if ("profesor".equalsIgnoreCase(tipoUsuario.getNombre())) {
                        for (Rol rol : rolesMap.values()) {
                            UsuarioXRol ur = new UsuarioXRol();
                            ur.setUsuario(usuario);
                            ur.setRol(rol);
                            ur.setActivo(true);
                            usuarioXRolRepository.save(ur);
                            if (!rol.getNombre().equalsIgnoreCase(grupoPrincipal)) {
                                cognitoService.agregarUsuarioAGrupo(idCognito, rol.getNombre().toLowerCase());
                            }
                        }
                    }
                    System.out.printf("Fila %d: usuario '%s' creado exitosamente.\n", filaIndex + 1, correo);
                } catch (Exception e) {
                    System.err.printf("Fila %d: error al registrar usuario '%s': %s\n", filaIndex + 1, correo, e.getMessage());
                }
            }
        } catch (IOException e) {
            System.err.println("Error al leer el Excel: " + e.getMessage());
        }
    }

    private String getCellValue(Cell celda) {
        if (celda == null)
            return "";

        switch (celda.getCellType()) {
            case STRING:
                return celda.getStringCellValue().trim();
            case NUMERIC:
                if (DateUtil.isCellDateFormatted(celda)) {
                    return celda.getDateCellValue().toString();
                }
                return String.valueOf((long) celda.getNumericCellValue()); // Si esperas solo enteros
            case BOOLEAN:
                return String.valueOf(celda.getBooleanCellValue());
            case FORMULA:
                return celda.getCellFormula();
            case BLANK:
            case _NONE:
            case ERROR:
            default:
                return "";
        }
    }

    private Optional<TipoUsuario> buscarTipoUsuarioPorNombre(String nombre) {
        String nombreLimpio = nombre.trim().toLowerCase();
        return tipoUsuarioRepository.findAll().stream()
                .filter(tu -> tu.getNombre().equalsIgnoreCase(nombreLimpio))
                .findFirst();
    }

    @Override
    public List<UsuarioDto> getAsesoresBySubArea(Integer idSubArea) {
        String sql = "SELECT usuario_id, nombre_completo, correo_electronico " +
                "  FROM sgtadb.listar_asesores_por_subarea_conocimiento(:p_subarea_id)";
        Query query = em.createNativeQuery(sql)
                .setParameter("p_subarea_id", idSubArea);

        @SuppressWarnings("unchecked")
        List<Object[]> rows = query.getResultList();
        List<UsuarioDto> advisors = new ArrayList<>(rows.size());

        for (Object[] row : rows) {
            Integer userId = ((Number) row[0]).intValue();
            String fullName = (String) row[1];
            String email = (String) row[2];

            advisors.add(UsuarioDto.builder()
                    .id(userId)
                    .nombres(fullName.split(" ")[0])
                    .primerApellido(fullName.split(" ")[1])
                    .correoElectronico(email)
                    .build());
        }

        return advisors;
    }

    @Override
    public void uploadFoto(Integer idUsuario, MultipartFile file) {
        Usuario user = usuarioRepository.findById(idUsuario).orElse(null);
        if (user == null) {
            throw new RuntimeException("Usuario no encontrado con ID: " + idUsuario);
        }
        try {
            user.setFotoPerfil(file.getBytes());
            usuarioRepository.save(user);
        } catch (IOException e) {
            throw new RuntimeException("No se pudo subir foto del usuario: " + idUsuario);
        }
    }

    @Override
    public UsuarioFotoDto getUsuarioFoto(Integer id) {
        Usuario user = usuarioRepository.findById(id).orElse(null);
        if (user == null) {
            throw new RuntimeException("Usuario no encontrado con ID: " + id);
        }
        UsuarioFotoDto usuarioFotoDto = new UsuarioFotoDto();
        usuarioFotoDto.setIdUsuario(id);

        usuarioFotoDto.setFoto(Utils.convertByteArrayToStringBase64(user.getFotoPerfil()));
        return usuarioFotoDto;
    }

    public List<PerfilAsesorDto> buscarAsesoresPorCadenaDeBusqueda(String cadena, Integer idUsuario) {

        List<Object[]> queryResults = usuarioRepository
                .buscarAsesoresPorCadenaDeBusqueda(idUsuario,
                        cadena,
                        true,
                        Utils.convertIntegerListToString(new ArrayList<>()),
                        Utils.convertIntegerListToString(new ArrayList<>()));

        castDirectoryQueryToDto(queryResults);
        List<PerfilAsesorDto> perfilAsesorDtos = castDirectoryQueryToDto(queryResults);
        return perfilAsesorDtos;

    }

    private List<PerfilAsesorDto> castDirectoryQueryToDto(List<Object[]> queryResults) {
        List<PerfilAsesorDto> perfilAsesorDtos = new ArrayList<>();

        for (Object[] result : queryResults) {
            PerfilAsesorDto perfil = PerfilAsesorDto.fromQueryDirectorioAsesores(result);
            // el numero de tesistas actuales
            Integer cantTesistas;
            List<Object[]> tesistas = usuarioXTemaRepository.listarNumeroTesistasAsesor(perfil.getId());// ASEGURADO
            // sale 1 sola
            // fila
            cantTesistas = (Integer) tesistas.get(0)[0];
            perfil.setTesistasActuales(cantTesistas);
            // Luego la consulta de las áreas de conocimiento
            List<InfoAreaConocimientoDto> areas;
            List<Integer> idAreas = usuarioXAreaConocimientoRepository
                    .findAllByUsuario_IdAndActivoIsTrue(perfil.getId()).stream()
                    .map(UsuarioXAreaConocimiento::getAreaConocimiento)
                    .map(AreaConocimiento::getId)
                    .toList();
            areas = areaConocimientoRepository.findAllByIdIn(idAreas)
                    .stream()
                    .map(InfoAreaConocimientoMapper::toDto)
                    .toList();
            // Luego la consulta de las subareas de conocimiento
            List<InfoSubAreaConocimientoDto> subareas;
            List<Integer> idSubareas = usuarioXSubAreaConocimientoRepository
                    .findAllByUsuario_IdAndActivoIsTrue(perfil.getId()).stream()
                    .map(UsuarioXSubAreaConocimiento::getSubAreaConocimiento)
                    .map(SubAreaConocimiento::getId)
                    .toList();
            subareas = subAreaConocimientoRepository.findAllByIdIn(idSubareas)
                    .stream()
                    .map(InfoSubAreaConocimientoMapper::toDto)
                    .toList();

            perfil.setAreasTematicas(areas);
            perfil.setTemasIntereses(subareas);
            // Toques finales
            perfil.actualizarEstado();
            perfilAsesorDtos.add(perfil);
        }
        return perfilAsesorDtos;
    }

    @Override
    public Page<PerfilAsesorDto> getDirectorioDeAsesoresPorFiltros(FiltrosDirectorioAsesores filtros, Integer pageNumber, Boolean ascending) {
        int pageSize = 5;
        Pageable pageable;
        if(ascending) {
            pageable = PageRequest.of(pageNumber, pageSize, Sort.by("nombres","primer_apellido").ascending());
        }else{
            pageable = PageRequest.of(pageNumber, pageSize, Sort.by("nombres","primer_apellido").descending());
        }
        Page<Object[]> queryResults = usuarioRepository
                .obtenerListaDirectorioAsesoresAlumno(filtros.getAlumnoId(),
                        filtros.getCadenaBusqueda(),
                        filtros.getActivo(),
                        Utils.convertIntegerListToString(filtros.getIdAreas()),
                        Utils.convertIntegerListToString(filtros.getIdTemas()),
                        pageable);

        List<Object[]> pageResults = queryResults.getContent();
        List<PerfilAsesorDto> perfilAsesorDtos = castDirectoryQueryToDto(pageResults);

        return new PageImpl<>(
                perfilAsesorDtos,                   // contenido paginado ya transformado
                pageable,                           // mismo Pageable usado originalmente
                queryResults.getTotalElements()    // total de elementos desde la BD
        );

    }

    @Override
    public UsuarioDto findUsuarioByCodigo(String codigoPucp) {
        Optional<Usuario> usuario = usuarioRepository.findByCodigoPucp(codigoPucp);
        if (usuario.isPresent()) {
            UsuarioDto usuarioDto = UsuarioMapper.toDto(usuario.get());
            return usuarioDto;
        }
        return null;
    }

    @Override
    public UsuarioDto findByCognitoId(String cognitoId) throws NoSuchElementException {
        Optional<Usuario> usuario = usuarioRepository.findByIdCognito(cognitoId);
        if (usuario.isPresent()) {
            return UsuarioMapper.toDto(usuario.get());
        } else {
            throw new NoSuchElementException("Usuario not found with ID Cognito: " + cognitoId);
        }
    }

    @Override
    public AlumnoTemaDto getAlumnoTema(String idUsuario) {
        try {

            UsuarioDto usuDto = findByCognitoId(idUsuario);

            if (usuDto == null) {
                throw new RuntimeException("Usuario no encontrado con Cognito ID: " + idUsuario);
            }
            Integer idAlumno = usuDto.getId();
            String sqlDetalle = """
                    	SELECT * FROM obtener_detalle_tesista(:p_tesista_id)
                    """;

            Query queryDetalle = em.createNativeQuery(sqlDetalle)
                    .setParameter("p_tesista_id", idAlumno);

            @SuppressWarnings("unchecked")
            List<Object[]> resultsDetalle = queryDetalle.getResultList();

            if (resultsDetalle.isEmpty()) {
                throw new NoSuchElementException("No se encontraron datos para el alumno con ID: " + idAlumno);
            }

            Object[] rowDetalle = resultsDetalle.get(0);

            //Luego obtenemos el progreso del alumno y el siguiente entregable
            String sqlProgreso = """
                    	SELECT * FROM calcular_progreso_alumno(:p_alumno_id)
                    """;

            Query queryProgreso = em.createNativeQuery(sqlProgreso)
                    .setParameter("p_alumno_id", idAlumno);

            @SuppressWarnings("unchecked")
            List<Object[]> resultsProgreso = queryProgreso.getResultList();


            AlumnoTemaDto alumnoTemaDto = new AlumnoTemaDto();
            alumnoTemaDto.setId((Integer) rowDetalle[0]); // tesista_id
            alumnoTemaDto.setTemaNombre((String) rowDetalle[9]); // tema_nombre
            alumnoTemaDto.setAsesorNombre((String) rowDetalle[15]); // asesor_nombre
            alumnoTemaDto.setCoasesorNombre((String) rowDetalle[17]); // coasesor_nombre
            alumnoTemaDto.setAreaNombre((String) rowDetalle[13]); // area_conocimiento
            alumnoTemaDto.setSubAreaNombre((String) rowDetalle[14]); // sub_area_conocimiento

            // Agregamos la información de progreso y siguiente entregable
            if (!resultsProgreso.isEmpty()) {
                Object[] rowProgreso = resultsProgreso.get(0);
                alumnoTemaDto.setTotalEntregables((Integer) rowProgreso[0]);
                alumnoTemaDto.setEntregablesEnviados((Integer) rowProgreso[1]);
                alumnoTemaDto.setPorcentajeProgreso(((Number) rowProgreso[2]).doubleValue());

                // Información del siguiente entregable no enviado
                if (rowProgreso[3] != null) { // siguiente_entregable_nombre
                    alumnoTemaDto.setSiguienteEntregableNombre((String) rowProgreso[3]);
                    if (rowProgreso[4] != null) { // siguiente_entregable_fecha_fin
                        // Manejo seguro de la conversión de fechas
                        if (rowProgreso[4] instanceof java.sql.Timestamp) {
                            alumnoTemaDto.setSiguienteEntregableFechaFin(((java.sql.Timestamp) rowProgreso[4])
                                    .toInstant().atOffset(java.time.ZoneOffset.UTC));
                        } else if (rowProgreso[4] instanceof java.time.Instant) {
                            alumnoTemaDto.setSiguienteEntregableFechaFin(
                                    ((java.time.Instant) rowProgreso[4]).atOffset(java.time.ZoneOffset.UTC));
                        }
                    }
                }
            } else {
                alumnoTemaDto.setTotalEntregables(0);
                alumnoTemaDto.setEntregablesEnviados(0);
                alumnoTemaDto.setPorcentajeProgreso(0.0);
            }

            return alumnoTemaDto;
        } catch (NoSuchElementException e) {
            throw e; 
        } catch (Exception e) {
            logger.severe("Error al obtener datos del alumno " + idUsuario + ": " + e.getMessage());
            throw new RuntimeException("Error al obtener datos del alumno: " + e.getMessage());
        }
    }

    @Override
    public List<AlumnoReporteDto> findByStudentsForReviewer(String idCognito, String cadenaBusqueda) {
        // Primero obtenemos el ID del usuario usando el idCognito
        Usuario usuario = usuarioRepository.findByIdCognito(idCognito)
                .orElseThrow(() -> new NoSuchElementException("Usuario no encontrado con ID Cognito: " + idCognito));

        String sql = """
                SELECT *
                FROM obtener_alumnos_por_carrera_revisor(:usuarioId, :cadena)
                """;

        @SuppressWarnings("unchecked")
        List<Object[]> rows = em.createNativeQuery(sql)
                .setParameter("usuarioId", usuario.getId())
                .setParameter("cadena", cadenaBusqueda)
                .getResultList();

        List<AlumnoReporteDto> lista = new ArrayList<>();
        for (Object[] r : rows) {
            AlumnoReporteDto alumno = AlumnoReporteDto.builder()
                    .usuarioId((Integer) r[0])
                    .codigoPucp((String) r[1])
                    .nombres((String) r[2])
                    .primerApellido((String) r[3])
                    .segundoApellido((String) r[4])
                    .temaTitulo((String) r[5])
                    .temaId((Integer) r[6])
                    .asesor((String) r[7])
                    .coasesor((String) r[8])
                    .activo((Boolean) r[9])
                    .build();

            lista.add(alumno);
        }

        return lista;
    }

    @Override
    public PerfilUsuarioDto getPerfilUsuario(Integer usuarioId) {
        List<Object[]> queryResult = usuarioRepository.obtenerPerfilUsuario(usuarioId);
        if(queryResult.isEmpty()) {
            throw new RuntimeException("No se encontró un perfil de usuario correspondiente");
        }
        PerfilUsuarioDto dto = PerfilUsuarioDto.fromMainQuery(queryResult.get(0));//Debe de haber uno solo
        Integer cantTesistas;
        List<Object[]> tesistas = usuarioXTemaRepository.listarNumeroTesistasAsesor(dto.getId());// ASEGURADO sale 1 sola fila
        cantTesistas = (Integer) tesistas.get(0)[0];
        dto.setTesistasActuales(cantTesistas);
        //Obtenemos Areas y SubAreas de interes
        dto.setAreasTematicas(listarInfoAreaConocimientoParaPerfilPorUsuario(dto.getId()));
        dto.setTemasIntereses(listarInfoSubAreaConocimientoParaPerfilPorUsuario(dto.getId()));
        //Obtenemos los enlaces
        dto.setEnlaces(enlaceUsuarioServiceImpl.listarParaPerfilPorUsuario(dto.getId()));
        return dto;
    }

    @Override
    public void updatePerfilUsuario(PerfilUsuarioDto dto) {
        Usuario u = usuarioRepository.findById(dto.getId()).orElseThrow(() -> new RuntimeException("No se encontró al usuario"));
        PerfilAsesorDto asesorDto = PerfilAsesorDto.fromPerfilUsuario(dto);
        updatePerfilAsesor(asesorDto);
        List<EnlaceUsuarioDto> enlaces = dto.getEnlaces();
        enlaceUsuarioServiceImpl.sincronizarEnlacesUsuario(enlaces,u);
    }

    @Override
    public String obtenerCognitoPorId(Integer idUsuario) {
        String idCognito =usuarioRepository.findIdCognitoByUsuarioId(idUsuario);
        if(idCognito == null) {
            throw new RuntimeException("Usuario no encontrado con ID Cognito: " + idUsuario);
        }
        return idCognito;
    }

    @Override
    public Integer obtenerIdUsuarioPorCognito(String cognito) {
        Integer id = usuarioRepository.findUsuarioIdByIdCognito(cognito);
        if(id == null) {
            throw new RuntimeException("No se econtró usuario asociado con el servicio Cognito");
        }
        return id;
    }

    @Override
    public List<DocentesDTO> getProfesores() {
        List<Object[]> rows = usuarioRepository.obtenerProfesores();
        List<DocentesDTO> docentes = new ArrayList<>();
        for (Object[] r : rows) {

            List<Integer> idAreas = usuarioXAreaConocimientoRepository
                    .findAllByUsuario_IdAndActivoIsTrue((Integer) r[0]).stream()
                    .map(UsuarioXAreaConocimiento::getAreaConocimiento)
                    .map(AreaConocimiento::getId)
                    .toList();

            DocentesDTO docente = DocentesDTO.builder()
                    .id((Integer) r[0])
                    .nombres((String) r[1])
                    .primerApellido((String) r[2])
                    .segundoApellido((String) r[3])
                    .codigoPucp((String) r[4])
                    .correoElectronico((String) r[5])
                    .tipoDedicacion((String) r[6])
                    .cantTemasAsignados((Long) r[7])
                    .areasConocimientoIds(idAreas)
                    .build();

            docentes.add(docente);
        }
        return docentes;
    }

    @Override
    public void validarTipoUsuarioRolUsuario(String cognitoId, List<TipoUsuarioEnum> tipos, RolEnum rol) {
        //Almenos debe hacerse la validación de tipoUsuario
        if (tipos  == null || tipos.isEmpty())
            throw new ResponseStatusException(
                        HttpStatus.INTERNAL_SERVER_ERROR,
                        "La validación necesita al menos un tipo de usuario"
            );

        //Validar que exista un usuario con ese cognitoID
        if(!usuarioRepository.existsByIdCognito(cognitoId))
            throw new ResponseStatusException(
                        HttpStatus.NOT_FOUND,
                        "No se encontró un usuario asociado a su token"
            );

        //Validar el tipo Usuario
        boolean encontro;
        for(TipoUsuarioEnum tipoUsuario : tipos) {
            encontro = tipoUsuarioRepository.existsByNombre(tipoUsuario.name());
            if (!encontro)
                throw new ResponseStatusException(
                    HttpStatus.INTERNAL_SERVER_ERROR,
                    "Error en validación interna"
                );
        }

        //Validar que tenga ese tipo
        encontro = false;
        for(TipoUsuarioEnum tipoUsuario : tipos) {
            encontro = usuarioRepository.existsByIdCognitoAndTipoUsuarioNombre(cognitoId, tipoUsuario.name());
            if (encontro) break;
        }
        if(!encontro)
            throw new ResponseStatusException(
                    HttpStatus.UNAUTHORIZED,
                    "No se pudo validar sus credenciales"
            );

        if(rol == null) return;

        //Validar el rol
        if(!rolRepository.existsByNombre(rol.name()))
            throw new ResponseStatusException(
                    HttpStatus.INTERNAL_SERVER_ERROR,
                    "Error en validación interna"
            );

        if(usuarioXRolRepository.existsByUsuario_IdCognitoAndRol_Nombre(cognitoId, rol.name()))
            throw new ResponseStatusException(
                    HttpStatus.UNAUTHORIZED,
                    "No se pudo validar sus credenciales"
            );
    }

    public Usuario buscarUsuarioPorId(Integer idUsuario, String onErrorMsg){
        return usuarioRepository
                .findById(idUsuario)
                .orElseThrow(() -> new RuntimeException(onErrorMsg));
    }

    public Usuario buscarUsuarioPorCognito(String idCognito, String onErrorMsg){
        Integer idUsuario = obtenerIdUsuarioPorCognito(idCognito);
        return buscarUsuarioPorId(idUsuario, onErrorMsg);
    }

    public List<InfoAreaConocimientoDto> listarInfoAreaConocimientoParaPerfilPorUsuario(Integer usuarioId){
        List<Object[]> queryResult = areaConocimientoRepository.listarParaPerfilPorUsuarioId(usuarioId);
        List<InfoAreaConocimientoDto> dtos = new ArrayList<>();
        for (Object[] row : queryResult) {
            InfoAreaConocimientoDto dto = InfoAreaConocimientoDto.fromQuery(row);
            dtos.add(dto);
        }
        return dtos;
    }


    public List<InfoSubAreaConocimientoDto> listarInfoSubAreaConocimientoParaPerfilPorUsuario(Integer idUsuario) {
        List<Object[]> queryResult = subAreaConocimientoRepository.listarParaPerfilPorUsuarioId(idUsuario);
        List<InfoSubAreaConocimientoDto> dtos = new ArrayList<>();
        for (Object[] row : queryResult) {
            InfoSubAreaConocimientoDto dto = InfoSubAreaConocimientoDto.fromQuery(row);
            dtos.add(dto);
        }
        return dtos;
    }

    @Override
    public List<UsuarioRolRevisorDto> listarRevisoresPorCarrera(Integer carreraId) {
        List<Object[]> result = usuarioRepository.listarRevisoresPorCarrera(carreraId);
        List<UsuarioRolRevisorDto> revisores = new ArrayList<>();

        for (Object[] row : result) {
            UsuarioRolRevisorDto dto = new UsuarioRolRevisorDto();
            dto.setId((Integer) row[0]); // tema_id
            dto.setUsuarioId((Integer) row[1]); // usuario_id
            dto.setCodigoPucp((String) row[2]); // codigo_pucp
            dto.setNombres((String) row[3]); // nombres
            dto.setPrimerApellido((String) row[4]); // primer_apellido
            dto.setSegundoApellido((String) row[5]); // segundo_apellido
            dto.setCorreoElectronico((String) row[6]); // correo_electronico
            dto.setRolId((Integer) row[7]); // rol_id
            dto.setRolNombre((String) row[8]); // rol_nombre
            dto.setCarreraId((Integer) row[9]); // carrera_id
            dto.setCarreraNombre((String) row[10]); // carrera_nombre
            revisores.add(dto);
        }
        return revisores;
    }


    public List<UsuarioDto> findAllByIds(Collection<Integer> ids) {
        if (ids == null || ids.isEmpty()) {
            return List.of();
        }
        return usuarioRepository.findAllById(ids).stream()
            .map(u -> UsuarioDto.builder()
                .id(u.getId())
                .nombres(u.getNombres())
                .primerApellido(u.getPrimerApellido())
                .segundoApellido(u.getSegundoApellido())
                .build()
            )
            .collect(Collectors.toList());
    }
}
