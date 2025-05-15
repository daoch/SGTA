package pucp.edu.pe.sgta.service.inter;

import pucp.edu.pe.sgta.dto.CarreraDto;

import java.util.List;

public interface CarreraService {

    CarreraDto findById(Integer id);
    
    List<CarreraDto> getAll();
    
    List<CarreraDto> getAllActive();
    
    List<CarreraDto> getCarrerasByUsuario(Integer usuarioId);

    List<CarreraDto> listarCarrerasPorUsuario(Integer usuarioId);
} 