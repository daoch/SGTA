package pucp.edu.pe.sgta.service.imp;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import pucp.edu.pe.sgta.dto.UsuarioDto;
import pucp.edu.pe.sgta.dto.UsuarioXCarreraDto;
import pucp.edu.pe.sgta.model.UsuarioXCarrera;
import pucp.edu.pe.sgta.repository.UsuarioXCarreraRepository;
import pucp.edu.pe.sgta.service.inter.UsuarioService;
import pucp.edu.pe.sgta.service.inter.UsuarioXCarreraService;

@Service
public class UsuarioXCarreraServiceImpl implements UsuarioXCarreraService {

    private final UsuarioService usuarioService;
    private final UsuarioXCarreraRepository usuarioXCarreraRepository;


    public UsuarioXCarreraServiceImpl(UsuarioXCarreraRepository usuarioXCarreraRepository, UsuarioService usuarioService) {
        this.usuarioXCarreraRepository = usuarioXCarreraRepository;
        this.usuarioService = usuarioService;
    }

    @Override
    public UsuarioXCarrera getCarreraPrincipalCoordinador(String coordinadorId) {
        UsuarioDto usuarioDto = usuarioService.findByCognitoId(coordinadorId);
        Integer usuarioId = usuarioDto.getId();
        return usuarioXCarreraRepository.getCarreraPrincipalCoordinador(usuarioId);
    }
}
