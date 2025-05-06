package pucp.edu.pe.sgta.service.imp;

import org.springframework.stereotype.Service;
import pucp.edu.pe.sgta.dto.AreaConocimientoDto;
import pucp.edu.pe.sgta.mapper.AreaConocimientoMapper;
import pucp.edu.pe.sgta.model.AreaConocimiento;
import pucp.edu.pe.sgta.repository.AreaConocimientoRepository;
import pucp.edu.pe.sgta.service.inter.AreaConocimientoService;
import pucp.edu.pe.sgta.model.Carrera;
import java.util.List;

@Service
public class AreaConocimientoImpl implements AreaConocimientoService {

	private final AreaConocimientoRepository areaConocimientoRepository;

	public AreaConocimientoImpl(AreaConocimientoRepository areaConocimientoRepository) {
		this.areaConocimientoRepository = areaConocimientoRepository;
	}

	//create
    @Override
    public AreaConocimientoDto create(AreaConocimientoDto dto) {
        if(dto.getIdCarrera() == null) {
            throw new IllegalArgumentException("El id de la carrera no puede ser nulo");
        }
        //fecha Creacion
        dto.setFechaCreacion(java.time.OffsetDateTime.now());
        Carrera carrera = new Carrera();
        carrera.setId(dto.getIdCarrera());
        AreaConocimiento areaConocimiento = AreaConocimientoMapper.toEntity(dto);
        areaConocimiento.setCarrera(carrera);
        AreaConocimiento savedArea = areaConocimientoRepository.save(areaConocimiento);
        
        return AreaConocimientoMapper.toDto(savedArea);
    }


    @Override
    public void update(AreaConocimientoDto dto) {
        
    }

    @Override
    public void delete(Integer id) {
        AreaConocimiento areaConocimiento = areaConocimientoRepository.findById(id).orElse(null);
        if (areaConocimiento != null) {
            areaConocimiento.setActivo(false);
            areaConocimientoRepository.save(areaConocimiento);
        }
    }

    @Override
    public List<AreaConocimientoDto> getAll() {
        List<AreaConocimiento> areasConocimiento = areaConocimientoRepository.findAllByActivoTrue();
        List<AreaConocimientoDto> dtos = areasConocimiento.stream()
                .map(AreaConocimientoMapper::toDto)
                .toList();
        return dtos;
    }

    @Override
    public List<AreaConocimientoDto> getAllByCarrera(Integer idCarrera) {
        List<AreaConocimiento> areasConocimiento = areaConocimientoRepository.findAllByCarreraIdAndActivoTrue(idCarrera);
        List<AreaConocimientoDto> dtos = areasConocimiento.stream()
                .map(AreaConocimientoMapper::toDto)
                .toList();
        return dtos;
    }

    

}
