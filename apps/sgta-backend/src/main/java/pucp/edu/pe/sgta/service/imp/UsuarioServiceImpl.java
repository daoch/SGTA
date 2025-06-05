package pucp.edu.pe.sgta.service.imp;

import org.apache.coyote.BadRequestException;
import org.apache.http.HttpException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.client.HttpStatusCodeException;
import org.springframework.web.server.ResponseStatusException;
import pucp.edu.pe.sgta.dto.asesores.InfoAreaConocimientoDto;
import pucp.edu.pe.sgta.dto.asesores.InfoSubAreaConocimientoDto;
import pucp.edu.pe.sgta.dto.asesores.PerfilAsesorDto;
import pucp.edu.pe.sgta.dto.asesores.UsuarioConRolDto;
import jakarta.persistence.Query;
import org.apache.poi.ss.usermodel.*;
import org.apache.poi.xssf.usermodel.XSSFWorkbook;
import org.springframework.web.multipart.MultipartFile;
import pucp.edu.pe.sgta.dto.asesores.FiltrosDirectorioAsesores;
import pucp.edu.pe.sgta.dto.asesores.UsuarioFotoDto;
import pucp.edu.pe.sgta.dto.AlumnoTemaDto;
import pucp.edu.pe.sgta.dto.DocentesDTO;
import jakarta.persistence.EntityManager;
import jakarta.persistence.PersistenceContext;
import pucp.edu.pe.sgta.dto.TipoUsuarioDto;
import pucp.edu.pe.sgta.dto.UsuarioDto;
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
import java.util.ArrayList;
import java.sql.Timestamp;
import java.time.Instant;
import java.time.OffsetDateTime;
import java.time.ZoneOffset;
import java.util.List;
import java.util.Optional;
import java.util.logging.Logger;
import java.util.NoSuchElementException;
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
    public void createUsuario(UsuarioDto usuarioDto) {
        Usuario usuario = UsuarioMapper.toEntity(usuarioDto);

        Optional<TipoUsuario> tipoUsuario = buscarTipoUsuarioPorNombre(usuario.getTipoUsuario().getNombre());
        if (tipoUsuario.isEmpty()) {
            System.out.println("Rol inválido para: " + usuario.getCorreoElectronico());
            throw new IllegalArgumentException("Tipo de usuario no válido: " + tipoUsuario);
        }
        usuario.setTipoUsuario(tipoUsuario.get());
        usuario.setContrasena("Temp");
        String nombreCompleto = usuario.getNombres() + " " + usuario.getPrimerApellido() + " "
                + usuario.getSegundoApellido();

        try {
            // Registrar el usuario en Cognito
            String idCognito = cognitoService.registrarUsuarioEnCognito(usuario.getCorreoElectronico(), nombreCompleto,
                    tipoUsuario.get().getNombre());
            usuario.setIdCognito(idCognito);
            usuarioRepository.save(usuario);
        } catch (Exception e) {
            System.out.println("Error al registrar usuario: " + e.getMessage());
            throw new RuntimeException("Error al registrar el usuario", e);
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
    public void updateUsuario(Integer id, UsuarioDto usuarioDto) {
        Usuario usuario = usuarioRepository.findById(id)
                .orElseThrow(() -> new NoSuchElementException("Usuario no encontrado con ID: " + id));

        // Variables para consolidar los cambios
        String tipoUsuarioAnterior = usuario.getTipoUsuario().getNombre();
        String tipoUsuarioNuevo = usuarioDto.getTipoUsuario().getNombre();
        String correoAnterior = usuario.getCorreoElectronico();
        String correoNuevo = usuarioDto.getCorreoElectronico();

        // Verificar cambios en el tipo de usuario
        if (!tipoUsuarioAnterior.equalsIgnoreCase(tipoUsuarioNuevo)) {
            Optional<TipoUsuario> nuevoTipo = buscarTipoUsuarioPorNombre(tipoUsuarioNuevo);
            if (nuevoTipo.isEmpty()) {
                throw new IllegalArgumentException("Tipo de usuario no válido: " + tipoUsuarioNuevo);
            }
            usuario.setTipoUsuario(nuevoTipo.get());
        }

        // Verificar cambios en el correo electrónico
        if (!correoAnterior.equalsIgnoreCase(correoNuevo)) {
            usuario.setCorreoElectronico(correoNuevo);
        }

        // Actualizar otros campos
        usuario.setNombres(usuarioDto.getNombres());
        usuario.setPrimerApellido(usuarioDto.getPrimerApellido());
        usuario.setSegundoApellido(usuarioDto.getSegundoApellido());
        usuario.setBiografia(usuarioDto.getBiografia());
        usuario.setEnlaceLinkedin(usuarioDto.getEnlaceLinkedin());
        usuario.setEnlaceRepositorio(usuarioDto.getEnlaceRepositorio());
        usuario.setFechaModificacion(OffsetDateTime.now());

        // Llamar a Cognito para aplicar todos los cambios
        cognitoService.updateUsuarioEnCognito(usuario.getIdCognito(),
                tipoUsuarioAnterior.equalsIgnoreCase(tipoUsuarioNuevo) ? null : tipoUsuarioAnterior,
                tipoUsuarioAnterior.equalsIgnoreCase(tipoUsuarioNuevo) ? null : tipoUsuarioNuevo,
                correoAnterior.equalsIgnoreCase(correoNuevo) ? null : correoNuevo);

        usuarioRepository.save(usuario);
    }

    @Override
    public void deleteUsuario(Integer id) {
        Usuario usuario = usuarioRepository.findById(id)
                .orElseThrow(() -> new NoSuchElementException("Usuario no encontrado con ID: " + id));
        // Llamar al servicio de Cognito para eliminar al usuario
        if (usuario.getIdCognito() != null) {
            try {
                cognitoService.eliminarUsuarioEnCognito(usuario.getIdCognito());
            } catch (Exception e) {
                throw new RuntimeException(e);
            }
        }
        usuario.setActivo(false);
        usuario.setFechaModificacion(OffsetDateTime.now());
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
                    .disponibilidad((String) r[13])
                    .tipoDisponibilidad((String) r[14])
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
            // 4. Insertar nuevo rol activo
            String insertSql = "INSERT INTO usuario_rol (usuario_id, rol_id, activo, fecha_creacion, fecha_modificacion) "
                    +
                    "VALUES (:usuarioId, :rolId, true, NOW(), NOW())";
            em.createNativeQuery(insertSql)
                    .setParameter("usuarioId", userId)
                    .setParameter("rolId", advisorRole.getId())
                    .executeUpdate();
            System.out.println("Rol de Asesor asignado exitosamente al usuario ID: " + userId);
        } else {
            System.out.println(
                    "El usuario ID: " + userId + " ya tiene el rol de Asesor activo. No se realizó ninguna acción.");
        }
    }

    /**
     * HU02: Quita el rol de Asesor a un usuario
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
            String updateSql = "UPDATE usuario_rol SET activo = false, fecha_modificacion = NOW() WHERE usuario_id = :usuarioId AND rol_id = :rolId AND activo = true";
            int updated = em.createNativeQuery(updateSql)
                    .setParameter("usuarioId", userId)
                    .setParameter("rolId", advisorRole.getId())
                    .executeUpdate();

            if (updated == 0) {
                throw new IllegalStateException("Error al desactivar la relación usuario-rol");
            }
            System.out.println("Rol de Asesor quitado exitosamente al usuario ID: " + userId);
        } else {
            throw new IllegalArgumentException("El usuario no tiene el rol de Asesor asignado");
        }
    }

    /**
     * HU03: Asigna el rol de Jurado a un usuario que debe ser profesor
     */
    @Override
    @Transactional
    public void assignJuryRoleToUser(Integer userId) {
        System.out.println("Intentando asignar rol de Jurado al usuario ID: " + userId);

        // 1. Buscar usuario y validar que sea Profesor y activo
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
            // 4. Insertar el rol
            String insertSql = "INSERT INTO usuario_rol (usuario_id, rol_id, activo, fecha_creacion, fecha_modificacion) "
                    +
                    "VALUES (:usuarioId, :rolId, true, NOW(), NOW())";
            em.createNativeQuery(insertSql)
                    .setParameter("usuarioId", userId)
                    .setParameter("rolId", juryRole.getId())
                    .executeUpdate();
            System.out.println("Rol de Jurado asignado exitosamente al usuario ID: " + userId);
        } else {
            System.out.println(
                    "El usuario ID: " + userId + " ya tiene el rol de Jurado activo. No se realizó ninguna acción.");
        }
    }

    /**
     * HU04: Quita el rol de Jurado a un usuario
     */
    @Override
    @Transactional
    public void removeJuryRoleFromUser(Integer userId) {
        System.out.println("Intentando quitar rol de Jurado al usuario ID: " + userId);

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
            // 4. Desactivar el rol
            String updateSql = "UPDATE usuario_rol SET activo = false, fecha_modificacion = NOW() WHERE usuario_id = :usuarioId AND rol_id = :rolId AND activo = true";
            int updated = em.createNativeQuery(updateSql)
                    .setParameter("usuarioId", userId)
                    .setParameter("rolId", juryRole.getId())
                    .executeUpdate();

            if (updated == 0) {
                throw new IllegalStateException("Error al desactivar la relación usuario-rol");
            }
            System.out.println("Rol de Jurado quitado exitosamente al usuario ID: " + userId);
        } else {
            throw new IllegalArgumentException("El usuario no tiene el rol de Jurado asignado");
        }
    }

    /**
     * HU05: Obtiene la lista de profesores con sus roles asignados
     */
    @Override
    @Transactional(readOnly = true)
    public List<UsuarioConRolDto> getProfessorsWithRoles(String rolNombre, String terminoBusqueda) {
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
                        -- contar temas donde usuario sea asesor o coasesor (rol_id 1 o 5)
                        COUNT(DISTINCT CASE WHEN ut.rol_id IN (1, 5) THEN ut.tema_id END) AS tesis_count,
                        tu.tipo_usuario_id,
                        tu.nombre AS tipo_usuario_nombre
                    FROM
                        usuario u
                    JOIN
                        tipo_usuario tu ON u.tipo_usuario_id = tu.tipo_usuario_id
                    LEFT JOIN
                        usuario_rol ur ON u.usuario_id = ur.usuario_id AND ur.activo = true
                    LEFT JOIN
                        rol r ON ur.rol_id = r.rol_id AND r.activo = true
                    LEFT JOIN
                        usuario_tema ut ON u.usuario_id = ut.usuario_id AND ut.activo = true
                    WHERE
                        u.activo = true
                        AND LOWER(tu.nombre) = 'profesor'
                """);

        List<String> params = new ArrayList<>();
        if (rolNombre != null && !rolNombre.equalsIgnoreCase("Todos")) {
            sql.append(" AND r.nombre = ?").append(params.size() + 1);
            params.add(rolNombre);
        }

        if (terminoBusqueda != null && !terminoBusqueda.trim().isEmpty()) {
            sql.append("""
                    AND (
                        u.nombres ILIKE ?%s
                        OR u.primer_apellido ILIKE ?%s
                        OR u.segundo_apellido ILIKE ?%s
                        OR u.correo_electronico ILIKE ?%s
                        OR u.codigo_pucp ILIKE ?%s
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
                        u.usuario_id, u.nombres, u.primer_apellido, u.segundo_apellido,
                        u.correo_electronico, u.codigo_pucp, tu.tipo_usuario_id, tu.nombre
                    ORDER BY
                        u.primer_apellido, u.segundo_apellido, u.nombres
                """);

        Query query = em.createNativeQuery(sql.toString());

        for (int i = 0; i < params.size(); i++) {
            query.setParameter(i + 1, params.get(i));
        }

        @SuppressWarnings("unchecked")
        List<Object[]> results = query.getResultList();

        return results.stream()
                .map(row -> {
                    TipoUsuarioDto tipoUsuarioDto = TipoUsuarioDto.builder()
                            .id((Integer) row[8])
                            .nombre((String) row[9])
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

                    return UsuarioConRolDto.builder()
                            .usuario(usuarioBase)
                            .rolesConcat((String) row[6])
                            .tesisCount(((Number) row[7]).intValue())
                            .build();
                })
                .collect(Collectors.toList());
    }

    @Override
    public void procesarArchivoUsuarios(MultipartFile archivo) throws Exception {
        String nombre = archivo.getOriginalFilename();

        if (nombre == null)
            throw new Exception("Archivo sin nombre");

        if (nombre.endsWith(".csv")) {
            procesarCSV(archivo);
            logger.warning("Procesando archivo CSV: " + nombre);
        } else if (nombre.endsWith(".xlsx")) {
            procesarExcel(archivo);
        } else {
            throw new Exception("Formato de archivo no soportado. Solo se acepta .csv o .xlsx");
        }
    }

    private void procesarCSV(MultipartFile archivo) {
        try (BufferedReader reader = new BufferedReader(new InputStreamReader(archivo.getInputStream()))) {
            String linea;
            boolean primeraLinea = true;

            while ((linea = reader.readLine()) != null) {
                if (primeraLinea) {
                    primeraLinea = false;
                    continue; // saltar encabezado
                }

                String[] campos = linea.split(",");

                if (campos.length < 6)
                    continue;

                // Mapear campos en el orden correcto del CSV
                String nombres = campos[0].trim();
                String primerApellido = campos[1].trim();
                String segundoApellido = campos[2].trim();
                String correo = campos[3].trim();
                String codigoPUCP = campos[4].trim();
                String contrasena = "temp";
                String tipoUsuario = campos[5].trim(); // este es el rol

                Optional<TipoUsuario> tipo = buscarTipoUsuarioPorNombre(tipoUsuario);
                if (tipo.isEmpty()) {
                    System.out.println("Rol inválido para: " + correo);
                    continue;
                }

                String nombreCompleto = nombres + " " + primerApellido + " " + segundoApellido;

                try {
                    // Registrar en Cognito y obtener el sub (id)
                    String idCognito = cognitoService.registrarUsuarioEnCognito(correo, nombreCompleto, tipoUsuario);

                    // Crear entidad local
                    Usuario nuevo = new Usuario();
                    nuevo.setNombres(nombres);
                    nuevo.setPrimerApellido(primerApellido);
                    nuevo.setSegundoApellido(segundoApellido);
                    nuevo.setCorreoElectronico(correo);
                    nuevo.setCodigoPucp(codigoPUCP);
                    nuevo.setContrasena(contrasena);
                    nuevo.setTipoUsuario(tipo.get());
                    nuevo.setIdCognito(idCognito); // guardar sub de Cognito
                    nuevo.setActivo(true);
                    nuevo.setFechaCreacion(OffsetDateTime.now());
                    nuevo.setFechaModificacion(OffsetDateTime.now());

                    usuarioRepository.save(nuevo);
                    System.out.printf("Usuario '%s' creado y registrado correctamente.%n", correo);

                } catch (Exception e) {
                    System.err.printf("Error al registrar usuario '%s' en Cognito: %s%n", correo, e.getMessage());
                }
            }
        } catch (IOException e) {
            System.err.println("Error al leer el CSV: " + e.getMessage());
        }
    }

    private void procesarExcel(MultipartFile archivo) throws Exception {
        try (InputStream is = archivo.getInputStream()) {
            Workbook workbook = new XSSFWorkbook(is);
            Sheet hoja = workbook.getSheetAt(0);

            // la primera fila es cabecera,empezar por filaIndex = 1
            for (int filaIndex = 1; filaIndex <= hoja.getLastRowNum(); filaIndex++) {
                Row fila = hoja.getRow(filaIndex);
                if (fila == null)
                    continue;

                String nombres = getCellValue(fila.getCell(0));
                String primerApellido = getCellValue(fila.getCell(1));
                String segundoApellido = getCellValue(fila.getCell(2));
                String correo = getCellValue(fila.getCell(3));
                String codigoPUCP = getCellValue(fila.getCell(4));
                String contrasena = "temp";
                String tipoUsuario = getCellValue(fila.getCell(5));

                Optional<TipoUsuario> tipo = buscarTipoUsuarioPorNombre(tipoUsuario);
                if (tipo.isEmpty()) {
                    System.out.printf("Fila %d ignorada: Tipo usuario no encontrado: %s\n", filaIndex + 1, tipoUsuario);
                    continue;
                }

                String nombreCompleto = nombres + " " + primerApellido + " " + segundoApellido;

                try {
                    // Registrar en Cognito y obtener el sub
                    String idCognito = cognitoService.registrarUsuarioEnCognito(correo, nombreCompleto, tipoUsuario);

                    Usuario nuevo = new Usuario();
                    nuevo.setNombres(nombres);
                    nuevo.setPrimerApellido(primerApellido);
                    nuevo.setSegundoApellido(segundoApellido);
                    nuevo.setCorreoElectronico(correo);
                    nuevo.setCodigoPucp(codigoPUCP);
                    nuevo.setContrasena(contrasena);
                    nuevo.setTipoUsuario(tipo.get());
                    nuevo.setIdCognito(idCognito); // Guardar sub de Cognito
                    nuevo.setActivo(true);
                    nuevo.setFechaCreacion(OffsetDateTime.now());
                    nuevo.setFechaModificacion(OffsetDateTime.now());

                    usuarioRepository.save(nuevo);
                    System.out.printf("Fila %d: Usuario '%s' creado exitosamente.\n", filaIndex + 1, correo);

                } catch (Exception e) {
                    System.err.printf("Fila %d: Error al registrar usuario '%s' en Cognito: %s\n",
                            filaIndex + 1, correo, e.getMessage());
                }
            }
            workbook.close();
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

    @Override
    public List<PerfilAsesorDto> getDirectorioDeAsesoresPorFiltros(FiltrosDirectorioAsesores filtros) {
        List<Object[]> queryResults = usuarioRepository
                .obtenerListaDirectorioAsesoresAlumno(filtros.getAlumnoId(),
                        filtros.getCadenaBusqueda(),
                        filtros.getActivo(),
                        Utils.convertIntegerListToString(filtros.getIdAreas()),
                        Utils.convertIntegerListToString(filtros.getIdTemas()));
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
    public void validarTipoUsuarioRolUsuario(String cognitoId, TipoUsuarioEnum tipoUsuario, RolEnum rol) {
        //Almenos debe hacerse la validación de tipoUsuario
        if (tipoUsuario  == null)
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
        if(!tipoUsuarioRepository.existsByNombre(tipoUsuario.name()))
            throw new ResponseStatusException(
                    HttpStatus.INTERNAL_SERVER_ERROR,
                        "Error en validación interna"
                    );
        if(!usuarioRepository.existsByIdCognitoAndTipoUsuarioNombre(cognitoId, tipoUsuario.name()))
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

}
