package pucp.edu.pe.sgta.service.imp;

import org.springframework.stereotype.Service;
import pucp.edu.pe.sgta.model.TipoRechazoTema;
import pucp.edu.pe.sgta.repository.TemaRepository;
import pucp.edu.pe.sgta.repository.TipoRechazoTemaRepository;
import pucp.edu.pe.sgta.service.inter.TipoRechazoTemaService;

import java.util.List;

@Service
public class TipoRechazoTemaImpl implements TipoRechazoTemaService {

    private final TipoRechazoTemaRepository tipoRechazoTemaRepository;
    TipoRechazoTemaService tipoRechazoTemaService;

    public TipoRechazoTemaImpl(TipoRechazoTemaRepository tipoRechazoTemaRepository) {
        this.tipoRechazoTemaRepository = tipoRechazoTemaRepository;
    }

    @Override
    public List<TipoRechazoTema> listarTodos(){
        return tipoRechazoTemaRepository.findAll();
    }

}
