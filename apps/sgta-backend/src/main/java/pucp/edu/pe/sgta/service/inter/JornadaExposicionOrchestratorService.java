package pucp.edu.pe.sgta.service.inter;

import org.springframework.http.ResponseEntity;

import pucp.edu.pe.sgta.dto.IniatilizeJornadasExposicionCreateDTO;

public interface JornadaExposicionOrchestratorService {
    public ResponseEntity<?> initializeJornadasExposicion(IniatilizeJornadasExposicionCreateDTO dto);
}