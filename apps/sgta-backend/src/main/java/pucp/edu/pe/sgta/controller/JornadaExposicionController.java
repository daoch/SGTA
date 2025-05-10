package pucp.edu.pe.sgta.controller;

import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import pucp.edu.pe.sgta.dto.IniatilizeJornadasExposicionCreateDTO;
import pucp.edu.pe.sgta.dto.JornadaExposicionCreateDTO;
import pucp.edu.pe.sgta.service.inter.JornadaExposicionService;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;


@RestController
@RequestMapping("/jornada-exposicion")
public class JornadaExposicionController {

    @Autowired
    private JornadaExposicionService jornadaExposicionService;

    @PostMapping("/initialize")
    public ResponseEntity<Void> initializeJornadasExposicion(@RequestBody IniatilizeJornadasExposicionCreateDTO dto) {
        
        dto.getFechas().forEach(fecha -> {
            JornadaExposicionCreateDTO createDTO = new JornadaExposicionCreateDTO();
            createDTO.setDatetimeInicio(fecha.getFechaHoraInicio());
            createDTO.setDatetimeFin(fecha.getFechaHoraFin());
            createDTO.setExposicionId(dto.getExposicionId());
            jornadaExposicionService.create(createDTO);
        });


        return ResponseEntity.ok().build();
    }
}

