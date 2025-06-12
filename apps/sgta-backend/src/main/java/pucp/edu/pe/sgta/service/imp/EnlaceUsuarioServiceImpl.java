package pucp.edu.pe.sgta.service.imp;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import pucp.edu.pe.sgta.dto.asesores.EnlaceUsuarioDto;
import pucp.edu.pe.sgta.model.EnlaceUsuario;
import pucp.edu.pe.sgta.repository.EnlaceUsuarioRepository;

import java.util.ArrayList;
import java.util.List;

@Service
public class EnlaceUsuarioServiceImpl {
    @Autowired
    EnlaceUsuarioRepository enlaceUsuarioRepository;

    public List<EnlaceUsuarioDto> listarParaPerfilPorUsuario(Integer idUsuario) {
        List<Object[]> queryResult = enlaceUsuarioRepository.listarEnlacesParaPerfilPorUsuario(idUsuario);
        List<EnlaceUsuarioDto> enlaceUsuarios = new ArrayList<>();
        for (Object[] o : queryResult) {
            EnlaceUsuarioDto enlaceUsuario = EnlaceUsuarioDto.fromQuery(o);
            enlaceUsuarios.add(enlaceUsuario);
        }
        return enlaceUsuarios;
    }
}
