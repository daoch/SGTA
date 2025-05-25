package pucp.edu.pe.sgta.service.imp;

import java.time.Instant;
import java.time.OffsetDateTime;
import java.time.ZoneId;
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import jakarta.transaction.Transactional;
import org.springframework.stereotype.Service;

import pucp.edu.pe.sgta.dto.BloqueHorarioExposicionCreateDTO;
import pucp.edu.pe.sgta.dto.BloqueHorarioExposicionDto;
import pucp.edu.pe.sgta.dto.JornadaExposicionCreateDTO;
import pucp.edu.pe.sgta.dto.JornadaExposicionDto;
import pucp.edu.pe.sgta.dto.ListBloqueHorarioExposicionSimpleDTO;
import pucp.edu.pe.sgta.dto.TemaConAsesorJuradoDTO;
import pucp.edu.pe.sgta.mapper.BloqueHorarioExposicionMapper;
import pucp.edu.pe.sgta.model.BloqueHorarioExposicion;
import pucp.edu.pe.sgta.model.JornadaExposicion;
import pucp.edu.pe.sgta.repository.BloqueHorarioExposicionRepository;
import pucp.edu.pe.sgta.service.inter.BloqueHorarioExposicionService;

@Service
public class BloqueHorarioExposicionServiceImpl implements BloqueHorarioExposicionService {

	private final BloqueHorarioExposicionRepository bloqueHorarioExposicionRepository;

	public BloqueHorarioExposicionServiceImpl(BloqueHorarioExposicionRepository bloqueHorarioExposicionRepository) {
		this.bloqueHorarioExposicionRepository = bloqueHorarioExposicionRepository;
	}

	@Override
	public List<BloqueHorarioExposicionDto> getAll() {
		return List.of();
	}

	@Override
	public BloqueHorarioExposicionDto findById(Integer id) {
		BloqueHorarioExposicion bloqueHorarioExposicion = bloqueHorarioExposicionRepository.findById(id).orElse(null);
		if (bloqueHorarioExposicion != null) {
			return BloqueHorarioExposicionMapper.toDTO(bloqueHorarioExposicion);
		}
		return null;
	}

	@Override
	public BloqueHorarioExposicionDto create(BloqueHorarioExposicionCreateDTO dto) {
		BloqueHorarioExposicion bloqueHorarioExposicion = bloqueHorarioExposicionRepository
			.save(BloqueHorarioExposicionMapper.toEntity(dto));
		return BloqueHorarioExposicionMapper.toDTO(bloqueHorarioExposicion);
	}

	@Override
	public void update(BloqueHorarioExposicionDto dto) {

	}

	@Override
	public void delete(Integer id) {

	}

	@Override
	public List<ListBloqueHorarioExposicionSimpleDTO> listarBloquesHorarioPorExposicion(Integer exposicionId) {
		List<Object[]> results = bloqueHorarioExposicionRepository.listarBloquesHorarioPorExposicion(exposicionId);

		// Asi deberia ser :V
		// return results.stream().map(row -> new ListBloqueHorarioExposicionDTO(
		// (Integer) row[0],
		// (Integer) row[1],
		// (Integer) row[2],
		// (Boolean) row[3],
		// (Boolean) row[4],
		// OffsetDateTime.ofInstant((Instant) row[5], ZoneId.systemDefault()),
		// OffsetDateTime.ofInstant((Instant) row[6], ZoneId.systemDefault()),
		// (String) row[7]
		// )).collect(Collectors.toList());

		// solucion temporal
		DateTimeFormatter fechaFormatter = DateTimeFormatter.ofPattern("dd-MM-yyyy");
		DateTimeFormatter horaFormatter = DateTimeFormatter.ofPattern("HH:mm");

		return results.stream().map(row -> {
			OffsetDateTime inicio = OffsetDateTime.ofInstant((Instant) row[5], ZoneId.systemDefault());
			OffsetDateTime fin = OffsetDateTime.ofInstant((Instant) row[6], ZoneId.systemDefault());

			String key = inicio.format(fechaFormatter) + "|" + inicio.format(horaFormatter) + "|" + row[7];
			String range = inicio.format(horaFormatter) + " - " + fin.format(horaFormatter);
			Integer idBloque = (Integer) row[0];
			Integer idJornadaExposicionSala = (Integer) row[1];
			Boolean esBloqueReservado = (Boolean) row[3];
			Boolean esBloqueBloqueado = (Boolean) row[4];

			TemaConAsesorJuradoDTO temaConAsesorJuradoDTO = new TemaConAsesorJuradoDTO();
			temaConAsesorJuradoDTO.setId((Integer) row[8]);
			temaConAsesorJuradoDTO.setCodigo((String) row[9]);
			temaConAsesorJuradoDTO.setTitulo((String) row[10]);

			return new ListBloqueHorarioExposicionSimpleDTO(key, range, idBloque, idJornadaExposicionSala, exposicionId,
					temaConAsesorJuradoDTO, esBloqueReservado, esBloqueBloqueado);
		}).collect(Collectors.toList());
	}

	@Transactional
	@Override
	public boolean updateBloquesListFirstTime(List<ListBloqueHorarioExposicionSimpleDTO> bloquesList) {

		try {
			List<ListBloqueHorarioExposicionSimpleDTO> filtered = bloquesList.stream()
				.filter(b -> b.getExpo() != null)
				.collect(Collectors.toList());

			ObjectMapper mapper = new ObjectMapper();
			String jsonString = mapper.writeValueAsString(filtered);

			bloqueHorarioExposicionRepository.actualizarMasivo(jsonString);

			return true;
		}
		catch (JsonProcessingException e) {
			e.printStackTrace();
			return false;
		}
	}

	@Transactional
	@Override
	public boolean updateBlouqesListNextPhase(List<ListBloqueHorarioExposicionSimpleDTO> bloquesList) {

		try {

			ObjectMapper mapper = new ObjectMapper();
			String jsonString = mapper.writeValueAsString(bloquesList);

			bloqueHorarioExposicionRepository.updateBloquesExposicionNextPhase(jsonString);

			return true;
		}
		catch (JsonProcessingException e) {
			e.printStackTrace();
			return false;
		}

	}

	@Transactional
	@Override
	public boolean finishPlanning(Integer exposicionId) {

		try {
			Boolean result = bloqueHorarioExposicionRepository.finishPlanning(exposicionId);
			return Boolean.TRUE.equals(result);
		}
		catch (Exception e) {
			e.printStackTrace();
			return false;
		}
	}

	@Override
	@Transactional
	public Integer createAll(List<BloqueHorarioExposicionCreateDTO> dtos) {
		List<BloqueHorarioExposicion> entities = dtos.stream()
			.map(BloqueHorarioExposicionMapper::toEntity)
			.collect(Collectors.toList());

		List<BloqueHorarioExposicion> saved = bloqueHorarioExposicionRepository.saveAll(entities);

		return saved.size();
	}

}
