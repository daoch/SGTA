package pucp.edu.pe.sgta.service.imp;

import org.postgresql.util.PGInterval;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import pucp.edu.pe.sgta.dto.EtapaFormativaDto;
import pucp.edu.pe.sgta.dto.EtapaFormativaNombreDTO;
import pucp.edu.pe.sgta.dto.EtapaFormativaListadoDto;
import pucp.edu.pe.sgta.dto.EtapaFormativaDetalleDto;
import pucp.edu.pe.sgta.model.EtapaFormativa;
import pucp.edu.pe.sgta.model.EtapaFormativaXCiclo;
import pucp.edu.pe.sgta.model.Exposicion;
import pucp.edu.pe.sgta.repository.CarreraRepository;
import pucp.edu.pe.sgta.repository.EtapaFormativaRepository;
import pucp.edu.pe.sgta.repository.ExposicionRepository;
import pucp.edu.pe.sgta.service.inter.EtapaFormativaService;

import java.util.NoSuchElementException;

import java.math.BigDecimal;
import java.time.Duration;
import java.util.ArrayList;
import java.util.List;
import org.springframework.transaction.annotation.Transactional;

import jakarta.persistence.EntityNotFoundException;

@Service
public class EtapaFormativaServiceImpl implements EtapaFormativaService {

	@Autowired
	private CarreraRepository carreraRepository;

	@Autowired
	private ExposicionRepository exposicionRepository;

	@Autowired
	private EtapaFormativaRepository etapaFormativaRepository;

	public EtapaFormativaServiceImpl(EtapaFormativaRepository etapaFormativaRepository) {
		this.etapaFormativaRepository = etapaFormativaRepository;
	}

	@Override
	public List<EtapaFormativaDto> getAll() {
		return List.of();
	}

	@Override
	public EtapaFormativaDto findById(Integer id) {
		Object result = etapaFormativaRepository.getEtapaFormativaByIdFunction(id);
		if (result == null)
			return null;

		Object[] row = (Object[]) result;
		EtapaFormativaDto dto = new EtapaFormativaDto();

		dto.setId((Integer) row[0]);
		dto.setNombre((String) row[1]);
		dto.setCreditajePorTema((BigDecimal) row[2]);

		// Convertir PGInterval a Duration
		PGInterval pgInterval = (PGInterval) row[3];
		if (pgInterval != null) {
			dto.setDuracionExposicion(convertPGIntervalToDuration(pgInterval));
		}

		dto.setActivo((Boolean) row[4]);
		dto.setCarreraId((Integer) row[5]);

		return dto;
	}

	@Override
	public EtapaFormativaDto update(EtapaFormativaDto dto) {
		// 1) Cargar la entidad existente
		var etapa = etapaFormativaRepository.findById(dto.getId())
			.orElseThrow(() -> new RuntimeException("Etapa no encontrada: " + dto.getId()));

		// 2) Si cambió la carrera, validar y seteársela
		if (!etapa.getCarrera().getId().equals(dto.getCarreraId())) {
			var carrera = carreraRepository.findById(dto.getCarreraId())
				.orElseThrow(() -> new RuntimeException("Carrera no encontrada: " + dto.getCarreraId()));
			etapa.setCarrera(carrera);
		}

		// 3) Actualizar campos
		etapa.setNombre(dto.getNombre().toUpperCase());
		etapa.setCreditajePorTema(dto.getCreditajePorTema());
		etapa.setDuracionExposicion(dto.getDuracionExposicion());

		// 4) Persistir
		var updated = etapaFormativaRepository.save(etapa);

		// 5) Mapear Entidad → DTO
		return EtapaFormativaDto.builder()
			.id(updated.getId())
			.nombre(updated.getNombre())
			.creditajePorTema(updated.getCreditajePorTema())
			.duracionExposicion(updated.getDuracionExposicion())
			.activo(updated.getActivo())
			.carreraId(updated.getCarrera().getId())
			.build();
	}

	@Override
	public List<EtapaFormativaNombreDTO> findToInitializeByCoordinador(Integer coordiandorId) {
		List<EtapaFormativaNombreDTO> etapasFormativas = etapaFormativaRepository
			.findToInitializeByCoordinador(coordiandorId);
		return etapasFormativas.stream()
			.map(ef -> new EtapaFormativaNombreDTO(ef.getEtapaFormativaId(), ef.getNombre()))
			.toList();
	}

	@Override
	public List<EtapaFormativaDto> findAllActivas() {
		List<Object[]> result = etapaFormativaRepository.findAllActivas();
		List<EtapaFormativaDto> etapaFormativaDtos = new ArrayList<>();
		for (Object[] row : result) {
			EtapaFormativaDto dto = new EtapaFormativaDto();
			dto.setId((Integer) row[0]);
			dto.setNombre((String) row[1]);
			dto.setCreditajePorTema((BigDecimal) row[2]);

			// Convertir PGInterval a Duration
			PGInterval pgInterval = (PGInterval) row[3];
			if (pgInterval != null) {
				dto.setDuracionExposicion(convertPGIntervalToDuration(pgInterval));
			}

			dto.setActivo((Boolean) row[4]);
			dto.setCarreraId((Integer) row[5]);

			etapaFormativaDtos.add(dto);
		}
		return etapaFormativaDtos;
	}

	@Override
	public List<EtapaFormativaDto> findAllActivasByCoordinador(Integer coordinadorId) {
		List<Object[]> result = etapaFormativaRepository.findAllActivasByCoordinador(coordinadorId);
		List<EtapaFormativaDto> etapaFormativaDtos = new ArrayList<>();
		for (Object[] row : result) {
			EtapaFormativaDto dto = new EtapaFormativaDto();
			dto.setId((Integer) row[0]);
			dto.setNombre((String) row[1]);
			dto.setCreditajePorTema((BigDecimal) row[2]);

			// Convertir PGInterval a Duration
			PGInterval pgInterval = (PGInterval) row[3];
			if (pgInterval != null) {
				dto.setDuracionExposicion(convertPGIntervalToDuration(pgInterval));
			}

			dto.setActivo((Boolean) row[4]);
			dto.setCarreraId((Integer) row[5]);

			etapaFormativaDtos.add(dto);
		}
		return etapaFormativaDtos;
	}

	private Duration convertPGIntervalToDuration(PGInterval pgInterval) {
		long totalSeconds = 0;

		// Obtener los componentes del PGInterval
		long days = pgInterval.getDays();
		long hours = pgInterval.getHours();
		long minutes = pgInterval.getMinutes();
		long seconds = (long) pgInterval.getSeconds();

		// Convertir todo a segundos
		totalSeconds += days * 86400; // 1 día = 86400 segundos
		totalSeconds += hours * 3600; // 1 hora = 3600 segundos
		totalSeconds += minutes * 60; // 1 minuto = 60 segundos
		totalSeconds += seconds; // segundos

		return Duration.ofSeconds(totalSeconds);
	}

	@Override
	public List<EtapaFormativaNombreDTO> findAllActivasNombre() {
		List<EtapaFormativaNombreDTO> etapasFormativas = etapaFormativaRepository.findAllActivasNombre();
		return etapasFormativas.stream()
			.map(ef -> new EtapaFormativaNombreDTO(ef.getEtapaFormativaId(), ef.getNombre()))
			.toList();
	}

	public EtapaFormativaDto create(EtapaFormativaDto dto) {
		try {
			// 1) Validar y cargar la Carrera
			var carrera = carreraRepository.findById(dto.getCarreraId())
				.orElseThrow(() -> new RuntimeException("Carrera no encontrada: " + dto.getCarreraId()));

			// 2) Guardar Duration para uso posterior
			Duration duration = dto.getDuracionExposicion();

			// 3) Crear entidad sin la duración (ahora es @Transient)
			var etapa = new EtapaFormativa();
			etapa.setNombre(dto.getNombre().toUpperCase());
			etapa.setCreditajePorTema(dto.getCreditajePorTema());
			etapa.setCarrera(carrera);

			// 4) Guardar para obtener el ID
			var saved = etapaFormativaRepository.save(etapa);

			// 5) Actualizar duracionExposicion por separado con SQL nativo
			if (duration != null) {
				String durationStr = formatDuration(duration);
				etapaFormativaRepository.updateDuracionExposicion(saved.getId(), durationStr);

				// Actualizamos el campo transitorio para el DTO de respuesta
				saved.setDuracionExposicion(duration);
			}

			// 6) Construir DTO de respuesta
			return EtapaFormativaDto.builder()
				.id(saved.getId())
				.nombre(saved.getNombre())
				.creditajePorTema(saved.getCreditajePorTema())
				.duracionExposicion(saved.getDuracionExposicion())
				.activo(saved.getActivo())
				.carreraId(carrera.getId())
				.build();
		}
		catch (Exception e) {
			throw new RuntimeException("Error al crear etapa formativa: " + e.getMessage(), e);
		}
	}

	/**
	 * Formatea un objeto Duration a un formato compatible con PostgreSQL Interval
	 */
	private String formatDuration(Duration duration) {
		if (duration == null) {
			return null;
		}

		long seconds = duration.getSeconds();

		long hours = seconds / 3600;
		seconds %= 3600;
		long minutes = seconds / 60;
		seconds %= 60;

		// Formato compatible con PostgreSQL interval: HH:MM:SS
		return String.format("%d:%02d:%02d", hours, minutes, seconds);
	}

	@Override
	public List<EtapaFormativaListadoDto> getSimpleList() {
		List<Object[]> result = etapaFormativaRepository.findAllForSimpleList();
		List<EtapaFormativaListadoDto> listadoDtos = new ArrayList<>();

		for (Object[] row : result) {
			EtapaFormativaListadoDto dto = EtapaFormativaListadoDto.builder()
				.id((Integer) row[0])
				.nombre((String) row[1])
				.carreraNombre((String) row[2])
				.estado((String) row[3])
				.build();

			listadoDtos.add(dto);
		}

		return listadoDtos;
	}

	@Override
	public EtapaFormativaDetalleDto getDetalleById(Integer id) {
		// Obtener información principal
		Object result = etapaFormativaRepository.getEtapaFormativaDetalleFunction(id);
		if (result == null)
			return null;

		Object[] row = (Object[]) result;

		// Construir DTO con datos principales
		EtapaFormativaDetalleDto dto = EtapaFormativaDetalleDto.builder()
			.id((Integer) row[0])
			.nombre((String) row[1])
			.carreraNombre((String) row[2])
			.carreraId((Integer) row[3])
			.creditajePorTema((BigDecimal) row[4])
			.activo((Boolean) row[5])
			.cicloActual((String) row[6])
			.estadoActual((String) row[7])
			.build();

		// Convertir PGInterval a Duration
		PGInterval pgInterval = (PGInterval) row[8];
		if (pgInterval != null) {
			dto.setDuracionExposicion(convertPGIntervalToDuration(pgInterval));
		}

		// Obtener historial de ciclos
		List<Object[]> historialResult = etapaFormativaRepository.getHistorialCiclosEtapaFormativa(id);
		List<EtapaFormativaDetalleDto.CicloHistorialDto> historialCiclos = new ArrayList<>();

		for (Object[] historialRow : historialResult) {
			EtapaFormativaDetalleDto.CicloHistorialDto cicloDto = EtapaFormativaDetalleDto.CicloHistorialDto.builder()
				.id((Integer) historialRow[0])
				.ciclo((String) historialRow[1])
				.estado((String) historialRow[2])
				.build();

			historialCiclos.add(cicloDto);
		}

		dto.setHistorialCiclos(historialCiclos);

		return dto;
	}

	@Override
	@Transactional
	public void delete(Integer id) {
		EtapaFormativa e = etapaFormativaRepository.findById(id)
			.orElseThrow(() -> new NoSuchElementException("No existe etapa formativa: " + id));
		e.setActivo(false);
		etapaFormativaRepository.save(e);
	}

	@Override
	@Transactional(readOnly = true)
	public Integer getEtapaFormativaIdByExposicionId(Integer exposicionId) {
		Exposicion expo = exposicionRepository.findById(exposicionId)
			.orElseThrow(() -> new EntityNotFoundException("No existe Exposicion con id " + exposicionId));
		EtapaFormativaXCiclo efc = expo.getEtapaFormativaXCiclo();
		return efc.getId();
	}

}
