package pucp.edu.pe.sgta.service.imp;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import org.springframework.transaction.annotation.Transactional;

import pucp.edu.pe.sgta.dto.asesores.InfoAreaConocimientoDto;
import pucp.edu.pe.sgta.dto.asesores.InfoSubAreaConocimientoDto;
import pucp.edu.pe.sgta.dto.asesores.PerfilAsesorDto;
import pucp.edu.pe.sgta.dto.asesores.UsuarioConRolDto;
import jakarta.persistence.EntityManager;
import jakarta.persistence.PersistenceContext;
import jakarta.persistence.Query;
import pucp.edu.pe.sgta.dto.TipoUsuarioDto;
import pucp.edu.pe.sgta.dto.UsuarioDto;
import pucp.edu.pe.sgta.mapper.InfoAreaConocimientoMapper;
import pucp.edu.pe.sgta.mapper.InfoSubAreaConocimientoMapper;
import pucp.edu.pe.sgta.mapper.PerfilAsesorMapper;
import pucp.edu.pe.sgta.mapper.UsuarioMapper;
import pucp.edu.pe.sgta.model.*;
import pucp.edu.pe.sgta.repository.*;
import pucp.edu.pe.sgta.service.inter.UsuarioService;
import pucp.edu.pe.sgta.util.RolEnum;
import pucp.edu.pe.sgta.util.RolEnum;
import pucp.edu.pe.sgta.util.Utils;

import java.util.ArrayList;
import java.util.Arrays;
import java.sql.Timestamp;
import java.time.Instant;
import java.time.OffsetDateTime;
import java.time.ZoneOffset;
import java.util.List;

import java.util.NoSuchElementException;
import java.util.stream.Collectors;

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

	@Autowired
    private RolRepository rolRepository;

	@PersistenceContext
    private EntityManager em;

	public UsuarioServiceImpl(UsuarioRepository usuarioRepository
							, UsuarioXSubAreaConocimientoRepository usuarioXSubAreaConocimientoRepository
							, SubAreaConocimientoRepository subAreaConocimientoRepository
							, AreaConocimientoRepository areaConocimientoRepository
							, UsuarioXAreaConocimientoRepository usuarioXAreaConocimientoRepository, CarreraRepository carreraRepository
							,UsuarioXTemaRepository usuarioXTemaRepository) {
		this.usuarioRepository = usuarioRepository;
		this.usuarioXSubAreaConocimientoRepository = usuarioXSubAreaConocimientoRepository;
		this.subAreaConocimientoRepository = subAreaConocimientoRepository;
		this.areaConocimientoRepository = areaConocimientoRepository;
		this.usuarioXAreaConocimientoRepository = usuarioXAreaConocimientoRepository;
		this.carreraRepository = carreraRepository;
		this.usuarioXTemaRepository = usuarioXTemaRepository;
	}

	@Override
	public void createUsuario(UsuarioDto usuarioDto) {
		usuarioDto.setId(null);

		Usuario usuario = UsuarioMapper.toEntity(usuarioDto);

		usuarioRepository.save(usuario);
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
	public List<UsuarioDto> findAllUsuarios() {
		return List.of();
	}

	@Override
	public void updateUsuario(UsuarioDto usuarioDto) {

	}

	@Override
	public void deleteUsuario(Integer id) {

	}

	@Override
	public PerfilAsesorDto getPerfilAsesor(Integer id){
		//Primero los datos básicos de la entidad
		PerfilAsesorDto tmp;
		Usuario usuario = usuarioRepository.findById(id).orElse(null);
		if (usuario == null) {
			throw new RuntimeException("Usuario no encontrado con ID: " + id);
		}
		tmp = PerfilAsesorMapper.toDto(usuario);
		//Encontramos el nombre de la carrera del Asesor
		List<String> carreras = new ArrayList<>();
		List<Object[]> resultadoQuery = carreraRepository.listarCarrerasPorIdUsusario(id);
		for (Object[] o : resultadoQuery) {
			carreras.add((String) o[3]);
		}

		tmp.setEspecialidad(String.join(" - ",carreras));
		//Luego la consulta de las áreas de conocimiento
		List<InfoAreaConocimientoDto> areas;
		List<Integer> idAreas = usuarioXAreaConocimientoRepository.findAllByUsuario_IdAndActivoIsTrue(id).
				stream()
				.map(UsuarioXAreaConocimiento::getAreaConocimiento)
				.map(AreaConocimiento::getId)
				.toList();
		areas = areaConocimientoRepository.findAllByIdIn(idAreas)
				.stream()
				.map(InfoAreaConocimientoMapper::toDto)
				.toList();
		//Luego la consulta de las areas de conocimiento
		List<InfoSubAreaConocimientoDto> subareas;
		List<Integer> idSubareas = usuarioXSubAreaConocimientoRepository.findAllByUsuario_IdAndActivoIsTrue(id).
									stream()
									.map(UsuarioXSubAreaConocimiento::getSubAreaConocimiento)
									.map(SubAreaConocimiento::getId)
									.toList();
		subareas = subAreaConocimientoRepository.findAllByIdIn(idSubareas)
				.stream()
				.map(InfoSubAreaConocimientoMapper::toDto)
				.toList();

		tmp.setAreasTematicas(areas);
		tmp.setTemasIntereses(subareas);
		//TODO: El numero máximo de estudiantes
		//TODO: La cantidad de alumnos por asesor
		Integer cantTesistas ;
		List<Object[]> tesistas =usuarioXTemaRepository.listarNumeroTesistasAsesor(id);//ASEGURADO sale 1 sola fila
		cantTesistas = (Integer) tesistas.get(0)[0];
		tmp.setTesistasActuales(cantTesistas);

		return tmp;
	}
	@Override
	public void updatePerfilAsesor(PerfilAsesorDto perfilAsesorDto){
		Usuario user = usuarioRepository.findById(perfilAsesorDto.getId()).orElse(null);
		if (user == null) {
			throw new RuntimeException("Usuario no encontrado con ID: " + perfilAsesorDto.getId());
		}
		user.setEnlaceLinkedin(perfilAsesorDto.getLinkedin());
		user.setEnlaceRepositorio(perfilAsesorDto.getRepositorio());
		user.setCorreoElectronico(perfilAsesorDto.getEmail());
		user.setBiografia(perfilAsesorDto.getBiografia());

		usuarioRepository.save(user);
		//Revision areas temáticas
		List<Integer> areasRegistradas = usuarioXAreaConocimientoRepository.findAllByUsuario_IdAndActivoIsTrue(user.getId())
				.stream()
				.map(UsuarioXAreaConocimiento::getAreaConocimiento)
				.map(AreaConocimiento::getId)
				.toList();
		List<Integer> areasActualizadas = perfilAsesorDto.getAreasTematicas()
				.stream()
				.map(InfoAreaConocimientoDto::getIdArea)
				.toList();
			//Id's que no estan registrados (Todos los que entraron - los que ya estaban=
		List<Integer> idNuevos = new ArrayList<>(areasActualizadas);
		idNuevos.removeAll(areasRegistradas);
		usuarioXAreaConocimientoRepository.asignarUsuarioAreas(user.getId(), Utils.convertIntegerListToString(idNuevos));
			//Id's que ya no estan en registrados (Todos los que habian - los que entraron)
		List<Integer> idEliminados = new ArrayList<>(areasRegistradas);
		idEliminados.removeAll(areasActualizadas);
		usuarioXAreaConocimientoRepository.desactivarUsuarioAreas(user.getId(), Utils.convertIntegerListToString(idEliminados));

		//Revision sub areas tematicas
		List<Integer> subAreasRegistradas = usuarioXSubAreaConocimientoRepository.findAllByUsuario_IdAndActivoIsTrue(user.getId())
				.stream()
				.map(UsuarioXSubAreaConocimiento::getSubAreaConocimiento)
				.map(SubAreaConocimiento::getId)
				.toList();
		List<Integer> subAreasActualizadas = perfilAsesorDto.getTemasIntereses()
				.stream()
				.map(InfoSubAreaConocimientoDto::getIdTema)
				.toList();
		//Id's que no estan registrados (Todos los que entraron - los que ya estaban=
		idNuevos = new ArrayList<>(subAreasActualizadas);
		idNuevos.removeAll(subAreasRegistradas);
		usuarioXSubAreaConocimientoRepository.asignarUsuarioSubAreas(user.getId(), Utils.convertIntegerListToString(idNuevos));
		//Id's que ya no estan en registrados (Todos los que habian - los que entraron)
		idEliminados = new ArrayList<>(subAreasRegistradas);
		idEliminados.removeAll(subAreasActualizadas);
		usuarioXSubAreaConocimientoRepository.desactivarUsuarioSubAreas(user.getId(), Utils.convertIntegerListToString(idEliminados));
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
						.build()
				)
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
        System.out.println("Intentando asignar rol de Asesor al usuario ID: " + userId);
        
        // 1. Buscar y validar que el usuario existe
        Usuario user = usuarioRepository.findById(userId)
                .orElseThrow(() -> new NoSuchElementException("Usuario no encontrado: " + userId));
        
        // 2. Validar que el usuario es de tipo Profesor
        TipoUsuario tipoUsuario = user.getTipoUsuario();
        if (tipoUsuario == null || !"Profesor".equalsIgnoreCase(tipoUsuario.getNombre())) {
            System.out.println("El usuario ID: " + userId + " no es profesor, es: " + 
                    (tipoUsuario != null ? tipoUsuario.getNombre() : "null"));
            throw new IllegalArgumentException("Solo los usuarios de tipo Profesor pueden ser asignados como Asesores");
        }
        
        // 3. Buscar el rol de Asesor
        String rolNombre = RolEnum.Asesor.name();
        Rol advisorRole = rolRepository.findByNombre(rolNombre)
                .orElseThrow(() -> new NoSuchElementException("Rol '" + rolNombre + "' no configurado en el sistema"));
        
        // 4. Verificar si ya tiene el rol (idempotencia)
        String jpql = "SELECT COUNT(u) FROM Usuario u JOIN u.roles r WHERE u.id = :userId AND r.id = :rolId";
        Long count = em.createQuery(jpql, Long.class)
                .setParameter("userId", userId)
                .setParameter("rolId", advisorRole.getId())
                .getSingleResult();
        
        boolean alreadyExists = count > 0;
        
        if (!alreadyExists) {
            // 5. Asignar el rol al usuario
            String sql = "INSERT INTO usuario_rol (usuario_id, rol_id, activo) VALUES (:usuarioId, :rolId, true)";
            em.createNativeQuery(sql)
                .setParameter("usuarioId", userId)
                .setParameter("rolId", advisorRole.getId())
                .executeUpdate();
                
            System.out.println("Rol de Asesor asignado exitosamente al usuario ID: " + userId);
        } else {
            System.out.println("El usuario ID: " + userId + " ya tiene el rol de Asesor. No se realizó ninguna acción.");
        }
    }
    
    /**
     * HU02: Quita el rol de Asesor a un usuario
     */
    @Override
    @Transactional
    public void removeAdvisorRoleFromUser(Integer userId) {
        System.out.println("Intentando quitar rol de Asesor al usuario ID: " + userId);
        
        // 1. Buscar y validar que el usuario existe
        Usuario user = usuarioRepository.findById(userId)
                .orElseThrow(() -> new NoSuchElementException("Usuario no encontrado: " + userId));
        
        // 2. Buscar el rol de Asesor
        String rolNombre = RolEnum.Asesor.name();
        Rol advisorRole = rolRepository.findByNombre(rolNombre)
                .orElseThrow(() -> new NoSuchElementException("Rol '" + rolNombre + "' no configurado en el sistema"));
        
        // 3. Verificar si tiene el rol asignado
        String jpql = "SELECT COUNT(u) FROM Usuario u JOIN u.roles r WHERE u.id = :userId AND r.id = :rolId";
        Long count = em.createQuery(jpql, Long.class)
                .setParameter("userId", userId)
                .setParameter("rolId", advisorRole.getId())
                .getSingleResult();
        
        boolean hasRole = count > 0;
        
        if (hasRole) {
            // 4. Quitar el rol al usuario (desactivar la relación)
            String sql = "UPDATE usuario_rol SET activo = false WHERE usuario_id = :usuarioId AND rol_id = :rolId";
            int updated = em.createNativeQuery(sql)
                .setParameter("usuarioId", userId)
                .setParameter("rolId", advisorRole.getId())
                .executeUpdate();
            
            if (updated > 0) {
                System.out.println("Rol de Asesor quitado exitosamente al usuario ID: " + userId);
            } else {
                throw new IllegalStateException("Error al desactivar la relación usuario-rol");
            }
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
        
        // 1. Buscar y validar que el usuario existe
        Usuario user = usuarioRepository.findById(userId)
                .orElseThrow(() -> new NoSuchElementException("Usuario no encontrado: " + userId));
        
        // 2. Validar que el usuario es de tipo Profesor
        TipoUsuario tipoUsuario = user.getTipoUsuario();
        if (tipoUsuario == null || !"Profesor".equalsIgnoreCase(tipoUsuario.getNombre())) {
            System.out.println("El usuario ID: " + userId + " no es profesor, es: " + 
                    (tipoUsuario != null ? tipoUsuario.getNombre() : "null"));
            throw new IllegalArgumentException("Solo los usuarios de tipo Profesor pueden ser asignados como Jurados");
        }
        
        // 3. Buscar el rol de Jurado
        String rolNombre = RolEnum.Jurado.name();
        Rol juryRole = rolRepository.findByNombre(rolNombre)
                .orElseThrow(() -> new NoSuchElementException("Rol '" + rolNombre + "' no configurado en el sistema"));
        
        // 4. Verificar si ya tiene el rol (idempotencia)
        String jpql = "SELECT COUNT(u) FROM Usuario u JOIN u.roles r WHERE u.id = :userId AND r.id = :rolId";
        Long count = em.createQuery(jpql, Long.class)
                .setParameter("userId", userId)
                .setParameter("rolId", juryRole.getId())
                .getSingleResult();
        
        boolean alreadyExists = count > 0;
        
        if (!alreadyExists) {
            // 5. Asignar el rol al usuario
            String sql = "INSERT INTO usuario_rol (usuario_id, rol_id, activo) VALUES (:usuarioId, :rolId, true)";
            em.createNativeQuery(sql)
                .setParameter("usuarioId", userId)
                .setParameter("rolId", juryRole.getId())
                .executeUpdate();
                
            System.out.println("Rol de Jurado asignado exitosamente al usuario ID: " + userId);
        } else {
            System.out.println("El usuario ID: " + userId + " ya tiene el rol de Jurado. No se realizó ninguna acción.");
        }
    }
    
    /**
     * HU04: Quita el rol de Jurado a un usuario
     */
    @Override
    @Transactional
    public void removeJuryRoleFromUser(Integer userId) {
        System.out.println("Intentando quitar rol de Jurado al usuario ID: " + userId);
        
        // 1. Buscar y validar que el usuario existe
        Usuario user = usuarioRepository.findById(userId)
                .orElseThrow(() -> new NoSuchElementException("Usuario no encontrado: " + userId));
        
        // 2. Buscar el rol de Jurado
        String rolNombre = RolEnum.Jurado.name();
        Rol juryRole = rolRepository.findByNombre(rolNombre)
                .orElseThrow(() -> new NoSuchElementException("Rol '" + rolNombre + "' no configurado en el sistema"));
        
        // 3. Verificar si tiene el rol asignado
        String jpql = "SELECT COUNT(u) FROM Usuario u JOIN u.roles r WHERE u.id = :userId AND r.id = :rolId";
        Long count = em.createQuery(jpql, Long.class)
                .setParameter("userId", userId)
                .setParameter("rolId", juryRole.getId())
                .getSingleResult();
        
        boolean hasRole = count > 0;
        
        if (hasRole) {
            // 4. Quitar el rol al usuario (desactivar la relación)
            String sql = "UPDATE usuario_rol SET activo = false WHERE usuario_id = :usuarioId AND rol_id = :rolId";
            int updated = em.createNativeQuery(sql)
                .setParameter("usuarioId", userId)
                .setParameter("rolId", juryRole.getId())
                .executeUpdate();
            
            if (updated > 0) {
                System.out.println("Rol de Jurado quitado exitosamente al usuario ID: " + userId);
            } else {
                throw new IllegalStateException("Error al desactivar la relación usuario-rol");
            }
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
                COUNT(DISTINCT CASE WHEN r.nombre ILIKE 'asesor' OR r.nombre ILIKE 'coasesor' THEN t.tema_id END) AS tesis_count,
                tu.tipo_usuario_id,
                tu.nombre AS tipo_usuario_nombre
            FROM 
                usuario u
            JOIN 
                tipo_usuario tu ON u.tipo_usuario_id = tu.tipo_usuario_id
            LEFT JOIN 
                usuario_tema ut ON u.usuario_id = ut.usuario_id
            LEFT JOIN 
                rol r ON ut.rol_id = r.rol_id
            LEFT JOIN 
                tema t ON ut.tema_id = t.tema_id AND t.activo = true
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
                params.size() + 5
            ));

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
}
