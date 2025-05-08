package pucp.edu.pe.sgta.service.imp;
import java.time.OffsetDateTime;
import org.springframework.stereotype.Service;
import pucp.edu.pe.sgta.dto.CarreraXParametroConfiguracionDto;
import pucp.edu.pe.sgta.mapper.CarreraXParametroConfiguracionMapper;
import pucp.edu.pe.sgta.mapper.ParametroConfiguracionMapper;
import pucp.edu.pe.sgta.model.CarreraXParametroConfiguracion;
import pucp.edu.pe.sgta.repository.CarreraXParametroConfiguracionRepository;
import pucp.edu.pe.sgta.service.inter.CarreraXParametroConfiguracionService;

import java.util.List;

@Service
public class CarreraXParametroConfiguracionImpl implements CarreraXParametroConfiguracionService {

	private final CarreraXParametroConfiguracionRepository carreraXParametroConfiguracionRepository;

	public CarreraXParametroConfiguracionImpl(CarreraXParametroConfiguracionRepository carreraXParametroConfiguracionRepository) {
		this.carreraXParametroConfiguracionRepository = carreraXParametroConfiguracionRepository;
	}

	@Override
	public void updateCarreraXParametroConfiguracion(CarreraXParametroConfiguracionDto carreraXParametroConfiguracionDto) {
        // Por ahora se busca por ID, pero se puede buscar por otro campo si es necesario
        CarreraXParametroConfiguracion entity = carreraXParametroConfiguracionRepository
                .findById(carreraXParametroConfiguracionDto.getId())
                .orElseThrow(() -> new RuntimeException("No se encontró la configuración con ID " + carreraXParametroConfiguracionDto.getId()));

        //Update solo del campo valor y fechaModificacion
        if (carreraXParametroConfiguracionDto.getValor() != null && entity.isActivo()) {
            entity.setValor(carreraXParametroConfiguracionDto.getValor().toString());
        }

        entity.setFechaModificacion(java.time.OffsetDateTime.now());

        carreraXParametroConfiguracionRepository.save(entity);
	}

    @Override
    public List<CarreraXParametroConfiguracionDto> getParametrosPorCarrera(Long carreraId) {
        List<CarreraXParametroConfiguracion> entidades = carreraXParametroConfiguracionRepository.findByCarreraId(carreraId);
        List<CarreraXParametroConfiguracionDto> dtos = entidades.stream()
                .map(CarreraXParametroConfiguracionMapper::toDto)
                .toList();
        return dtos;
    }


}
