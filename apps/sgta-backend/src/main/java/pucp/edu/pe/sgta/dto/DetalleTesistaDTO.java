package pucp.edu.pe.sgta.dto;

import java.time.LocalDate;
import java.time.ZonedDateTime;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class DetalleTesistaDTO {
    // Datos del tesista
    private Integer tesistaId;
    private String nombres;
    private String primerApellido;
    private String segundoApellido;
    private String correoElectronico;
    private String nivelEstudios;
    private String codigoPucp;
    
    // Datos del tema/proyecto
    private Integer temaId;
    private String tituloTema;
    private String resumenTema;
    private String metodologia;
    private String objetivos;
    
    // Datos del área de conocimiento
    private String areaConocimiento;
    private String subAreaConocimiento;
    
    // Datos del asesor
    private String asesorNombre;
    private String asesorCorreo;
    
    // Datos del coasesor
    private String coasesorNombre;
    private String coasesorCorreo;
    
    // Datos del ciclo académico
    private Integer cicloId;
    private String cicloNombre;
    private LocalDate fechaInicioCiclo;
    private LocalDate fechaFinCiclo;
    
    // Datos de la etapa formativa
    private Integer etapaFormativaId;
    private String etapaFormativaNombre;
    
    // Fase actual
    private String faseActual;
    
    // Información del entregable actual
    private Integer entregableId;
    private String entregableNombre;
    private String entregableActividadEstado;
    private String entregableEnvioEstado;
    private ZonedDateTime entregableFechaInicio;
    private ZonedDateTime entregableFechaFin;
} 