package pucp.edu.pe.sgta.service.imp;

import java.sql.Timestamp;
import java.time.Instant;
import java.util.ArrayList;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import pucp.edu.pe.sgta.dto.JornadaExposicionXSalaExposicionCreateDTO;
import pucp.edu.pe.sgta.dto.JornadaExposicionXSalaExposicionDto;
import pucp.edu.pe.sgta.dto.JornadaExposicionXSalaExposicionListadoDTO;
import pucp.edu.pe.sgta.dto.SalaExposicionJornadaDTO;
import pucp.edu.pe.sgta.mapper.JornadaExposicionXSalaExposicionMapper;
import pucp.edu.pe.sgta.model.JornadaExposicionXSalaExposicion;
import pucp.edu.pe.sgta.repository.JornadaExposicionXSalaExposicionRepository;
import pucp.edu.pe.sgta.service.inter.JornadaExposicionXSalaExposicionService;

@Service
public class JornadaExposicionXSalaExposicionServiceImpl implements JornadaExposicionXSalaExposicionService {

	@Autowired
	JornadaExposicionXSalaExposicionRepository jornadaExposicionXSalaExposicionRepository;

	public JornadaExposicionXSalaExposicionServiceImpl(
			JornadaExposicionXSalaExposicionRepository jornadaExposicionXSalaExposicionRepository) {
		this.jornadaExposicionXSalaExposicionRepository = jornadaExposicionXSalaExposicionRepository;
	}

	@Override
	public List<JornadaExposicionXSalaExposicionDto> getAll() {
		return List.of();
	}

	@Override
	public JornadaExposicionXSalaExposicionDto findById(Integer id) {
		JornadaExposicionXSalaExposicion jornadaExposicionXSalaExposicion = jornadaExposicionXSalaExposicionRepository
			.findById(id)
			.orElse(null);
		if (jornadaExposicionXSalaExposicion != null) {
			return JornadaExposicionXSalaExposicionMapper.toDto(jornadaExposicionXSalaExposicion);
		}
		return null;
	}

	@Override
	public JornadaExposicionXSalaExposicionDto create(JornadaExposicionXSalaExposicionCreateDTO dto) {
		JornadaExposicionXSalaExposicion jese = jornadaExposicionXSalaExposicionRepository
			.save(JornadaExposicionXSalaExposicionMapper.toEntity(dto));
		return JornadaExposicionXSalaExposicionMapper.toDto(jese);
	}

	@Override
	public void update(JornadaExposicionXSalaExposicionDto dto) {

	}

	@Override
	public void delete(Integer id) {

	}

	@Override
	public List<JornadaExposicionXSalaExposicionListadoDTO> listarJornadasExposicionSalas(Integer exposicionId) {
		List<Object[]> objects = jornadaExposicionXSalaExposicionRepository.listarJornadasExposicionSalas(exposicionId);

		Map<Integer, JornadaExposicionXSalaExposicionListadoDTO> mapaJornadas = new LinkedHashMap<>();

		for (Object[] obj : objects) {
			Integer jornadaId = (Integer) obj[0];

			// Verificar si ya existe la jornada en el mapa
			JornadaExposicionXSalaExposicionListadoDTO jornadaDTO = mapaJornadas.get(jornadaId);
			if (jornadaDTO == null) {
				jornadaDTO = new JornadaExposicionXSalaExposicionListadoDTO();
				jornadaDTO.setJornadaExposicionId(jornadaId);
				jornadaDTO.setDatetimeInicio(Timestamp.from((Instant) obj[1]));
				jornadaDTO.setDatetimeFin(Timestamp.from((Instant) obj[2]));
				jornadaDTO.setSalasExposicion(new ArrayList<>()); // Importante
																	// inicializar la
																	// lista

				mapaJornadas.put(jornadaId, jornadaDTO);
			}

			// Si la sala es distinta de null, agregarla
			if (obj[4] != null) {
				SalaExposicionJornadaDTO sala = new SalaExposicionJornadaDTO();
				sala.setId((Integer) obj[3]);
				sala.setNombre((String) obj[4]);

				jornadaDTO.getSalasExposicion().add(sala);
			}
		}

		return new ArrayList<>(mapaJornadas.values());
	}

}
