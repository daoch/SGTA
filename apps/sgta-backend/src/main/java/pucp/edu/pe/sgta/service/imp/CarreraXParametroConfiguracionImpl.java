package pucp.edu.pe.sgta.service.imp;

import org.springframework.stereotype.Service;
import pucp.edu.pe.sgta.dto.CarreraXParametroConfiguracionDto;
import pucp.edu.pe.sgta.mapper.CarreraXParametroConfiguracionMapper;
import pucp.edu.pe.sgta.model.CarreraXParametroConfiguracion;
import pucp.edu.pe.sgta.repository.CarreraXParametroConfiguracionRepository;
import pucp.edu.pe.sgta.service.inter.CarreraXParametroConfiguracionService;
import pucp.edu.pe.sgta.service.inter.UsuarioService;
import pucp.edu.pe.sgta.dto.UsuarioDto;
import pucp.edu.pe.sgta.model.Carrera;
import pucp.edu.pe.sgta.repository.CarreraRepository;
import org.springframework.beans.factory.annotation.Autowired;

import java.util.List;

@Service
public class CarreraXParametroConfiguracionImpl implements CarreraXParametroConfiguracionService {

    private final CarreraXParametroConfiguracionRepository carreraXParametroConfiguracionRepository;
    private final CarreraRepository carreraRepository;

    @Autowired
    private UsuarioService usuarioService;

    public CarreraXParametroConfiguracionImpl(
            CarreraXParametroConfiguracionRepository carreraXParametroConfiguracionRepository, 
            UsuarioService usuarioService,
            CarreraRepository carreraRepository) {
        this.carreraXParametroConfiguracionRepository = carreraXParametroConfiguracionRepository;
        this.usuarioService = usuarioService;
        this.carreraRepository = carreraRepository;
    }

    @Override
    public void updateCarreraXParametroConfiguracion(
            CarreraXParametroConfiguracionDto carreraXParametroConfiguracionDto) {
        // Por ahora se busca por ID, pero se puede buscar por otro campo si es
        // necesario
        CarreraXParametroConfiguracion entity = carreraXParametroConfiguracionRepository
                .findById(carreraXParametroConfiguracionDto.getId())
                .orElseThrow(() -> new RuntimeException(
                        "No se encontró la configuración con ID " + carreraXParametroConfiguracionDto.getId()));

        // Update solo del campo valor y fechaModificacion
        if (carreraXParametroConfiguracionDto.getValor() != null && entity.getActivo()) {
            entity.setValor(carreraXParametroConfiguracionDto.getValor().toString());
        }

        entity.setFechaModificacion(java.time.OffsetDateTime.now());

        carreraXParametroConfiguracionRepository.save(entity);
    }

    @Override
    public List<CarreraXParametroConfiguracionDto> getParametrosPorCarrera(String idCognito) {
        UsuarioDto usuario = usuarioService.findByCognitoId(idCognito);
        if (usuario == null) {
            throw new RuntimeException("Usuario no encontrado con ID Cognito: " + idCognito);
        }
        
       List<Object[]> results = carreraRepository.obtenerCarreraCoordinador(usuario.getId());
       if (results != null && !results.isEmpty()) {
            Object[] result = results.get(0);
            if (result != null) {
                Carrera carrera = new Carrera();
                carrera.setId((Integer) result[0]);
                carrera.setNombre((String) result[1]);
                Integer carreraId = carrera.getId();
                List<CarreraXParametroConfiguracion> entidades = carreraXParametroConfiguracionRepository
                    .findByCarreraId(Long.valueOf(carreraId));
                List<CarreraXParametroConfiguracionDto> dtos = entidades.stream()
                        .map(CarreraXParametroConfiguracionMapper::toDto)
                        .toList();
                return dtos;
            } else {
                throw new RuntimeException("No se encontró la carrera para el usuario con id: " + usuario.getId());
            }
        
       }
        return List.of(); // Retorna una lista vacía si no se encuentra la carrera
    }

}
