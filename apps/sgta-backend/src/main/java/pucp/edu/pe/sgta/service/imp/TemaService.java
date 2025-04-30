package pucp.edu.pe.sgta.service.imp;


import org.springframework.stereotype.Service;
import pucp.edu.pe.sgta.model.Tema;
import pucp.edu.pe.sgta.repository.TemaRepository;

import java.util.List;

@Service
public class TemaService {
    private final TemaRepository temaRepository;

    public TemaService(TemaRepository temaRepository) {
        this.temaRepository = temaRepository;
    }

    public List<Tema> getAllTemas() {
        return temaRepository.findAll();
    }
}