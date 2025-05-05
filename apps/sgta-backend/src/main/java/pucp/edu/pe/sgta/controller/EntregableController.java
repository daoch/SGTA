package pucp.edu.pe.sgta.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import pucp.edu.pe.sgta.dto.EntregableDto;
import pucp.edu.pe.sgta.service.inter.EntregableService;

import java.util.List;

@RestController
@RequestMapping("/entregables")

public class EntregableController {
    @Autowired
    EntregableService entregableService;


//    @GetMapping("/findByEtapaFormativa") // Obtiene la lista de entregables por EtapaFormativa
//    public List<EntregableDto> findByEtapaFormativa(@RequestParam(name = "idEtapaFormativa") Integer idEtapaFormativa) {
//        return entregableService.findByEtapaFormativa(idEtapaFormativa);
//    }
//
//    @GetMapping("/findById") // Muestra el detalle de un entregable por su ID
//    public EntregableDto findById(@RequestParam(name = "idEntregable") Integer idEntregable) {
//        return entregableService.findById(idEntregable);
//    }
    @GetMapping("/getAll") // Obtiene la lista de entregables
    public List<EntregableDto> getAll() {
        return entregableService.getAll();
    }
}
