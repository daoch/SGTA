package pucp.edu.pe.sgta.service.inter;

import java.util.List;

import pucp.edu.pe.sgta.dto.EstadoPlanificacionDto;

public interface EstadoPlanificacionService {

	List<EstadoPlanificacionDto> getAll();

	EstadoPlanificacionDto findById(Integer id);

	void create(EstadoPlanificacionDto dto);

	void update(EstadoPlanificacionDto dto);

	void delete(Integer id);

	EstadoPlanificacionDto getByIdExposicion(Integer id);

}
