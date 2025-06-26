package pucp.edu.pe.sgta.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.ParameterizedTypeReference;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpMethod;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import org.springframework.web.client.RestTemplate;
import org.springframework.web.server.ResponseStatusException;
import pucp.edu.pe.sgta.dto.AsignacionBloqueDTO;
import pucp.edu.pe.sgta.dto.BloquesNextPhaseRequest;
import pucp.edu.pe.sgta.dto.DistribucionRequestDTO;
import pucp.edu.pe.sgta.dto.ListBloqueHorarioExposicionSimpleDTO;
import pucp.edu.pe.sgta.service.inter.BloqueHorarioExposicionService;
import pucp.edu.pe.sgta.util.ResponseMessage;

@RestController
@RequestMapping("/bloqueHorarioExposicion")
public class BloqueHorarioExposicionController {
    @Autowired
    private BloqueHorarioExposicionService bloqueHorarioExposicionService;

    @Autowired
    private RestTemplate restTemplate;

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
    public ResponseEntity<ResponseMessage> updateBloquesNextPhase(@RequestBody BloquesNextPhaseRequest request) {
        try {
            List<ListBloqueHorarioExposicionSimpleDTO> bloquesList = request.getBloquesList();
            Integer exposicion = request.getExposicion();
            Integer origen = request.getOrigen();
            boolean updateSuccessful = bloqueHorarioExposicionService.updateBlouqesListNextPhase(bloquesList,exposicion,origen);

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

    @PostMapping("/algoritmoDistribucion")
    public List<ListBloqueHorarioExposicionSimpleDTO> algoritmoDistribucion(
            @RequestBody DistribucionRequestDTO request) {


        int cantidadTemas = request.getTemas().size();
        int cantidadBloques = request.getBloques().size();

        if (cantidadTemas > cantidadBloques) {
            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST,
                    "Hay más temas que bloques disponibles (" + cantidadTemas + " temas vs " + cantidadBloques + " bloques)"
            );
        }

        String url = "http://localhost:8000/asignar";


        ResponseEntity<List<AsignacionBloqueDTO>> response = restTemplate.exchange(
                url,
                HttpMethod.POST,
                new HttpEntity<>(request),
                new ParameterizedTypeReference<List<AsignacionBloqueDTO>>() {}
        );


        if (response.getStatusCode().is2xxSuccessful()) {
            return bloqueHorarioExposicionService.asignarTemasBloques(response.getBody(),request);
        } else {
            throw new RuntimeException("Error en el microservicio: " + response.getStatusCode());
        }
    }


    @PatchMapping("/finishPlanning/{idExposicion}")
    public ResponseEntity<ResponseMessage> finishPlanning(@PathVariable("idExposicion")  Integer idExposicion) {
        try {

            boolean updateSuccessful = bloqueHorarioExposicionService.finishPlanning(idExposicion);


            if (updateSuccessful) {

                return ResponseEntity.ok(new ResponseMessage(true, "Planificacion terminada"));
            } else {

                return ResponseEntity.status(HttpStatus.PARTIAL_CONTENT)
                        .body(new ResponseMessage(false, "No se pudo terminar la planifcacion"));
            }
        } catch (Exception e) {
            // Si ocurre una excepción inesperada
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(new ResponseMessage(false, "Error al terminar la planificacion"));
        }
    }

    @PatchMapping("/bloquearBloque/{idBloque}")
    public ResponseEntity<ResponseMessage>bloquearBloque (@PathVariable("idBloque")  Integer idBloque) {
        int bloqueBloqueado = bloqueHorarioExposicionService.bloquearBloque(idBloque);

        if(bloqueBloqueado == 1){
            return ResponseEntity.ok(new ResponseMessage(true, "Bloqueado"));
        }
        else{
            return  ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(new ResponseMessage(false, "No se pudo bloquear la bloque"));
        }
    }

    @PatchMapping("/desbloquearBloque/{idBloque}")
    public ResponseEntity<ResponseMessage>desbloquearBloque (@PathVariable("idBloque")  Integer idBloque) {
        int bloqueBloqueado = bloqueHorarioExposicionService.desbloquearBloque(idBloque);

        if(bloqueBloqueado == 1){
            return ResponseEntity.ok(new ResponseMessage(true, "Bloqueado"));
        }
        else{
            return  ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(new ResponseMessage(false, "No se pudo bloquear el bloque"));
        }
    }

    @PostMapping("/crear-eventos-calendar/{idExposicion}")
    public void crearReunionesZoom(@PathVariable("idExposicion") Integer idExposicion) {
        bloqueHorarioExposicionService.crearReunionesZoom(idExposicion);
    }
}
