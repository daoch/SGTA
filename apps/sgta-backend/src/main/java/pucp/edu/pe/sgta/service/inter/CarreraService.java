package pucp.edu.pe.sgta.service.inter;

import pucp.edu.pe.sgta.dto.CarreraDto;

import java.util.List;

public interface CarreraService {

    CarreraDto findById(Integer id);

    List<CarreraDto> getAll();

    List<CarreraDto> getAllActive();

    List<CarreraDto> getCarrerasByUsuario(Integer usuarioId);

    List<CarreraDto> listarCarrerasPorUsuario(String usuarioId);

    CarreraDto getCarreraCoordinador(String idCognito);

    CarreraDto getCarreraCoordinadaPorUsuario(Integer usuarioId);

    CarreraDto createCarrera(String usuarioCognito, CarreraDto carreraDto);

    CarreraDto updateCarrera(String usuarioCognito, CarreraDto carreraDto);

    void deleteCarrera(String usuarioCognito, Integer id);

}