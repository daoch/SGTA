package pucp.edu.pe.sgta.service.inter;

import org.springframework.stereotype.Service;
import pucp.edu.pe.sgta.model.TipoRechazoTema;

import java.util.List;

@Service
public interface TipoRechazoTemaService {

    List<TipoRechazoTema> listarTodos();

}
