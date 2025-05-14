package pucp.edu.pe.sgta.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import pucp.edu.pe.sgta.dto.ListBloqueHorarioExposicionSimpleDTO;
import pucp.edu.pe.sgta.service.inter.BloqueHorarioExposicionService;
import pucp.edu.pe.sgta.util.ResponseMessage;

@RestController
@RequestMapping("/bloqueHorarioExposicion")
public class BloqueHorarioExposicionController {
    @Autowired
    private BloqueHorarioExposicionService bloqueHorarioExposicionService;

    @GetMapping("/listarBloquesHorarioExposicionByExposicion/{exposicionId}")
    public List<ListBloqueHorarioExposicionSimpleDTO> listarBloquesHorarioExposicionByExposicion(@PathVariable("exposicionId") Integer exposicionId) {
        return bloqueHorarioExposicionService.listarBloquesHorarioPorExposicion(exposicionId);
    }

    @PatchMapping ("/updateBloquesListFirstTime")
    public ResponseEntity<ResponseMessage> updateBloquesListFirstTime(@RequestBody List<ListBloqueHorarioExposicionSimpleDTO> bloquesList) {
        try {

            boolean updateSuccessful = bloqueHorarioExposicionService.updateBloquesListFirstTime(bloquesList);

            if (updateSuccessful) {

                return ResponseEntity.ok(new ResponseMessage(true, "Bloques actualizados correctamente"));
            } else {

                return ResponseEntity.status(HttpStatus.PARTIAL_CONTENT)
                        .body(new ResponseMessage(false, "Actualización parcial o fallida"));
            }
        } catch (Exception e) {
            // Si ocurre una excepción inesperada
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(new ResponseMessage(false, "Error inesperado al actualizar bloques"));
        }
    }

    @PatchMapping ("/updateBloquesListNextPhase")
    public ResponseEntity<ResponseMessage> updateBloquesNextPhase(@RequestBody List<ListBloqueHorarioExposicionSimpleDTO> bloquesList) {
        try {
            int cantExpos=0;
            int cantReservados=0;
            int cantLibres =0;
            for(ListBloqueHorarioExposicionSimpleDTO bloque : bloquesList) {
                if(bloque.getExpo() != null){
                    cantExpos++;
                }
                if(bloque.getEsBloqueReservado()){
                    cantReservados++;
                }
                else{
                    cantLibres++;
                }
            }
            boolean updateSuccessful = bloqueHorarioExposicionService.updateBlouqesListNextPhase(bloquesList);

            if (updateSuccessful) {

                return ResponseEntity.ok(new ResponseMessage(true, "Bloques actualizados correctamente"));
            } else {

                return ResponseEntity.status(HttpStatus.PARTIAL_CONTENT)
                        .body(new ResponseMessage(false, "Actualización parcial o fallida"));
            }
        } catch (Exception e) {
            // Si ocurre una excepción inesperada
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(new ResponseMessage(false, "Error inesperado al actualizar bloques"));
        }
    }
}
