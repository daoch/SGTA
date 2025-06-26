package pucp.edu.pe.sgta.service.imp;

import jakarta.transaction.Transactional;
import org.springframework.stereotype.Service;
import pucp.edu.pe.sgta.dto.ControlExposicionUsuarioTemaDto;
import pucp.edu.pe.sgta.mapper.ControlExposicionUsuarioTemaMapper;
import pucp.edu.pe.sgta.model.ControlExposicionUsuarioTema;
import pucp.edu.pe.sgta.repository.ControlExposicionUsuarioTemaRepository;
import pucp.edu.pe.sgta.service.inter.ControlExposicionUsuarioTemaService;

import java.util.List;

@Service
public class ControlExposicionUsuarioTemaServiceImpl implements ControlExposicionUsuarioTemaService {

    private final ControlExposicionUsuarioTemaRepository controlExposicionUsuarioTemaRepository;

    public ControlExposicionUsuarioTemaServiceImpl(
            ControlExposicionUsuarioTemaRepository controlExposicionUsuarioTemaRepository) {
        this.controlExposicionUsuarioTemaRepository = controlExposicionUsuarioTemaRepository;
    }

    @Override
    public List<ControlExposicionUsuarioTemaDto> getAll() {
        return List.of();
    }

    @Override
    public ControlExposicionUsuarioTemaDto findById(Integer id) {
        ControlExposicionUsuarioTema controlExposicionUsuarioTema = controlExposicionUsuarioTemaRepository.findById(id)
                .orElse(null);
        if (controlExposicionUsuarioTema != null) {
            return ControlExposicionUsuarioTemaMapper.toDto(controlExposicionUsuarioTema);
        }
        return null;
    }

    @Override
    public void create(ControlExposicionUsuarioTemaDto dto) {

    }

    @Override
    public void update(ControlExposicionUsuarioTemaDto dto) {

    }

    @Override
    public void delete(Integer id) {

    }

    @Override
    public void updateEstadoRespuestaExposicion(Integer exposicionId, Integer temaId) {
        try{
            controlExposicionUsuarioTemaRepository.updateEstadoRespuestaExposicion(exposicionId,temaId);

        }
        catch(Exception e){
            e.printStackTrace();
        }
    }

    @Override
    @Transactional
    public void aceptarExposicionDesdeCorreo(String token) {
        controlExposicionUsuarioTemaRepository.aceptarInvitacionCorreo(token);
    }

    @Override
    @Transactional
    public void rechazarExposicionDesdeCorreo(String token) {
        controlExposicionUsuarioTemaRepository.rechazarInvitacionCorreo(token);
    }

}
