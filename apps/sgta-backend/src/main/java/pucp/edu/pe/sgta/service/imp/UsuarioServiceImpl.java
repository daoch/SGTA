package pucp.edu.pe.sgta.service.imp;

import jakarta.persistence.Query;
import org.apache.poi.ss.usermodel.*;
import org.apache.poi.xssf.usermodel.XSSFWorkbook;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;
import pucp.edu.pe.sgta.dto.asesores.InfoAreaConocimientoDto;
import pucp.edu.pe.sgta.dto.asesores.InfoSubAreaConocimientoDto;
import pucp.edu.pe.sgta.dto.asesores.PerfilAsesorDto;
import pucp.edu.pe.sgta.dto.*;

import jakarta.persistence.EntityManager;
import jakarta.persistence.PersistenceContext;
import pucp.edu.pe.sgta.dto.TipoUsuarioDto;
import pucp.edu.pe.sgta.dto.UsuarioDto;
import pucp.edu.pe.sgta.dto.asesores.UsuarioFotoDto;
import pucp.edu.pe.sgta.mapper.InfoAreaConocimientoMapper;
import pucp.edu.pe.sgta.mapper.InfoSubAreaConocimientoMapper;
import pucp.edu.pe.sgta.mapper.PerfilAsesorMapper;
import pucp.edu.pe.sgta.mapper.UsuarioMapper;
import pucp.edu.pe.sgta.model.*;
import pucp.edu.pe.sgta.repository.*;
import pucp.edu.pe.sgta.service.inter.UsuarioService;
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
import java.util.Base64;
import java.util.List;
import java.util.Optional;

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

	@PersistenceContext
    private EntityManager em;

	public UsuarioServiceImpl(UsuarioRepository usuarioRepository
							, UsuarioXSubAreaConocimientoRepository usuarioXSubAreaConocimientoRepository
							, SubAreaConocimientoRepository subAreaConocimientoRepository
							, AreaConocimientoRepository areaConocimientoRepository
							, UsuarioXAreaConocimientoRepository usuarioXAreaConocimientoRepository, CarreraRepository carreraRepository
							,UsuarioXTemaRepository usuarioXTemaRepository
							, TipoUsuarioRepository tipoUsuarioRepository) {
		this.usuarioRepository = usuarioRepository;
		this.usuarioXSubAreaConocimientoRepository = usuarioXSubAreaConocimientoRepository;
		this.subAreaConocimientoRepository = subAreaConocimientoRepository;
		this.areaConocimientoRepository = areaConocimientoRepository;
		this.usuarioXAreaConocimientoRepository = usuarioXAreaConocimientoRepository;
		this.carreraRepository = carreraRepository;
		this.usuarioXTemaRepository = usuarioXTemaRepository;
		this.tipoUsuarioRepository = tipoUsuarioRepository;
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

		String fotoBase64 = user.getFotoPerfil() != null? Base64.getEncoder().encodeToString(user.getFotoPerfil()) : null;
		usuarioFotoDto.setFoto(fotoBase64);
		return usuarioFotoDto;
	}

	@Override
	public Integer getIdByCorreo(String correo) {
		Usuario user = usuarioRepository.findByCorreoElectronicoIsLikeIgnoreCase(correo);
		if (user == null) {
			throw new RuntimeException("Usuario no encontrado con CORREO: " + correo);
		}
		return user.getId();
	}

	@Override
	public List<UsuarioDto> getAsesoresBySubArea(Integer idSubArea) {
		String sql =
				"SELECT usuario_id, nombre_completo, correo_electronico " +
						"  FROM listar_asesores_por_subarea_conocimiento_v2(:p_subarea_id)";
		Query query = em.createNativeQuery(sql)
				.setParameter("p_subarea_id", idSubArea);

		@SuppressWarnings("unchecked")
		List<Object[]> rows = query.getResultList();
		List<UsuarioDto> advisors = new ArrayList<>(rows.size());

		for (Object[] row : rows) {
			Integer userId       = ((Number) row[0]).intValue();
			String fullName      = (String) row[1];
			String email         = (String) row[2];

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
	public UsuarioDto findUsuarioByCodigo(String codigoPucp) {
		Optional<Usuario> usuario = usuarioRepository.findByCodigoPucp(codigoPucp);
		if(usuario.isPresent()){
			UsuarioDto usuarioDto = UsuarioMapper.toDto(usuario.get());
			return usuarioDto;
		}
		return null;
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
				.disponibilidad((String) r[12])
				.tipoDisponibilidad((String) r[13])
				.activo((Boolean) r[15])
				.fechaCreacion(fechaCreacion)
				.fechaModificacion(fechaModificacion)
				.build();

			lista.add(u);
		}

		return lista;
	}

	@Override
	public void procesarArchivoUsuarios(MultipartFile archivo) throws Exception {
		String nombre = archivo.getOriginalFilename();
		if (nombre == null) throw new Exception("Archivo sin nombre");

		if (nombre.endsWith(".csv")) {
			procesarCSV(archivo);
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

				if (campos.length < 8) continue;

				// Mapear campos en el orden correcto del CSV
				String nombres = campos[0].trim();
				String primerApellido = campos[1].trim();
				String segundoApellido = campos[2].trim();
				String correo = campos[3].trim();
				String codigoPUCP = campos[4].trim();
				String nivelEstudios = campos[5].trim();
				String contrasena = campos[6].trim();
				String tipoUsuario = campos[7].trim(); // este es el rol

				Optional<TipoUsuario> tipo = buscarTipoUsuarioPorNombre(tipoUsuario);
				if (tipo.isEmpty()) {
					System.out.println("Rol inválido para: " + correo);
					continue;
				}

				Usuario nuevo = new Usuario();
				nuevo.setNombres(nombres);
				nuevo.setPrimerApellido(primerApellido);
				nuevo.setSegundoApellido(segundoApellido);
				nuevo.setCorreoElectronico(correo);
				nuevo.setCodigoPucp(codigoPUCP);
				nuevo.setNivelEstudios(nivelEstudios);
				nuevo.setContrasena(contrasena);
				nuevo.setTipoUsuario(tipo.get());
				nuevo.setActivo(true);
				nuevo.setFechaCreacion(OffsetDateTime.now());
				nuevo.setFechaModificacion(OffsetDateTime.now());

				usuarioRepository.save(nuevo);
			}
		} catch (IOException e) {
			System.err.println("Error al leer el CSV: " + e.getMessage());
		}
	}

	private void procesarExcel(MultipartFile archivo) throws Exception {
		try (InputStream is = archivo.getInputStream()) {
			Workbook workbook = new XSSFWorkbook(is);
			Sheet hoja = workbook.getSheetAt(0);

			// Suponiendo que la primera fila es cabecera
			for (int filaIndex = 1; filaIndex <= hoja.getLastRowNum(); filaIndex++) {
				Row fila = hoja.getRow(filaIndex);
				if (fila == null) continue;

				String nombres = getCellValue(fila.getCell(0));
				String primerApellido = getCellValue(fila.getCell(1));
				String segundoApellido = getCellValue(fila.getCell(2));
				String correo = getCellValue(fila.getCell(3));
				String codigoPUCP = getCellValue(fila.getCell(4));
				String nivelEstudios = getCellValue(fila.getCell(5));
				String contrasena = getCellValue(fila.getCell(6));
				String tipoUsuario = getCellValue(fila.getCell(7));

				Optional<TipoUsuario> tipo = buscarTipoUsuarioPorNombre(tipoUsuario);
				if (tipo.isEmpty()) {
					System.out.printf("Fila %d ignorada: Tipo usuario no encontrado: %s\n", filaIndex + 1, tipoUsuario);
					continue;
				}

				Usuario nuevo = new Usuario();
				nuevo.setNombres(nombres);
				nuevo.setPrimerApellido(primerApellido);
				nuevo.setSegundoApellido(segundoApellido);
				nuevo.setCorreoElectronico(correo);
				nuevo.setCodigoPucp(codigoPUCP);
				nuevo.setNivelEstudios(nivelEstudios);
				nuevo.setContrasena(contrasena);
				nuevo.setTipoUsuario(tipo.get());
				nuevo.setActivo(true);
				nuevo.setFechaCreacion(OffsetDateTime.now());
				nuevo.setFechaModificacion(OffsetDateTime.now());

				usuarioRepository.save(nuevo);
			}

			workbook.close();
		}
	}

	private String getCellValue(Cell celda) {
		if (celda == null) return "";

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
}
