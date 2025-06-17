package pucp.edu.pe.sgta.controller;

import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.oauth2.jwt.Jwt;
import pucp.edu.pe.sgta.dto.asesores.CrearSolicitudCeseRequest;
import pucp.edu.pe.sgta.dto.asesores.SolicitudCeseCreadaDto;
import pucp.edu.pe.sgta.exception.BusinessRuleException;
import pucp.edu.pe.sgta.exception.ResourceNotFoundException;
import pucp.edu.pe.sgta.model.Solicitud; // Asume que tienes un DTO de respuesta o devuelves la entidad
import pucp.edu.pe.sgta.service.inter.SolicitudCoordinadorService; // Un nuevo servicio específico
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication; // Para obtener el usuario autenticado
import org.springframework.web.bind.annotation.*;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

@RestController
@RequestMapping("/asesor/solicitudes-cese") // Ruta API para acciones de cese del asesor
public class SolicitudCeseController {

    private static final Logger log = LoggerFactory.getLogger(SolicitudCeseController.class);

    @Autowired
    private SolicitudCoordinadorService solicitudAsesorService;

    @PostMapping
    public ResponseEntity<?> crearSolicitudDeCese(
            @AuthenticationPrincipal Jwt jwt, // Obtener el JWT del asesor autenticado
            @Valid @RequestBody CrearSolicitudCeseRequest request
    ) {
        if (jwt == null) {
            // log.warn("Intento de crear solicitud de cese sin autenticación (JWT nulo).");
            // return new ResponseEntity<>("Acceso no autorizado. Se requiere autenticación.", HttpStatus.UNAUTHORIZED);
        }

        String asesorCognitoSub = "01fb0510-80e1-7076-5ef5-c1b5a02fb4f2"; // El 'sub' claim del JWT usualmente es el ID de usuario de Cognito
        if (asesorCognitoSub == null || asesorCognitoSub.trim().isEmpty()) {
            log.error("El token JWT no contiene el claim 'sub' (Cognito Subject ID).");
            return new ResponseEntity<>("Error de autenticación: identificador de usuario no encontrado en el token.", HttpStatus.UNAUTHORIZED);
        }

        log.info("Asesor CognitoSub {} iniciando creación de solicitud de cese para tema ID: {}", asesorCognitoSub, request.getTemaId());

        try {
            Solicitud nuevaSolicitudEntidad = solicitudAsesorService.crearSolicitudCese(
                    asesorCognitoSub,
                    request.getTemaId(),
                    request.getMotivo()
            );

            // Mapear la entidad Solicitud al DTO SolicitudCeseCreadaDto
            SolicitudCeseCreadaDto responseDto = mapToSolicitudCeseCreadaDto(nuevaSolicitudEntidad);

            return new ResponseEntity<>(responseDto, HttpStatus.CREATED);

        } catch (ResourceNotFoundException e) {
            log.warn("No se pudo crear la solicitud de cese debido a recurso no encontrado: {}", e.getMessage());
            return new ResponseEntity<>(e.getMessage(), HttpStatus.NOT_FOUND);
        } catch (BusinessRuleException e) {
            log.warn("No se pudo crear la solicitud de cese debido a violación de regla de negocio: {}", e.getMessage());
            return new ResponseEntity<>(e.getMessage(), HttpStatus.BAD_REQUEST); // O HttpStatus.CONFLICT si es por duplicado
        } catch (Exception e) {
            log.error("Error inesperado al crear solicitud de cese para asesor {}: {}", asesorCognitoSub, e.getMessage(), e);
            return new ResponseEntity<>("Ocurrió un error interno al procesar la solicitud.", HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    // Método de mapeo (puede estar aquí o en una clase Mapper dedicada)
    private SolicitudCeseCreadaDto mapToSolicitudCeseCreadaDto(Solicitud solicitud) {
        if (solicitud == null) return null;

        SolicitudCeseCreadaDto dto = new SolicitudCeseCreadaDto();
        dto.setId(solicitud.getId());
        dto.setDescripcionMotivo(solicitud.getDescripcion()); // El motivo que el asesor envió

        if (solicitud.getTema() != null) {
            // Asegurarse de que tema está inicializado si es LAZY y no lo fue en el servicio
            // Hibernate.initialize(solicitud.getTema()); // No necesario si el servicio ya lo hizo o si es EAGER
            dto.setTemaId(solicitud.getTema().getId());
            dto.setTemaTitulo(solicitud.getTema().getTitulo());
        }

        if (solicitud.getEstadoSolicitud() != null) {
            // Hibernate.initialize(solicitud.getEstadoSolicitud()); // Igual que arriba
            dto.setEstadoSolicitudNombre(solicitud.getEstadoSolicitud().getNombre());
        } else if (solicitud.getEstado() != null) { // Fallback al campo antiguo si el nuevo es null
            switch (solicitud.getEstado()) { // Mapear el entero a un string legible
                case 0: dto.setEstadoSolicitudNombre("APROBADA"); break; // O el string que uses
                case 1: dto.setEstadoSolicitudNombre("PENDIENTE"); break;
                case 2: dto.setEstadoSolicitudNombre("RECHAZADA"); break;
                default: dto.setEstadoSolicitudNombre("DESCONOCIDO");
            }
        }
        dto.setFechaCreacion(solicitud.getFechaCreacion());
        return dto;
    }
}